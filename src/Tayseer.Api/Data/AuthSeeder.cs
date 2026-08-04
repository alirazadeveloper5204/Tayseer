using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Options;
using Tayseer.Api.Domain;
using Tayseer.Api.Options;

namespace Tayseer.Api.Data;

public static class AuthSeeder
{
    public static async Task EnsureSeedAsync(
        AppDbContext db,
        IOptions<AdminSeedOptions> seedOptions,
        IPasswordHasher<AdminUser> passwordHasher,
        CancellationToken ct = default)
    {
        var seed = seedOptions.Value;
        var email = seed.Email.Trim().ToLowerInvariant();
        if (email.Length == 0 || string.IsNullOrWhiteSpace(seed.Password))
        {
            return;
        }

        var existing = await db.AdminUsers.FirstOrDefaultAsync(u => u.Email == email, ct);
        if (existing is not null)
        {
            return;
        }

        var user = new AdminUser
        {
            Id = Guid.Parse("aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa"),
            Email = email,
            DisplayName = string.IsNullOrWhiteSpace(seed.DisplayName) ? "Admin" : seed.DisplayName.Trim(),
            PasswordHash = "",
            IsActive = true,
            CreatedAt = DateTimeOffset.UtcNow,
        };
        user.PasswordHash = passwordHasher.HashPassword(user, seed.Password);

        db.AdminUsers.Add(user);
        await db.SaveChangesAsync(ct);
    }
}
