"use client";

import { ThemeToggle } from "@/shared/presentation/components/ui/theme-toggle";
import { UserMenu } from "./user-menu";
import { NotificationBell } from "./notification-bell";

export function Topbar({
  user,
}: {
  user?: {
    name: string;
    email: string;
  };
}) {
  if (!user) return null;

  return (
    <header className="sticky top-0 z-50 flex h-16 shrink-0 items-center justify-end border-b border-border bg-card/95 backdrop-blur-xl shadow-sm px-4 lg:px-8">
      <div className="flex items-center gap-2">
        <ThemeToggle />
        <NotificationBell />
        <UserMenu
          name={user.name}
          email={user.email}
        />
      </div>
    </header>
  );
}