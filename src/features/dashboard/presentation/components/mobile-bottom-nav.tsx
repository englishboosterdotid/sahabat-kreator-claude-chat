"use client";

import { usePathname } from "next/navigation";
import Link from "next/link";
import {
  Grid3x3,
  Sparkles,
  CalendarRange,
  MoreHorizontal,
  Share2,
  BarChart3,
  CalendarCheck,
  BookOpen,
  RefreshCcw,
} from "lucide-react";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/shared/presentation/components/ui/sheet";
import { cn } from "@/shared/lib/utils";

type NavItem = {
  label: string;
  href: string;
  icon: React.ElementType;
};

const MAIN_NAV_ITEMS: NavItem[] = [
  {
    label: "Home",
    href: "",
    icon: Grid3x3,
  },
  {
    label: "Generate",
    href: "/content/generate",
    icon: Sparkles,
  },
  {
    label: "Plan",
    href: "/content-plan",
    icon: CalendarRange,
  },
  {
    label: "More",
    href: "",
    icon: MoreHorizontal,
  },
];

const MORE_NAV_ITEMS: NavItem[] = [
  {
    label: "Content Transform",
    href: "/content/transform",
    icon: RefreshCcw,
  },
  {
    label: "Momentum",
    href: "/momentum",
    icon: CalendarCheck,
  },
  {
    label: "Analitik",
    href: "/analytics",
    icon: BarChart3,
  },
  {
    label: "Integrasi Sosial",
    href: "/social-integration",
    icon: Share2,
  },
  {
    label: "Knowledge Base",
    href: "/knowledge",
    icon: BookOpen,
  },
];

export function MobileBottomNav({ basePath }: { basePath: string }) {
  const pathname = usePathname();

  const isActive = (href: string) => {
    const fullPath = basePath + href;
    return pathname === fullPath || (href === "" && pathname === basePath);
  };

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-40 border-t border-border bg-card/90 backdrop-blur-md md:hidden">
      <div className="flex items-center justify-around h-16">
        {MAIN_NAV_ITEMS.map((item, index) => {
          if (item.label === "More") {
            return (
              <Sheet key={item.label}>
                <SheetTrigger asChild>
                  <button
                    className={cn(
                      "flex flex-col items-center justify-center gap-1 px-4 py-2 transition-colors",
                      isActive(item.href) ? "text-primary" : "text-muted-foreground hover:text-foreground"
                    )}
                  >
                    <item.icon className="size-6" />
                    <span className="text-[11px] font-medium">{item.label}</span>
                  </button>
                </SheetTrigger>
                <SheetContent side="bottom" className="h-[60vh] rounded-t-3xl">
                  <SheetHeader className="mb-4">
                    <SheetTitle className="text-center">Menu Lainnya</SheetTitle>
                  </SheetHeader>
                  <div className="space-y-2">
                    {MORE_NAV_ITEMS.map((moreItem) => (
                      <Link
                        key={moreItem.href}
                        href={basePath + moreItem.href}
                        className={cn(
                          "flex items-center gap-4 rounded-xl px-4 py-3 transition-colors",
                          isActive(moreItem.href)
                            ? "bg-accent text-accent-foreground"
                            : "hover:bg-accent/50"
                        )}
                      >
                        <moreItem.icon className="size-5" />
                        <span className="font-medium">{moreItem.label}</span>
                      </Link>
                    ))}
                  </div>
                </SheetContent>
              </Sheet>
            );
          }

          return (
            <Link
              key={item.href}
              href={basePath + item.href}
              className={cn(
                "flex flex-col items-center justify-center gap-1 px-4 py-2 transition-colors",
                isActive(item.href) ? "text-primary" : "text-muted-foreground hover:text-foreground"
              )}
            >
              <item.icon className="size-6" />
              <span className="text-[11px] font-medium">{item.label}</span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
