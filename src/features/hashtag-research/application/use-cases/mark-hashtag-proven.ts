"use server";

import { db } from "@/shared/infrastructure/database/client";
import { hashtagNote } from "@/shared/infrastructure/database/schema";
import { eq, and } from "drizzle-orm";
import { withWorkspacePermission } from "@/shared/lib/guards/with-workspace-permission";
import { nanoid } from "nanoid";

export const markHashtagProvenAction = withWorkspacePermission(
  ["owner", "admin", "member"],
  async (ctx, hashtag: string, note: string) => {
    const clean = hashtag.replace(/^#/, "").trim();
    if (!clean) throw new Error("Hashtag tidak boleh kosong.");

    const existing = await db.query.hashtagNote.findFirst({
      where: and(eq(hashtagNote.workspaceId, ctx.teamId), eq(hashtagNote.hashtag, clean)),
    });

    if (existing) {
      await db.update(hashtagNote).set({ note, isProven: true }).where(eq(hashtagNote.id, existing.id));
    } else {
      await db.insert(hashtagNote).values({ id: nanoid(), workspaceId: ctx.teamId, hashtag: clean, note, isProven: true });
    }
  }
);