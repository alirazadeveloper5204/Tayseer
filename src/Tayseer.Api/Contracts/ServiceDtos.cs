namespace Tayseer.Api.Contracts;

public record ServiceFeatureDto(string Title, string Description, int SortOrder);

public record ServiceDto(
    string Slug,
    string Title,
    string ShortDescription,
    string? Body,
    string? CtaLabel,
    string? CtaUrl,
    string? IconKey,
    string Accent,
    IReadOnlyList<ServiceFeatureDto> Features);

public record ServiceListItemDto(
    string Slug,
    string Title,
    string ShortDescription,
    string? IconKey,
    string Accent,
    string? CtaUrl);

public record OfficeDto(
    string CountryCode,
    string Title,
    string Address,
    string? Phone,
    string? Email);

public record HealthDto(string Status, string Service, DateTimeOffset Timestamp);
