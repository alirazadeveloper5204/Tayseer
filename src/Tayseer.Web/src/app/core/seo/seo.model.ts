export type SeoLocale = 'en' | 'ar';

export interface SeoPageMeta {
  title: string;
  description: string;
  /** Optional path under site root without lang, e.g. /solutions/fahim-ai */
  path?: string;
  ogType?: 'website' | 'article';
  noIndex?: boolean;
  keywords?: string;
}

export interface SeoApplyOptions extends SeoPageMeta {
  lang: SeoLocale;
  /** Absolute or site-relative path including lang, e.g. /en/solutions */
  urlPath: string;
  imagePath?: string;
  jsonLd?: Record<string, unknown> | Record<string, unknown>[];
}
