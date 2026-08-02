import { Injectable, signal, computed, inject, PLATFORM_ID } from '@angular/core';
import { DOCUMENT, isPlatformBrowser } from '@angular/common';

export type AppLocale = 'en' | 'ar';

@Injectable({ providedIn: 'root' })
export class LocaleService {
  private readonly document = inject(DOCUMENT);
  private readonly platformId = inject(PLATFORM_ID);
  private readonly locale = signal<AppLocale>('en');

  readonly lang = this.locale.asReadonly();
  readonly isRtl = computed(() => this.locale() === 'ar');
  readonly dir = computed(() => (this.locale() === 'ar' ? 'rtl' : 'ltr'));

  init(): void {
    const stored = this.readStored();
    this.setLocale(stored ?? 'en');
  }

  toggle(): void {
    this.setLocale(this.locale() === 'en' ? 'ar' : 'en');
  }

  setLocale(locale: AppLocale): void {
    this.locale.set(locale);
    const root = this.document.documentElement;
    root.lang = locale;
    root.dir = locale === 'ar' ? 'rtl' : 'ltr';
    if (isPlatformBrowser(this.platformId)) {
      localStorage.setItem('tayseer-locale', locale);
    }
  }

  private readStored(): AppLocale | null {
    if (!isPlatformBrowser(this.platformId)) {
      return null;
    }
    const value = localStorage.getItem('tayseer-locale');
    return value === 'en' || value === 'ar' ? value : null;
  }
}
