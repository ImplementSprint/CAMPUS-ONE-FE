'use client'

import { useState } from 'react'
import { RecordsTable } from '../../../components/common/RecordsTable'
import { StatusPill } from '../../../components/common/StatusPill'
import {
  activityTrackingRecords, notificationEngineRecords,
  type ActivityTrackingRecord, type NotificationEngineRecord,
} from '../../../data/admin-modules'

function notificationTone(status: NotificationEngineRecord['status']) {
  if (status === 'Live') return 'success'
  if (status === 'Scheduled') return 'info'
  if (status === 'Draft') return 'warning'
  return 'neutral'
}

function activityTone(outcome: ActivityTrackingRecord['outcome']) {
  if (outcome === 'Completed') return 'success'
  if (outcome === 'Escalated') return 'danger'
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
        <article className="summary-card"><strong>{campaigns.filter((r) => r.status === 'Scheduled').length}</strong><span>Scheduled campaigns</span></article>
        <article className="summary-card"><strong>{campaigns.filter((r) => r.status === 'Live').length}</strong><span>Live notifications</span></article>
        <article className="summary-card"><strong>{activityTrackingRecords.filter((r) => r.outcome === 'Waiting').length}</strong><span>Waiting touchpoints</span></article>
        <article className="summary-card"><strong>{activityTrackingRecords.filter((r) => r.outcome === 'Escalated').length}</strong><span>Escalations to resolve</span></article>
      </section>

      <div className="dashboard-grid">
        <section className="section-card">
          <header className="section-card-head"><div><h2>Notification Engine</h2><p>Target communications using academic unit, program, and graduation filters.</p></div></header>
          <div>
            <RecordsTable
              items={campaigns}
              getRowKey={(r) => r.notification_id}
              emptyMessage="No notification campaigns available."
              columns={[
                { header: 'Campaign', render: (r) => <div><strong>{r.campaign_name}</strong><div className="muted">{r.audience}</div></div> },
                { header: 'Channel', render: (r) => r.channel },
                { header: 'Audience Filter', render: (r) => `${r.academic_unit} / ${r.graduation_year}` },
                { header: 'Schedule', render: (r) => r.schedule_at },
                { header: 'Status', render: (r) => <StatusPill label={r.status} tone={notificationTone(r.status)} /> },
              ]}
              actions={(r) => (
                <>
                  {r.status === 'Draft' ? <button className="row-action-btn" type="button" onClick={() => setCampaigns((cur) => cur.map((x) => x.notification_id === r.notification_id ? { ...x, status: 'Scheduled' } : x))}>Schedule</button> : null}
                  {r.status === 'Scheduled' ? <button className="row-action-btn" type="button" onClick={() => setCampaigns((cur) => cur.map((x) => x.notification_id === r.notification_id ? { ...x, status: 'Live' } : x))}>Launch</button> : null}
                  {r.status === 'Live' ? <button className="row-action-btn" type="button" onClick={() => setCampaigns((cur) => cur.map((x) => x.notification_id === r.notification_id ? { ...x, status: 'Archived' } : x))}>Archive</button> : null}
                </>
              )}
            />
          </div>
        </section>

        <section className="section-card">
          <header className="section-card-head"><div><h2>Activity Tracking Dashboard</h2><p>Monitor operational touchpoints across clearance, registry, services, and privacy workflows.</p></div></header>
          <div>
            <RecordsTable
              items={activityTrackingRecords}
              getRowKey={(r) => r.activity_id}
              emptyMessage="No tracked activity available."
              columns={[
                { header: 'Activity', render: (r) => <div><strong>{r.full_name}</strong><div className="muted">{r.event_name}</div></div> },
                { header: 'Touchpoint', render: (r) => r.touchpoint },
                { header: 'Academic Unit', render: (r) => r.academic_unit ?? 'Unspecified' },
                { header: 'When', render: (r) => r.event_time },
                { header: 'Outcome', render: (r) => <StatusPill label={r.outcome} tone={activityTone(r.outcome)} /> },
              ]}
            />
          </div>
        </section>
      </div>
    </section>
  )
}

