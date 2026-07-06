import Anthropic from "@anthropic-ai/sdk";
import type { IAIProviderAdapter, GenerateTextInput, GenerateTextOutput } from "../../domain/repositories/ai-provider-adapter";

export class AnthropicAdapter implements IAIProviderAdapter {
  private client: Anthropic;
  private model: string;

  constructor(apiKey: string, model = "claude-sonnet-4-6") {
    this.client = new Anthropic({ apiKey });
    this.model = model;
  }

  async generateText(input: GenerateTextInput): Promise<GenerateTextOutput> {
    const response = await this.client.messages.create({
      model: this.model,
      max_tokens: input.maxTokens ?? 1000,
      system: input.systemPrompt,
      messages: [{ role: "user", content: input.userMessage }],
    });

    const textBlock = response.content.find((b) => b.type === "text");
    if (!textBlock || textBlock.type !== "text") {
      throw new Error("Anthropic tidak mengembalikan respons teks.");
    }

    return {
      text: textBlock.text,
      inputTokens: response.usage.input_tokens,
      outputTokens: response.usage.output_tokens,
    };
  }
}