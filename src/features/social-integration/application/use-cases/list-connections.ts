"use server";

import { db } from "@/shared/infrastructure/database/client";
import { replizConnection } from "@/shared/infrastructure/database/schema";
import { eq, and } from "drizzle-orm";
import { withWorkspacePermission } from "@/shared/lib/guards/with-workspace-permission";

export const listConnectionsAction = withWorkspacePermission(
    ["owner", "admin", "member", "viewer"],
    async (ctx) => {
        return db.query.replizConnection.findMany({
            where: and(eq(replizConnection.teamId, ctx.teamId), eq(replizConnection.isRemoved, false)),
        });
    }
);