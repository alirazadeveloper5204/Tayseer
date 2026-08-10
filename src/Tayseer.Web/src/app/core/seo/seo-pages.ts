import type { SeoLocale, SeoPageMeta } from './seo.model';

type LocalizedMeta = Record<SeoLocale, SeoPageMeta>;

const brandEn = 'Tayseer Innovations';
const brandAr = 'تيسير للابتكارات';

/** Route path after :lang ('' for home). */
export const SEO_PAGES: Record<string, LocalizedMeta> = {
  '': {
    en: {
      title: `${brandEn} | Core Banking, Fahim AI & FinTech Solutions GCC`,
      description:
        'Tayseer Innovations delivers core banking, Fahim AI, MBuke mobile banking, software platforms, and managed FinTech services across Saudi Arabia and the UAE.',
      keywords:
        'Tayseer, core banking, Fahim AI, MBuke, FinTech Saudi Arabia, banking technology UAE, managed services',
    },
    ar: {
      title: `${brandAr} | الأنظمة المصرفية وفهيم للذكاء الاصطناعي وحلول التقنية المالية`,
      description:
        'تيسير للابتكارات تقدّم الأنظمة المصرفية الأساسية ومنصة فهيم للذكاء الاصطناعي ومصرفية الجوال إم بوكي والخدمات المُدارة في المملكة العربية السعودية والإمارات.',
      keywords: 'تيسير, أنظمة مصرفية, فهيم, تقنية مالية, السعودية, الإمارات',
    },
  },
  services: {
    en: {
      title: `FinTech & Banking Services | ${brandEn}`,
      description:
        'Explore Tayseer banking and FinTech services: core systems, payments, AI, mobile banking, software platforms, and managed operations for Gulf financial institutions.',
    },
    ar: {
      title: `خدمات التقنية المالية والمصرفية | ${brandAr}`,
      description:
        'استكشف خدمات تيسير المصرفية والتقنية المالية: الأنظمة الأساسية والمدفوعات والذكاء الاصطناعي ومصرفية الجوال والمنصات البرمجية والعمليات المُدارة.',
    },
  },
  solutions: {
    en: {
      title: `Banking & FinTech Solutions Suite | ${brandEn}`,
      description:
        'Browse Tayseer solution suite — Fahim AI, core banking, MBuke, GRG banking systems, software management, and managed services built for GCC banks and FinTechs.',
    },
    ar: {
      title: `مجموعة حلول مصرفية وتقنية مالية | ${brandAr}`,
      description:
        'تصفّح حلول تيسير — فهيم للذكاء الاصطناعي والأنظمة المصرفية الأساسية وإم بوكي وأنظمة GRG وإدارة البرمجيات والخدمات المُدارة للبنوك وشركات التقنية المالية.',
    },
  },
  'software-development': {
    en: {
      title: `Software Management Systems for FinTech | ${brandEn}`,
      description:
        'Tayseer software management systems help FinTech teams ship faster with version control, API tooling, and delivery platforms tailored to regulated environments.',
    },
    ar: {
      title: `أنظمة إدارة البرمجيات للتقنية المالية | ${brandAr}`,
      description:
        'تساعد أنظمة إدارة البرمجيات من تيسير فرق التقنية المالية على التسليم بسرعة أكبر مع أدوات الإصدارات والواجهات ومنصات التسليم للبيئات المنظمة.',
    },
  },
  'managed-services': {
    en: {
      title: `Managed Banking & IT Services | ${brandEn}`,
      description:
        'Peak performance via managed expertise — Temenos T24 support, security operations, ATM/STM, big data, and cloud infrastructure from Tayseer Innovations.',
    },
    ar: {
      title: `خدمات مصرفية وتقنية مُدارة | ${brandAr}`,
      description:
        'أداء متميز عبر خبرات مُدارة — دعم T24 Temenos وعمليات الأمن وأجهزة الصراف والبيانات الضخمة والبنية السحابية من تيسير للابتكارات.',
    },
  },
  about: {
    en: {
      title: `About Tayseer Innovations | FinTech Partner GCC`,
      description:
        'Learn about Tayseer Innovations — a GCC FinTech partner delivering banking modernization, AI platforms, and trusted delivery from Saudi Arabia and the UAE.',
    },
    ar: {
      title: `من نحن | تيسير للابتكارات شريك التقنية المالية`,
      description:
        'تعرّف على تيسير للابتكارات — شريك تقنية مالية في الخليج لتحديث الأنظمة المصرفية ومنصات الذكاء الاصطناعي والتسليم الموثوق من السعودية والإمارات.',
    },
  },
  'case-studies': {
    en: {
      title: `Client Case Studies | ${brandEn}`,
      description:
        'See how Tayseer helps banks and FinTechs modernize cores, launch wallets, and run managed security operations across the Gulf.',
    },
    ar: {
      title: `دراسات الحالة | ${brandAr}`,
      description:
        'اطّلع كيف تساعد تيسير البنوك وشركات التقنية المالية على تحديث الأنظمة وإطلاق المحافظ وتشغيل عمليات الأمن المُدارة في الخليج.',
    },
  },
  contact: {
    en: {
      title: `Contact Tayseer Innovations | Riyadh & Dubai Offices`,
      description:
        'Contact Tayseer Innovations in Riyadh and Dubai for demos, partnerships, and FinTech delivery. Phone and email for Saudi Arabia and UAE offices.',
    },
    ar: {
      title: `تواصل مع تيسير للابتكارات | الرياض ودبي`,
      description:
        'تواصل مع تيسير للابتكارات في الرياض ودبي للعروض والشراكات والتسليم. هواتف وبريد مكاتب المملكة العربية السعودية والإمارات.',
    },
  },
  connect: {
    en: {
      title: `Connect With Tayseer | Riyadh & Dubai`,
      description:
        'Connect with Tayseer Innovations teams in Saudi Arabia and the UAE for banking technology demos, support, and partnership inquiries.',
    },
    ar: {
      title: `تواصل مع تيسير | الرياض ودبي`,
      description:
        'تواصل مع فرق تيسير للابتكارات في السعودية والإمارات لعروض التقنية المصرفية والدعم والشراكات.',
    },
  },
  faqs: {
    en: {
      title: `FAQs | ${brandEn}`,
      description:
        'Answers about Tayseer products, delivery models, regions served, and how to engage for core banking, AI, and managed FinTech services.',
    },
    ar: {
      title: `الأسئلة الشائعة | ${brandAr}`,
      description:
        'إجابات حول منتجات تيسير ونماذج التسليم والمناطق المخدومة وكيفية التعاون في الأنظمة المصرفية والذكاء الاصطناعي والخدمات المُدارة.',
    },
  },
  careers: {
    en: {
      title: `Careers at Tayseer Innovations | Join Our GCC Team`,
      description:
        'Explore careers at Tayseer Innovations. Build future-ready banking and FinTech products with teams in Saudi Arabia and the UAE.',
    },
    ar: {
      title: `الوظائف في تيسير للابتكارات | انضم لفريقنا`,
      description:
        'استكشف الفرص الوظيفية في تيسير للابتكارات. ابنِ منتجات مصرفية وتقنية مالية للمستقبل مع فرقنا في السعودية والإمارات.',
    },
  },
  'legal/privacy': {
    en: {
      title: `Privacy Policy | ${brandEn}`,
      description: 'Privacy policy for the Tayseer Innovations corporate website and related digital services.',
    },
    ar: {
      title: `سياسة الخصوصية | ${brandAr}`,
      description: 'سياسة الخصوصية لموقع تيسير للابتكارات والخدمات الرقمية ذات الصلة.',
    },
  },
  'legal/terms': {
    en: {
      title: `Terms of Use | ${brandEn}`,
      description: 'Terms of use for the Tayseer Innovations corporate website.',
    },
    ar: {
      title: `شروط الاستخدام | ${brandAr}`,
      description: 'شروط استخدام موقع تيسير للابتكارات.',
    },
  },
};

export function seoKeyFromUrl(url: string): string {
  const path = url.split('?')[0].split('#')[0];
  const parts = path.split('/').filter(Boolean);
  if (parts.length === 0) {
    return '';
  }
  // /en or /ar
  if (parts.length === 1) {
    return '';
  }
  // drop lang
  return parts.slice(1).join('/');
}

export function resolvePageSeo(url: string, lang: SeoLocale): SeoPageMeta | null {
  const key = seoKeyFromUrl(url);
  // Dynamic detail pages handled by feature components.
  if (key.startsWith('solutions/') || key.startsWith('case-studies/')) {
    return null;
  }
  return SEO_PAGES[key]?.[lang] ?? SEO_PAGES[''][lang];
}
