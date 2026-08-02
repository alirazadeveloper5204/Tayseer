using Microsoft.EntityFrameworkCore;
using Tayseer.Api.Contracts;
using Tayseer.Api.Data;

namespace Tayseer.Api.Endpoints;

public static class PublicContentEndpoints
{
    public static RouteGroupBuilder MapPublicContentEndpoints(this IEndpointRouteBuilder app)
    {
        var group = app.MapGroup("/api/v1").WithTags("Public");

        group.MapGet("/services", async (string? lang, AppDbContext db, CancellationToken ct) =>
        {
            var isAr = IsArabic(lang);
            var items = await db.ServiceOfferings
                .AsNoTracking()
                .Where(s => s.IsPublished)
                .OrderBy(s => s.SortOrder)
                .Select(s => new ServiceListItemDto(
                    s.Slug,
                    isAr ? s.TitleAr : s.TitleEn,
                    isAr ? s.ShortDescriptionAr : s.ShortDescriptionEn,
                    s.IconKey,
                    s.AccentColor,
                    s.CtaUrl))
                .ToListAsync(ct);

            return Results.Ok(items);
        })
        .WithName("ListServices");

        group.MapGet("/services/{slug}", async (string slug, string? lang, AppDbContext db, CancellationToken ct) =>
        {
            var isAr = IsArabic(lang);
            var entity = await db.ServiceOfferings
                .AsNoTracking()
                .Include(s => s.Features)
                .FirstOrDefaultAsync(s => s.Slug == slug && s.IsPublished, ct);

            if (entity is null)
            {
                return Results.NotFound();
            }

            var features = entity.Features
                .OrderBy(f => f.SortOrder)
                .Select(f => new ServiceFeatureDto(
                    isAr ? f.TitleAr : f.TitleEn,
                    isAr ? f.DescriptionAr : f.DescriptionEn,
                    f.SortOrder))
                .ToList();

            var dto = new ServiceDto(
                entity.Slug,
                isAr ? entity.TitleAr : entity.TitleEn,
                isAr ? entity.ShortDescriptionAr : entity.ShortDescriptionEn,
                isAr ? entity.BodyAr : entity.BodyEn,
                isAr ? entity.CtaLabelAr : entity.CtaLabelEn,
                entity.CtaUrl,
                entity.IconKey,
                entity.AccentColor,
                features);

            return Results.Ok(dto);
        })
        .WithName("GetServiceBySlug");

        group.MapGet("/offices", async (string? lang, AppDbContext db, CancellationToken ct) =>
        {
            var isAr = IsArabic(lang);
            var items = await db.Offices
                .AsNoTracking()
                .OrderBy(o => o.SortOrder)
                .Select(o => new OfficeDto(
                    o.CountryCode,
                    isAr ? o.TitleAr : o.TitleEn,
                    isAr ? o.AddressAr : o.AddressEn,
                    o.Phone,
                    o.Email))
                .ToListAsync(ct);

            return Results.Ok(items);
        })
        .WithName("ListOffices");

        return group;
    }

    private static bool IsArabic(string? lang) =>
        string.Equals(lang, "ar", StringComparison.OrdinalIgnoreCase);
}
