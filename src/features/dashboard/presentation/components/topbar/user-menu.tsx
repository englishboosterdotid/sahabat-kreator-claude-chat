"use client";

import { useRouter } from "next/navigation";
import { authClient } from "@/shared/infrastructure/auth/auth-client";
import { LogOut, User, Settings } from "lucide-react";
import { Avatar } from "@/shared/presentation/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/shared/presentation/components/ui/dropdown-menu";

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

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <button className="flex items-center gap-2 rounded-full border border-transparent p-1 transition-colors hover:border-border hover:bg-accent/60">
          <span className="hidden text-right sm:block">
            <span className="block text-xs font-semibold leading-tight">{name}</span>
            <span className="block text-[10px] text-muted-foreground leading-tight">
              {email}
            </span>
          </span>
          <Avatar fallback={name} className="size-9" />
        </button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-64">
        <DropdownMenuLabel className="sm:hidden">
          <p className="text-xs text-muted-foreground">Masuk sebagai</p>
          <p className="truncate text-sm font-semibold">{email}</p>
        </DropdownMenuLabel>
        <DropdownMenuSeparator className="sm:hidden" />
        <DropdownMenuItem>
          <User className="mr-2 size-4" />
          <span>Profil Saya</span>
        </DropdownMenuItem>
        <DropdownMenuItem>
          <Settings className="mr-2 size-4" />
          <span>Pengaturan</span>
        </DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuItem
          onClick={handleLogout}
          className="text-destructive focus:text-destructive"
        >
          <LogOut className="mr-2 size-4" />
          <span>Keluar</span>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}