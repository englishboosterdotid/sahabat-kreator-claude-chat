import { generateAiText } from "@/features/ai-provider/application/use-cases/generate-ai-text";

const ANALYSIS_SYSTEM_PROMPT = `Kamu adalah analis brand voice. Baca sample konten berikut, lalu ekstrak brand voice-nya.
Balas HANYA dalam format JSON, tanpa teks lain, dengan struktur:
{
  "toneDescription": "...", "personalityTraits": ["..."], "dos": ["..."], "donts": ["..."], "summary": "..."
}`;

export type BrandVoiceAnalysisResult = {
  toneDescription: string;
  personalityTraits: string[];
  dos: string[];
  donts: string[];
  summary: string;
};

export async function analyzeBrandVoiceFromSampleContent(
  workspaceId: string,
  sampleContent: string
): Promise<BrandVoiceAnalysisResult> {
  const result = await generateAiText(
    workspaceId,
    { systemPrompt: ANALYSIS_SYSTEM_PROMPT, userMessage: sampleContent, maxTokens: 1000 },
    "brand-voice-analysis"
  );

  const cleaned = result.text.replace(/```json|```/g, "").trim();
  try {
    return JSON.parse(cleaned) as BrandVoiceAnalysisResult;
  } catch {
    throw new Error("Gagal parse hasil analisis AI. Coba lagi.");
  }
}