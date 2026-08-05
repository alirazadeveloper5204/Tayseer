import { Component, computed, inject } from '@angular/core';
import { RouterLink } from '@angular/router';
import { LocaleService } from '../../core/i18n/locale.service';
import { PAGE_COMMON, SERVICES_PAGE, t, type PageLocale } from '../../core/content/page-content';
import { WorldCard } from '../../shared/ui/world-card/world-card';

@Component({
  selector: 'app-services-page',
  imports: [RouterLink, WorldCard],
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
  readonly featuresTitle = computed(() => t(this.c.featuresTitle, this.lang()));
  readonly featuresLead = computed(() => t(this.c.featuresLead, this.lang()));
  readonly worldsTitle = computed(() => t(this.c.worldsTitle, this.lang()));
  readonly worldsLead = computed(() => t(this.c.worldsLead, this.lang()));
  readonly splitEyebrow = computed(() => t(this.c.splitEyebrow, this.lang()));
  readonly splitTitle = computed(() => t(this.c.splitTitle, this.lang()));
  readonly splitLead = computed(() => t(this.c.splitLead, this.lang()));
  readonly elevateTitle = computed(() => t(this.c.elevateTitle, this.lang()));
  readonly elevateLead = computed(() => t(this.c.elevateLead, this.lang()));

  readonly featureRows = computed(() => {
    const images: Record<string, string> = {
      core: '/images/service-core-banking.jpg',
      payments: '/images/service-banking-systems.jpg',
      wallets: '/images/service-mbuke.jpg',
      open: '/images/gallery-analytics.jpg',
    };
    return this.c.pillars.map((pillar, index) => ({
      id: pillar.id,
      title: t(pillar.title, this.lang()),
      body: t(pillar.body, this.lang()),
      image: images[pillar.id] ?? '/images/solutions-banner.jpg',
      flip: index % 2 === 1,
    }));
  });

  label(item: { en: string; ar: string }): string {
    return t(item, this.lang());
  }
}
