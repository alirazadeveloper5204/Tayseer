import {
  Component,
  computed,
  inject,
  signal,
  ViewEncapsulation,
  afterNextRender,
  ElementRef,
  viewChild,
  DestroyRef,
  NgZone,
  PLATFORM_ID,
} from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { LocaleService } from '../../../core/i18n/locale.service';
import { UiCopyService } from '../../../core/i18n/ui-copy.service';
import {
  HOME_DEPLOY,
  HOME_KPI_STATS,
  HOME_MANTRA,
  HOME_TESTIMONIALS,
  HOME_WHY_FEATURES,
} from '../../../core/i18n/ui-copy';
import { CLIENT_GALLERIES } from '../../../core/media/site-images';
import { GsapService } from '../../../core/motion/gsap.service';
import type BsCarousel from 'bootstrap/js/dist/carousel';
import { SITE_SLIDER } from '../../../shared/ui/site-carousel/site-slider';

function formatKpi(value: number, decimals: number, prefix: string, suffix: string): string {
  const body = decimals > 0 ? value.toFixed(decimals) : String(Math.round(value));
  return `${prefix}${body}${suffix}`;
}

@Component({
  selector: 'app-home-story',
  templateUrl: './home-story.html',
  styleUrl: './home-story.css',
  encapsulation: ViewEncapsulation.None,
})
export class HomeStory {
  private readonly locale = inject(LocaleService);
  private readonly platformId = inject(PLATFORM_ID);
  private readonly destroyRef = inject(DestroyRef);
  private readonly zone = inject(NgZone);
  private readonly motion = inject(GsapService);
  readonly copy = inject(UiCopyService).copy;
  readonly isAr = computed(() => this.locale.lang() === 'ar');

  private readonly whyChoosePanel = viewChild<ElementRef<HTMLElement>>('whyChoosePanel');
  private readonly clientsCarousel = viewChild<ElementRef<HTMLElement>>('clientsCarousel');
  private readonly mantraSection = viewChild<ElementRef<HTMLElement>>('mantraSection');
  private readonly pioneerSection = viewChild<ElementRef<HTMLElement>>('pioneerSection');

  readonly testimonialIndex = signal(0);
  readonly kpiDisplays = signal(
    HOME_KPI_STATS.map((s) => formatKpi(0, s.decimals, s.prefix, s.suffix)),
  );

  readonly kpiStats = computed(() => {
    const displays = this.kpiDisplays();
    return HOME_KPI_STATS.map((s, i) => ({
      id: i,
      label: this.isAr() ? s.labelAr : s.labelEn,
      display: displays[i] ?? formatKpi(0, s.decimals, s.prefix, s.suffix),
    }));
  });

  readonly testimonials = computed(() =>
    HOME_TESTIMONIALS.map((t, i) => {
      const gallery = CLIENT_GALLERIES[i % CLIENT_GALLERIES.length];
      return {
        id: i,
        name: t.name,
        role: this.isAr() ? t.roleAr : t.roleEn,
        quote: this.isAr() ? t.quoteAr : t.quoteEn,
        portrait: gallery.main,
        avatar: gallery.thumbs[0] ?? gallery.main,
      };
    }),
  );

  readonly whyFeatures = computed(() =>
    HOME_WHY_FEATURES.map((item, i) => ({
      id: i,
      icon: item.icon,
      title: this.isAr() ? item.titleAr : item.titleEn,
      body: this.isAr() ? item.bodyAr : item.bodyEn,
    })),
  );

  private static readonly mantraIcons = ['team', 'transparency', 'quality'] as const;

  readonly mantra = computed(() =>
    HomeStory.mantraIcons.map((icon, i) => {
      const m = HOME_MANTRA[i];
      return {
        id: i,
        icon,
        title: this.isAr() ? m.titleAr : m.titleEn,
        body: this.isAr() ? m.bodyAr : m.bodyEn,
      };
    }),
  );

  readonly deploy = computed(() =>
    HOME_DEPLOY.map((d, i) => ({
      id: i,
      title: this.isAr() ? d.titleAr : d.titleEn,
      body: this.isAr() ? d.bodyAr : d.bodyEn,
    })),
  );

  private carousel: BsCarousel | null = null;
  private testimonialTimer: ReturnType<typeof setTimeout> | null = null;
  private testimonialPaused = false;
  private counterTweens: { kill(): void }[] = [];

  constructor() {
    afterNextRender(() => {
      if (!isPlatformBrowser(this.platformId)) {
        return;
      }

      this.watchWhyChooseCounters();
      this.watchSectionReveal(this.mantraSection()?.nativeElement);
      this.watchSectionReveal(this.pioneerSection()?.nativeElement);
      void this.initCarousel();

      this.destroyRef.onDestroy(() => {
        this.killCounters();
        this.clearTestimonialTimer();
        this.carousel?.dispose();
        this.carousel = null;
      });
    });
  }

  prevTestimonial(): void {
    this.carousel?.prev();
    this.restartTestimonialTimer();
  }

  nextTestimonial(): void {
    this.carousel?.next();
    this.restartTestimonialTimer();
  }

  goToTestimonial(index: number): void {
    this.carousel?.to(index);
    this.restartTestimonialTimer();
  }

  pauseTestimonials(): void {
    this.testimonialPaused = true;
    this.clearTestimonialTimer();
  }

  resumeTestimonials(): void {
    this.testimonialPaused = false;
    this.restartTestimonialTimer();
  }

  private watchWhyChooseCounters(): void {
    const panel = this.whyChoosePanel()?.nativeElement;
    if (!panel) {
      return;
    }

    let visible = false;
    const io = new IntersectionObserver(
      ([entry]) => {
        if (entry?.isIntersecting) {
          if (!visible) {
            visible = true;
            this.playWhyCounters();
          }
          return;
        }
        visible = false;
        this.resetWhyCounters();
      },
      { threshold: 0.35 },
    );
    io.observe(panel);
    this.destroyRef.onDestroy(() => io.disconnect());
  }

  private resetWhyCounters(): void {
    this.killCounters();
    this.zone.run(() => {
      this.kpiDisplays.set(HOME_KPI_STATS.map((s) => formatKpi(0, s.decimals, s.prefix, s.suffix)));
    });
  }

  private playWhyCounters(): void {
    const api = this.motion.gsap;
    this.killCounters();
    this.zone.run(() => {
      this.kpiDisplays.set(HOME_KPI_STATS.map((s) => formatKpi(0, s.decimals, s.prefix, s.suffix)));
    });

    if (!api || this.motion.prefersReducedMotion()) {
      this.zone.run(() => {
        this.kpiDisplays.set(
          HOME_KPI_STATS.map((s) => formatKpi(s.value, s.decimals, s.prefix, s.suffix)),
        );
      });
      return;
    }

    HOME_KPI_STATS.forEach((meta, i) => {
      const state = { val: 0 };
      const tween = api.to(state, {
        val: meta.value,
        duration: 1.8,
        ease: 'power3.out',
        overwrite: 'auto',
        onUpdate: () => {
          this.zone.run(() => {
            this.kpiDisplays.update((list) => {
              const next = [...list];
              next[i] = formatKpi(state.val, meta.decimals, meta.prefix, meta.suffix);
              return next;
            });
          });
        },
      });
      this.counterTweens.push(tween);
    });
  }

  private watchSectionReveal(section?: HTMLElement): void {
    if (!section) {
      return;
    }
    if (this.motion.prefersReducedMotion()) {
      section.classList.add('is-revealed');
      return;
    }
    const io = new IntersectionObserver(
      ([entry]) => {
        if (entry?.isIntersecting) {
          section.classList.add('is-revealed');
          io.disconnect();
        }
      },
      { threshold: 0.2 },
    );
    io.observe(section);
    this.destroyRef.onDestroy(() => io.disconnect());
  }

  private killCounters(): void {
    this.counterTweens.forEach((tween) => tween.kill());
    this.counterTweens = [];
  }

  private async initCarousel(): Promise<void> {
    const el = this.clientsCarousel()?.nativeElement;
    if (!el) {
      return;
    }

    const mod = await import('bootstrap/js/dist/carousel');
    const CarouselCtor = (mod as { default?: typeof BsCarousel }).default ?? (mod as unknown as typeof BsCarousel);
    if (typeof CarouselCtor !== 'function' || !this.clientsCarousel()?.nativeElement) {
      return;
    }

    el.querySelectorAll('.carousel-item').forEach((item, index) => {
      item.classList.toggle('active', index === 0);
    });

    this.carousel = new CarouselCtor(el, {
      interval: false,
      wrap: true,
      ride: false,
      pause: false,
      touch: true,
      keyboard: true,
    });
    this.zone.run(() => this.testimonialIndex.set(0));

    const syncIndex = (event: Event) => {
      const nextIndex = (event as unknown as BsCarousel.Event).to;
      if (typeof nextIndex !== 'number') {
        return;
      }
      this.zone.run(() => this.testimonialIndex.set(nextIndex));
    };

    el.addEventListener('slid.bs.carousel', syncIndex);
    this.destroyRef.onDestroy(() => el.removeEventListener('slid.bs.carousel', syncIndex));
    this.restartTestimonialTimer();
  }

  private restartTestimonialTimer(): void {
    this.clearTestimonialTimer();
    if (!isPlatformBrowser(this.platformId) || this.testimonialPaused || !this.carousel) {
      return;
    }
    this.testimonialTimer = setTimeout(() => {
      this.zone.run(() => {
        this.carousel?.next();
        this.restartTestimonialTimer();
      });
    }, SITE_SLIDER.intervalMs);
  }

  private clearTestimonialTimer(): void {
    if (this.testimonialTimer) {
      clearTimeout(this.testimonialTimer);
      this.testimonialTimer = null;
    }
  }
}
