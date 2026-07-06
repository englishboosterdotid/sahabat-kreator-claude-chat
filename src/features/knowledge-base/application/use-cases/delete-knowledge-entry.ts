"use server";

import { db } from "@/shared/infrastructure/database/client";
import { knowledgeEntry } from "@/shared/infrastructure/database/schema";
import { eq, and } from "drizzle-orm";
import { withWorkspacePermission } from "@/shared/lib/guards/with-workspace-permission";
import { z } from "zod";

const entryIdSchema = z.string().min(1, "ID tidak valid");

export const deleteKnowledgeEntryAction = withWorkspacePermission(
  ["owner", "admin"],
  async (ctx, entryId: unknown) => {
    const id = entryIdSchema.parse(entryId);
    await db
      .delete(knowledgeEntry)
      .where(and(eq(knowledgeEntry.id, id), eq(knowledgeEntry.workspaceId, ctx.teamId)));
  }
);