'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import type { ComponentType } from 'react';
import { X } from 'lucide-react';
import { schoolPortalLabels } from '@/shared/school-reference';
import { cn } from '@/shared/ui/ui/utils';

export type NavItem = {
  href?: string;
  label: string;
  icon?: ComponentType<{ className?: string }>;
  active?: boolean;
  onClick?: () => void;
};

type SideNavProps = {
  title: string;
  subtitle?: string;
  items: NavItem[];
  secondaryItems?: NavItem[];
  onClose?: () => void;
};

export function SideNav({ title, subtitle, items, secondaryItems = [], onClose }: SideNavProps) {
  return (
    <aside className="flex h-full w-64 flex-col border-r border-neutral-800 bg-campus-ink text-white">
      <div className="flex h-16 items-center justify-between border-b border-neutral-800 px-4">
        <Link href="/" className="flex min-w-0 items-center gap-3">
          <span className="grid h-9 w-9 place-items-center overflow-hidden rounded-lg bg-white">
            <img src="/logo.png" alt="" className="h-7 w-7 object-contain" />
          </span>
          <span className="min-w-0">
            <span className="block truncate text-sm font-semibold">{schoolPortalLabels.productName}</span>
            <span className="block truncate text-xs text-campus-brand">{subtitle || title}</span>
          </span>
        </Link>

        {onClose ? (
          <button
            type="button"
            aria-label="Close navigation"
            onClick={onClose}
            className="grid h-10 w-10 place-items-center rounded-md text-neutral-300 hover:bg-neutral-800 hover:text-white md:hidden"
          >
            <X className="h-5 w-5" aria-hidden="true" />
          </button>
        ) : null}
      </div>

      <nav className="flex-1 space-y-1 overflow-y-auto px-3 py-4" aria-label={title}>
        {items.map((item) => (
          <NavButton key={`${item.href || item.label}-${item.label}`} item={item} />
        ))}
      </nav>

      {secondaryItems.length > 0 ? (
        <div className="space-y-1 border-t border-neutral-800 px-3 py-4">
          {secondaryItems.map((item) => (
            <NavButton key={`${item.href || item.label}-${item.label}`} item={item} />
          ))}
        </div>
      ) : null}
    </aside>
  );
}

function NavButton({ item }: { item: NavItem }) {
  const pathname = usePathname();
  const active = item.active ?? (item.href ? pathname === item.href || pathname.startsWith(`${item.href}/`) : false);
  const Icon = item.icon;
  const classes = cn(
    'flex h-11 w-full items-center gap-3 rounded-md px-3 text-left text-sm transition-colors',
    active ? 'bg-campus-brand text-campus-ink' : 'text-neutral-300 hover:bg-neutral-800 hover:text-white',
  );

  const content = (
    <>
      {Icon ? <Icon className="h-5 w-5 flex-shrink-0" aria-hidden="true" /> : null}
      <span className="truncate">{item.label}</span>
    </>
  );

  if (item.href) {
    return (
      <Link href={item.href} className={classes}>
        {content}
      </Link>
    );
  }

  return (
    <button type="button" onClick={item.onClick} className={classes}>
      {content}
    </button>
  );
}

