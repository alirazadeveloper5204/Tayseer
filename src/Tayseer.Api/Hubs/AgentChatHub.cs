using Microsoft.AspNetCore.SignalR;
using Microsoft.EntityFrameworkCore;
using Tayseer.Api.Data;

namespace Tayseer.Api.Hubs;

public interface IAgentChatClient
{
    Task ConversationCreated(object payload);
    Task ConversationUpdated(object payload);
    Task MessageCreated(object payload);
    Task AgentNotification(object payload);
}

public sealed class AgentChatHub(AppDbContext db) : Hub<IAgentChatClient>
{
    public const string AdminsGroup = "admins";

    public static string ConversationGroup(Guid conversationId) => $"conversation:{conversationId:N}";

    public override async Task OnConnectedAsync()
    {
        if (Context.User?.Identity?.IsAuthenticated == true)
        {
            await Groups.AddToGroupAsync(Context.ConnectionId, AdminsGroup);
        }

        await base.OnConnectedAsync();
    }

    /// <summary>
    /// Visitors must prove ownership with <paramref name="visitorKey"/>.
    /// Authenticated admins may join any conversation group without a key.
    /// </summary>
    public async Task JoinConversation(string conversationId, string? visitorKey = null)
    {
        if (!Guid.TryParse(conversationId, out var id))
        {
            throw new HubException("Invalid conversation id.");
        }

        var isAdmin = Context.User?.Identity?.IsAuthenticated == true
            && Context.User.IsInRole("Admin");

        if (!isAdmin)
        {
            if (string.IsNullOrWhiteSpace(visitorKey))
            {
                throw new HubException("visitorKey is required.");
            }

            var allowed = await db.AgentConversations
                .AsNoTracking()
                .AnyAsync(c => c.Id == id && c.VisitorKey == visitorKey);

            if (!allowed)
            {
                throw new HubException("Conversation not found.");
            }
        }

        await Groups.AddToGroupAsync(Context.ConnectionId, ConversationGroup(id));
    }

    public Task LeaveConversation(string conversationId)
    {
        if (!Guid.TryParse(conversationId, out var id))
        {
            return Task.CompletedTask;
        }

        return Groups.RemoveFromGroupAsync(Context.ConnectionId, ConversationGroup(id));
    }
}
