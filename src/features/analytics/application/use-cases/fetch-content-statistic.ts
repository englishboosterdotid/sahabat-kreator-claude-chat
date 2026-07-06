"use server";

import { db } from "@/shared/infrastructure/database/client";
import { contentStatistic } from "@/shared/infrastructure/database/schema";
import { eq } from "drizzle-orm";
import { getStatistic } from "../../infrastructure/repliz/repliz-statistic-client";
import { nanoid } from "nanoid";

export async function fetchContentStatistic(
    scheduleId: string,
    workspaceId: string,
    postId: string,
    accountId: string,
    platform: string
) {
    const metrics = await getStatistic(postId, accountId);

    const existing = await db.query.contentStatistic.findFirst({ where: eq(contentStatistic.scheduleId, scheduleId) });

    if (existing) {
        await db
            .update(contentStatistic)
            .set({ metrics, fetchedAt: new Date() })
            .where(eq(contentStatistic.scheduleId, scheduleId));
    } else {
        await db.insert(contentStatistic).values({
            id: nanoid(),
            workspaceId,
            scheduleId,
            platform,
            metrics,
        });
    }
}