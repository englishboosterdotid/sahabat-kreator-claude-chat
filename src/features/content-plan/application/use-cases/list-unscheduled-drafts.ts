"use server";

import { db } from "@/shared/infrastructure/database/client";
import { generatedContent } from "@/shared/infrastructure/database/schema";
import { eq, and, desc } from "drizzle-orm";
import { withWorkspacePermission } from "@/shared/lib/guards/with-workspace-permission";

export const listUnscheduledDraftsAction = withWorkspacePermission(
    ["owner", "admin", "member", "viewer"],
    async (ctx) => {
        return db.query.generatedContent.findMany({
            where: and(eq(generatedContent.workspaceId, ctx.teamId), eq(generatedContent.status, "draft")),
            orderBy: [desc(generatedContent.createdAt)],
            limit: 30,
            columns: { id: true, caption: true, platform: true, selectedHook: true, selectedPillar: true, contentFormat: true, slides: true, createdAt: true },
        });
    }
);