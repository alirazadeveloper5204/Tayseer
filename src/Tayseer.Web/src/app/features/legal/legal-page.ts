import { Component, computed, inject } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { LocaleService } from '../../core/i18n/locale.service';
import { LEGAL_PAGES, PAGE_COMMON, t, type PageLocale } from '../../core/content/page-content';

@Component({
  selector: 'app-legal-page',
  imports: [RouterLink],
  templateUrl: './legal-page.html',
})
export class LegalPage {
  private readonly route = inject(ActivatedRoute);
  private readonly locale = inject(LocaleService);

  private readonly data = toSignal(this.route.data, {
    initialValue: {} as Record<string, string>,
  });

  readonly lang = computed(() => this.locale.lang() as PageLocale);
  readonly common = PAGE_COMMON;
  readonly homeLink = computed(() => `/${this.locale.lang()}`);

  readonly doc = computed(() => {
    const key = this.data()['doc'] === 'terms' ? 'terms' : 'privacy';
    return LEGAL_PAGES[key];
  });

  readonly title = computed(() => t(this.doc().title, this.lang()));
  readonly lead = computed(() => t(this.doc().lead, this.lang()));
  readonly updated = computed(() => t(this.doc().updated, this.lang()));
  readonly sections = computed(() => this.doc().sections);

  label(item: { en: string; ar: string }): string {
    return t(item, this.lang());
  }
}
