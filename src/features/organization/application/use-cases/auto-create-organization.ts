import { auth } from "@/shared/infrastructure/auth/auth";
import { db } from "@/shared/infrastructure/database/client";
import { generateSlug } from "@/shared/lib/utils";
import { eq, and } from "drizzle-orm";
import { organization, team } from "@/shared/infrastructure/database/schema/auth-schema";
import { workspaceMemberRole } from "@/shared/infrastructure/database/schema/workspace-schema";
import { nanoid } from "nanoid";

export async function autoCreateOrganizationAndWorkspace(user: {
  id: string;
  name: string;
  email: string;
}) {
  const orgName = `${user.name}'s Organization`;
  const orgSlug = await generateUniqueSlug(orgName, "organization");

  const org = await auth.api.createOrganization({
    body: {
      name: orgName,
      slug: orgSlug,
      userId: user.id,
    },
  });

  // Ensure the org's default team has a slug matching the org slug.
  // BetterAuth creates the team without a slug, which breaks workspace
  // resolution in [orgSlug]/[workspaceSlug] routes.
  let existingTeam = await db.query.team.findFirst({
    where: eq(team.organizationId, org.id),
    orderBy: (t, { asc }) => [asc(t.createdAt)],
  });

  // Small retry to handle BetterAuth's team creation running after us.
  for (let i = 0; i < 5 && !existingTeam; i++) {
    await new Promise((r) => setTimeout(r, 100));
    existingTeam = await db.query.team.findFirst({
      where: eq(team.organizationId, org.id),
      orderBy: (t, { asc }) => [asc(t.createdAt)],
    });
  }

  let targetTeamId: string;

  if (existingTeam) {
    targetTeamId = existingTeam.id;
    if (existingTeam.slug !== orgSlug) {
      await db
        .update(team)
        .set({ slug: orgSlug })
        .where(eq(team.id, targetTeamId));
    }
  } else {
    const newTeam = await db
      .insert(team)
      .values({
        id: nanoid(),
        name: orgName,
        organizationId: org.id,
        slug: orgSlug,
        createdAt: new Date(),
      })
      .returning();
    targetTeamId = newTeam[0].id;
  }

  // Add user as owner in workspaceMemberRole if not already.
  const existingWMR = await db.query.workspaceMemberRole.findFirst({
    where: and(
      eq(workspaceMemberRole.teamId, targetTeamId),
      eq(workspaceMemberRole.userId, user.id),
    ),
  });

  if (!existingWMR) {
    await db.insert(workspaceMemberRole).values({
      id: nanoid(),
      teamId: targetTeamId,
      userId: user.id,
      role: "owner",
    });
  }
}

async function generateUniqueSlug(
  base: string,
  table: "organization" | "team"
): Promise<string> {
  let slug = generateSlug(base);
  let counter = 1;

  while (await slugExists(slug, table)) {
    slug = `${generateSlug(base)}-${counter}`;
    counter++;
  }
  return slug;
}

async function slugExists(slug: string, table: "organization" | "team"): Promise<boolean> {
  if (table === "organization") {
    const existing = await db.query.organization.findFirst({
      where: eq(organization.slug, slug),
    });
    return !!existing;
  }

  const existing = await db.query.team.findFirst({
    where: eq(team.slug, slug),
  });
  return !!existing;
}