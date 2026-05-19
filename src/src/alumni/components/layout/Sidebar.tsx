import Link from 'next/link'
import { usePathname, useRouter } from 'next/navigation'
import { useAlumni } from '../app/hooks'

type SidebarIcon = 'dashboard' | 'profile' | 'document' | 'card' | 'tracker' | 'requests' | 'payments' | 'settings' | 'logout'

const navigationItems = [
  { to: '/', label: 'Dashboard', icon: 'dashboard' as const },
  { to: '/requests?filter=active', label: 'My Requests', icon: 'requests' as const },
  { to: '/payments', label: 'Billing & Payments', icon: 'payments' as const },
  { to: '/document-request', label: 'Document Request', icon: 'document' as const },
  { to: '/card-application', label: 'Card Application', icon: 'card' as const },
  { to: '/clearance-tracker', label: 'Clearance Tracker', icon: 'tracker' as const },
]

const quickTabs = [
  { to: '/settings', label: 'Settings', icon: 'settings' as const },
  { to: '#', label: 'Log Out', icon: 'logout' as const, tone: 'danger' as const },
]

function NavIcon({ type }: { type: SidebarIcon }) {
  if (type === 'dashboard') {
    return (
      <svg viewBox="0 0 24 24" aria-hidden="true">
        <rect x="3" y="3" width="8" height="8" rx="1.5" />
        <rect x="13" y="3" width="8" height="5" rx="1.5" />
        <rect x="13" y="10" width="8" height="11" rx="1.5" />
        <rect x="3" y="13" width="8" height="8" rx="1.5" />
      </svg>
    )
  }

  if (type === 'profile') {
    return (
      <svg viewBox="0 0 24 24" aria-hidden="true">
        <circle cx="12" cy="8" r="3.5" />
        <path d="M5 20a7 7 0 0 1 14 0" />
      </svg>
    )
  }

  if (type === 'document') {
    return (
      <svg viewBox="0 0 24 24" aria-hidden="true">
        <path d="M8 3h6l4 4v14H8z" />
        <path d="M14 3v4h4" />
        <path d="M10 12h6" />
        <path d="M10 16h6" />
      </svg>
    )
  }

  if (type === 'card') {
    return (
      <svg viewBox="0 0 24 24" aria-hidden="true">
        <rect x="3" y="6" width="18" height="12" rx="2" />
        <path d="M3 10h18" />
        <path d="M7 15h4" />
      </svg>
    )
  }

  if (type === 'tracker') {
    return (
      <svg viewBox="0 0 24 24" aria-hidden="true">
        <circle cx="5" cy="6" r="2" />
        <circle cx="12" cy="12" r="2" />
        <circle cx="19" cy="18" r="2" />
        <path d="M7 7.5 10.5 10" />
        <path d="M13.5 13.5 17 16" />
      </svg>
    )
  }

  if (type === 'requests') {
    return (
      <svg viewBox="0 0 24 24" aria-hidden="true">
        <rect x="3" y="4" width="18" height="16" rx="2" />
        <path d="M3 10h18" />
        <path d="M7 14h10" />
        <path d="M7 18h5" />
      </svg>
    )
  }

  if (type === 'payments') {
    return (
      <svg viewBox="0 0 24 24" aria-hidden="true">
        <rect x="2" y="5" width="20" height="14" rx="2" />
        <path d="M2 10h20" />
        <circle cx="5" cy="17" r="1" />
      </svg>
    )
  }

  if (type === 'settings') {
    return (
      <svg viewBox="0 0 24 24" aria-hidden="true">
        <circle cx="12" cy="12" r="3" />
        <path d="M19.4 15a1 1 0 0 0 .2 1.1l.1.1a1 1 0 0 1 0 1.4l-1 1a1 1 0 0 1-1.4 0l-.1-.1a1 1 0 0 0-1.1-.2 1 1 0 0 0-.6.9V20a1 1 0 0 1-1 1h-1.4a1 1 0 0 1-1-1v-.1a1 1 0 0 0-.6-.9 1 1 0 0 0-1.1.2l-.1.1a1 1 0 0 1-1.4 0l-1-1a1 1 0 0 1 0-1.4l.1-.1a1 1 0 0 0 .2-1.1 1 1 0 0 0-.9-.6H4a1 1 0 0 1-1-1v-1.4a1 1 0 0 1 1-1h.1a1 1 0 0 0 .9-.6 1 1 0 0 0-.2-1.1l-.1-.1a1 1 0 0 1 0-1.4l1-1a1 1 0 0 1 1.4 0l.1.1a1 1 0 0 0 1.1.2 1 1 0 0 0 .6-.9V4a1 1 0 0 1 1-1h1.4a1 1 0 0 1 1 1v.1a1 1 0 0 0 .6.9 1 1 0 0 0 1.1-.2l.1-.1a1 1 0 0 1 1.4 0l1 1a1 1 0 0 1 0 1.4l-.1.1a1 1 0 0 0-.2 1.1 1 1 0 0 0 .9.6H20a1 1 0 0 1 1 1V13a1 1 0 0 1-1 1h-.1a1 1 0 0 0-.5 1z" />
      </svg>
    )
  }

  return (
    <svg viewBox="0 0 24 24" aria-hidden="true">
      <path d="M15 7 20 12 15 17" />
      <path d="M20 12H9" />
      <path d="M9 20H5a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h4" />
    </svg>
  )
}

export function Sidebar() {
  const router = useRouter()
  const pathname = usePathname()
  const { profile } = useAlumni()
  const profileName = profile.fullName.trim() || 'Pio Felipe Ramirez'
  const sidebarName = profileName.length > 15 ? `${profileName.slice(0, 15)}...` : profileName
  const profileInitials = profileName
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase() ?? '')
    .join('') || 'PR'

  const isActivePath = (path: string) => {
    if (path === '/') {
      return pathname === '/'
    }

    // Handle requests path with query parameters
    if (path.includes('?')) {
      const basePath = path.split('?')[0]
      return pathname === basePath
    }

    return pathname === path || pathname.startsWith(`${path}/`)
  }

  return (
    <aside className="sidebar">
      <div className="sidebar-header">
        <div className="sidebar-brand-lockup" aria-label="Campus Portal">
          <p>
            <span className="sidebar-brand-campus">CAMPUS</span>
            <span className="sidebar-brand-portal"> Portal</span>
          </p>
        </div>
      </div>

      <nav className="sidebar-nav" aria-label="Main navigation">
        {navigationItems.map((item) => (
          <Link
            key={item.to}
            href={item.to}
            className={isActivePath(item.to) ? 'active' : ''}
          >
            <span className="sidebar-item-icon" aria-hidden="true">
              <NavIcon type={item.icon} />
            </span>
            <span>{item.label}</span>
          </Link>
        ))}
      </nav>

      <div className="sidebar-secondary" aria-label="Secondary navigation">
        {quickTabs.map((item) => (
          <Link
            key={item.label}
            href={item.to}
            className={item.tone === 'danger' ? 'danger' : ''}
          >
            <span className="sidebar-item-icon" aria-hidden="true">
              <NavIcon type={item.icon} />
            </span>
            <span>{item.label}</span>
          </Link>
        ))}
      </div>

      <Link
        href="/profile"
        className={`sidebar-profile-card ${isActivePath('/profile') ? 'active' : ''}`}
        aria-label="Open profile"
      >
        <div className="sidebar-profile-avatar" aria-hidden="true">
          {profileInitials}
        </div>

        <div className="sidebar-profile-copy">
          <strong>{sidebarName}</strong>
          <span>Student</span>
        </div>

        <span className="sidebar-profile-toggle" aria-hidden="true">
          <svg viewBox="0 0 24 24" aria-hidden="true">
            <path d="m7 10 5 5 5-5" />
          </svg>
        </span>
      </Link>
    </aside>
  )
}
