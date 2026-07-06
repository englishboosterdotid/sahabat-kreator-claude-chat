"use server";

import { db } from "@/shared/infrastructure/database/client";
import { aiProviderConfig, aiUsageLog, aiTokenBalance } from "@/shared/infrastructure/database/schema";
import { eq, sql } from "drizzle-orm";
import { createAIProviderAdapter } from "../../infrastructure/ai-provider-factory";
import { calculateSumopodCostMicroUsd } from "../../infrastructure/adapters/sumopod-pricing";
import { nanoid } from "nanoid";
import type { GenerateTextInput } from "../../domain/repositories/ai-provider-adapter";

export async function generateAiText(
  workspaceId: string,
  input: GenerateTextInput,
  feature: string
) {
  const config = await db.query.aiProviderConfig.findFirst({
    where: eq(aiProviderConfig.workspaceId, workspaceId),
  });

  const effectiveConfig = config ?? {
    providerType: "platform_sumopod" as const,
    apiKeyEncrypted: null,
    customBaseUrl: null,
    model: "gpt-4o-mini",
  };

  const model = effectiveConfig.model ?? "gpt-4o-mini";

  // Cek saldo dulu sebelum generate, kalau pakai token platform
  if (effectiveConfig.providerType === "platform_sumopod") {
    const balance = await db.query.aiTokenBalance.findFirst({
      where: eq(aiTokenBalance.workspaceId, workspaceId),
    });
    if (!balance || balance.balance <= 0) {
      throw new Error("Saldo token platform habis. Silakan top up atau gunakan API key sendiri.");
    }
  }

  const adapter = createAIProviderAdapter(effectiveConfig);
  const result = await adapter.generateText(input);

  let costMicroUsd = 0;
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