using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

#pragma warning disable CA1814 // Prefer jagged arrays over multidimensional

namespace Tayseer.Api.Data.Migrations
{
    /// <inheritdoc />
    public partial class InitialCreate : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.CreateTable(
                name: "AdminUsers",
                columns: table => new
                {
                    Id = table.Column<Guid>(type: "uuid", nullable: false),
                    Email = table.Column<string>(type: "character varying(200)", maxLength: 200, nullable: false),
                    DisplayName = table.Column<string>(type: "character varying(120)", maxLength: 120, nullable: false),
                    PasswordHash = table.Column<string>(type: "character varying(500)", maxLength: 500, nullable: false),
                    IsActive = table.Column<bool>(type: "boolean", nullable: false),
                    CreatedAt = table.Column<DateTimeOffset>(type: "timestamp with time zone", nullable: false),
                    LastLoginAt = table.Column<DateTimeOffset>(type: "timestamp with time zone", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_AdminUsers", x => x.Id);
                });

            migrationBuilder.CreateTable(
                name: "ContactInquiries",
                columns: table => new
                {
                    Id = table.Column<Guid>(type: "uuid", nullable: false),
                    Name = table.Column<string>(type: "character varying(120)", maxLength: 120, nullable: false),
                    Email = table.Column<string>(type: "character varying(200)", maxLength: 200, nullable: false),
                    Company = table.Column<string>(type: "character varying(200)", maxLength: 200, nullable: true),
                    Interest = table.Column<string>(type: "character varying(80)", maxLength: 80, nullable: false),
                    Message = table.Column<string>(type: "character varying(4000)", maxLength: 4000, nullable: false),
                    Lang = table.Column<string>(type: "character varying(8)", maxLength: 8, nullable: false),
                    CreatedAt = table.Column<DateTimeOffset>(type: "timestamp with time zone", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_ContactInquiries", x => x.Id);
                });

            migrationBuilder.CreateTable(
                name: "Offices",
                columns: table => new
                {
                    Id = table.Column<Guid>(type: "uuid", nullable: false),
                    CountryCode = table.Column<string>(type: "character varying(80)", maxLength: 80, nullable: false),
                    TitleEn = table.Column<string>(type: "character varying(120)", maxLength: 120, nullable: false),
                    TitleAr = table.Column<string>(type: "character varying(120)", maxLength: 120, nullable: false),
                    AddressEn = table.Column<string>(type: "text", nullable: false),
                    AddressAr = table.Column<string>(type: "text", nullable: false),
                    Phone = table.Column<string>(type: "character varying(40)", maxLength: 40, nullable: true),
                    Email = table.Column<string>(type: "character varying(120)", maxLength: 120, nullable: true),
                    SortOrder = table.Column<int>(type: "integer", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Offices", x => x.Id);
                });

            migrationBuilder.CreateTable(
                name: "Pages",
                columns: table => new
                {
                    Id = table.Column<Guid>(type: "uuid", nullable: false),
                    Slug = table.Column<string>(type: "character varying(120)", maxLength: 120, nullable: false),
                    TitleEn = table.Column<string>(type: "character varying(200)", maxLength: 200, nullable: false),
                    TitleAr = table.Column<string>(type: "character varying(200)", maxLength: 200, nullable: false),
                    MetaDescriptionEn = table.Column<string>(type: "character varying(300)", maxLength: 300, nullable: true),
                    MetaDescriptionAr = table.Column<string>(type: "character varying(300)", maxLength: 300, nullable: true),
                    IsPublished = table.Column<bool>(type: "boolean", nullable: false),
                    UpdatedAt = table.Column<DateTimeOffset>(type: "timestamp with time zone", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Pages", x => x.Id);
                });

            migrationBuilder.CreateTable(
                name: "ServiceOfferings",
                columns: table => new
                {
                    Id = table.Column<Guid>(type: "uuid", nullable: false),
                    Slug = table.Column<string>(type: "character varying(120)", maxLength: 120, nullable: false),
                    IconKey = table.Column<string>(type: "character varying(80)", maxLength: 80, nullable: true),
                    AccentColor = table.Column<string>(type: "character varying(32)", maxLength: 32, nullable: false),
                    SortOrder = table.Column<int>(type: "integer", nullable: false),
                    IsPublished = table.Column<bool>(type: "boolean", nullable: false),
                    TitleEn = table.Column<string>(type: "character varying(200)", maxLength: 200, nullable: false),
                    TitleAr = table.Column<string>(type: "character varying(200)", maxLength: 200, nullable: false),
                    ShortDescriptionEn = table.Column<string>(type: "character varying(500)", maxLength: 500, nullable: false),
                    ShortDescriptionAr = table.Column<string>(type: "character varying(500)", maxLength: 500, nullable: false),
                    BodyEn = table.Column<string>(type: "text", nullable: true),
                    BodyAr = table.Column<string>(type: "text", nullable: true),
                    CtaLabelEn = table.Column<string>(type: "character varying(120)", maxLength: 120, nullable: true),
                    CtaLabelAr = table.Column<string>(type: "character varying(120)", maxLength: 120, nullable: true),
                    CtaUrl = table.Column<string>(type: "character varying(500)", maxLength: 500, nullable: true),
                    UpdatedAt = table.Column<DateTimeOffset>(type: "timestamp with time zone", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_ServiceOfferings", x => x.Id);
                });

            migrationBuilder.CreateTable(
                name: "SiteSettings",
                columns: table => new
                {
                    Id = table.Column<Guid>(type: "uuid", nullable: false),
                    Key = table.Column<string>(type: "character varying(100)", maxLength: 100, nullable: false),
                    ValueEn = table.Column<string>(type: "text", nullable: true),
                    ValueAr = table.Column<string>(type: "text", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_SiteSettings", x => x.Id);
                });

            migrationBuilder.CreateTable(
                name: "AgentConversations",
                columns: table => new
                {
                    Id = table.Column<Guid>(type: "uuid", nullable: false),
                    VisitorKey = table.Column<string>(type: "character varying(64)", maxLength: 64, nullable: false),
                    VisitorName = table.Column<string>(type: "character varying(120)", maxLength: 120, nullable: true),
                    VisitorEmail = table.Column<string>(type: "character varying(200)", maxLength: 200, nullable: true),
                    Lang = table.Column<string>(type: "character varying(8)", maxLength: 8, nullable: false),
                    Status = table.Column<int>(type: "integer", nullable: false),
                    AssignedAdminUserId = table.Column<Guid>(type: "uuid", nullable: true),
                    Subject = table.Column<string>(type: "character varying(200)", maxLength: 200, nullable: true),
                    CreatedAt = table.Column<DateTimeOffset>(type: "timestamp with time zone", nullable: false),
                    UpdatedAt = table.Column<DateTimeOffset>(type: "timestamp with time zone", nullable: false),
                    LastVisitorMessageAt = table.Column<DateTimeOffset>(type: "timestamp with time zone", nullable: true),
                    LastAgentMessageAt = table.Column<DateTimeOffset>(type: "timestamp with time zone", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_AgentConversations", x => x.Id);
                    table.ForeignKey(
                        name: "FK_AgentConversations_AdminUsers_AssignedAdminUserId",
                        column: x => x.AssignedAdminUserId,
                        principalTable: "AdminUsers",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.SetNull);
                });

            migrationBuilder.CreateTable(
                name: "PageSections",
                columns: table => new
                {
                    Id = table.Column<Guid>(type: "uuid", nullable: false),
                    PageId = table.Column<Guid>(type: "uuid", nullable: false),
                    SectionKey = table.Column<string>(type: "character varying(80)", maxLength: 80, nullable: false),
                    SortOrder = table.Column<int>(type: "integer", nullable: false),
                    TitleEn = table.Column<string>(type: "character varying(200)", maxLength: 200, nullable: true),
                    TitleAr = table.Column<string>(type: "character varying(200)", maxLength: 200, nullable: true),
                    BodyEn = table.Column<string>(type: "text", nullable: true),
                    BodyAr = table.Column<string>(type: "text", nullable: true),
                    PayloadJson = table.Column<string>(type: "text", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_PageSections", x => x.Id);
                    table.ForeignKey(
                        name: "FK_PageSections_Pages_PageId",
                        column: x => x.PageId,
                        principalTable: "Pages",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateTable(
                name: "ServiceFeatures",
                columns: table => new
                {
                    Id = table.Column<Guid>(type: "uuid", nullable: false),
                    ServiceOfferingId = table.Column<Guid>(type: "uuid", nullable: false),
                    SortOrder = table.Column<int>(type: "integer", nullable: false),
                    TitleEn = table.Column<string>(type: "character varying(200)", maxLength: 200, nullable: false),
                    TitleAr = table.Column<string>(type: "character varying(200)", maxLength: 200, nullable: false),
                    DescriptionEn = table.Column<string>(type: "text", nullable: false),
                    DescriptionAr = table.Column<string>(type: "text", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_ServiceFeatures", x => x.Id);
                    table.ForeignKey(
                        name: "FK_ServiceFeatures_ServiceOfferings_ServiceOfferingId",
                        column: x => x.ServiceOfferingId,
                        principalTable: "ServiceOfferings",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateTable(
                name: "AgentMessages",
                columns: table => new
                {
                    Id = table.Column<Guid>(type: "uuid", nullable: false),
                    ConversationId = table.Column<Guid>(type: "uuid", nullable: false),
                    Sender = table.Column<int>(type: "integer", nullable: false),
                    Body = table.Column<string>(type: "text", nullable: false),
                    AdminUserId = table.Column<Guid>(type: "uuid", nullable: true),
                    AdminDisplayName = table.Column<string>(type: "character varying(120)", maxLength: 120, nullable: true),
                    CreatedAt = table.Column<DateTimeOffset>(type: "timestamp with time zone", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_AgentMessages", x => x.Id);
                    table.ForeignKey(
                        name: "FK_AgentMessages_AgentConversations_ConversationId",
                        column: x => x.ConversationId,
                        principalTable: "AgentConversations",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.InsertData(
                table: "Offices",
                columns: new[] { "Id", "AddressAr", "AddressEn", "CountryCode", "Email", "Phone", "SortOrder", "TitleAr", "TitleEn" },
                values: new object[,]
                {
                    { new Guid("22222222-2222-2222-2222-222222222201"), "مكتب 7، الطابق الثاني، مبنى سلام، طريق الأمير سعد بن عبدالرحمن الأول الفرعي، الروابي، الرياض، المملكة العربية السعودية", "Office 7, 2nd Floor, Selam Building, Prince Saad bin Abdulrahman Alawal Branch Road, Al Rawabi, Riyadh, Kingdom of Saudi Arabia", "SA", "info@tayseer.me", "+966 555203079", 1, "المملكة العربية السعودية", "Saudi Arabia" },
                    { new Guid("22222222-2222-2222-2222-222222222202"), "601، ون ليك بلازا، الكلستر T، جميرا ليك تاورز، دبي، الإمارات", "601, One Lake Plaza, Cluster T, JLT, Dubai, UAE", "AE", "info@tayseer.me", "+971 43997558", 2, "الإمارات العربية المتحدة", "UAE" }
                });

            migrationBuilder.InsertData(
                table: "ServiceOfferings",
                columns: new[] { "Id", "AccentColor", "BodyAr", "BodyEn", "CtaLabelAr", "CtaLabelEn", "CtaUrl", "IconKey", "IsPublished", "ShortDescriptionAr", "ShortDescriptionEn", "Slug", "SortOrder", "TitleAr", "TitleEn", "UpdatedAt" },
                values: new object[,]
                {
                    { new Guid("11111111-1111-1111-1111-111111111101"), "green", "فهيم منصة ذكاء اصطناعي وكيلية مصممة لإدارة وتحسين العمليات من البداية إلى النهاية لتعزيز تجربة العملاء.", "Fahim is an Agentic AI platform engineered to manage and optimize end-to-end business operations for enhanced customer experience.", "تواصل معنا لعرض تجريبي", "Contact Us for Demo", "/solutions/fahim-ai", "ai", true, "ذكاء يصنع تحولاً في أعمالك", "Intelligence to Revolutionize Your Business", "fahim-ai", 2, "فهيم للذكاء الاصطناعي", "Fahim AI", new DateTimeOffset(new DateTime(2026, 7, 31, 0, 0, 0, 0, DateTimeKind.Unspecified), new TimeSpan(0, 0, 0, 0, 0)) },
                    { new Guid("11111111-1111-1111-1111-111111111102"), "blue", "بسّط أنظمتك المصرفية الأساسية لتوجيه الموارد نحو ابتكار يركز على العميل.", "Streamline your Core Banking so you can dedicate resources to customer-centric innovation.", "اعرف المزيد", "Learn More", "/solutions/core-banking", "core-banking", true, "خدمات مصرفية أساسية للمستقبل ونمو بلا حدود.", "Future-Proof Core Banking. Growth Unleashed.", "core-banking", 1, "الخدمات المصرفية الأساسية", "Core Banking", new DateTimeOffset(new DateTime(2026, 7, 31, 0, 0, 0, 0, DateTimeKind.Unspecified), new TimeSpan(0, 0, 0, 0, 0)) },
                    { new Guid("11111111-1111-1111-1111-111111111103"), "green", "منصة مالية عبر الجوال بعلامتك التجارية مدعومة بالذكاء الاصطناعي مع التسجيل والمدفوعات والتحليلات والعمل دون اتصال.", "AI-powered white-label mobile finance platform with onboarding, payments, analytics, and offline capability.", "تواصل معنا لعرض تجريبي", "Contact Us for Demo", "/solutions/mbuke", "mbuke", true, "منصة خدمات مصرفية عبر الجوال بعلامتك التجارية", "White-Label Mobile Banking Platform", "mbuke", 3, "إم بوكي", "MBuke", new DateTimeOffset(new DateTime(2026, 7, 31, 0, 0, 0, 0, DateTimeKind.Unspecified), new TimeSpan(0, 0, 0, 0, 0)) },
                    { new Guid("11111111-1111-1111-1111-111111111104"), "blue", "دعم خبير لأنظمة T24 Temenos والأمن وأجهزة الصراف وSTMs والبيانات الضخمة والبنية السحابية.", "Expert support for T24 Temenos, security, ATM/STM, big data, and cloud infrastructure.", "تحدث معنا", "Talk To Us", "/solutions/managed-services", "managed", true, "أداء متميز عبر خبرات مُدارة.", "Peak Performance via Managed Expertise.", "managed-services", 5, "الخدمات المُدارة", "Managed Services", new DateTimeOffset(new DateTime(2026, 7, 31, 0, 0, 0, 0, DateTimeKind.Unspecified), new TimeSpan(0, 0, 0, 0, 0)) },
                    { new Guid("11111111-1111-1111-1111-111111111105"), "blue", "إدارة الإصدارات وأدوات التطوير وإدارة الملفات وواجهات البرمجة لفرق التقنية المالية.", "Version control, development tooling, file and API management for FinTech teams.", "اعرف المزيد", "Learn More", "/solutions/software-management-systems", "software", true, "حلول سلسة ونتائج قوية.", "Effortless Solutions. Powerful Results.", "software-management-systems", 4, "أنظمة إدارة البرمجيات", "Software Management Systems", new DateTimeOffset(new DateTime(2026, 7, 31, 0, 0, 0, 0, DateTimeKind.Unspecified), new TimeSpan(0, 0, 0, 0, 0)) },
                    { new Guid("11111111-1111-1111-1111-111111111106"), "blue", "بصفتنا الشريك الرسمي لـ GRGBanking في الإمارات، نوفر وندعم أحدث أجهزة الصراف الآلي وآلات الصراف الذكية (STM) وفرز النقد وأجهزة الخدمة الذاتية المصرفية. يحصل البنك على قنوات موثوقة للفروع والصالات، إضافة إلى أدوات مراقبة وتحقيق مدمجة تساعد على اكتشاف مشكلات الإيداع والأجهزة بشكل أسرع — لتقليص زمن المعالجة المعتاد من أيام إلى ساعات والحفاظ على ثقة العملاء.", "As the official UAE partner for GRGBanking, Tayseer delivers and supports state-of-the-art ATMs, Smart Teller Machines (STMs), cash sorting, and self-service banking hardware. Banks get reliable branch and lobby channels, plus proprietary monitoring and investigation tools that help identify deposit and hardware issues faster — cutting typical resolution timelines from days to hours so customer trust stays intact.", "اعرف المزيد", "Learn More", "/solutions/banking-systems", "banking-systems", true, "الشريك الرسمي لـ GRGBanking في الإمارات — أجهزة صراف وآلات صراف ذكية وأجهزة خدمة ذاتية للبنوك في المنطقة.", "Official UAE partner for GRGBanking — ATMs, smart teller machines, and self-service hardware for banks across the region.", "banking-systems", 6, "حلول GRG Banking", "GRG Banking", new DateTimeOffset(new DateTime(2026, 7, 31, 0, 0, 0, 0, DateTimeKind.Unspecified), new TimeSpan(0, 0, 0, 0, 0)) }
                });

            migrationBuilder.InsertData(
                table: "ServiceFeatures",
                columns: new[] { "Id", "DescriptionAr", "DescriptionEn", "ServiceOfferingId", "SortOrder", "TitleAr", "TitleEn" },
                values: new object[,]
                {
                    { new Guid("33333333-3333-3333-3333-000000000a01"), "بطاقات ومحافظ جوال ومدفوعات عبر التطبيقات بمعالجة آمنة وفعّالة.", "Cards, mobile wallets, and app-based payments with secure, efficient processing.", new Guid("11111111-1111-1111-1111-111111111102"), 1, "المدفوعات", "Payments" },
                    { new Guid("33333333-3333-3333-3333-000000000a02"), "تحويلات مالية محلية ودولية سريعة وآمنة وفعّالة من حيث التكلفة.", "Fast, secure, cost-effective domestic and international money transfers.", new Guid("11111111-1111-1111-1111-111111111102"), 2, "حلول التحويلات", "Remittance Solutions" },
                    { new Guid("33333333-3333-3333-3333-000000000a03"), "وصول حديث للحسابات وخدمات مصرفية عبر الإنترنت والجوال تبقي العملاء متفاعلين.", "Modern account access, online banking, and mobile experiences that keep customers engaged.", new Guid("11111111-1111-1111-1111-111111111102"), 3, "الخدمات المصرفية للأفراد", "Consumer Banking" },
                    { new Guid("33333333-3333-3333-3333-000000000a04"), "ضوابط قوية تلبي اللوائح المتطورة وتحمي النزاهة المالية.", "Robust controls that meet evolving regulations and protect financial integrity.", new Guid("11111111-1111-1111-1111-111111111102"), 4, "الأمن والامتثال", "Security & Compliance" },
                    { new Guid("33333333-3333-3333-3333-000000000a05"), "حوّل بيانات العملاء إلى رؤى قابلة للتنفيذ لقرارات أذكى وولاء أعلى.", "Turn customer data into actionable insights for smarter decisions and loyalty.", new Guid("11111111-1111-1111-1111-111111111102"), 5, "إدارة العملاء والتحليلات", "CRM & BI Systems" },
                    { new Guid("33333333-3333-3333-3333-000000000a06"), "البقاء متوافقاً مع اللوائح وقدرات التدقيق وفق أفضل الممارسات.", "Stay compliant with industry regulations and best-practice audit capabilities.", new Guid("11111111-1111-1111-1111-111111111102"), 6, "التدقيق والتشريعات", "Audit & Legislation" },
                    { new Guid("33333333-3333-3333-3333-000000000a07"), "تحديد وقياس وتخفيف المخاطر التشغيلية والمالية عبر البنك.", "Identify, measure, and mitigate operational and financial risk across the bank.", new Guid("11111111-1111-1111-1111-111111111102"), 7, "إدارة المخاطر", "Risk Management" },
                    { new Guid("33333333-3333-3333-3333-000000000a08"), "عمليات الخزينة والأموال للتحكم في السيولة والتسويات.", "Treasury and funds operations that keep liquidity and settlements under control.", new Guid("11111111-1111-1111-1111-111111111102"), 8, "الأموال والخزينة", "Funds & Treasury" },
                    { new Guid("33333333-3333-3333-3333-000000000b01"), "يفسّر التعليمات بذكاء ثم ينفّذ العمليات من البداية إلى النهاية بدقة وسرعة.", "Interprets instructions intelligently, then executes end-to-end operations with accuracy and speed.", new Guid("11111111-1111-1111-1111-111111111101"), 1, "تنفيذ موجّه بالأهداف", "Goal-Oriented Execution" },
                    { new Guid("33333333-3333-3333-3333-000000000b02"), "تحليل المستندات والتحقق من الأصالة لتسجيل متوافق وسلس.", "Document analysis and authenticity checks for compliant, frictionless onboarding.", new Guid("11111111-1111-1111-1111-111111111101"), 2, "التسجيل الذكي / اعرف عميلك", "Intelligent Onboarding / KYC" },
                    { new Guid("33333333-3333-3333-3333-000000000b03"), "تفاعل شبه بشري مع دعم اللهجات العربية عبر القنوات.", "Human-like interaction with native Arabic dialect support across channels.", new Guid("11111111-1111-1111-1111-111111111101"), 3, "تجربة صوت ودردشة", "Voice & Chat Experience" },
                    { new Guid("33333333-3333-3333-3333-000000000b04"), "نشر محلي أو عبر الحاويات مع قابلية توسع عند الطلب.", "On-premise or containerized deployment with on-demand scalability.", new Guid("11111111-1111-1111-1111-111111111101"), 4, "نشر مرن", "Flexible Deployment" },
                    { new Guid("33333333-3333-3333-3333-000000000b05"), "يتصل بالوحدات الحالية دون تعطيل كبير.", "Connects to existing business modules without major disruption.", new Guid("11111111-1111-1111-1111-111111111101"), 5, "تكامل الأنظمة", "System Integration" },
                    { new Guid("33333333-3333-3333-3333-000000000c01"), "التسجيل والمدفوعات والتحويلات والتحليلات في منصة واحدة بعلامتك.", "Onboarding, payments, transfers, and analytics in one white-label stack.", new Guid("11111111-1111-1111-1111-111111111103"), 1, "منصة موحّدة", "Unified Platform" },
                    { new Guid("33333333-3333-3333-3333-000000000c02"), "الوصول للمجتمعات ضعيفة الاتصال عبر شبكة وكلاء وتدفقات دون اتصال.", "Reach low-connectivity communities with agent networks and offline flows.", new Guid("11111111-1111-1111-1111-111111111103"), 2, "الوكلاء وUSSD", "Agent Banking & USSD" },
                    { new Guid("33333333-3333-3333-3333-000000000c03"), "انشر ما تحتاجه الآن وأضف القدرات مع النمو.", "Deploy what you need now; add capabilities as you grow.", new Guid("11111111-1111-1111-1111-111111111103"), 3, "مرن وقابل للتوسع", "Modular & Scalable" },
                    { new Guid("33333333-3333-3333-3333-000000000c04"), "خدمات مصغّرة وأحداث فورية ومراقبة وضوابط أمنية قوية.", "Microservices, real-time events, observability, and strong security controls.", new Guid("11111111-1111-1111-1111-111111111103"), 4, "أمن مؤسسي", "Enterprise Security" },
                    { new Guid("33333333-3333-3333-3333-000000000c05"), "مراقبة المعاملات وإدارة الوكلاء والامتثال وأدوات التقارير.", "Transaction monitoring, agent management, compliance, and reporting tools.", new Guid("11111111-1111-1111-1111-111111111103"), 5, "لوحات المشغّل", "Operator Dashboards" },
                    { new Guid("33333333-3333-3333-3333-000000000d01"), "مستودعات مركزية وسجل تغييرات وتعاون برمجي بأدوات من فئة Git.", "Central repositories, change history, and collaborative coding with Git-class tooling.", new Guid("11111111-1111-1111-1111-111111111105"), 1, "أنظمة التحكم بالإصدارات", "Version Control Systems" },
                    { new Guid("33333333-3333-3333-3333-000000000d02"), "بيئات تطوير ومصححات وأطر اختبار تسرّع التسليم.", "IDEs, debuggers, and testing frameworks that accelerate delivery.", new Guid("11111111-1111-1111-1111-111111111105"), 2, "أدوات تطوير الجوال والبرمجيات", "Mobile & Software Dev Tools" },
                    { new Guid("33333333-3333-3333-3333-000000000d03"), "تخزين منظّم للكود والأصول وملفات المشاريع مع سجل الإصدارات.", "Organized storage for code, assets, and project files with version history.", new Guid("11111111-1111-1111-1111-111111111105"), 3, "إدارة الملفات", "File Management" },
                    { new Guid("33333333-3333-3333-3333-000000000d04"), "ربط الأنظمة وأتمتة سير العمل وكسر صوامع البيانات.", "Connect systems, automate workflows, and break down data silos.", new Guid("11111111-1111-1111-1111-111111111105"), 4, "إدارة واجهات التكامل", "Integration API Management" },
                    { new Guid("33333333-3333-3333-3333-000000000d05"), "خطوط بناء واختبار وإصدار مؤتمتة لفرق التقنية المالية.", "Automated build, test, and release pipelines for FinTech teams.", new Guid("11111111-1111-1111-1111-111111111105"), 5, "أدوات التكامل والنشر المستمر", "CI/CD Tooling" },
                    { new Guid("33333333-3333-3333-3333-000000000e01"), "إدارة وتحسين الأداء والصيانة المستمرة لنظام T24.", "Administration, performance optimization, and ongoing T24 maintenance.", new Guid("11111111-1111-1111-1111-111111111104"), 1, "إدارة T24 Temenos", "Managed T24 Temenos" },
                    { new Guid("33333333-3333-3333-3333-000000000e02"), "تخزين ومعالجة وتحليل مجموعات بيانات مالية كبيرة ومعقّدة.", "Storage, processing, and analytics for large, complex financial datasets.", new Guid("11111111-1111-1111-1111-111111111104"), 2, "إدارة البيانات الضخمة", "Big Data Management" },
                    { new Guid("33333333-3333-3333-3333-000000000e03"), "مراقبة وكشف تهديدات واستجابة للحوادث للأنظمة الحرجة.", "Monitoring, threat detection, and incident response for critical systems.", new Guid("11111111-1111-1111-1111-111111111104"), 3, "الأمن المُدار", "Managed Security" },
                    { new Guid("33333333-3333-3333-3333-000000000e04"), "صيانة استباقية واستجابة للحوادث لأجهزة النقد والصراف.", "Proactive maintenance and incident response for cash and teller machines.", new Guid("11111111-1111-1111-1111-111111111104"), 4, "إدارة أجهزة الصراف وSTM", "ATM & STM Management" },
                    { new Guid("33333333-3333-3333-3333-000000000e05"), "عمليات سحابية وبنية تحتية تبقي المنصات موثوقة وفعّالة.", "Cloud and infrastructure operations that keep platforms reliable and efficient.", new Guid("11111111-1111-1111-1111-111111111104"), 5, "عمليات IaaS / SaaS", "IaaS / SaaS Operations" },
                    { new Guid("33333333-3333-3333-3333-000000000f01"), "أجهزة صراف وإعادة تدوير GRG للسحب والإيداع ودفع الفواتير وإعادة تدوير النقد على مدار الساعة بشبكات عالية التوافر.", "GRG ATMs and recyclers for 24/7 withdrawals, deposits, bill pay, and cash recycling built for high-availability networks.", new Guid("11111111-1111-1111-1111-111111111106"), 1, "أجهزة الصراف وإعادة تدوير النقد", "ATMs & Cash Recyclers" },
                    { new Guid("33333333-3333-3333-3333-000000000f02"), "خدمة ذاتية بمساعدة بشرية تختصر طوابير الفروع مع الإبقاء على رحلات مصرفية مدعومة.", "Human-assisted self-service that shortens branch queues while keeping assisted banking journeys intact.", new Guid("11111111-1111-1111-1111-111111111106"), 2, "آلات الصراف الذكية (STM)", "Smart Teller Machines (STMs)" },
                    { new Guid("33333333-3333-3333-3333-000000000f03"), "تقنيات دقيقة للعد والفرز والتحقق لضمان عمليات نقد موثوقة في الفروع ومراكز النقد.", "Accurate counting, sorting, and verification technology for reliable cash-ops in branches and cash centres.", new Guid("11111111-1111-1111-1111-111111111106"), 3, "فرز النقد ومعالجة الأوراق", "Cash Sorting & Banknote Handling" },
                    { new Guid("33333333-3333-3333-3333-000000000f04"), "أكشاك للفروع والصالات تتجاوز أجهزة الصراف — خدمات الحسابات والطلبات ورحلات عملاء سلسة.", "Lobby and branch kiosks that extend beyond ATMs — account services, applications, and seamless customer journeys.", new Guid("11111111-1111-1111-1111-111111111106"), 4, "أجهزة الخدمة الذاتية المصرفية", "Self-Service Banking Hardware" },
                    { new Guid("33333333-3333-3333-3333-000000000f05"), "وحدات مراقبة وتحقيق مدمجة تكشف مشكلات الإيداع والأجهزة بسرعة أكبر، مع رؤى في اليوم نفسه ودورات معالجة أقصر.", "In-built monitoring and investigation modules that surface deposit and hardware issues faster, with same-day insight and shorter resolution cycles.", new Guid("11111111-1111-1111-1111-111111111106"), 5, "المراقبة والتحقيق", "Monitoring & Investigation" }
                });

            migrationBuilder.CreateIndex(
                name: "IX_AdminUsers_Email",
                table: "AdminUsers",
                column: "Email",
                unique: true);

            migrationBuilder.CreateIndex(
                name: "IX_AgentConversations_AssignedAdminUserId",
                table: "AgentConversations",
                column: "AssignedAdminUserId");

            migrationBuilder.CreateIndex(
                name: "IX_AgentConversations_Status",
                table: "AgentConversations",
                column: "Status");

            migrationBuilder.CreateIndex(
                name: "IX_AgentConversations_UpdatedAt",
                table: "AgentConversations",
                column: "UpdatedAt");

            migrationBuilder.CreateIndex(
                name: "IX_AgentConversations_VisitorKey",
                table: "AgentConversations",
                column: "VisitorKey",
                unique: true);

            migrationBuilder.CreateIndex(
                name: "IX_AgentMessages_ConversationId_CreatedAt",
                table: "AgentMessages",
                columns: new[] { "ConversationId", "CreatedAt" });

            migrationBuilder.CreateIndex(
                name: "IX_ContactInquiries_CreatedAt",
                table: "ContactInquiries",
                column: "CreatedAt");

            migrationBuilder.CreateIndex(
                name: "IX_Pages_Slug",
                table: "Pages",
                column: "Slug",
                unique: true);

            migrationBuilder.CreateIndex(
                name: "IX_PageSections_PageId",
                table: "PageSections",
                column: "PageId");

            migrationBuilder.CreateIndex(
                name: "IX_ServiceFeatures_ServiceOfferingId",
                table: "ServiceFeatures",
                column: "ServiceOfferingId");

            migrationBuilder.CreateIndex(
                name: "IX_ServiceOfferings_Slug",
                table: "ServiceOfferings",
                column: "Slug",
                unique: true);

            migrationBuilder.CreateIndex(
                name: "IX_SiteSettings_Key",
                table: "SiteSettings",
                column: "Key",
                unique: true);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "AgentMessages");

            migrationBuilder.DropTable(
                name: "ContactInquiries");

            migrationBuilder.DropTable(
                name: "Offices");

            migrationBuilder.DropTable(
                name: "PageSections");

            migrationBuilder.DropTable(
                name: "ServiceFeatures");

            migrationBuilder.DropTable(
                name: "SiteSettings");

            migrationBuilder.DropTable(
                name: "AgentConversations");

            migrationBuilder.DropTable(
                name: "Pages");

            migrationBuilder.DropTable(
                name: "ServiceOfferings");

            migrationBuilder.DropTable(
                name: "AdminUsers");
        }
    }
}
