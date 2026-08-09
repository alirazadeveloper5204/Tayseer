import { ServiceDto, ServiceListItemDto } from '../../models/service.model';

type StaticFeature = {
  titleEn: string;
  titleAr: string;
  descEn: string;
  descAr: string;
};

type StaticService = {
  slug: string;
  iconKey: string;
  accent: string;
  sortOrder: number;
  titleEn: string;
  titleAr: string;
  shortDescriptionEn: string;
  shortDescriptionAr: string;
  bodyEn: string;
  bodyAr: string;
  ctaLabelEn: string;
  ctaLabelAr: string;
  ctaUrl: string;
  features: readonly StaticFeature[];
};


const STATIC_SERVICES: readonly StaticService[] = [
  {
    slug: 'core-banking',
    iconKey: 'core-banking',
    accent: 'blue',
    sortOrder: 1,
    titleEn: 'Core Banking',
    titleAr: 'الخدمات المصرفية الأساسية',
    shortDescriptionEn: 'Future-Proof Core Banking. Growth Unleashed.',
    shortDescriptionAr: 'خدمات مصرفية أساسية للمستقبل ونمو بلا حدود.',
    bodyEn: 'Streamline your Core Banking so you can dedicate resources to customer-centric innovation.',
    bodyAr: 'بسّط أنظمتك المصرفية الأساسية لتوجيه الموارد نحو ابتكار يركز على العميل.',
    ctaLabelEn: 'Learn More',
    ctaLabelAr: 'اعرف المزيد',
    ctaUrl: '/solutions/core-banking',
    features: [
      { titleEn: 'Payments', titleAr: 'المدفوعات', descEn: 'Cards, mobile wallets, and app-based payments with secure, efficient processing.', descAr: 'بطاقات ومحافظ جوال ومدفوعات عبر التطبيقات بمعالجة آمنة وفعّالة.' },
      { titleEn: 'Remittance Solutions', titleAr: 'حلول التحويلات', descEn: 'Fast, secure, cost-effective domestic and international money transfers.', descAr: 'تحويلات مالية محلية ودولية سريعة وآمنة وفعّالة من حيث التكلفة.' },
      { titleEn: 'Consumer Banking', titleAr: 'الخدمات المصرفية للأفراد', descEn: 'Modern account access, online banking, and mobile experiences that keep customers engaged.', descAr: 'وصول حديث للحسابات وخدمات مصرفية عبر الإنترنت والجوال تبقي العملاء متفاعلين.' },
      { titleEn: 'Security & Compliance', titleAr: 'الأمن والامتثال', descEn: 'Robust controls that meet evolving regulations and protect financial integrity.', descAr: 'ضوابط قوية تلبي اللوائح المتطورة وتحمي النزاهة المالية.' },
      { titleEn: 'CRM & BI Systems', titleAr: 'إدارة العملاء والتحليلات', descEn: 'Turn customer data into actionable insights for smarter decisions and loyalty.', descAr: 'حوّل بيانات العملاء إلى رؤى قابلة للتنفيذ لقرارات أذكى وولاء أعلى.' },
      { titleEn: 'Risk Management', titleAr: 'إدارة المخاطر', descEn: 'Identify, measure, and mitigate operational and financial risk across the bank.', descAr: 'تحديد وقياس وتخفيف المخاطر التشغيلية والمالية عبر البنك.' },
    ],
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
    bodyEn: 'Fahim is an Agentic AI platform engineered to manage and optimize end-to-end business operations for enhanced customer experience.',
    bodyAr: 'فهيم منصة ذكاء اصطناعي وكيلية مصممة لإدارة وتحسين العمليات من البداية إلى النهاية لتعزيز تجربة العملاء.',
    ctaLabelEn: 'Contact Us for Demo',
    ctaLabelAr: 'تواصل معنا لعرض تجريبي',
    ctaUrl: '/solutions/fahim-ai',
    features: [
      { titleEn: 'Goal-Oriented Execution', titleAr: 'تنفيذ موجّه بالأهداف', descEn: 'Interprets instructions intelligently, then executes end-to-end operations with accuracy and speed.', descAr: 'يفسّر التعليمات بذكاء ثم ينفّذ العمليات من البداية إلى النهاية بدقة وسرعة.' },
      { titleEn: 'Intelligent Onboarding / KYC', titleAr: 'التسجيل الذكي / اعرف عميلك', descEn: 'Document analysis and authenticity checks for compliant, frictionless onboarding.', descAr: 'تحليل المستندات والتحقق من الأصالة لتسجيل متوافق وسلس.' },
      { titleEn: 'Voice & Chat Experience', titleAr: 'تجربة صوت ودردشة', descEn: 'Human-like interaction with native Arabic dialect support across channels.', descAr: 'تفاعل شبه بشري مع دعم اللهجات العربية عبر القنوات.' },
      { titleEn: 'Flexible Deployment', titleAr: 'نشر مرن', descEn: 'On-premise or containerized deployment with on-demand scalability.', descAr: 'نشر محلي أو عبر الحاويات مع قابلية توسع عند الطلب.' },
      { titleEn: 'System Integration', titleAr: 'تكامل الأنظمة', descEn: 'Connects to existing business modules without major disruption.', descAr: 'يتصل بالوحدات الحالية دون تعطيل كبير.' },
    ],
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
    bodyEn: 'AI-powered white-label mobile finance platform with onboarding, payments, analytics, and offline capability.',
    bodyAr: 'منصة مالية عبر الجوال بعلامتك التجارية مدعومة بالذكاء الاصطناعي مع التسجيل والمدفوعات والتحليلات والعمل دون اتصال.',
    ctaLabelEn: 'Contact Us for Demo',
    ctaLabelAr: 'تواصل معنا لعرض تجريبي',
    ctaUrl: '/solutions/mbuke',
    features: [
      { titleEn: 'Unified Platform', titleAr: 'منصة موحّدة', descEn: 'Onboarding, payments, transfers, and analytics in one white-label stack.', descAr: 'التسجيل والمدفوعات والتحويلات والتحليلات في منصة واحدة بعلامتك.' },
      { titleEn: 'Agent Banking & USSD', titleAr: 'الوكلاء وUSSD', descEn: 'Reach low-connectivity communities with agent networks and offline flows.', descAr: 'الوصول للمجتمعات ضعيفة الاتصال عبر شبكة وكلاء وتدفقات دون اتصال.' },
      { titleEn: 'Modular & Scalable', titleAr: 'مرن وقابل للتوسع', descEn: 'Deploy what you need now; add capabilities as you grow.', descAr: 'انشر ما تحتاجه الآن وأضف القدرات مع النمو.' },
      { titleEn: 'Enterprise Security', titleAr: 'أمن مؤسسي', descEn: 'Microservices, real-time events, observability, and strong security controls.', descAr: 'خدمات مصغّرة وأحداث فورية ومراقبة وضوابط أمنية قوية.' },
      { titleEn: 'Operator Dashboards', titleAr: 'لوحات المشغّل', descEn: 'Transaction monitoring, agent management, compliance, and reporting tools.', descAr: 'مراقبة المعاملات وإدارة الوكلاء والامتثال وأدوات التقارير.' },
    ],
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
    bodyEn: 'Version control, development tooling, file and API management for FinTech teams.',
    bodyAr: 'إدارة الإصدارات وأدوات التطوير وإدارة الملفات وواجهات البرمجة لفرق التقنية المالية.',
    ctaLabelEn: 'Learn More',
    ctaLabelAr: 'اعرف المزيد',
    ctaUrl: '/software-development',
    features: [
      { titleEn: 'Version Control Systems', titleAr: 'أنظمة التحكم بالإصدارات', descEn: 'Central repositories, change history, and collaborative coding with Git-class tooling.', descAr: 'مستودعات مركزية وسجل تغييرات وتعاون برمجي بأدوات من فئة Git.' },
      { titleEn: 'Mobile & Software Dev Tools', titleAr: 'أدوات تطوير الجوال والبرمجيات', descEn: 'IDEs, debuggers, and testing frameworks that accelerate delivery.', descAr: 'بيئات تطوير ومصححات وأطر اختبار تسرّع التسليم.' },
      { titleEn: 'File Management', titleAr: 'إدارة الملفات', descEn: 'Organized storage for code, assets, and project files with version history.', descAr: 'تخزين منظّم للكود والأصول وملفات المشاريع مع سجل الإصدارات.' },
      { titleEn: 'Integration API Management', titleAr: 'إدارة واجهات التكامل', descEn: 'Connect systems, automate workflows, and break down data silos.', descAr: 'ربط الأنظمة وأتمتة سير العمل وكسر صوامع البيانات.' },
      { titleEn: 'CI/CD Tooling', titleAr: 'أدوات التكامل والنشر المستمر', descEn: 'Automated build, test, and release pipelines for FinTech teams.', descAr: 'خطوط بناء واختبار وإصدار مؤتمتة لفرق التقنية المالية.' },
    ],
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
    bodyEn: 'Expert support for T24 Temenos, security, ATM/STM, big data, and cloud infrastructure.',
    bodyAr: 'دعم خبير لأنظمة T24 Temenos والأمن وأجهزة الصراف وSTMs والبيانات الضخمة والبنية السحابية.',
    ctaLabelEn: 'Talk To Us',
    ctaLabelAr: 'تحدث معنا',
    ctaUrl: '/managed-services',
    features: [
      { titleEn: 'Managed T24 Temenos', titleAr: 'إدارة T24 Temenos', descEn: 'Administration, performance optimization, and ongoing T24 maintenance.', descAr: 'إدارة وتحسين الأداء والصيانة المستمرة لنظام T24.' },
      { titleEn: 'Big Data Management', titleAr: 'إدارة البيانات الضخمة', descEn: 'Storage, processing, and analytics for large, complex financial datasets.', descAr: 'تخزين ومعالجة وتحليل مجموعات بيانات مالية كبيرة ومعقّدة.' },
      { titleEn: 'Managed Security', titleAr: 'الأمن المُدار', descEn: 'Monitoring, threat detection, and incident response for critical systems.', descAr: 'مراقبة وكشف تهديدات واستجابة للحوادث للأنظمة الحرجة.' },
      { titleEn: 'ATM & STM Management', titleAr: 'إدارة أجهزة الصراف وSTM', descEn: 'Proactive maintenance and incident response for cash and teller machines.', descAr: 'صيانة استباقية واستجابة للحوادث لأجهزة النقد والصراف.' },
      { titleEn: 'IaaS / SaaS Operations', titleAr: 'عمليات IaaS / SaaS', descEn: 'Cloud and infrastructure operations that keep platforms reliable and efficient.', descAr: 'عمليات سحابية وبنية تحتية تبقي المنصات موثوقة وفعّالة.' },
    ],
  },
  {
    slug: 'banking-systems',
    iconKey: 'banking-systems',
    accent: 'blue',
    sortOrder: 6,
    titleEn: 'GRG Banking',
    titleAr: 'حلول GRG Banking',
    shortDescriptionEn:
      'Official UAE partner for GRGBanking — ATMs, smart teller machines, and self-service hardware for banks across the region.',
    shortDescriptionAr:
      'الشريك الرسمي لـ GRGBanking في الإمارات — أجهزة صراف وآلات صراف ذكية وأجهزة خدمة ذاتية للبنوك في المنطقة.',
    bodyEn:
      'As the official UAE partner for GRGBanking, Tayseer delivers and supports state-of-the-art ATMs, Smart Teller Machines (STMs), cash sorting, and self-service banking hardware. Banks get reliable branch and lobby channels, plus proprietary monitoring and investigation tools that help identify deposit and hardware issues faster — cutting typical resolution timelines from days to hours so customer trust stays intact.',
    bodyAr:
      'بصفتنا الشريك الرسمي لـ GRGBanking في الإمارات، نوفر وندعم أحدث أجهزة الصراف الآلي وآلات الصراف الذكية (STM) وفرز النقد وأجهزة الخدمة الذاتية المصرفية. يحصل البنك على قنوات موثوقة للفروع والصالات، إضافة إلى أدوات مراقبة وتحقيق مدمجة تساعد على اكتشاف مشكلات الإيداع والأجهزة بشكل أسرع — لتقليص زمن المعالجة المعتاد من أيام إلى ساعات والحفاظ على ثقة العملاء.',
    ctaLabelEn: 'Learn More',
    ctaLabelAr: 'اعرف المزيد',
    ctaUrl: '/solutions/banking-systems',
    features: [
      {
        titleEn: 'ATMs & Cash Recyclers',
        titleAr: 'أجهزة الصراف وإعادة تدوير النقد',
        descEn:
          'GRG ATMs and recyclers for 24/7 withdrawals, deposits, bill pay, and cash recycling built for high-availability networks.',
        descAr:
          'أجهزة صراف وإعادة تدوير GRG للسحب والإيداع ودفع الفواتير وإعادة تدوير النقد على مدار الساعة بشبكات عالية التوافر.',
      },
      {
        titleEn: 'Smart Teller Machines (STMs)',
        titleAr: 'آلات الصراف الذكية (STM)',
        descEn:
          'Human-assisted self-service that shortens branch queues while keeping assisted banking journeys intact.',
        descAr:
          'خدمة ذاتية بمساعدة بشرية تختصر طوابير الفروع مع الإبقاء على رحلات مصرفية مدعومة.',
      },
      {
        titleEn: 'Cash Sorting & Banknote Handling',
        titleAr: 'فرز النقد ومعالجة الأوراق',
        descEn:
          'Accurate counting, sorting, and verification technology for reliable cash-ops in branches and cash centres.',
        descAr:
          'تقنيات دقيقة للعد والفرز والتحقق لضمان عمليات نقد موثوقة في الفروع ومراكز النقد.',
      },
      {
        titleEn: 'Self-Service Banking Hardware',
        titleAr: 'أجهزة الخدمة الذاتية المصرفية',
        descEn:
          'Lobby and branch kiosks that extend beyond ATMs — account services, applications, and seamless customer journeys.',
        descAr:
          'أكشاك للفروع والصالات تتجاوز أجهزة الصراف — خدمات الحسابات والطلبات ورحلات عملاء سلسة.',
      },
      {
        titleEn: 'Monitoring & Investigation',
        titleAr: 'المراقبة والتحقيق',
        descEn:
          'In-built monitoring and investigation modules that surface deposit and hardware issues faster, with same-day insight and shorter resolution cycles.',
        descAr:
          'وحدات مراقبة وتحقيق مدمجة تكشف مشكلات الإيداع والأجهزة بسرعة أكبر، مع رؤى في اليوم نفسه ودورات معالجة أقصر.',
      },
    ],
  },
];

export function solutionPath(lang: string, slug: string): string {
  if (slug === 'software-management-systems') {
    return `/${lang}/software-development`;
  }
  if (slug === 'managed-services') {
    return `/${lang}/managed-services`;
  }
  return `/${lang}/solutions/${slug}`;
}


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

export function staticServiceBySlug(slug: string, lang: string): ServiceDto | null {
  const match = STATIC_SERVICES.find((item) => item.slug === slug);
  if (!match) {
    return null;
  }
  const isAr = lang === 'ar';
  return {
    slug: match.slug,
    title: isAr ? match.titleAr : match.titleEn,
    shortDescription: isAr ? match.shortDescriptionAr : match.shortDescriptionEn,
    body: isAr ? match.bodyAr : match.bodyEn,
    ctaLabel: isAr ? match.ctaLabelAr : match.ctaLabelEn,
    ctaUrl: match.ctaUrl,
    iconKey: match.iconKey,
    accent: match.accent,
    features: match.features.map((feature, index) => ({
      title: isAr ? feature.titleAr : feature.titleEn,
      description: isAr ? feature.descAr : feature.descEn,
      sortOrder: index + 1,
    })),
  };
}
