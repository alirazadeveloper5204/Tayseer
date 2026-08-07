import { Injectable, PLATFORM_ID, inject } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';

export type ContactInquiryPayload = {
  name: string;
  email: string;
  company?: string;
  interest: string;
  message: string;
  lang: string;
};

export type ContactInquiryResult = {
  id: string;
  createdAt: string;
};

@Injectable({ providedIn: 'root' })
export class ContactApiService {
  private readonly http = inject(HttpClient);
  private readonly platformId = inject(PLATFORM_ID);

  private get baseUrl(): string {
    return isPlatformBrowser(this.platformId)
      ? environment.apiBaseUrl
      : environment.ssrApiBaseUrl;
  }

  submit(payload: ContactInquiryPayload): Observable<ContactInquiryResult> {
    return this.http.post<ContactInquiryResult>(`${this.baseUrl}/api/v1/contact`, payload);
  }
}
