"use server";

import { headers } from "next/headers";
import { eq } from "drizzle-orm";
import { auth } from "@/shared/infrastructure/auth/auth";
import { db } from "@/shared/infrastructure/database/client";
import { user } from "@/shared/infrastructure/database/schema";

/**
 * Super-admin = user with `role = 'super_admin'` in `user` table.
 *
 * Super-admin is platform-level: they're not scoped to a single org or
 * workspace, and they can approve AI top-up invoices across the whole
 * platform. Membership checks (which orgs/teams they belong to) still
 * apply separately via `auth.api.listOrganizations`.
 *
 * If `role` is empty / null, falls back to a "platform admins" list
 * parsed from the `PLATFORM_ADMIN_IDS` env var (comma-separated user IDs).
 * This is a safety net for the very first super admin before the role
 * column gets populated.
 */
function isPlatformSuperAdminFromEnv(userId: string): boolean {
  const raw = process.env.PLATFORM_ADMIN_IDS;
  if (!raw) return false;
  return raw.split(",").map((s) => s.trim()).filter(Boolean).includes(userId);
}

export async function requirePlatformSuperAdmin(): Promise<{ userId: string; email: string }> {
  const session = await auth.api.getSession({ headers: await headers() });
  if (!session?.user?.id) {
    throw new Error("UNAUTHORIZED");
  }

  const row = await db.query.user.findFirst({
    where: eq(user.id, session.user.id),
  });

  if (!row) throw new Error("UNAUTHORIZED");

  const isSuperAdmin = row.role === "super_admin" || isPlatformSuperAdminFromEnv(row.id);
  if (!isSuperAdmin) throw new Error("FORBIDDEN: super_admin role required");

  return { userId: row.id, email: row.email };
}