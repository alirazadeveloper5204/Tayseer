import { Component, computed, inject, PLATFORM_ID } from '@angular/core';
import { RouterLink } from '@angular/router';
import { LocaleService } from '../../core/i18n/locale.service';
import { scrollToSectionId } from '../../core/navigation/scroll-to-section';
import { CAREERS_PAGE, t, type PageLocale } from '../../core/content/page-content';

@Component({
  selector: 'app-careers-page',
  imports: [RouterLink],
  templateUrl: './careers-page.html',
  styleUrl: './careers-page.css',
})
export class CareersPage {
  private readonly locale = inject(LocaleService);
  private readonly platformId = inject(PLATFORM_ID);
  readonly lang = computed(() => this.locale.lang() as PageLocale);
  readonly c = CAREERS_PAGE;

  readonly title = computed(() => t(this.c.title, this.lang()));
  readonly eyebrow = computed(() => t(this.c.eyebrow, this.lang()));
  readonly lead = computed(() => t(this.c.lead, this.lang()));
  readonly heroCta = computed(() => t(this.c.heroCta, this.lang()));
  readonly heroSecondary = computed(() => t(this.c.heroSecondary, this.lang()));
  readonly heroMetaSince = computed(() => t(this.c.heroMetaSince, this.lang()));
  readonly heroMetaCoverage = computed(() => t(this.c.heroMetaCoverage, this.lang()));
  readonly heroMetaFocus = computed(() => t(this.c.heroMetaFocus, this.lang()));
  readonly heroBadgeKicker = computed(() => t(this.c.heroBadgeKicker, this.lang()));
  readonly whyTitle = computed(() => t(this.c.whyTitle, this.lang()));
  readonly whyLead = computed(() => t(this.c.whyLead, this.lang()));
  readonly rolesTitle = computed(() => t(this.c.rolesTitle, this.lang()));
  readonly rolesEmptyTitle = computed(() => t(this.c.rolesEmptyTitle, this.lang()));
  readonly rolesEmptyBody = computed(() => t(this.c.rolesEmptyBody, this.lang()));
  readonly ctaTitle = computed(() => t(this.c.ctaTitle, this.lang()));
  readonly ctaLead = computed(() => t(this.c.ctaLead, this.lang()));
  readonly ctaMail = computed(() => t(this.c.ctaMail, this.lang()));
  readonly ctaContact = computed(() => t(this.c.ctaContact, this.lang()));

  readonly values = computed(() =>
    this.c.values.map((value, index) => ({
      id: index,
      title: t(value.title, this.lang()),
      body: t(value.body, this.lang()),
    })),
  );

  scrollToRoles(event: Event): void {
    scrollToSectionId(this.platformId, 'careers-roles', event);
  }
}
