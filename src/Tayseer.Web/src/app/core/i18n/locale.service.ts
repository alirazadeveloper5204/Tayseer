import { Injectable, signal, computed, inject, PLATFORM_ID } from '@angular/core';
import { DOCUMENT, isPlatformBrowser } from '@angular/common';

export type AppLocale = 'en' | 'ar';

export function localeFromPath(path: string): AppLocale | null {
  const first = path.split('?')[0].split('#')[0].split('/').filter(Boolean)[0];
  return first === 'en' || first === 'ar' ? first : null;
}

@Injectable({ providedIn: 'root' })
export class LocaleService {
  private readonly document = inject(DOCUMENT);
  private readonly platformId = inject(PLATFORM_ID);
  private readonly locale = signal<AppLocale>('en');

  readonly lang = this.locale.asReadonly();
  readonly isRtl = computed(() => this.locale() === 'ar');
  readonly dir = computed(() => (this.locale() === 'ar' ? 'rtl' : 'ltr'));

  init(): void {
    if (!isPlatformBrowser(this.platformId)) {
      return;
    }

    const fromUrl = localeFromPath(this.document.defaultView?.location.pathname ?? '');
    if (fromUrl) {
      this.setLocale(fromUrl);
      return;
    }

    const stored = this.document.defaultView?.localStorage.getItem('tayseer-locale');
    if (stored === 'en' || stored === 'ar') {
      this.setLocale(stored);
    }
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
}
