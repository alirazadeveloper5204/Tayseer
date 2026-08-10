# On-page SEO (implemented)

Code SEO added for `https://tayseer-web.onrender.com`:

| Item | Status |
|------|--------|
| XML sitemap | `/sitemap.xml` |
| robots.txt | `/robots.txt` (disallows `/admin`) |
| Longer title + meta description | Per-route EN/AR catalog + `index.html` defaults |
| Canonical + hreflang | Updated on each navigation |
| Open Graph + X/Twitter cards | Via `SeoService` |
| Organization / WebSite / WebPage schema | JSON-LD graph |
| Service + case-study schema | On detail pages |
| Office address + phone in schema | Riyadh + Dubai contact points |

## Off-site items (not in repo)

These need marketing/DNS/ops outside the app:

- Link building strategy
- Facebook / X / Instagram / YouTube profiles + `sameAs` links
- DMARC / SPF mail records on `tayseer.me`
- Analytics (GA4 etc.)
- Facebook Pixel
- Custom domain migration (update `SITE_URL` + redeploy web)

## After deploy

1. Set web env `SITE_URL=https://tayseer-web.onrender.com` (Blueprint default).
2. Redeploy **tayseer-web**.
3. Verify:
   - `https://tayseer-web.onrender.com/robots.txt`
   - `https://tayseer-web.onrender.com/sitemap.xml`
   - View source on `/en` for `canonical`, `og:*`, and `application/ld+json`
4. Submit the sitemap in Google Search Console when ready.
