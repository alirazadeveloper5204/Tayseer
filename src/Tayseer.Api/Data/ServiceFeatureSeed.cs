using Tayseer.Api.Domain;

namespace Tayseer.Api.Data;

/// <summary>Feature blocks scraped from tayseer.me product pages.</summary>
public static class ServiceFeatureSeed
{
    private static readonly DateTimeOffset Now = new(2026, 7, 31, 0, 0, 0, TimeSpan.Zero);

    public static readonly Guid CoreId = Guid.Parse("11111111-1111-1111-1111-111111111102");
    public static readonly Guid FahimId = Guid.Parse("11111111-1111-1111-1111-111111111101");
    public static readonly Guid MbukeId = Guid.Parse("11111111-1111-1111-1111-111111111103");
    public static readonly Guid SoftwareId = Guid.Parse("11111111-1111-1111-1111-111111111105");
    public static readonly Guid ManagedId = Guid.Parse("11111111-1111-1111-1111-111111111104");
    public static readonly Guid BankingId = Guid.Parse("11111111-1111-1111-1111-111111111106");

    public static ServiceFeature[] All { get; } =
    [
        // Core Banking
        F(CoreId, 1, "a01", "Payments", "المدفوعات",
            "Cards, mobile wallets, and app-based payments with secure, efficient processing.",
            "بطاقات ومحافظ جوال ومدفوعات عبر التطبيقات بمعالجة آمنة وفعّالة."),
        F(CoreId, 2, "a02", "Remittance Solutions", "حلول التحويلات",
            "Fast, secure, cost-effective domestic and international money transfers.",
            "تحويلات مالية محلية ودولية سريعة وآمنة وفعّالة من حيث التكلفة."),
        F(CoreId, 3, "a03", "Consumer Banking", "الخدمات المصرفية للأفراد",
            "Modern account access, online banking, and mobile experiences that keep customers engaged.",
            "وصول حديث للحسابات وخدمات مصرفية عبر الإنترنت والجوال تبقي العملاء متفاعلين."),
        F(CoreId, 4, "a04", "Security & Compliance", "الأمن والامتثال",
            "Robust controls that meet evolving regulations and protect financial integrity.",
            "ضوابط قوية تلبي اللوائح المتطورة وتحمي النزاهة المالية."),
        F(CoreId, 5, "a05", "CRM & BI Systems", "إدارة العملاء والتحليلات",
            "Turn customer data into actionable insights for smarter decisions and loyalty.",
            "حوّل بيانات العملاء إلى رؤى قابلة للتنفيذ لقرارات أذكى وولاء أعلى."),
        F(CoreId, 6, "a06", "Audit & Legislation", "التدقيق والتشريعات",
            "Stay compliant with industry regulations and best-practice audit capabilities.",
            "البقاء متوافقاً مع اللوائح وقدرات التدقيق وفق أفضل الممارسات."),
        F(CoreId, 7, "a07", "Risk Management", "إدارة المخاطر",
            "Identify, measure, and mitigate operational and financial risk across the bank.",
            "تحديد وقياس وتخفيف المخاطر التشغيلية والمالية عبر البنك."),
        F(CoreId, 8, "a08", "Funds & Treasury", "الأموال والخزينة",
            "Treasury and funds operations that keep liquidity and settlements under control.",
            "عمليات الخزينة والأموال للتحكم في السيولة والتسويات."),

        // Fahim AI
        F(FahimId, 1, "b01", "Goal-Oriented Execution", "تنفيذ موجّه بالأهداف",
            "Interprets instructions intelligently, then executes end-to-end operations with accuracy and speed.",
            "يفسّر التعليمات بذكاء ثم ينفّذ العمليات من البداية إلى النهاية بدقة وسرعة."),
        F(FahimId, 2, "b02", "Intelligent Onboarding / KYC", "التسجيل الذكي / اعرف عميلك",
            "Document analysis and authenticity checks for compliant, frictionless onboarding.",
            "تحليل المستندات والتحقق من الأصالة لتسجيل متوافق وسلس."),
        F(FahimId, 3, "b03", "Voice & Chat Experience", "تجربة صوت ودردشة",
            "Human-like interaction with native Arabic dialect support across channels.",
            "تفاعل شبه بشري مع دعم اللهجات العربية عبر القنوات."),
        F(FahimId, 4, "b04", "Flexible Deployment", "نشر مرن",
            "On-premise or containerized deployment with on-demand scalability.",
            "نشر محلي أو عبر الحاويات مع قابلية توسع عند الطلب."),
        F(FahimId, 5, "b05", "System Integration", "تكامل الأنظمة",
            "Connects to existing business modules without major disruption.",
            "يتصل بالوحدات الحالية دون تعطيل كبير."),

        // MBuke
        F(MbukeId, 1, "c01", "Unified Platform", "منصة موحّدة",
            "Onboarding, payments, transfers, and analytics in one white-label stack.",
            "التسجيل والمدفوعات والتحويلات والتحليلات في منصة واحدة بعلامتك."),
        F(MbukeId, 2, "c02", "Agent Banking & USSD", "الوكلاء وUSSD",
            "Reach low-connectivity communities with agent networks and offline flows.",
            "الوصول للمجتمعات ضعيفة الاتصال عبر شبكة وكلاء وتدفقات دون اتصال."),
        F(MbukeId, 3, "c03", "Modular & Scalable", "مرن وقابل للتوسع",
            "Deploy what you need now; add capabilities as you grow.",
            "انشر ما تحتاجه الآن وأضف القدرات مع النمو."),
        F(MbukeId, 4, "c04", "Enterprise Security", "أمن مؤسسي",
            "Microservices, real-time events, observability, and strong security controls.",
            "خدمات مصغّرة وأحداث فورية ومراقبة وضوابط أمنية قوية."),
        F(MbukeId, 5, "c05", "Operator Dashboards", "لوحات المشغّل",
            "Transaction monitoring, agent management, compliance, and reporting tools.",
            "مراقبة المعاملات وإدارة الوكلاء والامتثال وأدوات التقارير."),

        // Software Management
        F(SoftwareId, 1, "d01", "Version Control Systems", "أنظمة التحكم بالإصدارات",
            "Central repositories, change history, and collaborative coding with Git-class tooling.",
            "مستودعات مركزية وسجل تغييرات وتعاون برمجي بأدوات من فئة Git."),
        F(SoftwareId, 2, "d02", "Mobile & Software Dev Tools", "أدوات تطوير الجوال والبرمجيات",
            "IDEs, debuggers, and testing frameworks that accelerate delivery.",
            "بيئات تطوير ومصححات وأطر اختبار تسرّع التسليم."),
        F(SoftwareId, 3, "d03", "File Management", "إدارة الملفات",
            "Organized storage for code, assets, and project files with version history.",
            "تخزين منظّم للكود والأصول وملفات المشاريع مع سجل الإصدارات."),
        F(SoftwareId, 4, "d04", "Integration API Management", "إدارة واجهات التكامل",
            "Connect systems, automate workflows, and break down data silos.",
            "ربط الأنظمة وأتمتة سير العمل وكسر صوامع البيانات."),
        F(SoftwareId, 5, "d05", "CI/CD Tooling", "أدوات التكامل والنشر المستمر",
            "Automated build, test, and release pipelines for FinTech teams.",
            "خطوط بناء واختبار وإصدار مؤتمتة لفرق التقنية المالية."),

        // Managed Services
        F(ManagedId, 1, "e01", "Managed T24 Temenos", "إدارة T24 Temenos",
            "Administration, performance optimization, and ongoing T24 maintenance.",
            "إدارة وتحسين الأداء والصيانة المستمرة لنظام T24."),
        F(ManagedId, 2, "e02", "Big Data Management", "إدارة البيانات الضخمة",
            "Storage, processing, and analytics for large, complex financial datasets.",
            "تخزين ومعالجة وتحليل مجموعات بيانات مالية كبيرة ومعقّدة."),
        F(ManagedId, 3, "e03", "Managed Security", "الأمن المُدار",
            "Monitoring, threat detection, and incident response for critical systems.",
            "مراقبة وكشف تهديدات واستجابة للحوادث للأنظمة الحرجة."),
        F(ManagedId, 4, "e04", "ATM & STM Management", "إدارة أجهزة الصراف وSTM",
            "Proactive maintenance and incident response for cash and teller machines.",
            "صيانة استباقية واستجابة للحوادث لأجهزة النقد والصراف."),
        F(ManagedId, 5, "e05", "IaaS / SaaS Operations", "عمليات IaaS / SaaS",
            "Cloud and infrastructure operations that keep platforms reliable and efficient.",
            "عمليات سحابية وبنية تحتية تبقي المنصات موثوقة وفعّالة."),

        // Banking Systems (GRG)
        F(BankingId, 1, "f01", "ATMs & Cash Recyclers", "أجهزة الصراف وإعادة تدوير النقد",
            "24/7 cash access with withdrawals, deposits, bill pay, and recycling.",
            "وصول نقدي على مدار الساعة مع السحب والإيداع ودفع الفواتير وإعادة التدوير."),
        F(BankingId, 2, "f02", "Smart Teller Machines", "أجهزة الصراف الذكية",
            "Human-assisted automation that cuts branch wait times.",
            "أتمتة بمساعدة بشرية تقلل أوقات الانتظار في الفروع."),
        F(BankingId, 3, "f03", "Cash Sorting Machines", "آلات فرز النقد",
            "Accurate counting, sorting, and verification of notes and coins.",
            "عدّ وفرز وتحقق دقيق للأوراق النقدية والعملات."),
        F(BankingId, 4, "f04", "Self-Service Solutions", "حلول الخدمة الذاتية",
            "Kiosks for account management, applications, and more beyond ATMs.",
            "أكشاك لإدارة الحسابات والطلبات وأكثر خارج أجهزة الصراف."),
        F(BankingId, 5, "f05", "Banknote Handling", "معالجة الأوراق النقدية",
            "Advanced note processing technology for reliable branch cash ops.",
            "تقنيات متقدمة لمعالجة الأوراق النقدية لعمليات نقد موثوقة في الفروع."),
    ];

    private static ServiceFeature F(
        Guid serviceId,
        int order,
        string idSuffix,
        string titleEn,
        string titleAr,
        string descEn,
        string descAr) =>
        new()
        {
            // Last GUID segment must be exactly 12 hex digits (e.g. a01 → 000000000a01).
            Id = Guid.Parse($"33333333-3333-3333-3333-{idSuffix.PadLeft(12, '0')}"),
            ServiceOfferingId = serviceId,
            SortOrder = order,
            TitleEn = titleEn,
            TitleAr = titleAr,
            DescriptionEn = descEn,
            DescriptionAr = descAr,
        };
}
