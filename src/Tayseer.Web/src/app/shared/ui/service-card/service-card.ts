import { Component, computed, ElementRef, inject, input, viewChild } from '@angular/core';
import { RouterLink } from '@angular/router';
import { solutionPath } from '../../../core/content/static-services';
import { serviceImage } from '../../../core/media/site-images';
import { GsapService } from '../../../core/motion/gsap.service';
import { ServiceListItemDto } from '../../../models/service.model';

@Component({
  selector: 'app-service-card',
  imports: [RouterLink],
  templateUrl: './service-card.html',
  styleUrl: './service-card.css',
  host: {
    class: 'service-card-host block h-full',
  },
})
export class ServiceCard {
  private readonly motion = inject(GsapService);

  readonly service = input.required<ServiceListItemDto>();
  readonly lang = input.required<string>();
  readonly ctaLabel = input('Read More');

  private readonly coverImg = viewChild('coverImg', { read: ElementRef<HTMLImageElement> });

  readonly link = computed(() => {
    const service = this.service();
    return solutionPath(this.lang(), service.slug);
  });

  readonly isGreen = computed(() => this.service().accent === 'green');

  readonly isGrg = computed(() => this.service().slug === 'banking-systems');

  readonly partnerLabel = computed(() =>
    this.lang() === 'ar' ? 'الشريك الرسمي · الإمارات' : 'UAE partner',
  );

  readonly iconKey = computed(() => this.service().iconKey ?? 'default');

  readonly coverImage = computed(() => serviceImage(this.service().slug));

  onCoverEnter(): void {
    const img = this.coverImg()?.nativeElement;
    if (img) {
      this.motion.zoomIn(img, 1.05);
    }
  }

  onCoverLeave(): void {
    const img = this.coverImg()?.nativeElement;
    if (img) {
      this.motion.zoomOut(img);
    }
  }
}
