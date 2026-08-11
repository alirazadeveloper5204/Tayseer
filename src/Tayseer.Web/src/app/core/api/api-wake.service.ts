import { Injectable, PLATFORM_ID, inject, signal } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { firstValueFrom, timeout } from 'rxjs';
import { environment } from '../../../environments/environment';

export type ApiWakeStatus = 'idle' | 'waking' | 'ready' | 'degraded';

/**
 * Wakes the Render free-tier API (+ Postgres).
 *
 * Free dynos only wake on **public** inbound HTTP — private-network URLs do not count.
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

    const maxAttempts = 40; // ~3+ minutes with long server-side wake attempts
    let apiUp = false;

    for (let attempt = 0; attempt < maxAttempts; attempt++) {
      // Fire-and-forget public nudge (no-cors) so Render sees inbound traffic even if proxy is misconfigured.
      this.nudgePublicApi();

      const wake = await this.pingWakeEndpoint();
      if (wake.ok) {
        apiUp = true;
        this.phase.set('database');
        if (wake.ready) {
          this.status.set('ready');
          this.phase.set('ready');
          return true;
        }
      }

      if (!apiUp) {
        apiUp = await this.pingSameOrigin('/health');
        if (apiUp) {
          this.phase.set('database');
        }
      }

      if (apiUp) {
        const dbReady = await this.pingSameOrigin('/health/ready');
        if (dbReady) {
          this.status.set('ready');
          this.phase.set('ready');
          return true;
        }
      }

      await this.delay(this.backoffMs(attempt));
    }

    this.status.set('degraded');
    this.phase.set('timeout');
    return false;
  }

  /**
   * Node SSR holds a long fetch to the public API URL (bypasses browser CORS + short proxy aborts).
   */
  private async pingWakeEndpoint(): Promise<{ ok: boolean; ready: boolean }> {
    try {
      const res = await firstValueFrom(
        this.http
          .get<{ ok?: boolean; ready?: boolean }>('/__wake-api', {
            observe: 'response',
          })
          .pipe(timeout(95_000)),
      );
      const body = res.body;
      return {
        ok: !!body?.ok || res.status === 200,
        ready: !!body?.ready,
      };
    } catch {
      return { ok: false, ready: false };
    }
  }

  private nudgePublicApi(): void {
    const origin = environment.apiPublicWakeUrl?.replace(/\/$/, '');
    if (!origin) {
      return;
    }
    // mode:no-cors — response is opaque; request still reaches Render and starts spin-up.
    void fetch(`${origin}/health`, { mode: 'no-cors', cache: 'no-store' }).catch(() => undefined);
    void fetch(`${origin}/health/ready`, { mode: 'no-cors', cache: 'no-store' }).catch(
      () => undefined,
    );
  }

  private async pingSameOrigin(path: string): Promise<boolean> {
    try {
      await firstValueFrom(
        this.http
          .get(path, {
            responseType: 'text',
            observe: 'response',
          })
          .pipe(timeout(20_000)),
      );
      return true;
    } catch {
      return false;
    }
  }

  private backoffMs(attempt: number): number {
    return Math.min(2000 + attempt * 250, 5000);
  }

  private delay(ms: number): Promise<void> {
    return new Promise((resolve) => setTimeout(resolve, ms));
  }
}
