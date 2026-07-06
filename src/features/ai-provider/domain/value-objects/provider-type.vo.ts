export type AIProviderType = "anthropic" | "openai" | "gemini" | "custom" | "platform_sumopod";

export const AI_PROVIDER_LABELS: Record<AIProviderType, string> = {
  anthropic: "Anthropic (Claude)",
  openai: "OpenAI (GPT)",
  gemini: "Google Gemini",
  custom: "Custom URL (OpenAI-compatible)",
  platform_sumopod: "Token Platform (dikelola Sahabat Kreator)",
};

export function requiresApiKey(type: AIProviderType): boolean {
  return type !== "platform_sumopod";
}

export function requiresBaseUrl(type: AIProviderType): boolean {
  return type === "custom";
}