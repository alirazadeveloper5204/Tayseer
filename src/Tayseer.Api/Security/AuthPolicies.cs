namespace Tayseer.Api.Security;

public static class AuthPolicies
{
    public const string AdminOnly = "AdminOnly";
}

public static class RateLimitPolicies
{
    public const string Auth = "auth";
    public const string Contact = "contact";
    public const string Chat = "chat";
}
