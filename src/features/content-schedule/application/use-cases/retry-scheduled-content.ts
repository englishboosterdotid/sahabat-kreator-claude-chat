"use server";

import { db } from "@/shared/infrastructure/database/client";
import { contentSchedule } from "@/shared/infrastructure/database/schema";
import { eq, and } from "drizzle-orm";
import { withWorkspacePermission } from "@/shared/lib/guards/with-workspace-permission";
import { retrySchedule } from "../../infrastructure/repliz/repliz-schedule-client";

export const retryScheduledContentAction = withWorkspacePermission(
    ["owner", "admin", "member"],
    async (ctx, scheduleId: string) => {
        const schedule = await db.query.contentSchedule.findFirst({
            where: and(eq(contentSchedule.id, scheduleId), eq(contentSchedule.workspaceId, ctx.teamId)),
        });
        if (!schedule) throw new Error("Jadwal tidak ditemukan.");

        await retrySchedule(schedule.replizScheduleId);
        await db
            .update(contentSchedule)
            .set({ status: "pending", errorMessage: null, updatedAt: new Date() })
            .where(eq(contentSchedule.id, scheduleId));
    }
);