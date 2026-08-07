using Microsoft.Extensions.Options;
using Tayseer.Api.Options;

namespace Tayseer.Api.Services.Rag;

public sealed class KnowledgeIndexService(
    CmsKnowledgeBuilder builder,
    OllamaEmbeddingClient embeddings,
    InMemoryKnowledgeIndex index,
    IOptions<OllamaOptions> options,
    ILogger<KnowledgeIndexService> logger)
{
    private static readonly SemaphoreSlim RebuildLock = new(1, 1);
    private readonly OllamaOptions _options = options.Value;

    public async Task<int> RebuildAsync(CancellationToken ct)
    {
        await RebuildLock.WaitAsync(ct);
        try
        {
            var docs = await builder.BuildAsync(ct);
            var indexed = new List<IndexedKnowledgeChunk>(docs.Count);

            foreach (var doc in docs)
            {
                ct.ThrowIfCancellationRequested();
                var vector = await embeddings.EmbedAsync(doc.Content, ct);
                indexed.Add(new IndexedKnowledgeChunk(doc, vector));
            }

            index.ReplaceAll(indexed, DateTimeOffset.UtcNow);
            logger.LogInformation("RAG knowledge index rebuilt with {Count} chunks", indexed.Count);
            return indexed.Count;
        }
        catch (Exception ex)
        {
            index.SetError(ex.Message);
            logger.LogError(ex, "Failed to rebuild RAG knowledge index");
            throw;
        }
        finally
        {
            RebuildLock.Release();
        }
    }

    public async Task<IReadOnlyList<RetrievedChunk>> RetrieveAsync(
        string query,
        string? lang,
        CancellationToken ct)
    {
        if (!_options.RagEnabled)
        {
            return [];
        }

        var snapshot = index.Snapshot();
        if (snapshot.IsDefaultOrEmpty)
        {
            return [];
        }

        var queryVector = await embeddings.EmbedAsync(query, ct);
        var preferAr = string.Equals(lang, "ar", StringComparison.OrdinalIgnoreCase);
        var topK = Math.Clamp(_options.RagTopK, 1, 12);

        return snapshot
            .Select(item =>
            {
                var score = CosineSimilarity(queryVector, item.Embedding);

                if (preferAr && item.Chunk.Language == "ar")
                {
                    score += 0.03f;
                }
                else if (!preferAr && item.Chunk.Language == "en")
                {
                    score += 0.03f;
                }

                return new RetrievedChunk(item.Chunk, score);
            })
            .OrderByDescending(x => x.Score)
            .Take(topK)
            .Where(x => x.Score > 0.15f)
            .ToList();
    }

    private static float CosineSimilarity(float[] a, float[] b)
    {
        var len = Math.Min(a.Length, b.Length);
        if (len == 0)
        {
            return 0f;
        }

        double dot = 0;
        double na = 0;
        double nb = 0;
        for (var i = 0; i < len; i++)
        {
            dot += a[i] * b[i];
            na += a[i] * a[i];
            nb += b[i] * b[i];
        }

        if (na <= 0 || nb <= 0)
        {
            return 0f;
        }

        return (float)(dot / (Math.Sqrt(na) * Math.Sqrt(nb)));
    }
}
