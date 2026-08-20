import { Component, computed, effect, inject } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { LocaleService, localeFromPath } from '../../core/i18n/locale.service';
import { NOT_FOUND_PAGE, PAGE_COMMON, t, type PageLocale } from '../../core/content/page-content';
import { SeoService } from '../../core/seo/seo.service';
import { injectSsrResponseInit, setSsrStatus } from '../../core/seo/ssr-status';

@Component({
  selector: 'app-not-found-page',
  imports: [RouterLink],
  template: `
    <section
      class="relative isolate flex min-h-[min(36rem,calc(100svh-var(--site-chrome-offset-expanded)))] items-center justify-center overflow-hidden bg-grid bg-[length:2.5rem_2.5rem] px-fluid-md py-fluid-3xl dark:bg-grid-dark"
      [attr.lang]="lang()"
      [attr.dir]="lang() === 'ar' ? 'rtl' : 'ltr'"
      aria-labelledby="not-found-title"
    >
      <div
        class="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_center,transparent_0%,var(--surface-light)_72%)] dark:bg-[radial-gradient(circle_at_center,transparent_0%,var(--surface-dark)_74%)]"
        aria-hidden="true"
      ></div>

      <div class="relative z-10 mx-auto w-full max-w-xl text-center">
        <p
          class="inline-flex items-center justify-center border border-brand-blue/25 bg-white px-fluid-md py-fluid-sm font-mono text-[0.72rem] font-medium tracking-[0.14em] text-brand-blue-800 uppercase sm:text-fluid-sm dark:border-brand-cyan/35 dark:bg-surface-dark-elevated dark:text-brand-cyan"
          aria-hidden="true"
        >
          {{ status }}
        </p>

        <h1
          id="not-found-title"
          class="mt-fluid-lg font-display text-fluid-3xl font-bold tracking-tight text-brand-blue-800 dark:text-white"
          [class.font-arabic]="lang() === 'ar'"
        >
          {{ title() }}
        </h1>

        <p
          class="mx-auto mt-fluid-sm max-w-md text-fluid-base font-medium leading-relaxed text-ink-soft dark:text-ink-inverse/80"
          [class.font-arabic]="lang() === 'ar'"
        >
          {{ lead() }}
        </p>

        <a
          [routerLink]="homeLink()"
          class="mt-fluid-lg inline-flex items-center justify-center gap-2 border border-brand-blue bg-brand-blue px-fluid-lg py-fluid-sm text-fluid-sm font-semibold text-white transition-[background-color,border-color,transform] duration-200 hover:border-brand-blue-800 hover:bg-brand-blue-800 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-green dark:border-brand-cyan dark:bg-transparent dark:text-brand-cyan dark:hover:bg-brand-cyan/10"
        >
          <span [class.font-arabic]="lang() === 'ar'">{{ cta() }}</span>
          <svg
            class="h-4 w-4 shrink-0 rtl:rotate-180"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            stroke-width="2"
            aria-hidden="true"
          >
            <path d="M5 12h14M13 6l6 6-6 6" stroke-linecap="round" stroke-linejoin="round" />
          </svg>
        </a>
      </div>
    </section>
  `,
})
export class NotFoundPage {
  private readonly locale = inject(LocaleService);
  private readonly router = inject(Router);
  private readonly seo = inject(SeoService);
  readonly status = NOT_FOUND_PAGE.status;
  readonly lang = computed(() => this.locale.lang() as PageLocale);
  readonly homeLink = computed(() => `/${this.lang()}`);
  readonly title = computed(() => t(NOT_FOUND_PAGE.title, this.lang()));
  readonly lead = computed(() => t(NOT_FOUND_PAGE.lead, this.lang()));
  readonly cta = computed(() => t(NOT_FOUND_PAGE.cta, this.lang()));

  constructor() {
    setSsrStatus(injectSsrResponseInit(), 404);
    const fromUrl = localeFromPath(this.router.url);
    if (fromUrl) {
      this.locale.setLocale(fromUrl);
    }
    effect(() => {
      const lang = this.lang();
      const path = (this.router.url || `/${lang}`).split('?')[0];
      this.seo.apply({
        lang,
        urlPath: path.startsWith('/') ? path : `/${path}`,
        title: t(PAGE_COMMON.pageNotFoundTitle, lang),
        description: t(PAGE_COMMON.pageNotFoundLead, lang),
        noIndex: true,
      });
    });
  }
}
