"use server";

import { listAccounts } from "../../infrastructure/repliz/repliz-client";
import { withWorkspacePermission } from "@/shared/lib/guards/with-workspace-permission";

export const listReplizAccountsAction = withWorkspacePermission(
    ["owner", "admin", "member", "viewer"],
    async (_ctx, options?: { page?: number; limit?: number; search?: string }) => {
        return listAccounts(options);
    }
);