import Link from 'next/link'
import { SectionCard } from '@/admin/alumni-admin/components/common/SectionCard'
import { NavIcon } from '@/admin/alumni-admin/components/common/Icons'
import {
  activityTrackingRecords,
  clearanceRecords,
  dataDownloadRequests,
  deliveryManagementRecords,
  documentRequestQueue,
  idCardApplications,
  notificationEngineRecords,
  privacyComplianceRecords,
  registryRecords,
} from '@/admin/data/admin-modules'

const moduleCards = [
  {
    href: '/alumni-admin/graduate-exit-onboarding',
    icon: 'graduate',
    title: 'Graduate Exit & Onboarding',
    description: 'Clearance approvals and member registry governance.',
  },
  {
    href: '/alumni-admin/membership-id-services',
    icon: 'membership',
    title: 'Membership & ID Services',
    description: 'ID application handling and benefit fulfillment tracking.',
  },
  {
    href: '/alumni-admin/record-document-fulfillment',
    icon: 'documents',
    title: 'Record & Document Fulfillment',
    description: 'Request queue operations and release logistics.',
  },
  {
    href: '/alumni-admin/engagement-communication',
    icon: 'engagement',
    title: 'Engagement & Communication',
    description: 'Notification engine controls and activity analytics.',
  },
] as const

export function DashboardPage() {
  const pendingClearance = clearanceRecords.filter((item) => item.status !== 'Released').length
  const activeMembers = registryRecords.filter((item) => item.member_status === 'Active Member').length
  const openServiceWork =
    idCardApplications.filter((item) => item.application_status !== 'Completed').length +
    documentRequestQueue.filter((item) => item.request_status !== 'Completed').length
  const privacyItems =
    privacyComplianceRecords.filter((item) => item.status !== 'Compliant').length +
    dataDownloadRequests.filter((item) => item.request_status !== 'Delivered').length

  return (
    <section className="dashboard-screen">
      <header className="dashboard-hero">
        <div>
          <h2>Campus One Alumni Operations</h2>
          <p>Five-module admin workspace aligned to alumni registration, profile, card, record request, and graduation verification fields.</p>
        </div>
      </header>

      <section className="dashboard-stats" aria-label="Operations summary">
        <article className="dashboard-stat">
          <strong className="tone-blue">{activeMembers}</strong>
          <span>Active registry members</span>
        </article>
        <article className="dashboard-stat">
          <strong className="tone-amber">{pendingClearance}</strong>
          <span>Exit approvals in progress</span>
        </article>
        <article className="dashboard-stat">
          <strong className="tone-green">{openServiceWork}</strong>
          <span>ID and document tasks open</span>
        </article>
        <article className="dashboard-stat">
          <strong className="tone-violet">{privacyItems}</strong>
          <span>Privacy actions pending</span>
        </article>
      </section>

      <section className="dashboard-panels">
        <SectionCard title="Core Modules" subtitle="Only the required operational surfaces remain in the admin portal.">
          <div className="dashboard-action-grid">
            {moduleCards.map((moduleCard) => (
              <Link key={moduleCard.href} href={moduleCard.href} className="dashboard-action-card">
                <span className="dashboard-action-icon" aria-hidden="true">
                    <NavIcon type={moduleCard.icon as any} />
                </span>
                <span>
                  <strong>{moduleCard.title}</strong>
                  <small>{moduleCard.description}</small>
                </span>
                <span aria-hidden="true">Open</span>
              </Link>
            ))}
          </div>
        </SectionCard>

        <SectionCard title="Operational Snapshot" subtitle="Live counts across the five schema-aligned modules.">
          <div className="dashboard-list">
            <div className="dashboard-list-item">
              <strong>Membership &amp; ID services</strong>
              <span>{idCardApplications.filter((item) => item.application_status !== 'Completed').length} card applications awaiting completion</span>
            </div>
            <div className="dashboard-list-item">
              <strong>Record fulfillment</strong>
              <span>{deliveryManagementRecords.filter((item) => item.dispatch_status !== 'Delivered').length} deliveries not yet closed</span>
            </div>
            <div className="dashboard-list-item">
              <strong>Engagement &amp; communication</strong>
              <span>{notificationEngineRecords.filter((item) => item.status !== 'Archived').length} active campaign records and {activityTrackingRecords.length} tracked service events</span>
            </div>
            <div className="dashboard-list-item">
              <strong>Privacy operations</strong>
              <span>{dataDownloadRequests.filter((item) => item.request_status === 'Awaiting Release Approval').length} data exports awaiting release approval</span>
            </div>
          </div>
        </SectionCard>
      </section>
    </section>
  )
}
