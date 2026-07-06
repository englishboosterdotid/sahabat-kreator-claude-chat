const REPLIZ_BASE_URL = process.env.REPLIZ_API_BASE_URL ?? "https://api.repliz.com";

function getAuthHeader(): string {
    const raw = `${process.env.REPLIZ_ACCESS_KEY}:${process.env.REPLIZ_SECRET_KEY}`;
    return `Basic ${Buffer.from(raw).toString("base64")}`;
}

async function replizFetch<T>(path: string, options: RequestInit = {}): Promise<T> {
    const response = await fetch(`${REPLIZ_BASE_URL}${path}`, {
        ...options,
        headers: { Authorization: getAuthHeader(), "Content-Type": "application/json", ...options.headers },
    });
    if (!response.ok) {
        const body = await response.json().catch(() => ({ message: response.statusText }));
        throw new Error(`Repliz API error (${response.status}): ${body.message ?? "unknown error"}`);
    }
    if (response.status === 204) return undefined as T;
    return response.json();
}

export type ScheduleMedia = {
    alt?: string;
    customThumbnail?: boolean;
    type: "image" | "video";
    thumbnail?: string;
    url: string;
};

export type ScheduleType = "text" | "image" | "video" | "reel" | "album" | "link" | "story";

export type CreateScheduleInput = {
    accountId: string;
    title: string;
    description: string;
    topic?: string;
    type: ScheduleType;
    medias: ScheduleMedia[];
    meta?: { title?: string; description?: string; url?: string };
    additionalInfo?: {
        isAiGenerated?: boolean;
        isDraft?: boolean;
        collaborators?: string[];       // Instagram
        mentions?: string[];             // Instagram Story
        music?: { id: string; artist: string; name: string; thumbnail: string }; // TikTok
        products?: { id: string; name: string; thumbnail: string; currency?: string; price?: number }[]; // Shopee
        tags?: string[];                 // YouTube
        link?: string;                   // Pinterest
        targetCountries?: string[];      // ISO 3166-1 alpha-2, misal ["ID", "MY"]
    };
    replies?: unknown[];
    scheduleAt: string;
    templateId?: string;
};

/**
 * ASUMSI — body diinfer dari updateSchedule.md karena createSchedule.md tidak diterima.
 * Endpoint & response shape ({ scheduleId }) BELUM DIKONFIRMASI. Verifikasi sebelum production.
 */
export async function createSchedule(input: CreateScheduleInput): Promise<{ scheduleId: string }> {
    return replizFetch(`/public/schedule`, { method: "POST", body: JSON.stringify(input) });
}

export async function updateSchedule(scheduleId: string, input: Omit<CreateScheduleInput, "accountId">): Promise<void> {
    await replizFetch(`/public/schedule/${scheduleId}`, { method: "PUT", body: JSON.stringify(input) });
}

export async function removeSchedule(scheduleId: string): Promise<void> {
    await replizFetch(`/public/schedule/${scheduleId}`, { method: "DELETE" });
}

export async function removeSchedulesMass(scheduleIds: string[]): Promise<void> {
    const query = scheduleIds.map((id) => `scheduleIds[]=${encodeURIComponent(id)}`).join("&");
    await replizFetch(`/public/schedule/mass?${query}`, { method: "DELETE" });
}

export async function retrySchedule(scheduleId: string): Promise<void> {
    await replizFetch(`/public/schedule/${scheduleId}/retry`, { method: "PUT", body: JSON.stringify({}) });
}

export type ReplizScheduleDetail = {
    id: string;
    title: string;
    description: string;
    status: "pending" | "process" | "error" | "success";
    scheduleAt: string;
    postId?: string;
    account: { id: string; name: string; username: string; picture: string; type: string };
};

export async function getSchedules(params: {
    page: number;
    limit: number;
    accountIds?: string[];
    status?: string;
    fromDate?: string;
    toDate?: string;
}): Promise<{ docs: ReplizScheduleDetail[]; totalDocs: number; totalPages: number }> {
    const query = new URLSearchParams({ page: String(params.page), limit: String(params.limit) });
    if (params.status) query.set("status", params.status);
    if (params.fromDate) query.set("fromDate", params.fromDate);
    if (params.toDate) query.set("toDate", params.toDate);
    params.accountIds?.forEach((id) => query.append("accountIds[]", id));
    return replizFetch(`/public/schedule?${query.toString()}`);
}