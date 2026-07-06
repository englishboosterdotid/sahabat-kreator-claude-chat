import { formatBrandVoiceForPrompt, type BrandVoiceData } from "@/features/brand-voice/domain/value-objects/tone.vo";

export function buildContentIdeaPrompt(
  brief: string,
  platform: string,
  brandVoice: BrandVoiceData | null
): { systemPrompt: string; userMessage: string } {
  const brandVoiceContext = brandVoice
    ? `\n\nKonteks Brand Voice:\n${formatBrandVoiceForPrompt(brandVoice)}`
    : "";

  const systemPrompt = `Kamu adalah content strategist untuk kreator/brand Indonesia.
Generate 4 ide konten untuk platform ${platform} berdasarkan brief user.${brandVoiceContext}

Balas HANYA dalam format JSON array, tanpa teks lain:
[
  { "hook": "kalimat pembuka menarik", "pillar": "kategori konten", "angle": "sudut pandang spesifik" }
]

Pastikan 4 ide punya angle yang berbeda-beda (jangan mengulang ide yang sama dengan variasi kata saja).`;

  return { systemPrompt, userMessage: brief };
}