export const SITE_IMAGES = {
  solutionsBanner: '/images/solutions-banner.jpg',
  galleryWorkspace: '/images/gallery-workspace.jpg',
  galleryMeeting: '/images/gallery-meeting.jpg',
  galleryAnalytics: '/images/gallery-analytics.jpg',
} as const;

const SERVICE_IMAGES: Record<string, string> = {
  'core-banking': '/images/service-core-banking.jpg',
  'fahim-ai': '/images/hero-fahim-main.jpg',
  mbuke: '/images/hero-mbuke-main.jpg',
  'software-management-systems': '/images/service-software.jpg',
  'managed-services': '/images/hero-managed-main.jpg',
  'banking-systems': '/images/service-banking-systems.jpg',
};

export function serviceImage(slug: string): string {
  return SERVICE_IMAGES[slug] ?? SITE_IMAGES.solutionsBanner;
}

export type HeroCollage = {
  main: string;
  side: string;
  badgeKicker: { en: string; ar: string };
  badgeLabel: { en: string; ar: string };
};

export const SERVICE_HERO_COLLAGES: Record<string, HeroCollage> = {
  'core-banking': {
    main: '/images/service-core-banking.jpg',
    side: '/images/hero-banking-side.jpg',
    badgeKicker: { en: 'Certified delivery', ar: 'تسليم معتمد' },
    badgeLabel: { en: 'Core banking integration', ar: 'تكامل النواة المصرفية' },
  },
  'fahim-ai': {
    main: '/images/hero-fahim-main.jpg',
    side: '/images/hero-ai-side.jpg',
    badgeKicker: { en: 'Intelligent banking', ar: 'خدمات مصرفية ذكية' },
    badgeLabel: { en: 'Fahim AI assistant', ar: 'مساعد فهيم الذكي' },
  },
  mbuke: {
    main: '/images/hero-mbuke-main.jpg',
    side: '/images/gallery-mobile.jpg',
    badgeKicker: { en: 'Payments', ar: 'المدفوعات' },
    badgeLabel: { en: 'Digital wallet platform', ar: 'منصة المحفظة الرقمية' },
  },
  'software-management-systems': {
    main: '/images/service-software.jpg',
    side: '/images/hero-software-side.jpg',
    badgeKicker: { en: 'Engineering', ar: 'الهندسة' },
    badgeLabel: { en: 'Modern delivery stack', ar: 'منصة تسليم حديثة' },
  },
  'managed-services': {
    main: '/images/hero-managed-main.jpg',
    side: '/images/gallery-analytics.jpg',
    badgeKicker: { en: 'Managed ops', ar: 'تشغيل مُدار' },
    badgeLabel: { en: '24/7 SOC coverage', ar: 'تغطية مركز العمليات 24/7' },
  },
  'banking-systems': {
    main: '/images/service-banking-systems.jpg',
    side: '/images/hero-banking-side.jpg',
    badgeKicker: { en: 'Channels', ar: 'القنوات' },
    badgeLabel: { en: 'Branch & ATM systems', ar: 'أنظمة الفروع وأجهزة الصراف' },
  },
};

export function serviceHeroCollage(slug: string): HeroCollage {
  const key = slug.trim().toLowerCase();
  return (
    SERVICE_HERO_COLLAGES[key] ?? {
      main: SITE_IMAGES.solutionsBanner,
      side: '/images/hero-ai-side.jpg',
      badgeKicker: { en: 'Product suite', ar: 'مجموعة المنتجات' },
      badgeLabel: { en: 'Tayseer solutions', ar: 'حلول تيسير' },
    }
  );
}

export const PAGE_HERO_COLLAGES = {
  solutions: {
    main: '/images/solutions-banner.jpg',
    side: '/images/hero-ai-side.jpg',
  },
  services: {
    main: '/images/service-core-banking.jpg',
    side: '/images/hero-banking-side.jpg',
  },
  software: {
    main: '/images/service-software.jpg',
    side: '/images/hero-software-side.jpg',
  },
  managed: {
    main: '/images/hero-managed-main.jpg',
    side: '/images/gallery-analytics.jpg',
  },
  about: {
    main: '/images/about-main.jpg',
    side: '/images/gallery-meeting.jpg',
  },
  caseStudies: {
    main: '/images/service-core-banking.jpg',
    side: '/images/hero-banking-side.jpg',
  },
  contact: {
    main: '/images/thumb-skyline.jpg',
    side: '/images/thumb-dubai.jpg',
  },
  faqs: {
    main: '/images/gallery-analytics.jpg',
    side: '/images/gallery-meeting.jpg',
  },
  careers: {
    main: '/images/gallery-workspace.jpg',
    side: '/images/gallery-meeting.jpg',
  },
} as const;

export const ABOUT_COLLAGE = {
  main: '/images/about-main.jpg',
  thumbs: [
    '/images/about-thumb-1.jpg',
    '/images/about-thumb-2.jpg',
    '/images/about-thumb-3.jpg',
  ],
} as const;

export type ClientGallery = {
  main: string;
  thumbs: readonly [string, string, string];
};

export const CLIENT_GALLERIES: readonly ClientGallery[] = [
  {
    main: '/images/clients-main.jpg',
    thumbs: [
      '/images/clients-thumb-1.jpg',
      '/images/clients-thumb-2.jpg',
      '/images/clients-thumb-3.jpg',
    ],
  },
  {
    main: '/images/client-1-main.jpg',
    thumbs: [
      '/images/client-1-thumb-1.jpg',
      '/images/client-1-thumb-2.jpg',
      '/images/client-1-thumb-3.jpg',
    ],
  },
  {
    main: '/images/client-2-main.jpg',
    thumbs: [
      '/images/client-2-thumb-1.jpg',
      '/images/client-2-thumb-2.jpg',
      '/images/client-2-thumb-3.jpg',
    ],
  },
  {
    main: '/images/client-3-main.jpg',
    thumbs: [
      '/images/client-3-thumb-1.jpg',
      '/images/client-3-thumb-2.jpg',
      '/images/client-3-thumb-3.jpg',
    ],
  },
] as const;
