import { Injectable, PLATFORM_ID, inject, signal } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { firstValueFrom, timeout } from 'rxjs';
import { environment } from '../../../environments/environment';

export type ApiWakeStatus = 'idle' | 'waking' | 'ready' | 'degraded';

/**
 * Wakes the Render free-tier API (+ Postgres) by polling health endpoints.
 * Startup seeders on the API already run when the process boots.
 */
@Injectable({ providedIn: 'root' })
export class ApiWakeService {
  private readonly http = inject(HttpClient);
  private readonly platformId = inject(PLATFORM_ID);

  readonly status = signal<ApiWakeStatus>('idle');
  /** User-facing phase for the boot/loader UI. */
  readonly phase = signal<'connecting' | 'database' | 'ready' | 'timeout'>('connecting');

  private wakePromise: Promise<boolean> | null = null;

  private get baseUrl(): string {
    return isPlatformBrowser(this.platformId)
      ? environment.apiBaseUrl
      : environment.ssrApiBaseUrl;
  }

  /** Idempotent: concurrent callers share one wake sequence. */
  ensureAwake(): Promise<boolean> {
    if (!isPlatformBrowser(this.platformId)) {
      return Promise.resolve(true);
    }
    if (this.status() === 'ready') {
      return Promise.resolve(true);
    }
    this.wakePromise ??= this.pollUntilReady();
    return this.wakePromise;
  }

  private async pollUntilReady(): Promise<boolean> {
    this.status.set('waking');
    this.phase.set('connecting');

    const maxAttempts = 45; // ~2–3 minutes with backoff (Render cold starts can be slow)
    let apiUp = false;

    for (let attempt = 0; attempt < maxAttempts; attempt++) {
      if (!apiUp) {
        apiUp = await this.ping('/health');
        if (apiUp) {
          this.phase.set('database');
        }
      }

      if (apiUp) {
        const dbReady = await this.ping('/health/ready');
        if (dbReady) {
          this.status.set('ready');
          this.phase.set('ready');
          return true;
        }
      }

      await this.delay(this.backoffMs(attempt));
    }

    // Don't block the site forever — show content; API calls may still retry.
    this.status.set('degraded');
    this.phase.set('timeout');
    return false;
  }

  private async ping(path: string): Promise<boolean> {
    try {
      const url = `${this.baseUrl}${path}`;
      await firstValueFrom(
        this.http.get(url, {
          responseType: 'text',
          observe: 'response',
        }).pipe(timeout(12_000)),
      );
      return true;
    } catch {
      return false;
    }
  }

  private backoffMs(attempt: number): number {
    return Math.min(1500 + attempt * 200, 4000);
  }

  private delay(ms: number): Promise<void> {
    return new Promise((resolve) => setTimeout(resolve, ms));
  }
}
