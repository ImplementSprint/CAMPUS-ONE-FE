'use client';

import { useState } from 'react';
import {
  clearanceRecords, registryRecords, idCardApplications,
  documentRequestQueue, privacyComplianceRecords, dataDownloadRequests,
  activityTrackingRecords, notificationEngineRecords,
} from '../../data/admin-modules';
import { GraduateExitOnboardingPage } from './views/GraduateExitOnboardingPage';
import { MembershipIdServicesPage } from './views/MembershipIdServicesPage';
import { RecordDocumentFulfillmentPage } from './views/RecordDocumentFulfillmentPage';
import { EngagementCommunicationPage } from './views/EngagementCommunicationPage';
import { DataGovernancePrivacyPage } from './views/DataGovernancePrivacyPage';

type Module =
  | 'dashboard'
  | 'graduate-exit'
  | 'membership-id'
  | 'record-document'
  | 'engagement'
  | 'data-governance';

const NAV: { id: Module; label: string; icon: string }[] = [
  { id: 'dashboard',        label: 'Dashboard',                    icon: 'ðŸ ' },
  { id: 'graduate-exit',    label: 'Graduate Exit & Onboarding',   icon: 'ðŸŽ“' },
  { id: 'membership-id',    label: 'Membership & ID Services',     icon: 'ðŸªª' },
  { id: 'record-document',  label: 'Record & Document Fulfillment',icon: 'ðŸ“„' },
  { id: 'engagement',       label: 'Engagement & Communication',   icon: 'ðŸ“£' },
  { id: 'data-governance',  label: 'Data Governance & Privacy',    icon: 'ðŸ”’' },
];

// â”€â”€â”€ Dashboard landing page â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
function DashboardHome({ onNavigate }: { onNavigate: (m: Module) => void }) {
  const pendingClearance   = clearanceRecords.filter((r) => r.status !== 'Released').length;
  const activeMembers      = registryRecords.filter((r) => r.member_status === 'Active Member').length;
  const openServiceWork    = idCardApplications.filter((r) => r.application_status !== 'Completed').length +
                             documentRequestQueue.filter((r) => r.request_status !== 'Completed').length;
  const privacyItems       = privacyComplianceRecords.filter((r) => r.status !== 'Compliant').length +
                             dataDownloadRequests.filter((r) => r.request_status !== 'Delivered').length;

  const moduleCards = [
    { id: 'graduate-exit'   as Module, title: 'Graduate Exit & Onboarding',    description: 'Clearance approvals and member registry governance.' },
    { id: 'membership-id'   as Module, title: 'Membership & ID Services',       description: 'ID application handling and benefit fulfillment tracking.' },
    { id: 'record-document' as Module, title: 'Record & Document Fulfillment',  description: 'Request queue operations and release logistics.' },
    { id: 'engagement'      as Module, title: 'Engagement & Communication',     description: 'Notification engine controls and activity analytics.' },
    { id: 'data-governance' as Module, title: 'Data Governance & Privacy',      description: 'Compliance review and data export fulfillment.' },
  ];

  return (
    <section className="dashboard-screen">
      <header className="dashboard-hero">
        <div>
          <h2>Alumni Admin Operations</h2>
          <p>Five-module admin workspace aligned to alumni registration, profile, card, record request, and graduation verification fields.</p>
        </div>
      </header>

      <section className="dashboard-stats" aria-label="Operations summary">
        <article className="dashboard-stat">
          <strong className="tone-blue">{activeMembers}</strong>
          <span>Active registry members</span>
        </article>
        <article className="dashboard-stat">
          <strong className="tone-amber">{pendingClearance}</strong>
          <span>Exit approvals in progress</span>
        </article>
        <article className="dashboard-stat">
          <strong className="tone-green">{openServiceWork}</strong>
          <span>ID and document tasks open</span>
        </article>
        <article className="dashboard-stat">
          <strong className="tone-violet">{privacyItems}</strong>
          <span>Privacy actions pending</span>
        </article>
      </section>

      <section className="module-card-grid" aria-label="Admin modules">
        {moduleCards.map((card) => (
          <button
            key={card.id}
            id={`module-${card.id}`}
            className="module-card"
            type="button"
            onClick={() => onNavigate(card.id)}
          >
            <strong>{card.title}</strong>
            <span>{card.description}</span>
          </button>
        ))}
      </section>

      <section className="admin-section" style={{ marginTop: '2rem' }}>
        <h3 style={{ color: '#F5A623', fontSize: 13, marginBottom: 12 }}>Recent Activity</h3>
        <div className="admin-notif-list">
          {activityTrackingRecords.map((r) => (
            <div key={r.activity_id} className={`admin-notif-item ${r.outcome === 'Escalated' ? 'admin-notif--warning' : r.outcome === 'Completed' ? 'admin-notif--success' : 'admin-notif--info'}`}>
              <div className="admin-notif-icon">{r.outcome === 'Escalated' ? 'âš ï¸' : r.outcome === 'Completed' ? 'âœ…' : 'â³'}</div>
              <div>
                <div className="admin-notif-title">{r.full_name}</div>
                <div className="admin-notif-body">{r.event_name} â€” {r.touchpoint}</div>
                <div className="admin-notif-time">{r.event_time}</div>
              </div>
            </div>
          ))}
          {notificationEngineRecords.filter((r) => r.status === 'Live').map((r) => (
            <div key={r.notification_id} className="admin-notif-item admin-notif--info">
              <div className="admin-notif-icon">ðŸ“£</div>
              <div>
                <div className="admin-notif-title">{r.campaign_name}</div>
                <div className="admin-notif-body">{r.audience} â€” {r.channel}</div>
                <div className="admin-notif-time">{r.schedule_at}</div>
              </div>
            </div>
          ))}
        </div>
      </section>

      <style>{moduleStyles}</style>
    </section>
  );
}

// â”€â”€â”€ Main dashboard shell â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
export default function AlumniAdminPage() {
  const [activeModule, setActiveModule] = useState<Module>('dashboard');

  return (
    <main className="admin-page">
      <aside className="admin-sidebar">
        <div className="admin-logo">
          <span className="admin-logo-mark">AA</span>
          <span className="admin-logo-text">Alumni Admin</span>
        </div>
        <nav className="admin-nav">
          {NAV.map(({ id, label, icon }) => (
            <button
              key={id}
              id={`nav-${id}`}
              className={`admin-nav-item ${activeModule === id ? 'active' : ''}`}
              type="button"
              onClick={() => setActiveModule(id)}
            >
              {icon} {label}
            </button>
          ))}
        </nav>
        <div className="admin-sidebar-footer">
          <div className="admin-avatar">AA</div>
          <div>
            <div className="admin-name">Alumni Admin</div>
            <div className="admin-role">alumni_admin</div>
          </div>
        </div>
      </aside>

      <div className="admin-content">
        {activeModule === 'dashboard'        && <DashboardHome onNavigate={setActiveModule} />}
        {activeModule === 'graduate-exit'    && <GraduateExitOnboardingPage />}
        {activeModule === 'membership-id'    && <MembershipIdServicesPage />}
        {activeModule === 'record-document'  && <RecordDocumentFulfillmentPage />}
        {activeModule === 'engagement'       && <EngagementCommunicationPage />}
        {activeModule === 'data-governance'  && <DataGovernancePrivacyPage />}
      </div>

      <style>{adminStyles}</style>
    </main>
  );
}

// â”€â”€â”€ Styles â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
const moduleStyles = `
  .module-card-grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(240px, 1fr)); gap: 16px; margin-top: 28px; }
  .module-card { background: #111; border: 1.5px solid #1f1f1f; border-radius: 14px; padding: 20px 22px; text-align: left; cursor: pointer; display: flex; flex-direction: column; gap: 8px; transition: all 0.15s; font-family: 'Inter', sans-serif; }
  .module-card:hover { border-color: #F5A623; background: rgba(245,166,35,0.05); }
  .module-card strong { font-size: 14px; font-weight: 700; color: #fff; }
  .module-card span { font-size: 12px; color: #888; line-height: 1.5; }
  .dashboard-stats { display: flex; gap: 20px; margin: 28px 0 0; flex-wrap: wrap; }
  .dashboard-stat { background: #111; border: 1px solid #1f1f1f; border-radius: 12px; padding: 16px 20px; display: flex; flex-direction: column; gap: 4px; }
  .dashboard-stat strong { font-size: 28px; font-weight: 800; }
  .dashboard-stat span { font-size: 12px; color: #888; }
  .tone-blue { color: #38bdf8; } .tone-amber { color: #F5A623; } .tone-green { color: #4ade80; } .tone-violet { color: #a78bfa; }
`;

const adminStyles = `
  @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&display=swap');
  .admin-page { display: flex; min-height: 100vh; background: #0a0a0a; font-family: 'Inter', sans-serif; color: #fff; }
  .admin-sidebar { width: 256px; background: #111; border-right: 1px solid #1f1f1f; display: flex; flex-direction: column; padding: 24px 0; flex-shrink: 0; }
  .admin-logo { display: flex; align-items: center; gap: 10px; padding: 0 20px 28px; border-bottom: 1px solid #1f1f1f; margin-bottom: 16px; }
  .admin-logo-mark { background: #F5A623; color: #111; font-weight: 800; font-size: 14px; border-radius: 8px; padding: 6px 10px; }
  .admin-logo-text { font-weight: 700; font-size: 15px; color: #fff; }
  .admin-nav { flex: 1; display: flex; flex-direction: column; gap: 4px; padding: 0 12px; }
  .admin-nav-item { display: flex; align-items: center; gap: 10px; padding: 10px 12px; background: none; border: none; border-radius: 10px; color: #888; font-size: 12px; font-weight: 500; cursor: pointer; font-family: 'Inter', sans-serif; text-align: left; transition: all 0.15s; white-space: nowrap; overflow: hidden; }
  .admin-nav-item:hover { background: #1a1a1a; color: #fff; }
  .admin-nav-item.active { background: rgba(245,166,35,0.12); color: #F5A623; font-weight: 600; }
  .admin-sidebar-footer { padding: 20px; border-top: 1px solid #1f1f1f; display: flex; align-items: center; gap: 10px; }
  .admin-avatar { width: 36px; height: 36px; background: #F5A623; border-radius: 50%; display: flex; align-items: center; justify-content: center; font-weight: 800; font-size: 12px; color: #111; flex-shrink: 0; }
  .admin-name { font-size: 13px; font-weight: 600; color: #fff; }
  .admin-role { font-size: 11px; color: #F5A623; }
  .admin-content { flex: 1; overflow-y: auto; padding: 28px 32px; }
  .dashboard-screen { max-width: 1100px; }
  .dashboard-hero { margin-bottom: 8px; }
  .dashboard-hero h2 { font-size: 22px; font-weight: 800; margin: 0 0 6px; }
  .dashboard-hero p { font-size: 13px; color: #888; margin: 0; }
  .resource-screen { max-width: 1100px; }
  .resource-hero { margin-bottom: 24px; }
  .resource-hero h1 { font-size: 20px; font-weight: 800; margin: 0 0 6px; }
  .resource-hero p { font-size: 13px; color: #888; margin: 0; }
  .summary-grid { display: grid; grid-template-columns: repeat(4, 1fr); gap: 14px; margin-bottom: 24px; }
  .summary-card { background: #111; border: 1px solid #1f1f1f; border-radius: 12px; padding: 16px 18px; display: flex; flex-direction: column; gap: 4px; }
  .summary-card strong { font-size: 26px; font-weight: 800; color: #F5A623; }
  .summary-card span { font-size: 11px; color: #888; }
  .dashboard-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 20px; }
  .section-card { background: #111; border: 1px solid #1f1f1f; border-radius: 14px; overflow: hidden; }
  .section-card-head { padding: 18px 20px; border-bottom: 1px solid #1f1f1f; }
  .section-card-head h2 { font-size: 14px; font-weight: 700; margin: 0 0 4px; color: #fff; }
  .section-card-head p { font-size: 12px; color: #888; margin: 0; }
  .resource-table-wrap { overflow-x: auto; }
  .resource-table { width: 100%; border-collapse: collapse; font-size: 12px; }
  .resource-table th { background: #0f0f0f; color: #666; font-weight: 600; padding: 10px 14px; text-align: left; font-size: 11px; text-transform: uppercase; letter-spacing: 0.05em; }
  .resource-table td { padding: 12px 14px; border-top: 1px solid #1a1a1a; color: #ccc; vertical-align: middle; }
  .resource-table tr:hover td { background: #0f0f0f; }
  .muted { font-size: 11px; color: #666; margin-top: 2px; }
  .empty-state { padding: 32px; text-align: center; color: #666; font-size: 13px; }
  .row-actions { display: flex; gap: 6px; flex-wrap: wrap; }
  .row-action-btn { background: rgba(245,166,35,0.1); border: 1px solid rgba(245,166,35,0.2); border-radius: 6px; color: #F5A623; font-size: 11px; font-weight: 600; padding: 4px 10px; cursor: pointer; font-family: 'Inter', sans-serif; transition: all 0.15s; }
  .row-action-btn:hover { background: rgba(245,166,35,0.2); }
  .status-pill { display: inline-flex; align-items: center; font-size: 11px; font-weight: 600; padding: 3px 9px; border-radius: 20px; }
  .status-pill.success { background: rgba(34,197,94,0.12); color: #4ade80; }
  .status-pill.warning { background: rgba(245,166,35,0.12); color: #F5A623; }
  .status-pill.info    { background: rgba(14,165,233,0.12); color: #38bdf8; }
  .status-pill.danger  { background: rgba(239,68,68,0.12); color: #f87171; }
  .status-pill.neutral { background: rgba(156,163,175,0.12); color: #9ca3af; }
  .admin-notif-list { display: flex; flex-direction: column; gap: 10px; }
  .admin-notif-item { display: flex; gap: 14px; padding: 14px 18px; border-radius: 12px; border: 1px solid #1f1f1f; align-items: flex-start; }
  .admin-notif--info { background: rgba(14,165,233,0.05); border-color: rgba(14,165,233,0.15); }
  .admin-notif--warning { background: rgba(245,166,35,0.05); border-color: rgba(245,166,35,0.15); }
  .admin-notif--success { background: rgba(34,197,94,0.05); border-color: rgba(34,197,94,0.15); }
  .admin-notif-icon { font-size: 20px; }
  .admin-notif-title { font-size: 13px; font-weight: 700; color: #fff; margin-bottom: 3px; }
  .admin-notif-body { font-size: 11px; color: #888; line-height: 1.5; margin-bottom: 4px; }
  .admin-notif-time { font-size: 10px; color: #666; }
  .admin-section { padding: 0; }
`;

