# On-page SEO

Implemented in the Angular SSR app. Production canonicals follow `SITE_URL` (Docker build ARG / env).

| Item | Status |
|------|--------|
| XML sitemap | Dynamic `/sitemap.xml` (pages + CMS services + case studies). Fallback static file for `ng serve`. |
| robots.txt | Disallows `/admin`; sitemap URL follows `SITE_URL` |
| Titles + meta descriptions | Per-route EN/AR catalog; product/case-study pages set their own |
| Canonical + hreflang | Updated on each navigation (`en` / `ar` / `x-default`) |
| Open Graph + X/Twitter cards | Via `SeoService`; default share image is a JPG (`/images/solutions-banner.jpg`) |
| Organization / WebSite / WebPage schema | JSON-LD graph + LinkedIn `sameAs` |
| Service + Article + FAQPage + BreadcrumbList | Product, case-study, and FAQ pages |
| Real 404 | Unknown URLs render a not-found page with HTTP 404 + `noindex` (no homepage soft-404) |
| Canonical aliases | `/connect` → `/contact`, `/blog` → `/faqs` (301 in production SSR) |
| Legacy WordPress / `.html` paths | 301 map in `src/seo/legacy-redirects.ts` |

## Off-site items (not in repo)

These need marketing/DNS/ops outside the app:

- Custom domain: set `SITE_URL=https://tayseer.me` (or `www`) and rebuild web; 301 the unused host
- Search Console property + sitemap submit
- Link building strategy
- Facebook / X / Instagram / YouTube profiles (add to `sameAs` when stable)
- DMARC / SPF mail records on `tayseer.me`
- Analytics (GA4 etc.)
- Facebook Pixel

## After production deploy

1. Set web env `SITE_URL` to the public origin and rebuild.
2. Verify:
   - `/robots.txt`
   - `/sitemap.xml`
   - View source on `/en` and `/ar` for `canonical`, `og:*`, and `application/ld+json`
   - An unknown path (e.g. `/en/does-not-exist`) returns **404**
   - `/en/connect` **301**s to `/en/contact`
3. Submit the sitemap in Google Search Console.
