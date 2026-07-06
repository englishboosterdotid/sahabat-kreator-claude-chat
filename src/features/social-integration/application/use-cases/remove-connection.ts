"use server";

import { db } from "@/shared/infrastructure/database/client";
import { replizConnection } from "@/shared/infrastructure/database/schema";
import { eq, and } from "drizzle-orm";
import { withWorkspacePermission } from "@/shared/lib/guards/with-workspace-permission";
import { getReplizAuthHeader } from "@/features/social-integration/infrastructure/repliz/repliz-client";

async function removeAccountFromRepliz(accountId: string): Promise<void> {
    const response = await fetch(`${process.env.REPLIZ_API_BASE_URL}/public/account/${accountId}`, {
        method: "DELETE",
        headers: { Authorization: getReplizAuthHeader() }, // reuse helper dari repliz-client.ts
    });
    if (!response.ok && response.status !== 404) {
        // 404 = sudah kehapus di sisi Repliz, tetap lanjut tandai isRemoved di kita
        throw new Error(`Gagal menghapus akun di Repliz (${response.status})`);
    }
}

// Pakai signature object (bukan positional) supaya argumen `connectionId` (21-char nanoid)
// tidak tertangkap heuristic teamId di withWorkspacePermission. Team di-resolve dari session.
export const removeConnectionAction = withWorkspacePermission(
    ["owner", "admin"],
    async (ctx, args: { connectionId: string; replizAccountId: string }) => {
        await removeAccountFromRepliz(args.replizAccountId);
        await db
            .update(replizConnection)
            .set({ isRemoved: true, isConnected: false, updatedAt: new Date() })
            .where(and(eq(replizConnection.id, args.connectionId), eq(replizConnection.teamId, ctx.teamId)));
    }
);