import { Component, computed, inject } from '@angular/core';
import { RouterLink } from '@angular/router';
import { LocaleService } from '../../core/i18n/locale.service';
import { ABOUT_PAGE, PAGE_COMMON, t, type PageLocale } from '../../core/content/page-content';

@Component({
  selector: 'app-about-page',
  imports: [RouterLink],
  templateUrl: './about-page.html',
  styleUrl: './about-page.css',
})
export class AboutPage {
  private readonly locale = inject(LocaleService);
  readonly lang = computed(() => this.locale.lang() as PageLocale);
  readonly c = ABOUT_PAGE;
  readonly common = PAGE_COMMON;

  readonly title = computed(() => t(this.c.title, this.lang()));
  readonly eyebrow = computed(() => t(this.c.eyebrow, this.lang()));
  readonly mission = computed(() => t(this.c.mission, this.lang()));
  readonly timelineTitle = computed(() => t(this.c.timelineTitle, this.lang()));
  readonly credentialsTitle = computed(() => t(this.c.credsTitle, this.lang()));
  readonly teamTitle = computed(() => t(this.c.teamTitle, this.lang()));

  label(item: { en: string; ar: string }): string {
    return t(item, this.lang());
  }
}
