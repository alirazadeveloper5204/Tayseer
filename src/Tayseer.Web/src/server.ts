import {
  AngularNodeAppEngine,
  createNodeRequestHandler,
  isMainModule,
  writeResponseToNodeResponse,
} from '@angular/ssr/node';
import express from 'express';
import { createProxyMiddleware } from 'http-proxy-middleware';
import { join } from 'node:path';

const browserDistFolder = join(import.meta.dirname, '../browser');

const app = express();
const angularApp = new AngularNodeAppEngine();

/** Upstream API for same-origin browser requests (/api, /hubs, /health). */
const apiUpstream = (
  process.env['API_PROXY_TARGET'] ||
  process.env['SSR_API_BASE_URL'] ||
  process.env['API_BASE_URL'] ||
  ''
).replace(/\/$/, '');

const apiProxy = apiUpstream
  ? createProxyMiddleware({
      target: apiUpstream,
      changeOrigin: true,
      ws: true,
      pathFilter: ['/api', '/hubs', '/health'],
    })
  : null;

if (apiProxy) {
  app.use(apiProxy);
} else {
  console.warn(
    '[ssr] No API_PROXY_TARGET / SSR_API_BASE_URL / API_BASE_URL — /api proxy disabled',
  );
}

app.use(
  express.static(browserDistFolder, {
    maxAge: '1y',
    index: false,
    redirect: false,
  }),
);

app.use((req, res, next) => {
  angularApp
    .handle(req)
    .then((response) =>
      response ? writeResponseToNodeResponse(response, res) : next(),
    )
    .catch(next);
});

if (isMainModule(import.meta.url) || process.env['pm_id']) {
  const port = process.env['PORT'] || 4000;
  const server = app.listen(port, (error) => {
    if (error) {
      throw error;
    }

    console.log(`Node Express server listening on http://localhost:${port}`);
    if (apiUpstream) {
      console.log(`[ssr] Proxying /api /hubs /health → ${apiUpstream}`);
    }
  });

  if (apiProxy) {
    server.on('upgrade', apiProxy.upgrade);
  }
}

export const reqHandler = createNodeRequestHandler(app);
