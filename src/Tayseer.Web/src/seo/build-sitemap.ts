import { CASE_STUDIES_PAGE } from '../app/core/content/page-content';
import { SEO_PAGES } from '../app/core/seo/seo-pages';
import { staticServiceSlugs, solutionPublicPath } from '../app/core/content/static-services';

const SKIP_SITEMAP_KEYS = new Set(['connect']);

function xmlEscape(value: string): string {
  return value
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')
    .replaceAll('"', '&quot;');
}

function pageKeys(): string[] {
  return Object.keys(SEO_PAGES).filter((key) => !SKIP_SITEMAP_KEYS.has(key));
}

function hreflangBlock(site: string, rest: string): string {
  const en = `${site}/en${rest}`;
  const ar = `${site}/ar${rest}`;
  return [
    `    <xhtml:link rel="alternate" hreflang="en" href="${xmlEscape(en)}" />`,
    `    <xhtml:link rel="alternate" hreflang="ar" href="${xmlEscape(ar)}" />`,
    `    <xhtml:link rel="alternate" hreflang="x-default" href="${xmlEscape(en)}" />`,
  ].join('\n');
}

function urlEntry(site: string, rest: string, changefreq: string, priority: string): string {
  const loc = `${site}/en${rest}`;
  const arLoc = `${site}/ar${rest}`;
  return `${urlPair(loc, rest, site, changefreq, priority)}${urlPair(arLoc, rest, site, changefreq, priority)}`;
}

function urlPair(
  loc: string,
  rest: string,
  site: string,
  changefreq: string,
  priority: string,
): string {
  return `  <url>
    <loc>${xmlEscape(loc)}</loc>
${hreflangBlock(site, rest)}
    <changefreq>${changefreq}</changefreq>
    <priority>${priority}</priority>
  </url>
`;
}

export function buildSitemapXml(siteUrl: string, extraServicePaths: string[] = []): string {
  const site = siteUrl.replace(/\/$/, '');
  const chunks: string[] = [];

  for (const key of pageKeys()) {
    const rest = key ? `/${key}` : '';
    const priority = key === '' ? '1.0' : key.startsWith('legal/') ? '0.3' : '0.8';
    const changefreq = key === '' ? 'weekly' : key.startsWith('legal/') ? 'yearly' : 'monthly';
    chunks.push(urlEntry(site, rest, changefreq, priority));
  }

  const servicePaths = new Set<string>([
    ...staticServiceSlugs().map((slug) => solutionPublicPath(slug)),
    ...extraServicePaths,
  ]);
  for (const path of [...servicePaths].sort()) {
    if (pageKeys().includes(path.replace(/^\//, ''))) {
      continue;
    }
    chunks.push(urlEntry(site, path, 'monthly', '0.8'));
  }

  for (const item of CASE_STUDIES_PAGE.items) {
    chunks.push(urlEntry(site, `/case-studies/${item.slug}`, 'monthly', '0.6'));
  }

  return `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"
        xmlns:xhtml="http://www.w3.org/1999/xhtml">
${chunks.join('')}
</urlset>
`;
}
