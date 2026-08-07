using Microsoft.EntityFrameworkCore;
using Tayseer.Api.Domain;

namespace Tayseer.Api.Data;

public static class ContentSeeder
{
    public static async Task EnsureSeedAsync(AppDbContext db, CancellationToken ct = default)
    {
        if (!await db.ServiceFeatures.AnyAsync(ct))
        {
            db.ServiceFeatures.AddRange(ServiceFeatureSeed.All);
            await db.SaveChangesAsync(ct);
        }

        if (!await db.SiteSettings.AnyAsync(ct))
        {
            db.SiteSettings.AddRange(
                Setting("contact.email", "info@tayseer.me", "info@tayseer.me"),
                Setting("contact.linkedin", "https://www.linkedin.com/company/tayseer-innovations/", "https://www.linkedin.com/company/tayseer-innovations/"),
                Setting("trust.iso", "ISO 27001 Certified", "معتمد ISO 27001"),
                Setting("phone.sa", "+966 555203079", "+966 555203079"),
                Setting("phone.ae", "+971 43997558", "+971 43997558"));
            await db.SaveChangesAsync(ct);
        }


        await ExpandBodiesAsync(db, ct);
    }

    private static SiteSetting Setting(string key, string en, string ar) =>
        new()
        {
            Id = Guid.NewGuid(),
            Key = key,
            ValueEn = en,
            ValueAr = ar,
        };

    private static async Task ExpandBodiesAsync(AppDbContext db, CancellationToken ct)
    {
        var offerings = await db.ServiceOfferings.ToListAsync(ct);
        var changed = false;

        foreach (var s in offerings)
        {
            var (en, ar) = s.Slug switch
            {
                "core-banking" => (
                    "Streamline your Core Banking and unlock innovation. Our platform handles payments, remittance, consumer banking, security, CRM/BI, audit, risk, and treasury — so your teams can focus on customer-centric growth.",
                    "بسّط خدماتك المصرفية الأساسية وافتح باب الابتكار. تغطي منصتنا المدفوعات والتحويلات والخدمات للأفراد والأمن وإدارة العملاء والتحليلات والتدقيق والمخاطر والخزينة — ليركّز فريقك على نمو يضع العميل أولاً."),
                "fahim-ai" => (
                    "Fahim is an Agentic AI platform engineered to manage and optimize end-to-end business operations for defined outcomes and a seamless customer experience. Lightweight, localizable, and deployable on-premise or in containers.",
                    "فهيم منصة ذكاء اصطناعي وكيلية لإدارة وتحسين العمليات من البداية إلى النهاية لتحقيق نتائج محددة وتجربة عملاء سلسة. خفيفة وقابلة للتوطين والنشر محلياً أو عبر الحاويات."),
                "mbuke" => (
                    "MBuke is an AI-powered white-label mobile finance platform for banks, exchange houses, governments, telecoms, and payment gateways — unifying onboarding, transfers, analytics, agent banking, and USSD/offline capability.",
                    "إم بوكي منصة مالية عبر الجوال بعلامتك التجارية مدعومة بالذكاء الاصطناعي للبنوك ودور الصرافة والحكومات والاتصالات وبوابات الدفع — مع توحيد التسجيل والتحويلات والتحليلات والخدمات عبر الوكلاء والعمل دون اتصال."),
                "software-management-systems" => (
                    "Optimize your software lifecycle with version control, development tooling, file management, API integration, and CI/CD built for FinTech delivery teams.",
                    "حسّن دورة حياة برمجياتك بأنظمة التحكم بالإصدارات وأدوات التطوير وإدارة الملفات وتكامل واجهات البرمجة وخطوط CI/CD المصممة لفرق التقنية المالية."),
                "managed-services" => (
                    "Let Tayseer run complex systems with managed T24 Temenos, big data, security, ATM/STM, and IaaS/SaaS operations — so you stay focused on your core business.",
                    "دع تيسير تدير أنظمتك المعقدة عبر خدمات T24 Temenos والبيانات الضخمة والأمن وأجهزة الصراف وSTM وعمليات IaaS/SaaS — لتركّز على جوهر أعمالك."),
                "banking-systems" => (
                    "Partner with Tayseer for GRG Banking systems — ATMs, cash recyclers, smart teller machines, cash sorting, and self-service solutions built for reliability and advanced functionality.",
                    "شارك تيسير لأنظمة GRG Banking — أجهزة الصراف وإعادة تدوير النقد وأجهزة الصراف الذكية وفرز النقد وحلول الخدمة الذاتية الموثوقة والمتقدمة."),
                _ => (s.BodyEn, s.BodyAr),
            };

            if (!string.IsNullOrWhiteSpace(en) && (s.BodyEn is null || s.BodyEn.Length < 120))
            {
                s.BodyEn = en;
                s.BodyAr = ar;
                s.UpdatedAt = DateTimeOffset.UtcNow;
                changed = true;
            }
        }

        if (changed)
        {
            await db.SaveChangesAsync(ct);
        }
    }
}
