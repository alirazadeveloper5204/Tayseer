import { Injectable, PLATFORM_ID, inject } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import {
  AgentConversationDetail,
  AgentConversationSummary,
  AgentMessage,
  StartAgentChatRequest,
  StartAgentChatResponse,
} from '../../models/agent-chat.model';

@Injectable({ providedIn: 'root' })
export class AgentChatApiService {
  private readonly http = inject(HttpClient);
  private readonly platformId = inject(PLATFORM_ID);

  private get baseUrl(): string {
    return isPlatformBrowser(this.platformId)
      ? environment.apiBaseUrl
      : environment.ssrApiBaseUrl;
  }

  start(request: StartAgentChatRequest): Observable<StartAgentChatResponse> {
    return this.http.post<StartAgentChatResponse>(
      `${this.baseUrl}/api/v1/agent-chat/conversations`,
      request,
    );
  }

  getForVisitor(id: string, visitorKey: string): Observable<AgentConversationDetail> {
    return this.http.get<AgentConversationDetail>(
      `${this.baseUrl}/api/v1/agent-chat/conversations/${id}`,
      { params: { visitorKey } },
    );
  }

  postVisitorMessage(id: string, visitorKey: string, body: string): Observable<AgentMessage> {
    return this.http.post<AgentMessage>(
      `${this.baseUrl}/api/v1/agent-chat/conversations/${id}/messages`,
      { visitorKey, body },
    );
  }

  listForAdmin(status?: string): Observable<AgentConversationSummary[]> {
    return this.http.get<AgentConversationSummary[]>(
      `${this.baseUrl}/api/v1/admin/agent-chat/conversations`,
      status ? { params: { status } } : undefined,
    );
  }

  getForAdmin(id: string): Observable<AgentConversationDetail> {
    return this.http.get<AgentConversationDetail>(
      `${this.baseUrl}/api/v1/admin/agent-chat/conversations/${id}`,
    );
  }

  claim(id: string): Observable<AgentConversationDetail> {
    return this.http.post<AgentConversationDetail>(
      `${this.baseUrl}/api/v1/admin/agent-chat/conversations/${id}/claim`,
      {},
    );
  }

  postAgentMessage(id: string, body: string): Observable<AgentMessage> {
    return this.http.post<AgentMessage>(
      `${this.baseUrl}/api/v1/admin/agent-chat/conversations/${id}/messages`,
      { body },
    );
  }

  close(id: string): Observable<AgentConversationDetail> {
    return this.http.post<AgentConversationDetail>(
      `${this.baseUrl}/api/v1/admin/agent-chat/conversations/${id}/close`,
      {},
    );
  }
}
