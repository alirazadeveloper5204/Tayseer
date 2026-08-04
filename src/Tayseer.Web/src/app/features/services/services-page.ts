import { Component, computed, inject } from '@angular/core';
import { RouterLink } from '@angular/router';
import { LocaleService } from '../../core/i18n/locale.service';
import { PAGE_COMMON, SERVICES_PAGE, t, type PageLocale } from '../../core/content/page-content';

@Component({
  selector: 'app-services-page',
  imports: [RouterLink],
  templateUrl: './services-page.html',
})
export class ServicesPage {
  private readonly locale = inject(LocaleService);
  readonly lang = computed(() => this.locale.lang() as PageLocale);
  readonly c = SERVICES_PAGE;
  readonly common = PAGE_COMMON;

  readonly title = computed(() => t(this.c.title, this.lang()));
  readonly eyebrow = computed(() => t(this.c.eyebrow, this.lang()));
  readonly lead = computed(() => t(this.c.lead, this.lang()));
  readonly flowTitle = computed(() => t(this.c.flowTitle, this.lang()));
  readonly flowLead = computed(() => t(this.c.flowLead, this.lang()));

  label(item: { en: string; ar: string }): string {
    return t(item, this.lang());
  }
}
