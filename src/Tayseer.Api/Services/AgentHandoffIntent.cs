using System.Text.RegularExpressions;
using Tayseer.Api.Resources;

namespace Tayseer.Api.Services;


public static class AgentHandoffIntent
{
    private static readonly Regex Whitespace = new(@"\s+", RegexOptions.Compiled);

    public static bool IsMatch(string? text)
    {
        if (string.IsNullOrWhiteSpace(text))
        {
            return false;
        }

        var normalized = text.Trim().ToLowerInvariant();
        normalized = Whitespace.Replace(normalized, " ").Trim();

        return EnglishPatterns(normalized) || ArabicPatterns(text.Trim());
    }

    public static string Confirmation(bool isArabic) => ApiMessages.HandoffConfirmation(isArabic);

    private static bool EnglishPatterns(string text)
    {
        ReadOnlySpan<string> needles =
        [
            "talk to an agent",
            "talk to a agent",
            "talk to agent",
            "speak to an agent",
            "speak with an agent",
            "speak to a human",
            "speak with a human",
            "talk to a human",
            "talk to human",
            "human agent",
            "live agent",
            "live chat agent",
            "real person",
            "real human",
            "customer service",
            "customer support",
            "contact an agent",
            "connect me to an agent",
            "connect me with an agent",
            "transfer to agent",
            "transfer me to an agent",
            "i want an agent",
            "i need an agent",
            "chat with an agent",
            "chat with a human",
        ];

        foreach (var needle in needles)
        {
            if (text.Contains(needle, StringComparison.Ordinal))
            {
                return true;
            }
        }

        return false;
    }

    private static bool ArabicPatterns(string original)
    {
        ReadOnlySpan<string> needles =
        [
            "تحدث مع وكيل",
            "تحدث الى وكيل",
            "تحدث إلى وكيل",
            "كلم وكيل",
            "أريد وكيل",
            "ابي وكيل",
            "أبغى وكيل",
            "ممثل خدمة",
            "خدمة العملاء",
            "تحدث مع شخص",
            "ابي اتكلم مع احد",
            "أريد التحدث مع شخص",
            "محادثة حية",
            "دردشة مع وكيل",
        ];

        foreach (var needle in needles)
        {
            if (original.Contains(needle, StringComparison.OrdinalIgnoreCase))
            {
                return true;
            }
        }

        return false;
    }
}
