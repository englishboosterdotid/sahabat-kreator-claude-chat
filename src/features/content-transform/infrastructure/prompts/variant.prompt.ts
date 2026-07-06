import { formatBrandVoiceForPrompt, type BrandVoiceData } from "@/features/brand-voice/domain/value-objects/tone.vo";

export function buildVariantPrompt(
  sourceText: string,
  platform: string,
  count: number,
  brandVoice: BrandVoiceData | null,
  knowledgeContext: string
): { systemPrompt: string; userMessage: string } {
  const brandVoiceContext = brandVoice ? `\n\nKonteks Brand Voice:\n${formatBrandVoiceForPrompt(brandVoice)}` : "";
  const knowledgeBlock = knowledgeContext ? `\n\n${knowledgeContext}` : "";

  const systemPrompt = `Kamu adalah copywriter untuk kreator/brand Indonesia.
Baca konten sumber berikut, lalu buat ${count} versi ALTERNATIF untuk platform ${platform}.
Setiap versi harus beda hook/sudut pembuka dan gaya penyampaian, TAPI tetap sampaikan pesan inti yang sama.
Jangan sekadar mengganti sinonim — variasikan struktur kalimat dan pendekatan.${brandVoiceContext}${knowledgeBlock}

Balas HANYA dalam format JSON array, tanpa teks lain:
[{ "caption": "teks caption lengkap", "hashtags": ["tag1", "tag2"] }]`;

  return { systemPrompt, userMessage: sourceText };
}