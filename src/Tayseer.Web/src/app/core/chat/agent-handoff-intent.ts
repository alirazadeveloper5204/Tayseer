/** Detects short intents to speak with a human agent (EN + AR). */
export function isAgentHandoffIntent(text: string): boolean {
  const trimmed = text.trim();
  if (!trimmed) {
    return false;
  }

  const en = trimmed.toLowerCase().replace(/\s+/g, ' ');
  const englishNeedles = [
    'talk to an agent',
    'talk to a agent',
    'talk to agent',
    'speak to an agent',
    'speak with an agent',
    'speak to a human',
    'speak with a human',
    'talk to a human',
    'talk to human',
    'human agent',
    'live agent',
    'live chat agent',
    'real person',
    'real human',
    'customer service',
    'customer support',
    'contact an agent',
    'connect me to an agent',
    'connect me with an agent',
    'transfer to agent',
    'transfer me to an agent',
    'i want an agent',
    'i need an agent',
    'chat with an agent',
    'chat with a human',
  ];

  if (englishNeedles.some((n) => en.includes(n))) {
    return true;
  }

  const arabicNeedles = [
    'تحدث مع وكيل',
    'تحدث الى وكيل',
    'تحدث إلى وكيل',
    'كلم وكيل',
    'أريد وكيل',
    'ابي وكيل',
    'أبغى وكيل',
    'ممثل خدمة',
    'خدمة العملاء',
    'تحدث مع شخص',
    'ابي اتكلم مع احد',
    'أريد التحدث مع شخص',
    'محادثة حية',
    'دردشة مع وكيل',
  ];

  return arabicNeedles.some((n) => trimmed.includes(n));
}
