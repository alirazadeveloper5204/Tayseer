using Microsoft.Extensions.Options;
using Tayseer.Api.Contracts;
using Tayseer.Api.Options;
using Tayseer.Api.Services;
using Tayseer.Api.Services.Rag;

namespace Tayseer.Api.Endpoints;

public static class ChatEndpoints
{
    public static RouteGroupBuilder MapChatEndpoints(this IEndpointRouteBuilder app)
    {
        var group = app.MapGroup("/api/v1").WithTags("Chat");

        group.MapPost("/chat", async (
            ChatRequestDto request,
            OllamaChatService chat,
            ILoggerFactory loggerFactory,
            CancellationToken ct) =>
        {
            var logger = loggerFactory.CreateLogger("ChatEndpoints");

            if (request.Messages is null || request.Messages.Count == 0)
            {
                return Results.BadRequest(new ChatErrorDto("Messages are required."));
            }

            if (request.Messages.Count > 40)
            {
                return Results.BadRequest(new ChatErrorDto("Too many messages in the conversation."));
            }

            try
            {
                var response = await chat.ChatAsync(request, ct);
                return Results.Ok(response);
            }
            catch (ArgumentException ex)
            {
                return Results.BadRequest(new ChatErrorDto(ex.Message));
            }
            catch (HttpRequestException ex)
            {
                logger.LogWarning(ex, "Chat backend unavailable");
                return Results.Json(
                    new ChatErrorDto(
                        "Chat is temporarily unavailable.",
                        "Start Ollama locally (`ollama serve`) and ensure the configured models are pulled."),
                    statusCode: StatusCodes.Status503ServiceUnavailable);
            }
            catch (TaskCanceledException) when (!ct.IsCancellationRequested)
            {
                return Results.Json(
                    new ChatErrorDto("The model took too long to respond. Try a smaller model or shorter question."),
                    statusCode: StatusCodes.Status504GatewayTimeout);
            }
            catch (Exception ex)
            {
                logger.LogError(ex, "Unexpected chat failure");
                return Results.Json(
                    new ChatErrorDto("Unexpected chat error."),
                    statusCode: StatusCodes.Status500InternalServerError);
            }
        })
        .WithName("Chat")
        .Produces<ChatResponseDto>(StatusCodes.Status200OK)
        .Produces<ChatErrorDto>(StatusCodes.Status400BadRequest)
        .Produces<ChatErrorDto>(StatusCodes.Status503ServiceUnavailable);

        group.MapGet("/chat/knowledge", (
            InMemoryKnowledgeIndex index,
            IOptions<OllamaOptions> options) =>
        {
            var ollama = options.Value;
            return Results.Ok(new KnowledgeStatusDto(
                ollama.RagEnabled,
                index.Count,
                index.BuiltAtUtc,
                index.LastError,
                ollama.EmbeddingModel));
        })
        .WithName("ChatKnowledgeStatus")
        .Produces<KnowledgeStatusDto>(StatusCodes.Status200OK);

        group.MapPost("/chat/knowledge/reindex", async (
            KnowledgeIndexService knowledge,
            ILoggerFactory loggerFactory,
            CancellationToken ct) =>
        {
            var logger = loggerFactory.CreateLogger("ChatEndpoints");
            try
            {
                var count = await knowledge.RebuildAsync(ct);
                return Results.Ok(new { chunkCount = count });
            }
            catch (HttpRequestException ex)
            {
                logger.LogWarning(ex, "Knowledge reindex failed");
                return Results.Json(
                    new ChatErrorDto("Failed to rebuild knowledge index.", ex.Message),
                    statusCode: StatusCodes.Status503ServiceUnavailable);
            }
            catch (Exception ex)
            {
                logger.LogError(ex, "Unexpected knowledge reindex failure");
                return Results.Json(
                    new ChatErrorDto("Unexpected knowledge reindex error."),
                    statusCode: StatusCodes.Status500InternalServerError);
            }
        })
        .WithName("ChatKnowledgeReindex");

        return group;
    }
}
