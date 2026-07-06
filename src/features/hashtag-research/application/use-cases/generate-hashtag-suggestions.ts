"use server";

import { generateAiText } from "@/features/ai-provider/application/use-cases/generate-ai-text";
import { buildHashtagSuggestionPrompt } from "../../infrastructure/prompts/hashtag-suggestion.prompt";
import { db } from "@/shared/infrastructure/database/client";
import { brandVoice } from "@/shared/infrastructure/database/schema";
import { eq } from "drizzle-orm";
import { withWorkspacePermission } from "@/shared/lib/guards/with-workspace-permission";

export const generateHashtagSuggestionsAction = withWorkspacePermission(
  ["owner", "admin", "member"],
  async (ctx, briefOrCaption: string, platform: string) => {
    if (briefOrCaption.trim().length < 5) {
      throw new Error("Teks terlalu pendek untuk generate saran hashtag.");
    }

    const bv = await db.query.brandVoice.findFirst({ where: eq(brandVoice.workspaceId, ctx.teamId) });
    const { systemPrompt, userMessage } = buildHashtagSuggestionPrompt(
      briefOrCaption,
      platform,
      bv
        ? {
            brandName: bv.brandName, tagline: bv.tagline, industry: bv.industry,
            toneDescription: bv.toneDescription, personalityTraits: bv.personalityTraits ?? [],
            dos: bv.dos ?? [], donts: bv.donts ?? [], targetAudience: bv.targetAudience,
          }
        : null
    );

    const result = await generateAiText(ctx.teamId, { systemPrompt, userMessage, maxTokens: 600 }, "hashtag-suggestion");

    const cleaned = result.text.replace(/```json|```/g, "").trim();
    try {
      return JSON.parse(cleaned) as { hashtag: string; type: string; reasoning: string }[];
    } catch {
      throw new Error("Gagal memproses saran hashtag. Coba lagi.");
    }
  }
);