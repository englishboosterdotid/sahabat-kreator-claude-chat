export function getWeekRange(referenceDate: Date): { start: Date; end: Date } {
    const start = new Date(referenceDate);
    const day = start.getDay();
    start.setDate(start.getDate() - day);
    start.setHours(0, 0, 0, 0);

    const end = new Date(start);
    end.setDate(end.getDate() + 6);
    end.setHours(23, 59, 59, 999);

    return { start, end };
}

export function formatWeekLabel(start: Date, end: Date): string {
    const startStr = start.toLocaleDateString("id-ID", { day: "numeric", month: "short" });
    const endStr = end.toLocaleDateString("id-ID", { day: "numeric", month: "short", year: "numeric" });
    return `${startStr} — ${endStr}`;
}

export function groupByDay<T extends { scheduleAt: Date | string }>(items: T[]): Record<string, T[]> {
    const groups: Record<string, T[]> = {};
    for (const item of items) {
        const date = new Date(item.scheduleAt);
        const key = date.toISOString().split("T")[0];
        if (!groups[key]) groups[key] = [];
        groups[key].push(item);
    }
    return groups;
}