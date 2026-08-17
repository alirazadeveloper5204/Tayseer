namespace Tayseer.Api.Security;

public static class AuthCookie
{
    public const string Name = "tayseer_auth";

    public static CookieOptions CreateOptions(HttpContext http, DateTimeOffset? expires = null)
    {
        // Honor TLS at the edge (Render/proxy sets X-Forwarded-Proto).
        var forwardedProto = http.Request.Headers["X-Forwarded-Proto"].FirstOrDefault();
        var secure = http.Request.IsHttps
            || string.Equals(forwardedProto, "https", StringComparison.OrdinalIgnoreCase);

        var options = new CookieOptions
        {
            HttpOnly = true,
            Secure = secure,
            SameSite = SameSiteMode.Lax,
            Path = "/",
            IsEssential = true,
        };

        if (expires is not null)
        {
            options.Expires = expires.Value.UtcDateTime;
        }

        return options;
    }

    public static void Append(HttpContext http, string token, DateTimeOffset expiresAt) =>
        http.Response.Cookies.Append(Name, token, CreateOptions(http, expiresAt));

    public static void Delete(HttpContext http) =>
        http.Response.Cookies.Delete(Name, CreateOptions(http));
}
