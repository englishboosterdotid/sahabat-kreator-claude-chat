import type { IAIProviderAdapter } from "../domain/repositories/ai-provider-adapter";
import { AnthropicAdapter } from "./adapters/anthropic.adapter";
import { OpenAiAdapter } from "./adapters/openai.adapter";
import { GeminiAdapter } from "./adapters/gemini.adapter";
import { CustomOpenAiCompatibleAdapter } from "./adapters/custom-openai-compatible.adapter";
import { SumopodAdapter } from "./adapters/sumopod.adapter";
import { decryptApiKey } from "./crypto/encrypt-api-key";
import type { AIProviderType } from "../domain/value-objects/provider-type.vo";

type ProviderConfigRow = {
  providerType: AIProviderType;
  apiKeyEncrypted: string | null;
  customBaseUrl: string | null;
  model: string | null;
};

export function createAIProviderAdapter(config: ProviderConfigRow): IAIProviderAdapter {
  switch (config.providerType) {
    case "anthropic":
      return new AnthropicAdapter(decryptApiKey(config.apiKeyEncrypted!), config.model ?? undefined);

    case "openai":
      return new OpenAiAdapter(decryptApiKey(config.apiKeyEncrypted!), config.model ?? undefined);

    case "gemini":
      return new GeminiAdapter(decryptApiKey(config.apiKeyEncrypted!), config.model ?? undefined);

    case "custom":
      if (!config.customBaseUrl || !config.model) {
        throw new Error("Custom provider butuh baseUrl dan model.");
      }
      return new CustomOpenAiCompatibleAdapter(
        decryptApiKey(config.apiKeyEncrypted!),
        config.customBaseUrl,
        config.model
      );

      case "platform_sumopod":
  return new SumopodAdapter(
    process.env.SUMOPOD_PLATFORM_API_KEY!,
    config.model ?? "gpt-4o-mini" // default model murah kalau workspace belum pilih
  );

    default:
      throw new Error(`Provider type tidak dikenali: ${config.providerType}`);
  }
}