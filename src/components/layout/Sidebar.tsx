'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'

type NavItem = {
  href: string
  label: string
  icon: 'dashboard' | 'services' | 'users' | 'tenants'
}

const navItems: NavItem[] = [
  { href: '/', label: 'Overview', icon: 'dashboard' },
  { href: '/?tab=services', label: 'Services', icon: 'services' },
  { href: '/?tab=users', label: 'Admin Users', icon: 'users' },
  { href: '/?tab=tenants', label: 'Tenants', icon: 'tenants' },
]

function NavIcon({ type }: { type: NavItem['icon'] }) {
  if (type === 'dashboard') {
    return <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M4 12h6V4H4z" /><path d="M14 20h6V10h-6z" /><path d="M14 4h6v4h-6z" /><path d="M4 16h6v4H4z" /></svg>
  }

  if (type === 'services') {
    return <svg viewBox="0 0 24 24" aria-hidden="true"><circle cx="12" cy="12" r="1.5" /><circle cx="19" cy="12" r="1.5" /><circle cx="5" cy="12" r="1.5" /><path d="M19 12a7 7 0 11-14 0 7 7 0 0114 0" /></svg>
  }

  if (type === 'users') {
    return <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" /><circle cx="9" cy="7" r="4" /><path d="M23 21v-2a4 4 0 0 0-3-3.87" /><path d="M16 3.13a4 4 0 0 1 0 7.75" /></svg>
  }

  if (type === 'tenants') {
    return <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" /><polyline points="9 22 9 12 15 12 15 22" /></svg>
  }

  return <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M12 4v16" /><path d="M4 12h16" /></svg>
}

export function Sidebar() {
  const pathname = usePathname()
  const title = 'APICENTER'

  return (
    <aside className="sidebar" aria-label="Primary navigation">
      <div className="sidebar-header">
        <div>
          <p>{title}</p>
          <small>Super Admin</small>
        </div>
      </div>

      <nav className="sidebar-nav">
        {navItems.map((item) => {
          const active = item.href === '/' ? pathname === '/' : pathname.includes(item.href)
          return (
            <Link
              key={item.href}
              href={item.href}
              className={active ? 'active' : ''}
            >
              <span className="sidebar-item-icon" aria-hidden="true">
                <NavIcon type={item.icon} />
              </span>
              <span>{item.label}</span>
            </Link>
          )
        })}
      </nav>

      <a className="sidebar-profile-card" href="#super-admin-profile">
        <span className="sidebar-profile-avatar" aria-hidden="true">SA</span>
        <span className="sidebar-profile-copy">
          <strong>Super Admin</strong>
          <span>System administration</span>
        </span>
        <button className="sidebar-profile-toggle" type="button" aria-label="Admin profile options">
          <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M6 9l6 6 6-6" /></svg>
        </button>
      </a>
    </aside>
  )
}
