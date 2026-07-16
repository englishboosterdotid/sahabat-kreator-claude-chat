"use client";

import { Bell, Check, Inbox } from "lucide-react";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/shared/presentation/components/ui/popover";
import { Button } from "@/shared/presentation/components/ui/button";
import { ScrollArea } from "@/shared/presentation/components/ui/scroll-area";
import { cn } from "@/shared/lib/utils";

type Notification = {
  id: string;
  title: string;
  message: string;
  timestamp: string;
  read: boolean;
};

export function NotificationBell() {
  // Mock notifications for now
  const notifications: Notification[] = [
    {
      id: "1",
      title: "Postingan berhasil dijadwalkan",
      message: "Konten Anda telah dijadwalkan untuk hari ini",
      timestamp: "2 jam yang lalu",
      read: false,
    },
    {
      id: "2",
      title: "Akun Instagram terhubung",
      message: "Anda telah berhasil menghubungkan akun Instagram",
      timestamp: "1 hari yang lalu",
      read: true,
    },
    {
      id: "3",
      title: "Insight mingguan tersedia",
      message: "Konten Anda mendapat engagement 23% lebih tinggi minggu ini",
      timestamp: "2 hari yang lalu",
      read: false,
    },
    {
      id: "4",
      title: "Komentar baru",
      message: "Anda memiliki 12 komentar baru yang belum dibalas",
      timestamp: "3 hari yang lalu",
      read: true,
    },
  ];

  const unreadCount = notifications.filter((n) => !n.read).length;

  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button
          variant="ghost"
          size="icon"
          className="relative text-muted-foreground hover:bg-accent/60 hover:text-foreground"
          aria-label="Notifications"
        >
          <Bell className="size-5" />
          {unreadCount > 0 && (
            <span className="absolute -right-0.5 -top-0.5 flex min-w-[18px] h-[18px] items-center justify-center rounded-full bg-destructive px-1 text-[10px] font-bold text-destructive-foreground ring-2 ring-background">
              {unreadCount > 9 ? "9+" : unreadCount}
            </span>
          )}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-[380px] p-0" align="end" sideOffset={8}>
        {/* Header */}
        <div className="flex items-center justify-between border-b border-border px-4 py-3">
          <div>
            <h3 className="font-semibold">Notifikasi</h3>
            <p className="text-[11px] text-muted-foreground mt-0.5">
              {unreadCount > 0 ? `${unreadCount} belum dibaca` : "Semua sudah dibaca"}
            </p>
          </div>
          {unreadCount > 0 && (
            <Button variant="ghost" size="sm" className="text-xs">
              <Check className="size-3 mr-1" />
              Tandai dibaca
            </Button>
          )}
        </div>

        {/* List */}
        <ScrollArea className="h-[360px]">
          {notifications.length === 0 ? (
            <div className="flex flex-col items-center justify-center gap-2 py-12 text-center">
              <Inbox className="size-10 text-muted-foreground/40" />
              <p className="text-sm font-medium text-muted-foreground">Tidak ada notifikasi</p>
              <p className="text-[11px] text-muted-foreground/70">Anda akan melihat notifikasi di sini</p>
            </div>
          ) : (
            <div className="divide-y divide-border">
              {notifications.map((notification) => (
                <div
                  key={notification.id}
                  className={cn(
                    "group relative p-4 transition-colors cursor-pointer hover:bg-accent/50",
                    !notification.read && "bg-primary/5",
                  )}
                >
                  <div className="flex items-start gap-3">
                    {/* Unread indicator */}
                    <div className="pt-1.5 shrink-0">
                      <span
                        className={cn(
                          "block size-2 rounded-full transition-all",
                          notification.read
                            ? "bg-transparent"
                            : "bg-primary ring-4 ring-primary/20",
                        )}
                      />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p
                        className={cn(
                          "text-sm leading-tight",
                          !notification.read ? "font-semibold" : "font-medium",
                        )}
                      >
                        {notification.title}
                      </p>
                      <p className="text-xs text-muted-foreground mt-1 line-clamp-2">
                        {notification.message}
                      </p>
                      <p className="text-[10px] text-muted-foreground/70 mt-1.5">
                        {notification.timestamp}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </ScrollArea>

        {/* Footer */}
        <div className="border-t border-border px-4 py-2">
          <button
            type="button"
            className="w-full text-center text-xs font-medium text-primary hover:underline py-1.5 transition-colors"
          >
            Lihat semua notifikasi
          </button>
        </div>
      </PopoverContent>
    </Popover>
  );
}