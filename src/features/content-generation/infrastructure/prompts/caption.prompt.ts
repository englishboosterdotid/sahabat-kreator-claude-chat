import { formatBrandVoiceForPrompt, type BrandVoiceData } from "@/features/brand-voice/domain/value-objects/tone.vo";
import type { ContentIdea } from "../../domain/entities/content-idea.entity";

const PLATFORM_CAPTION_GUIDE: Record<string, string> = {
  instagram: "Caption Instagram: bisa agak panjang, gunakan line break untuk readability, sertakan CTA di akhir.",
  tiktok: "Caption TikTok: singkat, catchy, casual, boleh pakai bahasa gaul yang relevan.",
  youtube: "Deskripsi YouTube: informatif, sertakan poin-poin penting, bisa lebih panjang dan terstruktur.",
  facebook: "Caption Facebook: percakapan, engaging, sertakan pertanyaan untuk dorong komentar.",
  x: "Post X: singkat, padat, maksimal sekitar 280 karakter, punchy.",
};

export function buildCaptionPrompt(
  idea: ContentIdea,
  platform: string,
  brandVoice: BrandVoiceData | null,
  platformOverride: string | null
): { systemPrompt: string; userMessage: string } {
  const brandVoiceContext = brandVoice
    ? `\n\nKonteks Brand Voice:\n${formatBrandVoiceForPrompt(brandVoice)}`
    : "";
  const overrideContext = platformOverride
    ? `\n\nPenyesuaian khusus untuk ${platform}: ${platformOverride}`
    : "";

  const systemPrompt = `Kamu adalah copywriter untuk kreator/brand Indonesia.
${PLATFORM_CAPTION_GUIDE[platform] ?? ""}${brandVoiceContext}${overrideContext}

Balas HANYA dalam format JSON, tanpa teks lain:
{ "caption": "teks caption lengkap", "hashtags": ["tag1", "tag2", "tag3"] }`;

  const userMessage = `Hook: ${idea.hook}\nPillar: ${idea.pillar}\nAngle: ${idea.angle}\n\nTulis caption lengkap berdasarkan ide ini.`;

  return { systemPrompt, userMessage };
}