using System.ComponentModel.DataAnnotations;

namespace Tayseer.Api.Domain;

public class SiteSetting
{
    public Guid Id { get; set; }

    [MaxLength(100)]
    public required string Key { get; set; }

    public string? ValueEn { get; set; }

    public string? ValueAr { get; set; }
}

public class Office
{
    public Guid Id { get; set; }

    [MaxLength(80)]
    public required string CountryCode { get; set; }

    [MaxLength(120)]
    public required string TitleEn { get; set; }

    [MaxLength(120)]
    public required string TitleAr { get; set; }

    public required string AddressEn { get; set; }

    public required string AddressAr { get; set; }

    [MaxLength(40)]
    public string? Phone { get; set; }

    [MaxLength(120)]
    public string? Email { get; set; }

    public int SortOrder { get; set; }
}

public class Page
{
    public Guid Id { get; set; }

    [MaxLength(120)]
    public required string Slug { get; set; }

    [MaxLength(200)]
    public required string TitleEn { get; set; }

    [MaxLength(200)]
    public required string TitleAr { get; set; }

    [MaxLength(300)]
    public string? MetaDescriptionEn { get; set; }

    [MaxLength(300)]
    public string? MetaDescriptionAr { get; set; }

    public bool IsPublished { get; set; } = true;

    public DateTimeOffset UpdatedAt { get; set; } = DateTimeOffset.UtcNow;

    public ICollection<PageSection> Sections { get; set; } = new List<PageSection>();
}

public class PageSection
{
    public Guid Id { get; set; }

    public Guid PageId { get; set; }

    public Page? Page { get; set; }

    [MaxLength(80)]
    public required string SectionKey { get; set; }

    public int SortOrder { get; set; }

    [MaxLength(200)]
    public string? TitleEn { get; set; }

    [MaxLength(200)]
    public string? TitleAr { get; set; }

    public string? BodyEn { get; set; }

    public string? BodyAr { get; set; }

    public string? PayloadJson { get; set; }
}
