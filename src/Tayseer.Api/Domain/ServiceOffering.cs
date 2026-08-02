using System.ComponentModel.DataAnnotations;

namespace Tayseer.Api.Domain;

public class ServiceOffering
{
    public Guid Id { get; set; }

    [MaxLength(120)]
    public required string Slug { get; set; }

    [MaxLength(80)]
    public string? IconKey { get; set; }

    [MaxLength(32)]
    public string AccentColor { get; set; } = "blue";

    public int SortOrder { get; set; }

    public bool IsPublished { get; set; } = true;

    [MaxLength(200)]
    public required string TitleEn { get; set; }

    [MaxLength(200)]
    public required string TitleAr { get; set; }

    [MaxLength(500)]
    public required string ShortDescriptionEn { get; set; }

    [MaxLength(500)]
    public required string ShortDescriptionAr { get; set; }

    public string? BodyEn { get; set; }

    public string? BodyAr { get; set; }

    [MaxLength(120)]
    public string? CtaLabelEn { get; set; }

    [MaxLength(120)]
    public string? CtaLabelAr { get; set; }

    [MaxLength(500)]
    public string? CtaUrl { get; set; }

    public DateTimeOffset UpdatedAt { get; set; } = DateTimeOffset.UtcNow;

    public ICollection<ServiceFeature> Features { get; set; } = new List<ServiceFeature>();
}

public class ServiceFeature
{
    public Guid Id { get; set; }

    public Guid ServiceOfferingId { get; set; }

    public ServiceOffering? ServiceOffering { get; set; }

    public int SortOrder { get; set; }

    [MaxLength(200)]
    public required string TitleEn { get; set; }

    [MaxLength(200)]
    public required string TitleAr { get; set; }

    public required string DescriptionEn { get; set; }

    public required string DescriptionAr { get; set; }
}
