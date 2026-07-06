"use client";

import { NavGroup, type NavItem } from "../../constants/nav-items";
import { SidebarNavItem } from "./sidebar-nav-item";

export function SidebarNav({
  basePath,
  collapsed,
  groups,
}: {
  basePath: string;
  collapsed: boolean;
  groups: NavGroup[];
}) {
  return (
    <nav className="flex-1 overflow-y-auto">
      {groups.map((group) => (
        <div key={group.label} className="mb-2">
          {!collapsed && (
            <p className="mx-3 mb-1 mt-3 text-[11px] font-semibold uppercase tracking-wider text-muted-foreground/70">
              {group.label}
            </p>
          )}
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
        </div>
      ))}
    </nav>
  );
}
