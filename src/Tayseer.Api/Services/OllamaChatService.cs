using System.Net.Http.Json;
using System.Text;
using System.Text.Json;
using System.Text.Json.Serialization;
using Microsoft.Extensions.Options;
using Tayseer.Api.Contracts;
using Tayseer.Api.Options;
using Tayseer.Api.Services.Rag;

namespace Tayseer.Api.Services;

public sealed class OllamaChatService(
    HttpClient http,
    IOptions<OllamaOptions> options,
    KnowledgeIndexService knowledge,
    ILogger<OllamaChatService> logger)
{
    private static readonly JsonSerializerOptions JsonOptions = new()
    {
        PropertyNamingPolicy = JsonNamingPolicy.SnakeCaseLower,
        DefaultIgnoreCondition = JsonIgnoreCondition.WhenWritingNull,
    };

    private readonly OllamaOptions _options = options.Value;

    public async Task<ChatResponseDto> ChatAsync(ChatRequestDto request, CancellationToken ct)
    {
        if (request.Messages is null || request.Messages.Count == 0)
        {
            throw new ArgumentException("At least one message is required.", nameof(request));
        }

        var isArabic = string.Equals(request.Lang, "ar", StringComparison.OrdinalIgnoreCase);
        var latestUser = request.Messages
            .LastOrDefault(m => string.Equals(m.Role, "user", StringComparison.OrdinalIgnoreCase))
            ?.Content
            ?.Trim();

        IReadOnlyList<RetrievedChunk> retrieved = [];
        if (!string.IsNullOrWhiteSpace(latestUser))
        {
            try
            {
                retrieved = await knowledge.RetrieveAsync(latestUser, request.Lang, ct);
            }
            catch (Exception ex)
            {
                logger.LogWarning(ex, "RAG retrieval failed; continuing without knowledge context");
            }
        }

        var payload = new OllamaChatRequest(
            Model: _options.Model,
            Messages: BuildMessages(request.Messages, isArabic, retrieved),
            Stream: false);

        using var response = await http.PostAsJsonAsync("/api/chat", payload, JsonOptions, ct);

        if (!response.IsSuccessStatusCode)
        {
            var body = await response.Content.ReadAsStringAsync(ct);
            logger.LogWarning("Ollama returned {Status}: {Body}", (int)response.StatusCode, body);
            throw new HttpRequestException(
                $"Ollama request failed ({(int)response.StatusCode}). Is Ollama running and is model '{_options.Model}' pulled?");
        }

        var result = await response.Content.ReadFromJsonAsync<OllamaChatResponse>(JsonOptions, ct)
            ?? throw new InvalidOperationException("Empty response from Ollama.");

        var reply = result.Message?.Content?.Trim();
        if (string.IsNullOrWhiteSpace(reply))
        {
            throw new InvalidOperationException("Ollama returned an empty message.");
        }

        var sources = retrieved
            .Select(r => new ChatSourceDto(r.Chunk.Title, r.Chunk.SourceType, r.Chunk.SourceKey, r.Score))
            .ToList();

        return new ChatResponseDto(reply, result.Model ?? _options.Model, sources);
    }

    private static List<OllamaMessage> BuildMessages(
        IReadOnlyList<ChatMessageDto> messages,
        bool isArabic,
        IReadOnlyList<RetrievedChunk> retrieved)
    {
        var list = new List<OllamaMessage>(messages.Count + 1)
        {
            new("system", BuildSystemPrompt(isArabic, retrieved)),
        };

        foreach (var message in messages.TakeLast(20))
        {
            var role = NormalizeRole(message.Role);
            if (role is null || string.IsNullOrWhiteSpace(message.Content))
            {
                continue;
            }

            list.Add(new OllamaMessage(role, message.Content.Trim()));
        }

        return list;
    }

    private static string? NormalizeRole(string? role)
    {
        if (string.IsNullOrWhiteSpace(role))
        {
            return null;
        }

        return role.Trim().ToLowerInvariant() switch
        {
            "user" => "user",
            "assistant" => "assistant",
            "system" => null,
            _ => null,
        };
    }

    private static string BuildSystemPrompt(bool isArabic, IReadOnlyList<RetrievedChunk> retrieved)
    {
        var sb = new StringBuilder();
        if (isArabic)
        {
            sb.AppendLine("""
                أنت فهيم (Fahim AI)، مساعد الذكاء الاصطناعي لموقع تيسير للابتكارات (Tayseer Innovations). أجب باختصار وبأسلوب احترافي بالعربية.
                قدّم نفسك باسم فهيم عند الحاجة.
                اعتمد على سياق المعرفة أدناه إن وُجد. إذا لم يكفِ السياق، قل ذلك باختصار ووجّه الزائر للتواصل مع فريق تيسير.
                لا تختلق معلومات حساسة أو أسعار غير مؤكدة.
                البريد: info@tayseer.me — الموقع: tayseer.me
                """);
        }
        else
        {
            sb.AppendLine("""
                You are Fahim AI, the AI assistant for the Tayseer Innovations website. Reply briefly and professionally in English.
                Introduce yourself as Fahim AI when relevant.
                Prefer facts from the knowledge context below when present. If the context is insufficient, say so briefly and invite the visitor to contact the Tayseer team.
                Do not invent sensitive details or unverified pricing.
                Email: info@tayseer.me — Site: tayseer.me
                """);
        }

        if (retrieved.Count > 0)
        {
            sb.AppendLine();
            sb.AppendLine(isArabic ? "سياق المعرفة من محتوى تيسير:" : "Knowledge context from Tayseer CMS content:");
            var i = 1;
            foreach (var item in retrieved)
            {
                sb.AppendLine($"[{i}] {item.Chunk.Title} ({item.Chunk.SourceType}/{item.Chunk.SourceKey})");
                sb.AppendLine(item.Chunk.Content.Trim());
                sb.AppendLine();
                i++;
            }
        }

        return sb.ToString().Trim();
    }

    private sealed record OllamaChatRequest(string Model, IReadOnlyList<OllamaMessage> Messages, bool Stream);

    private sealed record OllamaMessage(string Role, string Content);

    private sealed record OllamaChatResponse(
        string? Model,
        OllamaMessage? Message);
}
