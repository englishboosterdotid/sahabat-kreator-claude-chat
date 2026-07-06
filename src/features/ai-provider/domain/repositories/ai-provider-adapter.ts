export type GenerateTextInput = {
  systemPrompt?: string;
  userMessage: string;
  maxTokens?: number;
};

export type GenerateTextOutput = {
  text: string;
  inputTokens: number;
  outputTokens: number;
};

export interface IAIProviderAdapter {
  generateText(input: GenerateTextInput): Promise<GenerateTextOutput>;
}