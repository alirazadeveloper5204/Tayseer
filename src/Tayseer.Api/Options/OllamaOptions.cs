namespace Tayseer.Api.Options;

public sealed class OllamaOptions
{
    public const string SectionName = "Ollama";


    public string BaseUrl { get; set; } = "http://localhost:11434";


    public string Model { get; set; } = "llama3.2";


    public string EmbeddingModel { get; set; } = "nomic-embed-text";

    public int TimeoutSeconds { get; set; } = 120;


    public bool RagEnabled { get; set; } = true;


    public int RagTopK { get; set; } = 5;
}
