'use client';

import { Bell, Menu } from 'lucide-react';
type TopBarProps = {
  title: string;
  onOpenNavigation: () => void;
  portalLabel: string;
  notificationCount?: number;
};

export function TopBar({ title, onOpenNavigation, portalLabel, notificationCount = 0 }: TopBarProps) {
  return (
    <header className="sticky top-0 z-20 flex h-16 items-center justify-between border-b border-campus-border bg-white px-4 md:px-6">
      <div className="flex min-w-0 items-center gap-3">
        <button
          type="button"
          aria-label="Open navigation"
          onClick={onOpenNavigation}
          className="grid h-11 w-11 place-items-center rounded-md border border-campus-border bg-white text-campus-ink md:hidden"
        >
          <Menu className="h-5 w-5" aria-hidden="true" />
        </button>
        <div className="min-w-0">
          <p className="truncate text-sm font-semibold text-campus-ink">{title}</p>
          <p className="truncate text-xs text-campus-muted">{portalLabel}</p>
        </div>
      </div>

      <button
        type="button"
        aria-label="Notifications"
        className="relative grid h-11 w-11 place-items-center rounded-md border border-campus-border bg-white text-campus-ink hover:bg-[#fbfaf6]"
      >
        <Bell className="h-5 w-5" aria-hidden="true" />
        {notificationCount > 0 ? (
          <span className="absolute right-2 top-2 grid h-4 min-w-4 place-items-center rounded-full bg-red-600 px-1 text-[10px] font-semibold text-white">
            {notificationCount > 9 ? '9+' : notificationCount}
          </span>
        ) : null}
      </button>
    </header>
  );
}
