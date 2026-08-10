# Build from repo root.
#
# Local (explicit ARG):
#   docker build -f src/Tayseer.Web/Dockerfile \
#     --build-arg API_BASE_URL=https://YOUR-API.onrender.com \
#     --build-arg SSR_API_BASE_URL=https://YOUR-API.onrender.com \
#     -t tayseer-web .
#
# Browser uses same-origin /api (empty apiBaseUrl). Node SSR proxies /api,/hubs,/health
# to API_BASE_URL (or API_PROXY_TARGET / SSR_API_BASE_URL at runtime).
# Render: set service env vars API_BASE_URL / SSR_API_BASE_URL / SITE_URL.
FROM node:22-bookworm AS build
WORKDIR /app

ARG API_BASE_URL=https://tayseer-api-mp4f.onrender.com
ARG SSR_API_BASE_URL=
ARG SITE_URL=https://tayseer-web.onrender.com

COPY src/Tayseer.Web/package.json src/Tayseer.Web/package-lock.json ./
RUN npm ci

COPY src/Tayseer.Web/ ./

ENV API_BASE_URL=${API_BASE_URL}
ENV SSR_API_BASE_URL=${SSR_API_BASE_URL}
ENV SITE_URL=${SITE_URL}

RUN node <<'EOF'
const fs = require('fs');
const api = process.env.API_BASE_URL;
const ssr = process.env.SSR_API_BASE_URL || api;
const site = (process.env.SITE_URL || 'https://tayseer-web.onrender.com').replace(/\/$/, '');
const content = `export const environment = {
  production: true,
  apiBaseUrl: '',
  ssrApiBaseUrl: '${ssr}',
  useStaticContent: false,
  siteUrl: '${site}',
  defaultOgImage: '/brand/logo-light.svg',
};
`;
fs.writeFileSync('src/environments/environment.production.ts', content);
console.log('Wrote production environment:\n' + content);

// Keep robots/sitemap host aligned with SITE_URL for this build.
const robots = `User-agent: *
Allow: /
Disallow: /admin
Disallow: /admin/

Sitemap: ${site}/sitemap.xml
`;
fs.writeFileSync('public/robots.txt', robots);
const sitemapPath = 'public/sitemap.xml';
if (fs.existsSync(sitemapPath)) {
  const xml = fs.readFileSync(sitemapPath, 'utf8')
    .replaceAll('https://tayseer-web.onrender.com', site);
  fs.writeFileSync(sitemapPath, xml);
}
EOF

RUN npm run build

FROM node:22-bookworm-slim AS final
WORKDIR /app
ENV NODE_ENV=production
ENV PORT=4000
EXPOSE 4000

COPY --from=build /app/dist/Tayseer.Web ./dist/Tayseer.Web

CMD ["node", "dist/Tayseer.Web/server/server.mjs"]
