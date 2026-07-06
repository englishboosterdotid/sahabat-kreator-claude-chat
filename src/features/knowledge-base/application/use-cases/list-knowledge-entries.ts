"use server";

import { db } from "@/shared/infrastructure/database/client";
import { knowledgeEntry } from "@/shared/infrastructure/database/schema";
import { eq, desc } from "drizzle-orm";
import { withWorkspacePermission } from "@/shared/lib/guards/with-workspace-permission";

export const listKnowledgeEntriesAction = withWorkspacePermission(
  ["owner", "admin", "member", "viewer"],
  async (ctx) => {
    return db.query.knowledgeEntry.findMany({
      where: eq(knowledgeEntry.workspaceId, ctx.teamId),
      orderBy: [desc(knowledgeEntry.isPinned), desc(knowledgeEntry.updatedAt)],
      columns: {
        id: true, title: true, content: true, category: true,
        tags: true, isPinned: true, updatedAt: true,
        // embedding sengaja tidak di-select — vector 1536 dimensi berat, tidak perlu dikirim ke client
      },
    });
  }
);