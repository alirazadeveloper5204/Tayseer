using Microsoft.EntityFrameworkCore;
using Tayseer.Api.Domain;

namespace Tayseer.Api.Data;

public class AppDbContext(DbContextOptions<AppDbContext> options) : DbContext(options)
{
    public DbSet<ServiceOffering> ServiceOfferings => Set<ServiceOffering>();
    public DbSet<ServiceFeature> ServiceFeatures => Set<ServiceFeature>();
    public DbSet<Page> Pages => Set<Page>();
    public DbSet<PageSection> PageSections => Set<PageSection>();
    public DbSet<SiteSetting> SiteSettings => Set<SiteSetting>();
    public DbSet<Office> Offices => Set<Office>();

    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        modelBuilder.Entity<ServiceOffering>(entity =>
        {
            entity.HasIndex(x => x.Slug).IsUnique();
            entity.Property(x => x.Slug).IsRequired();
            entity.HasMany(x => x.Features)
                .WithOne(x => x.ServiceOffering)
                .HasForeignKey(x => x.ServiceOfferingId)
                .OnDelete(DeleteBehavior.Cascade);
        });

        modelBuilder.Entity<Page>(entity =>
        {
            entity.HasIndex(x => x.Slug).IsUnique();
            entity.HasMany(x => x.Sections)
                .WithOne(x => x.Page)
                .HasForeignKey(x => x.PageId)
                .OnDelete(DeleteBehavior.Cascade);
        });

        modelBuilder.Entity<SiteSetting>(entity =>
        {
            entity.HasIndex(x => x.Key).IsUnique();
        });

        SeedServices(modelBuilder);
        SeedOffices(modelBuilder);
        modelBuilder.Entity<ServiceFeature>().HasData(ServiceFeatureSeed.All);
    }

    private static void SeedServices(ModelBuilder modelBuilder)
    {
        var fahimId = Guid.Parse("11111111-1111-1111-1111-111111111101");
        var now = new DateTimeOffset(2026, 7, 31, 0, 0, 0, TimeSpan.Zero);

        modelBuilder.Entity<ServiceOffering>().HasData(
            new ServiceOffering
            {
                Id = fahimId,
                Slug = "fahim-ai",
                IconKey = "ai",
                AccentColor = "green",
                SortOrder = 2,
                IsPublished = true,
                TitleEn = "Fahim AI",
                TitleAr = "فهيم للذكاء الاصطناعي",
                ShortDescriptionEn = "Intelligence to Revolutionize Your Business",
                ShortDescriptionAr = "ذكاء يصنع تحولاً في أعمالك",
                BodyEn = "Fahim is an Agentic AI platform engineered to manage and optimize end-to-end business operations for enhanced customer experience.",
                BodyAr = "فهيم منصة ذكاء اصطناعي وكيلية مصممة لإدارة وتحسين العمليات من البداية إلى النهاية لتعزيز تجربة العملاء.",
                CtaLabelEn = "Contact Us for Demo",
                CtaLabelAr = "تواصل معنا لعرض تجريبي",
                CtaUrl = "/solutions/fahim-ai",
                UpdatedAt = now
            },
            new ServiceOffering
            {
                Id = Guid.Parse("11111111-1111-1111-1111-111111111102"),
                Slug = "core-banking",
                IconKey = "core-banking",
                AccentColor = "blue",
                SortOrder = 1,
                IsPublished = true,
                TitleEn = "Core Banking",
                TitleAr = "الخدمات المصرفية الأساسية",
                ShortDescriptionEn = "Future-Proof Core Banking. Growth Unleashed.",
                ShortDescriptionAr = "خدمات مصرفية أساسية للمستقبل ونمو بلا حدود.",
                BodyEn = "Streamline your Core Banking so you can dedicate resources to customer-centric innovation.",
                BodyAr = "بسّط أنظمتك المصرفية الأساسية لتوجيه الموارد نحو ابتكار يركز على العميل.",
                CtaLabelEn = "Learn More",
                CtaLabelAr = "اعرف المزيد",
                CtaUrl = "/solutions/core-banking",
                UpdatedAt = now
            },
            new ServiceOffering
            {
                Id = Guid.Parse("11111111-1111-1111-1111-111111111103"),
                Slug = "mbuke",
                IconKey = "mbuke",
                AccentColor = "green",
                SortOrder = 3,
                IsPublished = true,
                TitleEn = "MBuke",
                TitleAr = "إم بوكي",
                ShortDescriptionEn = "White-Label Mobile Banking Platform",
                ShortDescriptionAr = "منصة خدمات مصرفية عبر الجوال بعلامتك التجارية",
                BodyEn = "AI-powered white-label mobile finance platform with onboarding, payments, analytics, and offline capability.",
                BodyAr = "منصة مالية عبر الجوال بعلامتك التجارية مدعومة بالذكاء الاصطناعي مع التسجيل والمدفوعات والتحليلات والعمل دون اتصال.",
                CtaLabelEn = "Contact Us for Demo",
                CtaLabelAr = "تواصل معنا لعرض تجريبي",
                CtaUrl = "/solutions/mbuke",
                UpdatedAt = now
            },
            new ServiceOffering
            {
                Id = Guid.Parse("11111111-1111-1111-1111-111111111104"),
                Slug = "managed-services",
                IconKey = "managed",
                AccentColor = "blue",
                SortOrder = 5,
                IsPublished = true,
                TitleEn = "Managed Services",
                TitleAr = "الخدمات المُدارة",
                ShortDescriptionEn = "Peak Performance via Managed Expertise.",
                ShortDescriptionAr = "أداء متميز عبر خبرات مُدارة.",
                BodyEn = "Expert support for T24 Temenos, security, ATM/STM, big data, and cloud infrastructure.",
                BodyAr = "دعم خبير لأنظمة T24 Temenos والأمن وأجهزة الصراف وSTMs والبيانات الضخمة والبنية السحابية.",
                CtaLabelEn = "Talk To Us",
                CtaLabelAr = "تحدث معنا",
                CtaUrl = "/solutions/managed-services",
                UpdatedAt = now
            },
            new ServiceOffering
            {
                Id = Guid.Parse("11111111-1111-1111-1111-111111111105"),
                Slug = "software-management-systems",
                IconKey = "software",
                AccentColor = "blue",
                SortOrder = 4,
                IsPublished = true,
                TitleEn = "Software Management Systems",
                TitleAr = "أنظمة إدارة البرمجيات",
                ShortDescriptionEn = "Effortless Solutions. Powerful Results.",
                ShortDescriptionAr = "حلول سلسة ونتائج قوية.",
                BodyEn = "Version control, development tooling, file and API management for FinTech teams.",
                BodyAr = "إدارة الإصدارات وأدوات التطوير وإدارة الملفات وواجهات البرمجة لفرق التقنية المالية.",
                CtaLabelEn = "Learn More",
                CtaLabelAr = "اعرف المزيد",
                CtaUrl = "/solutions/software-management-systems",
                UpdatedAt = now
            },
            new ServiceOffering
            {
                Id = Guid.Parse("11111111-1111-1111-1111-111111111106"),
                Slug = "banking-systems",
                IconKey = "banking-systems",
                AccentColor = "blue",
                SortOrder = 6,
                IsPublished = true,
                TitleEn = "Banking Systems",
                TitleAr = "الأنظمة المصرفية",
                ShortDescriptionEn = "Experience Next-Gen Banking with GRG Banking",
                ShortDescriptionAr = "تجربة مصرفية من الجيل التالي مع GRG Banking",
                BodyEn = "GRG ATMs, smart teller machines, cash sorting, and self-service solutions.",
                BodyAr = "أجهزة صراف GRG وأجهزة الصراف الذكية وفرز النقد وحلول الخدمة الذاتية.",
                CtaLabelEn = "Learn More",
                CtaLabelAr = "اعرف المزيد",
                CtaUrl = "/solutions/banking-systems",
                UpdatedAt = now
            });
    }

    private static void SeedOffices(ModelBuilder modelBuilder)
    {
        modelBuilder.Entity<Office>().HasData(
            new Office
            {
                Id = Guid.Parse("22222222-2222-2222-2222-222222222201"),
                CountryCode = "SA",
                TitleEn = "Saudi Arabia",
                TitleAr = "المملكة العربية السعودية",
                AddressEn = "Office 7, 2nd Floor, Selam Building, Prince Saad bin Abdulrahman Alawal Branch Road, Al Rawabi, Riyadh, Kingdom of Saudi Arabia",
                AddressAr = "مكتب 7، الطابق الثاني، مبنى سلام، طريق الأمير سعد بن عبدالرحمن الأول الفرعي، الروابي، الرياض، المملكة العربية السعودية",
                Phone = "+966 555203079",
                Email = "info@tayseer.me",
                SortOrder = 1
            },
            new Office
            {
                Id = Guid.Parse("22222222-2222-2222-2222-222222222202"),
                CountryCode = "AE",
                TitleEn = "UAE",
                TitleAr = "الإمارات العربية المتحدة",
                AddressEn = "601, One Lake Plaza, Cluster T, JLT, Dubai, UAE",
                AddressAr = "601، ون ليك بلازا، الكلستر T، جميرا ليك تاورز، دبي، الإمارات",
                Phone = "+971 43997558",
                Email = "info@tayseer.me",
                SortOrder = 2
            });
    }
}
