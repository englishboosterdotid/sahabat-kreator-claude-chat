"use client";

import { Bell } from "lucide-react";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/shared/presentation/components/ui/popover";
import { Button } from "@/shared/presentation/components/ui/button";
import { ScrollArea } from "@/shared/presentation/components/ui/scroll-area";

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
  ];

  const unreadCount = notifications.filter((n) => !n.read).length;

  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button variant="ghost" size="icon" className="relative">
          <Bell className="size-5" />
          {unreadCount > 0 && (
            <span className="absolute -right-1 -top-1 flex size-4 items-center justify-center rounded-full bg-destructive text-[10px] font-bold text-destructive-foreground">
              {unreadCount}
            </span>
          )}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-80 p-0" align="end">
        <div className="border-b border-border p-3">
          <h3 className="font-semibold">Notifikasi</h3>
        </div>
        <ScrollArea className="h-80">
          {notifications.length === 0 ? (
            <div className="p-4 text-center text-muted-foreground">
              Tidak ada notifikasi
            </div>
          ) : (
            <div className="divide-y divide-border">
              {notifications.map((notification) => (
                <div
                  key={notification.id}
                  className={`p-3 hover:bg-accent transition-colors ${!notification.read ? "bg-accent/50" : ""}`}
                >
                  <div className="flex items-start justify-between gap-2">
                    <div className="flex-1">
                      <p className="text-sm font-medium">{notification.title}</p>
                      <p className="text-xs text-muted-foreground mt-1">
                        {notification.message}
                      </p>
                    </div>
                    {!notification.read && (
                      <span className="mt-1 size-2 rounded-full bg-primary" />
                    )}
                  </div>
                  <p className="text-[10px] text-muted-foreground mt-2">
                    {notification.timestamp}
                  </p>
                </div>
              ))}
            </div>
          )}
        </ScrollArea>
      </PopoverContent>
    </Popover>
  );
}
