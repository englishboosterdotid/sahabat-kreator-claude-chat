"use server";

import { db } from "@/shared/infrastructure/database/client";
import { contentSchedule } from "@/shared/infrastructure/database/schema";
import { eq, and, gte, lte } from "drizzle-orm";
import { withWorkspacePermission } from "@/shared/lib/guards/with-workspace-permission";

export const listScheduledContentAction = withWorkspacePermission(
    ["owner", "admin", "member", "viewer"],
    async (ctx, fromDate: string, toDate: string) => {
        return db.query.contentSchedule.findMany({
            where: and(
                eq(contentSchedule.workspaceId, ctx.teamId),
                gte(contentSchedule.scheduleAt, new Date(fromDate)),
                lte(contentSchedule.scheduleAt, new Date(toDate))
            ),
            with: {
                generatedContent: { columns: { caption: true, platform: true, selectedHook: true } },
                connection: { columns: { externalName: true, externalPicture: true, platform: true } },
            },
            orderBy: (schedule, { asc }) => [asc(schedule.scheduleAt)],
        });
    }
);