using Microsoft.EntityFrameworkCore;
using Tayseer.Api.Data;

namespace Tayseer.Api.Services.Rag;

public sealed class CmsKnowledgeBuilder(AppDbContext db)
{
    public async Task<IReadOnlyList<KnowledgeChunk>> BuildAsync(CancellationToken ct)
    {
        var chunks = new List<KnowledgeChunk>();

        chunks.Add(new KnowledgeChunk(
            Id: "company:overview:en",
            SourceType: "company",
            SourceKey: "overview",
            Language: "en",
            Title: "About Tayseer Innovations",
            Content: """
                Tayseer Innovations is a FinTech company founded in 2016, operating in Saudi Arabia and the UAE.
                Focus areas: core banking, AI (Fahim AI), mobile banking (MBuke), software management systems,
                managed services, and banking hardware systems (including GRG).
                Contact email: info@tayseer.me. Website: tayseer.me.
                ISO 27001 certified. Regions: Saudi Arabia and UAE.
                """));

        chunks.Add(new KnowledgeChunk(
            Id: "company:overview:ar",
            SourceType: "company",
            SourceKey: "overview",
            Language: "ar",
            Title: "عن تيسير للابتكارات",
            Content: """
                تيسير للابتكارات شركة تقنية مالية تأسست عام 2016 وتعمل في السعودية والإمارات.
                مجالات التركيز: الخدمات المصرفية الأساسية، الذكاء الاصطناعي (فهيم)، الخدمات المصرفية عبر الجوال (إم بوكي)،
                أنظمة إدارة البرمجيات، الخدمات المُدارة، والأنظمة المصرفية والأجهزة (بما فيها GRG).
                البريد: info@tayseer.me — الموقع: tayseer.me.
                معتمدة ISO 27001. المناطق: السعودية والإمارات.
                """));

        var services = await db.ServiceOfferings
            .AsNoTracking()
            .Include(s => s.Features)
            .Where(s => s.IsPublished)
            .OrderBy(s => s.SortOrder)
            .ToListAsync(ct);

        foreach (var service in services)
        {
            var featuresEn = string.Join(
                "\n",
                service.Features
                    .OrderBy(f => f.SortOrder)
                    .Select(f => $"- {f.TitleEn}: {f.DescriptionEn}"));

            var featuresAr = string.Join(
                "\n",
                service.Features
                    .OrderBy(f => f.SortOrder)
                    .Select(f => $"- {f.TitleAr}: {f.DescriptionAr}"));

            chunks.Add(new KnowledgeChunk(
                Id: $"service:{service.Slug}:en",
                SourceType: "service",
                SourceKey: service.Slug,
                Language: "en",
                Title: service.TitleEn,
                Content: $"""
                    Product: {service.TitleEn}
                    Slug: {service.Slug}
                    Summary: {service.ShortDescriptionEn}
                    Details: {service.BodyEn}
                    Features:
                    {featuresEn}
                    CTA: {service.CtaLabelEn} → {service.CtaUrl}
                    """));

            chunks.Add(new KnowledgeChunk(
                Id: $"service:{service.Slug}:ar",
                SourceType: "service",
                SourceKey: service.Slug,
                Language: "ar",
                Title: service.TitleAr,
                Content: $"""
                    المنتج: {service.TitleAr}
                    المعرّف: {service.Slug}
                    الملخص: {service.ShortDescriptionAr}
                    التفاصيل: {service.BodyAr}
                    الميزات:
                    {featuresAr}
                    دعوة للإجراء: {service.CtaLabelAr} → {service.CtaUrl}
                    """));

            foreach (var feature in service.Features.OrderBy(f => f.SortOrder))
            {
                chunks.Add(new KnowledgeChunk(
                    Id: $"feature:{service.Slug}:{feature.SortOrder}:en",
                    SourceType: "feature",
                    SourceKey: $"{service.Slug}:{feature.SortOrder}",
                    Language: "en",
                    Title: $"{service.TitleEn} — {feature.TitleEn}",
                    Content: $"""
                        Product: {service.TitleEn} ({service.Slug})
                        Feature: {feature.TitleEn}
                        Description: {feature.DescriptionEn}
                        """));

                chunks.Add(new KnowledgeChunk(
                    Id: $"feature:{service.Slug}:{feature.SortOrder}:ar",
                    SourceType: "feature",
                    SourceKey: $"{service.Slug}:{feature.SortOrder}",
                    Language: "ar",
                    Title: $"{service.TitleAr} — {feature.TitleAr}",
                    Content: $"""
                        المنتج: {service.TitleAr} ({service.Slug})
                        الميزة: {feature.TitleAr}
                        الوصف: {feature.DescriptionAr}
                        """));
            }
        }

        var offices = await db.Offices
            .AsNoTracking()
            .OrderBy(o => o.SortOrder)
            .ToListAsync(ct);

        foreach (var office in offices)
        {
            chunks.Add(new KnowledgeChunk(
                Id: $"office:{office.CountryCode}:en",
                SourceType: "office",
                SourceKey: office.CountryCode,
                Language: "en",
                Title: $"Office — {office.TitleEn}",
                Content: $"""
                    Office: {office.TitleEn} ({office.CountryCode})
                    Address: {office.AddressEn}
                    Phone: {office.Phone}
                    Email: {office.Email}
                    """));

            chunks.Add(new KnowledgeChunk(
                Id: $"office:{office.CountryCode}:ar",
                SourceType: "office",
                SourceKey: office.CountryCode,
                Language: "ar",
                Title: $"مكتب — {office.TitleAr}",
                Content: $"""
                    المكتب: {office.TitleAr} ({office.CountryCode})
                    العنوان: {office.AddressAr}
                    الهاتف: {office.Phone}
                    البريد: {office.Email}
                    """));
        }

        return chunks;
    }
}
