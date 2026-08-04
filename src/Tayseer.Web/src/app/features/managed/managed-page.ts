import { Component, computed, inject } from '@angular/core';
import { RouterLink } from '@angular/router';
import { LocaleService } from '../../core/i18n/locale.service';
import { MANAGED_PAGE, PAGE_COMMON, t, type PageLocale } from '../../core/content/page-content';

@Component({
  selector: 'app-managed-page',
  imports: [RouterLink],
  templateUrl: './managed-page.html',
})
export class ManagedPage {
  private readonly locale = inject(LocaleService);
  readonly lang = computed(() => this.locale.lang() as PageLocale);
  readonly c = MANAGED_PAGE;
  readonly common = PAGE_COMMON;

  readonly title = computed(() => t(this.c.title, this.lang()));
  readonly eyebrow = computed(() => t(this.c.eyebrow, this.lang()));
  readonly lead = computed(() => t(this.c.lead, this.lang()));
  readonly slaTitle = computed(() => t(this.c.slaTitle, this.lang()));
  readonly badgesTitle = computed(() => t(this.c.badgesTitle, this.lang()));

  label(item: { en: string; ar: string }): string {
    return t(item, this.lang());
  }
}
