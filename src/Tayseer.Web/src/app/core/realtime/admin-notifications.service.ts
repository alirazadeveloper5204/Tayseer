import { Injectable, OnDestroy, inject, signal } from '@angular/core';
import { Subscription } from 'rxjs';
import { AgentNotificationPayload } from '../../models/agent-chat.model';
import { NotificationSoundService } from '../audio/notification-sound.service';
import { AgentChatHubService } from './agent-chat-hub.service';

@Injectable({ providedIn: 'root' })
export class AdminNotificationsService implements OnDestroy {
  private readonly hub = inject(AgentChatHubService);
  private readonly sound = inject(NotificationSoundService);
  private sub: Subscription | null = null;
  private started = false;

  readonly items = signal<AgentNotificationPayload[]>([]);
  readonly unreadCount = signal(0);

  async start(): Promise<void> {
    if (this.started) {
      return;
    }
    this.started = true;
    await this.hub.connectAsAdmin();
    this.sub = this.hub.notifications$.subscribe((n) => {
      this.items.update((list) => [n, ...list].slice(0, 30));
      this.unreadCount.update((c) => c + 1);
      this.sound.ping();
    });
  }

  /** Unlock audio after the admin interacts with the panel. */
  unlockSound(): void {
    this.sound.unlock();
  }

  clearUnread(): void {
    this.unreadCount.set(0);
  }

  dismiss(conversationId: string): void {
    this.items.update((list) => list.filter((n) => n.conversationId !== conversationId));
  }

  ngOnDestroy(): void {
    this.sub?.unsubscribe();
  }
}
