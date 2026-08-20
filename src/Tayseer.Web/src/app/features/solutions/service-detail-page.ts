import { Component, computed, effect, inject } from '@angular/core';
import { toObservable, toSignal } from '@angular/core/rxjs-interop';
import { HttpErrorResponse } from '@angular/common/http';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { catchError, combineLatest, map, of, startWith, switchMap } from 'rxjs';
import { ContentApiService } from '../../core/api/content-api.service';
import { LocaleService } from '../../core/i18n/locale.service';
import { UiCopyService } from '../../core/i18n/ui-copy.service';
import { SeoService, breadcrumbList } from '../../core/seo/seo.service';
import { injectSsrResponseInit, setSsrStatus } from '../../core/seo/ssr-status';
import { SOLUTIONS_PAGE, PAGE_COMMON, t, type PageLocale } from '../../core/content/page-content';
import { serviceImage, serviceHeroCollage } from '../../core/media/site-images';
import { ServiceDto } from '../../models/service.model';
import { environment } from '../../../environments/environment';

@Component({
  selector: 'app-service-detail-page',
  imports: [RouterLink],
  templateUrl: './service-detail-page.html',
})
export class ServiceDetailPage {
  private readonly route = inject(ActivatedRoute);
  private readonly api = inject(ContentApiService);
  private readonly locale = inject(LocaleService);
  private readonly seo = inject(SeoService);
  private readonly ssrResponse = injectSsrResponseInit();
  readonly copy = inject(UiCopyService).copy;
  readonly c = SOLUTIONS_PAGE;
  readonly common = PAGE_COMMON;

  readonly lang = computed(() => this.locale.lang() as PageLocale);
  readonly isAr = computed(() => this.locale.lang() === 'ar');

  constructor() {
    effect(() => {
      const status = this.load().status;
      const s = this.service();
      const lang = this.lang();
      if (status === 'loading') {
        return;
      }
      if (status === 'error') {
        setSsrStatus(this.ssrResponse, 503);
        return;
      }
      if (status === 'notfound' || !s) {
        setSsrStatus(this.ssrResponse, 404);
        this.seo.apply({
          lang,
          urlPath: `/${lang}/solutions/${this.route.snapshot.paramMap.get('slug') ?? ''}`,
          title: t(this.common.solutionNotFound, lang),
          description: t(this.common.pageNotFoundLead, lang),
          noIndex: true,
        });
        return;
      }
      const siteUrl = environment.siteUrl.replace(/\/$/, '');
      const title =
        lang === 'ar'
          ? `${s.title} | تيسير للابتكارات`
          : `${s.title} | Tayseer Innovations FinTech Solutions`;
      const description =
        s.shortDescription?.trim() ||
        (lang === 'ar'
          ? `تعرّف على حل ${s.title} من تيسير للابتكارات للبنوك وشركات التقنية المالية في الخليج.`
          : `Discover ${s.title} from Tayseer Innovations — banking and FinTech capabilities for institutions across the GCC.`);
      this.seo.apply({
        lang,
        urlPath: `/${lang}/solutions/${s.slug}`,
        title,
        description,
        imagePath: serviceImage(s.slug) ?? environment.defaultOgImage,
        jsonLd: [
          {
            '@type': 'Service',
            name: s.title,
            description,
            url: `${siteUrl}/${lang}/solutions/${s.slug}`,
            provider: { '@id': `${siteUrl}/#organization` },
            areaServed: ['SA', 'AE'],
          },
          breadcrumbList(siteUrl, [
            { name: this.copy().nav.home, path: `/${lang}` },
            { name: this.copy().nav.solutions, path: `/${lang}/solutions` },
            { name: s.title, path: `/${lang}/solutions/${s.slug}` },
          ]),
        ],
      });
    });
  }

  label(item: { en: string; ar: string }): string {
    return t(item, this.lang());
  }

  private readonly load = toSignal(
    combineLatest([
      this.route.paramMap.pipe(map((p) => p.get('slug') ?? '')),
      toObservable(this.locale.lang),
    ]).pipe(
      switchMap(([slug]) => {
        if (!slug) {
          return of({ status: 'error' as const, service: null as ServiceDto | null });
        }
        return this.api.getService(slug).pipe(
          map((service) => ({ status: 'ok' as const, service })),
          startWith({ status: 'loading' as const, service: null as ServiceDto | null }),
          catchError((err: unknown) => {
            const httpStatus = err instanceof HttpErrorResponse ? err.status : 404;
            if (httpStatus === 404) {
              return of({ status: 'notfound' as const, service: null as ServiceDto | null });
            }
            return of({ status: 'error' as const, service: null as ServiceDto | null });
          }),
        );
      }),
    ),
    { initialValue: { status: 'loading' as const, service: null as ServiceDto | null } },
  );

  readonly loading = computed(() => this.load().status === 'loading');
  readonly error = computed(() => this.load().status === 'error');
  readonly service = computed(() => this.load().service);

  readonly coverImage = computed(() => {
    const slug = this.service()?.slug;
    return slug ? serviceImage(slug) : null;
  });

  readonly heroCollage = computed(() => {
    const fromService = this.service()?.slug ?? '';
    const fromRoute = this.route.snapshot.paramMap.get('slug') ?? '';
    return serviceHeroCollage(fromService || fromRoute);
  });

  readonly featuresTitle = computed(() => t(this.c.detailFeaturesTitle, this.lang()));
  readonly splitEyebrow = computed(() => t(this.c.detailSplitEyebrow, this.lang()));
  readonly elevateTitle = computed(() => t(this.c.detailElevateTitle, this.lang()));
  readonly elevateLead = computed(() => t(this.c.detailElevateLead, this.lang()));

  readonly highlightFeatures = computed(() => {
    const features = this.service()?.features ?? [];
    if (features.length) {
      return features.slice(0, 4);
    }
    const fallback = this.service()?.shortDescription;
    return fallback
      ? [{ title: this.service()?.title ?? '', description: fallback, sortOrder: 0 }]
      : [];
  });
}
