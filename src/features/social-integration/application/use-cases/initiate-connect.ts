"use server";

import { getAuthorizeUrl } from "../../infrastructure/repliz/repliz-client";
import { setPendingConnection } from "../../infrastructure/pending-connection-cookie";
import { withWorkspacePermission } from "@/shared/lib/guards/with-workspace-permission";
import type { ReplizPlatform } from "../../domain/value-objects/repliz-platform.vo";

export const initiateConnectAction = withWorkspacePermission(
    ["owner", "admin"],
    async (ctx, platform: ReplizPlatform, orgSlug: string, workspaceSlug: string) => {
        const redirectUrl = `${process.env.NEXT_PUBLIC_APP_URL}/api/repliz/callback/${platform}`;
        const authorizeUrl = await getAuthorizeUrl(platform, redirectUrl);

        await setPendingConnection({
            workspaceId: ctx.teamId,
            orgSlug,
            workspaceSlug,
            platform,
            userId: ctx.userId,
        });

        return { authorizeUrl };
    }
);