'use client'

import { useState } from 'react'
import { RecordsTable } from '../../../components/common/RecordsTable'
import { SectionCard } from '../../../components/common/SectionCard'
import { StatusPill } from '../../../components/common/StatusPill'
import {
  activityTrackingRecords,
  notificationEngineRecords,
  type ActivityTrackingRecord,
  type NotificationEngineRecord,
} from '../../../../data/admin-modules'

function notificationTone(status: NotificationEngineRecord['status']) {
  if (status === 'Live') {
    return 'success'
  }

  if (status === 'Scheduled') {
    return 'info'
  }

  if (status === 'Draft') {
    return 'warning'
  }

  return 'neutral'
}

function activityTone(outcome: ActivityTrackingRecord['outcome']) {
  if (outcome === 'Completed') {
    return 'success'
  }

  if (outcome === 'Escalated') {
    return 'danger'
  }

  return 'warning'
}

export function EngagementCommunicationPage() {
  const [campaigns, setCampaigns] = useState(notificationEngineRecords)

  return (
    <section className="resource-screen">
      <header className="resource-hero">
        <div>
          <h1>Engagement &amp; Communication</h1>
          <p>Manage the notification engine and watch service activity across alumni journeys, approvals, and document handling.</p>
        </div>
      </header>

      <section className="summary-grid" aria-label="Engagement and communication summary">
        <article className="summary-card">
          <strong>{campaigns.filter((item) => item.status === 'Scheduled').length}</strong>
          <span>Scheduled campaigns</span>
        </article>
        <article className="summary-card">
          <strong>{campaigns.filter((item) => item.status === 'Live').length}</strong>
          <span>Live notifications</span>
        </article>
        <article className="summary-card">
          <strong>{activityTrackingRecords.filter((item) => item.outcome === 'Waiting').length}</strong>
          <span>Waiting touchpoints</span>
        </article>
        <article className="summary-card">
          <strong>{activityTrackingRecords.filter((item) => item.outcome === 'Escalated').length}</strong>
          <span>Escalations to resolve</span>
        </article>
      </section>

      <div className="dashboard-grid">
        <SectionCard
          title="Notification Engine"
          subtitle="Target communications using academic unit, program, and graduation filters."
        >
          <RecordsTable
            items={campaigns}
            getRowKey={(item) => item.notification_id}
            emptyMessage="No notification campaigns available."
            columns={[
              {
                header: 'Campaign',
                render: (item) => (
                  <div>
                    <strong>{item.campaign_name}</strong>
                    <div className="muted">{item.audience}</div>
                  </div>
                ),
              },
              { header: 'Channel', render: (item) => item.channel },
              { header: 'Audience Filter', render: (item) => `${item.academic_unit} / ${item.graduation_year}` },
              { header: 'Schedule', render: (item) => item.schedule_at },
              {
                header: 'Status',
                render: (item) => <StatusPill label={item.status} tone={notificationTone(item.status)} />,
              },
            ]}
            actions={(item) => (
              <>
                {item.status === 'Draft' ? (
                  <button
                    className="row-action-btn"
                    type="button"
                    onClick={() => {
                      setCampaigns((current) =>
                        current.map((record) =>
                          record.notification_id === item.notification_id ? { ...record, status: 'Scheduled' } : record,
                        ),
                      )
                    }}
                  >
                    Schedule
                  </button>
                ) : null}
                {item.status === 'Scheduled' ? (
                  <button
                    className="row-action-btn"
                    type="button"
                    onClick={() => {
                      setCampaigns((current) =>
                        current.map((record) =>
                          record.notification_id === item.notification_id ? { ...record, status: 'Live' } : record,
                        ),
                      )
                    }}
                  >
                    Launch
                  </button>
                ) : null}
                {item.status === 'Live' ? (
                  <button
                    className="row-action-btn"
                    type="button"
                    onClick={() => {
                      setCampaigns((current) =>
                        current.map((record) =>
                          record.notification_id === item.notification_id ? { ...record, status: 'Archived' } : record,
                        ),
                      )
                    }}
                  >
                    Archive
                  </button>
                ) : null}
              </>
            )}
          />
        </SectionCard>

        <SectionCard
          title="Activity Tracking Dashboard"
          subtitle="Monitor operational touchpoints across clearance, registry, services, and privacy workflows."
        >
          <RecordsTable
            items={activityTrackingRecords}
            getRowKey={(item) => item.activity_id}
            emptyMessage="No tracked activity available."
            columns={[
              {
                header: 'Activity',
                render: (item) => (
                  <div>
                    <strong>{item.full_name}</strong>
                    <div className="muted">{item.event_name}</div>
                  </div>
                ),
              },
              { header: 'Touchpoint', render: (item) => item.touchpoint },
              { header: 'Academic Unit', render: (item) => item.academic_unit ?? 'Unspecified' },
              { header: 'When', render: (item) => item.event_time },
              {
                header: 'Outcome',
                render: (item) => <StatusPill label={item.outcome} tone={activityTone(item.outcome)} />,
              },
            ]}
          />
        </SectionCard>
      </div>
    </section>
  )
}
