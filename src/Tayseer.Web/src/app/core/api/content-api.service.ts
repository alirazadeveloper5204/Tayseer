import { Injectable, PLATFORM_ID, inject } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import { ServiceDto, ServiceListItemDto } from '../../models/service.model';
import { LocaleService } from '../i18n/locale.service';

@Injectable({ providedIn: 'root' })
export class ContentApiService {
  private readonly http = inject(HttpClient);
  private readonly locale = inject(LocaleService);
  private readonly platformId = inject(PLATFORM_ID);

  private get baseUrl(): string {
    return isPlatformBrowser(this.platformId)
      ? environment.apiBaseUrl
      : environment.ssrApiBaseUrl;
  }

  listServices(): Observable<ServiceListItemDto[]> {
    return this.http.get<ServiceListItemDto[]>(`${this.baseUrl}/api/v1/services`, {
      params: { lang: this.locale.lang() },
    });
  }

  getService(slug: string): Observable<ServiceDto> {
    return this.http.get<ServiceDto>(`${this.baseUrl}/api/v1/services/${slug}`, {
      params: { lang: this.locale.lang() },
    });
  }
}
