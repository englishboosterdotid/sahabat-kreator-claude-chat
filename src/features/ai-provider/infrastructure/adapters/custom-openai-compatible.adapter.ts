import OpenAI from "openai";
import type { IAIProviderAdapter, GenerateTextInput, GenerateTextOutput } from "../../domain/repositories/ai-provider-adapter";

export class CustomOpenAiCompatibleAdapter implements IAIProviderAdapter {
  private client: OpenAI;
  private model: string;

  constructor(apiKey: string, baseUrl: string, model: string) {
    this.client = new OpenAI({ apiKey, baseURL: baseUrl });
    this.model = model;
  }

  async generateText(input: GenerateTextInput): Promise<GenerateTextOutput> {
    const response = await this.client.chat.completions.create({
      model: this.model,
      max_tokens: input.maxTokens ?? 1000,
      messages: [
        ...(input.systemPrompt ? [{ role: "system" as const, content: input.systemPrompt }] : []),
        { role: "user" as const, content: input.userMessage },
      ],
    });

    const text = response.choices[0]?.message?.content;
    if (!text) throw new Error("Provider custom tidak mengembalikan respons teks.");

    return {
      text,
      inputTokens: response.usage?.prompt_tokens ?? 0,
      outputTokens: response.usage?.completion_tokens ?? 0,
    };
  }
}