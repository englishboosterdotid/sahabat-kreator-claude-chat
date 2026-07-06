import { cookies } from "next/headers";

const COOKIE_NAME = "repliz_pending_connection";
const MAX_AGE_SECONDS = 600;

type PendingConnection = {
    workspaceId: string;
    orgSlug: string;
    workspaceSlug: string;
    platform: string;
    userId: string;
    reconnectAccountId?: string;
};

export async function setPendingConnection(data: PendingConnection) {
    const store = await cookies();
    store.set(COOKIE_NAME, JSON.stringify(data), {
        httpOnly: true,
        secure: true,
        sameSite: "lax",
        maxAge: MAX_AGE_SECONDS,
        path: "/",
    });
}

export async function getPendingConnection(): Promise<PendingConnection | null> {
    const store = await cookies();
    const raw = store.get(COOKIE_NAME)?.value;
    if (!raw) return null;
    try {
        return JSON.parse(raw) as PendingConnection;
    } catch {
        return null;
    }
}

export async function clearPendingConnection() {
    const store = await cookies();
    store.delete(COOKIE_NAME);
}