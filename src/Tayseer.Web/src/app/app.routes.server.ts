import { RenderMode, ServerRoute } from '@angular/ssr';

/**
 * Phase 1: SSR all routes at request time.
 * Phase 2+ can prerender /en and /ar with getPrerenderParams.
 */
export const serverRoutes: ServerRoute[] = [
  {
    path: '**',
    renderMode: RenderMode.Server,
  },
];
