'use client'

import { useEffect, useMemo, useState } from 'react'
import { RecordsTable } from '../../../components/common/RecordsTable'
import { StatusPill } from '../../../components/common/StatusPill'
import {
  getAlumniAdminRecordRequests,
  updateAlumniRecordRequestStatus,
  type AlumniRecordRequest,
} from '@/app/alumni/services/alumni.service'

type RequestStatus = 'Queued' | 'In Validation' | 'Ready for Delivery' | 'Completed' | 'On Hold'

type DocumentRequestQueueRecord = {
  request_id: string
  document_type: string
  purpose: string
  copies: number
  delivery_method: string
  fee_amount: number | null
  payment_status: string
  full_name: string
  request_status: RequestStatus
  assigned_unit: string
  requested_at: string
  target_release_date: string
}

type DeliveryManagementRecord = {
  delivery_id: string
  request_id: string
  full_name: string
  delivery_method: string
  release_point: string
  tracking_reference: string
  dispatch_status: 'Pending Schedule' | 'Ready at Hub' | 'In Transit' | 'Delivered'
}

const STATUS_CODES: Record<RequestStatus, number> = {
  Queued: 100,
  'In Validation': 200,
  'Ready for Delivery': 300,
  Completed: 400,
  'On Hold': 900,
}

function statusFromCode(statusCode: number): RequestStatus {
  if (statusCode >= 900) return 'On Hold'
  if (statusCode >= 400) return 'Completed'
  if (statusCode >= 300) return 'Ready for Delivery'
  if (statusCode >= 200) return 'In Validation'
  return 'Queued'
}

function documentLabel(type: AlumniRecordRequest['document_type']) {
  switch (type) {
    case 'TOR': return 'Transcript of Records'
    case 'DIPLOMA': return 'Diploma'
    case 'GOOD_MORAL': return 'Good Moral Certificate'
    case 'CERTIFICATE': return 'Certificate of Graduation'
    default: return type
  }
}

function toQueueRecord(record: AlumniRecordRequest): DocumentRequestQueueRecord {
  const requestedAt = new Date(record.created_at)
  const target = new Date(requestedAt)
  target.setDate(target.getDate() + 7)

  return {
    request_id: record.log_id,
    document_type: documentLabel(record.document_type),
    purpose: record.notes || 'Official records request',
    copies: record.number_of_copies ?? 1,
    delivery_method: record.delivery_method === 'courier' ? 'Courier' : 'Pickup',
    fee_amount: record.fee_amount ?? null,
    payment_status: record.payment_status ?? 'pending',
    full_name: record.actor_uuid,
    request_status: statusFromCode(record.status_code),
    assigned_unit: 'Records Office',
    requested_at: requestedAt.toLocaleDateString(),
    target_release_date: target.toLocaleDateString(),
  }
}

function requestTone(status: DocumentRequestQueueRecord['request_status']) {
  if (status === 'Completed') return 'success'
  if (status === 'Ready for Delivery') return 'info'
  if (status === 'On Hold') return 'danger'
  return 'warning'
}

function deliveryTone(status: DeliveryManagementRecord['dispatch_status']) {
  if (status === 'Delivered') return 'success'
  if (status === 'In Transit') return 'info'
  if (status === 'Pending Schedule') return 'warning'
  return 'neutral'
}

export function RecordDocumentFulfillmentPage() {
  const [requests, setRequests] = useState<DocumentRequestQueueRecord[]>([])
  const [loading, setLoading] = useState(true)
  const [statusMessage, setStatusMessage] = useState<{ type: 'error' | 'success'; text: string } | null>(null)

  const deliveries = useMemo<DeliveryManagementRecord[]>(() => (
    requests
      .filter((request) => request.delivery_method === 'Courier')
      .map((request) => ({
        delivery_id: `DLV-${request.request_id}`,
        request_id: request.request_id,
        full_name: request.full_name,
        delivery_method: request.delivery_method,
        release_point: 'Records Dispatch',
        tracking_reference: request.request_status === 'Completed' ? 'Delivered' : 'Pending assignment',
        dispatch_status: request.request_status === 'Completed' ? 'Delivered' : request.request_status === 'Ready for Delivery' ? 'Ready at Hub' : 'Pending Schedule',
      }))
  ), [requests])

  useEffect(() => {
    setLoading(true)
    getAlumniAdminRecordRequests().then((result) => {
      setRequests((result.data ?? []).map(toQueueRecord))
      setLoading(false)
    })
  }, [])

  const updateRequestStatus = async (requestId: string, status: RequestStatus) => {
    const previous = requests
    setStatusMessage(null)
    setRequests((cur) => cur.map((request) => request.request_id === requestId ? { ...request, request_status: status } : request))
    const result = await updateAlumniRecordRequestStatus(requestId, STATUS_CODES[status])
    if (result.error) {
      setRequests(previous)
      setStatusMessage({ type: 'error', text: result.error.message })
    } else {
      setStatusMessage({ type: 'success', text: `Request status updated to ${status}.` })
    }
  }

  const updatePaymentStatus = async (requestId: string, paymentStatus: 'pending' | 'paid') => {
    const previous = requests
    setStatusMessage(null)
    setRequests((cur) => cur.map((request) => request.request_id === requestId ? { ...request, payment_status: paymentStatus } : request))
    const current = previous.find((request) => request.request_id === requestId)
    const result = await updateAlumniRecordRequestStatus(requestId, STATUS_CODES[current?.request_status ?? 'Queued'], paymentStatus)
    if (result.error) {
      setRequests(previous)
      setStatusMessage({ type: 'error', text: result.error.message })
    } else {
      setStatusMessage({ type: 'success', text: `Payment status updated to ${paymentStatus}.` })
    }
  }

  return (
    <section className="resource-screen">
      <header className="resource-hero">
        <div>
          <h1>Record &amp; Document Fulfillment</h1>
          <p>Operate the request queue and coordinate pick-up or courier release from the same alumni request and graduation context.</p>
        </div>
      </header>
      {statusMessage ? (
        <div className={`rounded-md border px-4 py-3 text-sm font-medium ${statusMessage.type === 'error' ? 'border-red-200 bg-red-50 text-red-700' : 'border-green-200 bg-green-50 text-green-700'}`} role={statusMessage.type === 'error' ? 'alert' : 'status'}>
          {statusMessage.text}
        </div>
      ) : null}

      <section className="summary-grid" aria-label="Record and document fulfillment summary">
        <article className="summary-card"><strong>{requests.filter((r) => r.request_status === 'Queued').length}</strong><span>Queued requests</span></article>
        <article className="summary-card"><strong>{requests.filter((r) => r.request_status === 'Ready for Delivery').length}</strong><span>Ready for release</span></article>
        <article className="summary-card"><strong>{deliveries.filter((r) => r.delivery_method === 'Courier').length}</strong><span>Courier deliveries</span></article>
        <article className="summary-card"><strong>{deliveries.filter((r) => r.dispatch_status === 'In Transit').length}</strong><span>Active dispatches</span></article>
      </section>

      <div className="dashboard-grid">
        <section className="section-card">
          <header className="section-card-head"><div><h2>Request Processing Queue</h2><p>Validate records, assign units, and move requests toward fulfillment.</p></div></header>
          <div>
            {loading ? <p className="muted">Loading document requests...</p> : null}
            <RecordsTable
              items={requests}
              getRowKey={(r) => r.request_id}
              emptyMessage="No document requests available."
              columns={[
                { header: 'Request', render: (r) => <div><strong>{r.full_name}</strong><div className="muted">{r.document_type}</div></div> },
                { header: 'Purpose', render: (r) => r.purpose },
                { header: 'Payment', render: (r) => <div><strong>{r.fee_amount != null ? `PHP ${r.fee_amount}` : 'TBD'}</strong><div className="muted">{r.payment_status}</div></div> },
                { header: 'Assigned Unit', render: (r) => r.assigned_unit },
                { header: 'Release Target', render: (r) => r.target_release_date },
                { header: 'Status', render: (r) => <StatusPill label={r.request_status} tone={requestTone(r.request_status)} /> },
              ]}
              actions={(r) => (
                <>
                  {r.request_status === 'Queued' ? <button className="row-action-btn" type="button" onClick={() => updateRequestStatus(r.request_id, 'In Validation')}>Validate</button> : null}
                  {r.request_status === 'In Validation' ? <button className="row-action-btn" type="button" onClick={() => updateRequestStatus(r.request_id, 'Ready for Delivery')}>Mark ready</button> : null}
                  {r.request_status === 'Ready for Delivery' ? <button className="row-action-btn" type="button" onClick={() => updateRequestStatus(r.request_id, 'Completed')}>Complete</button> : null}
                  {r.payment_status !== 'paid' ? <button className="row-action-btn" type="button" onClick={() => updatePaymentStatus(r.request_id, 'paid')}>Mark paid</button> : null}
                </>
              )}
            />
          </div>
        </section>

        <section className="section-card">
          <header className="section-card-head"><div><h2>Delivery Management</h2><p>Coordinate handoff for pick-up and courier fulfillment.</p></div></header>
          <div>
            <RecordsTable
              items={deliveries}
              getRowKey={(r) => r.delivery_id}
              emptyMessage="No delivery records available."
              columns={[
                { header: 'Delivery', render: (r) => <div><strong>{r.full_name}</strong><div className="muted">{r.delivery_method}</div></div> },
                { header: 'Request ID', render: (r) => r.request_id },
                { header: 'Release Point', render: (r) => r.release_point },
                { header: 'Tracking', render: (r) => r.tracking_reference },
                { header: 'Dispatch', render: (r) => <StatusPill label={r.dispatch_status} tone={deliveryTone(r.dispatch_status)} /> },
              ]}
              actions={(r) => (
                <>
                  {r.dispatch_status === 'Pending Schedule' ? <button className="row-action-btn" type="button" onClick={() => updateRequestStatus(r.request_id, 'Ready for Delivery')}>Prepare</button> : null}
                  {r.dispatch_status === 'Ready at Hub' ? <button className="row-action-btn" type="button" onClick={() => updateRequestStatus(r.request_id, 'Completed')}>Confirm</button> : null}
                </>
              )}
            />
          </div>
        </section>
      </div>
    </section>
  )
}

