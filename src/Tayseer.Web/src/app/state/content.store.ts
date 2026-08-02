import { Injectable, signal, inject } from '@angular/core';
import { ContentApiService } from '../core/api/content-api.service';
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

  ensureLoaded(): void {
    const lang = this.locale.lang();
    if (this.loadedForLang === lang) {
      return;
    }
    this.loadServices();
  }

  loadServices(): void {
    const lang = this.locale.lang();
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

  /** Force refresh after locale change. */
  reloadForLocale(): void {
    this.loadedForLang = null;
    this.loadServices();
  }
}
