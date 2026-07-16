"use server";

import { db } from "@/shared/infrastructure/database/client";
import { aiProviderConfig, aiTokenBalance } from "@/shared/infrastructure/database/schema";
import { withWorkspacePermission } from "@/shared/lib/guards/with-workspace-permission";

/**
 * Result type returned to the settings form. API key is exposed only as a
 * boolean (`hasApiKey`) — never the decrypted plaintext — so the form can
 * decide whether to require re-entry without leaking the secret.
 */
export type AiProviderConfigView = {
  providerType: "anthropic" | "openai" | "gemini" | "custom" | "platform_sumopod";
  hasApiKey: boolean;
  customBaseUrl: string | null;
  model: string | null;
  tokenBalanceMicroUsd: number;
};

export const getAiProviderConfigAction = withWorkspacePermission(
  ["owner", "admin", "member", "viewer"],
  async (ctx): Promise<AiProviderConfigView> => {
    const config = await db.query.aiProviderConfig.findFirst({
      where: (c, { eq }) => eq(c.workspaceId, ctx.teamId),
    });

    const balance = await db.query.aiTokenBalance.findFirst({
      where: (b, { eq }) => eq(b.workspaceId, ctx.teamId),
    });

    return {
      providerType: config?.providerType ?? "platform_sumopod",
      hasApiKey: !!config?.apiKeyEncrypted,
      customBaseUrl: config?.customBaseUrl ?? null,
      model: config?.model ?? null,
      tokenBalanceMicroUsd: balance?.balance ?? 0,
    };
  }
);