"use client";

import { useState, useEffect, useCallback } from "react";
import { syncAndFetchPendingAction } from "../application/use-cases/sync-and-fetch-pending";
import { getAnalyticsOverviewAction } from "../application/use-cases/get-analytics-overview";

type Overview = {
    totalPublished: number;
    byPlatform: Record<string, { totalInteraction: number; totalReach: number; count: number }>;
    byPillar: Record<string, { totalInteraction: number; count: number }>;
    topContent: { caption: string; interaction: number } | null;
};

export function AnalyticsPage() {
    const [overview, setOverview] = useState<Overview | null>(null);
    const [isSyncing, setIsSyncing] = useState(true);

    const load = useCallback(async () => {
        setIsSyncing(true);
        await syncAndFetchPendingAction(); // sync dulu setiap kali halaman dibuka
        const result = await getAnalyticsOverviewAction(30);
        setOverview(result);
        setIsSyncing(false);
    }, []);

    useEffect(() => { load(); }, [load]);

    if (isSyncing && !overview) {
        return <p className="text-sm text-muted-foreground">Menyinkronkan data terbaru...</p>;
    }
    if (!overview || overview.totalPublished === 0) {
        return <p className="text-sm text-muted-foreground">Belum ada konten yang terbit dengan data statistik.</p>;
    }

    return (
        <div className="space-y-8">
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
                <div className="rounded-lg border p-4">
                    <p className="text-xs text-muted-foreground">Total Konten Terbit</p>
                    <p className="mt-1 text-2xl font-semibold">{overview.totalPublished}</p>
                </div>
                <div className="rounded-lg border p-4">
                    <p className="text-xs text-muted-foreground">Konten Terbaik</p>
                    <p className="mt-1 line-clamp-2 text-sm">{overview.topContent?.caption ?? "-"}</p>
                    <p className="text-xs text-muted-foreground">{overview.topContent?.interaction ?? 0} interaksi</p>
                </div>
                <div className="rounded-lg border p-4">
                    <p className="text-xs text-muted-foreground">Platform Teraktif</p>
                    <p className="mt-1 text-sm font-medium">
                        {Object.entries(overview.byPlatform).sort((a, b) => b[1].count - a[1].count)[0]?.[0] ?? "-"}
                    </p>
                </div>
            </div>

            <div className="space-y-3">
                <h2 className="text-lg font-medium">Performa per Platform</h2>
                <div className="space-y-2">
                    {Object.entries(overview.byPlatform).map(([platform, data]) => (
                        <div key={platform} className="flex items-center justify-between rounded-lg border p-3 text-sm">
                            <span className="font-medium capitalize">{platform}</span>
                            <span className="text-muted-foreground">
                                {data.count} konten · {data.totalInteraction} interaksi · {data.totalReach} reach/views
                            </span>
                        </div>
                    ))}
                </div>
            </div>

            <div className="space-y-3">
                <h2 className="text-lg font-medium">Performa per Pillar</h2>
                <div className="space-y-2">
                    {Object.entries(overview.byPillar).map(([pillar, data]) => (
                        <div key={pillar} className="flex items-center justify-between rounded-lg border p-3 text-sm">
                            <span className="font-medium">{pillar}</span>
                            <span className="text-muted-foreground">{data.count} konten · {data.totalInteraction} interaksi</span>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}