'use client'

import { useState } from 'react'
import { RecordsTable } from '../../../components/common/RecordsTable'
import { SectionCard } from '../../../components/common/SectionCard'
import { StatusPill } from '../../../components/common/StatusPill'
import {
  benefitFulfillmentRecords,
  idCardApplications,
  type BenefitFulfillmentRecord,
  type IdCardApplicationRecord,
} from '../../../../data/admin-modules'

function cardTone(status: IdCardApplicationRecord['application_status']) {
  if (status === 'Completed') {
    return 'success'
  }

  if (status === 'For Release') {
    return 'info'
  }

  if (status === 'For Printing') {
    return 'warning'
  }

  return 'neutral'
}

function benefitTone(status: BenefitFulfillmentRecord['fulfillment_status']) {
  if (status === 'Fulfilled') {
    return 'success'
  }

  if (status === 'In Progress') {
    return 'info'
  }

  return 'warning'
}

export function MembershipIdServicesPage() {
  const [applications, setApplications] = useState(idCardApplications)
  const [benefits, setBenefits] = useState(benefitFulfillmentRecords)

  return (
    <section className="resource-screen">
      <header className="resource-hero">
        <div>
          <h1>Membership &amp; ID Services</h1>
          <p>Process alumni ID applications and track benefit fulfillment from the same member and graduation-linked record set.</p>
        </div>
      </header>

      <section className="summary-grid" aria-label="Membership and ID services summary">
        <article className="summary-card">
          <strong>{applications.filter((item) => item.application_status === 'Queued').length}</strong>
          <span>Queued ID applications</span>
        </article>
        <article className="summary-card">
          <strong>{applications.filter((item) => item.application_status === 'For Release').length}</strong>
          <span>Cards ready for release</span>
        </article>
        <article className="summary-card">
          <strong>{benefits.filter((item) => item.fulfillment_status !== 'Fulfilled').length}</strong>
          <span>Benefit tasks in flight</span>
        </article>
        <article className="summary-card">
          <strong>{benefits.filter((item) => item.fulfillment_channel === 'Partner Office').length}</strong>
          <span>Partner-fulfilled benefits</span>
        </article>
      </section>

      <div className="dashboard-grid">
        <SectionCard
          title="ID Card Application Processing"
          subtitle="Advance applications from queue to printing and final release."
        >
          <RecordsTable
            items={applications}
            getRowKey={(item) => item.application_id}
            emptyMessage="No ID applications available."
            columns={[
              {
                header: 'Applicant',
                render: (item) => (
                  <div>
                    <strong>{item.full_name}</strong>
                    <div className="muted">{item.card_type}</div>
                  </div>
                ),
              },
              { header: 'Delivery', render: (item) => item.delivery_method },
              { header: 'Serial', render: (item) => item.card_serial },
              {
                header: 'Status',
                render: (item) => <StatusPill label={item.application_status} tone={cardTone(item.application_status)} />,
              },
            ]}
            actions={(item) => (
              <>
                {item.application_status === 'Queued' ? (
                  <button
                    className="row-action-btn"
                    type="button"
                    onClick={() => {
                      setApplications((current) =>
                        current.map((record) =>
                          record.application_id === item.application_id
                            ? { ...record, application_status: 'For Printing' }
                            : record,
                        ),
                      )
                    }}
                  >
                    Queue print
                  </button>
                ) : null}
                {item.application_status === 'For Printing' ? (
                  <button
                    className="row-action-btn"
                    type="button"
                    onClick={() => {
                      setApplications((current) =>
                        current.map((record) =>
                          record.application_id === item.application_id
                            ? { ...record, application_status: 'For Release' }
                            : record,
                        ),
                      )
                    }}
                  >
                    Mark ready
                  </button>
                ) : null}
                {item.application_status === 'For Release' ? (
                  <button
                    className="row-action-btn"
                    type="button"
                    onClick={() => {
                      setApplications((current) =>
                        current.map((record) =>
                          record.application_id === item.application_id
                            ? { ...record, application_status: 'Completed' }
                            : record,
                        ),
                      )
                    }}
                  >
                    Complete
                  </button>
                ) : null}
              </>
            )}
          />
        </SectionCard>

        <SectionCard
          title="Benefit Fulfillment Tracking"
          subtitle="Monitor delivery of membership-linked benefits and entitlements."
        >
          <RecordsTable
            items={benefits}
            getRowKey={(item) => item.benefit_id}
            emptyMessage="No benefit fulfillment records available."
            columns={[
              {
                header: 'Member',
                render: (item) => (
                  <div>
                    <strong>{item.full_name}</strong>
                    <div className="muted">{item.benefit_name}</div>
                  </div>
                ),
              },
              { header: 'Channel', render: (item) => item.fulfillment_channel },
              { header: 'Owner', render: (item) => item.owner },
              {
                header: 'Status',
                render: (item) => <StatusPill label={item.fulfillment_status} tone={benefitTone(item.fulfillment_status)} />,
              },
            ]}
            actions={(item) => (
              <>
                {item.fulfillment_status === 'Pending' ? (
                  <button
                    className="row-action-btn"
                    type="button"
                    onClick={() => {
                      setBenefits((current) =>
                        current.map((record) =>
                          record.benefit_id === item.benefit_id
                            ? { ...record, fulfillment_status: 'In Progress' }
                            : record,
                        ),
                      )
                    }}
                  >
                    Start
                  </button>
                ) : null}
                {item.fulfillment_status !== 'Fulfilled' ? (
                  <button
                    className="row-action-btn"
                    type="button"
                    onClick={() => {
                      setBenefits((current) =>
                        current.map((record) =>
                          record.benefit_id === item.benefit_id
                            ? { ...record, fulfillment_status: 'Fulfilled' }
                            : record,
                        ),
                      )
                    }}
                  >
                    Fulfill
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
