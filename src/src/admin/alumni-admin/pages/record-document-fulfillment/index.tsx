'use client'

import { useState } from 'react'
import { RecordsTable } from '../../../components/common/RecordsTable'
import { SectionCard } from '../../../components/common/SectionCard'
import { StatusPill } from '../../../components/common/StatusPill'
import {
  deliveryManagementRecords,
  documentRequestQueue,
  type DeliveryManagementRecord,
  type DocumentRequestQueueRecord,
} from '../../../../data/admin-modules'

function requestTone(status: DocumentRequestQueueRecord['request_status']) {
  if (status === 'Completed') {
    return 'success'
  }

  if (status === 'Ready for Delivery') {
    return 'info'
  }

  if (status === 'On Hold') {
    return 'danger'
  }

  return 'warning'
}

function deliveryTone(status: DeliveryManagementRecord['dispatch_status']) {
  if (status === 'Delivered') {
    return 'success'
  }

  if (status === 'In Transit') {
    return 'info'
  }

  if (status === 'Pending Schedule') {
    return 'warning'
  }

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
        <article className="summary-card">
          <strong>{requests.filter((item) => item.request_status === 'Queued').length}</strong>
          <span>Queued requests</span>
        </article>
        <article className="summary-card">
          <strong>{requests.filter((item) => item.request_status === 'Ready for Delivery').length}</strong>
          <span>Ready for release</span>
        </article>
        <article className="summary-card">
          <strong>{deliveries.filter((item) => item.delivery_method === 'Courier').length}</strong>
          <span>Courier deliveries</span>
        </article>
        <article className="summary-card">
          <strong>{deliveries.filter((item) => item.dispatch_status === 'In Transit').length}</strong>
          <span>Active dispatches</span>
        </article>
      </section>

      <div className="dashboard-grid">
        <SectionCard
          title="Request Processing Queue"
          subtitle="Validate records, assign units, and move requests toward fulfillment."
        >
          <RecordsTable
            items={requests}
            getRowKey={(item) => item.request_id}
            emptyMessage="No document requests available."
            columns={[
              {
                header: 'Request',
                render: (item) => (
                  <div>
                    <strong>{item.full_name}</strong>
                    <div className="muted">{item.document_type}</div>
                  </div>
                ),
              },
              { header: 'Purpose', render: (item) => item.purpose },
              { header: 'Assigned Unit', render: (item) => item.assigned_unit },
              { header: 'Release Target', render: (item) => item.target_release_date },
              {
                header: 'Status',
                render: (item) => <StatusPill label={item.request_status} tone={requestTone(item.request_status)} />,
              },
            ]}
            actions={(item) => (
              <>
                {item.request_status === 'Queued' ? (
                  <button
                    className="row-action-btn"
                    type="button"
                    onClick={() => {
                      setRequests((current) =>
                        current.map((record) =>
                          record.request_id === item.request_id
                            ? { ...record, request_status: 'In Validation' }
                            : record,
                        ),
                      )
                    }}
                  >
                    Validate
                  </button>
                ) : null}
                {item.request_status === 'In Validation' ? (
                  <button
                    className="row-action-btn"
                    type="button"
                    onClick={() => {
                      setRequests((current) =>
                        current.map((record) =>
                          record.request_id === item.request_id
                            ? { ...record, request_status: 'Ready for Delivery' }
                            : record,
                        ),
                      )
                    }}
                  >
                    Mark ready
                  </button>
                ) : null}
                {item.request_status === 'Ready for Delivery' ? (
                  <button
                    className="row-action-btn"
                    type="button"
                    onClick={() => {
                      setRequests((current) =>
                        current.map((record) =>
                          record.request_id === item.request_id
                            ? { ...record, request_status: 'Completed' }
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
          title="Delivery Management"
          subtitle="Coordinate handoff for pick-up and courier fulfillment."
        >
          <RecordsTable
            items={deliveries}
            getRowKey={(item) => item.delivery_id}
            emptyMessage="No delivery records available."
            columns={[
              {
                header: 'Delivery',
                render: (item) => (
                  <div>
                    <strong>{item.full_name}</strong>
                    <div className="muted">{item.delivery_method}</div>
                  </div>
                ),
              },
              { header: 'Request ID', render: (item) => item.request_id },
              { header: 'Release Point', render: (item) => item.release_point },
              { header: 'Tracking', render: (item) => item.tracking_reference },
              {
                header: 'Dispatch',
                render: (item) => <StatusPill label={item.dispatch_status} tone={deliveryTone(item.dispatch_status)} />,
              },
            ]}
            actions={(item) => (
              <>
                {item.dispatch_status === 'Pending Schedule' ? (
                  <button
                    className="row-action-btn"
                    type="button"
                    onClick={() => {
                      setDeliveries((current) =>
                        current.map((record) =>
                          record.delivery_id === item.delivery_id
                            ? { ...record, dispatch_status: 'Ready at Hub' }
                            : record,
                        ),
                      )
                    }}
                  >
                    Prepare
                  </button>
                ) : null}
                {item.dispatch_status === 'Ready at Hub' ? (
                  <button
                    className="row-action-btn"
                    type="button"
                    onClick={() => {
                      setDeliveries((current) =>
                        current.map((record) =>
                          record.delivery_id === item.delivery_id
                            ? { ...record, dispatch_status: 'In Transit' }
                            : record,
                        ),
                      )
                    }}
                  >
                    Dispatch
                  </button>
                ) : null}
                {item.dispatch_status === 'In Transit' ? (
                  <button
                    className="row-action-btn"
                    type="button"
                    onClick={() => {
                      setDeliveries((current) =>
                        current.map((record) =>
                          record.delivery_id === item.delivery_id
                            ? { ...record, dispatch_status: 'Delivered' }
                            : record,
                        ),
                      )
                    }}
                  >
                    Confirm
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
