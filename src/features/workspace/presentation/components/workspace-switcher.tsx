"use client";

import * as DropdownMenu from "@radix-ui/react-dropdown-menu";
import { Briefcase, Plus } from "lucide-react";
import { usePathname } from "next/navigation";

type Team = { id: string; name: string; slug: string };

interface WorkspaceSwitcherProps {
  orgSlug: string;
  currentWorkspaceSlug: string;
  teams: Team[];
  onCreateWorkspace: () => void;
}

export function WorkspaceSwitcher({
  orgSlug,
  currentWorkspaceSlug,
  teams,
  onCreateWorkspace,
}: WorkspaceSwitcherProps) {
  const pathname = usePathname();
  const currentTeam = teams.find((t) => t.slug === currentWorkspaceSlug);
  const teamLabel = currentTeam?.name ?? currentWorkspaceSlug;

  const switchTo = (slug: string) => {
    if (slug === currentWorkspaceSlug) return;
    const segments = pathname.split("/").filter(Boolean);
    // Replace current workspace slug with new one
    const newSegments = segments.map((seg) =>
      seg === currentWorkspaceSlug ? slug : seg
    );
    const newPath = "/" + newSegments.join("/");
    // Hard navigation so layout.tsx re-runs server-side and refreshes
    // BetterAuth session cookies (mirrors OrganizationSwitcher pattern).
    window.location.href = newPath;
  };

  return (
    <DropdownMenu.Root>
      <DropdownMenu.Trigger asChild>
        <button
          className="group flex w-full items-center gap-3 rounded-xl border border-transparent bg-transparent px-3 py-2.5 text-left transition-all hover:border-border hover:bg-card"
          aria-label="Switch workspace"
        >
          <div className="flex size-8 shrink-0 items-center justify-center rounded-md bg-muted text-muted-foreground">
            <Briefcase size={16} />
          </div>
          <div className="min-w-0 flex-1 overflow-hidden">
            <p className="truncate text-sm font-semibold leading-tight text-foreground">
              {teamLabel}
            </p>
            <p className="truncate text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">
              Workspace
            </p>
          </div>
        </button>
      </DropdownMenu.Trigger>

      <DropdownMenu.Portal>
        <DropdownMenu.Content
          className="z-50 w-[var(--radix-dropdown-menu-trigger-width)] animate-in data-[side=bottom]:slide-from-bottom-2 rounded-xl border border-border bg-background p-2 shadow-lg"
          align="start"
          sideOffset={6}
        >
          <DropdownMenu.Label className="mb-1.5 flex items-center gap-2 px-1 text-[10px] font-bold uppercase tracking-widest text-muted-foreground">
            <Briefcase size={11} />
            Workspace
            {teams.length > 0 && (
              <span className="rounded-md bg-secondary px-1.5 py-0.5 text-[10px] font-medium text-muted-foreground">
                {teams.length}
              </span>
            )}
          </DropdownMenu.Label>

          {teams.length > 0 ? (
            teams.map((t) => {
              const isActive = t.slug === currentWorkspaceSlug;
              return (
                <DropdownMenu.Item
                  key={t.id}
                  onSelect={() => switchTo(t.slug)}
                  className={`group flex cursor-pointer select-none items-center gap-3 rounded-lg px-3 py-2.5 text-sm transition-colors data-[highlighted]:bg-accent ${
                    isActive ? "bg-primary/5" : ""
                  }`}
                >
                  <div
                    className={`flex size-7 shrink-0 items-center justify-center rounded-md text-xs font-bold transition-all ${
                      isActive
                        ? "bg-primary text-primary-foreground ring-2 ring-primary/30"
                        : "bg-muted text-muted-foreground"
                    }`}
                  >
                    {t.name.charAt(0).toUpperCase()}
                  </div>
                  <div className="min-w-0 flex-1">
                    <p
                      className={`truncate text-sm font-medium ${
                        isActive ? "text-primary" : "text-foreground"
                      }`}
                    >
                      {t.name}
                    </p>
                  </div>
                  {isActive && (
                    <span className="shrink-0 rounded-full bg-primary px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider text-primary-foreground">
                      Aktif
                    </span>
                  )}
                </DropdownMenu.Item>
              );
            })
          ) : (
            <p className="px-3 py-2 text-sm text-muted-foreground">
              Belum ada workspace.
            </p>
          )}

          <DropdownMenu.Separator className="my-2 h-px bg-border" />

          <DropdownMenu.Item
            onSelect={onCreateWorkspace}
            className="group flex cursor-pointer select-none items-center gap-3 rounded-lg px-3 py-2.5 text-sm transition-colors data-[highlighted]:bg-accent"
          >
            <div className="flex size-7 shrink-0 items-center justify-center rounded-md bg-muted">
              <Plus size={14} className="text-muted-foreground" />
            </div>
            <span className="font-medium text-foreground">Buat Workspace</span>
          </DropdownMenu.Item>
        </DropdownMenu.Content>
      </DropdownMenu.Portal>
    </DropdownMenu.Root>
  );
}
