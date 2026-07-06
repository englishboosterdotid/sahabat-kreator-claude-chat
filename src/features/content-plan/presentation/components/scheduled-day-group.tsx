"use client";

import { SCHEDULE_STATUS_LABELS } from "@/features/content-schedule/domain/value-objects/schedule-status.vo";
import { cancelScheduledContentAction } from "@/features/content-schedule/application/use-cases/cancel-scheduled-content";
import { retryScheduledContentAction } from "@/features/content-schedule/application/use-cases/retry-scheduled-content";

type ScheduledItem = {
    id: string;
    scheduleAt: string;
    status: string;
    errorMessage: string | null;
    generatedContent: { caption: string; platform: string } | null;
    connection: { externalName: string; platform: string } | null;
};

export function ScheduledDayGroup({ date, items, onChanged }: { date: string; items: ScheduledItem[]; onChanged: () => void }) {
    const dateLabel = new Date(date).toLocaleDateString("id-ID", { weekday: "long", day: "numeric", month: "long" });

    async function handleCancel(id: string) {
        if (!confirm("Batalkan jadwal ini?")) return;
        await cancelScheduledContentAction(id);
        onChanged();
    }

    async function handleRetry(id: string) {
        await retryScheduledContentAction(id);
        onChanged();
    }

    return (
        <div className="space-y-2">
            <p className="text-sm font-medium">{dateLabel}</p>
            <div className="space-y-2">
                {items.map((item) => {
                    const status = SCHEDULE_STATUS_LABELS[item.status] ?? SCHEDULE_STATUS_LABELS.pending;
                    const time = new Date(item.scheduleAt).toLocaleTimeString("id-ID", { hour: "2-digit", minute: "2-digit" });

                    return (
                        <div key={item.id} className="flex items-start justify-between gap-3 rounded-lg border p-3">
                            <div className="flex-1">
                                <div className="flex items-center gap-2">
                                    <span className="text-xs font-medium">{time}</span>
                                    <span className="rounded-full px-2 py-0.5 text-xs font-medium text-white" style={{ backgroundColor: status.color }}>
                                        {status.label}
                                    </span>
                                    <span className="text-xs text-muted-foreground">{item.connection?.externalName}</span>
                                </div>
                                <p className="mt-1 line-clamp-2 text-xs text-muted-foreground">{item.generatedContent?.caption}</p>
                                {item.status === "error" && item.errorMessage && (
                                    <p className="mt-1 text-xs text-destructive">{item.errorMessage}</p>
                                )}
                            </div>
                            <div className="flex shrink-0 gap-1">
                                {item.status === "error" && (
                                    <button onClick={() => handleRetry(item.id)} className="text-xs text-blue-600 hover:underline">Coba lagi</button>
                                )}
                                {item.status !== "success" && (
                                    <button onClick={() => handleCancel(item.id)} className="text-xs text-destructive hover:underline">Batal</button>
                                )}
                            </div>
                        </div>
                    );
                })}
            </div>
        </div>
    );
}