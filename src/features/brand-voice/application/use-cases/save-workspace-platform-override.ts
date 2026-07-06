"use server";

import { db } from "@/shared/infrastructure/database/client";
import { brandVoicePlatformOverride } from "@/shared/infrastructure/database/schema";
import { eq, and } from "drizzle-orm";
import { withWorkspacePermission } from "@/shared/lib/guards/with-workspace-permission";
import { nanoid } from "nanoid";
import type { ReplizPlatform } from "@/features/social-integration/domain/value-objects/repliz-platform.vo";

export const saveWorkspacePlatformOverrideAction = withWorkspacePermission(
  ["owner", "admin"],
  async (ctx, platform: ReplizPlatform, toneAdjustment: string) => {
    const existing = await db.query.brandVoicePlatformOverride.findFirst({
      where: and(
        eq(brandVoicePlatformOverride.workspaceId, ctx.teamId),
        eq(brandVoicePlatformOverride.platform, platform)
      ),
    });

    if (existing) {
      await db
        .update(brandVoicePlatformOverride)
        .set({ toneAdjustment, updatedAt: new Date() })
        .where(eq(brandVoicePlatformOverride.id, existing.id));
    } else {
      await db.insert(brandVoicePlatformOverride).values({
        id: nanoid(),
        workspaceId: ctx.teamId,
        platform,
        toneAdjustment,
      });
    }
  }
);