import { HttpInterceptorFn } from '@angular/common/http';

/** Send cookies (HttpOnly JWT) on API calls; no Authorization header from JS. */
export const authInterceptor: HttpInterceptorFn = (req, next) => {
  if (!req.url.includes('/api/') && !req.url.includes('/hubs/')) {
    return next(req);
  }

  return next(
    req.clone({
      withCredentials: true,
    }),
  );
};
