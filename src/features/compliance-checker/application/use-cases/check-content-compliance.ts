"use server";

import { generateAiText } from "@/features/ai-provider/application/use-cases/generate-ai-text";
import { buildComplianceCheckPrompt } from "../../infrastructure/prompts/compliance-check.prompt";
import { withWorkspacePermission } from "@/shared/lib/guards/with-workspace-permission";
import { db } from "@/shared/infrastructure/database/client";
import { brandVoice } from "@/shared/infrastructure/database/schema";
import { eq } from "drizzle-orm";
import type { ComplianceCheckResult } from "../../domain/entities/compliance-issue.entity";

export const checkContentComplianceAction = withWorkspacePermission(
  ["owner", "admin", "member"],
  async (ctx, caption: string): Promise<ComplianceCheckResult> => {
    if (caption.trim().length < 10) {
      throw new Error("Caption terlalu pendek untuk dicek.");
    }

    // Pakai targetAudience Brand Voice sebagai proxy konteks industri — bukan field industri eksplisit
    // (workspace belum punya field "industri" khusus; ini pendekatan sementara, lihat catatan di bawah)
    const bv = await db.query.brandVoice.findFirst({ where: eq(brandVoice.workspaceId, ctx.teamId) });
    const industryContext = bv?.industry ?? undefined;

    const { systemPrompt, userMessage } = buildComplianceCheckPrompt(caption, industryContext);

    const result = await generateAiText(ctx.teamId, { systemPrompt, userMessage, maxTokens: 800 }, "compliance-check");

    const cleaned = result.text.replace(/```json|```/g, "").trim();
    try {
      return JSON.parse(cleaned) as ComplianceCheckResult;
    } catch {
      throw new Error("Gagal memproses hasil pengecekan. Coba lagi.");
    }
  }
);