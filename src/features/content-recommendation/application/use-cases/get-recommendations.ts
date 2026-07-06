"use server";

import { db } from "@/shared/infrastructure/database/client";
import { contentSchedule, replizConnection, generatedContent } from "@/shared/infrastructure/database/schema";
import { eq, and, gte, lte, like } from "drizzle-orm";
import { withWorkspacePermission } from "@/shared/lib/guards/with-workspace-permission";
import { getPillarDistributionAction } from "@/features/content-pillar/application/use-cases/get-pillar-distribution";
import { getUpcomingMomentumAction } from "@/features/momentum-calendar/application/use-cases/get-upcoming-momentum";
import { getAnalyticsOverviewAction } from "@/features/analytics/application/use-cases/get-analytics-overview";
import { PRIORITY_ORDER } from "../../domain/value-objects/recommendation-type.vo";
import type { Recommendation } from "../../domain/entities/recommendation.entity";

export const getRecommendationsAction = withWorkspacePermission(
  ["owner", "admin", "member", "viewer"],
  async (ctx, orgSlug: string, workspaceSlug: string): Promise<Recommendation[]> => {
    const basePath = `/${orgSlug}/${workspaceSlug}`;
    const recommendations: Recommendation[] = [];

    // ===== 1. Pillar Gap =====
    const distribution = await getPillarDistributionAction(30);
    const underTarget = distribution.filter((d) => d.gap < -10).sort((a, b) => a.gap - b.gap);

    for (const pillar of underTarget.slice(0, 2)) {
      recommendations.push({
        type: "pillar_gap",
        priority: PRIORITY_ORDER.pillar_gap,
        title: `Pillar "${pillar.pillarName}" masih kurang`,
        description: `Baru ${pillar.actualPercent}% dari target ${pillar.targetPercent}% dalam 30 hari terakhir.`,
        actionLabel: "Generate konten pillar ini",
        actionUrl: `${basePath}/content/generate?prefillText=${encodeURIComponent(`Buat konten dengan pillar ${pillar.pillarName}`)}`,
      });
    }

    // ===== 2. Schedule Gap — platform terhubung tapi kosong 3 hari ke depan =====
    const connections = await db.query.replizConnection.findMany({
      where: and(eq(replizConnection.teamId, ctx.teamId), eq(replizConnection.isRemoved, false)),
    });
    const distinctPlatforms = [...new Set(connections.map((c) => c.platform))];

    const in3Days = new Date();
    in3Days.setDate(in3Days.getDate() + 3);

    const upcomingSchedules = await db.query.contentSchedule.findMany({
      where: and(eq(contentSchedule.workspaceId, ctx.teamId), gte(contentSchedule.scheduleAt, new Date()), lte(contentSchedule.scheduleAt, in3Days)),
      with: { generatedContent: { columns: { platform: true } } },
    });
    const platformsWithSchedule = new Set(upcomingSchedules.map((s) => s.generatedContent?.platform).filter(Boolean));

    for (const platform of distinctPlatforms) {
      if (!platformsWithSchedule.has(platform)) {
        recommendations.push({
          type: "schedule_gap",
          priority: PRIORITY_ORDER.schedule_gap,
          title: `Belum ada jadwal untuk ${platform} dalam 3 hari ke depan`,
          description: `Akun ${platform} terhubung tapi kosong dari jadwal publikasi.`,
          actionLabel: "Buka Content Plan",
          actionUrl: `${basePath}/content-plan`,
        });
      }
    }

    // ===== 3. Momentum Mendatang yang Belum Ada Kontennya =====
    const upcomingMomentum = await getUpcomingMomentumAction(7);
    for (const momentum of upcomingMomentum.slice(0, 2)) {
      const existingContent = await db.query.generatedContent.findFirst({
        where: and(eq(generatedContent.workspaceId, ctx.teamId), like(generatedContent.brief, `%${momentum.name}%`)),
      });
      if (!existingContent) {
        recommendations.push({
          type: "momentum_upcoming",
          priority: PRIORITY_ORDER.momentum_upcoming,
          title: `${momentum.name} sebentar lagi`,
          description: momentum.contentAngleHint ?? "Momen ini bisa jadi ide konten yang relevan.",
          actionLabel: "Buat ide konten dari momen ini",
          actionUrl: `${basePath}/content/generate?momentumId=${momentum.id}`,
        });
      }
    }

    // ===== 4. Pillar dengan Performa Terbaik =====
    try {
      const overview = await getAnalyticsOverviewAction(30);
      const pillarEntries = Object.entries(overview.byPillar);
      if (pillarEntries.length > 0) {
        const best = pillarEntries.sort((a, b) => b[1].totalInteraction / b[1].count - a[1].totalInteraction / a[1].count)[0];
        if (best && best[1].count >= 2) { // minimal 2 data point biar nggak kebetulan
          recommendations.push({
            type: "top_performing_pillar",
            priority: PRIORITY_ORDER.top_performing_pillar,
            title: `Pillar "${best[0]}" performanya paling bagus`,
            description: `Rata-rata ${Math.round(best[1].totalInteraction / best[1].count)} interaksi per konten.`,
            actionLabel: "Bikin lebih banyak pillar ini",
            actionUrl: `${basePath}/content/generate?prefillText=${encodeURIComponent(`Buat konten dengan pillar ${best[0]}`)}`,
          });
        }
      }
    } catch {
      // analitik mungkin belum ada data sama sekali — jangan gagalkan seluruh rekomendasi cuma karena ini
    }

    return recommendations.sort((a, b) => a.priority - b.priority).slice(0, 6);
  }
);