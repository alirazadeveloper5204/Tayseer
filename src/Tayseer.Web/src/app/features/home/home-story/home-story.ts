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
  PLATFORM_ID,
} from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { RouterLink } from '@angular/router';
import { LocaleService } from '../../../core/i18n/locale.service';
import { UiCopyService } from '../../../core/i18n/ui-copy.service';
import {
  HOME_DEPLOY,
  HOME_MANTRA,
  HOME_STATS,
  HOME_TESTIMONIALS,
  HOME_VALUES,
} from '../../../core/i18n/ui-copy';

@Component({
  selector: 'app-home-story',
  imports: [RouterLink],
  templateUrl: './home-story.html',
  styleUrl: './home-story.css',
  encapsulation: ViewEncapsulation.None,
})
export class HomeStory {
  private readonly locale = inject(LocaleService);
  private readonly platformId = inject(PLATFORM_ID);
  private readonly destroyRef = inject(DestroyRef);
  readonly copy = inject(UiCopyService).copy;
  readonly lang = computed(() => this.locale.lang());
  readonly isAr = computed(() => this.locale.lang() === 'ar');

  private readonly aboutVisual = viewChild<ElementRef<HTMLElement>>('aboutVisual');
  private readonly quoteVisual = viewChild<ElementRef<HTMLElement>>('quoteVisual');

  readonly aboutInView = signal(false);
  readonly quoteInView = signal(false);

  readonly stats = computed(() =>
    HOME_STATS.map((s, i) => ({
      id: i,
      value: s.value,
      suffix: s.suffix,
      label: this.isAr() ? s.labelAr : s.labelEn,
    })),
  );

  readonly testimonials = computed(() =>
    HOME_TESTIMONIALS.map((t, i) => ({
      id: i,
      name: t.name,
      role: this.isAr() ? t.roleAr : t.roleEn,
      quote: this.isAr() ? t.quoteAr : t.quoteEn,
    })),
  );

  readonly values = computed(() =>
    HOME_VALUES.map((v, i) => ({
      id: i,
      title: this.isAr() ? v.titleAr : v.titleEn,
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

  readonly testimonialIndex = signal(0);

  readonly activeTestimonial = computed(() => {
    const list = this.testimonials();
    return list[this.testimonialIndex() % list.length];
  });

  constructor() {
    afterNextRender(() => {
      if (!isPlatformBrowser(this.platformId)) {
        return;
      }

      const observers: IntersectionObserver[] = [];
      const watch = (
        el: HTMLElement | undefined,
        setVisible: (value: boolean) => void,
      ) => {
        if (!el) {
          return;
        }
        const io = new IntersectionObserver(
          ([entry]) => {
            if (entry?.isIntersecting) {
              setVisible(true);
              io.unobserve(el);
            }
          },
          { threshold: 0.35 },
        );
        io.observe(el);
        observers.push(io);
      };

      watch(this.aboutVisual()?.nativeElement, (v) => this.aboutInView.set(v));
      watch(this.quoteVisual()?.nativeElement, (v) => this.quoteInView.set(v));

      this.destroyRef.onDestroy(() => observers.forEach((o) => o.disconnect()));
    });
  }

  prevTestimonial(): void {
    const len = this.testimonials().length;
    this.testimonialIndex.update((i) => (i - 1 + len) % len);
  }

  nextTestimonial(): void {
    const len = this.testimonials().length;
    this.testimonialIndex.update((i) => (i + 1) % len);
  }
}
