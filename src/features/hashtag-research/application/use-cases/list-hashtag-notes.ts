"use server";

import { db } from "@/shared/infrastructure/database/client";
import { hashtagNote } from "@/shared/infrastructure/database/schema";
import { eq, desc } from "drizzle-orm";
import { withWorkspacePermission } from "@/shared/lib/guards/with-workspace-permission";

export const listHashtagNotesAction = withWorkspacePermission(
  ["owner", "admin", "member", "viewer"],
  async (ctx) => {
    return db.query.hashtagNote.findMany({
      where: eq(hashtagNote.workspaceId, ctx.teamId),
      orderBy: [desc(hashtagNote.createdAt)],
    });
  }
);