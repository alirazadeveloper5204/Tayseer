import { Injectable, signal, inject, DestroyRef, PLATFORM_ID, ApplicationRef } from '@angular/core';
import { isPlatformBrowser, DOCUMENT } from '@angular/common';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import {
  NavigationCancel,
  NavigationEnd,
  NavigationError,
  NavigationStart,
  Router,
} from '@angular/router';
import { filter } from 'rxjs/operators';

@Injectable({ providedIn: 'root' })
export class NavigationLoaderService {
  private readonly router = inject(Router);
  private readonly destroyRef = inject(DestroyRef);
  private readonly document = inject(DOCUMENT);
  private readonly platformId = inject(PLATFORM_ID);
  private readonly appRef = inject(ApplicationRef);

  readonly active = signal(true);
  readonly visible = signal(false);
  readonly leaving = signal(false);
  /** True once the overlay has fully faded in (safe to swap routes underneath). */
  readonly covered = signal(false);
  /** Locked at show() so theme toggles don't flash the overlay background. */
  readonly surface = signal<'light' | 'dark'>('dark');
  /** Bumps on each show so the chevron draw remounts / restarts. */
  readonly generation = signal(0);

  private showStartedAt = Date.now();
  private hideTimer: ReturnType<typeof setTimeout> | null = null;
  private leaveTimer: ReturnType<typeof setTimeout> | null = null;
  private coverTimer: ReturnType<typeof setTimeout> | null = null;
  private coverPromise: Promise<boolean> | null = null;
  private resolveCover: ((value: boolean) => void) | null = null;
  private navigationDepth = 0;
  private booted = false;
  private firstNavigation = true;
  /** First child activation should not wait for a cover animation. */
  private skipCoverWait = true;

  /** Must match `.page-loader` enter transition. */
  private readonly enterMs = 320;
  private readonly minVisibleMs = 1100;
  private readonly bootMinVisibleMs = 1000;
  private readonly leaveMs = 380;

  constructor() {
    if (isPlatformBrowser(this.platformId)) {
      const isDark = this.document.documentElement.classList.contains('dark');
      this.surface.set(isDark ? 'dark' : 'light');
    }

    this.router.events
      .pipe(
        filter(
          (e) =>
            e instanceof NavigationStart ||
            e instanceof NavigationEnd ||
            e instanceof NavigationCancel ||
            e instanceof NavigationError,
        ),
        takeUntilDestroyed(this.destroyRef),
      )
      .subscribe((event) => {
        if (event instanceof NavigationStart) {
          this.navigationDepth++;
          if (this.firstNavigation) {
            this.firstNavigation = false;
            return;
          }
          this.show();
          return;
        }

        if (event instanceof NavigationEnd && !this.router.parseUrl(event.urlAfterRedirects).fragment) {
          this.scrollToTopInstant();
        }

        this.navigationDepth = Math.max(0, this.navigationDepth - 1);
        if (this.navigationDepth === 0) {
          this.scheduleHide();
        }
      });

    if (isPlatformBrowser(this.platformId)) {
      requestAnimationFrame(() => this.visible.set(true));
    } else {
      this.visible.set(true);
    }
  }

  /**
   * Blocks route activation until the overlay has faded in over the current page.
   * Prevents the destination page flashing through a semi-transparent cover.
   */
  waitUntilCovered(): Promise<boolean> {
    if (!isPlatformBrowser(this.platformId) || this.skipCoverWait) {
      this.skipCoverWait = false;
      return Promise.resolve(true);
    }

    if (this.covered()) {
      return Promise.resolve(true);
    }

    return this.coverPromise ?? Promise.resolve(true);
  }

  markAppReady(): void {
    this.removeBootSplash();
    if (!this.booted) {
      this.booted = true;
      if (this.navigationDepth === 0) {
        this.scheduleHide(true);
      }
    }
  }

  runCovered(work: () => void, minVisibleMs = 1100): void {
    this.navigationDepth++;
    this.show();

    const run = () => {
      work();
      this.navigationDepth = Math.max(0, this.navigationDepth - 1);
      if (this.navigationDepth === 0) {
        this.scheduleHideWithMin(minVisibleMs);
      }
    };

    if (isPlatformBrowser(this.platformId)) {
      void this.waitUntilCovered().then(() => {
        window.setTimeout(run, 80);
      });
      return;
    }

    run();
  }

  private show(): void {
    this.clearTimers();
    this.leaving.set(false);
    this.covered.set(false);
    this.showStartedAt = Date.now();
    this.generation.update((g) => g + 1);
    // Drop focus before content becomes inert (theme toggle / nav stay focused otherwise).
    this.blurActiveElement();
    this.active.set(true);

    // Freeze overlay colors to the pre-transition theme (avoids dark↔light flash).
    const isDark = this.document.documentElement.classList.contains('dark');
    this.surface.set(isDark ? 'dark' : 'light');

    // Jump to top under the cover so the next page never opens mid-scroll.
    this.scrollToTopInstant();

    // Mount at opacity 0, then fade in over the current page.
    this.visible.set(false);
    this.coverPromise = new Promise<boolean>((resolve) => {
      this.resolveCover = resolve;
    });

    if (isPlatformBrowser(this.platformId)) {
      this.appRef.tick();
      requestAnimationFrame(() => {
        this.visible.set(true);
        this.appRef.tick();
        this.coverTimer = setTimeout(() => this.markCovered(), this.enterMs);
      });
    } else {
      this.visible.set(true);
      this.markCovered();
    }
  }

  private markCovered(): void {
    this.covered.set(true);
    this.coverTimer = null;
    this.resolveCover?.(true);
    this.resolveCover = null;
  }

  private scheduleHide(fromBoot = false): void {
    const minMs = fromBoot || !this.booted ? this.bootMinVisibleMs : this.minVisibleMs;
    this.scheduleHideWithMin(minMs);
  }

  private scheduleHideWithMin(minMs: number): void {
    const elapsed = Date.now() - this.showStartedAt;
    const wait = Math.max(0, minMs - elapsed);
    this.clearHideTimers();

    this.hideTimer = setTimeout(() => this.beginLeave(), wait);
  }

  private beginLeave(): void {
    // Reveal the new page under the fading overlay for a soft exit.
    this.covered.set(false);
    this.leaving.set(true);
    this.visible.set(false);
    this.document.documentElement.classList.remove('theme-switching');
    this.leaveTimer = setTimeout(() => {
      this.active.set(false);
      this.leaving.set(false);
      this.hideTimer = null;
      this.leaveTimer = null;
      this.coverPromise = null;
      this.booted = true;
      this.removeBootSplash();
    }, this.leaveMs);
  }

  private clearHideTimers(): void {
    if (this.hideTimer) {
      clearTimeout(this.hideTimer);
      this.hideTimer = null;
    }
    if (this.leaveTimer) {
      clearTimeout(this.leaveTimer);
      this.leaveTimer = null;
    }
  }

  private clearTimers(): void {
    this.clearHideTimers();
    if (this.coverTimer) {
      clearTimeout(this.coverTimer);
      this.coverTimer = null;
    }
    if (this.resolveCover) {
      this.resolveCover(true);
      this.resolveCover = null;
    }
  }

  private scrollToTopInstant(): void {
    if (!isPlatformBrowser(this.platformId)) {
      return;
    }

    const win = this.document.defaultView;
    const root = this.document.documentElement;
    const previous = root.style.scrollBehavior;
    root.style.scrollBehavior = 'auto';
    win?.scrollTo(0, 0);
    root.scrollTop = 0;
    this.document.body.scrollTop = 0;
    root.style.scrollBehavior = previous;
  }

  private blurActiveElement(): void {
    if (!isPlatformBrowser(this.platformId)) {
      return;
    }
    const active = this.document.activeElement;
    if (active instanceof HTMLElement && active !== this.document.body) {
      active.blur();
    }
  }

  private removeBootSplash(): void {
    if (!isPlatformBrowser(this.platformId)) {
      return;
    }
    this.document.getElementById('boot-loader')?.remove();
    this.document.documentElement.classList.remove('boot-loading');
  }
}
