"use server";

import { db } from "@/shared/infrastructure/database/client";
import { replizConnection } from "@/shared/infrastructure/database/schema";
import { eq, and } from "drizzle-orm";
import { withWorkspacePermission } from "@/shared/lib/guards/with-workspace-permission";

/** Return connected replizAccountIds and full connection metadata for the current team. */
export const getConnectedAccountsAction = withWorkspacePermission(
    ["owner", "admin", "member", "viewer"],
    async (ctx) => {
        const connections = await db
            .select({
                replizAccountId: replizConnection.replizAccountId,
                platform: replizConnection.platform,
                teamId: replizConnection.teamId,
                externalName: replizConnection.externalName,
            })
            .from(replizConnection)
            .where(
                and(
                    eq(replizConnection.teamId, ctx.teamId),
                    eq(replizConnection.isRemoved, false)
                )
            );
        return {
            accountIds: connections.map(c => c.replizAccountId),
            connections,
        };
    }
);

export type ConnectionMeta = {
    replizAccountId: string;
    platform: string;
    teamId: string;
    externalName: string;
};
