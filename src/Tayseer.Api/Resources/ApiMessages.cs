using System.Globalization;
using System.Resources;

namespace Tayseer.Api.Resources;


public static class ApiMessages
{
    private static readonly ResourceManager Manager =
        new("Tayseer.Api.Resources.Messages", typeof(ApiMessages).Assembly);

    private static readonly CultureInfo English = CultureInfo.GetCultureInfo("en");
    private static readonly CultureInfo Arabic = CultureInfo.GetCultureInfo("ar");

    public static bool IsArabic(string? lang) =>
        string.Equals(lang, "ar", StringComparison.OrdinalIgnoreCase);

    public static string Get(string name, bool isArabic) =>
        Manager.GetString(name, isArabic ? Arabic : English)
        ?? Manager.GetString(name, English)
        ?? name;

    public static string Get(string name, string? lang) => Get(name, IsArabic(lang));

    public static string Format(string name, bool isArabic, params object[] args) =>
        string.Format(isArabic ? Arabic : English, Get(name, isArabic), args);

    public static string Format(string name, string? lang, params object[] args) =>
        Format(name, IsArabic(lang), args);

    public static string HandoffConfirmation(bool isArabic) => Get(nameof(HandoffConfirmation), isArabic);

    public static string AgentWaitingConnected(string? lang) => Get(nameof(AgentWaitingConnected), lang);

    public static string FahimTranscriptSummaryPrefix(string? lang) =>
        Get(nameof(FahimTranscriptSummaryPrefix), lang);

    public static string AgentJoined(string? lang, string adminName) =>
        Format(nameof(AgentJoined), lang, adminName);

    public static string AgentClosed(string? lang, string adminName) =>
        Format(nameof(AgentClosed), lang, adminName);

    public static string AgentChatRequestSubject(string? lang) => Get(nameof(AgentChatRequestSubject), lang);

    public static string KnowledgeContextHeader(bool isArabic) => Get(nameof(KnowledgeContextHeader), isArabic);

    public static string FahimSystemPrompt(bool isArabic) => Get(nameof(FahimSystemPrompt), isArabic);
}
