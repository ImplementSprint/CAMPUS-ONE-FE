'use client'

import { useState } from 'react'
import { RecordsTable } from '../../components/common/RecordsTable'
import { SectionCard } from '../../components/common/SectionCard'
import { StatusPill } from '../../components/common/StatusPill'
import { clearanceRecords, registryRecords, type AlumniRegistryRecord, type ClearanceOversightRecord } from '../../../data/admin-modules'

function clearanceTone(status: ClearanceOversightRecord['status']) {
  if (status === 'Released') {
    return 'success'
  }

  if (status === 'Approved') {
    return 'info'
  }

  if (status === 'Needs Action') {
    return 'danger'
  }

  return 'warning'
}

function registryTone(status: AlumniRegistryRecord['member_status']) {
  if (status === 'Active Member') {
    return 'success'
  }

  if (status === 'For Exit Clearance') {
    return 'info'
  }

  if (status === 'Inactive') {
    return 'neutral'
  }

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
          <strong>{clearances.filter((item) => item.status === 'Pending Review').length}</strong>
          <span>Pending clearance approvals</span>
        </article>
        <article className="summary-card">
          <strong>{registryRecords.filter((item) => item.onboarding_stage === 'Activated').length}</strong>
          <span>Activated registry members</span>
        </article>
        <article className="summary-card">
          <strong>{registryRecords.filter((item) => item.consent_status !== 'Granted').length}</strong>
          <span>Consent follow-ups due</span>
        </article>
        <article className="summary-card">
          <strong>{clearances.filter((item) => item.status === 'Needs Action').length}</strong>
          <span>Exit cases needing intervention</span>
        </article>
      </section>

      <div className="dashboard-grid">
        <SectionCard
          title="Clearance Oversight"
          subtitle="Approve or release graduate exit checkpoints using the graduation-linked record."
        >
          <RecordsTable
            items={clearances}
            getRowKey={(item) => item.clearance_id}
            emptyMessage="No clearance records available."
            columns={[
              {
                header: 'Graduate',
                render: (item) => (
                  <div>
                    <strong>{item.full_name}</strong>
                    <div className="muted">{item.last_program}</div>
                  </div>
                ),
              },
              { header: 'Office', render: (item) => item.office_owner },
              { header: 'Term', render: (item) => item.exit_term },
              { header: 'Due', render: (item) => item.due_date },
              {
                header: 'Status',
                render: (item) => <StatusPill label={item.status} tone={clearanceTone(item.status)} />,
              },
            ]}
            actions={(item) => (
              <>
                {item.status !== 'Approved' && item.status !== 'Released' ? (
                  <button
                    className="row-action-btn"
                    type="button"
                    onClick={() => {
                      setClearances((current) =>
                        current.map((record) =>
                          record.clearance_id === item.clearance_id ? { ...record, status: 'Approved' } : record,
                        ),
                      )
                    }}
                  >
                    Approve
                  </button>
                ) : null}
                {item.status === 'Approved' ? (
                  <button
                    className="row-action-btn"
                    type="button"
                    onClick={() => {
                      setClearances((current) =>
                        current.map((record) =>
                          record.clearance_id === item.clearance_id ? { ...record, status: 'Released' } : record,
                        ),
                      )
                    }}
                  >
                    Release
                  </button>
                ) : null}
              </>
            )}
          />
        </SectionCard>

        <SectionCard
          title="Member Registry"
          subtitle="Registry records mirror alumni identity and graduation verification data."
        >
          <RecordsTable
            items={registryRecords}
            getRowKey={(item) => item.alumni_number}
            emptyMessage="No alumni registry records available."
            columns={[
              {
                header: 'Member',
                render: (item) => (
                  <div>
                    <strong>{item.full_name}</strong>
                    <div className="muted">{item.alumni_number}</div>
                  </div>
                ),
              },
              { header: 'Academic Unit', render: (item) => item.academic_unit ?? 'Unspecified' },
              { header: 'Graduation', render: (item) => item.graduation_year ?? 'Unspecified' },
              { header: 'Onboarding', render: (item) => item.onboarding_stage },
              {
                header: 'Registry Status',
                render: (item) => <StatusPill label={item.member_status} tone={registryTone(item.member_status)} />,
              },
            ]}
          />
        </SectionCard>
      </div>
    </section>
  )
}
