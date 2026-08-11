import {
  Component,
  inject,
  OnInit,
  signal,
  afterNextRender,
  DestroyRef,
  PLATFORM_ID,
  computed,
} from '@angular/core';
import { isPlatformBrowser, DOCUMENT } from '@angular/common';
import { RouterLink, RouterOutlet } from '@angular/router';
import { TopBar } from '../top-bar/top-bar';
import { SiteHeader } from '../header/site-header';
import { SiteFooter } from '../footer/site-footer';
import { ChatWidget } from '../../shared/ui/chat-widget/chat-widget';
import { NavigationLoaderService } from '../../core/navigation/navigation-loader.service';
import { ChromeScrollService } from '../../core/navigation/chrome-scroll.service';
import { LocaleService } from '../../core/i18n/locale.service';
import { UiCopyService } from '../../core/i18n/ui-copy.service';
import { ApiWakeService } from '../../core/api/api-wake.service';

@Component({
  selector: 'app-shell',
  imports: [RouterOutlet, RouterLink, TopBar, SiteHeader, SiteFooter, ChatWidget],
  templateUrl: './shell.html',
  styleUrl: './shell.css',
})
export class Shell implements OnInit {
  private readonly document = inject(DOCUMENT);
  private readonly platformId = inject(PLATFORM_ID);
  private readonly destroyRef = inject(DestroyRef);
  private readonly locale = inject(LocaleService);
  private readonly apiWake = inject(ApiWakeService);
  readonly navigationLoader = inject(NavigationLoaderService);
  readonly chromeScroll = inject(ChromeScrollService);
  readonly copy = inject(UiCopyService).copy;
  readonly lang = computed(() => this.locale.lang());

  readonly topBarHidden = signal(false);

  private lastY = 0;
  private ticking = false;

  private lockUntil = 0;

  constructor() {
    afterNextRender(() => {
      if (!isPlatformBrowser(this.platformId)) {
        return;
      }

      const win = this.document.defaultView;
      if (!win) {
        return;
      }

      this.lastY = win.scrollY;

      const onScroll = () => {
        if (this.ticking) {
          return;
        }
        this.ticking = true;
        win.requestAnimationFrame(() => {
          this.ticking = false;
          this.applyScroll(win.scrollY);
        });
      };

      win.addEventListener('scroll', onScroll, { passive: true });
      this.destroyRef.onDestroy(() => win.removeEventListener('scroll', onScroll));
    });
  }

  ngOnInit(): void {
    void this.finishBootWhenApiReady();
  }

  private async finishBootWhenApiReady(): Promise<void> {
    if (isPlatformBrowser(this.platformId)) {
      await this.apiWake.ensureAwake();
    }
    this.navigationLoader.markAppReady();
  }

  private applyScroll(y: number): void {
    const win = this.document.defaultView;
    if (!win) {
      return;
    }

    const now = performance.now();
    const delta = y - this.lastY;
    this.lastY = y;




    if (now < this.lockUntil) {
      return;
    }

    const maxY = Math.max(0, this.document.documentElement.scrollHeight - win.innerHeight);
    if (y >= maxY - 64) {
      return;
    }

    let next = this.topBarHidden();
    if (y < 40) {
      next = false;
    } else if (delta > 6) {
      next = true;
    } else if (delta < -6) {
      next = false;
    }

    if (next !== this.topBarHidden()) {
      this.topBarHidden.set(next);
      this.chromeScroll.topBarHidden.set(next);
      this.lockUntil = now + 320;
    }
  }
}
