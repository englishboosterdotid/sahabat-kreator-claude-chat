"use server";

import { listComments } from "@/features/social-integration/infrastructure/repliz/repliz-client";
import { withWorkspacePermission } from "@/shared/lib/guards/with-workspace-permission";

export type CommentListInput = {
    page: number;
    limit: number;
    status?: "pending" | "resolved" | "ignored";
    accountIds?: string[];
    search?: string;
};

export const listCommentsAction = withWorkspacePermission(
    ["owner", "admin", "member", "viewer"],
    async (_ctx, input: CommentListInput) => {
        return listComments(input);
    }
);
