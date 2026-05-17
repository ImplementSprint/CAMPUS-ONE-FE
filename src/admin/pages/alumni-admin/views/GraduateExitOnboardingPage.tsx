'use client'

import { useState } from 'react'
import { RecordsTable } from '../../../components/common/RecordsTable'
import { StatusPill } from '../../../components/common/StatusPill'
import {
  clearanceRecords, registryRecords,
  type AlumniRegistryRecord, type ClearanceOversightRecord,
} from '../../../data/admin-modules'

function clearanceTone(status: ClearanceOversightRecord['status']) {
  if (status === 'Released') return 'success'
  if (status === 'Approved') return 'info'
  if (status === 'Needs Action') return 'danger'
  return 'warning'
}

function registryTone(status: AlumniRegistryRecord['member_status']) {
  if (status === 'Active Member') return 'success'
  if (status === 'For Exit Clearance') return 'info'
  if (status === 'Inactive') return 'neutral'
  return 'warning'
}

export function GraduateExitOnboardingPage() {
  const [clearances, setClearances] = useState(clearanceRecords)

  return (
    <section className="resource-screen">
      <header className="resource-hero">
        <div>
          <h1>Graduate Exit &amp; Onboarding</h1>
          <p>Run clearance approvals and maintain the member registry against the existing alumni and graduation schema fields.</p>
        </div>
      </header>

      <section className="summary-grid" aria-label="Graduate exit and onboarding summary">
        <article className="summary-card">
          <strong>{clearances.filter((r) => r.status === 'Pending Review').length}</strong>
          <span>Pending clearance approvals</span>
        </article>
        <article className="summary-card">
          <strong>{registryRecords.filter((r) => r.onboarding_stage === 'Activated').length}</strong>
          <span>Activated registry members</span>
        </article>
        <article className="summary-card">
          <strong>{registryRecords.filter((r) => r.consent_status !== 'Granted').length}</strong>
          <span>Consent follow-ups due</span>
        </article>
        <article className="summary-card">
          <strong>{clearances.filter((r) => r.status === 'Needs Action').length}</strong>
          <span>Exit cases needing intervention</span>
        </article>
      </section>

      <div className="dashboard-grid">
        <section className="section-card">
          <header className="section-card-head"><div><h2>Clearance Oversight</h2><p>Approve or release graduate exit checkpoints using the graduation-linked record.</p></div></header>
          <div>
            <RecordsTable
              items={clearances}
              getRowKey={(r) => r.clearance_id}
              emptyMessage="No clearance records available."
              columns={[
                { header: 'Graduate', render: (r) => <div><strong>{r.full_name}</strong><div className="muted">{r.last_program}</div></div> },
                { header: 'Office', render: (r) => r.office_owner },
                { header: 'Term', render: (r) => r.exit_term },
                { header: 'Due', render: (r) => r.due_date },
                { header: 'Status', render: (r) => <StatusPill label={r.status} tone={clearanceTone(r.status)} /> },
              ]}
              actions={(r) => (
                <>
                  {r.status !== 'Approved' && r.status !== 'Released' ? (
                    <button className="row-action-btn" type="button" onClick={() => setClearances((cur) => cur.map((x) => x.clearance_id === r.clearance_id ? { ...x, status: 'Approved' } : x))}>Approve</button>
                  ) : null}
                  {r.status === 'Approved' ? (
                    <button className="row-action-btn" type="button" onClick={() => setClearances((cur) => cur.map((x) => x.clearance_id === r.clearance_id ? { ...x, status: 'Released' } : x))}>Release</button>
                  ) : null}
                </>
              )}
            />
          </div>
        </section>

        <section className="section-card">
          <header className="section-card-head"><div><h2>Member Registry</h2><p>Registry records mirror alumni identity and graduation verification data.</p></div></header>
          <div>
            <RecordsTable
              items={registryRecords}
              getRowKey={(r) => r.alumni_number}
              emptyMessage="No alumni registry records available."
              columns={[
                { header: 'Member', render: (r) => <div><strong>{r.full_name}</strong><div className="muted">{r.alumni_number}</div></div> },
                { header: 'Academic Unit', render: (r) => r.academic_unit ?? 'Unspecified' },
                { header: 'Graduation', render: (r) => r.graduation_year ?? 'Unspecified' },
                { header: 'Onboarding', render: (r) => r.onboarding_stage },
                { header: 'Registry Status', render: (r) => <StatusPill label={r.member_status} tone={registryTone(r.member_status)} /> },
              ]}
            />
          </div>
        </section>
      </div>
    </section>
  )
}

