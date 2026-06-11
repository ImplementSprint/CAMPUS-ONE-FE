'use client';

import React, { useState } from 'react';

type AlumniRecord = {
  log_id: string;
  actor_uuid: string;
  full_name: string;
  email: string;
  graduation_year: number;
  academic_unit: string;
  program: string;
  is_legacy_registration: boolean;
  action_type: string;
  status_code: number;
  created_at: string;
};

type RecordRequest = {
  log_id: string;
  actor_uuid: string;
  document_type: string;
  fee_amount: number;
  payment_status: string;
  created_at: string;
};

type Tab = 'registrations' | 'records' | 'notifications';

// ─── Mock data for demo ───────────────────────────────────────────────────────
const MOCK_ALUMNI: AlumniRecord[] = [
  { log_id: '1', actor_uuid: 'uuid-001', full_name: 'Juan dela Cruz', email: 'juan@example.com', graduation_year: 2023, academic_unit: 'College of Information and Computing Sciences', program: 'BS Information Systems', is_legacy_registration: false, action_type: 'alumni.registration.submitted.v1', status_code: 100, created_at: new Date().toISOString() },
  { log_id: '2', actor_uuid: 'uuid-002', full_name: 'Maria Santos', email: 'maria@example.com', graduation_year: 2019, academic_unit: 'Faculty of Engineering', program: 'BS Civil Engineering', is_legacy_registration: true, action_type: 'alumni.registration.submitted.v1', status_code: 100, created_at: new Date(Date.now() - 86400000).toISOString() },
  { log_id: '3', actor_uuid: 'uuid-003', full_name: 'Pedro Reyes', email: 'pedro@example.com', graduation_year: 2024, academic_unit: 'College of Nursing', program: 'BS Nursing', is_legacy_registration: false, action_type: 'alumni.graduation.verified.v1', status_code: 100, created_at: new Date(Date.now() - 172800000).toISOString() },
];

const MOCK_REQUESTS: RecordRequest[] = [
  { log_id: 'r1', actor_uuid: 'uuid-001', document_type: 'TOR', fee_amount: 150, payment_status: 'PENDING', created_at: new Date().toISOString() },
  { log_id: 'r2', actor_uuid: 'uuid-002', document_type: 'DIPLOMA', fee_amount: 200, payment_status: 'PAID', created_at: new Date(Date.now() - 3600000).toISOString() },
  { log_id: 'r3', actor_uuid: 'uuid-003', document_type: 'GOOD_MORAL', fee_amount: 100, payment_status: 'PENDING', created_at: new Date(Date.now() - 7200000).toISOString() },
];

// ─── Page ─────────────────────────────────────────────────────────────────────
export default function AlumniAdminPage() {
  const [activeTab, setActiveTab] = useState<Tab>('registrations');
  const [searchQuery, setSearchQuery] = useState('');

  const filteredAlumni = MOCK_ALUMNI.filter((a) =>
    `${a.full_name} ${a.email} ${a.academic_unit}`.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <main className="admin-page">
      <aside className="admin-sidebar">
        <div className="admin-logo">
          <span className="admin-logo-mark">C1</span>
          <span className="admin-logo-text">Campus One</span>
        </div>
        <nav className="admin-nav">
          <button id="tab-registrations" className={`admin-nav-item ${activeTab === 'registrations' ? 'active' : ''}`} onClick={() => setActiveTab('registrations')}>
            Alumni Registrations
          </button>
          <button id="tab-records" className={`admin-nav-item ${activeTab === 'records' ? 'active' : ''}`} onClick={() => setActiveTab('records')}>
            Record Requests
          </button>
          <button id="tab-notifications" className={`admin-nav-item ${activeTab === 'notifications' ? 'active' : ''}`} onClick={() => setActiveTab('notifications')}>
            Notifications
          </button>
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
        {/* Header */}
        <header className="admin-header">
          <div>
            <h1 className="admin-page-title">
              {activeTab === 'registrations' && 'Alumni Registrations'}
              {activeTab === 'records' && 'Record Requests'}
              {activeTab === 'notifications' && 'Notifications'}
            </h1>
            <p className="admin-page-sub">Alumni Admin Portal - Campus One</p>
          </div>
          <div className="admin-stats-row">
            <div className="admin-stat"><span className="admin-stat-val">{MOCK_ALUMNI.length}</span><span className="admin-stat-label">Total Alumni</span></div>
            <div className="admin-stat"><span className="admin-stat-val">{MOCK_REQUESTS.filter(r => r.payment_status === 'PENDING').length}</span><span className="admin-stat-label">Pending Requests</span></div>
            <div className="admin-stat admin-stat--accent"><span className="admin-stat-val">{MOCK_ALUMNI.filter(a => a.is_legacy_registration).length}</span><span className="admin-stat-label">Legacy Verifications</span></div>
          </div>
        </header>

        {/* Registrations Tab */}
        {activeTab === 'registrations' && (
          <section className="admin-section">
            <div className="admin-toolbar">
              <input
                id="alumni-search"
                type="search"
                placeholder="Search by name, email, or unit"
                className="admin-search"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
            <div className="admin-table-wrap">
              <table className="admin-table">
                <thead>
                  <tr>
                    <th>Alumni</th>
                    <th>Academic Unit</th>
                    <th>Grad Year</th>
                    <th>Type</th>
                    <th>Event</th>
                    <th>Status</th>
                    <th>Date</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredAlumni.map((a) => (
                    <tr key={a.log_id}>
                      <td>
                        <div className="admin-cell-name">{a.full_name}</div>
                        <div className="admin-cell-sub">{a.email}</div>
                      </td>
                      <td className="admin-cell-unit">{a.academic_unit}</td>
                      <td>{a.graduation_year}</td>
                      <td>
                        <span className={`admin-badge ${a.is_legacy_registration ? 'badge-legacy' : 'badge-standard'}`}>
                          {a.is_legacy_registration ? 'Legacy' : 'Standard'}
                        </span>
                      </td>
                      <td><code className="admin-event-code">{a.action_type}</code></td>
                      <td><span className={`admin-badge ${a.status_code === 100 ? 'badge-success' : 'badge-error'}`}>{a.status_code === 100 ? '100 OK' : '501 Error'}</span></td>
                      <td className="admin-cell-date">{new Date(a.created_at).toLocaleDateString()}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </section>
        )}

        {/* Record Requests Tab */}
        {activeTab === 'records' && (
          <section className="admin-section">
            <div className="admin-table-wrap">
              <table className="admin-table">
                <thead>
                  <tr>
                    <th>Actor UUID</th>
                    <th>Document</th>
                    <th>Fee (PHP)</th>
                    <th>Payment</th>
                    <th>Event</th>
                    <th>Date</th>
                  </tr>
                </thead>
                <tbody>
                  {MOCK_REQUESTS.map((r) => (
                    <tr key={r.log_id}>
                      <td><code className="admin-uuid">{r.actor_uuid}</code></td>
                      <td><span className="admin-badge badge-doc">{r.document_type}</span></td>
                      <td>PHP {r.fee_amount}</td>
                      <td><span className={`admin-badge ${r.payment_status === 'PAID' ? 'badge-success' : 'badge-pending'}`}>{r.payment_status}</span></td>
                      <td><code className="admin-event-code">alumni.record.requested.v1</code></td>
                      <td className="admin-cell-date">{new Date(r.created_at).toLocaleDateString()}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </section>
        )}

        {/* Notifications Tab */}
        {activeTab === 'notifications' && (
          <section className="admin-section">
            <div className="admin-notif-list">
              <div className="admin-notif-item admin-notif--info">
                <div className="admin-notif-icon">Grad</div>
                <div>
                  <div className="admin-notif-title">Graduation event received</div>
                  <div className="admin-notif-body">actor_uuid: uuid-003 - graduation.verified.v1 processed via Kafka. Alumni log created.</div>
                  <div className="admin-notif-time">Just now</div>
                </div>
              </div>
              <div className="admin-notif-item admin-notif--warning">
                <div className="admin-notif-icon">Review</div>
                <div>
                  <div className="admin-notif-title">Legacy verification pending</div>
                  <div className="admin-notif-body">Maria Santos (uuid-002) submitted a legacy registration. Manual identity verification required by Registrar.</div>
                  <div className="admin-notif-time">1 day ago</div>
                </div>
              </div>
              <div className="admin-notif-item admin-notif--success">
                <div className="admin-notif-icon">Done</div>
                <div>
                  <div className="admin-notif-title">New alumni registered</div>
                  <div className="admin-notif-body">Juan dela Cruz successfully registered via standard student ID verification.</div>
                  <div className="admin-notif-time">2 hours ago</div>
                </div>
              </div>
            </div>
          </section>
        )}
      </div>

      <style>{adminStyles}</style>
    </main>
  );
}

const adminStyles = `
  @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&display=swap');
  .admin-page { display: flex; min-height: 100vh; background: #0a0a0a; font-family: 'Inter', sans-serif; color: #fff; }
  .admin-sidebar { width: 240px; background: #111; border-right: 1px solid #1f1f1f; display: flex; flex-direction: column; padding: 24px 0; flex-shrink: 0; }
  .admin-logo { display: flex; align-items: center; gap: 10px; padding: 0 20px 28px; border-bottom: 1px solid #1f1f1f; margin-bottom: 16px; }
  .admin-logo-mark { background: #F5A623; color: #111; font-weight: 800; font-size: 14px; border-radius: 8px; padding: 6px 10px; }
  .admin-logo-text { font-weight: 700; font-size: 15px; color: #fff; }
  .admin-nav { flex: 1; display: flex; flex-direction: column; gap: 4px; padding: 0 12px; }
  .admin-nav-item { display: flex; align-items: center; gap: 10px; padding: 10px 12px; background: none; border: none; border-radius: 10px; color: #888; font-size: 13px; font-weight: 500; cursor: pointer; font-family: 'Inter', sans-serif; text-align: left; transition: all 0.15s; }
  .admin-nav-item:hover { background: #1a1a1a; color: #fff; }
  .admin-nav-item.active { background: rgba(245,166,35,0.12); color: #F5A623; font-weight: 600; }
  .admin-sidebar-footer { padding: 20px; border-top: 1px solid #1f1f1f; display: flex; align-items: center; gap: 10px; }
  .admin-avatar { width: 36px; height: 36px; background: #F5A623; border-radius: 50%; display: flex; align-items: center; justify-content: center; font-weight: 800; font-size: 12px; color: #111; flex-shrink: 0; }
  .admin-name { font-size: 13px; font-weight: 600; color: #fff; }
  .admin-role { font-size: 11px; color: #F5A623; }
  .admin-content { flex: 1; display: flex; flex-direction: column; overflow: hidden; }
  .admin-header { padding: 28px 32px; border-bottom: 1px solid #1f1f1f; display: flex; align-items: center; justify-content: space-between; gap: 24px; flex-wrap: wrap; }
  .admin-page-title { font-size: 22px; font-weight: 800; margin: 0 0 4px; }
  .admin-page-sub { font-size: 12px; color: #666; margin: 0; }
  .admin-stats-row { display: flex; gap: 20px; }
  .admin-stat { display: flex; flex-direction: column; align-items: center; gap: 2px; }
  .admin-stat-val { font-size: 24px; font-weight: 800; color: #fff; }
  .admin-stat-label { font-size: 11px; color: #888; }
  .admin-stat--accent .admin-stat-val { color: #F5A623; }
  .admin-section { flex: 1; padding: 24px 32px; overflow-y: auto; }
  .admin-toolbar { margin-bottom: 16px; }
  .admin-search { background: #111; border: 1.5px solid #2a2a2a; border-radius: 10px; padding: 10px 16px; color: #fff; font-size: 13px; font-family: 'Inter', sans-serif; width: 320px; }
  .admin-search:focus { outline: none; border-color: #F5A623; }
  .admin-table-wrap { overflow-x: auto; border-radius: 14px; border: 1px solid #1f1f1f; }
  .admin-table { width: 100%; border-collapse: collapse; font-size: 13px; }
  .admin-table th { background: #111; color: #666; font-weight: 600; padding: 12px 16px; text-align: left; font-size: 11px; text-transform: uppercase; letter-spacing: 0.05em; }
  .admin-table td { padding: 14px 16px; border-top: 1px solid #1a1a1a; color: #ccc; vertical-align: middle; }
  .admin-table tr:hover td { background: #0f0f0f; }
  .admin-cell-name { font-weight: 600; color: #fff; margin-bottom: 2px; }
  .admin-cell-sub { font-size: 11px; color: #666; }
  .admin-cell-unit { font-size: 12px; max-width: 180px; }
  .admin-cell-date { font-size: 11px; color: #888; white-space: nowrap; }
  .admin-event-code { font-family: monospace; font-size: 11px; color: #888; background: #111; padding: 3px 6px; border-radius: 4px; }
  .admin-uuid { font-family: monospace; font-size: 11px; color: #888; }
  .admin-badge { display: inline-flex; align-items: center; font-size: 11px; font-weight: 600; padding: 3px 9px; border-radius: 20px; }
  .badge-success { background: rgba(34,197,94,0.12); color: #4ade80; }
  .badge-error { background: rgba(239,68,68,0.12); color: #f87171; }
  .badge-pending { background: rgba(245,166,35,0.12); color: #F5A623; }
  .badge-legacy { background: rgba(139,92,246,0.12); color: #a78bfa; }
  .badge-standard { background: rgba(99,102,241,0.12); color: #818cf8; }
  .badge-doc { background: rgba(14,165,233,0.12); color: #38bdf8; }
  .admin-notif-list { display: flex; flex-direction: column; gap: 12px; }
  .admin-notif-item { display: flex; gap: 16px; padding: 18px 20px; border-radius: 14px; border: 1px solid #1f1f1f; align-items: flex-start; }
  .admin-notif--info { background: rgba(14,165,233,0.05); border-color: rgba(14,165,233,0.15); }
  .admin-notif--warning { background: rgba(245,166,35,0.05); border-color: rgba(245,166,35,0.15); }
  .admin-notif--success { background: rgba(34,197,94,0.05); border-color: rgba(34,197,94,0.15); }
  .admin-notif-icon { font-size: 24px; }
  .admin-notif-title { font-size: 14px; font-weight: 700; color: #fff; margin-bottom: 4px; }
  .admin-notif-body { font-size: 12px; color: #888; line-height: 1.5; margin-bottom: 6px; }
  .admin-notif-time { font-size: 11px; color: #666; }
`;
