import { Injectable, PLATFORM_ID, inject } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import { ChatRequestDto, ChatResponseDto } from '../../models/chat.model';
import { LocaleService } from '../i18n/locale.service';

@Injectable({ providedIn: 'root' })
export class ChatApiService {
  private readonly http = inject(HttpClient);
  private readonly locale = inject(LocaleService);
  private readonly platformId = inject(PLATFORM_ID);

  private get baseUrl(): string {
    return isPlatformBrowser(this.platformId)
      ? environment.apiBaseUrl
      : environment.ssrApiBaseUrl;
  }

  send(messages: ChatRequestDto['messages']): Observable<ChatResponseDto> {
    const body: ChatRequestDto = {
      messages,
      lang: this.locale.lang(),
    };
    return this.http.post<ChatResponseDto>(`${this.baseUrl}/api/v1/chat`, body);
  }
}
