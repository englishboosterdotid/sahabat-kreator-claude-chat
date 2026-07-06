"use client";

import { formatWeekLabel } from "../../domain/value-objects/week-range.vo";
import { ChevronLeft, ChevronRight } from "lucide-react";

export function WeekNavigator({
    start, end, onPrev, onNext, onToday,
}: {
    start: Date; end: Date; onPrev: () => void; onNext: () => void; onToday: () => void;
}) {
    return (
        <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
                <button onClick={onPrev} className="rounded-md border p-1.5 hover:bg-accent"><ChevronLeft size={16} /></button>
                <button onClick={onNext} className="rounded-md border p-1.5 hover:bg-accent"><ChevronRight size={16} /></button>
                <span className="text-sm font-medium">{formatWeekLabel(start, end)}</span>
            </div>
            <button onClick={onToday} className="text-xs text-muted-foreground hover:text-foreground underline">Minggu ini</button>
        </div>
    );
}