"use server";

import { db } from "@/shared/infrastructure/database/client";
import { aiProviderConfig, aiUsageLog, aiTokenBalance } from "@/shared/infrastructure/database/schema";
import { eq, sql } from "drizzle-orm";
import { createAIProviderAdapter } from "../../infrastructure/ai-provider-factory";
import { calculateSumopodCostMicroUsd } from "../../infrastructure/adapters/sumopod-pricing";
import { nanoid } from "nanoid";
import type { GenerateTextInput } from "../../domain/repositories/ai-provider-adapter";

/**
 * Low-balance threshold. When balance drops below this, we either throw a
 * helpful error or auto-fall back to a workspace's own API key if they have
 * one configured. In micro-USD (e.g. 100_000 = $0.10).
 */
const LOW_BALANCE_THRESHOLD_MICRO_USD = 1_000;

export async function generateAiText(
  workspaceId: string,
  input: GenerateTextInput,
  feature: string
) {
  const config = await db.query.aiProviderConfig.findFirst({
    where: eq(aiProviderConfig.workspaceId, workspaceId),
  });

  let effectiveConfig = config ?? {
    providerType: "platform_sumopod" as const,
    apiKeyEncrypted: null,
    customBaseUrl: null,
    model: "gpt-4o-mini",
  };

  const model = effectiveConfig.model ?? "gpt-4o-mini";

  // BYOK fallback: kalau platform saldo habis / di bawah threshold tapi user
  // pernah menyimpan API key sendiri, otomatis switch ke BYOK tanpa error.
  if (effectiveConfig.providerType === "platform_sumopod") {
    const balance = await db.query.aiTokenBalance.findFirst({
      where: eq(aiTokenBalance.workspaceId, workspaceId),
    });
    const balanceMicro = balance?.balance ?? 0;

    if (balanceMicro <= LOW_BALANCE_THRESHOLD_MICRO_USD) {
      // Auto-fall-back ke BYOK kalau ada API key sendiri
      if (config?.apiKeyEncrypted) {
        effectiveConfig = {
          ...config,
          providerType: config.providerType === "platform_sumopod"
            ? "anthropic" // default ke anthropic karena ini platform kurator
            : config.providerType,
        };
      } else {
        throw new Error(
          "Saldo token platform habis. Silakan top up atau gunakan API key sendiri."
        );
      }
    }
  }

  const adapter = createAIProviderAdapter(effectiveConfig);
  const result = await adapter.generateText(input);

  let costMicroUsd = 0;
  // Hanya charge saldo kalau akhirnya pakai platform_sumopod (BYOK = pakai user sendiri)
  if (effectiveConfig.providerType === "platform_sumopod") {
    costMicroUsd = calculateSumopodCostMicroUsd(model, result.inputTokens, result.outputTokens);
  }

  // Log usage (selalu dicatat, terlepas dari provider apa pun — berguna untuk analitik pemakaian AI per fitur)
  await db.insert(aiUsageLog).values({
    id: nanoid(),
    workspaceId,
    providerType: effectiveConfig.providerType,
    model,
    inputTokens: result.inputTokens,
    outputTokens: result.outputTokens,
    costMicroUsd,
    feature,
  });

  // Atomic decrement — pakai SQL template drizzle, BUKAN read-then-write,
  // supaya aman dari race condition kalau ada request bersamaan
  if (effectiveConfig.providerType === "platform_sumopod" && costMicroUsd > 0) {
    await db
      .update(aiTokenBalance)
      .set({
        balance: sql`${aiTokenBalance.balance} - ${costMicroUsd}`,
        updatedAt: new Date(),
      })
      .where(eq(aiTokenBalance.workspaceId, workspaceId));
  }

  return result;
}