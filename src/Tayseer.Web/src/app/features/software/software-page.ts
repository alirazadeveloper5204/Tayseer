import { DOCUMENT } from '@angular/common';
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
  private readonly document = inject(DOCUMENT);
  readonly lang = computed(() => this.locale.lang() as PageLocale);
  readonly c = SOFTWARE_PAGE;
  readonly common = PAGE_COMMON;
  readonly activeTab = signal<string>(SOFTWARE_PAGE.tabs[0].id);

  readonly title = computed(() => t(this.c.title, this.lang()));
  readonly eyebrow = computed(() => t(this.c.eyebrow, this.lang()));
  readonly lead = computed(() => t(this.c.lead, this.lang()));
  readonly tabsTitle = computed(() => t(this.c.tabsTitle, this.lang()));
  readonly heroMetaLegacy = computed(() => t(this.c.heroMetaLegacy, this.lang()));
  readonly heroMetaCloud = computed(() => t(this.c.heroMetaCloud, this.lang()));
  readonly heroMetaMobile = computed(() => t(this.c.heroMetaMobile, this.lang()));
  readonly heroBadgeKicker = computed(() => t(this.c.heroBadgeKicker, this.lang()));
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

  onTabKeydown(event: KeyboardEvent, id: string): void {
    const tabs = this.c.tabs;
    const index = tabs.findIndex((tab) => tab.id === id);
    if (index < 0) return;

    let next = index;
    if (event.key === 'ArrowRight' || event.key === 'ArrowLeft') {
      event.preventDefault();
      const dir = event.key === 'ArrowRight' ? 1 : -1;
      next = (index + dir + tabs.length) % tabs.length;
    } else if (event.key === 'Home') {
      event.preventDefault();
      next = 0;
    } else if (event.key === 'End') {
      event.preventDefault();
      next = tabs.length - 1;
    } else {
      return;
    }

    this.setTab(tabs[next].id);
    queueMicrotask(() => {
      this.document.getElementById(`software-tab-${tabs[next].id}`)?.focus();
    });
  }
}
