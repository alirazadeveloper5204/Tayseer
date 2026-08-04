using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Text;
using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Options;
using Microsoft.IdentityModel.Tokens;
using Tayseer.Api.Contracts;
using Tayseer.Api.Data;
using Tayseer.Api.Domain;
using Tayseer.Api.Options;

namespace Tayseer.Api.Services;

public sealed class AuthService(
    AppDbContext db,
    IOptions<JwtOptions> jwtOptions,
    IPasswordHasher<AdminUser> passwordHasher)
{
    private readonly JwtOptions _jwt = jwtOptions.Value;

    public async Task<LoginResponseDto?> LoginAsync(LoginRequestDto request, CancellationToken ct)
    {
        var email = request.Email?.Trim().ToLowerInvariant() ?? "";
        if (email.Length == 0 || string.IsNullOrWhiteSpace(request.Password))
        {
            return null;
        }

        var user = await db.AdminUsers.FirstOrDefaultAsync(u => u.Email == email && u.IsActive, ct);
        if (user is null)
        {
            return null;
        }

        var result = passwordHasher.VerifyHashedPassword(user, user.PasswordHash, request.Password);
        if (result == PasswordVerificationResult.Failed)
        {
            return null;
        }

        if (result == PasswordVerificationResult.SuccessRehashNeeded)
        {
            user.PasswordHash = passwordHasher.HashPassword(user, request.Password);
        }

        user.LastLoginAt = DateTimeOffset.UtcNow;
        await db.SaveChangesAsync(ct);

        var expiresAt = DateTimeOffset.UtcNow.AddMinutes(Math.Clamp(_jwt.ExpiryMinutes, 15, 24 * 60));
        var token = CreateToken(user, expiresAt);

        return new LoginResponseDto(
            token,
            expiresAt,
            new AuthUserDto(user.Id, user.Email, user.DisplayName));
    }

    public async Task<AuthUserDto?> GetUserAsync(Guid userId, CancellationToken ct)
    {
        var user = await db.AdminUsers
            .AsNoTracking()
            .FirstOrDefaultAsync(u => u.Id == userId && u.IsActive, ct);

        return user is null
            ? null
            : new AuthUserDto(user.Id, user.Email, user.DisplayName);
    }

    private string CreateToken(AdminUser user, DateTimeOffset expiresAt)
    {
        if (string.IsNullOrWhiteSpace(_jwt.SigningKey) || _jwt.SigningKey.Length < 32)
        {
            throw new InvalidOperationException("Jwt:SigningKey must be at least 32 characters.");
        }

        var claims = new List<Claim>
        {
            new(JwtRegisteredClaimNames.Sub, user.Id.ToString()),
            new(JwtRegisteredClaimNames.Email, user.Email),
            new(ClaimTypes.NameIdentifier, user.Id.ToString()),
            new(ClaimTypes.Email, user.Email),
            new(ClaimTypes.Name, user.DisplayName),
            new(ClaimTypes.Role, "Admin"),
        };

        var key = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(_jwt.SigningKey));
        var creds = new SigningCredentials(key, SecurityAlgorithms.HmacSha256);
        var token = new JwtSecurityToken(
            issuer: _jwt.Issuer,
            audience: _jwt.Audience,
            claims: claims,
            notBefore: DateTime.UtcNow,
            expires: expiresAt.UtcDateTime,
            signingCredentials: creds);

        return new JwtSecurityTokenHandler().WriteToken(token);
    }
}
