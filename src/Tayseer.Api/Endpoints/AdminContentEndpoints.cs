using Microsoft.EntityFrameworkCore;
using Tayseer.Api.Contracts;
using Tayseer.Api.Data;
using Tayseer.Api.Domain;
using Tayseer.Api.Security;

namespace Tayseer.Api.Endpoints;

public static class AdminContentEndpoints
{
    public static RouteGroupBuilder MapAdminContentEndpoints(this IEndpointRouteBuilder app)
    {
        var group = app.MapGroup("/api/v1/admin")
            .WithTags("Admin")
            .RequireAuthorization(AuthPolicies.AdminOnly);

        MapServices(group);
        MapOffices(group);

        return group;
    }

    private static void MapServices(RouteGroupBuilder group)
    {
        group.MapGet("/services", async (AppDbContext db, CancellationToken ct) =>
        {
            var items = await db.ServiceOfferings
                .AsNoTracking()
                .OrderBy(s => s.SortOrder)
                .Select(s => new AdminServiceListItemDto(
                    s.Id,
                    s.Slug,
                    s.TitleEn,
                    s.TitleAr,
                    s.ShortDescriptionEn,
                    s.ShortDescriptionAr,
                    s.IconKey,
                    s.AccentColor,
                    s.SortOrder,
                    s.IsPublished))
                .ToListAsync(ct);

            return Results.Ok(items);
        })
        .WithName("AdminListServices");

        group.MapGet("/services/{id:guid}", async (Guid id, AppDbContext db, CancellationToken ct) =>
        {
            var entity = await db.ServiceOfferings
                .AsNoTracking()
                .Include(s => s.Features)
                .FirstOrDefaultAsync(s => s.Id == id, ct);

            return entity is null ? Results.NotFound() : Results.Ok(ToDetail(entity));
        })
        .WithName("AdminGetService");

        group.MapPost("/services", async (UpsertAdminServiceDto request, AppDbContext db, CancellationToken ct) =>
        {
            var slug = NormalizeSlug(request.Slug);
            if (slug.Length == 0)
            {
                return Results.BadRequest(new ChatErrorDto("Slug is required."));
            }

            if (await db.ServiceOfferings.AnyAsync(s => s.Slug == slug, ct))
            {
                return Results.Conflict(new ChatErrorDto("A service with this slug already exists."));
            }

            var entity = new ServiceOffering
            {
                Id = Guid.NewGuid(),
                Slug = slug,
                TitleEn = request.TitleEn.Trim(),
                TitleAr = request.TitleAr.Trim(),
                ShortDescriptionEn = request.ShortDescriptionEn.Trim(),
                ShortDescriptionAr = request.ShortDescriptionAr.Trim(),
                BodyEn = request.BodyEn,
                BodyAr = request.BodyAr,
                CtaLabelEn = request.CtaLabelEn,
                CtaLabelAr = request.CtaLabelAr,
                CtaUrl = request.CtaUrl,
                IconKey = request.IconKey,
                AccentColor = string.IsNullOrWhiteSpace(request.AccentColor) ? "blue" : request.AccentColor.Trim(),
                SortOrder = request.SortOrder,
                IsPublished = request.IsPublished,
                UpdatedAt = DateTimeOffset.UtcNow,
            };

            ApplyFeatures(entity, request.Features);
            db.ServiceOfferings.Add(entity);
            await db.SaveChangesAsync(ct);

            return Results.Created($"/api/v1/admin/services/{entity.Id}", ToDetail(entity));
        })
        .WithName("AdminCreateService");

        group.MapPut("/services/{id:guid}", async (Guid id, UpsertAdminServiceDto request, AppDbContext db, CancellationToken ct) =>
        {
            var entity = await db.ServiceOfferings
                .Include(s => s.Features)
                .FirstOrDefaultAsync(s => s.Id == id, ct);

            if (entity is null)
            {
                return Results.NotFound();
            }

            var slug = NormalizeSlug(request.Slug);
            if (slug.Length == 0)
            {
                return Results.BadRequest(new ChatErrorDto("Slug is required."));
            }

            if (await db.ServiceOfferings.AnyAsync(s => s.Slug == slug && s.Id != id, ct))
            {
                return Results.Conflict(new ChatErrorDto("A service with this slug already exists."));
            }

            entity.Slug = slug;
            entity.TitleEn = request.TitleEn.Trim();
            entity.TitleAr = request.TitleAr.Trim();
            entity.ShortDescriptionEn = request.ShortDescriptionEn.Trim();
            entity.ShortDescriptionAr = request.ShortDescriptionAr.Trim();
            entity.BodyEn = request.BodyEn;
            entity.BodyAr = request.BodyAr;
            entity.CtaLabelEn = request.CtaLabelEn;
            entity.CtaLabelAr = request.CtaLabelAr;
            entity.CtaUrl = request.CtaUrl;
            entity.IconKey = request.IconKey;
            entity.AccentColor = string.IsNullOrWhiteSpace(request.AccentColor) ? "blue" : request.AccentColor.Trim();
            entity.SortOrder = request.SortOrder;
            entity.IsPublished = request.IsPublished;
            entity.UpdatedAt = DateTimeOffset.UtcNow;

            db.ServiceFeatures.RemoveRange(entity.Features);
            entity.Features.Clear();
            ApplyFeatures(entity, request.Features);

            await db.SaveChangesAsync(ct);
            return Results.Ok(ToDetail(entity));
        })
        .WithName("AdminUpdateService");

        group.MapDelete("/services/{id:guid}", async (Guid id, AppDbContext db, CancellationToken ct) =>
        {
            var entity = await db.ServiceOfferings.FirstOrDefaultAsync(s => s.Id == id, ct);
            if (entity is null)
            {
                return Results.NotFound();
            }

            db.ServiceOfferings.Remove(entity);
            await db.SaveChangesAsync(ct);
            return Results.NoContent();
        })
        .WithName("AdminDeleteService");
    }

    private static void MapOffices(RouteGroupBuilder group)
    {
        group.MapGet("/offices", async (AppDbContext db, CancellationToken ct) =>
        {
            var items = await db.Offices
                .AsNoTracking()
                .OrderBy(o => o.SortOrder)
                .Select(o => new AdminOfficeDto(
                    o.Id,
                    o.CountryCode,
                    o.TitleEn,
                    o.TitleAr,
                    o.AddressEn,
                    o.AddressAr,
                    o.Phone,
                    o.Email,
                    o.SortOrder))
                .ToListAsync(ct);

            return Results.Ok(items);
        })
        .WithName("AdminListOffices");

        group.MapPost("/offices", async (UpsertAdminOfficeDto request, AppDbContext db, CancellationToken ct) =>
        {
            var entity = new Office
            {
                Id = Guid.NewGuid(),
                CountryCode = request.CountryCode.Trim().ToUpperInvariant(),
                TitleEn = request.TitleEn.Trim(),
                TitleAr = request.TitleAr.Trim(),
                AddressEn = request.AddressEn.Trim(),
                AddressAr = request.AddressAr.Trim(),
                Phone = request.Phone,
                Email = request.Email,
                SortOrder = request.SortOrder,
            };

            db.Offices.Add(entity);
            await db.SaveChangesAsync(ct);
            return Results.Created($"/api/v1/admin/offices/{entity.Id}", ToOfficeDto(entity));
        })
        .WithName("AdminCreateOffice");

        group.MapPut("/offices/{id:guid}", async (Guid id, UpsertAdminOfficeDto request, AppDbContext db, CancellationToken ct) =>
        {
            var entity = await db.Offices.FirstOrDefaultAsync(o => o.Id == id, ct);
            if (entity is null)
            {
                return Results.NotFound();
            }

            entity.CountryCode = request.CountryCode.Trim().ToUpperInvariant();
            entity.TitleEn = request.TitleEn.Trim();
            entity.TitleAr = request.TitleAr.Trim();
            entity.AddressEn = request.AddressEn.Trim();
            entity.AddressAr = request.AddressAr.Trim();
            entity.Phone = request.Phone;
            entity.Email = request.Email;
            entity.SortOrder = request.SortOrder;

            await db.SaveChangesAsync(ct);
            return Results.Ok(ToOfficeDto(entity));
        })
        .WithName("AdminUpdateOffice");

        group.MapDelete("/offices/{id:guid}", async (Guid id, AppDbContext db, CancellationToken ct) =>
        {
            var entity = await db.Offices.FirstOrDefaultAsync(o => o.Id == id, ct);
            if (entity is null)
            {
                return Results.NotFound();
            }

            db.Offices.Remove(entity);
            await db.SaveChangesAsync(ct);
            return Results.NoContent();
        })
        .WithName("AdminDeleteOffice");
    }

    private static void ApplyFeatures(ServiceOffering entity, IReadOnlyList<AdminServiceFeatureDto>? features)
    {
        if (features is null)
        {
            return;
        }

        foreach (var feature in features.OrderBy(f => f.SortOrder))
        {
            entity.Features.Add(new ServiceFeature
            {
                Id = feature.Id is { } existing && existing != Guid.Empty ? existing : Guid.NewGuid(),
                ServiceOfferingId = entity.Id,
                TitleEn = feature.TitleEn.Trim(),
                TitleAr = feature.TitleAr.Trim(),
                DescriptionEn = feature.DescriptionEn.Trim(),
                DescriptionAr = feature.DescriptionAr.Trim(),
                SortOrder = feature.SortOrder,
            });
        }
    }

    private static AdminServiceDetailDto ToDetail(ServiceOffering entity) =>
        new(
            entity.Id,
            entity.Slug,
            entity.TitleEn,
            entity.TitleAr,
            entity.ShortDescriptionEn,
            entity.ShortDescriptionAr,
            entity.BodyEn,
            entity.BodyAr,
            entity.CtaLabelEn,
            entity.CtaLabelAr,
            entity.CtaUrl,
            entity.IconKey,
            entity.AccentColor,
            entity.SortOrder,
            entity.IsPublished,
            entity.Features
                .OrderBy(f => f.SortOrder)
                .Select(f => new AdminServiceFeatureDto(
                    f.Id,
                    f.TitleEn,
                    f.TitleAr,
                    f.DescriptionEn,
                    f.DescriptionAr,
                    f.SortOrder))
                .ToList());

    private static AdminOfficeDto ToOfficeDto(Office entity) =>
        new(
            entity.Id,
            entity.CountryCode,
            entity.TitleEn,
            entity.TitleAr,
            entity.AddressEn,
            entity.AddressAr,
            entity.Phone,
            entity.Email,
            entity.SortOrder);

    private static string NormalizeSlug(string? slug) =>
        (slug ?? "")
            .Trim()
            .ToLowerInvariant()
            .Replace(' ', '-');
}
