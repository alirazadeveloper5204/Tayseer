import { Component, computed, inject, signal, PLATFORM_ID } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { LocaleService } from '../../core/i18n/locale.service';
import { scrollToSectionId } from '../../core/navigation/scroll-to-section';
import { FAQ_PAGE, t, type PageLocale } from '../../core/content/page-content';

@Component({
  selector: 'app-faqs-page',
  imports: [RouterLink, FormsModule],
  templateUrl: './faqs-page.html',
  styleUrl: './faqs-page.css',
})
export class FaqsPage {
  private readonly locale = inject(LocaleService);
  private readonly platformId = inject(PLATFORM_ID);
  readonly lang = computed(() => this.locale.lang() as PageLocale);
  readonly c = FAQ_PAGE;

  readonly query = signal('');
  readonly activeCategory = signal('all');
  readonly openKey = signal<string | null>(null);

  readonly title = computed(() => t(this.c.title, this.lang()));
  readonly eyebrow = computed(() => t(this.c.eyebrow, this.lang()));
  readonly lead = computed(() => t(this.c.lead, this.lang()));
  readonly heroCta = computed(() => t(this.c.heroCta, this.lang()));
  readonly heroSecondary = computed(() => t(this.c.heroSecondary, this.lang()));
  readonly heroMetaTopics = computed(() => t(this.c.heroMetaTopics, this.lang()));
  readonly heroMetaCoverage = computed(() => t(this.c.heroMetaCoverage, this.lang()));
  readonly heroMetaResponse = computed(() => t(this.c.heroMetaResponse, this.lang()));
  readonly heroBadgeKicker = computed(() => t(this.c.heroBadgeKicker, this.lang()));
  readonly searchPlaceholder = computed(() => t(this.c.searchPlaceholder, this.lang()));
  readonly empty = computed(() => t(this.c.empty, this.lang()));
  readonly ctaTitle = computed(() => t(this.c.ctaTitle, this.lang()));
  readonly ctaLead = computed(() => t(this.c.ctaLead, this.lang()));
  readonly ctaAction = computed(() => t(this.c.ctaAction, this.lang()));
  readonly allLabel = computed(() => t(this.c.allLabel, this.lang()));

  readonly categories = computed(() =>
    this.c.categories.map((category) => ({
      id: category.id,
      title: t(category.title, this.lang()),
    })),
  );

  readonly groups = computed(() => {
    const lang = this.lang();
    const q = this.query().trim().toLowerCase();
    const active = this.activeCategory();

    return this.c.categories
      .filter((category) => active === 'all' || category.id === active)
      .map((category) => ({
        id: category.id,
        title: t(category.title, lang),
        items: category.items
          .map((item, index) => ({
            key: `${category.id}-${index}`,
            q: t(item.q, lang),
            a: t(item.a, lang),
          }))
          .filter((item) => !q || item.q.toLowerCase().includes(q) || item.a.toLowerCase().includes(q)),
      }))
      .filter((group) => group.items.length > 0);
  });

  toggle(key: string): void {
    this.openKey.set(this.openKey() === key ? null : key);
  }

  setCategory(id: string): void {
    this.activeCategory.set(id);
    this.openKey.set(null);
  }

  browseFaqs(event: Event): void {
    scrollToSectionId(this.platformId, 'faq-browse', event);
  }
}
