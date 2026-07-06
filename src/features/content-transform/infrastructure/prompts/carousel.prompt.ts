import { formatBrandVoiceForPrompt, type BrandVoiceData } from "@/features/brand-voice/domain/value-objects/tone.vo";

export function buildCarouselPrompt(
  sourceText: string,
  slideCount: number,
  brandVoice: BrandVoiceData | null,
  knowledgeContext: string
): { systemPrompt: string; userMessage: string } {
  const brandVoiceContext = brandVoice ? `\n\nKonteks Brand Voice:\n${formatBrandVoiceForPrompt(brandVoice)}` : "";
  const knowledgeBlock = knowledgeContext ? `\n\n${knowledgeContext}` : "";

  const systemPrompt = `Kamu adalah content designer untuk carousel Instagram/LinkedIn ala Indonesia.
Pecah konten sumber berikut jadi TEPAT ${slideCount} slide carousel:
- Slide 1: hook kuat yang bikin orang berhenti scroll (singkat, 1-2 kalimat besar)
- Slide 2 sampai ${slideCount - 1}: isi/poin utama, 1 ide per slide, singkat dan mudah dibaca (maks 3 baris pendek)
- Slide ${slideCount}: CTA (ajakan bertindak) + ringkasan singkat

Setiap slide harus SINGKAT karena akan ditampilkan sebagai teks besar di gambar, bukan paragraf panjang.${brandVoiceContext}${knowledgeBlock}

Balas HANYA dalam format JSON array berisi ${slideCount} string, tanpa teks lain:
["teks slide 1", "teks slide 2", ...]`;

  return { systemPrompt, userMessage: sourceText };
}