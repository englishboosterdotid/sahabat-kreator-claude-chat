"use server";

import { db } from "@/shared/infrastructure/database/client";
import { contentSchedule, generatedContent } from "@/shared/infrastructure/database/schema";
import { eq } from "drizzle-orm";
import { getScheduleStatus } from "../../infrastructure/repliz/repliz-statistic-client";

/** Bukan "use server" action langsung ke client — dipanggil dari use case lain. */
export async function syncScheduleStatus(scheduleId: string, replizScheduleId: string, generatedContentId: string) {
    const remote = await getScheduleStatus(replizScheduleId);

    await db
        .update(contentSchedule)
        .set({
            status: remote.status,
            postId: remote.postId ?? null,
            updatedAt: new Date(),
        })
        .where(eq(contentSchedule.id, scheduleId));

    if (remote.status === "success") {
        await db
            .update(generatedContent)
            .set({ status: "published", updatedAt: new Date() })
            .where(eq(generatedContent.id, generatedContentId));
    }

    return remote;
}