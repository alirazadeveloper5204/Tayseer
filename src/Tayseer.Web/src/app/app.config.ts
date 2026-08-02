import {
  ApplicationConfig,
  provideBrowserGlobalErrorListeners,
  provideAppInitializer,
  inject,
} from '@angular/core';
import { provideRouter } from '@angular/router';
import { provideHttpClient, withFetch } from '@angular/common/http';
import { provideClientHydration, withEventReplay, withHttpTransferCacheOptions } from '@angular/platform-browser';

import { routes } from './app.routes';
import { ThemeService } from './core/theme/theme.service';
import { LocaleService } from './core/i18n/locale.service';
import { NavigationLoaderService } from './core/navigation/navigation-loader.service';

export const appConfig: ApplicationConfig = {
  providers: [
    provideBrowserGlobalErrorListeners(),
    provideRouter(routes),
    provideHttpClient(withFetch()),
    provideClientHydration(
      withEventReplay(),
      // Reuse SSR HTTP responses on the client (no double-fetch flash).
      withHttpTransferCacheOptions({
        includeRequestsWithAuthHeaders: false,
      }),
    ),
    provideAppInitializer(() => {
      inject(ThemeService).init();
      inject(LocaleService).init();
      // Instantiate early so the first NavigationStart is never missed.
      inject(NavigationLoaderService);
    }),
  ],
};
