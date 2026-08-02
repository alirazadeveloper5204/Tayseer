import { Component, computed, inject } from '@angular/core';
import { toObservable, toSignal } from '@angular/core/rxjs-interop';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { catchError, combineLatest, map, of, startWith, switchMap } from 'rxjs';
import { ContentApiService } from '../../core/api/content-api.service';
import { LocaleService } from '../../core/i18n/locale.service';
import { UiCopyService } from '../../core/i18n/ui-copy.service';
import { serviceImage, SERVICE_IMAGE_ENTRIES } from '../../core/media/site-images';
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

  readonly lang = computed(() => this.locale.lang());
  readonly isAr = computed(() => this.locale.lang() === 'ar');

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

  readonly isGreen = computed(() => this.service()?.accent === 'green');

  readonly coverImage = computed(() => {
    const slug = this.service()?.slug;
    return slug ? serviceImage(slug) : null;
  });

  readonly relatedThumbs = computed(() => SERVICE_IMAGE_ENTRIES);
}
