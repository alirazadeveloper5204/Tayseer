import { Injectable, PLATFORM_ID, inject } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import {
  HubConnection,
  HubConnectionBuilder,
  HubConnectionState,
  LogLevel,
} from '@microsoft/signalr';
import { Subject } from 'rxjs';
import { environment } from '../../../environments/environment';
import {
  AdminMessageCreatedPayload,
  AgentConversationDetail,
  AgentConversationSummary,
  AgentMessage,
  AgentNotificationPayload,
} from '../../models/agent-chat.model';

@Injectable({ providedIn: 'root' })
export class AgentChatHubService {
  private readonly platformId = inject(PLATFORM_ID);

  private connection: HubConnection | null = null;
  private connectPromise: Promise<void> | null = null;
  private mode: 'admin' | 'visitor' | null = null;

  private readonly conversationCreatedSubject = new Subject<AgentConversationSummary>();
  private readonly conversationUpdatedSubject = new Subject<
    AgentConversationSummary | AgentConversationDetail
  >();
  private readonly messageCreatedSubject = new Subject<AgentMessage | AdminMessageCreatedPayload>();
  private readonly notificationSubject = new Subject<AgentNotificationPayload>();

  readonly conversationCreated$ = this.conversationCreatedSubject.asObservable();
  readonly conversationUpdated$ = this.conversationUpdatedSubject.asObservable();
  readonly messageCreated$ = this.messageCreatedSubject.asObservable();
  readonly notifications$ = this.notificationSubject.asObservable();

  private get hubUrl(): string {
    const base = isPlatformBrowser(this.platformId)
      ? environment.apiBaseUrl
      : environment.ssrApiBaseUrl;
    return `${base}/hubs/agent-chat`;
  }

  async connectAsAdmin(): Promise<void> {
    if (!isPlatformBrowser(this.platformId)) {
      return;
    }
    // Cookie is sent automatically (same-origin / withCredentials).
    await this.ensureConnected('admin');
  }

  async connectAsVisitor(): Promise<void> {
    if (!isPlatformBrowser(this.platformId)) {
      return;
    }
    await this.ensureConnected('visitor');
  }

  async joinConversation(conversationId: string): Promise<void> {
    await this.connectAsVisitor();
    if (this.connection?.state === HubConnectionState.Connected) {
      await this.connection.invoke('JoinConversation', conversationId);
    }
  }

  async leaveConversation(conversationId: string): Promise<void> {
    if (this.connection?.state === HubConnectionState.Connected) {
      await this.connection.invoke('LeaveConversation', conversationId);
    }
  }

  async disconnect(): Promise<void> {
    this.connectPromise = null;
    this.mode = null;
    const conn = this.connection;
    this.connection = null;
    if (conn) {
      await conn.stop();
    }
  }

  private async ensureConnected(mode: 'admin' | 'visitor'): Promise<void> {
    if (this.connection && this.mode === mode) {
      if (this.connection.state === HubConnectionState.Connected) {
        return;
      }
      if (this.connectPromise) {
        await this.connectPromise;
        return;
      }
    }

    if (this.connection && this.mode !== mode) {
      await this.disconnect();
    }

    if (!this.connection) {
      this.mode = mode;
      this.connection = new HubConnectionBuilder()
        .withUrl(this.hubUrl, { withCredentials: true })
        .withAutomaticReconnect()
        .configureLogging(LogLevel.Warning)
        .build();

      this.connection.on('ConversationCreated', (payload: AgentConversationSummary) => {
        this.conversationCreatedSubject.next(payload);
      });
      this.connection.on(
        'ConversationUpdated',
        (payload: AgentConversationSummary | AgentConversationDetail) => {
          this.conversationUpdatedSubject.next(payload);
        },
      );
      this.connection.on(
        'MessageCreated',
        (payload: AgentMessage | AdminMessageCreatedPayload) => {
          this.messageCreatedSubject.next(payload);
        },
      );
      this.connection.on('AgentNotification', (payload: AgentNotificationPayload) => {
        this.notificationSubject.next(payload);
      });
    }

    if (this.connection.state === HubConnectionState.Connected) {
      return;
    }

    this.connectPromise = this.connection
      .start()
      .catch((err) => {
        this.connectPromise = null;
        throw err;
      })
      .then(() => {
        this.connectPromise = null;
      });

    await this.connectPromise;
  }
}
