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
    <nav
      className="fixed bottom-0 inset-x-0 z-50 flex h-16 items-center justify-evenly border-t border-border bg-card/90 backdrop-blur-xl shadow-[0_-4px_12px_rgba(0,0,0,0.05)] md:hidden"
      role="navigation"
      aria-label="Mobile navigation"
    >
      {MAIN_NAV_ITEMS.map((item, index) => {
        if (item.label === "More") {
          return (
            <Sheet key={item.label}>
              <SheetTrigger asChild>
                <button
                  type="button"
                  className={cn(
                    "relative flex flex-col items-center justify-center gap-1 px-5 py-2 rounded-xl transition-all duration-200",
                    isActive(item.href)
                      ? "text-primary"
                      : "text-muted-foreground hover:text-foreground",
                  )}
                >
                  {/* Active indicator dot */}
                  {isActive(item.href) && (
                    <span className="absolute -top-1.5 inset-x-0 flex justify-center">
                      <span className="size-1.5 rounded-full bg-primary animate-pulse" />
                    </span>
                  )}
                  <item.icon
                    className={cn(
                      "size-[22px] transition-transform duration-200",
                      isActive(item.href) && "scale-110",
                    )}
                  />
                  <span
                    className={cn(
                      "text-[11px] font-medium transition-all duration-200",
                      isActive(item.href) ? "font-semibold" : "font-normal",
                    )}
                  >
                    {item.label}
                  </span>
                </button>
              </SheetTrigger>
              <SheetContent side="bottom" className="h-[65vh] rounded-t-3xl">
                <SheetHeader className="mb-5">
                  <SheetTitle className="text-center">Menu Lainnya</SheetTitle>
                </SheetHeader>
                <div className="space-y-1 px-2">
                  {MORE_NAV_ITEMS.map((moreItem) => (
                    <Link
                      key={moreItem.href}
                      href={basePath + moreItem.href}
                      className={cn(
                        "flex items-center gap-4 rounded-xl px-4 py-3 transition-all duration-200",
                        isActive(moreItem.href)
                          ? "bg-primary/10 text-primary ring-1 ring-primary/20"
                          : "hover:bg-accent/60",
                      )}
                    >
                      <moreItem.icon
                        className={cn(
                          "size-5 transition-transform duration-200",
                          isActive(moreItem.href) && "scale-110",
                        )}
                      />
                      <div className="flex flex-col">
                        <span className="font-medium text-sm">
                          {moreItem.label}
                        </span>
                        {isActive(moreItem.href) && (
                          <span className="text-[10px] opacity-70">Aktif</span>
                        )}
                      </div>
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
              "relative flex flex-col items-center justify-center gap-1 px-5 py-2 rounded-xl transition-all duration-200",
              isActive(item.href)
                ? "text-primary"
                : "text-muted-foreground hover:text-foreground",
            )}
          >
            {/* Active indicator line */}
            {isActive(item.href) && (
              <span className="absolute -top-1 inset-x-0 flex justify-center">
                <span className="h-0.5 w-6 rounded-full bg-primary" />
              </span>
            )}
            <item.icon
              className={cn(
                "size-[22px] transition-transform duration-200",
                isActive(item.href) && "scale-110",
              )}
            />
            <span
              className={cn(
                "text-[11px] font-medium transition-all duration-200",
                isActive(item.href) ? "font-semibold" : "font-normal",
              )}
            >
              {item.label}
            </span>
          </Link>
        );
      })}
    </nav>
  );
}
