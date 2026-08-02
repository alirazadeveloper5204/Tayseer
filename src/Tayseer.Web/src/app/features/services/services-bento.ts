import { Component, computed, inject } from '@angular/core';
import { RouterLink } from '@angular/router';
import { ContentStore } from '../../state/content.store';
import { LocaleService } from '../../core/i18n/locale.service';
import { UiCopyService } from '../../core/i18n/ui-copy.service';
import { serviceImage } from '../../core/media/site-images';
import { ServiceCard } from '../../shared/ui/service-card/service-card';

@Component({
  selector: 'app-services-bento',
  imports: [RouterLink, ServiceCard],
  templateUrl: './services-bento.html',
})
export class ServicesBento {
  private readonly store = inject(ContentStore);
  private readonly locale = inject(LocaleService);
  readonly copy = inject(UiCopyService).copy;

  readonly lang = computed(() => this.locale.lang());
  readonly services = this.store.services;
  readonly loading = this.store.loading;
  readonly error = this.store.error;

  readonly featured = computed(() => this.services().slice(0, 2));
  readonly rest = computed(() => this.services().slice(2));

  thumbFor(slug: string): string {
    return serviceImage(slug);
  }
}
