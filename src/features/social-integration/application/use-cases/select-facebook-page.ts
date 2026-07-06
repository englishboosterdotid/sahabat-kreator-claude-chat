"use server";

import { connectTwoStep, reconnectTwoStep } from "../../infrastructure/repliz/repliz-client";
import { db } from "@/shared/infrastructure/database/client";
import { replizConnection } from "@/shared/infrastructure/database/schema";
import { eq, and } from "drizzle-orm";
import { withWorkspacePermission } from "@/shared/lib/guards/with-workspace-permission";
import { nanoid } from "nanoid";
import type { ReplizTwoStepOption } from "../../infrastructure/repliz/repliz-client";

export const selectPageAction = withWorkspacePermission(
    ["owner", "admin"],
    async (ctx, platform: string, entity: ReplizTwoStepOption, reconnectAccountId?: string) => {
        if (reconnectAccountId) {
            await reconnectTwoStep(platform, reconnectAccountId, entity.id, entity.token);
            await db
                .update(replizConnection)
                .set({
                    isConnected: true,
                    externalName: entity.name,
                    externalUsername: entity.username ?? null,
                    externalPicture: entity.picture ?? null,
                    lastCheckedAt: new Date(),
                })
                .where(and(eq(replizConnection.id, reconnectAccountId), eq(replizConnection.teamId, ctx.teamId)));
            return;
        }

        const { accountId } = await connectTwoStep(platform, entity.id, entity.token);

        const existing = await db
            .select({ id: replizConnection.id, isRemoved: replizConnection.isRemoved })
            .from(replizConnection)
            .where(and(eq(replizConnection.teamId, ctx.teamId), eq(replizConnection.replizAccountId, accountId)))
            .limit(1);

        if (existing.length > 0) {
            // Sudah pernah connect page ini di team ini (mungkin dari percobaan sebelumnya / isRemoved).
            // Reactivate row-nya daripada insert baru — hormati unique constraint.
            await db
                .update(replizConnection)
                .set({
                    isConnected: true,
                    isRemoved: false,
                    externalName: entity.name,
                    externalUsername: entity.username ?? null,
                    externalPicture: entity.picture ?? null,
                    lastCheckedAt: new Date(),
                })
                .where(eq(replizConnection.id, existing[0].id));
            return;
        }

        await db.insert(replizConnection).values({
            id: nanoid(),
            organizationId: ctx.organizationId,
            teamId: ctx.teamId,
            platform,
            replizAccountId: accountId,
            externalName: entity.name,
            externalUsername: entity.username ?? null,
            externalPicture: entity.picture ?? null,
            externalAccountType: "page",
            connectedByUserId: ctx.userId,
            isConnected: true,
        });
    }
);