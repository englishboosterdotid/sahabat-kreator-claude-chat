"use client";

import Image from "next/image";
import { Menu } from "lucide-react";
import { cn } from "@/shared/lib/utils";
import { ThemeToggle } from "@/shared/presentation/components/ui/theme-toggle";
import { NotificationBell } from "./notification-bell";
import { UserMenu } from "./user-menu";
import {
  Sheet,
  SheetContent,
  SheetTrigger,
} from "@/shared/presentation/components/ui/sheet";
import { Sidebar } from "./sidebar/sidebar";
import { MobileBottomNav } from "./mobile-bottom-nav";
import { useState, useEffect } from "react";

type Team = {
  id: string;
  name: string;
  slug: string;
};

export function DashboardShell({
  orgSlug,
  workspaceSlug,
  teams,
  user,
  children,
}: {
  orgSlug: string;
  workspaceSlug: string;
  teams: Team[];
  user: {
    name: string;
    email: string;
  };
  children: React.ReactNode;
}) {
  const basePath = `/${orgSlug}/${workspaceSlug}`;
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    if (mobileMenuOpen) {
      const close = () => setMobileMenuOpen(false);
      window.addEventListener("popstate", close);
      return () => window.removeEventListener("popstate", close);
    }
  }, [mobileMenuOpen]);

  return (
    <div className="relative flex min-h-screen bg-background">
      {/* Background ambient gradients */}
      <div className="pointer-events-none fixed inset-0 -z-10 overflow-hidden">
        <div className="absolute -right-[10%] -top-[10%] h-[40%] w-[40%] rounded-full bg-primary/5 blur-[120px]" />
        <div className="absolute -bottom-[10%] -left-[5%] h-[30%] w-[30%] rounded-full bg-secondary/5 blur-[100px]" />
      </div>

      {/* Desktop Sidebar - hidden on mobile */}
      <div className="hidden md:block">
        <Sidebar
          orgSlug={orgSlug}
          workspaceSlug={workspaceSlug}
          teams={teams}
          user={user}
        />
      </div>

      <div className="flex min-w-0 flex-1 flex-col">
        {/* ─── Sticky Header ─── */}
        <header className={cn(
          "sticky top-0 z-50 flex h-16 items-center justify-between border-b border-border bg-card/95 backdrop-blur-xl shadow-sm transition-colors",
          // Mobile: full width with hamburger
          "md:justify-end",
        )}>
          {/* Mobile header content */}
          <div className="flex items-center gap-3 px-4 md:hidden">
            <Sheet open={mobileMenuOpen} onOpenChange={setMobileMenuOpen}>
              <SheetTrigger asChild>
                <button
                  className="rounded-lg p-2 transition-colors hover:bg-accent"
                  aria-label="Menu"
                >
                  <Menu className="size-5 text-muted-foreground" />
                </button>
              </SheetTrigger>
              <SheetContent side="left" className="w-[280px] p-0">
                <div className="h-full">
                  <Sidebar
                    orgSlug={orgSlug}
                    workspaceSlug={workspaceSlug}
                    teams={teams}
                    user={user}
                    mobileOnly
                  />
                </div>
              </SheetContent>
            </Sheet>
            <div className="flex items-center gap-2">
              <div className="flex size-8 items-center justify-center overflow-hidden rounded-lg bg-primary">
                <Image src="/logo.png" alt="" width={24} height={24} />
              </div>
              <span className="font-bold">Sahabat Kreator</span>
            </div>
          </div>

          {/* Desktop topbar content */}
          <div className="flex items-center gap-1 pr-4">
            {/* Theme toggle */}
            <div className="hidden md:block">
              <ThemeToggle />
            </div>

            {/* Notification bell */}
            <NotificationBell />

            {/* User avatar with dropdown */}
            <UserMenu name={user.name} email={user.email} />
          </div>
        </header>

        {/* Main content */}
        <main className="min-w-0 flex-1 bg-background px-4 pb-20 pt-4 md:pb-8 lg:px-8 lg:pt-8">
          {children}
        </main>

        {/* Mobile bottom nav - only show on mobile */}
        <div className="md:hidden">
          <MobileBottomNav basePath={basePath} />
        </div>
      </div>
    </div>
  );
}