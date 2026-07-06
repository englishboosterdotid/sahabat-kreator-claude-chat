"use client";

import { useState, useRef, useEffect } from "react";
import { useRouter } from "next/navigation";
import { authClient } from "@/shared/infrastructure/auth/auth-client";
import {
  LogOut,
  User,
  Settings,
  ChevronUp,
  ChevronsUpDown,
} from "lucide-react";
import { cn } from "@/shared/lib/utils";

export function SidebarUserMenu({
  name,
  email,
  collapsed,
}: {
  name: string;
  email: string;
  collapsed: boolean;
}) {
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    }
    function handleEsc(e: KeyboardEvent) {
      if (e.key === "Escape") setOpen(false);
    }
    document.addEventListener("mousedown", handleClickOutside);
    document.addEventListener("keydown", handleEsc);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      document.removeEventListener("keydown", handleEsc);
    };
  }, []);

  async function handleLogout() {
    await authClient.signOut();
    router.push("/login");
  }

  const initial = (name?.trim().charAt(0) || email?.charAt(0) || "?").toUpperCase();

  if (collapsed) {
    return (
      <div ref={ref} className="relative flex justify-center">
        <button
          onClick={() => setOpen((v) => !v)}
          className="flex size-10 items-center justify-center rounded-full bg-gradient-to-br from-primary to-primary/70 text-sm font-bold text-primary-foreground shadow-sm hover:opacity-90 transition-opacity"
          aria-label="User menu"
        >
          {initial}
        </button>
        {open && (
          <div className="absolute bottom-full left-0 mb-2 w-56 rounded-lg border border-border bg-popover p-1 text-popover-foreground shadow-xl">
            <button
              onClick={handleLogout}
              className="flex w-full items-center gap-2.5 rounded-md px-3 py-2 text-sm text-destructive hover:bg-destructive/10 transition-colors"
            >
              <LogOut size={16} />
              Keluar
            </button>
          </div>
        )}
      </div>
    );
  }

  return (
    <div ref={ref} className="relative">
      <button
        onClick={() => setOpen((v) => !v)}
        className={cn(
          "group flex w-full items-center gap-3 rounded-xl border border-border bg-card p-2.5 text-left transition-all",
          "hover:border-primary/40 hover:shadow-sm"
        )}
      >
        <div className="flex size-10 shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-primary to-primary/70 text-sm font-bold text-primary-foreground shadow-sm">
          {initial}
        </div>
        <div className="min-w-0 flex-1">
          <p className="truncate text-sm font-semibold leading-tight text-foreground">
            {name}
          </p>
          <p className="truncate text-xs text-muted-foreground">{email}</p>
        </div>
        <ChevronsUpDown
          size={14}
          className={cn(
            "shrink-0 text-muted-foreground transition-transform",
            open && "rotate-180"
          )}
        />
      </button>

      {open && (
        <div className="absolute bottom-full left-0 right-0 mb-2 overflow-hidden rounded-xl border border-border bg-popover text-popover-foreground shadow-xl">
          <div className="border-b border-border bg-muted/40 px-3 py-2.5">
            <p className="truncate text-xs font-medium text-muted-foreground">
              Masuk sebagai
            </p>
            <p className="truncate text-sm font-semibold">{email}</p>
          </div>
          <div className="p-1">
            <DropdownItem icon={User} label="Profil Saya" onClick={() => setOpen(false)} />
            <DropdownItem icon={Settings} label="Pengaturan" onClick={() => setOpen(false)} />
          </div>
          <div className="border-t border-border p-1">
            <button
              onClick={handleLogout}
              className="flex w-full items-center gap-2.5 rounded-md px-3 py-2 text-sm font-medium text-destructive hover:bg-destructive/10 transition-colors"
            >
              <LogOut size={16} />
              Keluar
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

function DropdownItem({
  icon: Icon,
  label,
  onClick,
}: {
  icon: typeof User;
  label: string;
  onClick: () => void;
}) {
  return (
    <button
      onClick={onClick}
      className="flex w-full items-center gap-2.5 rounded-md px-3 py-2 text-sm hover:bg-accent transition-colors"
    >
      <Icon size={16} className="text-muted-foreground" />
      {label}
    </button>
  );
}