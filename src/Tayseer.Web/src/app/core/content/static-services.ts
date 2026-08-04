import { ServiceListItemDto } from '../../models/service.model';

/** Bilingual seed matching `AppDbContext.SeedServices` — used for frontend-only demos. */
const STATIC_SERVICES = [
  {
    slug: 'core-banking',
    iconKey: 'core-banking',
    accent: 'blue',
    sortOrder: 1,
    titleEn: 'Core Banking',
    titleAr: 'الخدمات المصرفية الأساسية',
    shortDescriptionEn: 'Future-Proof Core Banking. Growth Unleashed.',
    shortDescriptionAr: 'خدمات مصرفية أساسية للمستقبل ونمو بلا حدود.',
    ctaUrl: '/solutions/core-banking',
  },
  {
    slug: 'fahim-ai',
    iconKey: 'ai',
    accent: 'green',
    sortOrder: 2,
    titleEn: 'Fahim AI',
    titleAr: 'فهيم للذكاء الاصطناعي',
    shortDescriptionEn: 'Intelligence to Revolutionize Your Business',
    shortDescriptionAr: 'ذكاء يصنع تحولاً في أعمالك',
    ctaUrl: '/solutions/fahim-ai',
  },
  {
    slug: 'mbuke',
    iconKey: 'mbuke',
    accent: 'green',
    sortOrder: 3,
    titleEn: 'MBuke',
    titleAr: 'إم بوكي',
    shortDescriptionEn: 'White-Label Mobile Banking Platform',
    shortDescriptionAr: 'منصة خدمات مصرفية عبر الجوال بعلامتك التجارية',
    ctaUrl: '/solutions/mbuke',
  },
  {
    slug: 'software-management-systems',
    iconKey: 'software',
    accent: 'blue',
    sortOrder: 4,
    titleEn: 'Software Management Systems',
    titleAr: 'أنظمة إدارة البرمجيات',
    shortDescriptionEn: 'Effortless Solutions. Powerful Results.',
    shortDescriptionAr: 'حلول سلسة ونتائج قوية.',
    ctaUrl: '/solutions/software-management-systems',
  },
  {
    slug: 'managed-services',
    iconKey: 'managed',
    accent: 'blue',
    sortOrder: 5,
    titleEn: 'Managed Services',
    titleAr: 'الخدمات المُدارة',
    shortDescriptionEn: 'Peak Performance via Managed Expertise.',
    shortDescriptionAr: 'أداء متميز عبر خبرات مُدارة.',
    ctaUrl: '/solutions/managed-services',
  },
  {
    slug: 'banking-systems',
    iconKey: 'banking-systems',
    accent: 'blue',
    sortOrder: 6,
    titleEn: 'Banking Systems',
    titleAr: 'الأنظمة المصرفية',
    shortDescriptionEn: 'Experience Next-Gen Banking with GRG Banking',
    shortDescriptionAr: 'تجربة مصرفية من الجيل التالي مع GRG Banking',
    ctaUrl: '/solutions/banking-systems',
  },
] as const;

/** Resolve static service list for the active locale (sortOrder ascending). */
export function staticServicesForLang(lang: string): ServiceListItemDto[] {
  const isAr = lang === 'ar';
  return [...STATIC_SERVICES]
    .sort((a, b) => a.sortOrder - b.sortOrder)
    .map((s) => ({
      slug: s.slug,
      title: isAr ? s.titleAr : s.titleEn,
      shortDescription: isAr ? s.shortDescriptionAr : s.shortDescriptionEn,
      iconKey: s.iconKey,
      accent: s.accent,
      ctaUrl: s.ctaUrl,
    }));
}
