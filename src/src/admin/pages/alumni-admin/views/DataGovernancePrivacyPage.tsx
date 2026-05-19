'use client'

import { useState } from 'react'
import { RecordsTable } from '../../../components/common/RecordsTable'
import { StatusPill } from '../../../components/common/StatusPill'
import {
  dataDownloadRequests, privacyComplianceRecords,
  type DataDownloadRequestRecord, type PrivacyComplianceRecord,
} from '../../../data/admin-modules'

function complianceTone(status: PrivacyComplianceRecord['status']) {
  if (status === 'Compliant') return 'success'
  if (status === 'Review Required') return 'warning'
  return 'danger'
}

function downloadTone(status: DataDownloadRequestRecord['request_status']) {
  if (status === 'Delivered') return 'success'
  if (status === 'Preparing Export') return 'info'
  if (status === 'Awaiting Release Approval') return 'warning'
  return 'neutral'
}

export function DataGovernancePrivacyPage() {
  const [compliance, setCompliance] = useState(privacyComplianceRecords)
  const [downloads, setDownloads] = useState(dataDownloadRequests)

  return (
    <section className="resource-screen">
      <header className="resource-hero">
        <div>
          <h1>Data Governance &amp; Privacy</h1>
          <p>Track compliance controls and fulfill &quot;Download My Data&quot; requests using the same alumni and graduation-linked records.</p>
        </div>
      </header>

      <section className="summary-grid" aria-label="Data governance and privacy summary">
        <article className="summary-card"><strong>{compliance.filter((r) => r.status !== 'Compliant').length}</strong><span>Compliance controls needing action</span></article>
        <article className="summary-card"><strong>{downloads.filter((r) => r.request_status === 'Queued').length}</strong><span>Queued data exports</span></article>
        <article className="summary-card"><strong>{downloads.filter((r) => r.request_status === 'Awaiting Release Approval').length}</strong><span>Awaiting release approval</span></article>
        <article className="summary-card"><strong>{downloads.filter((r) => r.release_channel === 'Secure Link').length}</strong><span>Secure-link releases</span></article>
      </section>

      <div className="dashboard-grid">
        <section className="section-card">
          <header className="section-card-head"><div><h2>Privacy Compliance Tools</h2><p>Review control ownership, due dates, and data-rights follow-up tasks.</p></div></header>
          <div>
            <RecordsTable
              items={compliance}
              getRowKey={(r) => r.control_id}
              emptyMessage="No privacy compliance records available."
              columns={[
                { header: 'Control', render: (r) => r.policy_area },
                { header: 'Owner', render: (r) => r.owner },
                { header: 'Review Due', render: (r) => r.review_due },
                { header: 'Academic Unit', render: (r) => r.academic_unit ?? 'Unspecified' },
                { header: 'Status', render: (r) => <StatusPill label={r.status} tone={complianceTone(r.status)} /> },
              ]}
              actions={(r) => (
                <>
                  {r.status !== 'Compliant' ? (
                    <button className="row-action-btn" type="button" onClick={() => setCompliance((cur) => cur.map((x) => x.control_id === r.control_id ? { ...x, status: 'Compliant' } : x))}>Resolve</button>
                  ) : null}
                </>
              )}
            />
          </div>
        </section>

        <section className="section-card">
          <header className="section-card-head"><div><h2>Download My Data Fulfillment</h2><p>Prepare, approve, and release data export packages for alumni requests.</p></div></header>
          <div>
            <RecordsTable
              items={downloads}
              getRowKey={(r) => r.download_id}
              emptyMessage="No data download requests available."
              columns={[
                { header: 'Requestor', render: (r) => <div><strong>{r.full_name}</strong><div className="muted">{r.request_scope}</div></div> },
                { header: 'Requested At', render: (r) => r.requested_at },
                { header: 'Release Channel', render: (r) => r.release_channel },
                { header: 'Expires', render: (r) => r.expires_at },
                { header: 'Status', render: (r) => <StatusPill label={r.request_status} tone={downloadTone(r.request_status)} /> },
              ]}
              actions={(r) => (
                <>
                  {r.request_status === 'Queued' ? <button className="row-action-btn" type="button" onClick={() => setDownloads((cur) => cur.map((x) => x.download_id === r.download_id ? { ...x, request_status: 'Preparing Export' } : x))}>Prepare</button> : null}
                  {r.request_status === 'Preparing Export' ? <button className="row-action-btn" type="button" onClick={() => setDownloads((cur) => cur.map((x) => x.download_id === r.download_id ? { ...x, request_status: 'Awaiting Release Approval' } : x))}>Submit approval</button> : null}
                  {r.request_status === 'Awaiting Release Approval' ? <button className="row-action-btn" type="button" onClick={() => setDownloads((cur) => cur.map((x) => x.download_id === r.download_id ? { ...x, request_status: 'Delivered' } : x))}>Deliver</button> : null}
                </>
              )}
            />
          </div>
        </section>
      </div>
    </section>
  )
}

