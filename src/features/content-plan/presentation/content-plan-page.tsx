"use client";

import { useState, useEffect, useCallback } from "react";
import { WeekNavigator } from "./components/week-navigator";
import { UnscheduledDraftList } from "./components/unscheduled-draft-list";
import { ScheduledDayGroup } from "./components/scheduled-day-group";
import { ScheduleFormModal } from "./components/schedule-form-modal";
import { getWeekRange, groupByDay } from "../domain/value-objects/week-range.vo";
import { listUnscheduledDraftsAction } from "../application/use-cases/list-unscheduled-drafts";
import { listScheduledContentAction } from "@/features/content-schedule/application/use-cases/list-scheduled-content";

type Draft = { id: string; caption: string; platform: string; selectedHook: string; selectedPillar: string; contentFormat?: string; slides?: { order: number; text: string; imageUrl: string }[] };

export function ContentPlanPage() {
    const [referenceDate, setReferenceDate] = useState(new Date());
    const [drafts, setDrafts] = useState<Draft[]>([]);
    const [scheduled, setScheduled] = useState<any[]>([]);
    const [selectedDraft, setSelectedDraft] = useState<Draft | null>(null);

    const { start, end } = getWeekRange(referenceDate);

    const refresh = useCallback(async () => {
        const [draftResult, scheduledResult] = await Promise.all([
            listUnscheduledDraftsAction(),
            listScheduledContentAction(start.toISOString(), end.toISOString()),
        ]);
        setDrafts(draftResult as Draft[]);
        setScheduled(scheduledResult);
    }, [start, end]);

    useEffect(() => { refresh(); }, [refresh]);

    const grouped = groupByDay(scheduled);

    return (
        <div className="space-y-6">
            <WeekNavigator
                start={start} end={end}
                onPrev={() => setReferenceDate(new Date(start.getTime() - 7 * 86400000))}
                onNext={() => setReferenceDate(new Date(start.getTime() + 7 * 86400000))}
                onToday={() => setReferenceDate(new Date())}
            />

            <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
                <div className="space-y-4 lg:col-span-2">
                    {Object.entries(grouped).length === 0 ? (
                        <p className="text-sm text-muted-foreground">Belum ada konten terjadwal minggu ini.</p>
                    ) : (
                        Object.entries(grouped)
                            .sort(([a], [b]) => a.localeCompare(b))
                            .map(([date, items]) => <ScheduledDayGroup key={date} date={date} items={items} onChanged={refresh} />)
                    )}
                </div>

                <div className="space-y-3">
                    <h2 className="text-sm font-medium">Draft Belum Terjadwal</h2>
                    <UnscheduledDraftList drafts={drafts} onSchedule={setSelectedDraft} />
                </div>
            </div>

            {selectedDraft && (
                <ScheduleFormModal
                    draft={selectedDraft}
                    onClose={() => setSelectedDraft(null)}
                    onScheduled={() => { setSelectedDraft(null); refresh(); }}
                />
            )}
        </div>
    );
}