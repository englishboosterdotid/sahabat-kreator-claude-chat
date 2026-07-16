"use server";

import { db } from "@/shared/infrastructure/database/client";
import { aiUsageLog } from "@/shared/infrastructure/database/schema";
import { withWorkspacePermission } from "@/shared/lib/guards/with-workspace-permission";
import { eq, and, gte, sql, desc } from "drizzle-orm";

const THIRTY_DAYS_AGO = () => {
  const d = new Date();
  d.setDate(d.getDate() - 30);
  return d;
};

export const getUsageStatisticsAction = withWorkspacePermission(
  ["owner", "admin", "member", "viewer"],
  async (ctx) => {
    const sinceDate = THIRTY_DAYS_AGO();

    // Total usage in last 30 days
    const totalsRow = await db
      .select({
        totalCost: sql<number>`COALESCE(SUM(${aiUsageLog.costMicroUsd}), 0)::int`,
        totalInput: sql<number>`COALESCE(SUM(${aiUsageLog.inputTokens}), 0)::int`,
        totalOutput: sql<number>`COALESCE(SUM(${aiUsageLog.outputTokens}), 0)::int`,
        callCount: sql<number>`COUNT(*)::int`,
      })
      .from(aiUsageLog)
      .where(
        and(
          eq(aiUsageLog.workspaceId, ctx.teamId),
          gte(aiUsageLog.createdAt, sinceDate)
        )
      );

    // Per-feature breakdown
    const perFeature = await db
      .select({
        feature: aiUsageLog.feature,
        callCount: sql<number>`COUNT(*)::int`,
        totalCost: sql<number>`COALESCE(SUM(${aiUsageLog.costMicroUsd}), 0)::int`,
      })
      .from(aiUsageLog)
      .where(
        and(
          eq(aiUsageLog.workspaceId, ctx.teamId),
          gte(aiUsageLog.createdAt, sinceDate)
        )
      )
      .groupBy(aiUsageLog.feature);

    // Per-day breakdown (last 14 days)
    const fourteenDaysAgo = new Date();
    fourteenDaysAgo.setDate(fourteenDaysAgo.getDate() - 14);

    const perDay = await db
      .select({
        day: sql<string>`DATE(${aiUsageLog.createdAt})::text`,
        totalCost: sql<number>`COALESCE(SUM(${aiUsageLog.costMicroUsd}), 0)::int`,
        callCount: sql<number>`COUNT(*)::int`,
      })
      .from(aiUsageLog)
      .where(
        and(
          eq(aiUsageLog.workspaceId, ctx.teamId),
          gte(aiUsageLog.createdAt, fourteenDaysAgo)
        )
      )
      .groupBy(sql`DATE(${aiUsageLog.createdAt})`);

    // Most recent 5 entries
    const recent = await db
      .select()
      .from(aiUsageLog)
      .where(eq(aiUsageLog.workspaceId, ctx.teamId))
      .orderBy(desc(aiUsageLog.createdAt))
      .limit(5);

    const totals = totalsRow[0] ?? {
      totalCost: 0,
      totalInput: 0,
      totalOutput: 0,
      callCount: 0,
    };

    return {
      totals,
      perFeature,
      perDay,
      recent,
    };
  }
);