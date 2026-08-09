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
  PLATFORM_ID,
  ChangeDetectorRef,
} from '@angular/core';
import { DOCUMENT, isPlatformBrowser } from '@angular/common';
import { LocaleService } from '../../../core/i18n/locale.service';
import { UiCopyService } from '../../../core/i18n/ui-copy.service';
import {
  HOME_DEPLOY,
  HOME_JOURNEY,
  HOME_KPI_STATS,
  HOME_MANTRA,
  HOME_PARTNERS,
  HOME_TESTIMONIALS,
  HOME_WHY_FEATURES,
} from '../../../core/i18n/ui-copy';
import { CLIENT_GALLERIES } from '../../../core/media/site-images';
import { GsapService } from '../../../core/motion/gsap.service';
import { ThemeService } from '../../../core/theme/theme.service';
import { SiteCarousel } from '../../../shared/ui/site-carousel/site-carousel';
import { RouterLink } from '@angular/router';

function formatKpi(value: number, decimals: number, prefix: string, suffix: string): string {
  const body = decimals > 0 ? value.toFixed(decimals) : String(Math.round(value));
  return `${prefix}${body}${suffix}`;
}

const KPI_ZEROS = HOME_KPI_STATS.map((s) => formatKpi(0, s.decimals, s.prefix, s.suffix));
const KPI_FINALS = HOME_KPI_STATS.map((s) => formatKpi(s.value, s.decimals, s.prefix, s.suffix));

@Component({
  selector: 'app-home-story',
  imports: [SiteCarousel, RouterLink],
  templateUrl: './home-story.html',
  styleUrl: './home-story.css',
  encapsulation: ViewEncapsulation.None,
})
export class HomeStory {
  private readonly locale = inject(LocaleService);
  private readonly theme = inject(ThemeService);
  private readonly platformId = inject(PLATFORM_ID);
  private readonly document = inject(DOCUMENT);
  private readonly destroyRef = inject(DestroyRef);
  private readonly cdr = inject(ChangeDetectorRef);
  private readonly motion = inject(GsapService);
  readonly copy = inject(UiCopyService).copy;
  readonly isAr = computed(() => this.locale.lang() === 'ar');
  readonly lang = computed(() => this.locale.lang());
  readonly isDark = this.theme.isDark;

  private readonly whyChooseSection = viewChild('whyChooseSection', { read: ElementRef });
  private readonly whyChooseKpis = viewChild('whyChooseKpis', { read: ElementRef });
  private readonly partnersSection = viewChild('partnersSection', { read: ElementRef });
  private readonly journeySection = viewChild('journeySection', { read: ElementRef });
  private readonly mantraSection = viewChild('mantraSection', { read: ElementRef });
  private readonly pioneerSection = viewChild('pioneerSection', { read: ElementRef });

  /** Start at finals so SSR / failed observers never leave the UI stuck on 0. */
  readonly kpiDisplays = signal<string[]>([...KPI_FINALS]);
  readonly kpiCounting = signal(false);

  readonly featuredPartner = computed(() => {
    const partner = HOME_PARTNERS.find((p) => p.featured) ?? HOME_PARTNERS[0];
    return {
      id: partner.id,
      name: partner.name,
      logo: this.isDark() ? partner.logoDark : partner.logo,
      tone: partner.tone as 'dark' | 'light',
      badge: this.isAr() ? partner.badgeAr : partner.badgeEn,
      href: partner.solutionSlug ? `/${this.lang()}/solutions/${partner.solutionSlug}` : null,
    };
  });

  readonly partnerGrid = computed(() =>
    HOME_PARTNERS.filter((p) => !p.featured).map((p) => ({
      id: p.id,
      name: p.name,
      logo: this.isDark() ? p.logoDark : p.logo,
    })),
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

  readonly journeyIndex = signal(0);
  private journeyTimer: ReturnType<typeof setInterval> | null = null;
  private journeyPaused = false;
  private journeyPointerInside = false;
  private journeyFocusInside = false;

  readonly journey = computed(() =>
    HOME_JOURNEY.map((step, i) => ({
      id: i,
      step: String(i + 1).padStart(2, '0'),
      title: this.isAr() ? step.titleAr : step.titleEn,
      body: this.isAr() ? step.bodyAr : step.bodyEn,
      outcome: this.isAr() ? step.outcomeAr : step.outcomeEn,
    })),
  );

  readonly activeJourney = computed(() => {
    const steps = this.journey();
    return steps[this.journeyIndex()] ?? steps[0];
  });

  selectJourney(index: number): void {
    if (index < 0 || index >= HOME_JOURNEY.length) {
      return;
    }
    this.journeyIndex.set(index);
    this.cdr.detectChanges();
    this.restartJourneyTimer();
  }

  onJourneyPointerEnter(): void {
    this.journeyPointerInside = true;
    this.pauseJourney();
  }

  onJourneyPointerLeave(event: MouseEvent): void {
    this.journeyPointerInside = false;
    this.scheduleTryResumeJourney(event.currentTarget as HTMLElement | null);
  }

  onJourneyFocusIn(): void {
    this.journeyFocusInside = true;
    this.pauseJourney();
  }

  onJourneyFocusOut(event: FocusEvent): void {
    const stage = event.currentTarget as HTMLElement | null;
    const next = event.relatedTarget as Node | null;
    if (stage && next && stage.contains(next)) {
      this.journeyFocusInside = true;
      return;
    }
    this.scheduleTryResumeJourney(stage);
  }

  private scheduleTryResumeJourney(stage: HTMLElement | null): void {
    queueMicrotask(() => this.tryResumeJourney(stage));
  }

  private isJourneyFocusInside(stage: HTMLElement | null): boolean {
    if (!stage) {
      return false;
    }
    if (typeof stage.matches === 'function' && stage.matches(':focus-within')) {
      return true;
    }
    const active = this.document.activeElement;
    return !!active && stage.contains(active);
  }

  private tryResumeJourney(stage: HTMLElement | null): void {
    this.journeyFocusInside = this.isJourneyFocusInside(stage);
    if (this.journeyPointerInside || this.journeyFocusInside) {
      return;
    }
    this.resumeJourney();
  }

  private pauseJourney(): void {
    this.journeyPaused = true;
    this.clearJourneyTimer();
  }

  private resumeJourney(): void {
    this.journeyPaused = false;
    this.restartJourneyTimer();
  }

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

  private rafIds: number[] = [];
  private counterRunId = 0;
  private whyVisible = false;
  private counterObserver: IntersectionObserver | null = null;
  private counterSafetyId: number | null = null;

  constructor() {
    afterNextRender(() => {
      if (!isPlatformBrowser(this.platformId)) {
        return;
      }

      this.bootstrapWhyChooseCounters();
      this.watchJourneySection();
      this.watchSectionReveal(this.resolveEl(this.partnersSection()));
      this.watchSectionReveal(this.resolveEl(this.mantraSection()));
      this.watchSectionReveal(this.resolveEl(this.pioneerSection()));

      this.destroyRef.onDestroy(() => {
        this.counterRunId += 1;
        this.clearCounterSafety();
        this.killCounters();
        this.counterObserver?.disconnect();
        this.counterObserver = null;
        this.clearJourneyTimer();
      });
    });
  }

  private watchJourneySection(): void {
    const section =
      this.resolveEl(this.journeySection()) ?? this.document.getElementById('journey');
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
          this.restartJourneyTimer();
          return;
        }
        this.clearJourneyTimer();
      },
      { threshold: 0.2, rootMargin: '0px 0px -8% 0px' },
    );
    io.observe(section);
    this.destroyRef.onDestroy(() => {
      io.disconnect();
      this.clearJourneyTimer();
    });
  }

  private restartJourneyTimer(): void {
    this.clearJourneyTimer();
    if (!isPlatformBrowser(this.platformId) || this.journeyPaused || this.motion.prefersReducedMotion()) {
      return;
    }
    this.journeyTimer = setInterval(() => {
      const next = (this.journeyIndex() + 1) % HOME_JOURNEY.length;
      this.journeyIndex.set(next);
      this.cdr.detectChanges();
    }, 5200);
  }

  private clearJourneyTimer(): void {
    if (this.journeyTimer) {
      clearInterval(this.journeyTimer);
      this.journeyTimer = null;
    }
  }

  private resolveEl(ref?: ElementRef<HTMLElement> | null): HTMLElement | null {
    return ref?.nativeElement ?? null;
  }

  private kpiRoot(): HTMLElement | null {
    return (
      this.resolveEl(this.whyChooseKpis()) ??
      this.document.getElementById('whyChooseKpis') ??
      this.document.querySelector<HTMLElement>('#why-choose .why-choose__kpis')
    );
  }

  private paintKpis(values: readonly string[], counting: boolean): void {
    this.kpiDisplays.set([...values]);
    this.kpiCounting.set(counting);

    const root = this.kpiRoot();
    if (!root) {
      try {
        this.cdr.detectChanges();
      } catch {
        /* view may be detached during teardown */
      }
      return;
    }

    const nodes = root.querySelectorAll<HTMLElement>('.why-choose__kpi-value');
    nodes.forEach((node, i) => {
      const next = values[i];
      if (next != null) {
        node.textContent = next;
      }
      node.classList.toggle('is-counting', counting);
    });
  }

  private bootstrapWhyChooseCounters(): void {
    const win = this.document.defaultView;
    if (!win) {
      this.paintKpis(KPI_FINALS, false);
      return;
    }

    let tries = 0;
    const maxTries = 80;

    const attempt = () => {
      const target = this.kpiRoot();
      if (!target || !target.isConnected) {
        tries += 1;
        if (tries >= maxTries) {
          this.paintKpis(KPI_FINALS, false);
          return;
        }
        win.setTimeout(attempt, 50);
        return;
      }

      this.observeWhyChooseCounters(target);
    };

    // Wait one frame so hydrated DOM + viewChild are settled.
    win.requestAnimationFrame(() => attempt());
  }

  private observeWhyChooseCounters(target: HTMLElement): void {
    this.counterObserver?.disconnect();
    this.counterObserver = new IntersectionObserver(
      (entries) => {
        const entry = entries.find((e) => e.target === target) ?? entries[0];
        if (!entry) {
          return;
        }

        if (entry.isIntersecting) {
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
      },
      {
        // KPI strip is short — 20% of it is easy to hit when it enters the viewport.
        threshold: [0, 0.2, 0.4, 0.6, 1],
      },
    );
    this.counterObserver.observe(target);

    const rect = target.getBoundingClientRect();
    const vh = this.document.defaultView?.innerHeight ?? 0;
    const alreadyInView = vh > 0 && rect.top < vh && rect.bottom > 0 && rect.height > 0;
    if (alreadyInView) {
      this.whyVisible = true;
      this.playWhyCounters();
    } else {
      this.resetWhyCounters();
    }
  }

  private playWhyCounters(): void {
    this.clearCounterSafety();
    this.killCounters();
    const runId = ++this.counterRunId;

    this.paintKpis(KPI_ZEROS, true);

    if (this.motion.prefersReducedMotion()) {
      this.paintKpis(KPI_FINALS, false);
      return;
    }

    const durationMs = 1500;
    const staggerMs = 80;
    const startedAt = performance.now();
    const win = this.document.defaultView;

    const finish = () => {
      if (runId !== this.counterRunId) {
        return;
      }
      this.clearCounterSafety();
      this.killCounters();
      this.paintKpis(KPI_FINALS, false);
    };

    this.counterSafetyId =
      win?.setTimeout(finish, durationMs + staggerMs * HOME_KPI_STATS.length + 500) ?? null;

    const tick = (now: number) => {
      if (runId !== this.counterRunId) {
        return;
      }

      const displays = HOME_KPI_STATS.map((meta, i) => {
        const local = Math.min(1, Math.max(0, (now - startedAt - i * staggerMs) / durationMs));
        const eased = 1 - Math.pow(1 - local, 3);
        return formatKpi(meta.value * eased, meta.decimals, meta.prefix, meta.suffix);
      });

      // Direct DOM paint — reliable in zoneless Angular (signals alone may not re-render from rAF).
      this.paintKpis(displays, true);

      const done = now - startedAt >= durationMs + staggerMs * (HOME_KPI_STATS.length - 1);
      if (!done) {
        this.rafIds.push(requestAnimationFrame(tick));
        return;
      }

      finish();
    };

    this.rafIds.push(requestAnimationFrame(tick));
  }

  private resetWhyCounters(): void {
    this.clearCounterSafety();
    this.counterRunId += 1;
    this.killCounters();
    this.paintKpis(KPI_ZEROS, false);
  }

  private clearCounterSafety(): void {
    if (this.counterSafetyId != null) {
      this.document.defaultView?.clearTimeout(this.counterSafetyId);
      this.counterSafetyId = null;
    }
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
    this.rafIds.forEach((id) => cancelAnimationFrame(id));
    this.rafIds = [];
  }
}
