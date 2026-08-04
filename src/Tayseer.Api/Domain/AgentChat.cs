using System.ComponentModel.DataAnnotations;

namespace Tayseer.Api.Domain;

public enum AgentConversationStatus
{
    Waiting = 0,
    Active = 1,
    Closed = 2,
}

public enum AgentMessageSender
{
    Visitor = 0,
    Agent = 1,
    System = 2,
}

public class AgentConversation
{
    public Guid Id { get; set; }

    /// <summary>Secret token used by the website visitor to post/read messages.</summary>
    [MaxLength(64)]
    public required string VisitorKey { get; set; }

    [MaxLength(120)]
    public string? VisitorName { get; set; }

    [MaxLength(200)]
    public string? VisitorEmail { get; set; }

    [MaxLength(8)]
    public string Lang { get; set; } = "en";

    public AgentConversationStatus Status { get; set; } = AgentConversationStatus.Waiting;

    public Guid? AssignedAdminUserId { get; set; }

    public AdminUser? AssignedAdminUser { get; set; }

    [MaxLength(200)]
    public string? Subject { get; set; }

    public DateTimeOffset CreatedAt { get; set; } = DateTimeOffset.UtcNow;

    public DateTimeOffset UpdatedAt { get; set; } = DateTimeOffset.UtcNow;

    public DateTimeOffset? LastVisitorMessageAt { get; set; }

    public DateTimeOffset? LastAgentMessageAt { get; set; }

    public ICollection<AgentMessage> Messages { get; set; } = new List<AgentMessage>();
}

public class AgentMessage
{
    public Guid Id { get; set; }

    public Guid ConversationId { get; set; }

    public AgentConversation? Conversation { get; set; }

    public AgentMessageSender Sender { get; set; }

    public required string Body { get; set; }

    public Guid? AdminUserId { get; set; }

    [MaxLength(120)]
    public string? AdminDisplayName { get; set; }

    public DateTimeOffset CreatedAt { get; set; } = DateTimeOffset.UtcNow;
}
