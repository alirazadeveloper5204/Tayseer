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

const isProd = process.env['NODE_ENV'] === 'production';

/** Browser security headers for HTML/assets (API responses set their own via .NET). */
app.use((req, res, next) => {
  res.setHeader('X-Content-Type-Options', 'nosniff');
  res.setHeader('X-Frame-Options', 'DENY');
  res.setHeader('Referrer-Policy', 'strict-origin-when-cross-origin');
  res.setHeader('Permissions-Policy', 'camera=(), microphone=(), geolocation=()');
  res.setHeader('X-Permitted-Cross-Domain-Policies', 'none');
  if (isProd) {
    res.setHeader('Strict-Transport-Security', 'max-age=31536000; includeSubDomains');
  }
  next();
});

/**
 * Public API hostname — required to wake Render free dynos.
 * Free web services only wake on public inbound traffic (private network does not wake them).
 */
const publicApiUpstream = (process.env['API_BASE_URL'] || '').replace(/\/$/, '');

/** Upstream for /api proxy (may be private on paid plans; prefer public on free). */
const apiUpstream = (
  process.env['API_PROXY_TARGET'] ||
  process.env['SSR_API_BASE_URL'] ||
  process.env['API_BASE_URL'] ||
  ''
).replace(/\/$/, '');

const wakeTarget = publicApiUpstream || apiUpstream;

const apiProxy = apiUpstream
  ? createProxyMiddleware({
      target: apiUpstream,
      changeOrigin: true,
      ws: true,
      xfwd: true,
      // Cold starts often exceed the default proxy timeout.
      proxyTimeout: 120_000,
      timeout: 120_000,
      pathFilter: ['/api', '/hubs', '/health'],
    })
  : null;

/**
 * Long-held server-side wake. Browser polls this so Node (not the short-lived proxy hop)
 * waits on Render's public spin-up page.
 */
app.get('/__wake-api', async (_req, res) => {
  if (!wakeTarget) {
    res.status(503).json({ ok: false, ready: false, reason: 'no_upstream' });
    return;
  }

  try {
    const health = await fetch(`${wakeTarget}/health`, {
      signal: AbortSignal.timeout(90_000),
      headers: { Accept: 'application/json, text/plain, */*' },
    });
    let ready = false;
    if (health.ok) {
      try {
        const readyRes = await fetch(`${wakeTarget}/health/ready`, {
          signal: AbortSignal.timeout(20_000),
          headers: { Accept: 'application/json, text/plain, */*' },
        });
        ready = readyRes.ok;
      } catch {
        ready = false;
      }
    }
    res.status(health.ok ? 200 : 502).json({ ok: health.ok, ready });
  } catch {
    res.status(503).json({ ok: false, ready: false });
  }
});

if (apiProxy) {
  app.use(apiProxy);
} else {
  console.warn(
    '[ssr] No API_PROXY_TARGET / SSR_API_BASE_URL / API_BASE_URL — /api proxy disabled',
  );
}

/** When the web dyno boots, nudge the public API awake ASAP. */
function wakeUpstreamApi(): void {
  if (!wakeTarget) {
    return;
  }
  for (const path of ['/health', '/health/ready']) {
    void fetch(`${wakeTarget}${path}`).catch(() => {
      /* cold API may take 30–90s — browser /__wake-api poll continues */
    });
  }
}
wakeUpstreamApi();

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
    if (wakeTarget) {
      console.log(`[ssr] Wake target → ${wakeTarget}`);
    }
  });

  if (apiProxy) {
    server.on('upgrade', apiProxy.upgrade);
  }
}

export const reqHandler = createNodeRequestHandler(app);
