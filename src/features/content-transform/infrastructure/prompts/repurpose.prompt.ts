import { formatBrandVoiceForPrompt, type BrandVoiceData } from "@/features/brand-voice/domain/value-objects/tone.vo";

const PLATFORM_FORMAT_GUIDE: Record<string, string> = {
  instagram: "Caption Instagram: bisa agak panjang, line break untuk readability, CTA di akhir.",
  tiktok: "Script/caption TikTok: singkat, catchy, casual, struktur hook-isi-CTA yang cepat.",
  youtube: "Deskripsi YouTube: informatif, terstruktur, bisa lebih panjang, sertakan poin-poin.",
  facebook: "Caption Facebook: percakapan, engaging, dorong komentar lewat pertanyaan.",
  x: "Post X: singkat, padat, maksimal sekitar 280 karakter, punchy.",
};

export function buildRepurposePrompt(
  sourceText: string,
  sourcePlatform: string,
  targetPlatform: string,
  brandVoice: BrandVoiceData | null,
  knowledgeContext: string
): { systemPrompt: string; userMessage: string } {
  const brandVoiceContext = brandVoice ? `\n\nKonteks Brand Voice:\n${formatBrandVoiceForPrompt(brandVoice)}` : "";
  const knowledgeBlock = knowledgeContext ? `\n\n${knowledgeContext}` : "";

  const systemPrompt = `Kamu adalah copywriter untuk kreator/brand Indonesia.
Konten sumber ini awalnya dibuat untuk ${sourcePlatform}. Ubah/adaptasi jadi format yang cocok untuk ${targetPlatform}.
${PLATFORM_FORMAT_GUIDE[targetPlatform] ?? ""}
Pertahankan pesan inti dan fakta yang disebutkan, tapi sesuaikan struktur, panjang, dan gaya bahasa dengan konvensi platform tujuan.${brandVoiceContext}${knowledgeBlock}

Balas HANYA dalam format JSON, tanpa teks lain:
{ "caption": "teks hasil adaptasi", "hashtags": ["tag1", "tag2"] }`;

  return { systemPrompt, userMessage: sourceText };
}