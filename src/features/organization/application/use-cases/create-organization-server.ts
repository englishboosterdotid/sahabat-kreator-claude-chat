"use server";

import { headers } from "next/headers";
import { auth } from "@/shared/infrastructure/auth/auth";
import { db } from "@/shared/infrastructure/database/client";
import { generateSlug } from "@/shared/lib/utils";
import { team } from "@/shared/infrastructure/database/schema/auth-schema";
import { eq, and, ne } from "drizzle-orm";
import { organization } from "@/shared/infrastructure/database/schema";
import { seedInitialBalance } from "@/features/ai-provider/infrastructure/balance/seed-initial-balance";

/**
 * Create a new organization with a default team.
 * Uses auth.api.createOrganization (server-only, bypasses organizationCreation.disabled).
 * Auto-creates a default team whose slug = org slug.
 */
export async function createOrganizationAction(name: string) {
  const reqHeaders = await headers();
  const session = await auth.api.getSession({ headers: reqHeaders });

  if (!session?.user) {
    return { success: false as const, error: "Belum login." };
  }

  const trimmed = name.trim();
  if (trimmed.length < 2) {
    return { success: false as const, error: "Nama minimal 2 karakter." };
  }
  if (trimmed.length > 100) {
    return { success: false as const, error: "Nama maksimal 100 karakter." };
  }

  const baseSlug = generateSlug(trimmed);
  const orgSlug = await makeUniqueOrgSlug(baseSlug);

  try {
    await auth.api.createOrganization({
      body: {
        name: trimmed,
        slug: orgSlug,
        userId: session.user.id,
      },
      headers: reqHeaders,
    });

    const created = await db.query.organization.findFirst({
      where: eq(organization.slug, orgSlug),
      with: { teams: true },
    });

    if (!created) {
      return { success: false as const, error: "Gagal membuat organisasi." };
    }

    // Default team was auto-created without a slug; backfill it from org slug.
    const defaultTeam = created.teams?.[0];
    if (defaultTeam) {
      await db
        .update(team)
        .set({ slug: orgSlug })
        .where(eq(team.id, defaultTeam.id));

      // Seed initial AI token balance ($0.50) for the default workspace.
      await seedInitialBalance(defaultTeam.id);
    }

    return {
      success: true as const,
      orgId: created.id,
      orgSlug: created.slug,
      firstTeamSlug: created.teams?.[0]?.slug ?? orgSlug,
    };
  } catch (_err) {
    return {
      success: false as const,
      error: "Gagal membuat organisasi. Mungkin slug sudah dipakai.",
    };
  }
}

/**
 * Create a new workspace (team) in the current organization.
 */
export async function createTeamAction(organizationId: string, name: string) {
  const reqHeaders = await headers();
  const session = await auth.api.getSession({ headers: reqHeaders });

  if (!session?.user) {
    return { success: false as const, error: "Belum login." };
  }

  const trimmed = name.trim();
  if (trimmed.length < 2) {
    return { success: false as const, error: "Nama minimal 2 karakter." };
  }
  if (trimmed.length > 100) {
    return { success: false as const, error: "Nama maksimal 100 karakter." };
  }

  const baseSlug = generateSlug(trimmed);
  const teamSlug = await makeUniqueTeamSlug(baseSlug);

  try {
    const result = await auth.api.createTeam({
      body: {
        name: trimmed,
        slug: teamSlug,
      },
      query: { organizationId },
      headers: reqHeaders,
    });

    if (!result) {
      return { success: false as const, error: "Gagal membuat workspace." };
    }

    // BetterAuth's createTeam response type omits slug — fetch the persisted
    // row to confirm the slug we sent was actually written (and not clobbered
    // by an afterCreateTeam hook).
    const persisted = await db.query.team.findFirst({
      where: eq(team.id, result.id),
    });

    // Seed initial balance ($0.50) for the new workspace (idempotent — no-op if already seeded).
    await seedInitialBalance(result.id);

    return {
      success: true as const,
      teamId: result.id,
      teamSlug: persisted?.slug ?? teamSlug,
    };
  } catch (_err) {
    return {
      success: false as const,
      error: "Gagal membuat workspace.",
    };
  }
}

async function makeUniqueOrgSlug(base: string): Promise<string> {
  let slug = base;
  let counter = 1;

  while (await orgSlugExists(slug)) {
    slug = `${base}-${counter}`;
    counter++;
  }
  return slug;
}

async function makeUniqueTeamSlug(base: string): Promise<string> {
  let slug = base;
  let counter = 1;

  while (await teamSlugExists(slug)) {
    slug = `${base}-${counter}`;
    counter++;
  }
  return slug;
}

async function orgSlugExists(slug: string): Promise<boolean> {
  const existing = await db.query.organization.findFirst({
    where: eq(organization.slug, slug),
  });
  return !!existing;
}

async function teamSlugExists(slug: string): Promise<boolean> {
  const existing = await db.query.team.findFirst({
    where: and(eq(team.slug, slug), ne(team.slug, "")),
  });
  return !!existing;
}
