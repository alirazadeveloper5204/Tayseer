import {
  afterNextRender,
  Component,
  computed,
  DestroyRef,
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
  private readonly viewport = viewChild<ElementRef<HTMLElement>>('viewport');

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
  readonly dragX = signal(0);
  readonly jumping = signal(false);
  readonly activeDot = computed(() => {
    const real = this.realCount();
    return real ? ((this.index() % real) + real) % real : 0;
  });

  private readonly slideStep = signal(0);
  private timer: ReturnType<typeof setTimeout> | null = null;
  private jumpTimer: ReturnType<typeof setTimeout> | null = null;
  private paused = false;
  private pointerStartX = 0;
  private suppressClick = false;

  constructor() {
    afterNextRender(() => this.init());
  }

  trackTransform(): string {
    const dir = this.isRtl() ? 1 : -1;
    const x = dir * this.index() * this.slideStep() + this.dragX();
    return `translate3d(${x}px, 0, 0)`;
  }

  prev(): void {
    const real = this.realCount();
    if (!real) {
      return;
    }
    if (this.loop() && this.index() === 0) {
      this.jumping.set(true);
      this.index.set(real);
      this.dragX.set(0);
      requestAnimationFrame(() => {
        requestAnimationFrame(() => {
          this.jumping.set(false);
          this.goTo(real - 1);
        });
      });
      return;
    }
    this.goTo(this.index() - 1);
  }

  next(): void {
    const real = this.realCount();
    if (!real) {
      return;
    }
    if (this.loop()) {
      const next = this.index() + 1;
      this.goTo(next);
      if (next >= real) {
        this.queueJump(0);
      }
      return;
    }
    this.goTo(this.index() + 1);
  }

  goTo(i: number): void {
    const total = this.slides().length;
    const real = this.realCount();
    if (!total || !real) {
      return;
    }
    this.measure();
    const max = this.loop() ? total - this.currentVisibleCount() : real - 1;
    const next = Math.min(Math.max(i, 0), Math.max(0, max));
    this.index.set(next);
    this.dragX.set(0);
  }

  goToDot(dot: number): void {
    this.clearJump();
    this.goTo(dot);
  }

  pause(): void {
    this.paused = true;
    this.clearTimer();
  }

  resume(): void {
    if (this.dragging()) {
      return;
    }
    this.paused = false;
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
    this.dragging.set(true);
    this.pointerStartX = event.clientX;
    this.dragX.set(0);
    (event.currentTarget as HTMLElement).setPointerCapture(event.pointerId);
  }

  onPointerMove(event: PointerEvent): void {
    if (!this.dragging()) {
      return;
    }
    this.dragX.set(event.clientX - this.pointerStartX);
  }

  onPointerUp(event: PointerEvent): void {
    if (!this.dragging()) {
      return;
    }
    const delta = event.clientX - this.pointerStartX;
    this.dragging.set(false);
    this.dragX.set(0);

    if (Math.abs(delta) >= 48) {
      this.suppressClick = true;
      const rtl = this.isRtl();
      const goingNext = rtl ? delta > 0 : delta < 0;
      goingNext ? this.next() : this.prev();
    }

    this.resume();
  }

  private init(): void {
    if (!isPlatformBrowser(this.platformId)) {
      return;
    }

    this.syncVisibleCount();
    this.refreshDots();
    this.measure();
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
        this.syncVisibleCount();
        this.measure();
      });
    });
    if (viewport) {
      resize.observe(viewport);
    }

    const mutation = new MutationObserver(() => {
      this.zone.run(() => {
        this.refreshDots();
        this.measure();
      });
    });
    const track = viewport?.querySelector('.site-carousel__track');
    if (track) {
      mutation.observe(track, { childList: true, subtree: true });
    }

    this.destroyRef.onDestroy(() => {
      viewport?.removeEventListener('click', onClickCapture, true);
      resize.disconnect();
      mutation.disconnect();
      this.clearTimer();
      this.clearJump();
    });
  }

  private queueJump(i: number): void {
    this.clearJump();
    this.jumpTimer = setTimeout(() => this.jumpTo(i), SITE_SLIDER.durationMs);
  }

  private jumpTo(i: number): void {
    this.jumping.set(true);
    this.index.set(i);
    this.dragX.set(0);
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
      return 3;
    }
    return window.innerWidth >= 768 ? 3 : 1;
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
    const track = this.viewport()?.nativeElement.querySelector('.site-carousel__track');
    if (!slide || !track) {
      this.slideStep.set(0);
      return;
    }
    const styles = getComputedStyle(track);
    const gap = Number.parseFloat(styles.columnGap || styles.gap || '0') || 0;
    this.slideStep.set(slide.getBoundingClientRect().width + gap);
  }

  private slides(): HTMLElement[] {
    const vp = this.viewport()?.nativeElement;
    if (!vp) {
      return [];
    }
    return Array.from(vp.querySelectorAll<HTMLElement>('.site-carousel__track > *'));
  }

  private isRtl(): boolean {
    return this.locale.lang() === 'ar';
  }

  private startTimer(): void {
    this.clearTimer();
    if (!isPlatformBrowser(this.platformId) || this.paused) {
      return;
    }
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
