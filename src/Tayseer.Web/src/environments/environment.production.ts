export const environment = {
  production: true,
  /** Same-origin — browser uses /api via the SSR reverse proxy. */
  apiBaseUrl: '',
  /** Server-side fetches talk to the API directly (public or private network URL). */
  ssrApiBaseUrl: 'https://tayseer-api-mp4f.onrender.com',
  useStaticContent: false,
  siteUrl: 'https://tayseer-web.onrender.com',
  defaultOgImage: '/brand/logo-light.svg',
};
