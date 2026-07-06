export const RISK_LEVEL_LABELS: Record<string, { label: string; color: string }> = {
  low: { label: "Risiko Rendah", color: "#059669" },
  medium: { label: "Risiko Sedang", color: "#D97706" },
  high: { label: "Risiko Tinggi", color: "#DC2626" },
};

// Industri yang paling sering kena masalah klaim — dipakai untuk kalibrasi prompt
export const HIGH_SCRUTINY_INDUSTRIES = ["skincare", "kesehatan", "obat", "suplemen", "makanan", "minuman", "kosmetik"];