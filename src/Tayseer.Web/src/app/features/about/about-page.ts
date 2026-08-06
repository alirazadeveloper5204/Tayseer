import {
  Component,
  computed,
  inject,
  PLATFORM_ID,
  ViewEncapsulation,
} from '@angular/core';
import { RouterLink } from '@angular/router';
import { LocaleService } from '../../core/i18n/locale.service';
import { ABOUT_PAGE, PAGE_COMMON, t, type PageLocale } from '../../core/content/page-content';
import { HOME_TESTIMONIALS } from '../../core/i18n/ui-copy';
import { ABOUT_COLLAGE, SITE_IMAGES } from '../../core/media/site-images';
import { scrollToSectionId } from '../../core/navigation/scroll-to-section';
import { SiteCarousel } from '../../shared/ui/site-carousel/site-carousel';

@Component({
  selector: 'app-about-page',
  imports: [RouterLink, SiteCarousel],
  templateUrl: './about-page.html',
  styleUrl: './about-page.css',
  encapsulation: ViewEncapsulation.None,
})
export class AboutPage {
  private readonly locale = inject(LocaleService);
  private readonly platformId = inject(PLATFORM_ID);

  readonly lang = computed(() => this.locale.lang() as PageLocale);
  readonly c = ABOUT_PAGE;
  readonly common = PAGE_COMMON;

  readonly sliderImages = [
    { src: ABOUT_COLLAGE.main, alt: 'Tayseer team collaboration' },
    { src: ABOUT_COLLAGE.thumbs[0], alt: 'Tayseer leadership' },
    { src: ABOUT_COLLAGE.thumbs[1], alt: 'Tayseer technology workshop' },
    { src: ABOUT_COLLAGE.thumbs[2], alt: 'Tayseer delivery team' },
    { src: SITE_IMAGES.galleryWorkspace, alt: 'Tayseer workspace' },
    { src: SITE_IMAGES.galleryMeeting, alt: 'Tayseer client meeting' },
    { src: '/images/about-partnership.jpg', alt: 'Tayseer partnership' },
  ] as const;

  readonly title = computed(() => t(this.c.title, this.lang()));
  readonly eyebrow = computed(() => t(this.c.eyebrow, this.lang()));
  readonly lead = computed(() => t(this.c.lead, this.lang()));
  readonly heroCta = computed(() => t(this.c.heroCta, this.lang()));
  readonly heroSecondary = computed(() => t(this.c.heroSecondary, this.lang()));
  readonly heroMetaSince = computed(() => t(this.c.heroMetaSince, this.lang()));
  readonly heroMetaCoverage = computed(() => t(this.c.heroMetaCoverage, this.lang()));
  readonly heroMetaFocus = computed(() => t(this.c.heroMetaFocus, this.lang()));
  readonly heroBadgeKicker = computed(() => t(this.c.heroBadgeKicker, this.lang()));
  readonly story = computed(() => t(this.c.story, this.lang()));
  readonly whoTitle = computed(() => t(this.c.whoTitle, this.lang()));
  readonly whoLead = computed(() => t(this.c.whoLead, this.lang()));
  readonly mission = computed(() => t(this.c.mission, this.lang()));
  readonly timelineTitle = computed(() => t(this.c.timelineTitle, this.lang()));
  readonly timelineLead = computed(() => t(this.c.timelineLead, this.lang()));
  readonly visionTitle = computed(() => t(this.c.visionTitle, this.lang()));
  readonly visionCardTitle = computed(() => t(this.c.visionCardTitle, this.lang()));
  readonly visionCardBody = computed(() => t(this.c.visionCardBody, this.lang()));
  readonly missionCardTitle = computed(() => t(this.c.missionCardTitle, this.lang()));
  readonly missionCardBody = computed(() => t(this.c.missionCardBody, this.lang()));
  readonly approachTitle = computed(() => t(this.c.approachTitle, this.lang()));
  readonly valuesTitle = computed(() => t(this.c.valuesTitle, this.lang()));
  readonly valuesLead = computed(() => t(this.c.valuesLead, this.lang()));
  readonly testimonialsTitle = computed(() => t(this.c.testimonialsTitle, this.lang()));
  readonly testimonialsLead = computed(() => t(this.c.testimonialsLead, this.lang()));
  readonly elevateTitle = computed(() => t(this.c.elevateTitle, this.lang()));
  readonly elevateLead = computed(() => t(this.c.elevateLead, this.lang()));
  readonly teamTitle = computed(() => t(this.c.teamTitle, this.lang()));

  readonly testimonials = computed(() => {
    const isAr = this.lang() === 'ar';
    return HOME_TESTIMONIALS.slice(0, 3).map((item) => ({
      name: item.name,
      initial: item.name.charAt(0),
      role: isAr ? item.roleAr : item.roleEn,
      quote: isAr ? item.quoteAr : item.quoteEn,
    }));
  });

  label(item: { en: string; ar: string }): string {
    return t(item, this.lang());
  }

  scrollToJourney(event: Event): void {
    scrollToSectionId(this.platformId, 'about-journey', event);
  }
}
