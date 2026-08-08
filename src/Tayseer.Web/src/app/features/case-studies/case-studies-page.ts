import { Component, computed, inject, signal } from '@angular/core';
import { RouterLink } from '@angular/router';
import { LocaleService } from '../../core/i18n/locale.service';
import { UiCopyService } from '../../core/i18n/ui-copy.service';
import {
  CASE_STUDIES_PAGE,
  PAGE_COMMON,
  t,
  type PageLocale,
} from '../../core/content/page-content';

@Component({
  selector: 'app-case-studies-page',
  imports: [RouterLink],
  templateUrl: './case-studies-page.html',
})
export class CaseStudiesPage {
  private readonly locale = inject(LocaleService);
  readonly copy = inject(UiCopyService).copy;
  readonly lang = computed(() => this.locale.lang() as PageLocale);
  readonly c = CASE_STUDIES_PAGE;
  readonly common = PAGE_COMMON;
  readonly filter = signal('all');

  readonly title = computed(() => t(this.c.title, this.lang()));
  readonly eyebrow = computed(() => t(this.c.eyebrow, this.lang()));
  readonly lead = computed(() => t(this.c.lead, this.lang()));
  readonly heroMetaBanking = computed(() => t(this.c.heroMetaBanking, this.lang()));
  readonly heroMetaFintech = computed(() => t(this.c.heroMetaFintech, this.lang()));
  readonly heroMetaManaged = computed(() => t(this.c.heroMetaManaged, this.lang()));
  readonly heroBadgeKicker = computed(() => t(this.c.heroBadgeKicker, this.lang()));

  readonly filtered = computed(() => {
    const f = this.filter();
    if (f === 'all') return this.c.items;
    return this.c.items.filter((item) => item.sector === f);
  });

  label(item: { en: string; ar: string }): string {
    return t(item, this.lang());
  }

  sectorLabel(sector: string): string {
    const match = this.c.filters.find((f) => f.id === sector);
    return match ? t(match.label, this.lang()) : sector;
  }

  setFilter(id: string): void {
    this.filter.set(id);
  }
}
