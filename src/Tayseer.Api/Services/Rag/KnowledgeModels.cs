namespace Tayseer.Api.Services.Rag;

public sealed record KnowledgeChunk(
    string Id,
    string SourceType,
    string SourceKey,
    string Language,
    string Title,
    string Content);

public sealed record IndexedKnowledgeChunk(
    KnowledgeChunk Chunk,
    float[] Embedding);

public sealed record RetrievedChunk(
    KnowledgeChunk Chunk,
    float Score);
