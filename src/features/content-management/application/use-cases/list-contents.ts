"use server";

import { listContents, getContentStatistics, replyContentComment, listContentsAllAccounts } from "@/features/social-integration/infrastructure/repliz/repliz-client";
import { withWorkspacePermission } from "@/shared/lib/guards/with-workspace-permission";
import type { ReplizContent } from "@/features/social-integration/infrastructure/repliz/repliz-client";

export type ContentItem = ReplizContent & { accountId: string };

export const listContentsAction = withWorkspacePermission(
    ["owner", "admin", "member", "viewer"],
    async (_ctx, options: { accountId: string; type?: "media" | "story" }) => {
        return listContents(options);
    }
);

export const listContentsAllAction = withWorkspacePermission(
    ["owner", "admin", "member", "viewer"],
    async (_ctx, options: { accountIds: string[]; type?: "media" | "story" }) => {
        return listContentsAllAccounts(options);
    }
);

export const getContentStatisticsAction = withWorkspacePermission(
    ["owner", "admin", "member", "viewer"],
    async (_ctx, contentId: string, accountId: string) => {
        return getContentStatistics(contentId, accountId);
    }
);

export const replyContentCommentAction = withWorkspacePermission(
    ["owner", "admin", "member"],
    async (_ctx, contentId: string, input: Parameters<typeof replyContentComment>[1]) => {
        return replyContentComment(contentId, input);
    }
);
