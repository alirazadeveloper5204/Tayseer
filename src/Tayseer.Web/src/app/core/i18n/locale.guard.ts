import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { LocaleService, AppLocale, localeFromPath } from '../i18n/locale.service';
import { NavigationLoaderService } from '../navigation/navigation-loader.service';

export const localeGuard: CanActivateFn = async (route) => {
  const locale = inject(LocaleService);
  const router = inject(Router);
  const loader = inject(NavigationLoaderService);
  const lang =
    route.paramMap.get('lang') ??
    route.url[0]?.path ??
    localeFromPath(router.url);

  if (lang === 'en' || lang === 'ar') {
    await loader.waitUntilCovered();
    locale.setLocale(lang as AppLocale);
    return true;
  }

  return router.createUrlTree(['/en']);
};
