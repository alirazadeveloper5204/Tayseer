namespace Tayseer.Api.Options;

public sealed class JwtOptions
{
    public const string SectionName = "Jwt";

    public string Issuer { get; set; } = "Tayseer.Api";

    public string Audience { get; set; } = "Tayseer.Admin";

    /// <summary>Symmetric signing key (min 32 chars). Prefer User Secrets / env in production.</summary>
    public string SigningKey { get; set; } = "";

    public int ExpiryMinutes { get; set; } = 480;
}

public sealed class AdminSeedOptions
{
    public const string SectionName = "AdminSeed";

    public string Email { get; set; } = "admin@tayseer.me";

    public string DisplayName { get; set; } = "Tayseer Admin";

    public string Password { get; set; } = "ChangeMe!Tayseer1";
}
