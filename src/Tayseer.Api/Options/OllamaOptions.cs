namespace Tayseer.Api.Options;

public sealed class OllamaOptions
{
    public const string SectionName = "Ollama";

    /// <summary>Ollama HTTP API base URL (default local install).</summary>
    public string BaseUrl { get; set; } = "http://localhost:11434";

    /// <summary>Chat model name as shown by <c>ollama list</c>.</summary>
    public string Model { get; set; } = "llama3.2";

    /// <summary>Embedding model for RAG (e.g. nomic-embed-text).</summary>
    public string EmbeddingModel { get; set; } = "nomic-embed-text";

    public int TimeoutSeconds { get; set; } = 120;

    /// <summary>When true, chat answers are grounded with CMS retrieval.</summary>
    public bool RagEnabled { get; set; } = true;

    /// <summary>Max knowledge chunks injected into the system prompt.</summary>
    public int RagTopK { get; set; } = 5;
}
