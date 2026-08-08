import { Injectable, signal, computed, inject, PLATFORM_ID } from '@angular/core';
import { DOCUMENT, isPlatformBrowser } from '@angular/common';
import { NavigationLoaderService } from '../navigation/navigation-loader.service';

export type ThemeMode = 'light' | 'dark';

@Injectable({ providedIn: 'root' })
export class ThemeService {
  private readonly document = inject(DOCUMENT);
  private readonly platformId = inject(PLATFORM_ID);
  private readonly navigationLoader = inject(NavigationLoaderService);
  private readonly mode = signal<ThemeMode>('dark');
  private ready = false;

  readonly theme = this.mode.asReadonly();
  readonly isDark = computed(() => this.mode() === 'dark');

  init(): void {


    if (!isPlatformBrowser(this.platformId)) {
      this.applyTheme('dark');
      this.ready = true;
      return;
    }

    const root = this.document.documentElement;
    const fromDom: ThemeMode = root.classList.contains('dark') ? 'dark' : 'light';
    const stored = this.readStored();
    this.applyTheme(stored ?? fromDom);
    this.ready = true;
  }

  toggle(): void {
    this.setTheme(this.mode() === 'dark' ? 'light' : 'dark');
  }

  setTheme(theme: ThemeMode): void {
    if (theme === this.mode()) {
      return;
    }


    if (!this.ready || !isPlatformBrowser(this.platformId)) {
      this.applyTheme(theme);
      return;
    }

    this.navigationLoader.runCovered(() => {

      this.document.documentElement.classList.add('theme-switching');
      this.applyTheme(theme);
    });
  }

  private applyTheme(theme: ThemeMode): void {
    this.mode.set(theme);
    const root = this.document.documentElement;
    root.classList.toggle('dark', theme === 'dark');
    if (isPlatformBrowser(this.platformId)) {
      localStorage.setItem('tayseer-theme', theme);
    }
  }

  private readStored(): ThemeMode | null {
    if (!isPlatformBrowser(this.platformId)) {
      return null;
    }
    const themeValue = localStorage.getItem('tayseer-theme');
    return themeValue === 'light' || themeValue === 'dark' ? themeValue : null;
  }
}
