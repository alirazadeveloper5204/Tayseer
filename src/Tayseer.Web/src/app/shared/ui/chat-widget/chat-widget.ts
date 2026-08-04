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
import { LocaleService } from '../../../core/i18n/locale.service';
import { UiCopyService } from '../../../core/i18n/ui-copy.service';
import { ChatMessageDto, ChatErrorDto } from '../../../models/chat.model';

@Component({
  selector: 'app-chat-widget',
  imports: [FormsModule],
  templateUrl: './chat-widget.html',
  styleUrl: './chat-widget.css',
  encapsulation: ViewEncapsulation.None,
})
export class ChatWidget implements OnDestroy {
  private readonly chatApi = inject(ChatApiService);
  private readonly locale = inject(LocaleService);
  private readonly ui = inject(UiCopyService);
  private readonly platformId = inject(PLATFORM_ID);
  private pending: Subscription | null = null;
  private scrollRaf = 0;

  @ViewChild('transcript') private transcriptRef?: ElementRef<HTMLElement>;
  @ViewChild('bottomAnchor') private bottomAnchorRef?: ElementRef<HTMLElement>;
  @ViewChild('composer') private composerRef?: ElementRef<HTMLTextAreaElement>;

  readonly open = signal(false);
  readonly expanded = signal(false);
  readonly draft = signal('');
  readonly busy = signal(false);
  readonly error = signal<string | null>(null);
  readonly messages = signal<ChatMessageDto[]>([]);

  readonly copy = computed(() => this.ui.copy().chat);
  readonly isRtl = this.locale.isRtl;

  constructor() {
    afterNextRender(() => {
      if (!isPlatformBrowser(this.platformId)) {
        return;
      }
      this.seedWelcome();
    });

    effect(() => {
      // Re-run whenever the transcript content changes.
      this.messages();
      this.busy();
      this.open();
      this.expanded();
      if (!isPlatformBrowser(this.platformId) || !this.open()) {
        return;
      }
      this.scrollToBottom();
    });
  }

  ngOnDestroy(): void {
    this.pending?.unsubscribe();
    if (this.scrollRaf) {
      cancelAnimationFrame(this.scrollRaf);
    }
  }

  toggle(): void {
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
    if (!isPlatformBrowser(this.platformId) || this.busy()) {
      return;
    }

    const text = this.draft().trim();
    if (!text) {
      return;
    }

    this.error.set(null);
    this.draft.set('');
    const nextMessages: ChatMessageDto[] = [...this.messages(), { role: 'user', content: text }];
    this.messages.set(nextMessages);
    this.busy.set(true);

    this.pending?.unsubscribe();
    this.pending = this.chatApi.send(nextMessages).subscribe({
      next: (res) => {
        this.messages.update((list) => [...list, { role: 'assistant', content: res.reply }]);
        this.busy.set(false);
        this.focusComposer();
      },
      error: (err: unknown) => {
        this.busy.set(false);
        this.error.set(this.resolveError(err));
        this.focusComposer();
      },
    });
  }

  onKeydown(event: KeyboardEvent): void {
    if (event.key === 'Enter' && !event.shiftKey) {
      event.preventDefault();
      this.send();
    }
  }

  private seedWelcome(): void {
    if (this.messages().length > 0) {
      return;
    }
    this.messages.set([{ role: 'assistant', content: this.copy().welcome }]);
  }

  private resolveError(err: unknown): string {
    if (err instanceof HttpErrorResponse) {
      const body = err.error as ChatErrorDto | string | null;
      if (body && typeof body === 'object' && 'error' in body && body.error) {
        return body.detail ? `${body.error} ${body.detail}` : body.error;
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

    // Wait for Angular to paint new bubbles / typing indicator, then scroll.
    this.scrollRaf = requestAnimationFrame(() => {
      this.scrollRaf = requestAnimationFrame(() => {
        this.scrollRaf = 0;
        const el = this.transcriptRef?.nativeElement;
        const anchor = this.bottomAnchorRef?.nativeElement;
        if (!el) {
          // Panel may not be mounted yet on the first open tick.
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
}
