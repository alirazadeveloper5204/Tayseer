import {
  Component,
  computed,
  inject,
  signal,
  ViewEncapsulation,
  afterNextRender,
  viewChild,
  DestroyRef,
  ElementRef,
  NgZone,
  PLATFORM_ID,
} from '@angular/core';
import { DOCUMENT, isPlatformBrowser } from '@angular/common';
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
import { SiteCarousel } from '../../../shared/ui/site-carousel/site-carousel';

function formatKpi(value: number, decimals: number, prefix: string, suffix: string): string {
  const body = decimals > 0 ? value.toFixed(decimals) : String(Math.round(value));
  return `${prefix}${body}${suffix}`;
}

@Component({
  selector: 'app-home-story',
  imports: [SiteCarousel],
  templateUrl: './home-story.html',
  styleUrl: './home-story.css',
  encapsulation: ViewEncapsulation.None,
})
export class HomeStory {
  private readonly locale = inject(LocaleService);
  private readonly platformId = inject(PLATFORM_ID);
  private readonly document = inject(DOCUMENT);
  private readonly destroyRef = inject(DestroyRef);
  private readonly zone = inject(NgZone);
  private readonly motion = inject(GsapService);
  readonly copy = inject(UiCopyService).copy;
  readonly isAr = computed(() => this.locale.lang() === 'ar');

  private readonly whyChooseSection = viewChild('whyChooseSection', { read: ElementRef });
  private readonly mantraSection = viewChild('mantraSection', { read: ElementRef });
  private readonly pioneerSection = viewChild('pioneerSection', { read: ElementRef });

  readonly kpiDisplays = signal(
    HOME_KPI_STATS.map((s) => formatKpi(0, s.decimals, s.prefix, s.suffix)),
  );
  readonly kpiCounting = signal(false);

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

  private counterTweens: { kill(): void }[] = [];
  private rafIds: number[] = [];
  private whyVisible = false;

  constructor() {
    afterNextRender(() => {
      if (!isPlatformBrowser(this.platformId)) {
        return;
      }

      this.watchWhyChooseCounters();
      this.watchSectionReveal(this.resolveEl(this.mantraSection()));
      this.watchSectionReveal(this.resolveEl(this.pioneerSection()));

      this.destroyRef.onDestroy(() => {
        this.killCounters();
      });
    });
  }

  private resolveEl(ref?: ElementRef<HTMLElement> | null): HTMLElement | null {
    return ref?.nativeElement ?? null;
  }

  private watchWhyChooseCounters(): void {
    const section =
      this.resolveEl(this.whyChooseSection()) ??
      this.document.getElementById('why-choose');
    if (!section) {
      return;
    }

    const sync = (inView: boolean) => {
      if (inView) {
        if (!this.whyVisible) {
          this.whyVisible = true;
          this.playWhyCounters();
        }
        return;
      }
      if (this.whyVisible) {
        this.whyVisible = false;
        this.resetWhyCounters();
      }
    };

    const io = new IntersectionObserver(
      ([entry]) => {
        sync(!!entry?.isIntersecting);
      },
      { threshold: 0.25, rootMargin: '0px 0px -12% 0px' },
    );

    io.observe(section);
    this.destroyRef.onDestroy(() => io.disconnect());

    requestAnimationFrame(() => {
      const rect = section.getBoundingClientRect();
      const vh = window.innerHeight || 0;
      if (rect.top < vh * 0.75 && rect.bottom > vh * 0.2) {
        sync(true);
      }
    });
  }

  private resetWhyCounters(): void {
    this.killCounters();
    this.zone.run(() => {
      this.kpiCounting.set(false);
      this.kpiDisplays.set(HOME_KPI_STATS.map((s) => formatKpi(0, s.decimals, s.prefix, s.suffix)));
    });
  }

  private playWhyCounters(): void {
    this.killCounters();
    this.zone.run(() => {
      this.kpiCounting.set(true);
      this.kpiDisplays.set(HOME_KPI_STATS.map((s) => formatKpi(0, s.decimals, s.prefix, s.suffix)));
    });

    if (this.motion.prefersReducedMotion()) {
      this.zone.run(() => {
        this.kpiDisplays.set(
          HOME_KPI_STATS.map((s) => formatKpi(s.value, s.decimals, s.prefix, s.suffix)),
        );
        this.kpiCounting.set(false);
      });
      return;
    }

    const api = this.motion.gsap;
    if (api) {
      this.playWithGsap(api);
      return;
    }
    this.playWithRaf();
  }

  private playWithGsap(api: NonNullable<GsapService['gsap']>): void {
    let finished = 0;
    HOME_KPI_STATS.forEach((meta, i) => {
      const state = { val: 0 };
      const tween = api.to(state, {
        val: meta.value,
        duration: 1.85,
        delay: i * 0.12,
        ease: 'power2.out',
        overwrite: 'auto',
        onUpdate: () => {
          this.zone.run(() => {
            this.kpiDisplays.update((list) => {
              const next = list.slice();
              next[i] = formatKpi(state.val, meta.decimals, meta.prefix, meta.suffix);
              return next;
            });
          });
        },
        onComplete: () => {
          finished += 1;
          this.zone.run(() => {
            this.kpiDisplays.update((list) => {
              const next = list.slice();
              next[i] = formatKpi(meta.value, meta.decimals, meta.prefix, meta.suffix);
              return next;
            });
            if (finished >= HOME_KPI_STATS.length) {
              this.kpiCounting.set(false);
            }
          });
        },
      });
      this.counterTweens.push(tween);
    });
  }

  private playWithRaf(): void {
    const durationMs = 1850;
    let finished = 0;

    HOME_KPI_STATS.forEach((meta, i) => {
      const delayMs = i * 120;
      const startAt = performance.now() + delayMs;

      const tick = (now: number) => {
        if (now < startAt) {
          this.rafIds.push(requestAnimationFrame(tick));
          return;
        }
        const t = Math.min(1, (now - startAt) / durationMs);
        const eased = 1 - Math.pow(1 - t, 3);
        const val = meta.value * eased;
        this.zone.run(() => {
          this.kpiDisplays.update((list) => {
            const next = list.slice();
            next[i] = formatKpi(val, meta.decimals, meta.prefix, meta.suffix);
            return next;
          });
        });
        if (t < 1) {
          this.rafIds.push(requestAnimationFrame(tick));
          return;
        }
        finished += 1;
        this.zone.run(() => {
          this.kpiDisplays.update((list) => {
            const next = list.slice();
            next[i] = formatKpi(meta.value, meta.decimals, meta.prefix, meta.suffix);
            return next;
          });
          if (finished >= HOME_KPI_STATS.length) {
            this.kpiCounting.set(false);
          }
        });
      };

      this.rafIds.push(requestAnimationFrame(tick));
    });
  }

  private watchSectionReveal(section?: HTMLElement | null): void {
    if (!section) {
      return;
    }
    if (this.motion.prefersReducedMotion()) {
      section.classList.add('is-revealed');
      return;
    }

    const reveal = () => {
      section.classList.add('is-revealed');
    };

    const io = new IntersectionObserver(
      ([entry]) => {
        if (entry?.isIntersecting) {
          reveal();
          io.disconnect();
        }
      },
      { threshold: 0.12, rootMargin: '0px 0px -8% 0px' },
    );
    io.observe(section);

    requestAnimationFrame(() => {
      const rect = section.getBoundingClientRect();
      const vh = window.innerHeight || 0;
      if (rect.top < vh * 0.92 && rect.bottom > vh * 0.08) {
        reveal();
        io.disconnect();
      }
    });

    this.destroyRef.onDestroy(() => io.disconnect());
  }

  private killCounters(): void {
    this.counterTweens.forEach((tween) => tween.kill());
    this.counterTweens = [];
    this.rafIds.forEach((id) => cancelAnimationFrame(id));
    this.rafIds = [];
  }
}
