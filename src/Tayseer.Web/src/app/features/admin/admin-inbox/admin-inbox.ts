import {
  Component,
  ElementRef,
  OnDestroy,
  OnInit,
  ViewChild,
  inject,
  signal,
} from '@angular/core';
import { DatePipe } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { Subscription } from 'rxjs';
import { AgentChatApiService } from '../../../core/api/agent-chat-api.service';
import { AgentChatHubService } from '../../../core/realtime/agent-chat-hub.service';
import { AdminNotificationsService } from '../../../core/realtime/admin-notifications.service';
import {
  AdminMessageCreatedPayload,
  AgentConversationDetail,
  AgentConversationSummary,
  AgentMessage,
} from '../../../models/agent-chat.model';

@Component({
  selector: 'app-admin-inbox',
  imports: [DatePipe, FormsModule],
  templateUrl: './admin-inbox.html',
  styleUrl: '../admin-shared.css',
})
export class AdminInboxPage implements OnInit, OnDestroy {
  private readonly api = inject(AgentChatApiService);
  private readonly hub = inject(AgentChatHubService);
  private readonly notifications = inject(AdminNotificationsService);
  private readonly route = inject(ActivatedRoute);
  private readonly subs = new Subscription();

  @ViewChild('transcript') private transcriptRef?: ElementRef<HTMLElement>;

  readonly conversations = signal<AgentConversationSummary[]>([]);
  readonly selectedId = signal<string | null>(null);
  readonly detail = signal<AgentConversationDetail | null>(null);
  readonly draft = signal('');
  readonly busy = signal(false);
  readonly error = signal<string | null>(null);
  readonly filter = signal<'open' | 'Waiting' | 'Active' | 'Closed' | 'all'>('open');

  ngOnInit(): void {
    void this.notifications.start();
    this.notifications.clearUnread();
    this.reload();

    void this.hub.connectAsAdmin();
    this.subs.add(
      this.hub.conversationCreated$.subscribe((c) => {
        this.conversations.update((list) => [c, ...list.filter((x) => x.id !== c.id)]);
      }),
    );
    this.subs.add(
      this.hub.conversationUpdated$.subscribe((payload) => {
        const summary = this.asSummary(payload);
        if (!summary) {
          return;
        }
        this.conversations.update((list) => {
          const next = list.filter((x) => x.id !== summary.id);
          next.unshift(summary);
          return next;
        });
        if (this.selectedId() === summary.id && 'messages' in payload) {
          this.detail.set(payload as AgentConversationDetail);
          queueMicrotask(() => this.scrollToBottom());
        }
      }),
    );
    this.subs.add(
      this.hub.messageCreated$.subscribe((payload) => {
        if (!this.isAdminMessagePayload(payload)) {
          return;
        }
        if (this.selectedId() !== payload.conversationId) {
          return;
        }
        this.detail.update((d) => {
          if (!d) {
            return d;
          }
          if (d.messages.some((m) => m.id === payload.message.id)) {
            return d;
          }
          return { ...d, messages: [...d.messages, payload.message] };
        });
        queueMicrotask(() => this.scrollToBottom());
      }),
    );
    this.subs.add(
      this.route.queryParamMap.subscribe((params) => {
        const id = params.get('c');
        if (id) {
          this.select(id);
        }
      }),
    );
  }

  ngOnDestroy(): void {
    this.subs.unsubscribe();
  }

  reload(): void {
    this.error.set(null);
    const filter = this.filter();
    const status = filter === 'open' || filter === 'all' ? undefined : filter;
    this.api.listForAdmin(status).subscribe({
      next: (items) => {
        const filtered =
          filter === 'open'
            ? items.filter((c) => c.status === 'Waiting' || c.status === 'Active')
            : items;
        this.conversations.set(filtered);
      },
      error: () => this.error.set('Failed to load conversations.'),
    });
  }

  setFilter(value: 'open' | 'Waiting' | 'Active' | 'Closed' | 'all'): void {
    this.filter.set(value);
    this.reload();
  }

  select(id: string): void {
    this.selectedId.set(id);
    this.draft.set('');
    this.error.set(null);
    this.notifications.dismiss(id);
    this.api.getForAdmin(id).subscribe({
      next: (detail) => {
        this.detail.set(detail);
        queueMicrotask(() => this.scrollToBottom());
      },
      error: () => this.error.set('Failed to load conversation.'),
    });
  }

  claim(): void {
    const id = this.selectedId();
    if (!id || this.busy()) {
      return;
    }
    this.busy.set(true);
    this.api.claim(id).subscribe({
      next: (detail) => {
        this.busy.set(false);
        this.detail.set(detail);
        this.reload();
        queueMicrotask(() => this.scrollToBottom());
      },
      error: () => {
        this.busy.set(false);
        this.error.set('Could not claim this conversation.');
      },
    });
  }

  closeChat(): void {
    const id = this.selectedId();
    if (!id || this.busy()) {
      return;
    }
    this.busy.set(true);
    this.api.close(id).subscribe({
      next: (detail) => {
        this.busy.set(false);
        this.detail.set(detail);
        this.reload();
      },
      error: () => {
        this.busy.set(false);
        this.error.set('Could not close this conversation.');
      },
    });
  }

  send(): void {
    const id = this.selectedId();
    const body = this.draft().trim();
    if (!id || !body || this.busy()) {
      return;
    }
    this.busy.set(true);
    this.error.set(null);
    this.api.postAgentMessage(id, body).subscribe({
      next: (message) => {
        this.busy.set(false);
        this.draft.set('');
        this.appendMessage(message);
        queueMicrotask(() => this.scrollToBottom());
      },
      error: () => {
        this.busy.set(false);
        this.error.set('Failed to send message.');
      },
    });
  }

  onKeydown(event: KeyboardEvent): void {
    if (event.key === 'Enter' && !event.shiftKey) {
      event.preventDefault();
      this.send();
    }
  }

  statusClass(status: string): string {
    return `admin-chat__status admin-chat__status--${status.toLowerCase()}`;
  }

  private appendMessage(message: AgentMessage): void {
    this.detail.update((d) => {
      if (!d || d.messages.some((m) => m.id === message.id)) {
        return d;
      }
      return { ...d, messages: [...d.messages, message] };
    });
  }

  private asSummary(
    payload: AgentConversationSummary | AgentConversationDetail,
  ): AgentConversationSummary | null {
    if (!payload?.id) {
      return null;
    }
    if ('unreadForAdminHint' in payload) {
      return payload as AgentConversationSummary;
    }
    const d = payload as AgentConversationDetail;
    return {
      id: d.id,
      status: d.status,
      lang: d.lang,
      visitorName: d.visitorName,
      visitorEmail: d.visitorEmail,
      subject: d.subject,
      assignedAdminName: d.assignedAdminName,
      createdAt: d.createdAt,
      updatedAt: d.updatedAt,
      lastVisitorMessageAt: null,
      unreadForAdminHint: 0,
    };
  }

  private isAdminMessagePayload(
    payload: AgentMessage | AdminMessageCreatedPayload,
  ): payload is AdminMessageCreatedPayload {
    return typeof payload === 'object' && payload !== null && 'conversationId' in payload;
  }

  private scrollToBottom(): void {
    const el = this.transcriptRef?.nativeElement;
    if (el) {
      el.scrollTop = el.scrollHeight;
    }
  }
}
