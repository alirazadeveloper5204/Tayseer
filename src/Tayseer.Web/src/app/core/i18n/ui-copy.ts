export type AppLocale = 'en' | 'ar';

export interface UiCopy {
  common: {
    loading: string;
    readMore: string;
    requestDemo: string;
    talkToUs: string;
    viewAllServices: string;
    email: string;
    previous: string;
    next: string;
  };
  nav: {
    home: string;
    solutions: string;
    about: string;
    blog: string;
    careers: string;
    connect: string;
    submitQuery: string;
  };
  home: {
    eyebrow: string;
    headline: string;
    subhead: string;
    servicesTitle: string;
    servicesSubtitle: string;
    aboutTitle: string;
    aboutLead: string;
    aboutBody: string;
    statsTitle: string;
    testimonialsTitle: string;
    valuesTitle: string;
    mantraTitle: string;
    deployTitle: string;
  };
  trust: {
    iso: string;
    regions: string;
    since: string;
    focus: string;
  };
  footer: {
    tagline: string;
    ourServices: string;
    quickLinks: string;
    contactUs: string;
    rights: string;
    privacy: string;
    terms: string;
    linkedIn: string;
  };
}

export const UI_COPY: Record<AppLocale, UiCopy> = {
  en: {
    common: {
      loading: 'Loading',
      readMore: 'Read More',
      requestDemo: 'Request Demo',
      talkToUs: 'Talk To Us',
      viewAllServices: 'View All Services',
      email: 'info@tayseer.me',
      previous: 'Previous',
      next: 'Next',
    },
    nav: {
      home: 'Home',
      solutions: 'Solutions',
      about: 'About Us',
      blog: 'Blogs and Resources',
      careers: 'Careers',
      connect: 'Connect',
      submitQuery: 'Submit A Query',
    },
    home: {
      eyebrow: 'Future-ready FinTech',
      headline: 'Innovative approach',
      subhead:
        'Future-ready AI & Digital Solutions for banks and enterprises across Saudi Arabia and the UAE.',
      servicesTitle: 'Future-ready AI & Digital Solutions',
      servicesSubtitle: 'We Have All Your Business Needs Covered',
      aboutTitle: 'About Us',
      aboutLead: 'Born from Innovation, Backed by Strength',
      aboutBody:
        'Established in 2016, Tayseer Innovations emerges as a premier FinTech company in the UAE. We specialize in elevating businesses through advanced financial technology solutions, enhancing financial accessibility and fostering regional growth. As more than just a service provider, we position ourselves as your committed ally in the digital landscape, dedicated to facilitating your journey towards digital excellence.',
      statsTitle: 'Tayseer By Numbers',
      testimonialsTitle: 'Our Client Speak',
      valuesTitle: 'Become Future-Ready With Our Cutting Edge Products & Services',
      mantraTitle: 'Our Success Mantra',
      deployTitle: 'We Pioneer Flexible Technology',
    },
    trust: {
      iso: 'ISO 27001 Certified',
      regions: 'Saudi Arabia · UAE',
      since: 'Est. 2016',
      focus: 'Core Banking · AI · Mobile',
    },
    footer: {
      tagline:
        'Tayseer is a premier fintech company based in Saudi Arabia and the UAE with an aim to spearhead the AI and digital banking revolution in the region.',
      ourServices: 'Our Service',
      quickLinks: 'Quick Links',
      contactUs: 'Contact Us',
      rights: '© Tayseer Innovations. All Rights Reserved.',
      privacy: 'Privacy Policy',
      terms: 'Terms & Conditions',
      linkedIn: 'LinkedIn',
    },
  },
  ar: {
    common: {
      loading: 'جاري التحميل',
      readMore: 'اقرأ المزيد',
      requestDemo: 'اطلب عرضاً توضيحياً',
      talkToUs: 'تحدث معنا',
      viewAllServices: 'عرض جميع الخدمات',
      email: 'info@tayseer.me',
      previous: 'السابق',
      next: 'التالي',
    },
    nav: {
      home: 'الرئيسية',
      solutions: 'الحلول',
      about: 'من نحن',
      blog: 'المدونة والموارد',
      careers: 'الوظائف',
      connect: 'تواصل معنا',
      submitQuery: 'أرسل استفساراً',
    },
    home: {
      eyebrow: 'تقنية مالية للمستقبل',
      headline: 'نهج مبتكر',
      subhead: 'حلول ذكاء اصطناعي ورقمية للبنوك والمؤسسات في المملكة العربية السعودية والإمارات.',
      servicesTitle: 'حلول ذكاء اصطناعي ورقمية للمستقبل',
      servicesSubtitle: 'نغطي جميع احتياجات أعمالك',
      aboutTitle: 'من نحن',
      aboutLead: 'من رحم الابتكار، وبدعم من القوة',
      aboutBody:
        'تأسست تيسير للابتكارات عام 2016 كشركة تقنية مالية رائدة في الإمارات. نتخصص في الارتقاء بالأعمال عبر حلول تقنية مالية متقدمة، وتعزيز الوصول المالي ودعم النمو الإقليمي. لسنا مجرد مزود خدمة، بل شريك ملتزم في رحلتكم نحو التميز الرقمي.',
      statsTitle: 'تيسير بالأرقام',
      testimonialsTitle: 'آراء عملائنا',
      valuesTitle: 'كن مستعداً للمستقبل مع منتجاتنا وخدماتنا المتطورة',
      mantraTitle: 'شعار نجاحنا',
      deployTitle: 'نقود تقنية مرنة',
    },
    trust: {
      iso: 'معتمد ISO 27001',
      regions: 'السعودية · الإمارات',
      since: 'تأسست 2016',
      focus: 'الخدمات المصرفية · الذكاء الاصطناعي · الجوال',
    },
    footer: {
      tagline:
        'تيسير شركة تقنية مالية رائدة في السعودية والإمارات تهدف إلى قيادة ثورة الذكاء الاصطناعي والخدمات المصرفية الرقمية في المنطقة.',
      ourServices: 'خدماتنا',
      quickLinks: 'روابط سريعة',
      contactUs: 'تواصل معنا',
      rights: '© تيسير للابتكارات. جميع الحقوق محفوظة.',
      privacy: 'سياسة الخصوصية',
      terms: 'الشروط والأحكام',
      linkedIn: 'لينكدإن',
    },
  },
};

export const HOME_STATS = [
  { value: 100, suffix: '+', labelEn: 'Satisfied Clients', labelAr: 'عملاء راضون' },
  { value: 15, suffix: '+', labelEn: 'Countries', labelAr: 'دول' },
  { value: 600, suffix: '+', labelEn: 'Finished Products', labelAr: 'منتجات مكتملة' },
  { value: 100, suffix: '+', labelEn: 'Skilled Experts', labelAr: 'خبراء مهرة' },
] as const;

export const HOME_TESTIMONIALS = [
  {
    name: 'Saber Alkahtani',
    roleEn: 'Head of Individual Services Sector',
    roleAr: 'رئيس قطاع الخدمات الفردية',
    quoteEn:
      'Tayseer Innovations has been a key partner in driving growth and innovation within our individual banking services. Their solutions empower us to stay ahead of the curve and cater to the evolving needs of our customers.',
    quoteAr:
      'كانت تيسير شريكاً أساسياً في دفع النمو والابتكار ضمن خدماتنا المصرفية للأفراد. حلولهم تمكّننا من البقاء في الطليعة وتلبية احتياجات عملائنا المتجددة.',
  },
  {
    name: 'Abdulla Alttowi',
    roleEn: 'Manager – R&D',
    roleAr: 'مدير البحث والتطوير',
    quoteEn:
      'By partnering with Tayseer Innovations, our bank is well-positioned for the future. Their innovative FinTech solutions provide a robust foundation for continuous improvement and adaptation within the ever-evolving financial landscape.',
    quoteAr:
      'بالشراكة مع تيسير، أصبح بنكنا في موقع قوي للمستقبل. حلولهم المبتكرة توفر أساساً متيناً للتحسين المستمر والتكيّف مع المشهد المالي المتغير.',
  },
  {
    name: 'Bassma Alzailay',
    roleEn: 'Development & Systems Analyst Manager',
    roleAr: 'مديرة تطوير وتحليل الأنظمة',
    quoteEn:
      'Tayseer Innovations developed a user-friendly and intuitive software application for our customers. The app has been a huge hit, and our customer satisfaction ratings have soared since its launch.',
    quoteAr:
      'طورت تيسير تطبيقاً سهلاً وبديهياً لعملائنا. حقق التطبيق نجاحاً كبيراً وارتفعت تقييمات رضا العملاء منذ إطلاقه.',
  },
  {
    name: 'Amd Ali',
    roleEn: 'IT Sector Manager',
    roleAr: 'مدير قطاع تقنية المعلومات',
    quoteEn:
      'The scalable products and services from Tayseer Innovations have seamlessly adapted to our evolving needs, proving essential to our growth. Their dedicated support team has been pivotal not only in smooth implementation but also as a partner in our ongoing success.',
    quoteAr:
      'تكيّفت منتجات وخدمات تيسير القابلة للتوسع بسلاسة مع احتياجاتنا المتغيرة وأصبحت أساسية لنمونا. فريق الدعم لديهم شريك محوري في التنفيذ والنجاح المستمر.',
  },
] as const;

export const HOME_VALUES = [
  { titleEn: 'Enhanced Customer Experience', titleAr: 'تجربة عملاء محسّنة' },
  { titleEn: 'Data Driven Decision Making', titleAr: 'قرارات مبنية على البيانات' },
  { titleEn: 'Robust Fraud Detection', titleAr: 'كشف احتيال قوي' },
  { titleEn: 'Streamlined Operations', titleAr: 'عمليات مبسّطة' },
  { titleEn: 'Personalized Customer Strategies', titleAr: 'استراتيجيات عملاء مخصصة' },
] as const;

export const HOME_MANTRA = [
  {
    titleEn: 'Dedicated One Project, One Team',
    titleAr: 'مشروع واحد، فريق واحد',
    bodyEn: 'Our team focuses exclusively on your business success.',
    bodyAr: 'يركز فريقنا حصرياً على نجاح أعمالكم.',
  },
  {
    titleEn: 'Complete Transparency',
    titleAr: 'شفافية كاملة',
    bodyEn: 'Daily updates and direct communication with all key team members.',
    bodyAr: 'تحديثات يومية وتواصل مباشر مع جميع أعضاء الفريق الرئيسيين.',
  },
  {
    titleEn: 'Consistent Quality',
    titleAr: 'جودة ثابتة',
    bodyEn: 'Polished and tailored business-ready products and services.',
    bodyAr: 'منتجات وخدمات مصقولة ومصممة لتكون جاهزة للأعمال.',
  },
] as const;

export const HOME_DEPLOY = [
  {
    titleEn: 'On-Site Deployment',
    titleAr: 'نشر في الموقع',
    bodyEn:
      'A traditional approach for those who prioritize control & customization with seamless integration.',
    bodyAr: 'نهج تقليدي لمن يفضّل السيطرة والتخصيص مع تكامل سلس.',
  },
  {
    titleEn: 'Cloud Deployment',
    titleAr: 'نشر سحابي',
    bodyEn: 'Designed for agility, scalability, cost-effectiveness and enhanced operational efficiency.',
    bodyAr: 'مصمم للمرونة وقابلية التوسع وكفاءة التكلفة وتحسين العمليات.',
  },
] as const;

export const SOLUTION_LINKS = [
  { slug: 'core-banking', titleEn: 'Core Banking', titleAr: 'الخدمات المصرفية الأساسية' },
  { slug: 'fahim-ai', titleEn: 'Fahim AI', titleAr: 'فهيم للذكاء الاصطناعي' },
  { slug: 'mbuke', titleEn: 'MBuke', titleAr: 'إم بوكي' },
  {
    slug: 'software-management-systems',
    titleEn: 'Software Management Systems',
    titleAr: 'أنظمة إدارة البرمجيات',
  },
  { slug: 'managed-services', titleEn: 'Managed Services', titleAr: 'الخدمات المُدارة' },
  { slug: 'banking-systems', titleEn: 'Banking Systems', titleAr: 'الأنظمة المصرفية' },
] as const;
