import { Component, computed, inject, signal, afterNextRender, DestroyRef, PLATFORM_ID } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { RouterLink, RouterLinkActive, Router } from '@angular/router';
import { LocaleService, AppLocale } from '../../core/i18n/locale.service';
import { ThemeService } from '../../core/theme/theme.service';
import { UiCopyService } from '../../core/i18n/ui-copy.service';
import { SOLUTION_LINKS } from '../../core/i18n/ui-copy';
import { ChromeScrollService } from '../../core/navigation/chrome-scroll.service';

@Component({
  selector: 'app-site-header',
  imports: [RouterLink, RouterLinkActive],
  templateUrl: './site-header.html',
  styleUrl: './site-header.css',
})
export class SiteHeader {
  private readonly router = inject(Router);
  readonly locale = inject(LocaleService);
  readonly theme = inject(ThemeService);
  readonly copy = inject(UiCopyService).copy;
  readonly chromeScroll = inject(ChromeScrollService);
  private readonly platformId = inject(PLATFORM_ID);
  private readonly destroyRef = inject(DestroyRef);

  readonly menuOpen = signal(false);
  readonly solutionsOpen = signal(false);

  readonly lang = computed(() => this.locale.lang());

  /** Scroll-spy for the Home page sections only. */
  readonly scrollActive = signal<'home' | 'solutions' | 'about' | 'clients' | null>(null);

  readonly solutionLinks = computed(() => {
    const isAr = this.locale.lang() === 'ar';
    return SOLUTION_LINKS.map((item) => ({
      slug: item.slug,
      title: isAr ? item.titleAr : item.titleEn,
      path: `/${this.locale.lang()}/solutions/${item.slug}`,
    }));
  });

  toggleMenu(): void {
    this.menuOpen.update((v) => !v);
    if (!this.menuOpen()) {
      this.solutionsOpen.set(false);
    }
  }

  closeMenu(): void {
    this.menuOpen.set(false);
    this.solutionsOpen.set(false);
  }

  toggleSolutions(): void {
    this.solutionsOpen.update((v) => !v);
  }

  switchLocale(): void {
    const next: AppLocale = this.locale.lang() === 'en' ? 'ar' : 'en';
    const url = this.router.url;
    const updated = url.replace(/^\/(en|ar)(?=\/|$)/, `/${next}`);
    // Locale is applied in localeGuard after the overlay has covered the page.
    void this.router.navigateByUrl(updated.startsWith(`/${next}`) ? updated : `/${next}`);
    this.closeMenu();
  }

  constructor() {
    afterNextRender(() => {
      if (!isPlatformBrowser(this.platformId)) {
        return;
      }

      const getActiveForHome = (): boolean => {
        const url = this.router.url.split('?')[0].split('#')[0];
        const lang = this.locale.lang();
        const home = `/${lang}`;
        return url === home || url === `${home}/`;
      };

      let enabled = getActiveForHome();

      const syncEnabled = () => {
        enabled = getActiveForHome();
        if (!enabled) {
          this.scrollActive.set(null);
        }
      };

      syncEnabled();
      const sub = this.router.events.subscribe(() => syncEnabled());
      this.destroyRef.onDestroy(() => sub.unsubscribe());

      const sectionIds: Array<'home' | 'solutions' | 'about' | 'clients'> = ['home', 'solutions', 'about', 'clients'];
      const sections = sectionIds
        .map((id) => document.getElementById(id))
        .filter((el): el is HTMLElement => !!el);

      if (sections.length === 0) {
        return;
      }

      const ratios = new Map<string, number>();

      const observer = new IntersectionObserver(
        (entries) => {
          if (!enabled) {
            return;
          }

          let bestId: typeof sectionIds[number] | null = null;
          let bestRatio = 0;

          for (const entry of entries) {
            const id = (entry.target as HTMLElement).id;
            ratios.set(id, entry.intersectionRatio);
          }

          for (const id of sectionIds) {
            const r = ratios.get(id) ?? 0;
            if (r > bestRatio) {
              bestRatio = r;
              bestId = id;
            }
          }

          if (bestId && bestRatio > 0.15) {
            this.scrollActive.set(bestId);
          }
        },
        {
          threshold: [0, 0.15, 0.3, 0.5, 0.75],
          rootMargin: '-15% 0px -65% 0px',
        }
      );

      for (const el of sections) {
        observer.observe(el);
      }

      this.destroyRef.onDestroy(() => observer.disconnect());
    });
  }
}
