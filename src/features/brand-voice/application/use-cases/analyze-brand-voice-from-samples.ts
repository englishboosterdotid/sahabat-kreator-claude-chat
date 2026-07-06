"use server";

import { withWorkspacePermission } from "@/shared/lib/guards/with-workspace-permission";
import { analyzeBrandVoiceFromSampleContent } from "../../infrastructure/ai/brand-voice-analyzer";

export const analyzeBrandVoiceAction = withWorkspacePermission(
  ["owner", "admin", "member"],
  async (ctx, sampleContent: string) => {
    if (sampleContent.trim().length < 50) {
      throw new Error("Sample konten terlalu pendek untuk dianalisis (minimal ~50 karakter).");
    }
    const result = await analyzeBrandVoiceFromSampleContent(ctx.teamId, sampleContent); // <-- tambahkan ctx.teamId
    return result;
  }
);