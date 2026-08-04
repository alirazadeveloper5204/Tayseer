using System.Security.Cryptography;
using Microsoft.AspNetCore.SignalR;
using Microsoft.EntityFrameworkCore;
using Tayseer.Api.Contracts;
using Tayseer.Api.Data;
using Tayseer.Api.Domain;
using Tayseer.Api.Hubs;
using Tayseer.Api.Resources;

namespace Tayseer.Api.Services;

public sealed class AgentChatService(
    AppDbContext db,
    IHubContext<AgentChatHub, IAgentChatClient> hub,
    ILogger<AgentChatService> logger)
{
    public async Task<StartAgentChatResponseDto> StartAsync(StartAgentChatRequestDto request, CancellationToken ct)
    {
        var lang = string.Equals(request.Lang, "ar", StringComparison.OrdinalIgnoreCase) ? "ar" : "en";
        var now = DateTimeOffset.UtcNow;
        var conversation = new AgentConversation
        {
            Id = Guid.NewGuid(),
            VisitorKey = CreateVisitorKey(),
            VisitorName = TrimOrNull(request.VisitorName, 120),
            VisitorEmail = TrimOrNull(request.VisitorEmail, 200),
            Lang = lang,
            Status = AgentConversationStatus.Waiting,
            Subject = BuildSubject(request, lang),
            CreatedAt = now,
            UpdatedAt = now,
        };

        var messages = new List<AgentMessage>();
        var waitingText = ApiMessages.AgentWaitingConnected(lang);

        messages.Add(SystemMessage(conversation.Id, waitingText, now));

        if (!string.IsNullOrWhiteSpace(request.TranscriptSummary))
        {
            messages.Add(SystemMessage(
                conversation.Id,
                ApiMessages.FahimTranscriptSummaryPrefix(lang) + request.TranscriptSummary.Trim(),
                now.AddMilliseconds(1)));
        }

        if (!string.IsNullOrWhiteSpace(request.InitialMessage))
        {
            var body = request.InitialMessage.Trim();
            messages.Add(new AgentMessage
            {
                Id = Guid.NewGuid(),
                ConversationId = conversation.Id,
                Sender = AgentMessageSender.Visitor,
                Body = body,
                CreatedAt = now.AddMilliseconds(2),
            });
            conversation.LastVisitorMessageAt = now;
        }

        conversation.Messages = messages;
        db.AgentConversations.Add(conversation);
        await db.SaveChangesAsync(ct);

        var detail = await GetDetailAsync(conversation.Id, ct)
            ?? throw new InvalidOperationException("Conversation was created but could not be loaded.");

        var summary = ToSummary(conversation, unreadHint: 1);
        await hub.Clients.Group(AgentChatHub.AdminsGroup).ConversationCreated(summary);
        await hub.Clients.Group(AgentChatHub.AdminsGroup).AgentNotification(new
        {
            type = "conversation.created",
            title = "New agent chat",
            body = summary.VisitorName is { Length: > 0 } name
                ? $"{name} requested an agent"
                : "A website visitor requested an agent",
            conversationId = conversation.Id,
            createdAt = now,
        });

        logger.LogInformation("Agent conversation {Id} started", conversation.Id);

        return new StartAgentChatResponseDto(
            conversation.Id,
            conversation.VisitorKey,
            conversation.Status.ToString(),
            detail.Messages);
    }

    public async Task<AgentConversationDetailDto?> GetForVisitorAsync(Guid id, string visitorKey, CancellationToken ct)
    {
        var conversation = await db.AgentConversations
            .AsNoTracking()
            .Include(c => c.Messages)
            .Include(c => c.AssignedAdminUser)
            .FirstOrDefaultAsync(c => c.Id == id && c.VisitorKey == visitorKey, ct);

        return conversation is null ? null : ToDetail(conversation);
    }

    public async Task<AgentMessageDto?> AddVisitorMessageAsync(
        Guid conversationId,
        string visitorKey,
        string body,
        CancellationToken ct)
    {
        var text = body.Trim();
        if (text.Length == 0)
        {
            throw new ArgumentException("Message body is required.");
        }

        var conversation = await db.AgentConversations
            .Include(c => c.AssignedAdminUser)
            .FirstOrDefaultAsync(c => c.Id == conversationId && c.VisitorKey == visitorKey, ct);

        if (conversation is null)
        {
            return null;
        }

        if (conversation.Status == AgentConversationStatus.Closed)
        {
            throw new InvalidOperationException("This conversation is closed.");
        }

        var now = DateTimeOffset.UtcNow;
        var message = new AgentMessage
        {
            Id = Guid.NewGuid(),
            ConversationId = conversation.Id,
            Sender = AgentMessageSender.Visitor,
            Body = text,
            CreatedAt = now,
        };

        db.AgentMessages.Add(message);
        conversation.LastVisitorMessageAt = now;
        conversation.UpdatedAt = now;

        await db.SaveChangesAsync(ct);

        var dto = ToMessageDto(message);
        await NotifyMessageAsync(conversation, dto, notifyAdmins: true, ct);
        return dto;
    }

    public async Task<IReadOnlyList<AgentConversationSummaryDto>> ListForAdminAsync(
        string? status,
        CancellationToken ct)
    {
        var query = db.AgentConversations
            .AsNoTracking()
            .Include(c => c.AssignedAdminUser)
            .AsQueryable();

        if (!string.IsNullOrWhiteSpace(status)
            && Enum.TryParse<AgentConversationStatus>(status, true, out var parsed))
        {
            query = query.Where(c => c.Status == parsed);
        }

        var items = await query
            .OrderByDescending(c => c.UpdatedAt)
            .Take(100)
            .ToListAsync(ct);

        return items.Select(c => ToSummary(c, unreadHint: c.Status == AgentConversationStatus.Waiting ? 1 : 0)).ToList();
    }

    public async Task<AgentConversationDetailDto?> GetDetailAsync(Guid id, CancellationToken ct)
    {
        var conversation = await db.AgentConversations
            .AsNoTracking()
            .Include(c => c.Messages)
            .Include(c => c.AssignedAdminUser)
            .FirstOrDefaultAsync(c => c.Id == id, ct);

        return conversation is null ? null : ToDetail(conversation);
    }

    public async Task<AgentConversationDetailDto?> ClaimAsync(Guid id, Guid adminUserId, string adminName, CancellationToken ct)
    {
        var admin = await db.AdminUsers.AsNoTracking()
            .FirstOrDefaultAsync(u => u.Id == adminUserId && u.IsActive, ct);
        if (admin is null)
        {
            throw new InvalidOperationException(
                "Your admin session is out of date (user not found). Sign out and sign in again.");
        }

        var conversation = await db.AgentConversations
            .AsNoTracking()
            .FirstOrDefaultAsync(c => c.Id == id, ct);

        if (conversation is null)
        {
            return null;
        }

        if (conversation.Status == AgentConversationStatus.Closed)
        {
            throw new InvalidOperationException("Conversation is closed.");
        }

        var now = DateTimeOffset.UtcNow;
        var displayName = string.IsNullOrWhiteSpace(adminName) ? admin.DisplayName : adminName;

        // Bypass change-tracker relationship fix-up (AssignedAdminUser + Messages) which
        // was causing DbUpdateConcurrencyException on SaveChanges for some LocalDB states.
        var updated = await db.AgentConversations
            .Where(c => c.Id == id && c.Status != AgentConversationStatus.Closed)
            .ExecuteUpdateAsync(setters => setters
                .SetProperty(c => c.AssignedAdminUserId, adminUserId)
                .SetProperty(c => c.Status, AgentConversationStatus.Active)
                .SetProperty(c => c.UpdatedAt, now), ct);

        if (updated == 0)
        {
            throw new InvalidOperationException("Conversation could not be claimed. It may have been closed.");
        }

        var system = SystemMessage(
            id,
            ApiMessages.AgentJoined(conversation.Lang, displayName),
            now);
        db.AgentMessages.Add(system);
        await db.SaveChangesAsync(ct);

        var detail = await GetDetailAsync(id, ct)
            ?? throw new InvalidOperationException("Conversation was claimed but could not be loaded.");

        var summary = ToSummaryFromDetail(detail);
        await hub.Clients.Group(AgentChatHub.AdminsGroup).ConversationUpdated(summary);
        await hub.Clients.Group(AgentChatHub.ConversationGroup(id)).ConversationUpdated(detail);
        await hub.Clients.Group(AgentChatHub.ConversationGroup(id)).MessageCreated(ToMessageDto(system));
        return detail;
    }

    public async Task<AgentMessageDto?> AddAgentMessageAsync(
        Guid conversationId,
        Guid adminUserId,
        string adminName,
        string body,
        CancellationToken ct)
    {
        var text = body.Trim();
        if (text.Length == 0)
        {
            throw new ArgumentException("Message body is required.");
        }

        var conversation = await db.AgentConversations
            .FirstOrDefaultAsync(c => c.Id == conversationId, ct);

        if (conversation is null)
        {
            return null;
        }

        if (conversation.Status == AgentConversationStatus.Closed)
        {
            throw new InvalidOperationException("Conversation is closed.");
        }

        var adminExists = await db.AdminUsers.AnyAsync(u => u.Id == adminUserId && u.IsActive, ct);
        if (!adminExists)
        {
            throw new InvalidOperationException(
                "Your admin session is out of date (user not found). Sign out and sign in again.");
        }

        var now = DateTimeOffset.UtcNow;
        if (conversation.AssignedAdminUserId is null)
        {
            conversation.AssignedAdminUserId = adminUserId;
        }

        conversation.Status = AgentConversationStatus.Active;
        conversation.LastAgentMessageAt = now;
        conversation.UpdatedAt = now;

        var message = new AgentMessage
        {
            Id = Guid.NewGuid(),
            ConversationId = conversation.Id,
            Sender = AgentMessageSender.Agent,
            Body = text,
            AdminUserId = adminUserId,
            AdminDisplayName = adminName,
            CreatedAt = now,
        };

        db.AgentMessages.Add(message);
        await db.SaveChangesAsync(ct);

        var dto = ToMessageDto(message);
        await NotifyMessageAsync(conversation, dto, notifyAdmins: true, ct);
        return dto;
    }

    public async Task<AgentConversationDetailDto?> CloseAsync(Guid id, string adminName, CancellationToken ct)
    {
        var conversation = await db.AgentConversations
            .AsNoTracking()
            .FirstOrDefaultAsync(c => c.Id == id, ct);

        if (conversation is null)
        {
            return null;
        }

        if (conversation.Status == AgentConversationStatus.Closed)
        {
            return await GetDetailAsync(id, ct);
        }

        var now = DateTimeOffset.UtcNow;
        var updated = await db.AgentConversations
            .Where(c => c.Id == id && c.Status != AgentConversationStatus.Closed)
            .ExecuteUpdateAsync(setters => setters
                .SetProperty(c => c.Status, AgentConversationStatus.Closed)
                .SetProperty(c => c.UpdatedAt, now), ct);

        if (updated == 0)
        {
            return await GetDetailAsync(id, ct);
        }

        var system = SystemMessage(
            id,
            ApiMessages.AgentClosed(conversation.Lang, adminName),
            now);
        db.AgentMessages.Add(system);
        await db.SaveChangesAsync(ct);

        var detail = await GetDetailAsync(id, ct)
            ?? throw new InvalidOperationException("Conversation was closed but could not be loaded.");

        var summary = ToSummaryFromDetail(detail);
        await hub.Clients.Group(AgentChatHub.AdminsGroup).ConversationUpdated(summary);
        await hub.Clients.Group(AgentChatHub.ConversationGroup(id)).ConversationUpdated(detail);
        await hub.Clients.Group(AgentChatHub.ConversationGroup(id)).MessageCreated(ToMessageDto(system));
        return detail;
    }

    private async Task NotifyMessageAsync(
        AgentConversation conversation,
        AgentMessageDto message,
        bool notifyAdmins,
        CancellationToken ct)
    {
        await hub.Clients.Group(AgentChatHub.ConversationGroup(conversation.Id)).MessageCreated(message);
        if (notifyAdmins)
        {
            await hub.Clients.Group(AgentChatHub.AdminsGroup).MessageCreated(new
            {
                conversationId = conversation.Id,
                message,
            });
            if (message.Sender == nameof(AgentMessageSender.Visitor))
            {
                await hub.Clients.Group(AgentChatHub.AdminsGroup).AgentNotification(new
                {
                    type = "message.created",
                    title = "New visitor message",
                    body = Truncate(message.Body, 120),
                    conversationId = conversation.Id,
                    createdAt = message.CreatedAt,
                });
            }
        }

        await hub.Clients.Group(AgentChatHub.AdminsGroup)
            .ConversationUpdated(ToSummary(conversation, message.Sender == nameof(AgentMessageSender.Visitor) ? 1 : 0));
        _ = ct;
    }

    private static AgentMessage SystemMessage(Guid conversationId, string body, DateTimeOffset at) =>
        new()
        {
            Id = Guid.NewGuid(),
            ConversationId = conversationId,
            Sender = AgentMessageSender.System,
            Body = body,
            CreatedAt = at,
        };

    private static string BuildSubject(StartAgentChatRequestDto request, string lang)
    {
        if (!string.IsNullOrWhiteSpace(request.InitialMessage))
        {
            return Truncate(request.InitialMessage.Trim(), 80);
        }

        return ApiMessages.AgentChatRequestSubject(lang);
    }

    private static string CreateVisitorKey()
    {
        Span<byte> bytes = stackalloc byte[24];
        RandomNumberGenerator.Fill(bytes);
        return Convert.ToHexString(bytes).ToLowerInvariant();
    }

    private static string? TrimOrNull(string? value, int max)
    {
        if (string.IsNullOrWhiteSpace(value))
        {
            return null;
        }

        var trimmed = value.Trim();
        return trimmed.Length <= max ? trimmed : trimmed[..max];
    }

    private static string Truncate(string value, int max) =>
        value.Length <= max ? value : value[..(max - 1)] + "…";

    private static AgentMessageDto ToMessageDto(AgentMessage message) =>
        new(
            message.Id,
            message.Sender.ToString(),
            message.Body,
            message.AdminDisplayName,
            message.CreatedAt);

    private static AgentConversationDetailDto ToDetail(AgentConversation conversation) =>
        new(
            conversation.Id,
            conversation.Status.ToString(),
            conversation.Lang,
            conversation.VisitorName,
            conversation.VisitorEmail,
            conversation.Subject,
            conversation.AssignedAdminUserId,
            conversation.AssignedAdminUser?.DisplayName,
            conversation.CreatedAt,
            conversation.UpdatedAt,
            conversation.Messages
                .OrderBy(m => m.CreatedAt)
                .Select(ToMessageDto)
                .ToList());

    private static AgentConversationSummaryDto ToSummary(AgentConversation conversation, int unreadHint) =>
        new(
            conversation.Id,
            conversation.Status.ToString(),
            conversation.Lang,
            conversation.VisitorName,
            conversation.VisitorEmail,
            conversation.Subject,
            conversation.AssignedAdminUser?.DisplayName,
            conversation.CreatedAt,
            conversation.UpdatedAt,
            conversation.LastVisitorMessageAt,
            unreadHint);

    private static AgentConversationSummaryDto ToSummaryFromDetail(AgentConversationDetailDto detail) =>
        new(
            detail.Id,
            detail.Status,
            detail.Lang,
            detail.VisitorName,
            detail.VisitorEmail,
            detail.Subject,
            detail.AssignedAdminName,
            detail.CreatedAt,
            detail.UpdatedAt,
            null,
            0);
}
