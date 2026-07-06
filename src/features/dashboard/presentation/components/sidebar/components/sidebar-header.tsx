"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";

import {
  authClient,
  useActiveOrganization,
} from "@/shared/infrastructure/auth/auth-client";
import { CreateEntityDialog } from "@/features/dashboard/presentation/components/create-entity-dialog";
import { OrganizationSwitcher } from "@/features/organization/presentation/components/organization-switcher";
import { WorkspaceSwitcher } from "@/features/workspace/presentation/components/workspace-switcher";

type Team = {
  id: string;
  name: string;
  slug: string;
};

interface SidebarHeaderProps {
  orgSlug: string;
  workspaceSlug: string;
  teams: Team[];
  collapsed: boolean;
}

export function SidebarHeader({
  orgSlug,
  workspaceSlug,
  teams,
  collapsed,
}: SidebarHeaderProps) {
  const router = useRouter();
  const { data: activeOrg } = useActiveOrganization();
  const [showTeamDialog, setShowTeamDialog] = useState(false);

  if (collapsed) return null;

  async function handleOrgSelect(orgId: string, newOrgSlug: string) {
    await authClient.organization.setActive({ organizationId: orgId });

    const teamsResult = await authClient.organization.listTeams({
      query: { organizationId: orgId },
    });
    const firstTeam = teamsResult.data?.[0];

    if (firstTeam?.slug) {
      router.push(`/${newOrgSlug}/${firstTeam.slug}`);
    } else {
      // No workspace yet — bounce to home; user can create one from sidebar.
      router.push("/");
    }
  }

  const activeOrgId = activeOrg?.id;

  function handleOrgCreated(orgId: string, orgSlug: string, firstTeamSlug: string) {
    // 1) Set active org (server-side session cookie updated)
    // 2) Notify $listOrg atom → useListOrganizations() refetches
    // 3) router.refresh → re-render server components (teams list)
    // 4) Navigate to org's default workspace
    authClient.organization
      .setActive({ organizationId: orgId })
      .then(() => {
        authClient.$store.notify("$listOrg");
        window.location.href = `/${orgSlug}/${firstTeamSlug}`;
      })
      .catch(() => {
        window.location.href = `/${orgSlug}/${firstTeamSlug}`;
      });
  }

  return (
    <>
      <OrganizationSwitcher
        currentOrgSlug={orgSlug}
        onSelect={handleOrgSelect}
        onCreated={handleOrgCreated}
      />
      <WorkspaceSwitcher
        orgSlug={orgSlug}
        currentWorkspaceSlug={workspaceSlug}
        teams={teams}
        onCreateWorkspace={() => setShowTeamDialog(true)}
      />

      <CreateEntityDialog
        entityType="team"
        organizationId={activeOrgId}
        isOpen={showTeamDialog}
        onOpenChange={setShowTeamDialog}
        onSuccess={(result) => {
          if (result.teamSlug && orgSlug) {
            // Hard navigation so server layout refetches teams list cleanly
            // (router.refresh before push races with the new route and 404s)
            window.location.href = `/${orgSlug}/${result.teamSlug}`;
          }
        }}
      />
    </>
  );
}
