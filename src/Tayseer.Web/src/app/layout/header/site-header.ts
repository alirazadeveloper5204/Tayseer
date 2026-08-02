import { Component, computed, inject, signal } from '@angular/core';
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

  readonly menuOpen = signal(false);
  readonly solutionsOpen = signal(false);

  readonly lang = computed(() => this.locale.lang());

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
}
