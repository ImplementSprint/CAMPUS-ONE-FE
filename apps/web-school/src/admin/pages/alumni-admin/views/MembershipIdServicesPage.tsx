'use client'

import { useEffect, useState } from 'react'
import { RecordsTable } from '../../../components/common/RecordsTable'
import { StatusPill } from '../../../components/common/StatusPill'
import {
  benefitFulfillmentRecords,
  type BenefitFulfillmentRecord,
} from '../../../data/admin-modules'
import {
  getAlumniAdminCardApplications,
  updateAlumniCardApplicationStatus,
  type AlumniCardApplication,
} from '@/app/alumni/services/alumni.service'

type CardStatus = 'Queued' | 'For Printing' | 'For Release' | 'Completed'
type IdCardApplicationRecord = {
  application_id: string
  full_name: string
  card_type: string
  delivery_method: string
  card_serial: string
  application_status: CardStatus
  payment_status: string
}

const STATUS_CODES: Record<CardStatus, number> = {
  Queued: 100,
  'For Printing': 200,
  'For Release': 300,
  Completed: 400,
}

function cardTone(status: CardStatus) {
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

function statusFromCode(statusCode: number): CardStatus {
  if (statusCode >= 400) return 'Completed'
  if (statusCode >= 300) return 'For Release'
  if (statusCode >= 200) return 'For Printing'
  return 'Queued'
}

function toCardRecord(card: AlumniCardApplication): IdCardApplicationRecord {
  return {
    application_id: card.log_id,
    full_name: card.actor_uuid,
    card_type: card.application_type === 'replacement' ? 'Replacement Alumni ID' : 'Lifetime Alumni ID',
    delivery_method: card.delivery_method,
    card_serial: card.card_serial ?? 'Pending',
    application_status: statusFromCode(card.status_code),
    payment_status: card.payment_status ?? 'pending',
  }
}

export function MembershipIdServicesPage() {
  const [applications, setApplications] = useState<IdCardApplicationRecord[]>([])
  const [benefits, setBenefits] = useState(benefitFulfillmentRecords)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    setLoading(true)
    getAlumniAdminCardApplications().then((result) => {
      setApplications((result.data ?? []).map(toCardRecord))
      setLoading(false)
    })
  }, [])

  const updateCardStatus = async (applicationId: string, status: CardStatus) => {
    const previous = applications
    setApplications((cur) => cur.map((item) => item.application_id === applicationId ? { ...item, application_status: status } : item))
    const result = await updateAlumniCardApplicationStatus(applicationId, STATUS_CODES[status])
    if (result.error) {
      setApplications(previous)
      alert(result.error.message)
    }
  }

  const markCardPaid = async (applicationId: string) => {
    const previous = applications
    const current = previous.find((item) => item.application_id === applicationId)
    setApplications((cur) => cur.map((item) => item.application_id === applicationId ? { ...item, payment_status: 'paid' } : item))
    const result = await updateAlumniCardApplicationStatus(applicationId, STATUS_CODES[current?.application_status ?? 'Queued'], 'paid')
    if (result.error) {
      setApplications(previous)
      alert(result.error.message)
    }
  }

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
            {loading ? <p className="muted">Loading ID card applications...</p> : null}
            <RecordsTable
              items={applications}
              getRowKey={(r) => r.application_id}
              emptyMessage="No ID applications available."
              columns={[
                { header: 'Applicant', render: (r) => <div><strong>{r.full_name}</strong><div className="muted">{r.card_type}</div></div> },
                { header: 'Delivery', render: (r) => r.delivery_method },
                { header: 'Serial', render: (r) => r.card_serial },
                { header: 'Payment', render: (r) => r.payment_status },
                { header: 'Status', render: (r) => <StatusPill label={r.application_status} tone={cardTone(r.application_status)} /> },
              ]}
              actions={(r) => (
                <>
                  {r.application_status === 'Queued' ? <button className="row-action-btn" type="button" onClick={() => updateCardStatus(r.application_id, 'For Printing')}>Queue print</button> : null}
                  {r.application_status === 'For Printing' ? <button className="row-action-btn" type="button" onClick={() => updateCardStatus(r.application_id, 'For Release')}>Mark ready</button> : null}
                  {r.application_status === 'For Release' ? <button className="row-action-btn" type="button" onClick={() => updateCardStatus(r.application_id, 'Completed')}>Complete</button> : null}
                  {r.payment_status !== 'paid' ? <button className="row-action-btn" type="button" onClick={() => markCardPaid(r.application_id)}>Mark paid</button> : null}
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
