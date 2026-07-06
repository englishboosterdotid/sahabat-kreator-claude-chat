import OpenAI from "openai";
import type { IAIProviderAdapter, GenerateTextInput, GenerateTextOutput } from "../../domain/repositories/ai-provider-adapter";

const SUMOPOD_BASE_URL = "https://ai.sumopod.com/v1";

export class SumopodAdapter implements IAIProviderAdapter {
  private client: OpenAI;
  private model: string;

  constructor(apiKey: string, model: string) {
    this.client = new OpenAI({ apiKey, baseURL: SUMOPOD_BASE_URL });
    this.model = model;
  }

  async generateText(input: GenerateTextInput): Promise<GenerateTextOutput> {
    const response = await this.client.chat.completions.create({
      model: this.model,
      max_tokens: input.maxTokens ?? 1000,
      temperature: 0.7,
      messages: [
        ...(input.systemPrompt ? [{ role: "system" as const, content: input.systemPrompt }] : []),
        { role: "user" as const, content: input.userMessage },
      ],
    });

    const text = response.choices[0]?.message?.content;
    if (!text) throw new Error("Sumopod tidak mengembalikan respons teks.");

    return {
      text,
      inputTokens: response.usage?.prompt_tokens ?? 0,
      outputTokens: response.usage?.completion_tokens ?? 0,
    };
  }
}