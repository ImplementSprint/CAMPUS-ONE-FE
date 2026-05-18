'use client'

import { useState } from 'react'
import { RecordsTable } from '../../../components/common/RecordsTable'
import { SectionCard } from '../../../components/common/SectionCard'
import { StatusPill } from '../../../components/common/StatusPill'
import {
  dataDownloadRequests,
  privacyComplianceRecords,
  type DataDownloadRequestRecord,
  type PrivacyComplianceRecord,
} from '../../../../data/admin-modules'

function complianceTone(status: PrivacyComplianceRecord['status']) {
  if (status === 'Compliant') {
    return 'success'
  }

  if (status === 'Review Required') {
    return 'warning'
  }

  return 'danger'
}

function downloadTone(status: DataDownloadRequestRecord['request_status']) {
  if (status === 'Delivered') {
    return 'success'
  }

  if (status === 'Preparing Export') {
    return 'info'
  }

  if (status === 'Awaiting Release Approval') {
    return 'warning'
  }

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
        <article className="summary-card">
          <strong>{compliance.filter((item) => item.status !== 'Compliant').length}</strong>
          <span>Compliance controls needing action</span>
        </article>
        <article className="summary-card">
          <strong>{downloads.filter((item) => item.request_status === 'Queued').length}</strong>
          <span>Queued data exports</span>
        </article>
        <article className="summary-card">
          <strong>{downloads.filter((item) => item.request_status === 'Awaiting Release Approval').length}</strong>
          <span>Awaiting release approval</span>
        </article>
        <article className="summary-card">
          <strong>{downloads.filter((item) => item.release_channel === 'Secure Link').length}</strong>
          <span>Secure-link releases</span>
        </article>
      </section>

      <div className="dashboard-grid">
        <SectionCard
          title="Privacy Compliance Tools"
          subtitle="Review control ownership, due dates, and data-rights follow-up tasks."
        >
          <RecordsTable
            items={compliance}
            getRowKey={(item) => item.control_id}
            emptyMessage="No privacy compliance records available."
            columns={[
              { header: 'Control', render: (item) => item.policy_area },
              { header: 'Owner', render: (item) => item.owner },
              { header: 'Review Due', render: (item) => item.review_due },
              { header: 'Academic Unit', render: (item) => item.academic_unit ?? 'Unspecified' },
              {
                header: 'Status',
                render: (item) => <StatusPill label={item.status} tone={complianceTone(item.status)} />,
              },
            ]}
            actions={(item) => (
              <>
                {item.status !== 'Compliant' ? (
                  <button
                    className="row-action-btn"
                    type="button"
                    onClick={() => {
                      setCompliance((current) =>
                        current.map((record) =>
                          record.control_id === item.control_id ? { ...record, status: 'Compliant' } : record,
                        ),
                      )
                    }}
                  >
                    Resolve
                  </button>
                ) : null}
              </>
            )}
          />
        </SectionCard>

        <SectionCard
          title="Download My Data Fulfillment"
          subtitle="Prepare, approve, and release data export packages for alumni requests."
        >
          <RecordsTable
            items={downloads}
            getRowKey={(item) => item.download_id}
            emptyMessage="No data download requests available."
            columns={[
              {
                header: 'Requestor',
                render: (item) => (
                  <div>
                    <strong>{item.full_name}</strong>
                    <div className="muted">{item.request_scope}</div>
                  </div>
                ),
              },
              { header: 'Requested At', render: (item) => item.requested_at },
              { header: 'Release Channel', render: (item) => item.release_channel },
              { header: 'Expires', render: (item) => item.expires_at },
              {
                header: 'Status',
                render: (item) => <StatusPill label={item.request_status} tone={downloadTone(item.request_status)} />,
              },
            ]}
            actions={(item) => (
              <>
                {item.request_status === 'Queued' ? (
                  <button
                    className="row-action-btn"
                    type="button"
                    onClick={() => {
                      setDownloads((current) =>
                        current.map((record) =>
                          record.download_id === item.download_id
                            ? { ...record, request_status: 'Preparing Export' }
                            : record,
                        ),
                      )
                    }}
                  >
                    Prepare
                  </button>
                ) : null}
                {item.request_status === 'Preparing Export' ? (
                  <button
                    className="row-action-btn"
                    type="button"
                    onClick={() => {
                      setDownloads((current) =>
                        current.map((record) =>
                          record.download_id === item.download_id
                            ? { ...record, request_status: 'Awaiting Release Approval' }
                            : record,
                        ),
                      )
                    }}
                  >
                    Submit approval
                  </button>
                ) : null}
                {item.request_status === 'Awaiting Release Approval' ? (
                  <button
                    className="row-action-btn"
                    type="button"
                    onClick={() => {
                      setDownloads((current) =>
                        current.map((record) =>
                          record.download_id === item.download_id ? { ...record, request_status: 'Delivered' } : record,
                        ),
                      )
                    }}
                  >
                    Deliver
                  </button>
                ) : null}
              </>
            )}
          />
        </SectionCard>
      </div>
    </section>
  )
}
