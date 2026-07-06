// Harga dalam $ per 1,000,000 token. Sumber: dokumentasi resmi Sumopod.
// Pakai harga non-promo (harga normal) untuk perhitungan biaya — supaya tidak under-charge
// kalau promo berakhir. Update berkala sesuai perubahan harga dari Sumopod.
export const SUMOPOD_MODEL_PRICING: Record<string, { input: number; output: number }> = {
  "claude-haiku-4-5": { input: 1.00, output: 5.00 },
  "claude-opus-4-7": { input: 5.00, output: 25.00 },
  "claude-opus-4-8": { input: 5.00, output: 25.00 },
  "claude-sonnet-4-6": { input: 3.00, output: 15.00 },
  "deepseek-v4-flash": { input: 0.14, output: 0.28 },
  "deepseek-v4-pro": { input: 1.74, output: 3.48 },
  "gemini-2.5-flash": { input: 0.30, output: 2.50 },
  "gemini-2.5-flash-lite": { input: 0.10, output: 0.40 },
  "gemini-3-flash-preview": { input: 0.50, output: 3.00 },
  "gemini-3.1-flash-lite": { input: 0.25, output: 1.50 },
  "gemini-3.1-pro-preview": { input: 2.00, output: 12.00 },
  "gemini-3.5-flash": { input: 1.50, output: 9.00 },
  "gemini-embedding-001": { input: 0.15, output: 0 },
  "glm-5": { input: 0.60, output: 2.00 },
  "glm-5-turbo": { input: 1.20, output: 4.00 },
  "glm-5.1": { input: 1.40, output: 4.40 },
  "glm-5.2": { input: 1.40, output: 4.40 },
  "glm-5v-turbo": { input: 1.20, output: 4.00 },
  "gpt-4.1": { input: 2.00, output: 8.00 },
  "gpt-4.1-mini": { input: 0.40, output: 1.60 },
  "gpt-4.1-nano": { input: 0.10, output: 0.40 },
  "gpt-4o": { input: 2.50, output: 10.00 },
  "gpt-4o-mini": { input: 0.15, output: 0.60 },
  "gpt-5": { input: 1.25, output: 10.00 },
  "gpt-5-mini": { input: 0.25, output: 2.00 },
  "gpt-5-nano": { input: 0.05, output: 0.40 },
  "gpt-5.4": { input: 2.50, output: 15.00 },
  "gpt-5.4-mini": { input: 0.75, output: 4.50 },
  "gpt-5.4-nano": { input: 0.20, output: 1.25 },
  "kimi-k2.6": { input: 0.67, output: 3.39 },
  "kimi-k2.7": { input: 0.95, output: 4.00 },
  "mimo-v2.5": { input: 0.14, output: 0.28 },
  "mimo-v2.5-pro": { input: 1.74, output: 3.48 },
  "MiniMax-M2.7-highspeed": { input: 0.30, output: 1.20 },
  "MiniMax-M3": { input: 0.30, output: 1.20 },
  "qwen3.6-flash": { input: 0.25, output: 1.50 },
  "qwen3.6-plus": { input: 0.50, output: 3.00 },
  "qwen3.7-max": { input: 1.25, output: 3.75 },
  "qwen3.7-plus": { input: 0.32, output: 1.28 },
  "seed-2-0-code": { input: 0.50, output: 3.00 },
  "seed-2-0-lite": { input: 0.25, output: 2.00 },
  "seed-2-0-mini": { input: 0.10, output: 0.40 },
  "seed-2-0-pro": { input: 0.50, output: 3.00 },
  "text-embedding-3-large": { input: 0.13, output: 0 },
  "text-embedding-3-small": { input: 0.02, output: 0 },
};

/** Hitung biaya dalam micro-USD (1,000,000 = $1) berdasarkan token usage. */
export function calculateSumopodCostMicroUsd(
  model: string,
  inputTokens: number,
  outputTokens: number
): number {
  const pricing = SUMOPOD_MODEL_PRICING[model];
  if (!pricing) {
    throw new Error(`Model "${model}" tidak dikenali di tabel harga Sumopod.`);
  }
  const costUsd = (inputTokens / 1_000_000) * pricing.input + (outputTokens / 1_000_000) * pricing.output;
  return Math.ceil(costUsd * 1_000_000); // dibulatkan ke atas, micro-USD, hindari under-charge
}

/** Model yang dikurasi untuk pilihan default di UI — model murah & cocok untuk content generation. */
export const CURATED_SUMOPOD_MODELS = [
  "gpt-4o-mini",
  "gpt-5-mini",
  "gemini-2.5-flash",
  "claude-haiku-4-5",
  "deepseek-v4-flash",
  "qwen3.6-flash",
] as const;