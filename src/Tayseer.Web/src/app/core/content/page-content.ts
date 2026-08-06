export type PageLocale = 'en' | 'ar';

export interface LocalizedText {
  en: string;
  ar: string;
}

export function t(text: LocalizedText, lang: PageLocale): string {
  return lang === 'ar' ? text.ar : text.en;
}

export const PAGE_COMMON = {
  requestDemo: { en: 'Request Demo', ar: 'اطلب عرضاً توضيحياً' },
  talkToUs: { en: 'Talk To Us', ar: 'تحدث معنا' },
  learnMore: { en: 'Learn More', ar: 'اعرف المزيد' },
  viewCase: { en: 'View Case Study', ar: 'عرض دراسة الحالة' },
  allSectors: { en: 'All', ar: 'الكل' },
  nextStep: { en: 'Continue', ar: 'متابعة' },
  prevStep: { en: 'Back', ar: 'رجوع' },
  submit: { en: 'Submit Inquiry', ar: 'إرسال الاستفسار' },
  submittedTitle: { en: 'Inquiry received', ar: 'تم استلام الاستفسار' },
  submitted: {
    en: 'Thank you — our enterprise team will contact you shortly.',
    ar: 'شكراً لك — سيتواصل معك فريق المؤسسات قريباً.',
  },
  backToList: { en: 'Back to case studies', ar: 'العودة إلى دراسات الحالة' },
  backHome: { en: 'Back to home', ar: 'العودة للرئيسية' },
  submitAnother: { en: 'Submit another inquiry', ar: 'إرسال استفسار آخر' },
  notFound: { en: 'Case study not found', ar: 'دراسة الحالة غير موجودة' },
  problem: { en: 'Problem', ar: 'التحدي' },
  solution: { en: 'Solution Architecture', ar: 'بنية الحل' },
  metrics: { en: 'Key Performance Metrics', ar: 'مؤشرات الأداء الرئيسية' },
} as const;

export const SERVICES_PAGE = {
  eyebrow: { en: 'Core Fintech & Banking', ar: 'الخدمات المصرفية والتقنية المالية' },
  title: { en: 'Enterprise Banking Services', ar: 'خدمات مصرفية للمؤسسات' },
  lead: {
    en: 'Integrate, orchestrate, and scale mission-critical banking capabilities with Tayseer’s certified delivery teams.',
    ar: 'ادمج ونظّم ووسّع قدرات الخدمات المصرفية الحرجة مع فرق تيسير المعتمدة.',
  },
  heroSecondary: { en: 'Explore solutions', ar: 'استكشف الحلول' },
  heroMetaCore: { en: 'Core banking integration', ar: 'تكامل الأنظمة المصرفية' },
  heroMetaPayments: { en: 'Payments, wallets & APIs', ar: 'المدفوعات والمحافظ والواجهات' },
  heroMetaOpen: { en: 'Open banking ready', ar: 'جاهز للخدمات المصرفية المفتوحة' },
  heroBadgeKicker: { en: 'Certified delivery', ar: 'تسليم معتمد' },
  pillars: [
    {
      id: 'core',
      title: { en: 'Core Banking Integration', ar: 'تكامل الأنظمة المصرفية الأساسية' },
      body: {
        en: 'Temenos, Oracle Flexcube, and custom core adapters with controlled migration playbooks.',
        ar: 'تكامل مع تيمينوس وأوراكل فليكس كيوب ومحولات مخصصة مع خطط ترحيل محكمة.',
      },
    },
    {
      id: 'payments',
      title: { en: 'Payment Gateway APIs', ar: 'واجهات بوابات الدفع' },
      body: {
        en: 'PCI-aware payment orchestration, reconciliation pipelines, and multi-rail settlement.',
        ar: 'تنسيق مدفوعات متوافق مع PCI وخطوط مطابقة وتسوية متعددة القنوات.',
      },
    },
    {
      id: 'wallets',
      title: { en: 'Digital Wallets', ar: 'المحافظ الرقمية' },
      body: {
        en: 'Consumer and corporate wallets with KYC hooks, limits engine, and instant notifications.',
        ar: 'محافظ للأفراد والشركات مع KYC ومحرك حدود وإشعارات فورية.',
      },
    },
    {
      id: 'open',
      title: { en: 'Open Banking', ar: 'الخدمات المصرفية المفتوحة' },
      body: {
        en: 'Consent-led APIs, partner sandboxes, and regulatory-aligned data sharing frameworks.',
        ar: 'واجهات قائمة على الموافقة وبيئات شركاء وأطر مشاركة بيانات متوافقة تنظيمياً.',
      },
    },
  ],
  flowTitle: { en: 'Architecture Flow', ar: 'تدفق البنية' },
  flowLead: {
    en: 'Glowing orchestration nodes from channels to core — designed for auditability and scale.',
    ar: 'عقد تنسيق مضيئة من القنوات إلى النواة — مصممة للتدقيق والتوسع.',
  },
  nodes: [
    { en: 'Channels', ar: 'القنوات' },
    { en: 'API Gateway', ar: 'بوابة API' },
    { en: 'Orchestration', ar: 'التنسيق' },
    { en: 'Core Banking', ar: 'النواة المصرفية' },
    { en: 'Risk & Audit', ar: 'المخاطر والتدقيق' },
  ],
  featuresTitle: { en: 'Game-Changing Capabilities', ar: 'قدرات تغيّر قواعد اللعبة' },
  featuresLead: {
    en: 'Compact. Powerful. Built for regulated banks that need speed without compromising control.',
    ar: 'مدمجة وقوية ومصممة للبنوك المنظمة التي تحتاج السرعة دون التفريط بالسيطرة.',
  },
  worldsTitle: { en: 'Built for Your Banking World', ar: 'مصممة لعالمك المصرفي' },
  worldsLead: {
    en: 'From customer channels to core and audit — one orchestration path that stays visible and governable.',
    ar: 'من قنوات العملاء إلى النواة والتدقيق — مسار تنسيق واحد يبقى واضحاً وقابلاً للحوكمة.',
  },
  worlds: [
    {
      id: 'channels',
      title: { en: 'Channels', ar: 'القنوات' },
      body: {
        en: 'Branch, mobile, and corporate portals feeding one consistent experience.',
        ar: 'الفروع والجوال وبوابات الشركات في تجربة واحدة متسقة.',
      },
    },
    {
      id: 'gateway',
      title: { en: 'API Gateway', ar: 'بوابة API' },
      body: {
        en: 'Governed entry with throttling, consent, and partner sandboxes.',
        ar: 'مدخل محكوم مع تحديد للسرعة وموافقة وبيئات شركاء.',
      },
    },
    {
      id: 'orchestration',
      title: { en: 'Orchestration', ar: 'التنسيق' },
      body: {
        en: 'Compose payment, KYC, and product journeys without core lock-in.',
        ar: 'ركّب رحلات الدفع وKYC والمنتجات دون الارتباط بالنواة.',
      },
    },
    {
      id: 'core',
      title: { en: 'Core Banking', ar: 'النواة المصرفية' },
      body: {
        en: 'Temenos, Flexcube, and custom cores connected through certified adapters.',
        ar: 'تيمينوس وفليكس كيوب والنوى المخصصة عبر محولات معتمدة.',
      },
    },
    {
      id: 'risk',
      title: { en: 'Risk & Audit', ar: 'المخاطر والتدقيق' },
      body: {
        en: 'Traceable controls for regulators, internal audit, and operations.',
        ar: 'ضوابط قابلة للتتبع للجهات الرقابية والتدقيق الداخلي والتشغيل.',
      },
    },
  ],
  splitEyebrow: { en: 'Seamless. Secure. Enterprise-ready.', ar: 'سلسة. آمنة. جاهزة للمؤسسات.' },
  splitTitle: { en: 'Banking services that move as fast as your customers', ar: 'خدمات مصرفية تتحرك بسرعة عملائك' },
  splitLead: {
    en: 'Unlock modern banking delivery with certified integrations, clear controls, and a team that already knows Gulf regulators.',
    ar: 'أطلق تسليم الخدمات المصرفية الحديثة بتكاملات معتمدة وضوابط واضحة وفريق يعرف متطلبات المنطقة.',
  },
  splitItems: [
    {
      title: { en: 'Peak delivery speed', ar: 'سرعة تسليم عالية' },
      body: {
        en: 'Reusable adapters and playbooks shorten integration cycles without cutting corners.',
        ar: 'محولات وخطط جاهزة تختصر دورات التكامل دون اختصار الجودة.',
      },
    },
    {
      title: { en: 'Uninterrupted operations', ar: 'تشغيل بلا انقطاع' },
      body: {
        en: 'Dual-run cutovers and observability keep channels live during change.',
        ar: 'تشغيل مزدوج ومراقبة تبقي القنوات حيّة أثناء التغيير.',
      },
    },
    {
      title: { en: 'Top-tier security', ar: 'أمن من الطراز الأول' },
      body: {
        en: 'PCI-aware patterns, identity controls, and audit-ready evidence packs.',
        ar: 'أنماط متوافقة مع PCI وضوابط هوية وحزم أدلة جاهزة للتدقيق.',
      },
    },
    {
      title: { en: 'Effortless partnership', ar: 'شراكة بلا تعقيد' },
      body: {
        en: 'One accountable squad across architecture, delivery, and hypercare.',
        ar: 'فريق واحد مسؤول عبر الهندسة والتسليم والدعم المكثف.',
      },
    },
  ],
  elevateTitle: { en: 'Elevate your banking stack with Tayseer', ar: 'ارتقِ بمنصتك المصرفية مع تيسير' },
  elevateLead: {
    en: 'Combine speed, security, and regional expertise — then put it in production with a team that stays accountable.',
    ar: 'اجمع السرعة والأمن والخبرة الإقليمية — ثم انقلها للإنتاج مع فريق يبقى مسؤولاً.',
  },
} as const;

export const SOLUTIONS_PAGE = {
  eyebrow: { en: 'Product Suite', ar: 'مجموعة المنتجات' },
  title: { en: 'Solutions', ar: 'الحلول' },
  lead: {
    en: 'Intelligent platforms for banks and fintechs — from core modernization to AI, mobile, and managed operations.',
    ar: 'منصات ذكية للبنوك وشركات التقنية المالية — من تحديث النواة إلى الذكاء الاصطناعي والجوال والتشغيل المُدار.',
  },
  heroSecondary: { en: 'Browse services', ar: 'تصفح الخدمات' },
  heroMetaSuite: { en: 'Six connected solutions', ar: 'ستة حلول مترابطة' },
  heroMetaAi: { en: 'Core, AI & mobile', ar: 'النواة والذكاء الاصطناعي والجوال' },
  heroMetaOps: { en: 'Managed operations', ar: 'تشغيل مُدار' },
  heroBadgeKicker: { en: 'Product suite', ar: 'مجموعة المنتجات' },
  featuresTitle: { en: 'Game-Changing Features', ar: 'ميزات تغيّر قواعد اللعبة' },
  featuresLead: {
    en: 'One suite. Clear outcomes. Built to modernize banking without fragmenting the customer journey.',
    ar: 'مجموعة واحدة ونتائج واضحة لتحديث العمل المصرفي دون تفتيت رحلة العميل.',
  },
  features: [
    {
      id: 'platforms',
      title: { en: 'Intelligent platforms', ar: 'منصات ذكية' },
      body: {
        en: 'Core, AI, and mobile products that share one delivery standard and one operating model.',
        ar: 'منتجات النواة والذكاء الاصطناعي والجوال بمعيار تسليم واحد ونموذج تشغيل موحّد.',
      },
    },
    {
      id: 'experience',
      title: { en: 'Seamless customer journeys', ar: 'رحلات عملاء سلسة' },
      body: {
        en: 'White-label apps, wallets, and service layers designed for speed and trust.',
        ar: 'تطبيقات بعلامتك ومحافظ وطبقات خدمة مصممة للسرعة والثقة.',
      },
    },
    {
      id: 'control',
      title: { en: 'Governed by design', ar: 'حوكمة مدمجة في التصميم' },
      body: {
        en: 'Security, auditability, and compliance controls sit inside the product — not as an afterthought.',
        ar: 'الأمن والقابلية للتدقيق وضوابط الامتثال داخل المنتج لا كإضافة لاحقة.',
      },
    },
    {
      id: 'delivery',
      title: { en: 'Managed excellence', ar: 'تميّز مُدار' },
      body: {
        en: 'Optional run, watch, and optimize services so your stack stays production-ready.',
        ar: 'خدمات تشغيل ومراقبة وتحسين اختيارية تبقي منصتك جاهزة للإنتاج.',
      },
    },
  ],
  worldsTitle: { en: 'Built for Your World', ar: 'مصممة لعالمك' },
  worldsLead: {
    en: 'Whether you run retail, corporate, Islamic, or digital banking — the suite adapts to how you grow.',
    ar: 'سواء كنت تدير خدمات تجزئة أو شركات أو إسلامية أو رقمية — تتكيف المجموعة مع نموك.',
  },
  worlds: [
    {
      id: 'retail',
      title: { en: 'Retail banking', ar: 'الخدمات المصرفية للأفراد' },
      body: {
        en: 'Launch channels, wallets, and onboarding that stay simple under peak demand.',
        ar: 'أطلق قنوات ومحافظ وتسجيلاً يبقى بسيطاً في أوقات الذروة.',
      },
    },
    {
      id: 'corporate',
      title: { en: 'Corporate & SME', ar: 'الشركات والمؤسسات الصغيرة' },
      body: {
        en: 'Give relationship teams faster servicing with controlled, auditable workflows.',
        ar: 'امنح فرق العلاقات خدمة أسرع بمسارات مضبوطة وقابلة للتدقيق.',
      },
    },
    {
      id: 'islamic',
      title: { en: 'Islamic banking', ar: 'الخدمات المصرفية الإسلامية' },
      body: {
        en: 'Product and journey patterns that respect Sharia operating models.',
        ar: 'أنماط منتجات ورحلات تراعي نماذج التشغيل الشرعية.',
      },
    },
    {
      id: 'digital',
      title: { en: 'Digital challengers', ar: 'البنوك الرقمية' },
      body: {
        en: 'Stand up modern stacks quickly without inheriting legacy drag.',
        ar: 'ابنِ منصات حديثة بسرعة دون أعباء الأنظمة القديمة.',
      },
    },
    {
      id: 'fintech',
      title: { en: 'Payments & fintech', ar: 'المدفوعات والتقنية المالية' },
      body: {
        en: 'Orchestrate rails, partners, and customer apps from one accountable suite.',
        ar: 'نسّق القنوات والشركاء وتطبيقات العملاء من مجموعة واحدة مسؤولة.',
      },
    },
  ],
  catalogTitle: { en: 'Explore the suite', ar: 'استكشف المجموعة' },
  catalogLead: {
    en: 'Each solution can stand alone or connect into a broader Tayseer program.',
    ar: 'يمكن لكل حل أن يعمل منفرداً أو ضمن برنامج أوسع من تيسير.',
  },
  splitEyebrow: { en: 'Connected. Intelligent. Production-ready.', ar: 'متصلة. ذكية. جاهزة للإنتاج.' },
  splitTitle: { en: 'Solutions designed to compound value', ar: 'حلول مصممة لتراكم القيمة' },
  splitLead: {
    en: 'Start with one product, then expand — data, journeys, and operations stay aligned across the suite.',
    ar: 'ابدأ بمنتج واحد ثم توسّع — تبقى البيانات والرحلات والتشغيل متوافقة عبر المجموعة.',
  },
  splitItems: [
    {
      title: { en: 'Streamline operations', ar: 'تبسيط العمليات' },
      body: { en: 'Reduce handoffs and duplicated systems across channels and core.', ar: 'قلل التمريرات والأنظمة المكررة عبر القنوات والنواة.' },
    },
    {
      title: { en: 'Elevate customer experience', ar: 'تعزيز تجربة العملاء' },
      body: { en: 'Faster journeys with consistent branding and fewer drop-offs.', ar: 'رحلات أسرع بهوية متسقة وتسرب أقل.' },
    },
    {
      title: { en: 'Mitigate risk', ar: 'تخفيف المخاطر' },
      body: { en: 'Security and audit controls travel with every deployment.', ar: 'ضوابط الأمن والتدقيق ترافق كل نشر.' },
    },
    {
      title: { en: 'Stay ahead', ar: 'البقاء في الطليعة' },
      body: { en: 'AI, mobile, and managed services keep the stack moving forward.', ar: 'الذكاء الاصطناعي والجوال والخدمات المُدارة تبقي المنصة في تقدم.' },
    },
  ],
  elevateTitle: { en: 'Ready to transform with Tayseer solutions?', ar: 'هل أنت مستعد للتحول مع حلول تيسير؟' },
  elevateLead: {
    en: 'Tell us where you are today — core, channels, AI, or operations — and we will map the shortest safe path.',
    ar: 'أخبرنا بموقعك اليوم — النواة أو القنوات أو الذكاء الاصطناعي أو التشغيل — وسنحدد أقصر مسار آمن.',
  },
  detailFeaturesTitle: { en: 'Game-Changing Features', ar: 'ميزات تغيّر قواعد اللعبة' },
  detailWorldsTitle: { en: 'Where it fits', ar: 'أين يناسب' },
  detailSplitEyebrow: { en: 'Focused. Proven. Ready to deploy.', ar: 'مركّز. مُثبت. جاهز للنشر.' },
  detailElevateTitle: { en: 'See this solution in your environment', ar: 'شاهد هذا الحل في بيئتك' },
  detailElevateLead: {
    en: 'Request a walkthrough tailored to your stack, controls, and go-live window.',
    ar: 'اطلب جولة مخصصة لمنصتك وضوابطك ونافذة الإطلاق.',
  },
} as const;

export const SOFTWARE_PAGE = {
  eyebrow: { en: 'Custom Engineering', ar: 'هندسة مخصصة' },
  title: { en: 'Software Development', ar: 'تطوير البرمجيات' },
  lead: {
    en: 'Legacy modernization, cloud-native microservices, and mobile banking frameworks built for Gulf regulators.',
    ar: 'تحديث الأنظمة القديمة والخدمات السحابية الأصلية وأطر الخدمات المصرفية عبر الجوال وفق متطلبات المنطقة.',
  },
  tracks: [
    {
      id: 'legacy',
      title: { en: 'Legacy Modernization', ar: 'تحديث الأنظمة القديمة' },
      body: {
        en: 'Strangler-fig migrations, API façades, and dual-run cutovers with zero customer downtime.',
        ar: 'ترحيل تدريجي وواجهات API وتشغيل مزدوج بدون انقطاع للعملاء.',
      },
    },
    {
      id: 'cloud',
      title: { en: 'Cloud-Native Microservices', ar: 'خدمات سحابية أصلية' },
      body: {
        en: 'Event-driven domains on Kubernetes with observability, SRE runbooks, and blue/green releases.',
        ar: 'نطاقات قائمة على الأحداث عبر Kubernetes مع مراقبة وتشغيل SRE وإصدارات آمنة.',
      },
    },
    {
      id: 'mobile',
      title: { en: 'Mobile Banking Frameworks', ar: 'أطر الخدمات المصرفية عبر الجوال' },
      body: {
        en: 'Secure native and hybrid apps with biometrics, soft tokens, and offline-tolerant UX.',
        ar: 'تطبيقات آمنة أصلية وهجينة مع بصمة ورمز ناعم وتجربة تدعم العمل دون اتصال.',
      },
    },
  ],
  tabsTitle: { en: 'Interactive Tech Stack', ar: 'حزمة التقنيات التفاعلية' },
  tabs: [
    {
      id: 'frontend',
      label: { en: 'Frontend', ar: 'الواجهة' },
      items: [
        { en: 'Angular / React', ar: 'Angular / React' },
        { en: 'Design Systems', ar: 'أنظمة التصميم' },
        { en: 'RTL-first UI', ar: 'واجهات تدعم RTL أولاً' },
        { en: 'Web Performance', ar: 'أداء الويب' },
      ],
    },
    {
      id: 'backend',
      label: { en: 'Backend', ar: 'الخلفية' },
      items: [
        { en: '.NET / Java', ar: '.NET / Java' },
        { en: 'Event Streams', ar: 'تدفقات الأحداث' },
        { en: 'Domain Services', ar: 'خدمات النطاق' },
        { en: 'API Governance', ar: 'حوكمة الواجهات' },
      ],
    },
    {
      id: 'security',
      label: { en: 'Security', ar: 'الأمن' },
      items: [
        { en: 'Zero Trust', ar: 'الثقة المعدومة' },
        { en: 'IAM / MFA', ar: 'إدارة الهوية / MFA' },
        { en: 'Secrets Mgmt', ar: 'إدارة الأسرار' },
        { en: 'Threat Modeling', ar: 'نمذجة التهديدات' },
      ],
    },
    {
      id: 'devops',
      label: { en: 'DevOps', ar: 'ديف أوبس' },
      items: [
        { en: 'CI/CD', ar: 'CI/CD' },
        { en: 'GitOps', ar: 'GitOps' },
        { en: 'Observability', ar: 'المراقبة' },
        { en: 'Chaos Drills', ar: 'اختبارات الفوضى' },
      ],
    },
  ],
} as const;

export const MANAGED_PAGE = {
  eyebrow: { en: '24/7 Infrastructure & Security', ar: 'البنية والأمن على مدار الساعة' },
  title: { en: 'Managed Services', ar: 'الخدمات المدارة' },
  lead: {
    en: 'Always-on SOC monitoring, SLA-backed uptime, and compliance operations for regulated enterprises.',
    ar: 'مراقبة SOC مستمرة وتوافر مضمون باتفاقيات مستوى الخدمة وعمليات امتثال للمؤسسات المنظمة.',
  },
  slaTitle: { en: 'Live Status Simulation', ar: 'محاكاة الحالة المباشرة' },
  metrics: [
    { label: { en: 'Platform Uptime', ar: 'وقت التشغيل' }, value: '99.999%', tone: 'up' },
    { label: { en: 'SOC Alerts (24h)', ar: 'تنبيهات SOC (24س)' }, value: '12', tone: 'watch' },
    { label: { en: 'MTTR', ar: 'متوسط وقت الإصلاح' }, value: '18m', tone: 'up' },
    { label: { en: 'Open Incidents', ar: 'حوادث مفتوحة' }, value: '0', tone: 'up' },
  ],
  feeds: [
    { en: 'Edge WAF healthy — GCC cluster', ar: 'WAF الحافة سليم — عنقود الخليج' },
    { en: 'Identity federation sync OK', ar: 'مزامنة اتحاد الهوية ناجحة' },
    { en: 'Backup vault verification passed', ar: 'تحقق خزنة النسخ الاحتياطي ناجح' },
    { en: 'Threat intel feed refreshed', ar: 'تم تحديث تغذية معلومات التهديدات' },
  ],
  badgesTitle: { en: 'Security & Compliance Badges', ar: 'شارات الأمن والامتثال' },
  badges: [
    { en: 'PCI-DSS Level 1', ar: 'PCI-DSS المستوى 1' },
    { en: 'ISO 27001', ar: 'ISO 27001' },
    { en: 'SOC 2 Type II', ar: 'SOC 2 Type II' },
    { en: 'NCA ECC Aligned', ar: 'متوافق مع NCA ECC' },
  ],
} as const;

export const ABOUT_PAGE = {
  eyebrow: { en: 'Our Company', ar: 'شركتنا' },
  title: { en: 'About Tayseer Innovations', ar: 'عن تيسير إنوفيشنز' },
  lead: {
    en: 'Creating trusted banking technology and digital experiences that help institutions thrive across the Gulf.',
    ar: 'نصنع تقنية مصرفية موثوقة وتجارب رقمية تساعد المؤسسات على النمو عبر الخليج.',
  },
  heroCta: { en: 'Join Our Journey', ar: 'انضم إلى رحلتنا' },
  heroSecondary: { en: 'Explore our story', ar: 'استكشف قصتنا' },
  heroMetaSince: { en: 'Established 2016', ar: 'تأسست عام 2016' },
  heroMetaCoverage: { en: 'Riyadh & Dubai', ar: 'الرياض ودبي' },
  heroMetaFocus: { en: 'FinTech for the Gulf', ar: 'تقنية مالية للخليج' },
  heroBadgeKicker: { en: 'Our company', ar: 'شركتنا' },
  story: {
    en: 'Established in 2016, Tayseer Innovations emerges as a premier FinTech company in the UAE. We specialize in elevating businesses through advanced financial technology solutions, enhancing financial accessibility and fostering regional growth. As more than just a service provider, we position ourselves as your committed ally in the digital landscape, dedicated to facilitating your journey towards digital excellence.',
    ar: 'تأسست تيسير للابتكارات عام 2016 كشركة تقنية مالية رائدة في الإمارات. نتخصص في الارتقاء بالأعمال عبر حلول تقنية مالية متقدمة، وتعزيز الوصول المالي ودعم النمو الإقليمي. لسنا مجرد مزود خدمة، بل شريك ملتزم في رحلتكم نحو التميز الرقمي.',
  },
  whoTitle: { en: 'Who We Are', ar: 'من نحن' },
  whoLead: {
    en: 'A Gulf-rooted fintech partner combining product craft, banking delivery, and accountable operations.',
    ar: 'شريك تقنية مالية بجذور خليجية يجمع بين صناعة المنتج والتسليم المصرفي والتشغيل المسؤول.',
  },
  missionTitle: { en: 'Mission', ar: 'المهمة' },
  mission: {
    en: 'Accelerate digital excellence for banks and enterprises with trusted AI, core platforms, and managed operations.',
    ar: 'تسريع التميز الرقمي للبنوك والمؤسسات عبر الذكاء الاصطناعي والمنصات الأساسية والعمليات المدارة.',
  },
  timelineTitle: { en: 'Our Journey', ar: 'رحلتنا' },
  timelineLead: {
    en: 'Since our founding, Tayseer has focused on solutions that help banks connect with customers and run with greater control.',
    ar: 'منذ تأسيسنا ركزت تيسير على حلول تساعد البنوك على التواصل مع العملاء والعمل بسيطرة أكبر.',
  },
  timeline: [
    {
      year: '2016',
      title: { en: 'Tayseer Founded', ar: 'تأسيس تيسير' },
      text: {
        en: 'Founded in the UAE with a clear focus on Gulf banking transformation.',
        ar: 'تأسست في الإمارات بتركيز واضح على تحول الخدمات المصرفية الخليجية.',
      },
    },
    {
      year: '2019',
      title: { en: 'Regional Expansion', ar: 'التوسع الإقليمي' },
      text: {
        en: 'Expanded core banking and payments programs across the region.',
        ar: 'توسيع برامج الأنظمة المصرفية والمدفوعات على مستوى المنطقة.',
      },
    },
    {
      year: '2022',
      title: { en: 'Managed Excellence', ar: 'تميّز مُدار' },
      text: {
        en: 'Enterprise managed SOC and open banking accelerators for regulated institutions.',
        ar: 'SOC مُدار للمؤسسات ومسرّعات الخدمات المصرفية المفتوحة للجهات المنظمة.',
      },
    },
    {
      year: '2026',
      title: { en: 'Fahim.AI Launch', ar: 'إطلاق فهيم.AI' },
      text: {
        en: 'Launched Fahim.AI and mobile delivery frameworks for modern banking journeys.',
        ar: 'إطلاق فهيم.AI وأطر التسليم عبر الجوال لرحلات مصرفية حديثة.',
      },
    },
  ],
  visionTitle: { en: 'Our Vision & Mission', ar: 'رؤيتنا ومهمتنا' },
  visionCardTitle: { en: 'Vision', ar: 'الرؤية' },
  visionCardBody: {
    en: 'To transform how banks and enterprises serve customers through trusted digital platforms that drive growth and lasting confidence.',
    ar: 'تحويل طريقة خدمة البنوك والمؤسسات لعملائها عبر منصات رقمية موثوقة تدفع النمو والثقة المستدامة.',
  },
  missionCardTitle: { en: 'Mission', ar: 'المهمة' },
  missionCardBody: {
    en: 'Create reliable banking technology — AI, core, mobile, and managed operations — that helps institutions grow with control.',
    ar: 'صنع تقنية مصرفية موثوقة — ذكاء اصطناعي ونواة وجوال وتشغيل مُدار — تساعد المؤسسات على النمو بسيطرة.',
  },
  approachTitle: { en: 'Our Approach', ar: 'نهجنا' },
  approach: [
    {
      title: { en: 'Listen', ar: 'نستمع' },
      body: {
        en: 'We start with your controls, customers, and operating reality — not a generic playbook.',
        ar: 'نبدأ بضوابطك وعملائك وواقع تشغيلك — لا بدليل عام.',
      },
    },
    {
      title: { en: 'Design', ar: 'نصمّم' },
      body: {
        en: 'We design journeys and architectures that are usable, auditable, and ready for scale.',
        ar: 'نصمّم رحلات وهياكل قابلة للاستخدام والتدقيق وجاهزة للتوسع.',
      },
    },
    {
      title: { en: 'Build', ar: 'نبني' },
      body: {
        en: 'We deliver with certified integrations, dual-run cutovers, and production discipline.',
        ar: 'نسلّم بتكاملات معتمدة وتشغيل مزدوج وانضباط إنتاج.',
      },
    },
    {
      title: { en: 'Support', ar: 'ندعم' },
      body: {
        en: 'We stay accountable after go-live with managed operations and specialist support.',
        ar: 'نبقى مسؤولين بعد الإطلاق عبر التشغيل المُدار والدعم المتخصص.',
      },
    },
  ],
  valuesTitle: { en: 'Our Core Values', ar: 'قيمنا الأساسية' },
  valuesLead: {
    en: 'These values guide how we design products, deliver programs, and partner with every institution.',
    ar: 'توجّه هذه القيم طريقة تصميم منتجاتنا وتسليم برامجنا والشراكة مع كل مؤسسة.',
  },
  values: [
    {
      title: { en: 'Innovation', ar: 'الابتكار' },
      body: {
        en: 'We push banking technology forward without losing operational discipline.',
        ar: 'ندفع التقنية المصرفية إلى الأمام دون فقدان الانضباط التشغيلي.',
      },
    },
    {
      title: { en: 'Clarity', ar: 'الوضوح' },
      body: {
        en: 'Complex systems should feel simple for customers, operators, and auditors.',
        ar: 'يجب أن تبدو الأنظمة المعقّدة بسيطة للعملاء والمشغّلين والمدققين.',
      },
    },
    {
      title: { en: 'Reliability', ar: 'الموثوقية' },
      body: {
        en: 'Institutions trust us to deliver secure, consistent platforms they can run on.',
        ar: 'تثق بنا المؤسسات لتسليم منصات آمنة وثابتة يمكن الاعتماد عليها.',
      },
    },
    {
      title: { en: 'Partnership', ar: 'الشراكة' },
      body: {
        en: 'We work as one accountable team with our clients from discovery through hypercare.',
        ar: 'نعمل كفريق واحد مسؤول مع عملائنا من الاستكشاف حتى الدعم المكثف.',
      },
    },
  ],
  testimonialsTitle: { en: 'What Our Clients Say', ar: 'ماذا يقول عملاؤنا' },
  testimonialsLead: {
    en: 'We are proud to partner with institutions that trust Tayseer to deliver lasting digital outcomes.',
    ar: 'نفتخر بالشراكة مع مؤسسات تثق بتيسير لتحقيق نتائج رقمية مستدامة.',
  },
  elevateTitle: { en: 'Ready to Transform Your Institution?', ar: 'هل أنت مستعد لتحويل مؤسستك؟' },
  elevateLead: {
    en: 'Let’s map the shortest safe path — core, channels, AI, or managed operations — with a team that stays accountable.',
    ar: 'لنحدد أقصر مسار آمن — النواة أو القنوات أو الذكاء الاصطناعي أو التشغيل المُدار — مع فريق يبقى مسؤولاً.',
  },
  credsTitle: { en: 'Enterprise Credentials', ar: 'اعتمادات المؤسسات' },
  creds: [
    { en: 'ISO 27001 Certified', ar: 'معتمد ISO 27001' },
    { en: 'Regional banking delivery', ar: 'تسليم مصرفي إقليمي' },
    { en: 'Bilingual product teams', ar: 'فرق منتجات ثنائية اللغة' },
    { en: 'On-prem & cloud ready', ar: 'جاهز للسحابة والبنية المحلية' },
  ],
  teamTitle: { en: 'Leadership Team', ar: 'فريق القيادة' },
  leaders: [
    {
      id: 'aisha',
      name: { en: 'Aisha Al Mansoori', ar: 'عائشة المنصوري' },
      role: { en: 'Chief Executive Officer', ar: 'الرئيسة التنفيذية' },
      img: '/images/leader-aisha.jpg',
      links: [
        { label: { en: 'LinkedIn', ar: 'لينكدإن' }, href: 'https://www.linkedin.com/' },
      ],
    },
    {
      id: 'omar',
      name: { en: 'Omar Haddad', ar: 'عمر حداد' },
      role: { en: 'Chief Technology Officer', ar: 'رئيس التقنية' },
      img: '/images/leader-omar.jpg',
      links: [
        { label: { en: 'LinkedIn', ar: 'لينكدإن' }, href: 'https://www.linkedin.com/' },
      ],
    },
    {
      id: 'sara',
      name: { en: 'Sara Nasser', ar: 'سارة ناصر' },
      role: { en: 'Head of Delivery', ar: 'رئيسة التسليم' },
      img: '/images/leader-sara.jpg',
      links: [
        { label: { en: 'LinkedIn', ar: 'لينكدإن' }, href: 'https://www.linkedin.com/' },
      ],
    },
    {
      id: 'khalid',
      name: { en: 'Khalid Rahman', ar: 'خالد رحمن' },
      role: { en: 'Head of Security', ar: 'رئيس الأمن' },
      img: '/images/leader-khalid.jpg',
      links: [
        { label: { en: 'LinkedIn', ar: 'لينكدإن' }, href: 'https://www.linkedin.com/' },
      ],
    },
  ],
} as const;

export const CASE_STUDIES_PAGE = {
  eyebrow: { en: 'Client Success', ar: 'نجاح العملاء' },
  title: { en: 'Case Studies', ar: 'دراسات الحالة' },
  lead: {
    en: 'Outcomes from banking, fintech, and managed IT programs across the Gulf.',
    ar: 'نتائج من برامج مصرفية وتقنية مالية وتقنية معلومات مدارة عبر الخليج.',
  },
  filters: [
    { id: 'all', label: { en: 'All', ar: 'الكل' } },
    { id: 'banking', label: { en: 'Banking', ar: 'الخدمات المصرفية' } },
    { id: 'fintech', label: { en: 'Fintech', ar: 'التقنية المالية' } },
    { id: 'managed', label: { en: 'Managed IT', ar: 'تقنية معلومات مدارة' } },
  ],
  items: [
    {
      slug: 'core-migration-gcc-bank',
      sector: 'banking',
      title: { en: 'Core Migration for a GCC Bank', ar: 'ترحيل النواة لبنك خليجي' },
      summary: {
        en: 'Zero-downtime dual-run cutover with reconciled ledgers in 14 weeks.',
        ar: 'انتقال مزدوج بدون توقف مع دفاتر مطابقة خلال 14 أسبوعاً.',
      },
      img: '/images/service-core-banking.jpg',
      problem: {
        en: 'Aging core limited product velocity and raised operational risk.',
        ar: 'نواة قديمة حدّت سرعة المنتجات وزادت المخاطر التشغيلية.',
      },
      solution: {
        en: 'Strangler migration with API façade, batch dual-run, and controlled channel switch.',
        ar: 'ترحيل تدريجي مع واجهة API وتشغيل مزدوج وتبديل قنوات محكم.',
      },
      metrics: [
        { label: { en: 'Cutover Window', ar: 'نافذة الانتقال' }, value: '42m' },
        { label: { en: 'Ledger Variance', ar: 'فروقات الدفاتر' }, value: '0.00%' },
        { label: { en: 'Channels Online', ar: 'القنوات المتصلة' }, value: '100%' },
      ],
    },
    {
      slug: 'wallet-launch-fintech',
      sector: 'fintech',
      title: { en: 'Digital Wallet Launch', ar: 'إطلاق محفظة رقمية' },
      summary: {
        en: 'Consumer wallet with KYC orchestration and instant settlement rails.',
        ar: 'محفظة استهلاكية مع تنسيق KYC وقنوات تسوية فورية.',
      },
      img: '/images/service-mbuke.jpg',
      problem: {
        en: 'Fragmented payment partners delayed go-live and KYC throughput.',
        ar: 'شركاء دفع مجزأون أخّروا الإطلاق وإنتاجية KYC.',
      },
      solution: {
        en: 'Unified wallet core, partner adapters, and compliance workflow automation.',
        ar: 'نواة محفظة موحّدة ومحولات شركاء وأتمتة امتثال.',
      },
      metrics: [
        { label: { en: 'KYC SLA', ar: 'اتفاقية KYC' }, value: '< 4m' },
        { label: { en: 'MAU Growth', ar: 'نمو المستخدمين' }, value: '+180%' },
        { label: { en: 'Payment Success', ar: 'نجاح الدفع' }, value: '99.4%' },
      ],
    },
    {
      slug: 'managed-soc-enterprise',
      sector: 'managed',
      title: { en: 'Managed SOC for Enterprise', ar: 'SOC مُدار لمؤسسة' },
      summary: {
        en: 'Always-on detection with 99.999% platform SLA and audit-ready reporting.',
        ar: 'اكتشاف مستمر مع اتفاقية توافر 99.999% وتقارير جاهزة للتدقيق.',
      },
      img: '/images/service-managed.jpg',
      problem: {
        en: 'Alert fatigue and incomplete evidence trails slowed incident response.',
        ar: 'إرهاق التنبيهات ونقص الأدلة أبطأ الاستجابة للحوادث.',
      },
      solution: {
        en: '24/7 SOC with tuned detections, runbooks, and monthly compliance packs.',
        ar: 'SOC على مدار الساعة مع اكتشافات مضبوطة وخطط تشغيل وحزم امتثال شهرية.',
      },
      metrics: [
        { label: { en: 'Uptime SLA', ar: 'اتفاقية التوافر' }, value: '99.999%' },
        { label: { en: 'MTTD', ar: 'متوسط زمن الكشف' }, value: '6m' },
        { label: { en: 'Audit Findings', ar: 'ملاحظات التدقيق' }, value: '0' },
      ],
    },
  ],
} as const;

export const CONTACT_PAGE = {
  eyebrow: { en: 'Enterprise Contact', ar: 'تواصل المؤسسات' },
  title: { en: 'Talk with the Tayseer team', ar: 'تحدث مع فريق تيسير' },
  lead: {
    en: 'Partner with our Riyadh and Dubai teams on core banking, AI, and managed services. Tell us about your programme — we respond within one business day.',
    ar: 'تعاون مع فرقنا في الرياض ودبي في الأنظمة المصرفية والذكاء الاصطناعي والخدمات المدارة. أخبرنا عن برنامجك — نرد خلال يوم عمل واحد.',
  },
  heroCta: { en: 'Start an inquiry', ar: 'ابدأ استفساراً' },
  heroEmail: { en: 'Email the team', ar: 'راسل الفريق' },
  heroMetaResponse: { en: 'Reply within 1 business day', ar: 'الرد خلال يوم عمل واحد' },
  heroMetaCoverage: { en: 'Offices in Riyadh & Dubai', ar: 'مكاتب في الرياض ودبي' },
  heroMetaSince: { en: 'Established 2016', ar: 'تأسست عام 2016' },
  mapOpen: { en: 'Open in Google Maps', ar: 'افتح في خرائط Google' },
  mapRegion: { en: 'GCC coverage', ar: 'تغطية الخليج' },
  steps: [
    { en: 'Contact Us', ar: 'تواصل معنا' },
    { en: 'Project Scope', ar: 'نطاق المشروع' },
    { en: 'Preferences', ar: 'التفضيلات' },
  ],
  fields: {
    name: { en: 'Full name', ar: 'الاسم الكامل' },
    email: { en: 'Work email', ar: 'البريد المهني' },
    company: { en: 'Company', ar: 'الشركة' },
    phone: { en: 'Phone', ar: 'الهاتف' },
    interest: { en: 'Interest area', ar: 'مجال الاهتمام' },
    message: { en: 'How can we help?', ar: 'كيف يمكننا المساعدة؟' },
    budget: { en: 'Timeline', ar: 'الجدول الزمني' },
  },
  interests: [
    { en: 'Core Banking', ar: 'الأنظمة المصرفية' },
    { en: 'Software Development', ar: 'تطوير البرمجيات' },
    { en: 'Managed Services', ar: 'الخدمات المدارة' },
    { en: 'Open Banking', ar: 'الخدمات المصرفية المفتوحة' },
  ],
  officesTitle: { en: 'Office Locations', ar: 'مواقع المكاتب' },
  offices: [
    {
      id: 'riyadh',
      city: { en: 'Riyadh', ar: 'الرياض' },
      detail: {
        en: 'Office 7, 2nd Floor, Selam Building, Prince Saad bin Abdulrahman Alawal Branch Road, Al Rawabi, Riyadh',
        ar: 'مكتب 7، الطابق الثاني، مبنى سلام، طريق الأمير سعد بن عبدالرحمن الأول الفرعي، الروابي، الرياض',
      },
      country: { en: 'Kingdom of Saudi Arabia', ar: 'المملكة العربية السعودية' },
      phone: '+966 555203079',
      map: '/images/thumb-skyline.jpg',
      query: 'Selam Building, Prince Saad bin Abdulrahman Alawal Branch Road, Al Rawabi, Riyadh Saudi Arabia',
    },
    {
      id: 'dubai',
      city: { en: 'Dubai', ar: 'دبي' },
      detail: {
        en: '601, One Lake Plaza, Cluster T, JLT, Dubai',
        ar: '601، ون ليك بلازا، كلاستر T، أبراج بحيرات جميرا، دبي',
      },
      country: { en: 'United Arab Emirates', ar: 'الإمارات العربية المتحدة' },
      phone: '+971 43997558',
      map: '/images/thumb-dubai.jpg',
      query: 'One Lake Plaza, Cluster T, Jumeirah Lakes Towers, Dubai',
    },
  ],
  mapTitle: { en: 'Live map — GCC coverage', ar: 'خريطة مباشرة — تغطية الخليج' },
  errors: {
    name: { en: 'Please enter your full name.', ar: 'يرجى إدخال الاسم الكامل.' },
    email: { en: 'Enter a valid work email.', ar: 'أدخل بريداً مهنياً صالحاً.' },
    interest: { en: 'Select an interest area.', ar: 'اختر مجال الاهتمام.' },
    message: { en: 'Tell us briefly how we can help.', ar: 'أخبرنا باختصار كيف يمكننا المساعدة.' },
  },
} as const;

export const FAQ_PAGE = {
  eyebrow: { en: 'Help Centre', ar: 'مركز المساعدة' },
  title: { en: 'Frequently asked questions', ar: 'الأسئلة الشائعة' },
  lead: {
    en: 'Answers about Tayseer, our six solutions, onboarding, security, and how to reach the team in Riyadh and Dubai.',
    ar: 'إجابات حول تيسير وحلولنا الستة والانضمام والأمن وكيفية التواصل مع الفريق في الرياض ودبي.',
  },
  heroCta: { en: 'Browse questions', ar: 'تصفح الأسئلة' },
  heroSecondary: { en: 'Contact us', ar: 'تواصل معنا' },
  heroMetaTopics: { en: 'Solutions, security & onboarding', ar: 'الحلول والأمن والانضمام' },
  heroMetaCoverage: { en: 'Support in Riyadh & Dubai', ar: 'دعم في الرياض ودبي' },
  heroMetaResponse: { en: 'Enterprise answers, ready now', ar: 'إجابات مؤسسية جاهزة الآن' },
  heroBadgeKicker: { en: 'Help Centre', ar: 'مركز المساعدة' },
  searchPlaceholder: { en: 'Search questions…', ar: 'ابحث في الأسئلة…' },
  allLabel: { en: 'All', ar: 'الكل' },
  empty: { en: 'No matching questions. Try another search or category.', ar: 'لا توجد أسئلة مطابقة. جرّب بحثاً أو تصنيفاً آخر.' },
  ctaTitle: { en: 'Still have questions?', ar: 'ما زالت لديك أسئلة؟' },
  ctaLead: {
    en: 'Talk with the Tayseer team — we work with banks and enterprises across Saudi Arabia and the UAE.',
    ar: 'تحدث مع فريق تيسير — نعمل مع البنوك والمؤسسات في المملكة العربية السعودية والإمارات.',
  },
  ctaAction: { en: 'Contact us', ar: 'تواصل معنا' },
  categories: [
    {
      id: 'about',
      title: { en: 'About Tayseer', ar: 'عن تيسير' },
      items: [
        {
          q: { en: 'Who is Tayseer Innovations?', ar: 'من هي تيسير للابتكارات؟' },
          a: {
            en: 'Established in 2016, Tayseer Innovations is a fintech company serving banks and enterprises in Saudi Arabia and the UAE with AI and digital banking solutions.',
            ar: 'تأسست تيسير للابتكارات عام 2016 كشركة تقنية مالية تخدم البنوك والمؤسسات في المملكة العربية السعودية والإمارات بحلول الذكاء الاصطناعي والخدمات المصرفية الرقمية.',
          },
        },
        {
          q: { en: 'Where does Tayseer operate?', ar: 'أين تعمل تيسير؟' },
          a: {
            en: 'Tayseer has offices in Riyadh, Kingdom of Saudi Arabia, and Dubai, United Arab Emirates.',
            ar: 'لتيسير مكاتب في الرياض بالمملكة العربية السعودية، ودبي بالإمارات العربية المتحدة.',
          },
        },
        {
          q: { en: 'When was Tayseer founded?', ar: 'متى تأسست تيسير؟' },
          a: {
            en: 'Tayseer was established in 2016.',
            ar: 'تأسست تيسير عام 2016.',
          },
        },
      ],
    },
    {
      id: 'solutions',
      title: { en: 'Our Solutions', ar: 'حلولنا' },
      items: [
        {
          q: { en: 'What solutions does Tayseer offer?', ar: 'ما الحلول التي تقدمها تيسير؟' },
          a: {
            en: 'Tayseer offers six solutions: Core Banking, Fahim AI, MBuke, Software Management Systems, Managed Services, and Banking Systems.',
            ar: 'تقدم تيسير ستة حلول: الخدمات المصرفية الأساسية، فهيم للذكاء الاصطناعي، إم بوكي، أنظمة إدارة البرمجيات، الخدمات المُدارة، والأنظمة المصرفية.',
          },
        },
        {
          q: { en: 'What is Fahim AI?', ar: 'ما هو فهيم للذكاء الاصطناعي؟' },
          a: {
            en: 'Fahim AI is Tayseer’s artificial intelligence offering for banks and enterprises, including conversational assistance on this site.',
            ar: 'فهيم هو عرض تيسير في الذكاء الاصطناعي للبنوك والمؤسسات، ويشمل المساعدة الحوارية على هذا الموقع.',
          },
        },
        {
          q: { en: 'Can solutions be deployed on-site or in the cloud?', ar: 'هل يمكن نشر الحلول في الموقع أو على السحابة؟' },
          a: {
            en: 'Yes. Tayseer supports on-site deployment when control and customization come first, and cloud deployment when agility and scale matter most.',
            ar: 'نعم. تدعم تيسير النشر في الموقع عندما تكون السيطرة والتخصيص أولاً، والنشر السحابي عندما تكون المرونة والتوسع هما الأولوية.',
          },
        },
      ],
    },
    {
      id: 'partnership',
      title: { en: 'Partnership & Onboarding', ar: 'الشراكة والانضمام' },
      items: [
        {
          q: { en: 'How do we start working with Tayseer?', ar: 'كيف نبدأ العمل مع تيسير؟' },
          a: {
            en: 'Use the Contact page to submit a query or request a demo. Our team in Riyadh and Dubai will follow up.',
            ar: 'استخدم صفحة التواصل لإرسال استفسار أو طلب عرض توضيحي. سيتابع فريقنا في الرياض ودبي معك.',
          },
        },
        {
          q: { en: 'Who does Tayseer typically work with?', ar: 'مع من تعمل تيسير عادةً؟' },
          a: {
            en: 'Tayseer works with banks and enterprises across Saudi Arabia and the UAE on core banking, AI, mobile, software, and managed operations.',
            ar: 'تعمل تيسير مع البنوك والمؤسسات في المملكة العربية السعودية والإمارات على الأنظمة المصرفية الأساسية والذكاء الاصطناعي والجوال والبرمجيات والعمليات المُدارة.',
          },
        },
      ],
    },
    {
      id: 'security',
      title: { en: 'Security & Compliance', ar: 'الأمن والامتثال' },
      items: [
        {
          q: { en: 'Is Tayseer ISO certified?', ar: 'هل تيسير حاصلة على شهادة ISO؟' },
          a: {
            en: 'Yes. Tayseer is ISO 27001 certified for information security management.',
            ar: 'نعم. تيسير معتمدة وفق ISO 27001 لإدارة أمن المعلومات.',
          },
        },
        {
          q: { en: 'How should we discuss security requirements?', ar: 'كيف نناقش متطلبات الأمن؟' },
          a: {
            en: 'Share your requirements through the Contact form. The team can walk through security and deployment needs for your programme.',
            ar: 'شارك متطلباتك عبر نموذج التواصل. يمكن للفريق مناقشة احتياجات الأمن والنشر لبرنامجك.',
          },
        },
      ],
    },
    {
      id: 'support',
      title: { en: 'Support', ar: 'الدعم' },
      items: [
        {
          q: { en: 'How can we contact Tayseer?', ar: 'كيف يمكننا التواصل مع تيسير؟' },
          a: {
            en: 'Email info@tayseer.me, use the Contact page, or open Fahim chat on this site. Office addresses are listed for Riyadh and Dubai.',
            ar: 'راسل info@tayseer.me أو استخدم صفحة التواصل أو افتح محادثة فهيم على هذا الموقع. عناوين المكاتب مدرجة للرياض ودبي.',
          },
        },
        {
          q: { en: 'Is there a careers channel?', ar: 'هل هناك قناة للوظائف؟' },
          a: {
            en: 'Visit the Careers page to see open roles or send your CV through the contact flow.',
            ar: 'زر صفحة الوظائف للاطلاع على الشواغر أو أرسل سيرتك عبر مسار التواصل.',
          },
        },
      ],
    },
  ],
} as const;

export const CAREERS_PAGE = {
  eyebrow: { en: 'Careers at Tayseer', ar: 'الوظائف في تيسير' },
  title: { en: 'Build the region’s banking future with us', ar: 'ابنِ مستقبل الخدمات المصرفية في المنطقة معنا' },
  lead: {
    en: 'Join a fintech team in Riyadh and Dubai delivering core banking, AI, mobile, and managed services for banks and enterprises.',
    ar: 'انضم إلى فريق تقنية مالية في الرياض ودبي يقدّم الأنظمة المصرفية الأساسية والذكاء الاصطناعي والجوال والخدمات المُدارة للبنوك والمؤسسات.',
  },
  heroCta: { en: 'Email your CV', ar: 'أرسل سيرتك بالبريد' },
  heroSecondary: { en: 'View open roles', ar: 'عرض الوظائف المتاحة' },
  heroMetaSince: { en: 'Established 2016', ar: 'تأسست عام 2016' },
  heroMetaCoverage: { en: 'Teams in Riyadh & Dubai', ar: 'فرق في الرياض ودبي' },
  heroMetaFocus: { en: 'Banking, AI & delivery', ar: 'الخدمات المصرفية والذكاء الاصطناعي' },
  heroBadgeKicker: { en: 'Join the team', ar: 'انضم إلى الفريق' },
  whyTitle: { en: 'Why Tayseer', ar: 'لماذا تيسير' },
  whyLead: {
    en: 'The same delivery principles we use with clients guide how we work together.',
    ar: 'نفس مبادئ التسليم التي نعتمدها مع العملاء توجّه طريقة عملنا معاً.',
  },
  values: [
    {
      title: { en: 'One project, one team', ar: 'مشروع واحد، فريق واحد' },
      body: {
        en: 'Dedicated focus on the work in front of us — the same model we use with client programmes.',
        ar: 'تركيز مخصص على العمل أمامنا — نفس النموذج الذي نعتمده مع برامج العملاء.',
      },
    },
    {
      title: { en: 'Complete transparency', ar: 'شفافية كاملة' },
      body: {
        en: 'Clear communication and direct access across the team.',
        ar: 'تواصل واضح ووصول مباشر عبر الفريق.',
      },
    },
    {
      title: { en: 'Consistent quality', ar: 'جودة ثابتة' },
      body: {
        en: 'Polished, business-ready delivery across banking and enterprise programmes.',
        ar: 'تسليم مصقول وجاهز للأعمال عبر برامج البنوك والمؤسسات.',
      },
    },
    {
      title: { en: 'Riyadh & Dubai', ar: 'الرياض ودبي' },
      body: {
        en: 'Work with a regional fintech presence across Saudi Arabia and the UAE.',
        ar: 'اعمل مع حضور إقليمي في التقنية المالية عبر السعودية والإمارات.',
      },
    },
  ],
  rolesTitle: { en: 'Open positions', ar: 'الوظائف المتاحة' },
  rolesEmptyTitle: { en: 'No open positions right now', ar: 'لا توجد وظائف شاغرة حالياً' },
  rolesEmptyBody: {
    en: 'Check back soon, or send your CV and we will keep it on file.',
    ar: 'عد لاحقاً، أو أرسل سيرتك وسنحتفظ بها.',
  },
  ctaTitle: { en: 'Send us your CV', ar: 'أرسل سيرتك الذاتية' },
  ctaLead: {
    en: 'Tell us about your background and the kind of work you want to do at Tayseer.',
    ar: 'أخبرنا عن خبرتك ونوع العمل الذي تود القيام به في تيسير.',
  },
  ctaMail: { en: 'Email your CV', ar: 'أرسل سيرتك بالبريد' },
  ctaContact: { en: 'Use the contact form', ar: 'استخدم نموذج التواصل' },
} as const;
