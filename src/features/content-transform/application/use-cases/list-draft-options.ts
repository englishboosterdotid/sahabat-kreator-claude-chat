"use server";

import { db } from "@/shared/infrastructure/database/client";
import { generatedContent } from "@/shared/infrastructure/database/schema";
import { eq, desc } from "drizzle-orm";
import { withWorkspacePermission } from "@/shared/lib/guards/with-workspace-permission";

export const listDraftOptionsAction = withWorkspacePermission(
  ["owner", "admin", "member", "viewer"],
  async (ctx) => {
    return db.query.generatedContent.findMany({
      where: eq(generatedContent.workspaceId, ctx.teamId),
      orderBy: [desc(generatedContent.createdAt)],
      limit: 20,
      columns: { id: true, caption: true, platform: true, selectedHook: true, createdAt: true },
    });
  }
);