namespace Tayseer.Api.Contracts;

public record StartAgentChatRequestDto(
    string? Lang,
    string? VisitorName,
    string? VisitorEmail,
    string? InitialMessage,
    string? TranscriptSummary);

public record VisitorAgentMessageRequestDto(string VisitorKey, string Body);

public record AdminAgentMessageRequestDto(string Body);

public record AgentMessageDto(
    Guid Id,
    string Sender,
    string Body,
    string? AdminDisplayName,
    DateTimeOffset CreatedAt);

public record AgentConversationSummaryDto(
    Guid Id,
    string Status,
    string Lang,
    string? VisitorName,
    string? VisitorEmail,
    string? Subject,
    string? AssignedAdminName,
    DateTimeOffset CreatedAt,
    DateTimeOffset UpdatedAt,
    DateTimeOffset? LastVisitorMessageAt,
    int UnreadForAdminHint);

public record AgentConversationDetailDto(
    Guid Id,
    string Status,
    string Lang,
    string? VisitorName,
    string? VisitorEmail,
    string? Subject,
    Guid? AssignedAdminUserId,
    string? AssignedAdminName,
    DateTimeOffset CreatedAt,
    DateTimeOffset UpdatedAt,
    IReadOnlyList<AgentMessageDto> Messages);

public record StartAgentChatResponseDto(
    Guid ConversationId,
    string VisitorKey,
    string Status,
    IReadOnlyList<AgentMessageDto> Messages);
