import { db } from "@/shared/infrastructure/database/client";
import { knowledgeEntry } from "@/shared/infrastructure/database/schema";
import { eq, and, sql } from "drizzle-orm";
import { generateEmbedding } from "../../infrastructure/embedding/embedding-service";
import { formatKnowledgeForPrompt, type KnowledgeEntry } from "../../domain/entities/knowledge-entry.entity";

const TOP_K_SEMANTIC_MATCHES = 5;
const SIMILARITY_THRESHOLD = 0.75; // cosine similarity, semakin tinggi semakin mirip (max 1.0)

/**
 * Dipanggil dari fitur AI lain (Content Generation, dst) — BUKAN "use server" action langsung,
 * karena ini dipanggil dari use case lain, bukan langsung dari komponen client.
 */
export async function buildKnowledgeContext(workspaceId: string, brief: string): Promise<string> {
  // 1. Entry yang di-pin selalu ikut, apa pun briefnya
  const pinned = await db.query.knowledgeEntry.findMany({
    where: and(eq(knowledgeEntry.workspaceId, workspaceId), eq(knowledgeEntry.isPinned, true)),
    columns: { id: true, title: true, content: true, category: true, tags: true, isPinned: true },
  });

  // 2. Cari entry lain yang mirip secara makna dengan brief (pgvector cosine similarity)
  const briefEmbedding = await generateEmbedding(brief);
  const embeddingLiteral = `[${briefEmbedding.join(",")}]`;

  const semanticMatches = await db.execute(sql`
    SELECT id, title, content, category, tags, is_pinned as "isPinned",
           1 - (embedding <=> ${embeddingLiteral}::vector) AS similarity
    FROM knowledge_entry
    WHERE workspace_id = ${workspaceId}
      AND is_pinned = false
      AND embedding IS NOT NULL
    ORDER BY embedding <=> ${embeddingLiteral}::vector
    LIMIT ${TOP_K_SEMANTIC_MATCHES}
  `);

  const relevant = (semanticMatches.rows as Array<KnowledgeEntry & { similarity: number }>)
    .filter((row) => row.similarity >= SIMILARITY_THRESHOLD);

  const combined = [...pinned, ...relevant];
  return formatKnowledgeForPrompt(combined);
}