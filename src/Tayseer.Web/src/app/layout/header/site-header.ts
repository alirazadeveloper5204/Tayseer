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
import { RouterLink, RouterLinkActive, Router, NavigationEnd } from '@angular/router';
import { filter } from 'rxjs/operators';
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
  readonly menuOpen = signal(false);
  private closeTimer: ReturnType<typeof setTimeout> | null = null;

  readonly lang = computed(() => this.locale.lang());

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
    this.menuOpen.set(false);
    this.unlockBodyScroll();
  }

  toggleMenu(event?: Event): void {
    event?.preventDefault();
    event?.stopPropagation();
    this.clearCloseTimer();
    this.activeDropdown.set(null);
    const next = !this.menuOpen();
    this.menuOpen.set(next);
    if (next) {
      this.lockBodyScroll();
    } else {
      this.unlockBodyScroll();
    }
  }

  private lockBodyScroll(): void {
    if (!isPlatformBrowser(this.platformId)) {
      return;
    }
    document.documentElement.classList.add('nav-menu-open');
  }

  private unlockBodyScroll(): void {
    if (!isPlatformBrowser(this.platformId)) {
      return;
    }
    document.documentElement.classList.remove('nav-menu-open');
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

      const navSub = this.router.events
        .pipe(filter((e): e is NavigationEnd => e instanceof NavigationEnd))
        .subscribe(() => this.closeMenu());
      this.destroyRef.onDestroy(() => navSub.unsubscribe());

      const onDocClick = (event: MouseEvent) => {
        const target = event.target as Node | null;
        const root = document.querySelector('app-site-header');
        if (root && target && !root.contains(target)) {
          this.closeMenu();
        }
      };
      document.addEventListener('click', onDocClick);

      const onKey = (event: KeyboardEvent) => {
        if (event.key === 'Escape') {
          this.closeMenu();
        }
      };
      document.addEventListener('keydown', onKey);

      this.destroyRef.onDestroy(() => {
        document.removeEventListener('click', onDocClick);
        document.removeEventListener('keydown', onKey);
        this.clearCloseTimer();
        this.unlockBodyScroll();
      });
    });
  }
}
