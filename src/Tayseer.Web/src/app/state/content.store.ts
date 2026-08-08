import { Injectable, signal, inject } from '@angular/core';
import { environment } from '../../environments/environment';
import { ContentApiService } from '../core/api/content-api.service';
import { staticServicesForLang } from '../core/content/static-services';
import { LocaleService } from '../core/i18n/locale.service';
import { ServiceListItemDto } from '../models/service.model';

@Injectable({ providedIn: 'root' })
export class ContentStore {
  private readonly api = inject(ContentApiService);
  private readonly locale = inject(LocaleService);

  readonly services = signal<ServiceListItemDto[]>([]);
  readonly loading = signal(false);
  readonly error = signal<string | null>(null);
  private loadedForLang: string | null = null;

  loadServices(): void {
    const lang = this.locale.lang();

    if (environment.useStaticContent) {
      this.services.set(staticServicesForLang(lang));
      this.error.set(null);
      this.loading.set(false);
      this.loadedForLang = lang;
      return;
    }

    this.loading.set(true);
    this.error.set(null);

    this.api.listServices().subscribe({
      next: (items) => {
        this.services.set(items);
        this.loadedForLang = lang;
        this.loading.set(false);
      },
      error: () => {
        this.services.set([]);
        this.error.set('services-unavailable');
        this.loadedForLang = lang;
        this.loading.set(false);
      },
    });
  }


  reloadForLocale(): void {
    this.loadedForLang = null;
    this.loadServices();
  }
}
