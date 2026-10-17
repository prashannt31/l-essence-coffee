"use client";

import { useEffect, useRef, useState } from "react";

type Props = {
  allowedTypes?: string[];
};

export type NotificationType =
  | "all"
  | "order"
  | "stock"
  | "admin"
  | "supplier"
  | "system";

export type NotificationItem = {
  id: number;
  title: string;
  message: string;
  time: string;
  read: boolean;
  type?: Exclude<NotificationType, "all">;
};

const NOTIFICATION_KEY = "l-essence-notifications";

function detectNotificationType(
  title: string
): Exclude<NotificationType, "all"> {
  const lower = title.toLowerCase();

  if (lower.includes("order")) return "order";
  if (lower.includes("stock") || lower.includes("low")) return "stock";
  if (lower.includes("admin") || lower.includes("password")) return "admin";
  if (lower.includes("supplier")) return "supplier";

  return "system";
}

export function addNotification(title: string, message: string) {
  const existingNotifications: NotificationItem[] = JSON.parse(
    localStorage.getItem(NOTIFICATION_KEY) || "[]"
  );

  const newNotification: NotificationItem = {
    id: Date.now(),
    title,
    message,
    time: new Date().toLocaleString(),
    read: false,
    type: detectNotificationType(title),
  };

  localStorage.setItem(
    NOTIFICATION_KEY,
    JSON.stringify([newNotification, ...existingNotifications])
  );

  window.dispatchEvent(new Event("notifications-updated"));
}

export default function Notifications({ allowedTypes = ["all"] }: Props) {
  const [notifications, setNotifications] = useState<NotificationItem[]>([]);
  const [open, setOpen] = useState(false);
  const [filter, setFilter] = useState<NotificationType>("all");

  const notificationRef = useRef<HTMLDivElement>(null);
  const previousLatestIdRef = useRef<number | null>(null);

  const playNotificationSound = () => {
    const audio = new Audio("/order-alert.mp3");
    audio.volume = 0.7;
    audio.play().catch(() => {});
  };

  const loadNotifications = () => {
    const saved: NotificationItem[] = JSON.parse(
      localStorage.getItem(NOTIFICATION_KEY) || "[]"
    );

    setNotifications(saved);
  };

useEffect(() => {
  loadNotifications();

  const interval = setInterval(() => {
    loadNotifications();
  }, 1000);

  window.addEventListener("notifications-updated", loadNotifications);
  window.addEventListener("storage", loadNotifications);

  return () => {
    clearInterval(interval);
    window.removeEventListener("notifications-updated", loadNotifications);
    window.removeEventListener("storage", loadNotifications);
  };
}, []);

  useEffect(() => {
    const latest = notifications[0];

    if (!latest) return;

    if (previousLatestIdRef.current === null) {
      previousLatestIdRef.current = latest.id;
      return;
    }

    if (
      latest.id !== previousLatestIdRef.current &&
latest.title === "Order Received"    ) {
      playNotificationSound();
    }

    previousLatestIdRef.current = latest.id;
  }, [notifications]);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        notificationRef.current &&
        !notificationRef.current.contains(event.target as Node)
      ) {
        setOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const permissionFilteredNotifications = allowedTypes.includes("all")
    ? notifications
    : notifications.filter((item) =>
        allowedTypes.includes(item.type || "system")
      );

  const unreadCount = permissionFilteredNotifications.filter(
    (item) => !item.read
  ).length;

  const filteredNotifications =
    filter === "all"
      ? permissionFilteredNotifications
      : permissionFilteredNotifications.filter((item) => item.type === filter);

  const updateNotifications = (updated: NotificationItem[]) => {
    setNotifications(updated);
    localStorage.setItem(NOTIFICATION_KEY, JSON.stringify(updated));
  };

  const markAsRead = (id: number) => {
    const updated = notifications.map((item) =>
      item.id === id ? { ...item, read: true } : item
    );

    updateNotifications(updated);
  };

  const markAsUnread = (id: number) => {
    const updated = notifications.map((item) =>
      item.id === id ? { ...item, read: false } : item
    );

    updateNotifications(updated);
  };

  const deleteNotification = (id: number) => {
    const updated = notifications.filter((item) => item.id !== id);
    updateNotifications(updated);
  };

  const markAllAsRead = () => {
    const updated = notifications.map((item) => ({
      ...item,
      read: true,
    }));

    updateNotifications(updated);
  };

  const clearNotifications = () => {
    updateNotifications([]);
  };

  return (
    <div ref={notificationRef} className="relative">
      <button
        onClick={() => setOpen(!open)}
        className="relative text-[#F5E6C8] hover:text-[#D4AF37] transition"
      >
        🔔

        {unreadCount > 0 && (
          <span className="absolute -top-2 -right-2 h-5 min-w-5 rounded-full bg-red-500 px-1 text-[10px] text-white flex items-center justify-center">
            {unreadCount}
          </span>
        )}
      </button>

      {open && (
        <div className="absolute right-0 top-10 w-[430px] bg-[#111111] border border-zinc-800 rounded-2xl shadow-xl z-50 overflow-hidden">
          <div className="flex items-center justify-between px-4 py-3 border-b border-zinc-800">
            <h3 className="font-semibold">Notifications</h3>

            <div className="flex gap-3">
              {notifications.length > 0 && (
                <button
                  onClick={markAllAsRead}
                  className="text-xs text-[#D4AF37] hover:underline"
                >
                  Mark all read
                </button>
              )}

              {notifications.length > 0 && (
                <button
                  onClick={clearNotifications}
                  className="text-xs text-red-400 hover:text-red-300"
                >
                  Clear
                </button>
              )}
            </div>
          </div>

          <div className="flex gap-2 px-4 py-3 border-b border-zinc-800 overflow-x-auto admin-scrollbar">
            {["all", "order", "stock", "admin", "supplier", "system"].map(
              (type) => (
                <button
                  key={type}
                  onClick={() => setFilter(type as NotificationType)}
                  className={`px-3 py-1 rounded-full text-xs capitalize border ${
                    filter === type
                      ? "border-[#D4AF37] text-[#D4AF37] bg-[#D4AF37]/10"
                      : "border-zinc-800 text-zinc-500 hover:text-zinc-300"
                  }`}
                >
                  {type}
                </button>
              )
            )}
          </div>

          {filteredNotifications.length === 0 ? (
            <p className="p-4 text-sm text-zinc-500">
              No notifications found.
            </p>
          ) : (
            <div className="max-h-96 overflow-y-auto admin-scrollbar">
              {filteredNotifications.map((item) => (
                <div
                  key={item.id}
                  className={`px-4 py-3 border-b border-zinc-800 last:border-b-0 ${
                    item.read ? "bg-transparent" : "bg-[#D4AF37]/10"
                  }`}
                >
                  <div className="flex justify-between gap-3">
                    <div className="flex-1">
                      <div className="flex items-center gap-2">
                        {!item.read && (
                          <span className="h-2 w-2 rounded-full bg-[#D4AF37]" />
                        )}

                        <p className="font-semibold text-sm">{item.title}</p>

                        <span className="text-[10px] uppercase text-zinc-600 border border-zinc-800 rounded-full px-2 py-0.5">
                          {item.type || "system"}
                        </span>
                      </div>

                      <p className="text-sm text-zinc-400 mt-1">
                        {item.message}
                      </p>

                      <p className="text-xs text-zinc-600 mt-2">
                        {item.time}
                      </p>
                    </div>

                    <div className="flex flex-col gap-2 text-xs">
                      {item.read ? (
                        <button
                          onClick={() => markAsUnread(item.id)}
                          className="text-zinc-500 hover:text-[#D4AF37]"
                        >
                          Unread
                        </button>
                      ) : (
                        <button
                          onClick={() => markAsRead(item.id)}
                          className="text-[#D4AF37] hover:underline"
                        >
                          Read
                        </button>
                      )}

                      <button
                        onClick={() => deleteNotification(item.id)}
                        className="text-red-400 hover:text-red-300"
                      >
                        Delete
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
}