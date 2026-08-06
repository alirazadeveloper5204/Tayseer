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
  private slideTween: { kill: () => void } | null = null;
  private paused = false;
  private pointerStartX = 0;
  private dragOriginX = 0;
  private suppressClick = false;

  constructor() {
    afterNextRender(() => this.init());

    effect(() => {
      this.index();
      this.dragging();
      if (isPlatformBrowser(this.platformId)) {
        queueMicrotask(() => this.updateSlideStates());
      }
    });
  }

  prev(): void {
    const real = this.realCount();
    if (!real) {
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
    this.measure();
    const max = this.loop() ? total - this.currentVisibleCount() : real - 1;
    const next = Math.min(Math.max(i, 0), Math.max(0, max));
    this.index.set(next);
    this.moveTrack(this.xForIndex(next), animate);
    this.restartProgress();
  }

  goToDot(dot: number): void {
    this.clearJump();
    this.goTo(dot, true);
  }

  pause(): void {
    this.paused = true;
    this.pausedUi.set(true);
    this.clearTimer();
  }

  resume(): void {
    if (this.dragging()) {
      return;
    }
    this.paused = false;
    this.pausedUi.set(false);
    this.startTimer();
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
    this.killSlideTween();
    this.dragging.set(true);
    this.pointerStartX = event.clientX;
    this.dragOriginX = this.xForIndex(this.index());
    (event.currentTarget as HTMLElement).setPointerCapture(event.pointerId);
  }

  onPointerMove(event: PointerEvent): void {
    if (!this.dragging()) {
      return;
    }
    const delta = event.clientX - this.pointerStartX;
    this.moveTrack(this.dragOriginX + delta, false);
  }

  onPointerUp(event: PointerEvent): void {
    if (!this.dragging()) {
      return;
    }
    const delta = event.clientX - this.pointerStartX;
    this.dragging.set(false);

    if (Math.abs(delta) >= 48) {
      this.suppressClick = true;
      const rtl = this.isRtl();
      const goingNext = rtl ? delta > 0 : delta < 0;
      goingNext ? this.next() : this.prev();
    } else {
      // Snap back to current index with smooth settle.
      this.goTo(this.index(), true);
    }

    this.resume();
  }

  private init(): void {
    if (!isPlatformBrowser(this.platformId)) {
      return;
    }

    this.applyMotionVars();
    this.syncVisibleCount();
    this.refreshDots();
    this.measure();
    this.moveTrack(this.xForIndex(this.index()), false);
    this.updateSlideStates();
    this.startTimer();

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
      this.zone.run(() => {
        const prevVisible = Number(this.host.nativeElement.getAttribute('data-visible') || '0');
        this.syncVisibleCount();
        const nextVisible = this.currentVisibleCount();
        this.measure();
        // Keep the active slide in range when the viewport gains/loses columns.
        if (prevVisible !== nextVisible) {
          this.goTo(this.activeDot(), false);
        } else {
          this.moveTrack(this.xForIndex(this.index()), false);
          this.updateSlideStates();
        }
      });
    });
    if (viewport) {
      resize.observe(viewport);
    }

    const mutation = new MutationObserver(() => {
      this.zone.run(() => {
        this.refreshDots();
        this.measure();
        this.moveTrack(this.xForIndex(this.index()), false);
        this.updateSlideStates();
      });
    });
    const track = this.trackEl();
    if (track) {
      mutation.observe(track, { childList: true });
    }

    this.destroyRef.onDestroy(() => {
      viewport?.removeEventListener('click', onClickCapture, true);
      resize.disconnect();
      mutation.disconnect();
      this.clearTimer();
      this.clearJump();
      this.killSlideTween();
    });
  }

  private xForIndex(index: number): number {
    const dir = this.isRtl() ? 1 : -1;
    return dir * index * this.slideStep();
  }

  private moveTrack(x: number, animate: boolean): void {
    const track = this.trackEl();
    const api = this.motion.gsap;
    if (!track || !api) {
      return;
    }

    this.killSlideTween();

    if (!animate || this.motion.prefersReducedMotion()) {
      api.set(track, { x, force3D: true });
      return;
    }

    this.slideTween = api.to(track, {
      x,
      duration: MOTION.duration.slider,
      ease: MOTION.ease.snappy,
      overwrite: 'auto',
      force3D: true,
    });
  }

  private killSlideTween(): void {
    this.slideTween?.kill();
    this.slideTween = null;
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
    if (!isPlatformBrowser(this.platformId) || this.paused) {
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
    const forced = this.visibleCount();
    if (forced && forced > 0) {
      return forced;
    }
    if (!isPlatformBrowser(this.platformId)) {
      return 1;
    }
    const width = window.innerWidth;
    // Phone: 1 · tablet: 2 · desktop: 3
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
    if (this.loop() && total >= 2) {
      return Math.floor(total / 2);
    }
    return total;
  }

  private refreshDots(): void {
    const count = this.realCount();
    this.dots.set(Array.from({ length: count }, (_, i) => i));
  }

  private measure(): void {
    const slide = this.slides()[0];
    const track = this.trackEl();
    if (!slide || !track) {
      this.slideStep.set(0);
      return;
    }
    const styles = getComputedStyle(track);
    const gap = Number.parseFloat(styles.columnGap || styles.gap || '0') || 0;
    this.slideStep.set(slide.getBoundingClientRect().width + gap);
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

  private startTimer(): void {
    this.clearTimer();
    if (!isPlatformBrowser(this.platformId) || this.paused) {
      this.progressRunning.set(false);
      return;
    }
    this.restartProgress();
    this.timer = setTimeout(() => {
      if (this.paused || document.hidden) {
        this.startTimer();
        return;
      }
      this.zone.run(() => {
        this.next();
        this.startTimer();
      });
    }, this.intervalMs());
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
}
