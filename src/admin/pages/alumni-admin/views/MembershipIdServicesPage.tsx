'use client'

import { useState } from 'react'
import { RecordsTable } from '../../../components/common/RecordsTable'
import { StatusPill } from '../../../components/common/StatusPill'
import {
  benefitFulfillmentRecords, idCardApplications,
  type BenefitFulfillmentRecord, type IdCardApplicationRecord,
} from '../../../data/admin-modules'

function cardTone(status: IdCardApplicationRecord['application_status']) {
  if (status === 'Completed') return 'success'
  if (status === 'For Release') return 'info'
  if (status === 'For Printing') return 'warning'
  return 'neutral'
}

function benefitTone(status: BenefitFulfillmentRecord['fulfillment_status']) {
  if (status === 'Fulfilled') return 'success'
  if (status === 'In Progress') return 'info'
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
          <strong>{applications.filter((r) => r.application_status === 'Queued').length}</strong>
          <span>Queued ID applications</span>
        </article>
        <article className="summary-card">
          <strong>{applications.filter((r) => r.application_status === 'For Release').length}</strong>
          <span>Cards ready for release</span>
        </article>
        <article className="summary-card">
          <strong>{benefits.filter((r) => r.fulfillment_status !== 'Fulfilled').length}</strong>
          <span>Benefit tasks in flight</span>
        </article>
        <article className="summary-card">
          <strong>{benefits.filter((r) => r.fulfillment_channel === 'Partner Office').length}</strong>
          <span>Partner-fulfilled benefits</span>
        </article>
      </section>

      <div className="dashboard-grid">
        <section className="section-card">
          <header className="section-card-head"><div><h2>ID Card Application Processing</h2><p>Advance applications from queue to printing and final release.</p></div></header>
          <div>
            <RecordsTable
              items={applications}
              getRowKey={(r) => r.application_id}
              emptyMessage="No ID applications available."
              columns={[
                { header: 'Applicant', render: (r) => <div><strong>{r.full_name}</strong><div className="muted">{r.card_type}</div></div> },
                { header: 'Delivery', render: (r) => r.delivery_method },
                { header: 'Serial', render: (r) => r.card_serial },
                { header: 'Status', render: (r) => <StatusPill label={r.application_status} tone={cardTone(r.application_status)} /> },
              ]}
              actions={(r) => (
                <>
                  {r.application_status === 'Queued' ? <button className="row-action-btn" type="button" onClick={() => setApplications((cur) => cur.map((x) => x.application_id === r.application_id ? { ...x, application_status: 'For Printing' } : x))}>Queue print</button> : null}
                  {r.application_status === 'For Printing' ? <button className="row-action-btn" type="button" onClick={() => setApplications((cur) => cur.map((x) => x.application_id === r.application_id ? { ...x, application_status: 'For Release' } : x))}>Mark ready</button> : null}
                  {r.application_status === 'For Release' ? <button className="row-action-btn" type="button" onClick={() => setApplications((cur) => cur.map((x) => x.application_id === r.application_id ? { ...x, application_status: 'Completed' } : x))}>Complete</button> : null}
                </>
              )}
            />
          </div>
        </section>

        <section className="section-card">
          <header className="section-card-head"><div><h2>Benefit Fulfillment Tracking</h2><p>Monitor delivery of membership-linked benefits and entitlements.</p></div></header>
          <div>
            <RecordsTable
              items={benefits}
              getRowKey={(r) => r.benefit_id}
              emptyMessage="No benefit fulfillment records available."
              columns={[
                { header: 'Member', render: (r) => <div><strong>{r.full_name}</strong><div className="muted">{r.benefit_name}</div></div> },
                { header: 'Channel', render: (r) => r.fulfillment_channel },
                { header: 'Owner', render: (r) => r.owner },
                { header: 'Status', render: (r) => <StatusPill label={r.fulfillment_status} tone={benefitTone(r.fulfillment_status)} /> },
              ]}
              actions={(r) => (
                <>
                  {r.fulfillment_status === 'Pending' ? <button className="row-action-btn" type="button" onClick={() => setBenefits((cur) => cur.map((x) => x.benefit_id === r.benefit_id ? { ...x, fulfillment_status: 'In Progress' } : x))}>Start</button> : null}
                  {r.fulfillment_status !== 'Fulfilled' ? <button className="row-action-btn" type="button" onClick={() => setBenefits((cur) => cur.map((x) => x.benefit_id === r.benefit_id ? { ...x, fulfillment_status: 'Fulfilled' } : x))}>Fulfill</button> : null}
                </>
              )}
            />
          </div>
        </section>
      </div>
    </section>
  )
}

