"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { LogOut, User, Settings, ChevronDown, CreditCard, LifeBuoy } from "lucide-react";
import { authClient } from "@/shared/infrastructure/auth/auth-client";
import { Avatar } from "@/shared/presentation/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/shared/presentation/components/ui/dropdown-menu";
import { cn } from "@/shared/lib/utils";

export function UserMenu({
  name,
  email,
}: {
  name: string;
  email: string;
}) {
  const router = useRouter();

  async function handleLogout() {
    await authClient.signOut();
    router.push("/login");
  }

  const initial = (name?.trim().charAt(0) || email?.charAt(0) || "?").toUpperCase();

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <button
          className={cn(
            "group flex items-center gap-2 rounded-full border border-transparent p-1 transition-colors",
            "hover:border-border hover:bg-accent/60",
            "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary",
          )}
          aria-label="User menu"
        >
          <span className="hidden text-right sm:block pr-1.5">
            <span className="block text-xs font-semibold leading-tight">{name}</span>
            <span className="block text-[10px] text-muted-foreground leading-tight truncate max-w-[120px]">
              {email}
            </span>
          </span>
          <div className="relative">
            <Avatar fallback={initial} className="size-9 ring-2 ring-border group-hover:ring-primary/50 transition-all" />
            <ChevronDown
              size={12}
              className="absolute -bottom-0.5 -right-0.5 size-3 rounded-full bg-background p-0.5 text-muted-foreground"
            />
          </div>
        </button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-72">
        {/* User info header */}
        <div className="px-3 py-3 flex items-center gap-3">
          <Avatar fallback={initial} className="size-11 ring-2 ring-primary/30" />
          <div className="min-w-0 flex-1">
            <p className="truncate text-sm font-semibold">{name}</p>
            <p className="truncate text-xs text-muted-foreground">{email}</p>
          </div>
        </div>
        <DropdownMenuSeparator />
        <DropdownMenuItem asChild>
          <Link href="/account/profile" className="flex items-center cursor-pointer">
            <User className="mr-3 size-4 text-muted-foreground" />
            <div className="flex flex-col">
              <span>Profil Saya</span>
              <span className="text-[10px] text-muted-foreground">Kelola akun Anda</span>
            </div>
          </Link>
        </DropdownMenuItem>
        <DropdownMenuItem asChild>
          <Link href="/account/settings" className="flex items-center cursor-pointer">
            <Settings className="mr-3 size-4 text-muted-foreground" />
            <div className="flex flex-col">
              <span>Pengaturan</span>
              <span className="text-[10px] text-muted-foreground">Preferensi & konfigurasi</span>
            </div>
          </Link>
        </DropdownMenuItem>
        <DropdownMenuItem asChild>
          <Link href="/account/billing" className="flex items-center cursor-pointer">
            <CreditCard className="mr-3 size-4 text-muted-foreground" />
            <div className="flex flex-col">
              <span>Billing</span>
              <span className="text-[10px] text-muted-foreground">Paket & pembayaran</span>
            </div>
          </Link>
        </DropdownMenuItem>
        <DropdownMenuItem asChild>
          <Link href="/help" className="flex items-center cursor-pointer">
            <LifeBuoy className="mr-3 size-4 text-muted-foreground" />
            <div className="flex flex-col">
              <span>Bantuan</span>
              <span className="text-[10px] text-muted-foreground">Dokumentasi & support</span>
            </div>
          </Link>
        </DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuItem
          onClick={handleLogout}
          className="text-destructive focus:text-destructive"
        >
          <LogOut className="mr-3 size-4" />
          <span>Keluar</span>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}