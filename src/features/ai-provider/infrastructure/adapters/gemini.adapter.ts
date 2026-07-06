import { GoogleGenerativeAI } from "@google/generative-ai";
import type { IAIProviderAdapter, GenerateTextInput, GenerateTextOutput } from "../../domain/repositories/ai-provider-adapter";

export class GeminiAdapter implements IAIProviderAdapter {
  private client: GoogleGenerativeAI;
  private model: string;

  constructor(apiKey: string, model = "gemini-2.5-pro") {
    this.client = new GoogleGenerativeAI(apiKey);
    this.model = model;
  }

  async generateText(input: GenerateTextInput): Promise<GenerateTextOutput> {
    const model = this.client.getGenerativeModel({
      model: this.model,
      systemInstruction: input.systemPrompt,
    });

    const result = await model.generateContent(input.userMessage);
    const text = result.response.text();
    const usage = result.response.usageMetadata;

    return {
      text,
      inputTokens: usage?.promptTokenCount ?? 0,
      outputTokens: usage?.candidatesTokenCount ?? 0,
    };
  }
}