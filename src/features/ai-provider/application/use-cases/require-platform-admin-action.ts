import { headers } from "next/headers";
import { eq } from "drizzle-orm";
import { auth } from "@/shared/infrastructure/auth/auth";
import { db } from "@/shared/infrastructure/database/client";
import { user } from "@/shared/infrastructure/database/schema";

/**
 * Parse the optional `PLATFORM_ADMIN_IDS` env var as comma-separated user IDs.
 * Useful as a safety net before `user.role = 'super_admin'` exists.
 */
function getPlatformAdminIds(): string[] {
  const raw = process.env.PLATFORM_ADMIN_IDS;
  if (!raw) return [];
  return raw.split(",").map((s) => s.trim()).filter(Boolean);
}

/**
 * Server-action wrapper: only callable by platform super_admin.
 *
 * @param label — descriptive action label for logging
 * @param fn — the guarded handler. Receives `{ userId: string }` context + args
 */
export function withPlatformAdmin<A extends unknown[], R>(
  label: string,
  fn: (ctx: { userId: string }, ...args: A) => Promise<R>
): (...args: A) => Promise<R> {
  return async (...args: A) => {
    const sessionId = (await headers()).get("cookie") || "";
    // Extract session via Better Auth's API (must be called from a route handler).
    // But inside server actions we use the server module directly.
    const hdrs = await headers();
    const session = await auth.api.getSession({ headers: hdrs });

    if (!session?.user?.id) {
      throw new Error("Forbidden: belum login");
    }

    const row = await db.query.user.findFirst({
      where: eq(user.id, session.user.id),
    });

    if (!row) throw new Error("Forbidden: user tidak ditemukan");

    const isSuperAdmin =
      row.role === "super_admin" ||
      getPlatformAdminIds().includes(row.id);

    if (!isSuperAdmin) {
      console.warn(
        `[${label}] Forbidden: user ${session.user.id} (${session.user.email}) is not a platform admin`
      );
      throw new Error("Forbidden: perlu role platform_admin");
    }

    return fn({ userId: row.id }, ...args);
  };
}