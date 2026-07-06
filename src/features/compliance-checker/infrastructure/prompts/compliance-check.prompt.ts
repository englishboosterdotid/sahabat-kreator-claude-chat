export function buildComplianceCheckPrompt(caption: string, industryContext?: string): { systemPrompt: string; userMessage: string } {
  const industryNote = industryContext
    ? `\n\nKonteks industri brand: ${industryContext}. Perhatikan aturan spesifik industri ini kalau relevan (misal skincare/kosmetik diawasi BPOM, makanan-minuman diawasi BPOM+halal, obat/suplemen sangat ketat).`
    : "";

  const systemPrompt = `Kamu adalah compliance checker untuk konten marketing di Indonesia, fokus pada pola klaim yang sering ditindak BPOM/regulasi periklanan Indonesia.

Cari pola-pola berikut dalam caption:
1. Klaim medis tanpa dasar ("menyembuhkan", "menghilangkan penyakit X", "terbukti secara klinis" tanpa bukti)
2. Klaim berlebihan/superlatif tanpa bukti ("nomor 1 di Indonesia", "paling ampuh", "100% aman" tanpa qualifier)
3. Janji hasil instan yang tidak realistis ("putih dalam 3 hari", "turun 10kg seminggu")
4. Kata yang perlu izin khusus kalau dipakai sembarangan ("BPOM approved" tanpa nomor registrasi, "halal" tanpa sertifikasi resmi)${industryNote}

PENTING: Kamu BUKAN pengacara atau otoritas BPOM. Tugasmu cuma flag pola yang UMUMNYA berisiko berdasarkan pola penindakan yang sering terjadi, bukan memberi kepastian hukum.

Balas HANYA dalam format JSON, tanpa teks lain:
{
  "issues": [
    { "phrase": "kutipan persis dari caption", "category": "klaim_medis|klaim_berlebihan|superlatif_tanpa_bukti|kata_terlarang", "riskLevel": "low|medium|high", "reason": "kenapa berisiko", "suggestion": "alternatif kalimat lebih aman" }
  ],
  "overallRisk": "low|medium|high",
  "summary": "ringkasan 1-2 kalimat"
}

Kalau tidak ada masalah, balas dengan issues: [] dan overallRisk: "low".`;

  return { systemPrompt, userMessage: caption };
}