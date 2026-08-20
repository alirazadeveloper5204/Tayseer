import { DOCUMENT } from '@angular/common';
import { Injectable, inject } from '@angular/core';
import { Meta, Title } from '@angular/platform-browser';
import { NavigationEnd, Router } from '@angular/router';
import { filter } from 'rxjs';
import { environment } from '../../../environments/environment';
import { FAQ_PAGE, t, type PageLocale } from '../content/page-content';
import { LocaleService } from '../i18n/locale.service';
import { resolvePageSeo, seoKeyFromUrl } from './seo-pages';
import type { SeoApplyOptions, SeoLocale } from './seo.model';

const JSON_LD_ID = 'tayseer-json-ld';
const CANONICAL_ID = 'tayseer-canonical';
const ALT_EN_ID = 'tayseer-hreflang-en';
const ALT_AR_ID = 'tayseer-hreflang-ar';
const ALT_DEFAULT_ID = 'tayseer-hreflang-default';

@Injectable({ providedIn: 'root' })
export class SeoService {
  private readonly title = inject(Title);
  private readonly meta = inject(Meta);
  private readonly document = inject(DOCUMENT);
  private readonly router = inject(Router);
  private readonly locale = inject(LocaleService);
  private started = false;

  init(): void {
    if (this.started) {
      return;
    }
    this.started = true;
    this.router.events.pipe(filter((e): e is NavigationEnd => e instanceof NavigationEnd)).subscribe((e) => {
      this.applyForUrl(e.urlAfterRedirects || e.url);
    });
    this.applyForUrl(this.router.url);
  }

  applyForUrl(url: string): void {
    if (url.startsWith('/admin')) {
      this.apply({
        lang: 'en',
        urlPath: url.split('?')[0],
        title: 'Admin | Tayseer Innovations',
        description: 'Tayseer CMS administration.',
        noIndex: true,
      });
      return;
    }

    const lang = (this.locale.lang() === 'ar' ? 'ar' : 'en') as SeoLocale;
    const page = resolvePageSeo(url, lang);
    if (!page) {
      // Detail pages and 404 set their own meta after data loads.
      this.setHtmlLang(lang);
      return;
    }

    this.apply({
      ...page,
      lang,
      urlPath: url.split('?')[0],
      jsonLd: seoKeyFromUrl(url) === 'faqs' ? this.faqPageSchema(lang) : undefined,
    });
  }

  apply(options: SeoApplyOptions): void {
    const siteUrl = environment.siteUrl.replace(/\/$/, '');
    const path = options.urlPath.startsWith('/') ? options.urlPath : `/${options.urlPath}`;
    const canonical = `${siteUrl}${path.split('?')[0]}`;
    const image = absoluteUrl(siteUrl, options.imagePath ?? environment.defaultOgImage);
    const title = clampTitle(options.title);
    const description = clampDescription(options.description);

    this.title.setTitle(title);
    this.setHtmlLang(options.lang);
    this.upsertMeta('name', 'description', description);
    if (options.keywords) {
      this.upsertMeta('name', 'keywords', options.keywords);
    }
    this.upsertMeta('name', 'robots', options.noIndex ? 'noindex, nofollow' : 'index, follow');

    this.upsertMeta('property', 'og:type', options.ogType ?? 'website');
    this.upsertMeta('property', 'og:site_name', 'Tayseer Innovations');
    this.upsertMeta('property', 'og:title', title);
    this.upsertMeta('property', 'og:description', description);
    this.upsertMeta('property', 'og:url', canonical);
    this.upsertMeta('property', 'og:image', image);
    this.upsertMeta('property', 'og:locale', options.lang === 'ar' ? 'ar_SA' : 'en_US');
    this.upsertMeta(
      'property',
      'og:locale:alternate',
      options.lang === 'ar' ? 'en_US' : 'ar_SA',
    );

    this.upsertMeta('name', 'twitter:card', 'summary_large_image');
    this.upsertMeta('name', 'twitter:title', title);
    this.upsertMeta('name', 'twitter:description', description);
    this.upsertMeta('name', 'twitter:image', image);

    this.setLink(CANONICAL_ID, 'canonical', canonical);
    this.setHreflang(path, siteUrl);

    const graph = [
      this.organizationSchema(siteUrl),
      this.websiteSchema(siteUrl),
      ...(Array.isArray(options.jsonLd)
        ? options.jsonLd
        : options.jsonLd
          ? [options.jsonLd]
          : [this.webPageSchema(canonical, title, description)]),
    ];
    this.setJsonLd({ '@context': 'https://schema.org', '@graph': graph });
  }

  private setHtmlLang(lang: SeoLocale): void {
    this.document.documentElement.lang = lang;
    this.document.documentElement.dir = lang === 'ar' ? 'rtl' : 'ltr';
  }

  private upsertMeta(attr: 'name' | 'property', key: string, content: string): void {
    const selector = `${attr}="${key}"`;
    if (this.meta.getTag(selector)) {
      this.meta.updateTag({ [attr]: key, content });
    } else {
      this.meta.addTag({ [attr]: key, content });
    }
  }

  private setLink(id: string, rel: string, href: string): void {
    let el = this.document.getElementById(id) as HTMLLinkElement | null;
    if (!el) {
      el = this.document.createElement('link');
      el.id = id;
      el.rel = rel;
      this.document.head.appendChild(el);
    }
    el.rel = rel;
    el.href = href;
  }

  private setHreflang(currentPath: string, siteUrl: string): void {
    const parts = currentPath.split('/').filter(Boolean);
    const rest = parts.length <= 1 ? '' : `/${parts.slice(1).join('/')}`;
    const enUrl = `${siteUrl}/en${rest}`;
    const arUrl = `${siteUrl}/ar${rest}`;
    this.setLink(ALT_EN_ID, 'alternate', enUrl);
    const en = this.document.getElementById(ALT_EN_ID) as HTMLLinkElement | null;
    if (en) {
      en.hreflang = 'en';
    }
    this.setLink(ALT_AR_ID, 'alternate', arUrl);
    const ar = this.document.getElementById(ALT_AR_ID) as HTMLLinkElement | null;
    if (ar) {
      ar.hreflang = 'ar';
    }
    this.setLink(ALT_DEFAULT_ID, 'alternate', enUrl);
    const def = this.document.getElementById(ALT_DEFAULT_ID) as HTMLLinkElement | null;
    if (def) {
      def.hreflang = 'x-default';
    }
  }

  private setJsonLd(data: Record<string, unknown>): void {
    let script = this.document.getElementById(JSON_LD_ID) as HTMLScriptElement | null;
    if (!script) {
      script = this.document.createElement('script');
      script.id = JSON_LD_ID;
      script.type = 'application/ld+json';
      this.document.head.appendChild(script);
    }
    script.textContent = JSON.stringify(data);
  }

  private organizationSchema(siteUrl: string): Record<string, unknown> {
    return {
      '@type': 'Organization',
      '@id': `${siteUrl}/#organization`,
      name: 'Tayseer Innovations',
      url: siteUrl,
      logo: absoluteUrl(siteUrl, '/brand/logo-light.svg'),
      email: 'info@tayseer.me',
      sameAs: ['https://www.linkedin.com/company/tayseer-innovations/'],
      address: [
        {
          '@type': 'PostalAddress',
          addressCountry: 'SA',
          addressLocality: 'Riyadh',
          streetAddress:
            'Office 7, 2nd Floor, Selam Building, Prince Saad bin Abdulrahman Alawal Branch Road, Al Rawabi',
        },
        {
          '@type': 'PostalAddress',
          addressCountry: 'AE',
          addressLocality: 'Dubai',
          streetAddress: '601, One Lake Plaza, Cluster T, JLT',
        },
      ],
      contactPoint: [
        {
          '@type': 'ContactPoint',
          telephone: '+966-555-203-079',
          contactType: 'sales',
          areaServed: 'SA',
          availableLanguage: ['en', 'ar'],
        },
        {
          '@type': 'ContactPoint',
          telephone: '+971-4-399-7558',
          contactType: 'sales',
          areaServed: 'AE',
          availableLanguage: ['en', 'ar'],
        },
      ],
    };
  }

  private websiteSchema(siteUrl: string): Record<string, unknown> {
    return {
      '@type': 'WebSite',
      '@id': `${siteUrl}/#website`,
      url: siteUrl,
      name: 'Tayseer Innovations',
      publisher: { '@id': `${siteUrl}/#organization` },
      inLanguage: ['en', 'ar'],
    };
  }

  private webPageSchema(canonical: string, title: string, description: string): Record<string, unknown> {
    return {
      '@type': 'WebPage',
      '@id': `${canonical}#webpage`,
      url: canonical,
      name: title,
      description,
      isPartOf: { '@id': `${environment.siteUrl.replace(/\/$/, '')}/#website` },
    };
  }

  private faqPageSchema(lang: SeoLocale): Record<string, unknown> {
    const locale = lang as PageLocale;
    return {
      '@type': 'FAQPage',
      mainEntity: FAQ_PAGE.categories.flatMap((category) =>
        category.items.map((item) => ({
          '@type': 'Question',
          name: t(item.q, locale),
          acceptedAnswer: {
            '@type': 'Answer',
            text: t(item.a, locale),
          },
        })),
      ),
    };
  }
}

export function breadcrumbList(
  siteUrl: string,
  crumbs: readonly { name: string; path: string }[],
): Record<string, unknown> {
  const site = siteUrl.replace(/\/$/, '');
  return {
    '@type': 'BreadcrumbList',
    itemListElement: crumbs.map((crumb, index) => ({
      '@type': 'ListItem',
      position: index + 1,
      name: crumb.name,
      item: `${site}${crumb.path.startsWith('/') ? crumb.path : `/${crumb.path}`}`,
    })),
  };
}

function absoluteUrl(siteUrl: string, path: string): string {
  if (/^https?:\/\//i.test(path)) {
    return path;
  }
  return `${siteUrl}${path.startsWith('/') ? path : `/${path}`}`;
}

function clampTitle(value: string): string {
  const trimmed = value.trim();
  if (trimmed.length <= 65) {
    return trimmed;
  }
  return `${trimmed.slice(0, 62).trimEnd()}...`;
}

function clampDescription(value: string): string {
  const trimmed = value.trim();
  if (trimmed.length >= 120 && trimmed.length <= 165) {
    return trimmed;
  }
  if (trimmed.length > 165) {
    return `${trimmed.slice(0, 162).trimEnd()}...`;
  }
  return trimmed;
}
