import { Component, computed, inject, effect } from '@angular/core';
import { RouterLink } from '@angular/router';
import { ContentStore } from '../../state/content.store';
import { LocaleService } from '../../core/i18n/locale.service';
import { UiCopyService } from '../../core/i18n/ui-copy.service';
import { SOLUTIONS_PAGE, t, type PageLocale } from '../../core/content/page-content';
import { solutionPath } from '../../core/content/static-services';
import { serviceImage } from '../../core/media/site-images';

@Component({
  selector: 'app-solutions-page',
  imports: [RouterLink],
  templateUrl: './solutions-page.html',
})
export class SolutionsPage {
  private readonly store = inject(ContentStore);
  private readonly locale = inject(LocaleService);
  readonly copy = inject(UiCopyService).copy;
  readonly lang = computed(() => this.locale.lang() as PageLocale);
  readonly isAr = computed(() => this.locale.lang() === 'ar');
  readonly c = SOLUTIONS_PAGE;

  readonly services = this.store.services;
  readonly loading = this.store.loading;
  readonly error = this.store.error;

  readonly title = computed(() => t(this.c.title, this.lang()));
  readonly eyebrow = computed(() => t(this.c.eyebrow, this.lang()));
  readonly intro = computed(() => t(this.c.lead, this.lang()));
  readonly featuresTitle = computed(() => t(this.c.featuresTitle, this.lang()));
  readonly featuresLead = computed(() => t(this.c.featuresLead, this.lang()));
  readonly worldsTitle = computed(() => t(this.c.worldsTitle, this.lang()));
  readonly worldsLead = computed(() => t(this.c.worldsLead, this.lang()));
  readonly catalogTitle = computed(() => t(this.c.catalogTitle, this.lang()));
  readonly catalogLead = computed(() => t(this.c.catalogLead, this.lang()));
  readonly splitEyebrow = computed(() => t(this.c.splitEyebrow, this.lang()));
  readonly splitTitle = computed(() => t(this.c.splitTitle, this.lang()));
  readonly splitLead = computed(() => t(this.c.splitLead, this.lang()));
  readonly elevateTitle = computed(() => t(this.c.elevateTitle, this.lang()));
  readonly elevateLead = computed(() => t(this.c.elevateLead, this.lang()));

  readonly featureRows = computed(() => {
    const images: Record<string, string> = {
      platforms: '/images/service-core-banking.jpg',
      experience: '/images/service-mbuke.jpg',
      control: '/images/service-fahim-ai.jpg',
      delivery: '/images/service-managed.jpg',
    };
    return this.c.features.map((feature, index) => ({
      id: feature.id,
      title: t(feature.title, this.lang()),
      body: t(feature.body, this.lang()),
      image: images[feature.id] ?? '/images/solutions-banner.jpg',
      flip: index % 2 === 1,
    }));
  });

  readonly catalogRows = computed(() =>
    this.services().map((service, index) => ({
      ...service,
      image: serviceImage(service.slug),
      link: solutionPath(this.lang(), service.slug),
      flip: index % 2 === 1,
    })),
  );

  constructor() {
    effect(() => {
      const _ = this.locale.lang();
      this.store.reloadForLocale();
    });
  }

  label(item: { en: string; ar: string }): string {
    return t(item, this.lang());
  }
}
