import OpenAI from "openai";

const SUMOPOD_BASE_URL = "https://ai.sumopod.com/v1";
const EMBEDDING_MODEL = "text-embedding-3-small"; // $0.02/1M token — murah, cukup akurat untuk knowledge base

const client = new OpenAI({
  apiKey: process.env.SUMOPOD_PLATFORM_API_KEY!,
  baseURL: SUMOPOD_BASE_URL,
});

/**
 * Selalu pakai platform key (Sumopod), terlepas dari provider chat yang dipilih workspace.
 * Alasan: embedding adalah operasi internal untuk retrieval, bukan output yang dilihat user,
 * jadi tidak perlu ikut preferensi BYOK workspace — cukup satu model murah yang konsisten.
 */
export async function generateEmbedding(text: string): Promise<number[]> {
  const response = await client.embeddings.create({
    model: EMBEDDING_MODEL,
    input: text,
  });
  return response.data[0].embedding;
}