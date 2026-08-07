using System.ComponentModel.DataAnnotations;

namespace Tayseer.Api.Domain;

public class ContactInquiry
{
    public Guid Id { get; set; }

    [MaxLength(120)]
    public required string Name { get; set; }

    [MaxLength(200)]
    public required string Email { get; set; }

    [MaxLength(200)]
    public string? Company { get; set; }

    [MaxLength(80)]
    public required string Interest { get; set; }

    [MaxLength(4000)]
    public required string Message { get; set; }

    [MaxLength(8)]
    public string Lang { get; set; } = "en";

    public DateTimeOffset CreatedAt { get; set; } = DateTimeOffset.UtcNow;
}
