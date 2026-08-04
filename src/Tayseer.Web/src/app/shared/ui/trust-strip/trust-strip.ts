import { Component, computed, inject } from '@angular/core';
import { UiCopyService } from '../../../core/i18n/ui-copy.service';
import { SITE_IMAGES } from '../../../core/media/site-images';

@Component({
  selector: 'app-trust-strip',
  templateUrl: './trust-strip.html',
})
export class TrustStrip {
  private readonly copyService = inject(UiCopyService);

  readonly items = computed(() => {
    const t = this.copyService.copy().trust;
    return [
      { label: t.iso, accent: 'blue' as const, thumb: SITE_IMAGES.galleryAnalytics },
      { label: t.regions, accent: 'blue' as const, thumb: SITE_IMAGES.thumbDubai },
      { label: t.since, accent: 'blue' as const, thumb: SITE_IMAGES.thumbSkyline },
      { label: t.focus, accent: 'green' as const, thumb: SITE_IMAGES.galleryMeeting },
    ];
  });
}
