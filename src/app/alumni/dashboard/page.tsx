'use client';
import { useEffect, useState } from 'react';
import Link from 'next/link';
import { useAuth } from '@/contexts/AuthContext';
import { ProtectedRoute } from '../../components/ProtectedRoute';

const API = process.env.NEXT_PUBLIC_API_BASE_URL ?? 'http://localhost:4000';

// ─── Types matching alumni.record_requests + alumni.card_applications ──────────
type PaymentStatus = 'pending' | 'paid';

interface RecordRequest {
  log_id: string;
  created_at: string;
  document_type: string;
  status_code: number;
  payment_status: PaymentStatus;
  fee_amount: number;
  delivery_method?: string;
  notes?: string;
}

interface CardApplication {
  log_id: string;
  created_at: string;
  application_type: 'new' | 'replacement';
  delivery_method: 'pickup' | 'delivery';
  payment_status: PaymentStatus;
  status_code: number;
}

// status_code → human-readable
function recordLabel(code: number): string {
  if (code >= 400) return 'On Hold';
  if (code === 300) return 'Ready for Pickup';
  if (code === 200) return 'Completed';
  if (code === 150) return 'Processing';
  return 'Submitted';
}

function cardLabel(code: number): string {
  if (code === 200) return 'Processing';
  if (code === 300) return 'For Release';
  if (code === 201) return 'Completed';
  return 'Submitted';
}

// ─── Component ─────────────────────────────────────────────────────────────────
function DashboardContent() {
  const { user } = useAuth();
  const displayName = user?.user_metadata?.full_name || user?.email || 'Alumni';
  const initials = displayName.slice(0, 2).toUpperCase();
  const firstName = displayName.split(' ')[0];

  const [records, setRecords] = useState<RecordRequest[]>([]);
  const [cards, setCards] = useState<CardApplication[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!user?.id) return;
    const actorUuid = user.id;

    async function fetchData() {
      try {
        const [recRes, cardRes] = await Promise.all([
          fetch(`${API}/api/alumni/records/${actorUuid}`),
          fetch(`${API}/api/alumni/card-request/${actorUuid}`),
        ]);

        if (!recRes.ok) throw new Error(`Records fetch failed: ${recRes.status}`);
        if (!cardRes.ok) throw new Error(`Card fetch failed: ${cardRes.status}`);

        const [recData, cardData] = await Promise.all([recRes.json(), cardRes.json()]);
        setRecords(recData ?? []);
        setCards(cardData ?? []);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to load dashboard data');
      } finally {
        setLoading(false);
      }
    }

    fetchData();
  }, [user?.id]);

  // Derived stats
  const activeRecords = records.filter(r => r.status_code < 200 || r.status_code === 150).length;
  const pendingPayments = [...records, ...cards].filter(r => r.payment_status === 'pending').length;
  const readyForPickup = records.filter(r => r.status_code === 300).length + cards.filter(c => c.status_code === 300).length;
  const completed = records.filter(r => r.status_code === 200).length + cards.filter(c => c.status_code === 201).length;

  const summaryCards = [
    { label: 'Active applications',  value: loading ? '…' : activeRecords,    href: '/alumni/dashboard', tone: 'violet' },
    { label: 'Pending payments',      value: loading ? '…' : pendingPayments,  href: '/alumni/dashboard', tone: 'blue' },
    { label: 'Items for pickup',      value: loading ? '…' : readyForPickup,   href: '/alumni/dashboard', tone: 'amber' },
    { label: 'Completed requests',    value: loading ? '…' : completed,        href: '/alumni/dashboard', tone: 'green' },
  ];

  const quickActions = [
    { title: 'Request documents',     description: 'Order transcripts, diplomas, or other documents.',    href: '/alumni/dashboard/document-request' },
    { title: 'Apply for alumni card', description: 'Get your official alumni identification card.',       href: '/alumni/dashboard/card-application' },
    { title: 'View clearance status', description: 'Check the status of background clearance requests.', href: '/alumni/dashboard/clearance-tracker' },
  ];

  // Combine all requests for the overview list
  const allRequests = [
    ...records.map(r => ({
      id: r.log_id,
      title: r.document_type.replace('_', ' '),
      serviceType: 'Document Request',
      status: recordLabel(r.status_code),
      date: new Date(r.created_at).toLocaleDateString(),
    })),
    ...cards.map(c => ({
      id: c.log_id,
      title: `${c.application_type === 'new' ? 'New' : 'Replacement'} Alumni Card`,
      serviceType: 'Alumni Card',
      status: cardLabel(c.status_code),
      date: new Date(c.created_at).toLocaleDateString(),
    })),
  ].sort((a, b) => b.date.localeCompare(a.date));

  return (
    <section className="dashboard-screen">
      {/* Hero */}
      <header className="dashboard-hero">
        <div>
          <h2>Dashboard</h2>
          <p className="dashboard-lead">Welcome back, {firstName} 👋</p>
        </div>
        <article className="profile-box">
          <div className="avatar-web">{initials}</div>
          <div>
            <strong>{displayName}</strong>
            <p>{user?.email}</p>
          </div>
          <Link className="ghost-btn" href="/alumni/dashboard/profile">View Profile</Link>
        </article>
      </header>

      {/* Error banner */}
      {error && (
        <div role="alert" style={{ background: 'rgba(239,68,68,0.1)', border: '1px solid rgba(239,68,68,0.3)', borderRadius: 10, padding: '10px 16px', color: '#f87171', fontSize: 13, marginBottom: 20 }}>
          ⚠️ {error} — showing cached data if available.
        </div>
      )}

      {/* Stat cards */}
      <section className="dashboard-stat-grid" aria-label="Dashboard summary">
        {summaryCards.map((card) => (
          <article key={card.label} className={`dashboard-stat-card tone-${card.tone}`}>
            <div className="dashboard-stat-copy">
              <strong>{card.value}</strong>
              <span>{card.label}</span>
              <Link href={card.href} className="dashboard-stat-link">View all <span aria-hidden="true">→</span></Link>
            </div>
          </article>
        ))}
      </section>

      {/* Content grid */}
      <section className="dashboard-content-grid">
        {/* Application overview */}
        <article className="dashboard-card dashboard-card--status">
          <header className="dashboard-card-head">
            <div>
              <p className="dashboard-card-kicker">Your requests</p>
              <h3>Application overview</h3>
            </div>
          </header>
          <div className="dashboard-status-list">
            {loading ? (
              <p style={{ color: '#888', fontSize: 13, padding: '16px 0' }}>Loading your requests…</p>
            ) : allRequests.length === 0 ? (
              <p style={{ color: '#888', fontSize: 13, padding: '16px 0' }}>No requests yet. Use the quick actions below to get started.</p>
            ) : (
              allRequests.slice(0, 4).map((req) => (
                <div className="dashboard-status-row" key={req.id}>
                  <div>
                    <strong>{req.title}</strong>
                    <small>{req.serviceType} · {req.date}</small>
                  </div>
                  <strong className={`status-pill ${req.status === 'Processing' ? 'is-open' : req.status === 'Ready for Pickup' || req.status === 'For Release' ? 'is-ready' : req.status === 'Completed' ? '' : 'is-shipped'}`}>
                    {req.status}
                  </strong>
                </div>
              ))
            )}
          </div>
          {!loading && allRequests.length > 0 && (
            <div className="dashboard-progress">
              <div className="dashboard-progress-head">
                <span>Most recent: {allRequests[0]?.title}</span>
                <strong>{allRequests[0]?.status}</strong>
              </div>
              <div className="dashboard-progress-track" aria-hidden="true">
                <span style={{ width: allRequests[0]?.status === 'Completed' ? '100%' : allRequests[0]?.status === 'For Release' || allRequests[0]?.status === 'Ready for Pickup' ? '75%' : allRequests[0]?.status === 'Processing' ? '40%' : '15%' }} />
              </div>
            </div>
          )}
        </article>

        {/* Quick actions */}
        <section className="dashboard-actions-grid" aria-label="Quick actions">
          {quickActions.map((action) => (
            <Link key={action.title} href={action.href} className="dashboard-action-card">
              <span className="dashboard-action-copy">
                <strong>{action.title}</strong>
                <small>{action.description}</small>
              </span>
              <span className="dashboard-action-chevron" aria-hidden="true">→</span>
            </Link>
          ))}
        </section>
      </section>
    </section>
  );
}

export default function AlumniDashboardPage() {
  return (
    <ProtectedRoute allowedRoles={['alumni']}>
      <DashboardContent />
    </ProtectedRoute>
  );
}
