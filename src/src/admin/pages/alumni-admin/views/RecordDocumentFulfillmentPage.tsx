'use client'

import { useState } from 'react'
import { RecordsTable } from '../../../components/common/RecordsTable'
import { StatusPill } from '../../../components/common/StatusPill'
import {
  deliveryManagementRecords, documentRequestQueue,
  type DeliveryManagementRecord, type DocumentRequestQueueRecord,
} from '../../../data/admin-modules'

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
  const [requests, setRequests] = useState(documentRequestQueue)
  const [deliveries, setDeliveries] = useState(deliveryManagementRecords)

  return (
    <section className="resource-screen">
      <header className="resource-hero">
        <div>
          <h1>Record &amp; Document Fulfillment</h1>
          <p>Operate the request queue and coordinate pick-up or courier release from the same alumni request and graduation context.</p>
        </div>
      </header>

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
            <RecordsTable
              items={requests}
              getRowKey={(r) => r.request_id}
              emptyMessage="No document requests available."
              columns={[
                { header: 'Request', render: (r) => <div><strong>{r.full_name}</strong><div className="muted">{r.document_type}</div></div> },
                { header: 'Purpose', render: (r) => r.purpose },
                { header: 'Assigned Unit', render: (r) => r.assigned_unit },
                { header: 'Release Target', render: (r) => r.target_release_date },
                { header: 'Status', render: (r) => <StatusPill label={r.request_status} tone={requestTone(r.request_status)} /> },
              ]}
              actions={(r) => (
                <>
                  {r.request_status === 'Queued' ? <button className="row-action-btn" type="button" onClick={() => setRequests((cur) => cur.map((x) => x.request_id === r.request_id ? { ...x, request_status: 'In Validation' } : x))}>Validate</button> : null}
                  {r.request_status === 'In Validation' ? <button className="row-action-btn" type="button" onClick={() => setRequests((cur) => cur.map((x) => x.request_id === r.request_id ? { ...x, request_status: 'Ready for Delivery' } : x))}>Mark ready</button> : null}
                  {r.request_status === 'Ready for Delivery' ? <button className="row-action-btn" type="button" onClick={() => setRequests((cur) => cur.map((x) => x.request_id === r.request_id ? { ...x, request_status: 'Completed' } : x))}>Complete</button> : null}
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
                  {r.dispatch_status === 'Pending Schedule' ? <button className="row-action-btn" type="button" onClick={() => setDeliveries((cur) => cur.map((x) => x.delivery_id === r.delivery_id ? { ...x, dispatch_status: 'Ready at Hub' } : x))}>Prepare</button> : null}
                  {r.dispatch_status === 'Ready at Hub' ? <button className="row-action-btn" type="button" onClick={() => setDeliveries((cur) => cur.map((x) => x.delivery_id === r.delivery_id ? { ...x, dispatch_status: 'In Transit' } : x))}>Dispatch</button> : null}
                  {r.dispatch_status === 'In Transit' ? <button className="row-action-btn" type="button" onClick={() => setDeliveries((cur) => cur.map((x) => x.delivery_id === r.delivery_id ? { ...x, dispatch_status: 'Delivered' } : x))}>Confirm</button> : null}
                </>
              )}
            />
          </div>
        </section>
      </div>
    </section>
  )
}

