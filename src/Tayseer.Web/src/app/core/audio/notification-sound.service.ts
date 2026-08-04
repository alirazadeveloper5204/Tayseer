import { Injectable, PLATFORM_ID, inject } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';

/**
 * Short synthesized ping — no audio asset required.
 * Browsers may mute until the user interacts with the page once.
 */
@Injectable({ providedIn: 'root' })
export class NotificationSoundService {
  private readonly platformId = inject(PLATFORM_ID);
  private ctx: AudioContext | null = null;
  private unlocked = false;

  /** Call from a click/keydown so later autoplay is allowed. */
  unlock(): void {
    if (!isPlatformBrowser(this.platformId)) {
      return;
    }
    const ctx = this.ensureContext();
    if (!ctx) {
      return;
    }
    if (ctx.state === 'suspended') {
      void ctx.resume().then(() => {
        this.unlocked = true;
      });
    } else {
      this.unlocked = true;
    }
  }

  ping(): void {
    if (!isPlatformBrowser(this.platformId)) {
      return;
    }

    try {
      const ctx = this.ensureContext();
      if (!ctx) {
        return;
      }

      const play = () => this.playTone(ctx);
      if (ctx.state === 'suspended') {
        void ctx.resume().then(play).catch(() => undefined);
      } else {
        play();
      }
    } catch {
      // Ignore autoplay / audio failures.
    }
  }

  private ensureContext(): AudioContext | null {
    const AudioCtx =
      window.AudioContext ||
      (window as unknown as { webkitAudioContext?: typeof AudioContext }).webkitAudioContext;
    if (!AudioCtx) {
      return null;
    }
    this.ctx ??= new AudioCtx();
    return this.ctx;
  }

  private playTone(ctx: AudioContext): void {
    const now = ctx.currentTime;
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();

    osc.type = 'sine';
    osc.frequency.setValueAtTime(880, now);
    osc.frequency.exponentialRampToValueAtTime(1320, now + 0.06);

    gain.gain.setValueAtTime(0.0001, now);
    gain.gain.exponentialRampToValueAtTime(0.12, now + 0.015);
    gain.gain.exponentialRampToValueAtTime(0.0001, now + 0.18);

    osc.connect(gain);
    gain.connect(ctx.destination);
    osc.start(now);
    osc.stop(now + 0.2);
    this.unlocked = true;
  }
}
