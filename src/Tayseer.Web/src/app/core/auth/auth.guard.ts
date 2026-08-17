import { isPlatformBrowser } from '@angular/common';
import { PLATFORM_ID, inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { map } from 'rxjs';
import { AuthService } from './auth.service';

export const authGuard: CanActivateFn = () => {
  const auth = inject(AuthService);
  const router = inject(Router);
  const platformId = inject(PLATFORM_ID);

  // Session lives in an HttpOnly cookie — only resolvable in the browser.
  if (!isPlatformBrowser(platformId)) {
    return true;
  }

  return auth.ensureSession().pipe(map((ok) => ok || router.createUrlTree(['/admin/login'])));
};

export const guestGuard: CanActivateFn = () => {
  const auth = inject(AuthService);
  const router = inject(Router);
  const platformId = inject(PLATFORM_ID);

  if (!isPlatformBrowser(platformId)) {
    return true;
  }

  return auth.ensureSession().pipe(map((ok) => (!ok ? true : router.createUrlTree(['/admin']))));
};
