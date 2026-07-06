export type BrandVoiceData = {
  brandName: string | null;
  tagline: string | null;
  industry: string | null;
  toneDescription: string | null;
  personalityTraits: string[];
  dos: string[];
  donts: string[];
  targetAudience: string | null;
};

export function isBrandVoiceEmpty(data: BrandVoiceData): boolean {
  return (
    !data.brandName &&
    !data.toneDescription &&
    data.personalityTraits.length === 0 &&
    data.dos.length === 0 &&
    data.donts.length === 0
  );
}

export function formatBrandVoiceForPrompt(data: BrandVoiceData): string {
  const parts: string[] = [];
  if (data.brandName) parts.push(`Nama brand: ${data.brandName}`);
  if (data.tagline) parts.push(`Tagline: ${data.tagline}`);
  if (data.industry) parts.push(`Industri: ${data.industry}`);
  if (data.toneDescription) parts.push(`Tone: ${data.toneDescription}`);
  if (data.personalityTraits.length) parts.push(`Kepribadian: ${data.personalityTraits.join(", ")}`);
  if (data.dos.length) parts.push(`Selalu: ${data.dos.join("; ")}`);
  if (data.donts.length) parts.push(`Hindari: ${data.donts.join("; ")}`);
  if (data.targetAudience) parts.push(`Target audiens: ${data.targetAudience}`);
  return parts.join("\n");
}