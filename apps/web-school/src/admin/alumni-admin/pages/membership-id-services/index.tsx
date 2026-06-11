'use client'

import { useEffect, useState } from 'react'
import { RecordsTable } from '../../components/common/RecordsTable'
import { SectionCard } from '../../components/common/SectionCard'
import { StatusPill } from '../../components/common/StatusPill'
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
  const [statusMessage, setStatusMessage] = useState<{ type: 'error' | 'success'; text: string } | null>(null)

  useEffect(() => {
    setLoading(true)
    getAlumniAdminCardApplications().then((result) => {
      setApplications((result.data ?? []).map(toCardRecord))
      setLoading(false)
    })
  }, [])

  const updateCardStatus = async (applicationId: string, status: CardStatus) => {
    const previous = applications
    setStatusMessage(null)
    setApplications((current) => current.map((record) => record.application_id === applicationId ? { ...record, application_status: status } : record))
    const result = await updateAlumniCardApplicationStatus(applicationId, STATUS_CODES[status])
    if (result.error) {
      setApplications(previous)
      setStatusMessage({ type: 'error', text: result.error.message })
    } else {
      setStatusMessage({ type: 'success', text: `Card status updated to ${status}.` })
    }
  }

  const markCardPaid = async (applicationId: string) => {
    const previous = applications
    const current = previous.find((record) => record.application_id === applicationId)
    setStatusMessage(null)
    setApplications((records) => records.map((record) => record.application_id === applicationId ? { ...record, payment_status: 'paid' } : record))
    const result = await updateAlumniCardApplicationStatus(applicationId, STATUS_CODES[current?.application_status ?? 'Queued'], 'paid')
    if (result.error) {
      setApplications(previous)
      setStatusMessage({ type: 'error', text: result.error.message })
    } else {
      setStatusMessage({ type: 'success', text: 'Card payment marked paid.' })
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
      {statusMessage ? (
        <div className={`rounded-md border px-4 py-3 text-sm font-medium ${statusMessage.type === 'error' ? 'border-red-200 bg-red-50 text-red-700' : 'border-green-200 bg-green-50 text-green-700'}`} role={statusMessage.type === 'error' ? 'alert' : 'status'}>
          {statusMessage.text}
        </div>
      ) : null}

      <section className="summary-grid" aria-label="Membership and ID services summary">
        <article className="summary-card"><strong>{applications.filter((item) => item.application_status === 'Queued').length}</strong><span>Queued ID applications</span></article>
        <article className="summary-card"><strong>{applications.filter((item) => item.application_status === 'For Release').length}</strong><span>Cards ready for release</span></article>
        <article className="summary-card"><strong>{benefits.filter((item) => item.fulfillment_status !== 'Fulfilled').length}</strong><span>Benefit tasks in flight</span></article>
        <article className="summary-card"><strong>{benefits.filter((item) => item.fulfillment_channel === 'Partner Office').length}</strong><span>Partner-fulfilled benefits</span></article>
      </section>

      <div className="dashboard-grid">
        <SectionCard title="ID Card Application Processing" subtitle="Advance applications from queue to printing and final release.">
          {loading ? <p className="muted">Loading ID card applications...</p> : null}
          <RecordsTable
            items={applications}
            getRowKey={(item) => item.application_id}
            emptyMessage="No ID applications available."
            columns={[
              { header: 'Applicant', render: (item) => <div><strong>{item.full_name}</strong><div className="muted">{item.card_type}</div></div> },
              { header: 'Delivery', render: (item) => item.delivery_method },
              { header: 'Serial', render: (item) => item.card_serial },
              { header: 'Payment', render: (item) => item.payment_status },
              { header: 'Status', render: (item) => <StatusPill label={item.application_status} tone={cardTone(item.application_status)} /> },
            ]}
            actions={(item) => (
              <>
                {item.application_status === 'Queued' ? <button className="row-action-btn" type="button" onClick={() => updateCardStatus(item.application_id, 'For Printing')}>Queue print</button> : null}
                {item.application_status === 'For Printing' ? <button className="row-action-btn" type="button" onClick={() => updateCardStatus(item.application_id, 'For Release')}>Mark ready</button> : null}
                {item.application_status === 'For Release' ? <button className="row-action-btn" type="button" onClick={() => updateCardStatus(item.application_id, 'Completed')}>Complete</button> : null}
                {item.payment_status !== 'paid' ? <button className="row-action-btn" type="button" onClick={() => markCardPaid(item.application_id)}>Mark paid</button> : null}
              </>
            )}
          />
        </SectionCard>

        <SectionCard title="Benefit Fulfillment Tracking" subtitle="Monitor delivery of membership-linked benefits and entitlements.">
          <RecordsTable
            items={benefits}
            getRowKey={(item) => item.benefit_id}
            emptyMessage="No benefit fulfillment records available."
            columns={[
              { header: 'Member', render: (item) => <div><strong>{item.full_name}</strong><div className="muted">{item.benefit_name}</div></div> },
              { header: 'Channel', render: (item) => item.fulfillment_channel },
              { header: 'Owner', render: (item) => item.owner },
              { header: 'Status', render: (item) => <StatusPill label={item.fulfillment_status} tone={benefitTone(item.fulfillment_status)} /> },
            ]}
            actions={(item) => (
              <>
                {item.fulfillment_status === 'Pending' ? <button className="row-action-btn" type="button" onClick={() => setBenefits((current) => current.map((record) => record.benefit_id === item.benefit_id ? { ...record, fulfillment_status: 'In Progress' } : record))}>Start</button> : null}
                {item.fulfillment_status !== 'Fulfilled' ? <button className="row-action-btn" type="button" onClick={() => setBenefits((current) => current.map((record) => record.benefit_id === item.benefit_id ? { ...record, fulfillment_status: 'Fulfilled' } : record))}>Fulfill</button> : null}
              </>
            )}
          />
        </SectionCard>
      </div>
    </section>
  )
}
