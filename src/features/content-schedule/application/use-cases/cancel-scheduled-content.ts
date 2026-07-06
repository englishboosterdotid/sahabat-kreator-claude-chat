"use server";

import { db } from "@/shared/infrastructure/database/client";
import { contentSchedule, generatedContent } from "@/shared/infrastructure/database/schema";
import { eq, and } from "drizzle-orm";
import { withWorkspacePermission } from "@/shared/lib/guards/with-workspace-permission";
import { removeSchedule } from "../../infrastructure/repliz/repliz-schedule-client";

export const cancelScheduledContentAction = withWorkspacePermission(
    ["owner", "admin", "member"],
    async (ctx, scheduleId: string) => {
        const schedule = await db.query.contentSchedule.findFirst({
            where: and(eq(contentSchedule.id, scheduleId), eq(contentSchedule.workspaceId, ctx.teamId)),
        });
        if (!schedule) throw new Error("Jadwal tidak ditemukan.");

        await removeSchedule(schedule.replizScheduleId);
        await db.delete(contentSchedule).where(eq(contentSchedule.id, scheduleId));
        await db
            .update(generatedContent)
            .set({ status: "draft", updatedAt: new Date() })
            .where(eq(generatedContent.id, schedule.generatedContentId));
    }
);