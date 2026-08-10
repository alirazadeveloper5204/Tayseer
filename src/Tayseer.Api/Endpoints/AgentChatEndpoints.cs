using System.Security.Claims;
using Tayseer.Api.Contracts;
using Tayseer.Api.Security;
using Tayseer.Api.Services;

namespace Tayseer.Api.Endpoints;

public static class AgentChatEndpoints
{
    public static RouteGroupBuilder MapAgentChatEndpoints(this IEndpointRouteBuilder app)
    {
        var publicGroup = app.MapGroup("/api/v1/agent-chat").WithTags("AgentChat");

        publicGroup.MapPost("/conversations", async (
            StartAgentChatRequestDto request,
            AgentChatService chat,
            CancellationToken ct) =>
        {
            try
            {
                var result = await chat.StartAsync(request, ct);
                return Results.Created($"/api/v1/agent-chat/conversations/{result.ConversationId}", result);
            }
            catch (ArgumentException ex)
            {
                return Results.BadRequest(new ChatErrorDto(ex.Message));
            }
        })
        .AllowAnonymous()
        .RequireRateLimiting(RateLimitPolicies.Chat)
        .WithName("StartAgentChat");

        publicGroup.MapGet("/conversations/{id:guid}", async (
            Guid id,
            string visitorKey,
            AgentChatService chat,
            CancellationToken ct) =>
        {
            if (string.IsNullOrWhiteSpace(visitorKey))
            {
                return Results.BadRequest(new ChatErrorDto("visitorKey is required."));
            }

            var detail = await chat.GetForVisitorAsync(id, visitorKey, ct);
            return detail is null ? Results.NotFound() : Results.Ok(detail);
        })
        .AllowAnonymous()
        .RequireRateLimiting(RateLimitPolicies.Chat)
        .WithName("GetVisitorAgentChat");

        publicGroup.MapPost("/conversations/{id:guid}/messages", async (
            Guid id,
            VisitorAgentMessageRequestDto request,
            AgentChatService chat,
            CancellationToken ct) =>
        {
            if (string.IsNullOrWhiteSpace(request.VisitorKey))
            {
                return Results.BadRequest(new ChatErrorDto("visitorKey is required."));
            }

            try
            {
                var message = await chat.AddVisitorMessageAsync(id, request.VisitorKey, request.Body, ct);
                return message is null ? Results.NotFound() : Results.Ok(message);
            }
            catch (ArgumentException ex)
            {
                return Results.BadRequest(new ChatErrorDto(ex.Message));
            }
            catch (InvalidOperationException ex)
            {
                return Results.Conflict(new ChatErrorDto(ex.Message));
            }
        })
        .AllowAnonymous()
        .RequireRateLimiting(RateLimitPolicies.Chat)
        .WithName("PostVisitorAgentMessage");

        var adminGroup = app.MapGroup("/api/v1/admin/agent-chat")
            .WithTags("AdminAgentChat")
            .RequireAuthorization(AuthPolicies.AdminOnly);

        adminGroup.MapGet("/conversations", async (
            string? status,
            AgentChatService chat,
            CancellationToken ct) =>
        {
            var items = await chat.ListForAdminAsync(status, ct);
            return Results.Ok(items);
        })
        .WithName("AdminListAgentChats");

        adminGroup.MapGet("/conversations/{id:guid}", async (
            Guid id,
            AgentChatService chat,
            CancellationToken ct) =>
        {
            var detail = await chat.GetDetailAsync(id, ct);
            return detail is null ? Results.NotFound() : Results.Ok(detail);
        })
        .WithName("AdminGetAgentChat");

        adminGroup.MapPost("/conversations/{id:guid}/claim", async (
            Guid id,
            ClaimsPrincipal user,
            AgentChatService chat,
            CancellationToken ct) =>
        {
            if (!TryGetAdmin(user, out var adminId, out var adminName))
            {
                return Results.Unauthorized();
            }

            try
            {
                var detail = await chat.ClaimAsync(id, adminId, adminName, ct);
                return detail is null ? Results.NotFound() : Results.Ok(detail);
            }
            catch (InvalidOperationException ex)
            {
                return Results.Conflict(new ChatErrorDto(ex.Message));
            }
        })
        .WithName("AdminClaimAgentChat");

        adminGroup.MapPost("/conversations/{id:guid}/messages", async (
            Guid id,
            AdminAgentMessageRequestDto request,
            ClaimsPrincipal user,
            AgentChatService chat,
            CancellationToken ct) =>
        {
            if (!TryGetAdmin(user, out var adminId, out var adminName))
            {
                return Results.Unauthorized();
            }

            try
            {
                var message = await chat.AddAgentMessageAsync(id, adminId, adminName, request.Body, ct);
                return message is null ? Results.NotFound() : Results.Ok(message);
            }
            catch (ArgumentException ex)
            {
                return Results.BadRequest(new ChatErrorDto(ex.Message));
            }
            catch (InvalidOperationException ex)
            {
                return Results.Conflict(new ChatErrorDto(ex.Message));
            }
        })
        .WithName("AdminPostAgentMessage");

        adminGroup.MapPost("/conversations/{id:guid}/close", async (
            Guid id,
            ClaimsPrincipal user,
            AgentChatService chat,
            CancellationToken ct) =>
        {
            if (!TryGetAdmin(user, out _, out var adminName))
            {
                return Results.Unauthorized();
            }

            var detail = await chat.CloseAsync(id, adminName, ct);
            return detail is null ? Results.NotFound() : Results.Ok(detail);
        })
        .WithName("AdminCloseAgentChat");

        return publicGroup;
    }

    private static bool TryGetAdmin(ClaimsPrincipal user, out Guid adminId, out string adminName)
    {
        adminId = Guid.Empty;
        adminName = user.FindFirstValue(ClaimTypes.Name) ?? "Agent";
        var idValue = user.FindFirstValue(ClaimTypes.NameIdentifier)
            ?? user.FindFirstValue("sub");
        return Guid.TryParse(idValue, out adminId);
    }
}
