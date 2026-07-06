"use client";

import Image from "next/image";
import { SidebarNav } from "./sidebar-nav";
import { SidebarUserMenu } from "./sidebar-user-menu";
import { SidebarHeader } from "./components/sidebar-header";
import { NAV_GROUPS } from "../../constants/nav-items";

type Team = {
  id: string;
  name: string;
  slug: string;
};

export function Sidebar({
  orgSlug,
  workspaceSlug,
  teams,
  user,
  mobileOnly = false,
}: {
  orgSlug: string;
  workspaceSlug: string;
  teams: Team[];
  user: {
    name: string;
    email: string;
  };
  mobileOnly?: boolean;
}) {
  const basePath = `/${orgSlug}/${workspaceSlug}`;

  return (
    <aside className={
      mobileOnly 
        ? "flex h-full flex-col bg-card" 
        : "sticky top-0 z-40 flex h-screen w-[300px] flex-col border-r border-border bg-card"
    }>
      <div className="px-5 pt-6">
        <div className="flex items-center gap-3">
          <div className="flex size-10 shrink-0 items-center justify-center overflow-hidden rounded-lg bg-primary">
            <Image
              src="/logo.png"
              alt="Sahabat Kreator"
              width={40}
              height={40}
            />
          </div>
          <div className="min-w-0 flex-1">
            <p className="truncate text-sm font-bold">
              Sahabat Kreator
            </p>
            <p className="truncate text-[11px] uppercase tracking-wider text-muted-foreground">
              Creator Dashboard
            </p>
          </div>
        </div>
      </div>

      <SidebarHeader
        orgSlug={orgSlug}
        workspaceSlug={workspaceSlug}
        teams={teams}
        collapsed={false}
      />

      <div className="min-h-0 flex-1 overflow-y-auto px-3">
        <SidebarNav
          basePath={basePath}
          collapsed={false}
          groups={NAV_GROUPS}
        />
      </div>

      <div className="border-t border-border bg-card/60 px-5 py-4">
        <SidebarUserMenu
          name={user.name}
          email={user.email}
          collapsed={false}
        />
      </div>
    </aside>
  );
}
