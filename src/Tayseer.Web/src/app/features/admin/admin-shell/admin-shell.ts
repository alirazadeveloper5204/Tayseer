import { Component, OnInit, afterNextRender, inject } from '@angular/core';
import { Router, RouterLink, RouterLinkActive, RouterOutlet } from '@angular/router';
import { AuthService } from '../../../core/auth/auth.service';
import { NavigationLoaderService } from '../../../core/navigation/navigation-loader.service';
import { AdminNotificationsService } from '../../../core/realtime/admin-notifications.service';

@Component({
  selector: 'app-admin-shell',
  imports: [RouterOutlet, RouterLink, RouterLinkActive],
  templateUrl: './admin-shell.html',
  styleUrl: './admin-shell.css',
})
export class AdminShell implements OnInit {
  readonly auth = inject(AuthService);
  readonly notifications = inject(AdminNotificationsService);
  private readonly router = inject(Router);
  private readonly navigationLoader = inject(NavigationLoaderService);

  constructor() {
    // Admin routes bypass Shell, which is what normally dismisses the boot loader.
    afterNextRender(() => this.navigationLoader.markAppReady());
  }

  ngOnInit(): void {
    void this.notifications.start();
  }

  logout(): void {
    this.auth.logout();
  }

  onShellPointerDown(): void {
    this.notifications.unlockSound();
  }

  openNotification(conversationId: string): void {
    this.notifications.unlockSound();
    this.notifications.dismiss(conversationId);
    this.notifications.clearUnread();
    void this.router.navigateByUrl(`/admin/inbox?c=${conversationId}`);
  }
}
