import { Component, computed, inject, signal, ViewEncapsulation } from '@angular/core';
import { RouterLink } from '@angular/router';
import { LocaleService } from '../../core/i18n/locale.service';
import { PAGE_COMMON, SOFTWARE_PAGE, t, type PageLocale } from '../../core/content/page-content';

@Component({
  selector: 'app-software-page',
  imports: [RouterLink],
  templateUrl: './software-page.html',
  styleUrl: './software-page.css',
  encapsulation: ViewEncapsulation.None,
})
export class SoftwarePage {
  private readonly locale = inject(LocaleService);
  readonly lang = computed(() => this.locale.lang() as PageLocale);
  readonly c = SOFTWARE_PAGE;
  readonly common = PAGE_COMMON;
  readonly activeTab = signal<string>(SOFTWARE_PAGE.tabs[0].id);

  readonly title = computed(() => t(this.c.title, this.lang()));
  readonly eyebrow = computed(() => t(this.c.eyebrow, this.lang()));
  readonly lead = computed(() => t(this.c.lead, this.lang()));
  readonly tabsTitle = computed(() => t(this.c.tabsTitle, this.lang()));
  readonly activeItems = computed(() => {
    const tab = this.c.tabs.find((item) => item.id === this.activeTab()) ?? this.c.tabs[0];
    return tab.items;
  });

  label(item: { en: string; ar: string }): string {
    return t(item, this.lang());
  }

  setTab(id: string): void {
    this.activeTab.set(id);
  }
}
