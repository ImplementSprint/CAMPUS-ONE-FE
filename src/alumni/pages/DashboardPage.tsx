import Image from 'next/image'
import Link from 'next/link'
import { useAlumni } from '../components/app/hooks'
import heroImage from '../assets/hero.png'
import {
  mockRequests,
  getActiveRequests,
  getCompletedRequests,
  getReadyForPickupRequests,
  getPendingPayments,
} from '../types/requests'
import { mockPayments } from '../types/payments'

type MetricTone = 'blue' | 'green' | 'amber' | 'violet'
type DashboardIcon = 'calendar' | 'folder' | 'shield'

type StatCard = {
  tone: MetricTone
  icon: DashboardIcon
  value: string
  label: string
  action: string
  href: string
}

type QuickAction = {
  icon: DashboardIcon
  title: string
  description: string
  href: string
}

const quickActions: QuickAction[] = [
  {
    icon: 'folder',
    title: 'Request documents',
    description: 'Order transcripts, diplomas, or other documents.',
    href: '/document-request',
  },
  {
    icon: 'calendar',
    title: 'Apply for alumni card',
    description: 'Get your official alumni identification card.',
    href: '/card-application',
  },
  {
    icon: 'shield',
    title: 'View clearance status',
    description: 'Check the status of background clearance requests.',
    href: '/clearance-tracker',
  },
]

function DashboardIcon({ type }: { type: DashboardIcon }) {
  if (type === 'calendar') {
    return (
      <svg viewBox="0 0 24 24" aria-hidden="true">
        <rect x="4" y="5" width="16" height="15" rx="2.5" />
        <path d="M8 3v4" />
        <path d="M16 3v4" />
        <path d="M4 9.5h16" />
        <path d="M8 13h3" />
      </svg>
    )
  }

  if (type === 'folder') {
    return (
      <svg viewBox="0 0 24 24" aria-hidden="true">
        <path d="M3.5 7.5h6l2 2h9v7.5a2 2 0 0 1-2 2H5.5a2 2 0 0 1-2-2V7.5Z" />
        <path d="M5.5 5.5h5l1.5 2" />
      </svg>
    )
  }

  if (type === 'shield') {
    return (
      <svg viewBox="0 0 24 24" aria-hidden="true">
        <path d="M12 3.5 19 6v5.3c0 4.1-2.8 7.6-7 9.2-4.2-1.6-7-5.1-7-9.2V6l7-2.5Z" />
        <path d="m8.4 12.1 2.2 2.1 4.9-5" />
      </svg>
    )
  }

  return (
    <svg viewBox="0 0 24 24" aria-hidden="true">
      <path d="M4 12.2h16" />
      <path d="M12 4.5v15" />
      <path d="m7 7 5-2.5L17 7" />
    </svg>
  )
}

function toneClass(tone: MetricTone) {
  return `tone-${tone}`
}

export function DashboardPage() {
  const { profile } = useAlumni()
  const fullName = profile.fullName
  const nameParts = fullName.trim().split(/\s+/).filter(Boolean)
  const greetingName =
    nameParts.length === 0
      ? 'Pio Felipe Ramirez'
      : nameParts.length === 1
      ? nameParts[0]
      : `${nameParts[0]} ${nameParts[nameParts.length - 1]}`
  const progress = 25

  // Calculate dynamic counts from requests
  const activeCount = getActiveRequests(mockRequests).length
  const completedCount = getCompletedRequests(mockRequests).length
  const pickupCount = getReadyForPickupRequests(mockRequests).length
  const paymentCount = getPendingPayments(mockRequests).length

  // Generate summary cards with dynamic data
  const summaryCards: StatCard[] = [
    {
      tone: 'violet',
      icon: 'folder',
      value: activeCount.toString(),
      label: 'Active applications',
      action: 'View all',
      href: '/requests?filter=active',
    },
    {
      tone: 'blue',
      icon: 'calendar',
      value: paymentCount.toString(),
      label: 'Pending payments',
      action: 'View invoice',
      href: '/payments',
    },
    {
      tone: 'amber',
      icon: 'folder',
      value: pickupCount.toString(),
      label: 'Items for pickup',
      action: 'Arrange pickup',
      href: '/requests?filter=readyForPickup',
    },
    {
      tone: 'green',
      icon: 'shield',
      value: completedCount.toString(),
      label: 'Completed requests',
      action: 'View history',
      href: '/requests?filter=completed',
    },
  ]

  return (
    <section className="dashboard-screen">
      <header className="dashboard-hero" style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '1.5rem' }}>
        <div>
          <h2>Dashboard</h2>
          <p className="dashboard-lead">Welcome back, {greetingName} 👋</p>
        </div>

        <div style={{ width: 124, height: 124, flexShrink: 0, overflow: 'hidden', borderRadius: 24, background: 'rgba(255,255,255,0.04)', boxShadow: '0 18px 40px rgba(0, 0, 0, 0.24)' }}>
          <Image
            src={heroImage}
            alt="Campus portal illustration"
            width={124}
            height={124}
            style={{ width: '100%', height: '100%', objectFit: 'cover' }}
            priority
          />
        </div>
      </header>

      <section className="dashboard-stat-grid" aria-label="Dashboard summary">
        {summaryCards.map((card) => (
          <article key={card.label} className="dashboard-stat-card">
            <span className={`dashboard-stat-icon ${toneClass(card.tone)}`} aria-hidden="true">
              <DashboardIcon type={card.icon} />
            </span>

            <div className="dashboard-stat-copy">
              <strong>{card.value}</strong>
              <span>{card.label}</span>
              <Link href={card.href} className="dashboard-stat-link">
                {card.action}
                <span aria-hidden="true">→</span>
              </Link>
            </div>
          </article>
        ))}
      </section>

      <section className="dashboard-content-grid">
        <article className="dashboard-card dashboard-card--status">
          <header className="dashboard-card-head">
            <div>
              <p className="dashboard-card-kicker">Your requests</p>
              <h3>Application overview</h3>
            </div>
          </header>

          <div className="dashboard-status-list">
              {mockRequests.slice(0, 3).map((req) => {
                // if there's a payment under verification for this request, show that status
                const paymentUnderCheck = mockPayments.find((p) => p.requestId === req.id && p.status === 'under_verification')
                const displayStatus = paymentUnderCheck ? 'Under Verification' : req.status
                const pillClass = paymentUnderCheck
                  ? 'is-verification'
                  : req.status === 'Processing'
                  ? 'is-open'
                  : req.status === 'Ready for Pickup'
                  ? 'is-ready'
                  : req.status === 'Shipped'
                  ? 'is-shipped'
                  : ''

                return (
                  <div className="dashboard-status-row" key={req.id}>
                    <div>
                      <strong>{req.title}</strong>
                      <small>{req.serviceType}</small>
                    </div>
                    <strong className={`status-pill ${pillClass}`}>{displayStatus}</strong>
                  </div>
                )
              })}
          </div>

          <div className="dashboard-progress">
            <div className="dashboard-progress-head">
              <span>Most urgent: Alumni Card Application</span>
              <strong>{progress}%</strong>
            </div>
            <div className="dashboard-progress-track" aria-hidden="true">
              <span style={{ width: `${progress}%` }} />
            </div>
          </div>
        </article>

        <section className="dashboard-actions-grid" aria-label="Quick actions">
          {quickActions.map((action) => (
            <Link key={action.title} href={action.href} className="dashboard-action-card">
              <span className="dashboard-action-icon" aria-hidden="true">
                <DashboardIcon type={action.icon} />
              </span>

              <span className="dashboard-action-copy">
                <strong>{action.title}</strong>
                <small>{action.description}</small>
              </span>

              <span className="dashboard-action-chevron" aria-hidden="true">
                →
              </span>
            </Link>
          ))}
        </section>
      </section>

    </section>
  )
}
