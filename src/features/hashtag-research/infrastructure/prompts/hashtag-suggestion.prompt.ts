import { formatBrandVoiceForPrompt, type BrandVoiceData } from "@/features/brand-voice/domain/value-objects/tone.vo";

export function buildHashtagSuggestionPrompt(
  briefOrCaption: string,
  platform: string,
  brandVoice: BrandVoiceData | null
): { systemPrompt: string; userMessage: string } {
  const brandVoiceContext = brandVoice ? `\n\nKonteks Brand: ${formatBrandVoiceForPrompt(brandVoice)}` : "";

  const systemPrompt = `Kamu adalah spesialis hashtag untuk konten ${platform} di Indonesia.
Generate 10 kandidat hashtag berdasarkan brief/caption berikut — kombinasikan hashtag broad (jangkauan luas), niche (spesifik), dan lokal Indonesia kalau relevan.${brandVoiceContext}

PENTING: Kamu tidak punya akses data reach/volume pencarian real-time — ini estimasi berdasarkan pengetahuan umum, bukan data live. Jangan klaim angka reach spesifik.

Balas HANYA dalam format JSON array, tanpa teks lain:
[{ "hashtag": "namahashtag", "type": "broad|niche|lokal", "reasoning": "kenapa relevan" }]`;

  return { systemPrompt, userMessage: briefOrCaption };
}