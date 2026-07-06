"use server";

import { db } from "@/shared/infrastructure/database/client";
import { contentStatistic } from "@/shared/infrastructure/database/schema";
import { eq, and, gte } from "drizzle-orm";
import { withWorkspacePermission } from "@/shared/lib/guards/with-workspace-permission";
import { getTotalInteraction } from "@/features/analytics/domain/value-objects/platform-metrics.vo";
import type { HashtagPerformance } from "../../domain/entities/hashtag-performance.entity";

export const getTopPerformingHashtagsAction = withWorkspacePermission(
  ["owner", "admin", "member", "viewer"],
  async (ctx, daysBack: number = 90): Promise<HashtagPerformance[]> => {
    const since = new Date();
    since.setDate(since.getDate() - daysBack);

    const stats = await db.query.contentStatistic.findMany({
      where: and(eq(contentStatistic.workspaceId, ctx.teamId), gte(contentStatistic.fetchedAt, since)),
      with: { schedule: { with: { generatedContent: { columns: { hashtags: true } } } } },
    });

    const hashtagMap: Record<string, { totalInteraction: number; usageCount: number }> = {};

    for (const stat of stats) {
      const interaction = getTotalInteraction(stat.metrics as Record<string, number>);
      const hashtags = stat.schedule?.generatedContent?.hashtags ?? [];

      for (const tag of hashtags) {
        const clean = tag.replace(/^#/, "");
        if (!hashtagMap[clean]) hashtagMap[clean] = { totalInteraction: 0, usageCount: 0 };
        hashtagMap[clean].totalInteraction += interaction;
        hashtagMap[clean].usageCount += 1;
      }
    }

    return Object.entries(hashtagMap)
      .map(([hashtag, data]) => ({
        hashtag,
        usageCount: data.usageCount,
        totalInteraction: data.totalInteraction,
        avgInteraction: Math.round(data.totalInteraction / data.usageCount),
      }))
      .filter((h) => h.usageCount >= 2)
      .sort((a, b) => b.avgInteraction - a.avgInteraction)
      .slice(0, 15);
  }
);