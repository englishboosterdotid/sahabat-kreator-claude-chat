const REPLIZ_BASE_URL = process.env.REPLIZ_API_BASE_URL ?? "https://api.repliz.com";

function getAuthHeader(): string {
    const raw = `${process.env.REPLIZ_ACCESS_KEY}:${process.env.REPLIZ_SECRET_KEY}`;
    return `Basic ${Buffer.from(raw).toString("base64")}`;
}

async function replizFetch<T>(path: string): Promise<T> {
    const response = await fetch(`${REPLIZ_BASE_URL}${path}`, { headers: { Authorization: getAuthHeader() } });
    if (!response.ok) {
        const body = await response.json().catch(() => ({ message: response.statusText }));
        throw new Error(`Repliz API error (${response.status}): ${body.message ?? "unknown error"}`);
    }
    return response.json();
}

export type ReplizScheduleStatus = {
    id: string;
    status: "pending" | "process" | "error" | "success";
    postId?: string;
};

export async function getScheduleStatus(scheduleId: string): Promise<ReplizScheduleStatus> {
    return replizFetch(`/public/schedule/${scheduleId}`);
}

export async function getStatistic(contentId: string, accountId: string): Promise<Record<string, number>> {
    return replizFetch(`/public/content/${encodeURIComponent(contentId)}/statistic?accountId=${encodeURIComponent(accountId)}`);
}