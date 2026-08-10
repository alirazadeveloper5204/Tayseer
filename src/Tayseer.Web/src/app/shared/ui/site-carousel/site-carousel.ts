import {
  afterNextRender,
  Component,
  computed,
  DestroyRef,
  effect,
  ElementRef,
  inject,
  input,
  NgZone,
  PLATFORM_ID,
  signal,
  viewChild,
  ViewEncapsulation,
} from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { LocaleService } from '../../../core/i18n/locale.service';
import { GsapService } from '../../../core/motion/gsap.service';
import { MOTION } from '../../../core/motion/motion-tokens';
import { SITE_SLIDER } from './site-slider';

export type SiteCarouselMode = 'rail' | 'fade';

@Component({
  selector: 'app-site-carousel',
  templateUrl: './site-carousel.html',
  styleUrl: './site-carousel.css',
  encapsulation: ViewEncapsulation.None,
})
export class SiteCarousel {
  private readonly platformId = inject(PLATFORM_ID);
  private readonly destroyRef = inject(DestroyRef);
  private readonly host = inject(ElementRef<HTMLElement>);
  private readonly zone = inject(NgZone);
  private readonly locale = inject(LocaleService);
  private readonly motion = inject(GsapService);
  private readonly viewport = viewChild<ElementRef<HTMLElement>>('viewport');
  private readonly trackRef = viewChild<ElementRef<HTMLElement>>('track');

  readonly labelledBy = input<string | undefined>();
  readonly label = input<string | undefined>();
  readonly previousLabel = input('Previous');
  readonly nextLabel = input('Next');
  readonly intervalMs = input(SITE_SLIDER.intervalMs);
  readonly loop = input(false);
  readonly itemCount = input(0);
  readonly visibleCount = input<number | null>(null);

  readonly mode = input<SiteCarouselMode>('rail');
  readonly showNav = input(true);
  readonly showProgress = input(true);
  readonly showDots = input(true);

  readonly index = signal(0);
  readonly dots = signal<number[]>([]);
  readonly dragging = signal(false);
  readonly jumping = signal(false);
  readonly pausedUi = signal(false);
  readonly progressRunning = signal(false);
  readonly activeDot = computed(() => {
    const real = this.realCount();
    return real ? ((this.index() % real) + real) % real : 0;
  });

  private readonly slideStep = signal(0);
  private timer: ReturnType<typeof setTimeout> | null = null;
  private jumpTimer: ReturnType<typeof setTimeout> | null = null;
  private fadeClearTimer: ReturnType<typeof setTimeout> | null = null;
  private animTimer: ReturnType<typeof setTimeout> | null = null;
  private paused = false;
  private offscreen = false;
  private timerStartedAt = 0;
  private remainingMs = 0;
  private pointerStartX = 0;
  private dragOriginX = 0;
  private suppressClick = false;
  private pointerArmed = false;
  private pointerId: number | null = null;

  private animating = false;
  private lastMeasuredStep = 0;
  private resizeRaf = 0;

  private navDir: 1 | -1 = 1;

  constructor() {
    afterNextRender(() => this.init());

    effect(() => {
      this.index();
      this.dragging();
      this.mode();
      if (isPlatformBrowser(this.platformId)) {
        queueMicrotask(() => {
          if (!this.isFade()) {
            this.updateSlideStates();
          }
        });
      }
    });
  }

  prev(): void {
    const real = this.realCount();
    if (!real) {
      return;
    }
    this.navDir = -1;

    if (this.isFade()) {
      if (this.loop()) {
        this.goTo(this.index() === 0 ? real - 1 : this.index() - 1, true);
      } else {
        this.goTo(this.index() - 1, true);
      }
      return;
    }

    if (this.loop() && this.index() === 0) {
      this.jumpTo(real, false);
      requestAnimationFrame(() => {
        requestAnimationFrame(() => this.goTo(real - 1, true));
      });
      return;
    }
    this.goTo(this.index() - 1, true);
  }

  next(): void {
    const real = this.realCount();
    if (!real) {
      return;
    }
    this.navDir = 1;

    if (this.isFade()) {
      if (this.loop()) {
        this.goTo((this.index() + 1) % real, true);
      } else {
        this.goTo(this.index() + 1, true);
      }
      return;
    }

    if (this.loop()) {
      const next = this.index() + 1;
      this.goTo(next, true);
      if (next >= real) {
        this.queueJump(0);
      }
      return;
    }
    this.goTo(this.index() + 1, true);
  }

  goTo(i: number, animate = true): void {
    const total = this.slides().length;
    const real = this.realCount();
    if (!total || !real) {
      return;
    }

    if (this.isFade()) {
      const from = this.index();
      let next = i;
      if (this.loop()) {
        next = ((i % real) + real) % real;
      } else {
        next = Math.min(Math.max(i, 0), real - 1);
      }
      if (next !== from) {
        if (from === real - 1 && next === 0) {
          this.navDir = 1;
        } else if (from === 0 && next === real - 1) {
          this.navDir = -1;
        } else if (next > from) {
          this.navDir = 1;
        } else if (next < from) {
          this.navDir = -1;
        }
      }
      this.index.set(next);
      this.playFade(from, next, animate);
      if (!this.paused) {
        this.startTimer(false);
      } else {
        this.remainingMs = this.intervalMs();
        this.progressRunning.set(false);
      }
      return;
    }

    this.measure();
    const max = this.loop() ? total - this.currentVisibleCount() : real - 1;
    const next = Math.min(Math.max(i, 0), Math.max(0, max));
    this.index.set(next);
    this.moveTrack(this.xForIndex(next), animate);
    if (!this.paused) {
      this.startTimer(false);
    } else {
      this.remainingMs = this.intervalMs();
      this.progressRunning.set(false);
    }
  }

  goToDot(dot: number): void {
    this.clearJump();
    this.goTo(dot, true);
  }

  pause(): void {
    if (this.paused) {
      return;
    }
    this.paused = true;
    this.pausedUi.set(true);
    if (this.timerStartedAt > 0) {
      const elapsed = performance.now() - this.timerStartedAt;
      const budget = this.remainingMs > 0 ? this.remainingMs : this.intervalMs();
      this.remainingMs = Math.max(50, budget - elapsed);
    }
    this.clearTimer();
  }

  resume(): void {
    if (this.dragging() || this.offscreen || !this.paused) {
      return;
    }
    this.paused = false;
    this.pausedUi.set(false);
    this.startTimer(true);
  }

  onKey(event: KeyboardEvent): void {
    const rtl = this.isRtl();
    if (event.key === 'ArrowRight') {
      event.preventDefault();
      rtl ? this.prev() : this.next();
    } else if (event.key === 'ArrowLeft') {
      event.preventDefault();
      rtl ? this.next() : this.prev();
    } else if (event.key === 'Home') {
      event.preventDefault();
      this.goToDot(0);
    } else if (event.key === 'End') {
      event.preventDefault();
      this.goToDot(Math.max(0, this.realCount() - 1));
    }
  }

  onPointerDown(event: PointerEvent): void {
    if (event.pointerType === 'mouse' && event.button !== 0) {
      return;
    }
    this.measure();
    this.pointerArmed = true;
    this.pointerId = event.pointerId;
    this.pointerStartX = event.clientX;
    this.dragOriginX = this.xForIndex(this.index());
    this.dragging.set(false);
    this.suppressClick = false;
  }

  onPointerMove(event: PointerEvent): void {
    if (!this.pointerArmed || (this.pointerId !== null && event.pointerId !== this.pointerId)) {
      return;
    }
    const delta = event.clientX - this.pointerStartX;

    if (!this.dragging() && Math.abs(delta) >= 10) {
      this.dragging.set(true);
      this.animating = false;
      this.clearAnimTimer();
      this.pause();
      try {
        (event.currentTarget as HTMLElement).setPointerCapture(event.pointerId);
      } catch {
      }
    }

    if (!this.dragging() || this.isFade()) {
      return;
    }
    this.moveTrack(this.dragOriginX + delta, false);
  }

  onPointerUp(event: PointerEvent): void {
    if (!this.pointerArmed || (this.pointerId !== null && event.pointerId !== this.pointerId)) {
      return;
    }

    const wasDragging = this.dragging();
    const delta = event.clientX - this.pointerStartX;
    this.pointerArmed = false;
    this.pointerId = null;
    this.dragging.set(false);

    if (wasDragging) {
      this.suppressClick = true;

      requestAnimationFrame(() => {
        if (Math.abs(delta) >= 48) {
          const rtl = this.isRtl();
          const goingNext = rtl ? delta > 0 : delta < 0;
          goingNext ? this.next() : this.prev();
        } else if (!this.isFade()) {
          this.goTo(this.index(), true);
        }
        this.resume();
      });
      return;
    }

    this.resume();
  }

  private init(): void {
    if (!isPlatformBrowser(this.platformId)) {
      return;
    }

    this.applyMotionVars();
    this.syncModeAttr();
    this.syncVisibleCount();
    this.refreshDots();
    this.measure();


    const trackEl = this.trackEl();
    const api = this.motion.gsap;
    if (trackEl && api) {
      api.set(trackEl, { clearProps: 'x,transform' });
    }

    if (this.isFade()) {
      this.playFade(this.index(), this.index(), false);
    } else {
      this.moveTrack(this.xForIndex(this.index()), false);
      this.updateSlideStates();
    }
    this.startTimer();

    const hostEl = this.host.nativeElement;
    const visibility = new IntersectionObserver(
      ([entry]) => {
        const inView = !!entry?.isIntersecting && (entry.intersectionRatio ?? 0) > 0.08;
        this.offscreen = !inView;
        this.zone.run(() => {
          if (!inView) {
            this.pause();
            return;
          }
          const hovering = hostEl.matches(':hover') || !!hostEl.querySelector(':focus-within');
          if (!hovering && !document.hidden) {
            this.resume();
          }
        });
      },
      { root: null, threshold: [0, 0.08, 0.2] },
    );
    visibility.observe(hostEl);

    const onDocVisibility = () => {
      if (document.hidden) {
        this.pause();
        return;
      }
      if (!this.offscreen && !hostEl.matches(':hover')) {
        this.resume();
      }
    };
    document.addEventListener('visibilitychange', onDocVisibility);

    const viewport = this.viewport()?.nativeElement;
    const onClickCapture = (event: Event) => {
      if (!this.suppressClick) {
        return;
      }
      event.preventDefault();
      event.stopPropagation();
      this.suppressClick = false;
    };
    viewport?.addEventListener('click', onClickCapture, true);

    const resize = new ResizeObserver(() => {
      if (this.resizeRaf) {
        return;
      }
      this.resizeRaf = requestAnimationFrame(() => {
        this.resizeRaf = 0;
        this.zone.run(() => {
          this.syncModeAttr();
          const prevStep = this.lastMeasuredStep;
          const prevVisible = Number(this.host.nativeElement.getAttribute('data-visible') || '0');
          this.syncVisibleCount();
          const nextVisible = this.currentVisibleCount();
          this.measure();
          const stepChanged = Math.abs(this.slideStep() - prevStep) > 1;
          const visibleChanged = prevVisible !== nextVisible;

          if (this.animating && !visibleChanged && !stepChanged) {
            return;
          }

          if (this.isFade()) {
            if (!this.animating) {
              this.playFade(this.index(), this.index(), false);
            }
            return;
          }
          if (visibleChanged) {
            this.goTo(this.activeDot(), false);
          } else {
            this.moveTrack(this.xForIndex(this.index()), false);
            this.updateSlideStates();
          }
        });
      });
    });
    if (viewport) {
      resize.observe(viewport);
    }

    const mutation = new MutationObserver(() => {
      this.zone.run(() => {
        this.refreshDots();
        this.measure();
        if (this.animating) {
          return;
        }
        if (this.isFade()) {
          this.playFade(this.index(), this.index(), false);
        } else {
          this.moveTrack(this.xForIndex(this.index()), false);
          this.updateSlideStates();
        }
      });
    });
    const track = this.trackEl();
    if (track) {
      mutation.observe(track, { childList: true });
    }

    this.destroyRef.onDestroy(() => {
      viewport?.removeEventListener('click', onClickCapture, true);
      document.removeEventListener('visibilitychange', onDocVisibility);
      visibility.disconnect();
      resize.disconnect();
      mutation.disconnect();
      if (this.resizeRaf) {
        cancelAnimationFrame(this.resizeRaf);
        this.resizeRaf = 0;
      }
      this.clearTimer();
      this.clearJump();
      this.clearAnimTimer();
      this.clearFadeTimer();
    });
  }

  private isFade(): boolean {
    return this.mode() === 'fade';
  }

  private syncModeAttr(): void {
    this.host.nativeElement.setAttribute('data-mode', this.mode());
  }

  private xForIndex(index: number): number {
    const dir = this.isRtl() ? 1 : -1;
    return dir * index * this.slideStep();
  }

  private moveTrack(x: number, animate: boolean): void {
    if (this.isFade()) {
      return;
    }
    const track = this.trackEl();
    if (!track) {
      return;
    }

    const reduce = this.motion.prefersReducedMotion();
    const shouldAnimate = animate && !reduce;

    if (shouldAnimate) {
      track.classList.remove('is-instant');
      this.animating = true;
      this.clearAnimTimer();
      this.animTimer = setTimeout(() => {
        this.animating = false;
        this.animTimer = null;
      }, SITE_SLIDER.durationMs + 40);
    } else {
      track.classList.add('is-instant');
      this.animating = false;
      this.clearAnimTimer();
    }

    track.style.setProperty('--site-track-x', `${Math.round(x * 100) / 100}px`);
  }



  private playFade(from: number, to: number, animate: boolean): void {
    const slides = this.slides();
    if (!slides.length) {
      return;
    }

    this.clearFadeTimer();
    const api = this.motion.gsap;
    if (api) {
      api.set(slides, { clearProps: 'opacity,visibility,transform,x' });
    }

    const reduce = this.motion.prefersReducedMotion();
    const shouldAnimate = animate && !reduce && from !== to;
    const rtl = this.isRtl();
    const dir = (rtl ? -this.navDir : this.navDir) as 1 | -1;
    const leaveX = `${dir * -8}px`;
    const enterX = `${dir * 16}px`;

    slides.forEach((slide, i) => {
      slide.classList.remove('is-leaving', 'is-entering');
      if (i !== to && i !== from) {
        slide.classList.remove('is-active');
      }
      slide.setAttribute('aria-hidden', i === to ? 'false' : 'true');
    });

    const outgoing = slides[from];
    const incoming = slides[to];
    if (!incoming) {
      return;
    }

    if (!shouldAnimate) {
      slides.forEach((slide, i) => {
        slide.classList.toggle('is-active', i === to);
        slide.style.removeProperty('--fade-x');
      });
      this.animating = false;
      return;
    }

    this.animating = true;

    incoming.classList.add('is-entering');
    incoming.style.setProperty('--fade-x', enterX);
    incoming.classList.add('is-active');
    void incoming.offsetWidth;
    incoming.classList.remove('is-entering');
    incoming.style.setProperty('--fade-x', '0px');

    if (outgoing && outgoing !== incoming) {
      outgoing.classList.remove('is-active');
      outgoing.classList.add('is-leaving');
      outgoing.style.setProperty('--fade-x', leaveX);
    }

    this.fadeClearTimer = setTimeout(() => {
      slides.forEach((slide) => {
        slide.classList.remove('is-leaving', 'is-entering');
        if (slide !== incoming) {
          slide.classList.remove('is-active');
          slide.style.removeProperty('--fade-x');
        } else {
          slide.style.setProperty('--fade-x', '0px');
        }
      });
      this.animating = false;
      this.fadeClearTimer = null;
    }, SITE_SLIDER.durationMs + 40);
  }

  private trackEl(): HTMLElement | null {
    return this.trackRef()?.nativeElement ?? null;
  }

  private applyMotionVars(): void {
    const el = this.host.nativeElement;
    el.style.setProperty('--site-slider-duration', `${SITE_SLIDER.durationMs}ms`);
    el.style.setProperty('--site-slider-interval', `${this.intervalMs()}ms`);
    el.style.setProperty('--site-slider-ease', SITE_SLIDER.easing);
    el.style.setProperty('--site-slider-ease-soft', SITE_SLIDER.easeSoft);
    el.style.setProperty('--site-slider-ease-out', SITE_SLIDER.easeOut);
    el.style.setProperty('--site-slider-ease-exit', MOTION.css.exit);
    el.style.setProperty('--site-neighbor-opacity', String(SITE_SLIDER.neighborOpacity));
    el.style.setProperty('--site-neighbor-scale', String(SITE_SLIDER.neighborScale));
  }

  private updateSlideStates(): void {
    const slides = this.slides();
    if (!slides.length) {
      return;
    }
    const visible = this.currentVisibleCount();
    const start = this.index();
    const end = start + visible - 1;
    const mid = start + Math.floor(visible / 2);

    slides.forEach((slide, i) => {
      const inView = i >= start && i <= end;
      if (visible >= 3) {
        slide.classList.toggle('is-active', i === mid);
        slide.classList.toggle('is-neighbor', inView && i !== mid);
      } else {
        slide.classList.toggle('is-active', inView);
        slide.classList.toggle('is-neighbor', false);
      }
    });
  }

  private restartProgress(): void {
    if (!isPlatformBrowser(this.platformId) || this.paused || !this.showProgress()) {
      this.progressRunning.set(false);
      return;
    }
    this.progressRunning.set(false);
    requestAnimationFrame(() => {
      if (!this.paused) {
        this.progressRunning.set(true);
      }
    });
  }

  private queueJump(i: number): void {
    this.clearJump();
    this.jumpTimer = setTimeout(() => this.jumpTo(i, false), SITE_SLIDER.durationMs);
  }

  private jumpTo(i: number, animate: boolean): void {
    this.jumping.set(true);
    this.index.set(i);
    this.moveTrack(this.xForIndex(i), animate);
    requestAnimationFrame(() => {
      requestAnimationFrame(() => this.jumping.set(false));
    });
  }

  private syncVisibleCount(): void {
    if (!isPlatformBrowser(this.platformId)) {
      return;
    }
    const count = this.currentVisibleCount();
    this.host.nativeElement.style.setProperty('--slide-count', String(count));
    this.host.nativeElement.setAttribute('data-visible', String(count));
  }

  private currentVisibleCount(): number {
    if (this.isFade()) {
      return 1;
    }
    const forced = this.visibleCount();
    if (forced && forced > 0) {
      return forced;
    }
    if (!isPlatformBrowser(this.platformId)) {
      return 1;
    }
    const width = window.innerWidth;
    if (width >= 1024) {
      return 3;
    }
    if (width >= 700) {
      return 2;
    }
    return 1;
  }

  private realCount(): number {
    const provided = this.itemCount();
    if (provided > 0) {
      return provided;
    }
    const total = this.slides().length;
    if (this.loop() && !this.isFade() && total >= 2) {
      return Math.floor(total / 2);
    }
    return total;
  }

  private refreshDots(): void {
    const count = this.realCount();
    this.dots.set(Array.from({ length: count }, (_, i) => i));
  }

  private measure(): void {
    if (this.isFade()) {
      const viewport = this.viewport()?.nativeElement;
      const step = viewport?.getBoundingClientRect().width ?? 0;
      this.slideStep.set(step);
      this.lastMeasuredStep = step;
      return;
    }
    const slide = this.slides()[0];
    const track = this.trackEl();
    if (!slide || !track) {
      this.slideStep.set(0);
      this.lastMeasuredStep = 0;
      return;
    }
    const styles = getComputedStyle(track);
    const gap = Number.parseFloat(styles.columnGap || styles.gap || '0') || 0;
    const step = slide.getBoundingClientRect().width + gap;
    this.slideStep.set(step);
    this.lastMeasuredStep = step;
  }

  private slides(): HTMLElement[] {
    const track = this.trackEl();
    if (!track) {
      return [];
    }
    return Array.from(track.children) as HTMLElement[];
  }

  private isRtl(): boolean {
    return this.locale.lang() === 'ar';
  }

  private startTimer(resume = false): void {
    this.clearTimer();
    if (!isPlatformBrowser(this.platformId) || this.paused) {
      return;
    }

    if (!resume) {
      this.remainingMs = this.intervalMs();
      this.restartProgress();
    } else if (this.showProgress() && !this.progressRunning()) {
      this.progressRunning.set(true);
    }

    const wait = Math.max(50, resume ? this.remainingMs || this.intervalMs() : this.intervalMs());
    this.remainingMs = wait;
    this.timerStartedAt = performance.now();

    this.timer = setTimeout(() => {
      if (this.paused || document.hidden) {
        return;
      }
      this.zone.run(() => {
        this.next();
      });
    }, wait);
  }

  private clearTimer(): void {
    if (this.timer) {
      clearTimeout(this.timer);
      this.timer = null;
    }
  }

  private clearJump(): void {
    if (this.jumpTimer) {
      clearTimeout(this.jumpTimer);
      this.jumpTimer = null;
    }
  }

  private clearAnimTimer(): void {
    if (this.animTimer) {
      clearTimeout(this.animTimer);
      this.animTimer = null;
    }
  }

  private clearFadeTimer(): void {
    if (this.fadeClearTimer) {
      clearTimeout(this.fadeClearTimer);
      this.fadeClearTimer = null;
    }
  }
}
