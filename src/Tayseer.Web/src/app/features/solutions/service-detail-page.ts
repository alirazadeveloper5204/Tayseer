import { Component, computed, inject } from '@angular/core';
import { toObservable, toSignal } from '@angular/core/rxjs-interop';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { catchError, combineLatest, map, of, startWith, switchMap } from 'rxjs';
import { ContentApiService } from '../../core/api/content-api.service';
import { LocaleService } from '../../core/i18n/locale.service';
import { UiCopyService } from '../../core/i18n/ui-copy.service';
import { SOLUTIONS_PAGE, PAGE_COMMON, t, type PageLocale } from '../../core/content/page-content';
import { serviceImage, serviceHeroCollage } from '../../core/media/site-images';
import { ServiceDto } from '../../models/service.model';

@Component({
  selector: 'app-service-detail-page',
  imports: [RouterLink],
  templateUrl: './service-detail-page.html',
})
export class ServiceDetailPage {
  private readonly route = inject(ActivatedRoute);
  private readonly api = inject(ContentApiService);
  private readonly locale = inject(LocaleService);
  readonly copy = inject(UiCopyService).copy;
  readonly c = SOLUTIONS_PAGE;
  readonly common = PAGE_COMMON;

  readonly lang = computed(() => this.locale.lang() as PageLocale);
  readonly isAr = computed(() => this.locale.lang() === 'ar');

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
          catchError(() => of({ status: 'error' as const, service: null as ServiceDto | null })),
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
