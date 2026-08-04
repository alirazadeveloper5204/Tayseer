import { Component, computed, inject } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { map } from 'rxjs';
import { LocaleService } from '../../core/i18n/locale.service';
import {
  CASE_STUDIES_PAGE,
  PAGE_COMMON,
  t,
  type PageLocale,
} from '../../core/content/page-content';

@Component({
  selector: 'app-case-study-detail-page',
  imports: [RouterLink],
  templateUrl: './case-study-detail-page.html',
})
export class CaseStudyDetailPage {
  private readonly locale = inject(LocaleService);
  private readonly route = inject(ActivatedRoute);
  readonly lang = computed(() => this.locale.lang() as PageLocale);
  readonly common = PAGE_COMMON;
  readonly filters = CASE_STUDIES_PAGE.filters;

  private readonly slug = toSignal(this.route.paramMap.pipe(map((p) => p.get('slug') ?? '')), {
    initialValue: '',
  });

  readonly item = computed(() => CASE_STUDIES_PAGE.items.find((c) => c.slug === this.slug()) ?? null);

  label(item: { en: string; ar: string }): string {
    return t(item, this.lang());
  }

  sectorLabel(sector: string): string {
    const match = this.filters.find((f) => f.id === sector);
    return match ? t(match.label, this.lang()) : sector;
  }
}
