export const environment = {
  production: false,
  /** Empty = same-origin via `proxy.conf.json` during `ng serve`. */
  apiBaseUrl: '',
  /** Absolute API URL used for SSR (Node has no Angular proxy). */
  ssrApiBaseUrl: 'http://localhost:5095',
};
