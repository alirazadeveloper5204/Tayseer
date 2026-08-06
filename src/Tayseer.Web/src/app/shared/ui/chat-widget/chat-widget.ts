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
const FAB_POS_KEY = 'tayseer-chat-fab-pos';
const FAB_SIZE = 76;
const FAB_PAD = 12;

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
  private dragPointerId: number | null = null;
  private dragOrigin = { x: 0, y: 0, left: 0, top: 0 };
  private dragMoved = false;
  private suppressClick = false;
  private onViewportChange = () => this.keepFabInViewport();

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
  readonly fabX = signal<number | null>(null);
  readonly fabY = signal<number | null>(null);
  readonly dragging = signal(false);
  readonly viewportW = signal(0);
  readonly viewportH = signal(0);

  readonly hasCustomPos = computed(() => this.fabX() !== null && this.fabY() !== null);
  readonly panelBox = computed(() => {
    if (!this.open() || !this.hasCustomPos()) {
      return null;
    }
    const vw = this.viewportW() || 1280;
    const vh = this.viewportH() || 800;
    if (this.expanded() && vw < 481) {
      return null;
    }

    const fabX = this.fabX() ?? FAB_PAD;
    const fabY = this.fabY() ?? FAB_PAD;
    const pad = FAB_PAD;
    const gap = 10;
    const mobileCta = vw < 640 ? 88 : 0;
    const preferredW = this.expanded() ? Math.min(vw - pad * 2, 640) : Math.min(vw - pad * 2, 360);
    const preferredH = this.expanded()
      ? Math.min(vh - pad * 2 - mobileCta, 736)
      : Math.min(vh * 0.7, 544);

    const spaceLeft = fabX + FAB_SIZE - pad;
    const spaceRight = vw - fabX - pad;
    const openLeft = spaceLeft >= spaceRight;
    const width = Math.max(240, Math.min(preferredW, openLeft ? spaceLeft : spaceRight));
    let left = openLeft ? fabX + FAB_SIZE - width : fabX;
    left = Math.min(Math.max(left, pad), Math.max(pad, vw - width - pad));

    const spaceAbove = fabY - pad - gap;
    const spaceBelow = vh - (fabY + FAB_SIZE) - pad - gap - mobileCta;
    const openAbove = spaceAbove >= Math.min(preferredH, 260) || spaceAbove >= spaceBelow;
    let height = Math.max(220, Math.min(preferredH, openAbove ? spaceAbove : spaceBelow));
    let top = openAbove ? fabY - gap - height : fabY + FAB_SIZE + gap;

    if (height < 220) {
      height = Math.max(220, Math.min(preferredH, vh - pad * 2 - mobileCta));
      top = pad;
    }

    top = Math.min(Math.max(top, pad), Math.max(pad, vh - height - pad - mobileCta));
    return { left, top, width, height };
  });

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
      this.restoreFabPosition();
      this.viewportW.set(window.innerWidth);
      this.viewportH.set(window.innerHeight);
      window.addEventListener('resize', this.onViewportChange);
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
    if (isPlatformBrowser(this.platformId)) {
      window.removeEventListener('resize', this.onViewportChange);
    }
  }

  onFabPointerDown(event: PointerEvent): void {
    if (!isPlatformBrowser(this.platformId) || event.button !== 0) {
      return;
    }
    const target = event.currentTarget as HTMLElement;
    const rect = target.getBoundingClientRect();
    this.dragPointerId = event.pointerId;
    this.dragMoved = false;
    this.dragOrigin = {
      x: event.clientX,
      y: event.clientY,
      left: rect.left,
      top: rect.top,
    };
    target.setPointerCapture(event.pointerId);
  }

  onFabPointerMove(event: PointerEvent): void {
    if (this.dragPointerId !== event.pointerId) {
      return;
    }
    const dx = event.clientX - this.dragOrigin.x;
    const dy = event.clientY - this.dragOrigin.y;
    if (!this.dragMoved && Math.hypot(dx, dy) < 8) {
      return;
    }
    this.dragMoved = true;
    this.dragging.set(true);
    this.setFabPosition(this.dragOrigin.left + dx, this.dragOrigin.top + dy);
  }

  onFabPointerUp(event: PointerEvent): void {
    if (this.dragPointerId !== event.pointerId) {
      return;
    }
    this.dragPointerId = null;
    if (this.dragMoved) {
      this.suppressClick = true;
      this.persistFabPosition();
    }
    this.dragging.set(false);
  }

  onFabClick(event: MouseEvent): void {
    if (this.suppressClick || this.dragMoved) {
      event.preventDefault();
      event.stopPropagation();
      this.suppressClick = false;
      this.dragMoved = false;
      return;
    }
    this.toggle();
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

  startAgentChat(event?: Event): void {
    event?.preventDefault();
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

  private restoreFabPosition(): void {
    try {
      const raw = localStorage.getItem(FAB_POS_KEY);
      if (!raw) {
        return;
      }
      const pos = JSON.parse(raw) as { x: number; y: number };
      if (typeof pos.x === 'number' && typeof pos.y === 'number') {
        this.setFabPosition(pos.x, pos.y);
      }
    } catch {
      localStorage.removeItem(FAB_POS_KEY);
    }
  }

  private persistFabPosition(): void {
    const x = this.fabX();
    const y = this.fabY();
    if (x === null || y === null) {
      return;
    }
    localStorage.setItem(FAB_POS_KEY, JSON.stringify({ x, y }));
  }

  private keepFabInViewport(): void {
    this.viewportW.set(window.innerWidth);
    this.viewportH.set(window.innerHeight);
    const x = this.fabX();
    const y = this.fabY();
    if (x === null || y === null) {
      return;
    }
    this.setFabPosition(x, y);
  }

  private setFabPosition(x: number, y: number): void {
    const bounds = this.fabBounds();
    this.fabX.set(Math.min(bounds.maxX, Math.max(bounds.minX, x)));
    this.fabY.set(Math.min(bounds.maxY, Math.max(bounds.minY, y)));
  }

  private fabBounds(): { minX: number; minY: number; maxX: number; maxY: number } {
    const mobileCta = window.innerWidth < 640 ? 88 : 0;
    return {
      minX: FAB_PAD,
      minY: FAB_PAD,
      maxX: Math.max(FAB_PAD, window.innerWidth - FAB_SIZE - FAB_PAD),
      maxY: Math.max(FAB_PAD, window.innerHeight - FAB_SIZE - FAB_PAD - mobileCta),
    };
  }
}
