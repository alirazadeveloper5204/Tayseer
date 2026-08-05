import { Component, computed, inject } from '@angular/core';
import { RouterLink } from '@angular/router';
import { ContentStore } from '../../state/content.store';
import { LocaleService } from '../../core/i18n/locale.service';
import { UiCopyService } from '../../core/i18n/ui-copy.service';
import { ServiceCard } from '../../shared/ui/service-card/service-card';
import { SiteCarousel } from '../../shared/ui/site-carousel/site-carousel';

@Component({
  selector: 'app-services-bento',
  imports: [RouterLink, ServiceCard, SiteCarousel],
  templateUrl: './services-bento.html',
  styleUrl: './services-bento.css',
})
export class ServicesBento {
  private readonly store = inject(ContentStore);
  private readonly locale = inject(LocaleService);
  readonly copy = inject(UiCopyService).copy;

  readonly lang = computed(() => this.locale.lang());
  readonly services = this.store.services;
  readonly loading = this.store.loading;
  readonly error = this.store.error;
  readonly loopedServices = computed(() => {
    const items = this.services();
    return items.length ? [...items, ...items] : [];
  });
}
