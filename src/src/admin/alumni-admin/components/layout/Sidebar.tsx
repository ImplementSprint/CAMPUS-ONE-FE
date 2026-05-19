'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { NavIcon } from '../common/Icons'

type NavItem = {
  href: string
  label: string
  icon: 'dashboard' | 'graduate' | 'membership' | 'documents' | 'engagement' | 'privacy'
}

const navItems: NavItem[] = [
  { href: '/', label: 'Overview', icon: 'dashboard' },
  { href: '/graduate-exit-onboarding', label: 'Graduate Exit', icon: 'graduate' },
  { href: '/membership-id-services', label: 'Membership & ID', icon: 'membership' },
  { href: '/record-document-fulfillment', label: 'Documents', icon: 'documents' },
  { href: '/engagement-communication', label: 'Engagement', icon: 'engagement' },
  { href: '/data-governance-privacy', label: 'Privacy', icon: 'privacy' },
]



export function Sidebar() {
  const pathname = usePathname()
  const title = 'APICENTER'

  return (
    <aside className="sidebar" aria-label="Primary navigation">
      <div className="sidebar-header">
        <div>
          <p>{title}</p>
          <small>Alumni Operations</small>
        </div>
      </div>

      <nav className="sidebar-nav">
        {navItems.map((item) => {
          const active = item.href === '/' ? pathname === '/' : pathname === item.href
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

      <a className="sidebar-profile-card" href="#admin-profile">
        <span className="sidebar-profile-avatar" aria-hidden="true">AO</span>
        <span className="sidebar-profile-copy">
          <strong>Operations Desk</strong>
          <span>Schema-aligned admin</span>
        </span>
        <button className="sidebar-profile-toggle" type="button" aria-label="Admin profile options">
          <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M6 9l6 6 6-6" /></svg>
        </button>
      </a>
    </aside>
  )
}
