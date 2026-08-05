import {
  Component,
  computed,
  inject,
  signal,
  afterNextRender,
  DestroyRef,
  PLATFORM_ID,
} from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { RouterLink, RouterLinkActive, Router } from '@angular/router';
import { LocaleService, AppLocale } from '../../core/i18n/locale.service';
import { ThemeService } from '../../core/theme/theme.service';
import { UiCopyService } from '../../core/i18n/ui-copy.service';
import { SERVICE_LINKS, SOLUTION_LINKS } from '../../core/i18n/ui-copy';
import { solutionPath } from '../../core/content/static-services';
import { ChromeScrollService } from '../../core/navigation/chrome-scroll.service';

type NavDropdown = 'services' | 'solutions';

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

  readonly activeDropdown = signal<NavDropdown | null>(null);
  private closeTimer: ReturnType<typeof setTimeout> | null = null;

  readonly lang = computed(() => this.locale.lang());

  /** Scroll-spy for the Home page sections only. */
  readonly scrollActive = signal<'home' | 'solutions' | 'clients' | null>(null);

  readonly serviceLinks = computed(() => {
    const isAr = this.locale.lang() === 'ar';
    const lang = this.locale.lang();
    return SERVICE_LINKS.map((item) => {
      const [pathPart, fragment] = item.href.split('#');
      return {
        slug: item.slug,
        title: isAr ? item.titleAr : item.titleEn,
        path: `/${lang}/${pathPart}`,
        fragment: fragment || undefined,
      };
    });
  });

  readonly solutionLinks = computed(() => {
    const isAr = this.locale.lang() === 'ar';
    const lang = this.locale.lang();
    return SOLUTION_LINKS.map((item) => ({
      slug: item.slug,
      title: isAr ? item.titleAr : item.titleEn,
      path: solutionPath(lang, item.slug),
    }));
  });

  openDropdown(which: NavDropdown): void {
    this.clearCloseTimer();
    this.activeDropdown.set(which);
  }

  keepDropdownOpen(): void {
    this.clearCloseTimer();
  }

  scheduleDropdownClose(): void {
    this.clearCloseTimer();
    this.closeTimer = setTimeout(() => this.activeDropdown.set(null), 160);
  }

  toggleDropdown(which: NavDropdown, event: Event): void {
    event.preventDefault();
    event.stopPropagation();
    this.clearCloseTimer();
    this.activeDropdown.update((current) => (current === which ? null : which));
  }

  closeMenu(): void {
    this.clearCloseTimer();
    this.activeDropdown.set(null);
  }

  private clearCloseTimer(): void {
    if (this.closeTimer !== null) {
      clearTimeout(this.closeTimer);
      this.closeTimer = null;
    }
  }

  switchLocale(): void {
    const next: AppLocale = this.locale.lang() === 'en' ? 'ar' : 'en';
    const url = this.router.url;
    const updated = url.replace(/^\/(en|ar)(?=\/|$)/, `/${next}`);
    void this.router.navigateByUrl(updated.startsWith(`/${next}`) ? updated : `/${next}`);
    this.closeMenu();
  }

  constructor() {
    afterNextRender(() => {
      if (!isPlatformBrowser(this.platformId)) {
        return;
      }

      const onDocClick = (event: MouseEvent) => {
        const target = event.target as Node | null;
        const root = document.querySelector('app-site-header');
        if (root && target && !root.contains(target)) {
          this.closeMenu();
        }
      };
      document.addEventListener('click', onDocClick);
      this.destroyRef.onDestroy(() => {
        document.removeEventListener('click', onDocClick);
        this.clearCloseTimer();
      });

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

      const sectionIds: Array<'home' | 'solutions' | 'clients'> = [
        'home',
        'solutions',
        'clients',
      ];
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

          let bestId: (typeof sectionIds)[number] | null = null;
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
