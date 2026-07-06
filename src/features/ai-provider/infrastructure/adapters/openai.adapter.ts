import OpenAI from "openai";
import type { IAIProviderAdapter, GenerateTextInput, GenerateTextOutput } from "../../domain/repositories/ai-provider-adapter";

export class OpenAiAdapter implements IAIProviderAdapter {
  private client: OpenAI;
  private model: string;

  constructor(apiKey: string, model = "gpt-4o") {
    this.client = new OpenAI({ apiKey });
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
    if (!text) throw new Error("OpenAI tidak mengembalikan respons teks.");

    return {
      text,
      inputTokens: response.usage?.prompt_tokens ?? 0,
      outputTokens: response.usage?.completion_tokens ?? 0,
    };
  }
}