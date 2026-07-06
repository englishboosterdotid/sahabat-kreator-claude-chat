import { redirect } from "next/navigation";
import { headers } from "next/headers";
import { auth } from "@/shared/infrastructure/auth/auth";
import { db } from "@/shared/infrastructure/database/client";
import { organization, team, member } from "@/shared/infrastructure/database/schema/auth-schema";
import { eq } from "drizzle-orm";

export default async function Home() {
  const reqHeaders = await headers();
  const session = await auth.api.getSession({ headers: reqHeaders });
  console.log("Home page, session:", session);

  if (!session) {
    console.log("No session, redirecting to /login");
    redirect("/login");
  }

  // If user is authenticated, find their orgs/teams and redirect to first workspace
  // First find all organizations the user is a member of
  const userMemberships = await db.query.member.findMany({
    where: eq(member.userId, session.user.id),
  });
  console.log("userMemberships:", userMemberships);

  if (userMemberships.length === 0) {
    console.log("No user memberships, redirecting to /login");
    redirect("/login");
  }

  // Get the first organization
  const firstOrg = await db.query.organization.findFirst({
    where: eq(organization.id, userMemberships[0].organizationId),
  });
  console.log("firstOrg:", firstOrg);

  if (!firstOrg) {
    console.log("No firstOrg, redirecting to /login");
    redirect("/login");
  }

  // Get teams for this organization
  const teams = await db.query.team.findMany({
    where: eq(team.organizationId, firstOrg.id),
  });
  console.log("teams:", teams);

  if (teams.length === 0) {
    console.log("No teams, redirecting to /login");
    redirect("/login");
  }

  const firstTeam = teams[0];
  console.log("firstTeam:", firstTeam);
  
  if (firstOrg.slug && firstTeam.slug) {
    console.log("Redirecting to /" + firstOrg.slug + "/" + firstTeam.slug);
    redirect(`/${firstOrg.slug}/${firstTeam.slug}`);
  }

  console.log("No slug missing, redirecting to /login");
  redirect("/login");
}