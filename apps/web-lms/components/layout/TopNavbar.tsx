"use client";

import React, { useEffect, useState, useRef } from "react";
import { Bell } from "lucide-react";
import { cn } from "@/lib/utils";

interface Notification {
  id: string;
  title: string;
  message: string;
  read: string | boolean;
  created_at: string;
}

interface TopNavbarProps {
  className?: string;
}

export function TopNavbar({ className }: TopNavbarProps) {
  const [instituteName, setInstituteName] = useState<string>("Institute Name");
  const [showNotifications, setShowNotifications] = useState(false);
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [marking, setMarking] = useState(false);
  const panelRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    fetch("/api/school")
      .then((r) => r.json())
      .then((data) => { if (data?.name) setInstituteName(data.name); })
      .catch(() => {});
  }, []);

  useEffect(() => {
    fetch("/api/notifications")
      .then((r) => r.json())
      .then((data) => setNotifications(Array.isArray(data) ? data : []))
      .catch(() => {});
  }, []);

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (panelRef.current && !panelRef.current.contains(e.target as Node)) {
        setShowNotifications(false);
      }
    }
    if (showNotifications) document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [showNotifications]);

  const unreadCount = notifications.filter((n) => n.read === "false" || n.read === false).length;

  async function handleMarkAllRead() {
    setMarking(true);
    try {
      await fetch("/api/notifications/read-all", { method: "PATCH" });
      setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
    } catch {
    } finally {
      setMarking(false);
    }
  }

  function formatTime(iso: string) {
    try {
      const diff = Date.now() - new Date(iso).getTime();
      const mins = Math.floor(diff / 60000);
      if (mins < 1) return "Just now";
      if (mins < 60) return `${mins}m ago`;
      const hrs = Math.floor(mins / 60);
      if (hrs < 24) return `${hrs}h ago`;
      return `${Math.floor(hrs / 24)}d ago`;
    } catch {
      return "";
    }
  }

  return (
    <header className={cn("bg-white/80 backdrop-blur-sm border-b border-gray-200 h-20 flex items-center justify-end px-10 flex-shrink-0 shadow-sm sticky top-0 z-30", className)}>
      <div className="flex items-center gap-4">
        <div className="relative" ref={panelRef}>
          <button
            className="relative p-2.5 rounded-xl hover:bg-gray-100 transition-colors"
            onClick={() => setShowNotifications(!showNotifications)}
          >
            <Bell className="w-5 h-5 text-gray-600" />
            {unreadCount > 0 && (
              <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-red-500 rounded-full" />
            )}
          </button>

          {showNotifications && (
            <div className="absolute right-0 mt-2 w-80 bg-white border border-gray-200 rounded-2xl shadow-lg z-50 overflow-hidden">
              <div className="p-4 border-b border-gray-100 flex items-center justify-between">
                <h3 className="font-bold text-gray-900">Notifications</h3>
                {unreadCount > 0 && (
                  <span className="text-[10px] bg-primary/10 text-primary px-2 py-1 rounded-full font-bold">
                    {unreadCount} New
                  </span>
                )}
              </div>
              <div className="p-0 max-h-[300px] overflow-y-auto">
                {notifications.length === 0 ? (
                  <p className="p-6 text-center text-sm text-gray-400">No notifications</p>
                ) : (
                  notifications.map((n) => {
                    const isUnread = n.read === "false" || n.read === false;
                    return (
                      <div
                        key={n.id}
                        className={cn(
                          "p-4 border-b border-gray-50 transition-colors",
                          isUnread ? "bg-primary/5 hover:bg-primary/10" : "hover:bg-gray-50"
                        )}
                      >
                        <div className="flex items-start gap-2">
                          {isUnread && <span className="mt-1.5 w-1.5 h-1.5 rounded-full bg-primary flex-shrink-0" />}
                          <div>
                            <p className="text-sm font-medium text-gray-900">{n.title}</p>
                            <p className="text-xs text-gray-500 mt-0.5">{n.message}</p>
                            <p className="text-[10px] text-gray-400 mt-1.5 font-medium">{formatTime(n.created_at)}</p>
                          </div>
                        </div>
                      </div>
                    );
                  })
                )}
              </div>
              {unreadCount > 0 && (
                <div className="p-3 border-t border-gray-100 text-center">
                  <button
                    onClick={handleMarkAllRead}
                    disabled={marking}
                    className="text-xs font-bold text-primary hover:underline disabled:opacity-50"
                  >
                    {marking ? "Marking…" : "Mark all as read"}
                  </button>
                </div>
              )}
            </div>
          )}
        </div>
        <div className="h-10 w-px bg-gray-200"></div>
        <span className="font-semibold text-sm text-gray-900">{instituteName}</span>
      </div>
    </header>
  );
}
