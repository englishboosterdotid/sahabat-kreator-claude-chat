"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/shared/lib/utils";
import type { NavItem } from "../../constants/nav-items";

export function SidebarNavItem({
  item,
  basePath,
  collapsed,
  description,
}: {
  item: NavItem;
  basePath: string;
  collapsed: boolean;
  description?: string;
}) {
  const pathname = usePathname();

  const fullHref = `${basePath}${item.href}`;

  const isActive =
    item.href === ""
      ? pathname === basePath
      : pathname === fullHref || pathname.startsWith(`${fullHref}/`);

  const Icon = item.icon;

  return (
    <Link
      href={fullHref}
      title={collapsed ? item.label : undefined}
      className={cn(
        "group flex items-start rounded-lg px-3 py-2 transition-all duration-200",
        collapsed ? "justify-center" : "gap-3",
        isActive
          ? "bg-primary/15 text-primary"
          : "text-muted-foreground hover:bg-accent/60 hover:text-foreground"
      )}
    >
      <Icon
        size={18}
        className={cn(
          "mt-0.5 shrink-0 transition-transform duration-200 group-hover:scale-110",
          isActive && "text-primary"
        )}
      />

      {!collapsed && (
        <div className="min-w-0 flex-1">
          <span className="block text-sm font-medium leading-tight">
            {item.label}
          </span>
          {description && (
            <span className="mt-0.5 block truncate text-[11px] text-muted-foreground/80">
              {description}
            </span>
          )}
        </div>
      )}

      {isActive && !collapsed && (
        <span className="mt-1.5 size-1.5 shrink-0 rounded-full bg-primary" />
      )}
    </Link>
  );
}