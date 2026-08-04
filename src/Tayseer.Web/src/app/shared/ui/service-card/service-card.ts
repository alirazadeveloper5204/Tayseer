import { Component, computed, input } from '@angular/core';
import { RouterLink } from '@angular/router';
import { serviceImage } from '../../../core/media/site-images';
import { ServiceListItemDto } from '../../../models/service.model';

@Component({
  selector: 'app-service-card',
  imports: [RouterLink],
  templateUrl: './service-card.html',
  host: {
    class: 'block h-full',
  },
})
export class ServiceCard {
  readonly service = input.required<ServiceListItemDto>();
  readonly lang = input.required<string>();
  readonly ctaLabel = input('Read More');
  readonly featured = input(false);

  readonly link = computed(() => `/${this.lang()}/solutions/${this.service().slug}`);

  readonly isGreen = computed(() => this.service().accent === 'green');

  readonly iconKey = computed(() => this.service().iconKey ?? 'default');

  readonly coverImage = computed(() => serviceImage(this.service().slug));
}
