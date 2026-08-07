using Microsoft.AspNetCore.SignalR;

namespace Tayseer.Api.Hubs;

public interface IAgentChatClient
{
    Task ConversationCreated(object payload);
    Task ConversationUpdated(object payload);
    Task MessageCreated(object payload);
    Task AgentNotification(object payload);
}

public sealed class AgentChatHub : Hub<IAgentChatClient>
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


    public Task JoinConversation(string conversationId)
    {
        if (!Guid.TryParse(conversationId, out var id))
        {
            throw new HubException("Invalid conversation id.");
        }

        return Groups.AddToGroupAsync(Context.ConnectionId, ConversationGroup(id));
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
