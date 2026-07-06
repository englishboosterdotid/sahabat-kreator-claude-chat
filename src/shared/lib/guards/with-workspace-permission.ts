import { auth } from "@/shared/infrastructure/auth/auth";
import { headers } from "next/headers";
import { db } from "@/shared/infrastructure/database/client";
import { and, eq } from "drizzle-orm";
import { workspaceMemberRole } from "@/shared/infrastructure/database/schema/workspace-schema";
import { team as teamTable, member, organization as organizationTable } from "@/shared/infrastructure/database/schema/auth-schema";

/**
 * Hierarchy of roles (higher overrides lower).
 * Owner → Admin → Member → Viewer.
 */
const ROLE_RANK = {
  owner: 4,
  admin: 3,
  member: 2,
  viewer: 1,
} as const;

export type PermissionRole = keyof typeof ROLE_RANK;

type PermissionContext = {
  userId: string;
  organizationId: string;
  teamId: string;
  role: PermissionRole;
};

/**
 * Wraps a workspace-level handler with RBAC checks.
 *
 * The wrapper resolves the current workspace via (in order of preference):
 *  1. `args[0]` & `args[1]` — if they are orgSlug and workspaceSlug strings
 *  2. `args[0]` — if it looks like a 21-char nanoid team id
 *  3. The session's `activeTeamId` (BetterAuth tracks this — the workspace
 *     layout sets it on every navigation to /[workspaceSlug])
 *
 * Usage:
 *   export const myAction = withWorkspacePermission(
 *     ["owner", "admin"],
 *     async (ctx, orgSlug, workspaceSlug) => {
 *       // ctx has { userId, organizationId, teamId, role }
 *     }
 *   );
 */
export function withWorkspacePermission<
  T extends unknown[],
  R,
>(
  requiredRoles: PermissionRole[],
  handler: (ctx: PermissionContext, ...args: T) => Promise<R>
): (...args: T) => Promise<R> {
  // Determine the minimum role rank required.
  const maxRequiredRank = Math.max(...requiredRoles.map((r) => ROLE_RANK[r]));

  return async (...rawArgs: T): Promise<R> => {
    const reqHeaders = await headers();
    const session = await auth.api.getSession({ headers: reqHeaders });

    if (!session?.user) {
      throw new Error("UNAUTHORIZED");
    }

    // --- Resolve teamId ---
    // We try, in order: (1) rawArgs contains (orgSlug, workspaceSlug),
    // (2) rawArgs[0] is a team id (nanoid), (3) rawArgs[0] is a non-string
    //     meaning this is a nested call — fall back to activeTeamId,
    // (4) session's activeTeamId (set by the workspace layout).

    let teamId: string | undefined;
    let organizationId: string | undefined;

    // 1. Check if rawArgs has orgSlug and workspaceSlug (two strings)
    if (
      typeof rawArgs[0] === "string" &&
      typeof rawArgs[1] === "string"
    ) {
      // Try to resolve via org slug and team (workspace) slug
      const orgSlug = rawArgs[0];
      const workspaceSlug = rawArgs[1];

      const orgRow = await db.query.organization.findFirst({
        where: eq(organizationTable.slug, orgSlug),
        columns: { id: true },
      });

      if (orgRow) {
        const teamRow = await db.query.team.findFirst({
          where: and(
            eq(teamTable.organizationId, orgRow.id),
            eq(teamTable.slug, workspaceSlug)
          ),
          columns: { id: true, organizationId: true },
        });

        if (teamRow) {
          teamId = teamRow.id;
          organizationId = teamRow.organizationId;
        } else {
          // Team slug may be null (default org team) — fall back to the first team in the org.
          organizationId = orgRow.id;
          const firstTeam = await db.query.team.findFirst({
            where: eq(teamTable.organizationId, orgRow.id),
            columns: { id: true },
            orderBy: (t, { asc }) => [asc(t.createdAt)],
          });
          if (firstTeam) teamId = firstTeam.id;
        }
      }
    }

    // 2. Explicit args[0] — caller passes team id (21-char nanoid).
    if (!teamId) {
      if (
        typeof rawArgs[0] === "string" &&
        rawArgs[0].length === 21 &&
        /^[A-Za-z0-9_-]+$/.test(rawArgs[0])
      ) {
        teamId = rawArgs[0];
      }
    }

    // 3. Nested call (rawArgs[0] is non-string, e.g. a number) or no
    //    resolvable arg — fall back to the session's active team.
    if (!teamId) {
      teamId = session.session.activeTeamId ?? undefined;
    }

    if (!teamId) {
      // Last resort: if rawArgs[0] is an orgSlug, try to find user's first team
      // in that organization — avoids hard dependency on activeTeamId being set.
      if (
        typeof rawArgs[0] === "string" &&
        rawArgs.length === 2 &&
        typeof rawArgs[1] === "string"
      ) {
        const orgRow = await db.query.organization.findFirst({
          where: eq(organizationTable.slug, rawArgs[0]),
          columns: { id: true },
        });
        if (orgRow) {
          const firstTeam = await db.query.team.findFirst({
            where: eq(teamTable.organizationId, orgRow.id),
            columns: { id: true },
            orderBy: (t, { asc }) => [asc(t.createdAt)],
          });
          if (firstTeam) teamId = firstTeam.id;
        }
      }
    }

    if (!teamId) {
      // Final fallback: look up the user's first organization membership and
      // resolve the team's id from there. Handles nested calls (rawArgs is
      // non-string) where activeTeamId hasn't been set yet.
      const userMembership = await db.query.member.findFirst({
        where: eq(member.userId, session.user.id),
        columns: { organizationId: true },
      });
      if (userMembership) {
        organizationId = userMembership.organizationId;
        const firstTeam = await db.query.team.findFirst({
          where: eq(teamTable.organizationId, userMembership.organizationId),
          columns: { id: true },
          orderBy: (t, { asc }) => [asc(t.createdAt)],
        });
        if (firstTeam) teamId = firstTeam.id;
      }
    }

    if (!teamId) {
      throw new Error("MISSING_TEAM_ID");
    }

    // Look up the team to get its organizationId if not already found.
    let teamRow;
    if (!organizationId) {
      teamRow = await db.query.team.findFirst({
        where: eq(teamTable.id, teamId),
        columns: { id: true, organizationId: true },
      });

      if (!teamRow) {
        throw new Error("TEAM_NOT_FOUND");
      }
      organizationId = teamRow.organizationId;
    } else {
      teamRow = { id: teamId, organizationId };
    }

    // --- Check 1: Is the user a member of the organization? ---
    const orgMember = await db.query.member.findFirst({
      where: and(
        eq(member.userId, session.user.id),
        eq(member.organizationId, organizationId)
      ),
    });

    if (!orgMember) {
      throw new Error("FORBIDDEN");
    }

    // --- Check 2: Does the user have sufficient workspace (team) role? ---
    const workspaceRoleRow = await db.query.workspaceMemberRole.findFirst({
      where: and(
        eq(workspaceMemberRole.teamId, teamRow.id),
        eq(workspaceMemberRole.userId, session.user.id)
      ),
    });

    // If no explicit workspace role, fall back to org-level member role.
    const workspaceRole: PermissionRole =
      (workspaceRoleRow?.role as PermissionRole | null) ??
      ((orgMember.role as PermissionRole | null) ?? "viewer");

    const userRank = ROLE_RANK[workspaceRole];
    if (!userRank || userRank < maxRequiredRank) {
      throw new Error("FORBIDDEN");
    }

    return handler(
      {
        userId: session.user.id,
        organizationId,
        teamId: teamRow.id,
        role: workspaceRole,
      },
      ...rawArgs
    );
  };
}