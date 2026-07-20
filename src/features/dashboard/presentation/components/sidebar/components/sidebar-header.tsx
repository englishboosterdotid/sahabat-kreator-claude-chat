"use client";

import { useRouter } from "next/navigation";
import { useState, useRef } from "react";

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
    try {
      await authClient.organization.setActive({ organizationId: orgId });
    } catch {
      // Even if setActive fails, do a hard reload so the new orgSlug is picked up.
      window.location.href = `/${newOrgSlug}`;
      return;
    }

    const teamsResult = await authClient.organization.listTeams({
      query: { organizationId: orgId },
    });
    const firstTeam = teamsResult.data?.[0];

    // Defer navigation so Radix dropdown's internal cleanup completes
    // before we unmount the component (fixes "state update on unmounted component").
    setTimeout(() => {
      if (firstTeam?.slug) {
        window.location.href = `/${newOrgSlug}/${firstTeam.slug}`;
      } else {
        window.location.href = "/";
      }
    }, 0);
  }

  const activeOrgId = activeOrg?.id;

  function handleOrgCreated(orgId: string, orgSlug: string, firstTeamSlug: string) {
    // 1) Set active org (server-side session cookie updated)
    // 2) Notify $listOrg atom → useListOrganizations() refetches
    // 3) Defer navigation so Radix dropdown cleanup completes before unmounting
    authClient.organization
      .setActive({ organizationId: orgId })
      .then(() => {
        authClient.$store.notify("$listOrg");
        setTimeout(() => {
          window.location.href = `/${orgSlug}/${firstTeamSlug}`;
        }, 0);
      })
      .catch(() => {
        setTimeout(() => {
          window.location.href = `/${orgSlug}/${firstTeamSlug}`;
        }, 0);
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
