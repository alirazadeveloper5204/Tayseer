import {
  Component,
  ElementRef,
  OnDestroy,
  PLATFORM_ID,
  ViewChild,
  ViewEncapsulation,
  afterNextRender,
  computed,
  effect,
  inject,
  signal,
} from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HttpErrorResponse } from '@angular/common/http';
import { Subscription } from 'rxjs';
import { ChatApiService } from '../../../core/api/chat-api.service';
import { AgentChatApiService } from '../../../core/api/agent-chat-api.service';
import { AgentChatHubService } from '../../../core/realtime/agent-chat-hub.service';
import { LocaleService } from '../../../core/i18n/locale.service';
import { UiCopyService } from '../../../core/i18n/ui-copy.service';
import { ChatMessageDto, ChatErrorDto } from '../../../models/chat.model';
import { AgentMessage } from '../../../models/agent-chat.model';
import { NotificationSoundService } from '../../../core/audio/notification-sound.service';
import { isAgentHandoffIntent } from '../../../core/chat/agent-handoff-intent';

type WidgetMode = 'fahim' | 'handoff' | 'agent';

interface StoredAgentSession {
  conversationId: string;
  visitorKey: string;
}

const AGENT_SESSION_KEY = 'tayseer-agent-chat';

@Component({
  selector: 'app-chat-widget',
  imports: [FormsModule],
  templateUrl: './chat-widget.html',
  styleUrl: './chat-widget.css',
  encapsulation: ViewEncapsulation.None,
})
export class ChatWidget implements OnDestroy {
  private readonly chatApi = inject(ChatApiService);
  private readonly agentApi = inject(AgentChatApiService);
  private readonly hub = inject(AgentChatHubService);
  private readonly locale = inject(LocaleService);
  private readonly ui = inject(UiCopyService);
  private readonly sound = inject(NotificationSoundService);
  private readonly platformId = inject(PLATFORM_ID);
  private pending: Subscription | null = null;
  private hubSub: Subscription | null = null;
  private scrollRaf = 0;
  private joinedConversationId: string | null = null;

  @ViewChild('transcript') private transcriptRef?: ElementRef<HTMLElement>;
  @ViewChild('bottomAnchor') private bottomAnchorRef?: ElementRef<HTMLElement>;
  @ViewChild('composer') private composerRef?: ElementRef<HTMLTextAreaElement>;

  readonly open = signal(false);
  readonly expanded = signal(false);
  readonly draft = signal('');
  readonly busy = signal(false);
  readonly error = signal<string | null>(null);
  readonly messages = signal<ChatMessageDto[]>([]);
  readonly mode = signal<WidgetMode>('fahim');
  readonly agentConversationId = signal<string | null>(null);
  readonly agentStatus = signal<string | null>(null);
  readonly visitorName = signal('');
  readonly visitorEmail = signal('');

  readonly copy = computed(() => this.ui.copy().chat);
  readonly isRtl = this.locale.isRtl;
  readonly panelTitle = computed(() => {
    if (this.mode() === 'agent') {
      return this.copy().agentTitle;
    }
    if (this.mode() === 'handoff') {
      return this.copy().handoffTitle;
    }
    return this.copy().title;
  });
  readonly panelEyebrow = computed(() => {
    if (this.mode() === 'agent' || this.mode() === 'handoff') {
      return this.copy().agentEyebrow;
    }
    return this.copy().eyebrow;
  });
  readonly canSubmitHandoff = computed(() => {
    const name = this.visitorName().trim();
    const email = this.visitorEmail().trim();
    return name.length > 1 && this.isValidEmail(email) && !this.busy();
  });

  constructor() {
    afterNextRender(() => {
      if (!isPlatformBrowser(this.platformId)) {
        return;
      }
      this.seedWelcome();
      void this.restoreAgentSession();
    });

    effect(() => {
      this.messages();
      this.busy();
      this.open();
      this.expanded();
      this.mode();
      if (!isPlatformBrowser(this.platformId) || !this.open()) {
        return;
      }
      this.scrollToBottom();
    });
  }

  ngOnDestroy(): void {
    this.pending?.unsubscribe();
    this.hubSub?.unsubscribe();
    if (this.scrollRaf) {
      cancelAnimationFrame(this.scrollRaf);
    }
    if (this.joinedConversationId) {
      void this.hub.leaveConversation(this.joinedConversationId);
    }
  }

  toggle(): void {
    this.sound.unlock();
    this.open.update((v) => !v);
    if (this.open()) {
      queueMicrotask(() => this.focusComposer());
      this.scrollToBottom();
    } else {
      this.expanded.set(false);
    }
  }

  toggleExpand(): void {
    this.expanded.update((v) => !v);
    queueMicrotask(() => {
      this.scrollToBottom();
      this.focusComposer();
    });
  }

  close(): void {
    this.open.set(false);
    this.expanded.set(false);
  }

  send(): void {
    if (!isPlatformBrowser(this.platformId) || this.busy() || this.mode() === 'handoff') {
      return;
    }

    this.sound.unlock();
    const text = this.draft().trim();
    if (!text) {
      return;
    }

    if (this.mode() === 'agent') {
      this.sendAgent(text);
      return;
    }

    this.error.set(null);
    this.draft.set('');
    const nextMessages: ChatMessageDto[] = [...this.messages(), { role: 'user', content: text }];
    this.messages.set(nextMessages);

    if (isAgentHandoffIntent(text)) {
      this.enterHandoff(this.copy().handoffConfirm);
      return;
    }

    this.busy.set(true);

    this.pending?.unsubscribe();
    this.pending = this.chatApi.send(nextMessages).subscribe({
      next: (res) => {
        this.messages.update((list) => [...list, { role: 'assistant', content: res.reply }]);
        this.sound.ping();
        this.busy.set(false);
        if (res.handoffRequested) {
          this.mode.set('handoff');
          queueMicrotask(() => this.scrollToBottom());
          return;
        }
        this.focusComposer();
      },
      error: (err: unknown) => {
        this.busy.set(false);
        this.error.set(this.resolveError(err));
        this.focusComposer();
      },
    });
  }

  talkToAgent(): void {
    if (!isPlatformBrowser(this.platformId) || this.busy() || this.mode() !== 'fahim') {
      return;
    }
    this.sound.unlock();
    this.error.set(null);
    this.enterHandoff(this.copy().handoffConfirm);
  }

  cancelHandoff(): void {
    if (this.busy()) {
      return;
    }
    this.mode.set('fahim');
    this.error.set(null);
    this.focusComposer();
  }

  startAgentChat(): void {
    if (!isPlatformBrowser(this.platformId) || this.busy() || this.mode() !== 'handoff') {
      return;
    }

    const name = this.visitorName().trim();
    const email = this.visitorEmail().trim();
    if (name.length < 2) {
      this.error.set(this.copy().handoffNameRequired);
      return;
    }
    if (!this.isValidEmail(email)) {
      this.error.set(this.copy().handoffEmailInvalid);
      return;
    }

    this.error.set(null);
    this.busy.set(true);
    this.sound.unlock();

    const transcript = this.messages()
      .filter((m) => m.role === 'user' || m.role === 'assistant')
      .slice(-8)
      .map((m) => `${m.role === 'user' ? 'Visitor' : 'Fahim'}: ${m.content}`)
      .join('\n');

    const lastUser = [...this.messages()].reverse().find((m) => m.role === 'user')?.content;

    this.pending?.unsubscribe();
    this.pending = this.agentApi
      .start({
        lang: this.locale.lang(),
        visitorName: name,
        visitorEmail: email,
        initialMessage: lastUser,
        transcriptSummary: transcript || undefined,
      })
      .subscribe({
        next: async (res) => {
          this.mode.set('agent');
          this.agentConversationId.set(res.conversationId);
          this.agentStatus.set(res.status);
          this.persistSession({ conversationId: res.conversationId, visitorKey: res.visitorKey });
          this.messages.set(res.messages.map((m) => this.toUiMessage(m)));
          this.busy.set(false);
          await this.bindAgentRealtime(res.conversationId);
          this.focusComposer();
        },
        error: (err: unknown) => {
          this.busy.set(false);
          this.error.set(this.resolveError(err));
        },
      });
  }

  backToFahim(): void {
    if (this.joinedConversationId) {
      void this.hub.leaveConversation(this.joinedConversationId);
      this.joinedConversationId = null;
    }
    this.hubSub?.unsubscribe();
    this.hubSub = null;
    this.clearSession();
    this.mode.set('fahim');
    this.agentConversationId.set(null);
    this.agentStatus.set(null);
    this.error.set(null);
    this.messages.set([{ role: 'assistant', content: this.copy().welcome }]);
  }

  onKeydown(event: KeyboardEvent): void {
    if (event.key === 'Enter' && !event.shiftKey) {
      event.preventDefault();
      this.send();
    }
  }

  private sendAgent(text: string): void {
    const session = this.readSession();
    if (!session) {
      this.error.set(this.copy().error);
      return;
    }

    this.error.set(null);
    this.draft.set('');
    this.messages.update((list) => [...list, { role: 'user', content: text }]);
    this.busy.set(true);

    this.pending?.unsubscribe();
    this.pending = this.agentApi
      .postVisitorMessage(session.conversationId, session.visitorKey, text)
      .subscribe({
        next: (message) => {
          this.busy.set(false);
          this.upsertAgentMessage(message);
          this.focusComposer();
        },
        error: (err: unknown) => {
          this.busy.set(false);
          this.error.set(this.resolveError(err));
          this.focusComposer();
        },
      });
  }

  private async restoreAgentSession(): Promise<void> {
    const session = this.readSession();
    if (!session) {
      return;
    }

    this.agentApi.getForVisitor(session.conversationId, session.visitorKey).subscribe({
      next: async (detail) => {
        if (detail.status === 'Closed') {
          this.clearSession();
          return;
        }
        this.mode.set('agent');
        this.agentConversationId.set(detail.id);
        this.agentStatus.set(detail.status);
        this.messages.set(detail.messages.map((m) => this.toUiMessage(m)));
        await this.bindAgentRealtime(detail.id);
      },
      error: () => this.clearSession(),
    });
  }

  private async bindAgentRealtime(conversationId: string): Promise<void> {
    this.hubSub?.unsubscribe();
    await this.hub.joinConversation(conversationId);
    this.joinedConversationId = conversationId;
    this.hubSub = this.hub.messageCreated$.subscribe((payload) => {
      if ('conversationId' in payload) {
        return;
      }
      const message = payload as AgentMessage;
      this.upsertAgentMessage(message);
      if (message.sender === 'Agent') {
        this.sound.ping();
        this.agentStatus.set('Active');
      } else if (message.sender === 'System') {
        this.sound.ping();
      }
    });
  }

  private upsertAgentMessage(message: AgentMessage): void {
    this.messages.update((list) => {
      if (message.sender === 'Visitor') {
        const last = list[list.length - 1];
        if (last?.role === 'user' && last.content === message.body) {
          return list;
        }
      }
      return [...list, this.toUiMessage(message)];
    });
  }

  private toUiMessage(message: AgentMessage): ChatMessageDto {
    if (message.sender === 'Visitor') {
      return { role: 'user', content: message.body };
    }
    return { role: 'assistant', content: message.body };
  }

  private enterHandoff(confirmMessage: string): void {
    this.busy.set(false);
    this.messages.update((list) => {
      const last = list[list.length - 1];
      if (last?.role === 'assistant' && last.content === confirmMessage) {
        return list;
      }
      return [...list, { role: 'assistant', content: confirmMessage }];
    });
    this.sound.ping();
    this.mode.set('handoff');
    queueMicrotask(() => this.scrollToBottom());
  }

  private seedWelcome(): void {
    if (this.messages().length > 0 || this.mode() === 'agent') {
      return;
    }
    this.messages.set([{ role: 'assistant', content: this.copy().welcome }]);
  }

  private isValidEmail(email: string): boolean {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  }

  private resolveError(err: unknown): string {
    if (err instanceof HttpErrorResponse) {
      const body = err.error as ChatErrorDto | { error?: string } | string | null;
      if (body && typeof body === 'object' && 'error' in body && body.error) {
        const detail = 'detail' in body ? (body as ChatErrorDto).detail : undefined;
        return detail ? `${body.error} ${detail}` : body.error;
      }
      if (err.status === 0) {
        return this.copy().offline;
      }
    }
    return this.copy().error;
  }

  private focusComposer(): void {
    this.composerRef?.nativeElement.focus();
  }

  private scrollToBottom(retry = true): void {
    if (!isPlatformBrowser(this.platformId)) {
      return;
    }

    if (this.scrollRaf) {
      cancelAnimationFrame(this.scrollRaf);
    }

    this.scrollRaf = requestAnimationFrame(() => {
      this.scrollRaf = requestAnimationFrame(() => {
        this.scrollRaf = 0;
        const el = this.transcriptRef?.nativeElement;
        const anchor = this.bottomAnchorRef?.nativeElement;
        if (!el) {
          if (retry && this.open()) {
            setTimeout(() => this.scrollToBottom(false), 0);
          }
          return;
        }
        el.scrollTop = el.scrollHeight;
        anchor?.scrollIntoView({ block: 'end' });
      });
    });
  }

  private persistSession(session: StoredAgentSession): void {
    sessionStorage.setItem(AGENT_SESSION_KEY, JSON.stringify(session));
  }

  private readSession(): StoredAgentSession | null {
    try {
      const raw = sessionStorage.getItem(AGENT_SESSION_KEY);
      if (!raw) {
        return null;
      }
      return JSON.parse(raw) as StoredAgentSession;
    } catch {
      return null;
    }
  }

  private clearSession(): void {
    sessionStorage.removeItem(AGENT_SESSION_KEY);
  }
}
