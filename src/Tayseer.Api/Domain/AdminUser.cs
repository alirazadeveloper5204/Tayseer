using System.ComponentModel.DataAnnotations;

namespace Tayseer.Api.Domain;

public class AdminUser
{
    public Guid Id { get; set; }

    [MaxLength(200)]
    public required string Email { get; set; }

    [MaxLength(120)]
    public required string DisplayName { get; set; }

    [MaxLength(500)]
    public required string PasswordHash { get; set; }

    public bool IsActive { get; set; } = true;

    public DateTimeOffset CreatedAt { get; set; } = DateTimeOffset.UtcNow;

    public DateTimeOffset? LastLoginAt { get; set; }
}
