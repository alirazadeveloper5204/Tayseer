import { Component, computed, effect, inject } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { map } from 'rxjs';
import { LocaleService } from '../../core/i18n/locale.service';
import { SeoService, breadcrumbList } from '../../core/seo/seo.service';
import { injectSsrResponseInit, setSsrStatus } from '../../core/seo/ssr-status';
import {
  CASE_STUDIES_PAGE,
  PAGE_COMMON,
  t,
  type PageLocale,
} from '../../core/content/page-content';
import { environment } from '../../../environments/environment';

@Component({
  selector: 'app-case-study-detail-page',
  imports: [RouterLink],
  templateUrl: './case-study-detail-page.html',
})
export class CaseStudyDetailPage {
  private readonly locale = inject(LocaleService);
  private readonly route = inject(ActivatedRoute);
  private readonly seo = inject(SeoService);
  private readonly ssrResponse = injectSsrResponseInit();
  readonly lang = computed(() => this.locale.lang() as PageLocale);
  readonly common = PAGE_COMMON;
  readonly filters = CASE_STUDIES_PAGE.filters;

  private readonly slug = toSignal(this.route.paramMap.pipe(map((p) => p.get('slug') ?? '')), {
    initialValue: '',
  });

  readonly item = computed(() => CASE_STUDIES_PAGE.items.find((c) => c.slug === this.slug()) ?? null);

  constructor() {
    effect(() => {
      const item = this.item();
      const lang = this.lang();
      const slug = this.slug();
      if (!slug) {
        return;
      }
      if (!item) {
        setSsrStatus(this.ssrResponse, 404);
        this.seo.apply({
          lang,
          urlPath: `/${lang}/case-studies/${slug}`,
          title: t(this.common.notFound, lang),
          description: t(this.common.pageNotFoundLead, lang),
          noIndex: true,
        });
        return;
      }
      const titleText = t(item.title, lang);
      const summary = t(item.summary, lang);
      const siteUrl = environment.siteUrl.replace(/\/$/, '');
      this.seo.apply({
        lang,
        urlPath: `/${lang}/case-studies/${item.slug}`,
        title:
          lang === 'ar'
            ? `${titleText} | دراسة حالة | تيسير للابتكارات`
            : `${titleText} | Case Study | Tayseer Innovations`,
        description: summary,
        ogType: 'article',
        imagePath: this.sideImage(),
        jsonLd: [
          {
            '@type': 'Article',
            headline: titleText,
            description: summary,
            url: `${siteUrl}/${lang}/case-studies/${item.slug}`,
            author: { '@id': `${siteUrl}/#organization` },
            publisher: { '@id': `${siteUrl}/#organization` },
          },
          breadcrumbList(siteUrl, [
            { name: lang === 'ar' ? 'الرئيسية' : 'Home', path: `/${lang}` },
            { name: t(CASE_STUDIES_PAGE.title, lang), path: `/${lang}/case-studies` },
            { name: titleText, path: `/${lang}/case-studies/${item.slug}` },
          ]),
        ],
      });
    });
  }

  readonly sideImage = computed(() => {
    const sector = this.item()?.sector;
    if (sector === 'fintech') return '/images/hero-mbuke-main.jpg';
    if (sector === 'managed') return '/images/hero-managed-main.jpg';
    return '/images/hero-banking-side.jpg';
  });

  label(item: { en: string; ar: string }): string {
    return t(item, this.lang());
  }

  sectorLabel(sector: string): string {
    const match = this.filters.find((f) => f.id === sector);
    return match ? t(match.label, this.lang()) : sector;
  }
}
