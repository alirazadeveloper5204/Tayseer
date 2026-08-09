export type AppLocale = 'en' | 'ar';

export interface UiCopy {
  common: {
    loading: string;
    servicesUnavailable: string;
    readMore: string;
    requestDemo: string;
    talkToUs: string;
    talkToTeam: string;
    viewAllServices: string;
    exploreSolutions: string;
    learnMore: string;
    email: string;
    previous: string;
    next: string;
  };
  a11y: {
    primaryNav: string;
    toggleServices: string;
    toggleSolutions: string;
    openMenu: string;
    closeMenu: string;
    switchToArabic: string;
    switchToEnglish: string;
    switchToLight: string;
    switchToDark: string;
    brandHome: string;
    hero: string;
    audience: string;
    sectorFilter: string;
    loading: string;
    linkedIn: string;
  };
  nav: {
    home: string;
    services: string;
    solutions: string;
    caseStudies: string;
    about: string;
    faqs: string;
    careers: string;
    connect: string;
    submitQuery: string;
  };
  home: {
    eyebrow: string;
    headline: string;
    subhead: string;
    servicesEyebrow: string;
    servicesTitle: string;
    servicesSubtitle: string;
    aboutTitle: string;
    aboutLead: string;
    aboutBody: string;
    statsTitle: string;
    whyChooseTitle: string;
    whyChooseSubtitle: string;
    heroVisualKicker: string;
    heroVisualLabel: string;
    journeyEyebrow: string;
    journeyTitle: string;
    journeyLead: string;
    testimonialsEyebrow: string;
    testimonialsTitle: string;
    testimonialsCardTitle: string;
    valuesTitle: string;
    mantraTitle: string;
    mantraLead: string;
    deployTitle: string;
    deployLead: string;
    trustSecurity: string;
  };
  trust: {
    iso: string;
    regions: string;
    since: string;
    focus: string;
    solutions: string;
    cities: string;
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
  chat: {
    eyebrow: string;
    title: string;
    open: string;
    close: string;
    expand: string;
    collapse: string;
    placeholder: string;
    send: string;
    welcome: string;
    error: string;
    offline: string;
    talkToAgent: string;
    agentEyebrow: string;
    agentTitle: string;
    agentPlaceholder: string;
    agentWaiting: string;
    backToFahim: string;
    handoffTitle: string;
    handoffIntro: string;
    handoffNameLabel: string;
    handoffNamePlaceholder: string;
    handoffEmailLabel: string;
    handoffEmailPlaceholder: string;
    handoffSubmit: string;
    handoffConnecting: string;
    handoffCancel: string;
    handoffNameRequired: string;
    handoffEmailInvalid: string;
    handoffConfirm: string;
  };
}

export const UI_COPY: Record<AppLocale, UiCopy> = {
  en: {
    common: {
      loading: 'Loading',
      servicesUnavailable: 'Services are temporarily unavailable. Please try again shortly.',
      readMore: 'Read More',
      requestDemo: 'Request Demo',
      talkToUs: 'Talk To Us',
      talkToTeam: 'Talk to Our Team',
      viewAllServices: 'View All Services',
      exploreSolutions: 'Explore Solutions',
      learnMore: 'Learn more',
      email: 'info@tayseer.me',
      previous: 'Previous',
      next: 'Next',
    },
    a11y: {
      primaryNav: 'Primary',
      toggleServices: 'Toggle services menu',
      toggleSolutions: 'Toggle solutions menu',
      openMenu: 'Open menu',
      closeMenu: 'Close menu',
      switchToArabic: 'Switch to Arabic',
      switchToEnglish: 'Switch to English',
      switchToLight: 'Switch to light mode',
      switchToDark: 'Switch to dark mode',
      brandHome: 'Tayseer Innovations',
      hero: 'Hero',
      audience: 'Audience',
      sectorFilter: 'Sector filter',
      loading: 'Loading',
      linkedIn: 'LinkedIn',
    },
    nav: {
      home: 'Home',
      services: 'Services',
      solutions: 'Solutions',
      caseStudies: 'Case Studies',
      about: 'About Us',
      faqs: 'FAQs',
      careers: 'Careers',
      connect: 'Contact',
      submitQuery: 'Submit A Query',
    },
    home: {
      eyebrow: 'Financial Technology Solutions',
      headline: 'Banking technology you can trust',
      subhead:
        'Core banking, AI, mobile, managed operations — and GRG Banking self-service hardware as the official UAE partner for banks across the region.',
      servicesEyebrow: 'What We Build',
      servicesTitle: 'All Your Business Needs, Covered',
      servicesSubtitle:
        'Six purpose-built solutions for Gulf banks and enterprises — from core banking and AI to mobile and managed operations.',
      aboutTitle: 'About Us',
      aboutLead: 'Born from Innovation, Backed by Strength',
      aboutBody:
        'Established in 2016, Tayseer Innovations emerges as a premier FinTech company in the UAE. We specialize in elevating businesses through advanced financial technology solutions, enhancing financial accessibility and fostering regional growth. As more than just a service provider, we position ourselves as your committed ally in the digital landscape, dedicated to facilitating your journey towards digital excellence.',
      statsTitle: 'Tayseer By Numbers',
      whyChooseTitle: 'Why Choose Tayseer?',
      whyChooseSubtitle: 'Empower your business with innovation and reliability.',
      heroVisualKicker: 'GRG Banking',
      heroVisualLabel: 'Official UAE partner · ATMs & STMs',
      journeyEyebrow: 'Delivery path',
      journeyTitle: 'How a Tayseer engagement progresses',
      journeyLead:
        'One accountable path from discovery to ongoing operations — select a stage to see what happens and what you get.',
      testimonialsEyebrow: 'Testimonials',
      testimonialsTitle: 'What People Say About Us',
      testimonialsCardTitle: 'Work with us',
      valuesTitle: 'Become Future-Ready With Our Cutting Edge Products & Services',
      mantraTitle: 'Our Success Mantra',
      mantraLead: 'How we deliver with banks and enterprises across the region.',
      deployTitle: 'We Pioneer Flexible Technology',
      deployLead:
        'Deploy on your terms — on-site when control and customization come first, or in the cloud when agility and scale matter most.',
      trustSecurity: 'Enterprise-grade security',
    },
    trust: {
      iso: 'ISO 27001 Certified',
      regions: 'Saudi Arabia · UAE',
      since: 'Est. 2016',
      focus: 'Core Banking · AI · GRG Banking',
      solutions: '6 Solutions',
      cities: 'Riyadh & Dubai',
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
    chat: {
      eyebrow: 'Fahim AI',
      title: 'How can we help?',
      open: 'Chat',
      close: 'Close chat',
      expand: 'Expand chat',
      collapse: 'Collapse chat',
      placeholder: 'Ask about our products or services…',
      send: 'Send',
      welcome:
        'Hi — I am Fahim AI, Tayseer’s assistant. Ask me about Core Banking, Fahim AI, MBuke, or how to get in touch.',
      error: 'Something went wrong. Please try again in a moment.',
      offline: 'Cannot reach the chat service. Is the API and Ollama running?',
      talkToAgent: 'Talk to an agent',
      agentEyebrow: 'Tayseer Support',
      agentTitle: 'Live agent chat',
      agentPlaceholder: 'Message the agent…',
      agentWaiting: 'Connected to an agent. Replies appear here in real time.',
      backToFahim: 'Back to Fahim AI',
      handoffTitle: 'Connect with an agent',
      handoffIntro: 'Please share your name and email so our team can follow up.',
      handoffNameLabel: 'Name',
      handoffNamePlaceholder: 'Your full name',
      handoffEmailLabel: 'Email',
      handoffEmailPlaceholder: 'you@company.com',
      handoffSubmit: 'Start chat',
      handoffConnecting: 'Connecting…',
      handoffCancel: 'Cancel',
      handoffNameRequired: 'Please enter your name.',
      handoffEmailInvalid: 'Please enter a valid email address.',
      handoffConfirm:
        'Of course — I’ll connect you with a Tayseer agent. Please share your name and email to continue.',
    },
  },
  ar: {
    common: {
      loading: 'جاري التحميل',
      servicesUnavailable: 'الخدمات غير متاحة مؤقتاً. يرجى المحاولة مرة أخرى قريباً.',
      readMore: 'اقرأ المزيد',
      requestDemo: 'اطلب عرضاً توضيحياً',
      talkToUs: 'تحدث معنا',
      talkToTeam: 'تحدث مع فريقنا',
      viewAllServices: 'عرض جميع الخدمات',
      exploreSolutions: 'استكشف الحلول',
      learnMore: 'اعرف المزيد',
      email: 'info@tayseer.me',
      previous: 'السابق',
      next: 'التالي',
    },
    a11y: {
      primaryNav: 'القائمة الرئيسية',
      toggleServices: 'تبديل قائمة الخدمات',
      toggleSolutions: 'تبديل قائمة الحلول',
      openMenu: 'فتح القائمة',
      closeMenu: 'إغلاق القائمة',
      switchToArabic: 'التبديل إلى العربية',
      switchToEnglish: 'التبديل إلى الإنجليزية',
      switchToLight: 'التبديل إلى الوضع الفاتح',
      switchToDark: 'التبديل إلى الوضع الداكن',
      brandHome: 'تيسير إنوفيشنز',
      hero: 'القسم الرئيسي',
      audience: 'الجمهور',
      sectorFilter: 'تصفية حسب القطاع',
      loading: 'جاري التحميل',
      linkedIn: 'لينكدإن',
    },
    nav: {
      home: 'الرئيسية',
      services: 'الخدمات',
      solutions: 'الحلول',
      caseStudies: 'دراسات الحالة',
      about: 'من نحن',
      faqs: 'الأسئلة الشائعة',
      careers: 'الوظائف',
      connect: 'تواصل معنا',
      submitQuery: 'أرسل استفساراً',
    },
    home: {
      eyebrow: 'حلول التقنية المالية',
      headline: 'تقنية مصرفية يمكن الوثوق بها',
      subhead:
        'أنظمة مصرفية أساسية وذكاء اصطناعي وجوال وعمليات مُدارة — مع أجهزة GRG Banking للخدمة الذاتية كشريك رسمي في الإمارات للبنوك في المنطقة.',
      servicesEyebrow: 'ما نقدمه',
      servicesTitle: 'نغطي جميع احتياجات أعمالك',
      servicesSubtitle:
        'ستة حلول مصممة للبنوك والمؤسسات في الخليج — من الخدمات المصرفية الأساسية والذكاء الاصطناعي إلى الجوال والعمليات المُدارة.',
      aboutTitle: 'من نحن',
      aboutLead: 'من رحم الابتكار، وبدعم من القوة',
      aboutBody:
        'تأسست تيسير للابتكارات عام 2016 كشركة تقنية مالية رائدة في الإمارات. نتخصص في الارتقاء بالأعمال عبر حلول تقنية مالية متقدمة، وتعزيز الوصول المالي ودعم النمو الإقليمي. لسنا مجرد مزود خدمة، بل شريك ملتزم في رحلتكم نحو التميز الرقمي.',
      statsTitle: 'تيسير بالأرقام',
      whyChooseTitle: 'لماذا تيسير؟',
      whyChooseSubtitle: 'مكّن أعمالك بالابتكار والموثوقية.',
      heroVisualKicker: 'GRG Banking',
      heroVisualLabel: 'الشريك الرسمي في الإمارات · أجهزة صراف وSTM',
      journeyEyebrow: 'مسار التسليم',
      journeyTitle: 'كيف تتقدّم شراكتك مع تيسير',
      journeyLead:
        'مسار واحد واضح من الاكتشاف إلى التشغيل المستمر — اختر مرحلة لترى ماذا يحدث وما الذي تحصل عليه.',
      testimonialsEyebrow: 'آراء العملاء',
      testimonialsTitle: 'ماذا يقول عملاؤنا عنا',
      testimonialsCardTitle: 'اعمل معنا',
      valuesTitle: 'كن مستعداً للمستقبل مع منتجاتنا وخدماتنا المتطورة',
      mantraTitle: 'شعار نجاحنا',
      mantraLead: 'كيف نعمل مع البنوك والمؤسسات في المنطقة.',
      deployTitle: 'نقود تقنية مرنة',
      deployLead:
        'انشر وفق شروطك — في الموقع عندما تكون السيطرة والتخصيص أولاً، أو على السحابة عندما تكون المرونة والتوسع هما الأولوية.',
      trustSecurity: 'أمن بمستوى المؤسسات',
    },
    trust: {
      iso: 'معتمد ISO 27001',
      regions: 'السعودية · الإمارات',
      since: 'تأسست 2016',
      focus: 'الخدمات المصرفية · الذكاء الاصطناعي · GRG Banking',
      solutions: '6 حلول',
      cities: 'الرياض ودبي',
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
    chat: {
      eyebrow: 'فهيم للذكاء الاصطناعي',
      title: 'كيف يمكننا مساعدتك؟',
      open: 'محادثة',
      close: 'إغلاق المحادثة',
      expand: 'توسيع المحادثة',
      collapse: 'تصغير المحادثة',
      placeholder: 'اسأل عن منتجاتنا أو خدماتنا…',
      send: 'إرسال',
      welcome:
        'مرحباً — أنا فهيم، مساعد تيسير. اسألني عن الخدمات المصرفية الأساسية أو فهيم أو إم بوكي أو كيفية التواصل معنا.',
      error: 'حدث خطأ. حاول مرة أخرى بعد قليل.',
      offline: 'تعذر الوصول إلى خدمة المحادثة. هل الـ API و Ollama يعملان؟',
      talkToAgent: 'تحدث مع وكيل',
      agentEyebrow: 'دعم تيسير',
      agentTitle: 'محادثة مع وكيل',
      agentPlaceholder: 'اكتب رسالة للوكيل…',
      agentWaiting: 'أنت متصل بوكيل. ستظهر الردود هنا مباشرة.',
      backToFahim: 'العودة إلى فهيم',
      handoffTitle: 'التواصل مع وكيل',
      handoffIntro: 'يرجى إدخال اسمك وبريدك الإلكتروني حتى يتمكن فريقنا من المتابعة معك.',
      handoffNameLabel: 'الاسم',
      handoffNamePlaceholder: 'اسمك الكامل',
      handoffEmailLabel: 'البريد الإلكتروني',
      handoffEmailPlaceholder: 'you@company.com',
      handoffSubmit: 'بدء المحادثة',
      handoffConnecting: 'جاري الاتصال…',
      handoffCancel: 'إلغاء',
      handoffNameRequired: 'يرجى إدخال اسمك.',
      handoffEmailInvalid: 'يرجى إدخال بريد إلكتروني صالح.',
      handoffConfirm:
        'بالتأكيد — سأوصلك بأحد ممثلي تيسير. يرجى إدخال اسمك وبريدك الإلكتروني للمتابعة.',
    },
  },
};


export const HOME_KPI_STATS = [
  {
    value: 14,
    decimals: 0,
    prefix: '',
    suffix: '+',
    labelEn: 'Banking Clients',
    labelAr: 'عملاء مصرفيون',
  },
  {
    value: 99.98,
    decimals: 2,
    prefix: '',
    suffix: '%',
    labelEn: 'Uptime SLA',
    labelAr: 'جاهزية الخدمة',
  },
  {
    value: 2.4,
    decimals: 1,
    prefix: '$',
    suffix: 'B',
    labelEn: 'Transactions Processed',
    labelAr: 'معاملات مُعالجة',
  },
  {
    value: 18,
    decimals: 0,
    prefix: '',
    suffix: '+',
    labelEn: 'Years in Gulf Banking',
    labelAr: 'سنوات في الخدمات المصرفية الخليجية',
  },
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

export const HOME_WHY_FEATURES = [
  {
    icon: 'experience',
    titleEn: 'Enhanced Customer Experience',
    titleAr: 'تجربة عملاء محسّنة',
    bodyEn: 'Deliver intuitive digital journeys that keep banking customers engaged and loyal.',
    bodyAr: 'قدّم رحلات رقمية بديهية تبقي عملاء الخدمات المصرفية متفاعلين ومخلصين.',
  },
  {
    icon: 'data',
    titleEn: 'Data Driven Decision Making',
    titleAr: 'قرارات مبنية على البيانات',
    bodyEn: 'Turn live operational data into clearer decisions across products, risk, and growth.',
    bodyAr: 'حوّل البيانات التشغيلية المباشرة إلى قرارات أوضح عبر المنتجات والمخاطر والنمو.',
  },
  {
    icon: 'security',
    titleEn: 'Robust Fraud Detection',
    titleAr: 'كشف احتيال قوي',
    bodyEn: 'Protect every transaction with layered controls built for Gulf banking environments.',
    bodyAr: 'احمِ كل معاملة بضوابط متعددة الطبقات مصممة للبيئة المصرفية الخليجية.',
  },
  {
    icon: 'operations',
    titleEn: 'Streamlined Operations',
    titleAr: 'عمليات مبسّطة',
    bodyEn: 'Reduce manual work and unify delivery so teams move faster with fewer handoffs.',
    bodyAr: 'قلّل العمل اليدوي ووحّد التسليم حتى تتحرك الفرق أسرع وبعدد أقل من التمريرات.',
  },
  {
    icon: 'personal',
    titleEn: 'Personalized Customer Strategies',
    titleAr: 'استراتيجيات عملاء مخصصة',
    bodyEn: 'Tailor offers and journeys with insights that match each customer segment.',
    bodyAr: 'خصّص العروض والرحلات برؤى تناسب كل شريحة من العملاء.',
  },
  {
    icon: 'support',
    titleEn: 'Expert Support',
    titleAr: 'دعم متخصص',
    bodyEn: 'Dedicated specialists stay with you from implementation through ongoing success.',
    bodyAr: 'يبقى المختصون معكم من التنفيذ حتى النجاح المستمر.',
  },
] as const;

export const HOME_JOURNEY = [
  {
    titleEn: 'Discover',
    titleAr: 'اكتشاف',
    outcomeEn: 'Shared brief & priorities',
    outcomeAr: 'موجز وأولويات مشتركة',
    bodyEn:
      'Workshops with your stakeholders to capture goals, regulatory constraints, systems in scope, and what success must look like before any build starts.',
    bodyAr:
      'ورش عمل مع أصحاب المصلحة لديكم لتحديد الأهداف والقيود التنظيمية والأنظمة ضمن النطاق، وما يعنيه النجاح قبل بدء أي بناء.',
  },
  {
    titleEn: 'Design',
    titleAr: 'تصميم',
    outcomeEn: 'Architecture & delivery plan',
    outcomeAr: 'بنية وخطة تسليم',
    bodyEn:
      'We translate the brief into a solution blueprint — architecture, controls, integrations, risks, and a staged plan your teams can approve with confidence.',
    bodyAr:
      'نحوّل الموجز إلى مخطط حل — البنية والضوابط والتكاملات والمخاطر وخطة مرحلية يمكن لفرقكم اعتمادها بثقة.',
  },
  {
    titleEn: 'Build',
    titleAr: 'بناء',
    outcomeEn: 'Working product increments',
    outcomeAr: 'زيادات منتج جاهزة',
    bodyEn:
      'Implementation and integration move in transparent checkpoints. You see progress early, validate quality continuously, and avoid late surprises.',
    bodyAr:
      'يمضي التنفيذ والتكامل عبر نقاط متابعة شفافة. ترون التقدّم مبكراً وتتحققون من الجودة باستمرار وتتجنبون المفاجآت المتأخرة.',
  },
  {
    titleEn: 'Launch',
    titleAr: 'إطلاق',
    outcomeEn: 'Controlled go-live',
    outcomeAr: 'إطلاق مضبوط',
    bodyEn:
      'Rehearsed cutover, readiness checks, and training so go-live is calm, measurable, and owned jointly by Tayseer and your operations teams.',
    bodyAr:
      'قطع مُختبر وفحوصات جاهزية وتدريب ليكون الإطلاق هادئاً وقابلاً للقياس ومملوكاً بشكل مشترك بين تيسير وفرق التشغيل لديكم.',
  },
  {
    titleEn: 'Grow',
    titleAr: 'نمو',
    outcomeEn: 'Operate & improve',
    outcomeAr: 'تشغيل وتحسين',
    bodyEn:
      'After go-live we stay accountable — monitoring, support, optimisation, and roadmap iteration so the platform keeps matching how your bank evolves.',
    bodyAr:
      'بعد الإطلاق نبقى مسؤولين — مراقبة ودعم وتحسين وتطوير خارطة الطريق حتى تبقى المنصة مواكبة لتطور مصرفكم.',
  },
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

export const HOME_HERO_SEGMENTS = [
  { en: 'Banks', ar: 'البنوك' },
  { en: 'Islamic Finance', ar: 'التمويل الإسلامي' },
  { en: 'Fintechs', ar: 'شركات التقنية المالية' },
] as const;

export const HOME_HERO_PROOF = [
  {
    icon: 'shield',
    titleEn: 'ISO 27001 certified',
    titleAr: 'معتمد ISO 27001',
    detailEn: 'Information security management',
    detailAr: 'إدارة أمن المعلومات',
  },
  {
    icon: 'grg',
    titleEn: 'GRG Banking partner',
    titleAr: 'شريك GRG Banking',
    detailEn: 'Official UAE ATM & STM partner',
    detailAr: 'الشريك الرسمي لأجهزة الصراف وSTM في الإمارات',
  },
  {
    icon: 'deploy',
    titleEn: 'On-site or cloud',
    titleAr: 'في الموقع أو على السحابة',
    detailEn: 'Deploy on your terms',
    detailAr: 'انشر وفق شروطك',
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
  { slug: 'banking-systems', titleEn: 'GRG Banking', titleAr: 'حلول GRG Banking' },
] as const;


export const SERVICE_LINKS = [
  {
    slug: 'core',
    titleEn: 'Core Banking Integration',
    titleAr: 'تكامل الأنظمة المصرفية الأساسية',
    href: 'services#core',
  },
  {
    slug: 'payments',
    titleEn: 'Payment Gateway APIs',
    titleAr: 'واجهات بوابات الدفع',
    href: 'services#payments',
  },
  {
    slug: 'wallets',
    titleEn: 'Digital Wallets',
    titleAr: 'المحافظ الرقمية',
    href: 'services#wallets',
  },
  {
    slug: 'open',
    titleEn: 'Open Banking',
    titleAr: 'الخدمات المصرفية المفتوحة',
    href: 'services#open',
  },
  {
    slug: 'software-development',
    titleEn: 'Software Development',
    titleAr: 'تطوير البرمجيات',
    href: 'software-development',
  },
  {
    slug: 'managed-services',
    titleEn: 'Managed Services',
    titleAr: 'الخدمات المُدارة',
    href: 'managed-services',
  },
] as const;
