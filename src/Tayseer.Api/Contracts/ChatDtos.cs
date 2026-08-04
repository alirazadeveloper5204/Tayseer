namespace Tayseer.Api.Contracts;

public record ChatMessageDto(string Role, string Content);

public record ChatRequestDto(
    IReadOnlyList<ChatMessageDto> Messages,
    string? Lang = null);

public record ChatSourceDto(string Title, string SourceType, string SourceKey, float Score);

public record ChatResponseDto(
    string Reply,
    string Model,
    IReadOnlyList<ChatSourceDto>? Sources = null);

public record ChatErrorDto(string Error, string? Detail = null);

public record KnowledgeStatusDto(
    bool Enabled,
    int ChunkCount,
    DateTimeOffset? BuiltAtUtc,
    string? LastError,
    string EmbeddingModel);
