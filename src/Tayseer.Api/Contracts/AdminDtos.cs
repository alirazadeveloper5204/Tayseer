namespace Tayseer.Api.Contracts;

public record LoginRequestDto(string Email, string Password);

public record AuthUserDto(Guid Id, string Email, string DisplayName);

public record LoginResponseDto(string AccessToken, DateTimeOffset ExpiresAt, AuthUserDto User);

public record AdminServiceListItemDto(
    Guid Id,
    string Slug,
    string TitleEn,
    string TitleAr,
    string ShortDescriptionEn,
    string ShortDescriptionAr,
    string? IconKey,
    string AccentColor,
    int SortOrder,
    bool IsPublished);

public record AdminServiceDetailDto(
    Guid Id,
    string Slug,
    string TitleEn,
    string TitleAr,
    string ShortDescriptionEn,
    string ShortDescriptionAr,
    string? BodyEn,
    string? BodyAr,
    string? CtaLabelEn,
    string? CtaLabelAr,
    string? CtaUrl,
    string? IconKey,
    string AccentColor,
    int SortOrder,
    bool IsPublished,
    IReadOnlyList<AdminServiceFeatureDto> Features);

public record AdminServiceFeatureDto(
    Guid? Id,
    string TitleEn,
    string TitleAr,
    string DescriptionEn,
    string DescriptionAr,
    int SortOrder);

public record UpsertAdminServiceDto(
    string Slug,
    string TitleEn,
    string TitleAr,
    string ShortDescriptionEn,
    string ShortDescriptionAr,
    string? BodyEn,
    string? BodyAr,
    string? CtaLabelEn,
    string? CtaLabelAr,
    string? CtaUrl,
    string? IconKey,
    string AccentColor,
    int SortOrder,
    bool IsPublished,
    IReadOnlyList<AdminServiceFeatureDto>? Features);

public record AdminOfficeDto(
    Guid Id,
    string CountryCode,
    string TitleEn,
    string TitleAr,
    string AddressEn,
    string AddressAr,
    string? Phone,
    string? Email,
    int SortOrder);

public record UpsertAdminOfficeDto(
    string CountryCode,
    string TitleEn,
    string TitleAr,
    string AddressEn,
    string AddressAr,
    string? Phone,
    string? Email,
    int SortOrder);
