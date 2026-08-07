import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { LocaleService, AppLocale } from '../i18n/locale.service';
import { NavigationLoaderService } from '../navigation/navigation-loader.service';

export const localeGuard: CanActivateFn = async (route) => {
  const lang = route.paramMap.get('lang');
  const locale = inject(LocaleService);
  const router = inject(Router);
  const loader = inject(NavigationLoaderService);

  if (lang === 'en' || lang === 'ar') {

    await loader.waitUntilCovered();
    locale.setLocale(lang as AppLocale);
    return true;
  }

  return router.createUrlTree(['/en']);
};
