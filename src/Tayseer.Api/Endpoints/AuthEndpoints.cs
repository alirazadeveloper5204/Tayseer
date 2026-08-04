using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using Tayseer.Api.Contracts;
using Tayseer.Api.Services;

namespace Tayseer.Api.Endpoints;

public static class AuthEndpoints
{
    public static RouteGroupBuilder MapAuthEndpoints(this IEndpointRouteBuilder app)
    {
        var group = app.MapGroup("/api/v1/auth").WithTags("Auth");

        group.MapPost("/login", async (LoginRequestDto request, AuthService auth, CancellationToken ct) =>
        {
            if (string.IsNullOrWhiteSpace(request.Email) || string.IsNullOrWhiteSpace(request.Password))
            {
                return Results.BadRequest(new ChatErrorDto("Email and password are required."));
            }

            var result = await auth.LoginAsync(request, ct);
            return result is null
                ? Results.Json(new ChatErrorDto("Invalid email or password."), statusCode: StatusCodes.Status401Unauthorized)
                : Results.Ok(result);
        })
        .AllowAnonymous()
        .WithName("Login");

        group.MapGet("/me", async (ClaimsPrincipal principal, AuthService auth, CancellationToken ct) =>
        {
            var idValue = principal.FindFirstValue(ClaimTypes.NameIdentifier)
                ?? principal.FindFirstValue(JwtRegisteredClaimNames.Sub);
            if (!Guid.TryParse(idValue, out var userId))
            {
                return Results.Unauthorized();
            }

            var user = await auth.GetUserAsync(userId, ct);
            return user is null ? Results.Unauthorized() : Results.Ok(user);
        })
        .RequireAuthorization()
        .WithName("Me");

        return group;
    }
}
