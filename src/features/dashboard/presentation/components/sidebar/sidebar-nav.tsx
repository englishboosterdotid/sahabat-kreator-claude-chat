"use client";

import { useState } from "react";
import { ChevronDown } from "lucide-react";
import { cn } from "@/shared/lib/utils";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/shared/presentation/components/ui/collapsible";
import { SidebarNavItem } from "./sidebar-nav-item";
import type { NavGroup } from "../../constants/nav-items";

const STORAGE_KEY = "sidebar-group-collapsed";

function loadCollapsedState(groupLabels: string[]): Record<string, boolean> {
  if (typeof window === "undefined") return {};
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) return {};
    const parsed = JSON.parse(raw) as Record<string, boolean>;
    // Filter out stale keys (group names that no longer exist)
    const filtered: Record<string, boolean> = {};
    groupLabels.forEach((label) => {
      if (parsed[label] !== undefined) filtered[label] = parsed[label];
    });
    return filtered;
  } catch {
    return {};
  }
}

function saveCollapsedState(state: Record<string, boolean>) {
  if (typeof window === "undefined") return;
  try {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  } catch {
    // ignore
  }
}

export function SidebarNav({
  basePath,
  collapsed,
  groups,
}: {
  basePath: string;
  collapsed: boolean;
  groups: NavGroup[];
}) {
  // Server-render: groups all open by default. After mount, hydrate from localStorage.
  const groupLabels = groups.map((g) => g.label);
  const [collapsedGroups, setCollapsedGroups] = useState<Record<string, boolean>>(() => {
    const initial: Record<string, boolean> = {};
    groupLabels.forEach((label) => {
      initial[label] = false;
    });
    return initial;
  });

  // Hydrate from localStorage on mount
  if (typeof window !== "undefined") {
    // Use a stable hydration key per render
    const hydrationKey = "__hydrated";
    if (!(collapsedGroups as Record<string, unknown>)[hydrationKey]) {
      const fromStorage = loadCollapsedState(groupLabels);
      if (Object.keys(fromStorage).length > 0) {
        const next = { ...collapsedGroups, ...fromStorage };
        (next as Record<string, unknown>)[hydrationKey] = true;
        // schedule state update for after mount
        queueMicrotask(() => setCollapsedGroups(next));
      } else {
        (collapsedGroups as Record<string, unknown>)[hydrationKey] = true;
      }
    }
  }

  function toggleGroup(label: string) {
    setCollapsedGroups((prev) => {
      const next = { ...prev, [label]: !prev[label] };
      saveCollapsedState(next);
      return next;
    });
  }

  return (
    <nav className="flex-1 overflow-y-visible">
      {groups.map((group) => {
        const isCollapsed = !!collapsedGroups[group.label];

        return (
          <Collapsible
            key={group.label}
            open={!isCollapsed}
            onOpenChange={() => toggleGroup(group.label)}
            className="mb-1"
          >
            {!collapsed && (
              <CollapsibleTrigger
                className={cn(
                  "group/trigger mx-1 mb-1 mt-3 flex w-[calc(100%-0.5rem)] items-center justify-between rounded-md px-2 py-1 text-left text-[11px] font-semibold uppercase tracking-wider text-muted-foreground/70 transition-colors hover:bg-accent/60 hover:text-foreground",
                )}
              >
                <span>{group.label}</span>
                <ChevronDown
                  className={cn(
                    "size-3.5 shrink-0 transition-transform duration-200",
                    !isCollapsed && "rotate-180",
                  )}
                />
              </CollapsibleTrigger>
            )}
            <CollapsibleContent
              className={cn(
                "overflow-hidden transition-all",
                "data-[state=open]:animate-collapsible-down data-[state=closed]:animate-collapsible-up",
              )}
            >
              <div className="space-y-0.5">
                {group.items.map((item) => (
                  <SidebarNavItem
                    key={item.href}
                    item={item}
                    basePath={basePath}
                    collapsed={collapsed}
                    description={!collapsed ? item.description : undefined}
                  />
                ))}
              </div>
            </CollapsibleContent>
          </Collapsible>
        );
      })}
    </nav>
  );
}