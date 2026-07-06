"use server";

import { db } from "@/shared/infrastructure/database/client";
import { contentSchedule, replizConnection } from "@/shared/infrastructure/database/schema";
import { eq, and, or, lte } from "drizzle-orm";
import { withWorkspacePermission } from "@/shared/lib/guards/with-workspace-permission";
import { syncScheduleStatus } from "./sync-schedule-status";
import { fetchContentStatistic } from "./fetch-content-statistic";

export const syncAndFetchPendingAction = withWorkspacePermission(
    ["owner", "admin", "member", "viewer"],
    async (ctx) => {
        // Cuma sync yang jadwalnya sudah lewat (kalau belum lewat, mustahil sudah publish)
        const pendingSchedules = await db.query.contentSchedule.findMany({
            where: and(
                eq(contentSchedule.workspaceId, ctx.teamId),
                or(eq(contentSchedule.status, "pending"), eq(contentSchedule.status, "process")),
                lte(contentSchedule.scheduleAt, new Date())
            ),
            limit: 20, // batasi per kunjungan halaman, hindari terlalu banyak API call sekaligus
        });

        for (const schedule of pendingSchedules) {
            try {
                const result = await syncScheduleStatus(schedule.id, schedule.replizScheduleId, schedule.generatedContentId);
                if (result.status === "success" && result.postId) {
                    const connection = await db.query.replizConnection.findFirst({
                        where: eq(replizConnection.id, schedule.connectionId),
                    });
                    if (connection) {
                        await fetchContentStatistic(schedule.id, ctx.teamId, result.postId, connection.replizAccountId, connection.platform);
                    }
                }
            } catch {
                // satu gagal sync jangan bikin semuanya berhenti — lanjut ke schedule berikutnya
                continue;
            }
        }
    }
);