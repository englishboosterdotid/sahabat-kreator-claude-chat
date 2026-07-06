"use client";

import * as DropdownMenu from "@radix-ui/react-dropdown-menu";
import { Building2, Plus } from "lucide-react";
import { useEffect, useState } from "react";

import { useListOrganizations } from "@/shared/infrastructure/auth/auth-client";
import { CreateEntityDialog } from "@/features/dashboard/presentation/components/create-entity-dialog";

export interface OrganizationSwitcherProps {
  currentOrgSlug: string;
  onSelect: (orgId: string, orgSlug: string) => void;
  onCreated?: (orgId: string, orgSlug: string, firstTeamSlug: string) => void;
}

export function OrganizationSwitcher({
  currentOrgSlug,
  onSelect,
  onCreated,
}: OrganizationSwitcherProps) {
  const { data: allOrganizations } = useListOrganizations();
  const [showOrgDialog, setShowOrgDialog] = useState(false);

  const activeOrg = allOrganizations?.find((o) => o.slug === currentOrgSlug);
  const orgLabel = activeOrg?.name ?? "Memuat...";

  return (
    <>
      <DropdownMenu.Root>
        <DropdownMenu.Trigger asChild>
          <button
            className="group flex w-full items-center gap-3 rounded-xl border border-transparent bg-transparent px-3 py-2.5 text-left transition-all hover:border-border hover:bg-card"
            aria-label="Switch organization"
          >
            <div className="flex size-8 shrink-0 items-center justify-center rounded-md bg-secondary text-secondary-foreground">
              <Building2 size={16} />
            </div>
            <div className="min-w-0 flex-1 overflow-hidden">
              <p className="truncate text-sm font-semibold leading-tight text-foreground">
                {orgLabel}
              </p>
              <p className="truncate text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">
                Organisasi
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
              <Building2 size={11} />
              Organisasi
            </DropdownMenu.Label>

            {allOrganizations?.length ? (
              allOrganizations.map((org) => {
                const isActive = org.slug === currentOrgSlug;
                return (
                  <DropdownMenu.Item
                    key={org.id}
                    onSelect={() => {
                      if (org.slug !== currentOrgSlug) {
                        onSelect(org.id, org.slug);
                      }
                    }}
                    className="group flex cursor-pointer select-none items-center gap-3 rounded-lg px-3 py-2.5 text-sm transition-colors data-[highlighted]:bg-accent"
                  >
                    <div
                      className={`flex size-7 shrink-0 items-center justify-center rounded-md text-xs font-bold transition-all ${
                        isActive
                          ? "bg-primary text-primary-foreground"
                          : "bg-muted text-muted-foreground"
                      }`}
                    >
                      {org.name.charAt(0).toUpperCase()}
                    </div>
                    <div className="min-w-0 flex-1">
                      <p className="truncate text-sm font-medium text-foreground">
                        {org.name}
                      </p>
                    </div>
                    {isActive && (
                      <span className="shrink-0 text-[10px] font-bold uppercase tracking-wider text-primary">
                        Aktif
                      </span>
                    )}
                  </DropdownMenu.Item>
                );
              })
            ) : (
              <p className="px-3 py-2 text-sm text-muted-foreground">
                Belum ada organisasi.
              </p>
            )}

            <DropdownMenu.Separator className="my-2 h-px bg-border" />

            <DropdownMenu.Item
              onSelect={() => setShowOrgDialog(true)}
              className="group flex cursor-pointer select-none items-center gap-3 rounded-lg px-3 py-2.5 text-sm transition-colors data-[highlighted]:bg-accent"
            >
              <div className="flex size-7 shrink-0 items-center justify-center rounded-md bg-primary/10">
                <Plus size={14} className="text-primary" />
              </div>
              <span className="font-semibold text-primary">Buat Organisasi</span>
            </DropdownMenu.Item>
          </DropdownMenu.Content>
        </DropdownMenu.Portal>
      </DropdownMenu.Root>

      <CreateEntityDialog
        entityType="organization"
        isOpen={showOrgDialog}
        onOpenChange={setShowOrgDialog}
        onSuccess={(result) => {
          if (result.orgId && result.orgSlug) {
            onCreated?.(result.orgId, result.orgSlug, result.firstTeamSlug ?? result.orgSlug);
          }
        }}
      />
    </>
  );
}