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
  eyebrow: { en: 'Enterprise Leadership', ar: 'قيادة المؤسسات' },
  title: { en: 'About Tayseer Innovations', ar: 'عن تيسير إنوفيشنز' },
  lead: {
    en: 'Born from innovation and backed by strength — building future-ready banking technology across Saudi Arabia and the UAE since 2016.',
    ar: 'وُلدنا من الابتكار وندعمكم بالقوة — نبني تقنيات مصرفية مستقبلية في السعودية والإمارات منذ 2016.',
  },
  missionTitle: { en: 'Mission', ar: 'المهمة' },
  mission: {
    en: 'Accelerate digital excellence for banks and enterprises with trusted AI, core platforms, and managed operations.',
    ar: 'تسريع التميز الرقمي للبنوك والمؤسسات عبر الذكاء الاصطناعي والمنصات الأساسية والعمليات المدارة.',
  },
  timelineTitle: { en: 'Our Journey', ar: 'رحلتنا' },
  timeline: [
    { year: '2016', text: { en: 'Founded in the UAE with a Gulf banking focus.', ar: 'تأسست في الإمارات بتركيز على الخدمات المصرفية الخليجية.' } },
    { year: '2019', text: { en: 'Expanded core banking and payments programs region-wide.', ar: 'توسيع برامج الأنظمة المصرفية والمدفوعات على مستوى المنطقة.' } },
    { year: '2022', text: { en: 'Launched Fahim.AI and mobile delivery frameworks.', ar: 'إطلاق فهيم.AI وأطر التسليم عبر الجوال.' } },
    { year: '2026', text: { en: 'Enterprise managed SOC and open banking accelerators.', ar: 'SOC مُدار للمؤسسات ومسرّعات الخدمات المصرفية المفتوحة.' } },
  ],
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
      img: '/images/about-thumb-1.jpg',
      links: [
        { label: { en: 'LinkedIn', ar: 'لينكدإن' }, href: 'https://www.linkedin.com/' },
      ],
    },
    {
      id: 'omar',
      name: { en: 'Omar Haddad', ar: 'عمر حداد' },
      role: { en: 'Chief Technology Officer', ar: 'رئيس التقنية' },
      img: '/images/about-thumb-2.jpg',
      links: [
        { label: { en: 'LinkedIn', ar: 'لينكدإن' }, href: 'https://www.linkedin.com/' },
      ],
    },
    {
      id: 'sara',
      name: { en: 'Sara Nasser', ar: 'سارة ناصر' },
      role: { en: 'Head of Delivery', ar: 'رئيسة التسليم' },
      img: '/images/about-thumb-3.jpg',
      links: [
        { label: { en: 'LinkedIn', ar: 'لينكدإن' }, href: 'https://www.linkedin.com/' },
      ],
    },
    {
      id: 'khalid',
      name: { en: 'Khalid Rahman', ar: 'خالد رحمن' },
      role: { en: 'Head of Security', ar: 'رئيس الأمن' },
      img: '/images/gallery-meeting.jpg',
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
  eyebrow: { en: 'Enterprise Inquiries', ar: 'استفسارات المؤسسات' },
  title: { en: 'Schedule a Demo', ar: 'جدولة عرض توضيحي' },
  lead: {
    en: 'Tell us about your banking or enterprise program — we respond within one business day.',
    ar: 'أخبرنا عن برنامجك المصرفي أو المؤسسي — نرد خلال يوم عمل واحد.',
  },
  steps: [
    { en: 'About You', ar: 'عنك' },
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
      city: { en: 'Riyadh', ar: 'الرياض' },
      detail: { en: 'Kingdom of Saudi Arabia', ar: 'المملكة العربية السعودية' },
      phone: '+966 11 000 0000',
      map: '/images/thumb-skyline.jpg',
    },
    {
      city: { en: 'Dubai', ar: 'دبي' },
      detail: { en: 'United Arab Emirates', ar: 'الإمارات العربية المتحدة' },
      phone: '+971 4 000 0000',
      map: '/images/thumb-dubai.jpg',
    },
  ],
  mapTitle: { en: 'Interactive Map — GCC coverage', ar: 'خريطة تفاعلية — تغطية الخليج' },
  errors: {
    name: { en: 'Please enter your full name.', ar: 'يرجى إدخال الاسم الكامل.' },
    email: { en: 'Enter a valid work email.', ar: 'أدخل بريداً مهنياً صالحاً.' },
    interest: { en: 'Select an interest area.', ar: 'اختر مجال الاهتمام.' },
    message: { en: 'Tell us briefly how we can help.', ar: 'أخبرنا باختصار كيف يمكننا المساعدة.' },
  },
} as const;
