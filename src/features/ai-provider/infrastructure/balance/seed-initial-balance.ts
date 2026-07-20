import { db } from "@/shared/infrastructure/database/client";
import { aiTokenBalance } from "@/shared/infrastructure/database/schema";
import { nanoid } from "nanoid";

/**
 * Saldo gratis yang diberikan ke workspace baru saat pertama kali dibuat.
 * Saat ini 500K micro-USD = $0.50 — cukup untuk trial beberapa kali generate
 * pakai model hemat (gpt-4o-mini, gemini-2.5-flash, dll) tanpa komitmen.
 *
 * Idempotent: kalau workspace sudah punya saldo (mis. pernah top-up manual),
 * tidak ditimpa. Cek via upsert + `WHERE NOT EXISTS`.
 */
// export const INITIAL_BONUS_MICRO_USD = 500_000;
export const INITIAL_BONUS_MICRO_USD = 50_000;

export async function seedInitialBalance(workspaceId: string): Promise<void> {
  // Upsert dengan onConflictDoNothing — kalau baris sudah ada, lewati.
  // Jangan timpa saldo yang sudah ada (mis. hasil top-up manual).
  await db
    .insert(aiTokenBalance)
    .values({
      id: nanoid(),
      workspaceId,
      balance: INITIAL_BONUS_MICRO_USD,
      updatedAt: new Date(),
    })
    .onConflictDoNothing({ target: aiTokenBalance.workspaceId });
}