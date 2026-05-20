'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { logout } from '@/shared/auth.service'
import { NavIcon } from '../common/Icons'

type NavItem = {
  href: string
  label: string
  icon: 'dashboard' | 'graduate' | 'membership' | 'documents' | 'engagement' | 'privacy'
}

const navItems: NavItem[] = [
  { href: '/alumni-admin/dashboard', label: 'Overview', icon: 'dashboard' },
  { href: '/alumni-admin/graduate-exit-onboarding', label: 'Graduate Exit', icon: 'graduate' },
  { href: '/alumni-admin/membership-id-services', label: 'Membership & ID', icon: 'membership' },
  { href: '/alumni-admin/record-document-fulfillment', label: 'Documents', icon: 'documents' },
  { href: '/alumni-admin/engagement-communication', label: 'Engagement', icon: 'engagement' },
]



export function Sidebar() {
  const pathname = usePathname()

  return (
    <aside className="sidebar" aria-label="Primary navigation">
      <div className="sidebar-header">
        <div className="sidebar-brand" aria-label="CAMPUS Portal">
          <span className="sidebar-brand-mark" aria-hidden="true">
            <img src="/logo.png" alt="" />
          </span>
          <p className="sidebar-brand-title">
            <span>CAMPUS</span>
            <span>Portal</span>
          </p>
        </div>
      </div>

      <nav className="sidebar-nav">
        {navItems.map((item) => {
          const active = pathname === item.href
          return (
            <Link
              key={item.href}
              href={item.href}
              className={active ? 'sidebar-nav-link active' : 'sidebar-nav-link'}
            >
              <span className="sidebar-item-icon" aria-hidden="true">
                <NavIcon type={item.icon} />
              </span>
              <span className="sidebar-nav-label">{item.label}</span>
            </Link>
          )
        })}
      </nav>

      <div className="sidebar-footer">
        <div className="sidebar-footer-links" aria-label="Sidebar actions">
          <Link href="/alumni-admin/settings" className="sidebar-footer-link" aria-label="Open settings">
            <span className="sidebar-footer-link-icon" aria-hidden="true">
              <svg viewBox="0 0 24 24"><path d="M12 8a4 4 0 1 0 0 8 4 4 0 0 0 0-8Zm8.2 4a6.7 6.7 0 0 0-.08-1l2.01-1.57-1.9-3.3-2.42.83a7.8 7.8 0 0 0-1.72-1l-.37-2.54H9.26l-.37 2.54a7.8 7.8 0 0 0-1.72 1L4.75 6.13l-1.9 3.3L4.86 11a6.7 6.7 0 0 0 0 2l-2.01 1.57 1.9 3.3 2.42-.83a7.8 7.8 0 0 0 1.72 1l.37 2.54h5.48l.37-2.54a7.8 7.8 0 0 0 1.72-1l2.42.83 1.9-3.3L20.12 13a6.7 6.7 0 0 0 .08-1Z" /></svg>
            </span>
            <span>Settings</span>
          </Link>
          <button type="button" className="sidebar-footer-link sidebar-footer-link--danger" onClick={logout}>
            <span className="sidebar-footer-link-icon" aria-hidden="true">
              <svg viewBox="0 0 24 24"><path d="M10 17l5-5-5-5" /><path d="M15 12H4" /><path d="M20 4v16" /></svg>
            </span>
            <span>Log Out</span>
          </button>
        </div>

        <a className="sidebar-profile-card" href="#admin-profile">
          <span className="sidebar-profile-avatar" aria-hidden="true">AO</span>
          <span className="sidebar-profile-copy">
            <strong>Operations Desk</strong>
            <span>Schema-aligned admin</span>
          </span>
          <span className="sidebar-profile-toggle" aria-hidden="true">
            <svg viewBox="0 0 24 24"><path d="M6 9l6 6 6-6" /></svg>
          </span>
        </a>
      </div>
    </aside>
  )
}
