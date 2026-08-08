using System.Net.Http.Json;
using System.Text.Json;
using System.Text.Json.Serialization;
using Microsoft.Extensions.Options;
using Tayseer.Api.Options;

namespace Tayseer.Api.Services.Rag;

public sealed class OllamaEmbeddingClient(
    HttpClient http,
    IOptions<OllamaOptions> options,
    ILogger<OllamaEmbeddingClient> logger)
{
    private static readonly JsonSerializerOptions JsonOptions = new()
    {
        PropertyNamingPolicy = JsonNamingPolicy.SnakeCaseLower,
        DefaultIgnoreCondition = JsonIgnoreCondition.WhenWritingNull,
    };

    private readonly OllamaOptions _options = options.Value;

    public async Task<float[]> EmbedAsync(string text, CancellationToken ct)
    {
        var cleaned = text.Trim();
        if (cleaned.Length == 0)
        {
            throw new ArgumentException("Text to embed must not be empty.", nameof(text));
        }


        var modern = await TryModernEmbedAsync(cleaned, ct);
        if (modern is { Length: > 0 })
        {
            return modern;
        }

        return await LegacyEmbedAsync(cleaned, ct);
    }

    private async Task<float[]?> TryModernEmbedAsync(string text, CancellationToken ct)
    {
        var payload = new { model = _options.EmbeddingModel, input = text };
        using var response = await http.PostAsJsonAsync("/api/embed", payload, JsonOptions, ct);
        if (!response.IsSuccessStatusCode)
        {
            var body = await response.Content.ReadAsStringAsync(ct);
            logger.LogDebug("Ollama /api/embed returned {Status}: {Body}", (int)response.StatusCode, body);
            return null;
        }

        var result = await response.Content.ReadFromJsonAsync<ModernEmbedResponse>(JsonOptions, ct);
        var vector = result?.Embeddings?.FirstOrDefault();
        return vector is { Length: > 0 } ? vector : null;
    }

    private async Task<float[]> LegacyEmbedAsync(string text, CancellationToken ct)
    {
        var payload = new { model = _options.EmbeddingModel, prompt = text };
        using var response = await http.PostAsJsonAsync("/api/embeddings", payload, JsonOptions, ct);
        if (!response.IsSuccessStatusCode)
        {
            var body = await response.Content.ReadAsStringAsync(ct);
            logger.LogWarning("Ollama embeddings failed ({Status}): {Body}", (int)response.StatusCode, body);
            throw new HttpRequestException(
                $"Embedding failed ({(int)response.StatusCode}). Is model '{_options.EmbeddingModel}' pulled? Run: ollama pull {_options.EmbeddingModel}");
        }

        var result = await response.Content.ReadFromJsonAsync<LegacyEmbedResponse>(JsonOptions, ct)
            ?? throw new InvalidOperationException("Empty embedding response from Ollama.");

        if (result.Embedding is not { Length: > 0 })
        {
            throw new InvalidOperationException("Ollama returned an empty embedding vector.");
        }

        return result.Embedding;
    }

    private sealed record ModernEmbedResponse(float[][]? Embeddings);

    private sealed record LegacyEmbedResponse(float[]? Embedding);
}
