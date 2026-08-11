import { Component, DestroyRef, ElementRef, computed, effect, inject, viewChild } from '@angular/core';
import gsap from 'gsap';
import { NavigationLoaderService } from '../../../core/navigation/navigation-loader.service';
import { GsapService } from '../../../core/motion/gsap.service';
import { UiCopyService } from '../../../core/i18n/ui-copy.service';
import { ApiWakeService } from '../../../core/api/api-wake.service';

@Component({
  selector: 'app-page-loader',
  templateUrl: './page-loader.html',
  styleUrl: './page-loader.css',
})
export class PageLoader {
  readonly loader = inject(NavigationLoaderService);
  readonly copy = inject(UiCopyService).copy;
  private readonly apiWake = inject(ApiWakeService);
  private readonly motion = inject(GsapService);
  private readonly destroyRef = inject(DestroyRef);
  private readonly panel = viewChild<ElementRef<HTMLElement>>('loaderPanel');
  private readonly mark = viewChild<ElementRef<HTMLElement>>('loaderMark');
  private readonly logo = viewChild<ElementRef<HTMLElement>>('loaderLogo');
  private intro: gsap.core.Timeline | null = null;
  private loop: gsap.core.Timeline | null = null;

  readonly statusText = computed(() => {
    const c = this.copy().common;
    switch (this.apiWake.phase()) {
      case 'database':
        return c.wakeDatabase;
      case 'timeout':
        return c.wakeTimeout;
      case 'ready':
        return c.loading;
      default:
        return this.apiWake.status() === 'waking' ? c.wakeConnecting : c.loading;
    }
  });

  constructor() {
    this.destroyRef.onDestroy(() => this.killMotion());

    effect(() => {
      const active = this.loader.active();
      const visible = this.loader.visible();
      const leaving = this.loader.leaving();
      const generation = this.loader.generation();

      if (!this.motion.isBrowser) {
        return;
      }

      if (!active) {
        this.killMotion();
        return;
      }

      if (leaving) {
        this.playOut();
        return;
      }

      if (!visible) {
        return;
      }

      void generation;
      requestAnimationFrame(() => this.playIn());
    });
  }

  private playIn(): void {
    const api = this.motion.gsap;
    const panel = this.panel()?.nativeElement;
    const mark = this.mark()?.nativeElement;
    const logo = this.logo()?.nativeElement;
    if (!api || !panel || !mark || !logo) {
      return;
    }

    if (this.prefersReducedMotion()) {
      api.set([panel, mark, logo], { clearProps: 'transform,filter', autoAlpha: 1, y: 0, scale: 1 });
      return;
    }

    this.killMotion();

    this.intro = api.timeline({ defaults: { ease: 'power3.out' } });
    this.intro.fromTo(
      panel,
      { autoAlpha: 0, y: 16, scale: 0.96 },
      { autoAlpha: 1, y: 0, scale: 1, duration: 0.55 },
      0,
    );
    this.intro.fromTo(
      mark,
      { autoAlpha: 0, scale: 0.82, rotate: -8 },
      { autoAlpha: 1, scale: 1, rotate: 0, duration: 0.7, ease: 'back.out(1.4)' },
      0.05,
    );
    this.intro.fromTo(
      logo,
      { autoAlpha: 0, y: 18, filter: 'blur(8px)' },
      { autoAlpha: 1, y: 0, filter: 'blur(0px)', duration: 0.65 },
      0.18,
    );

    this.loop = api.timeline({ repeat: -1, defaults: { ease: 'sine.inOut' } });
    this.loop
      .to(mark, { y: -6, scale: 1.04, duration: 1.7 }, 0)
      .to(mark, { y: 0, scale: 1, duration: 1.7 }, 1.7)
      .to(logo, { y: -5, duration: 1.7 }, 0)
      .to(logo, { y: 0, duration: 1.7 }, 1.7);
  }

  private playOut(): void {
    const api = this.motion.gsap;
    const panel = this.panel()?.nativeElement;
    if (!api || !panel || this.prefersReducedMotion()) {
      this.killMotion();
      return;
    }

    this.loop?.kill();
    this.loop = null;
    this.intro?.kill();
    this.intro = api
      .timeline()
      .to(panel, { autoAlpha: 0, y: -10, scale: 0.98, duration: 0.32, ease: 'power2.in' });
  }

  private killMotion(): void {
    this.intro?.kill();
    this.loop?.kill();
    this.intro = null;
    this.loop = null;
  }

  private prefersReducedMotion(): boolean {
    return this.motion.isBrowser && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  }
}
