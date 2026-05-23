'use client';

import React, { useState } from 'react';

type ServiceModule = 'alumni' | 'enrollment' | 'application' | 'graduation';
type ModuleStatus = 'online' | 'degraded' | 'offline';

type ServiceHealth = {
  module: ServiceModule;
  status: ModuleStatus;
  port: number;
  version: string;
  lastChecked: string;
};

type AdminUser = {
  id: string;
  full_name: string;
  email: string;
  role: string;
  tenant_id: string;
  status: 'active' | 'suspended';
};

type Tab = 'dashboard' | 'services' | 'users' | 'tenants';

const MOCK_HEALTH: ServiceHealth[] = [
  { module: 'alumni', status: 'online', port: 3002, version: '1.0.0', lastChecked: new Date().toISOString() },
  { module: 'enrollment', status: 'online', port: 3001, version: '1.0.0', lastChecked: new Date().toISOString() },
  { module: 'application', status: 'online', port: 3003, version: '1.0.0', lastChecked: new Date().toISOString() },
  { module: 'graduation', status: 'degraded', port: 3004, version: '1.0.0', lastChecked: new Date().toISOString() },
];

const MOCK_USERS: AdminUser[] = [
  { id: 'su-001', full_name: 'Super Admin', email: 'super@campus-one.edu', role: 'SUPER_ADMIN', tenant_id: 'global', status: 'active' },
  { id: 'aa-001', full_name: 'Alumni Admin', email: 'alumni.admin@campus-one.edu', role: 'ALUMNI_ADMIN', tenant_id: 'campus-one', status: 'active' },
  { id: 'sa-001', full_name: 'Student Admin', email: 'student.admin@campus-one.edu', role: 'STUDENT_ADMIN', tenant_id: 'campus-one', status: 'active' },
  { id: 'aa-002', full_name: 'Applicant Admin', email: 'app.admin@campus-one.edu', role: 'APPLICANT_ADMIN', tenant_id: 'campus-one', status: 'suspended' },
];

const MOCK_TENANTS = [
  { id: 'campus-one', name: 'Campus One (UST)', modules: ['alumni', 'enrollment', 'application', 'graduation'], status: 'active', plan: 'enterprise' },
];

export default function SuperAdminPage() {
  const [activeTab, setActiveTab] = useState<Tab>('dashboard');

  return (
    <main className="sa-page">
      <aside className="sa-sidebar">
        <div className="sa-logo">
          <span className="sa-logo-mark">C1</span>
          <div>
            <div className="sa-logo-text">Campus One</div>
            <div className="sa-logo-sub">Super Admin</div>
          </div>
        </div>

        <nav className="sa-nav">
          <button id="tab-dashboard" className={`sa-nav-item ${activeTab === 'dashboard' ? 'active' : ''}`} onClick={() => setActiveTab('dashboard')}>🏠 Dashboard</button>
          <button id="tab-services" className={`sa-nav-item ${activeTab === 'services' ? 'active' : ''}`} onClick={() => setActiveTab('services')}>⚙️ Services</button>
          <button id="tab-users" className={`sa-nav-item ${activeTab === 'users' ? 'active' : ''}`} onClick={() => setActiveTab('users')}>👥 Admin Users</button>
          <button id="tab-tenants" className={`sa-nav-item ${activeTab === 'tenants' ? 'active' : ''}`} onClick={() => setActiveTab('tenants')}>🏫 Tenants</button>
          <a id="tab-audit" className="sa-nav-item" href="/super-admin/audit">Audit Events</a>
        </nav>

        <div className="sa-sidebar-footer">
          <div className="sa-avatar">SA</div>
          <div>
            <div className="sa-name">Super Admin</div>
            <div className="sa-role">SUPER_ADMIN</div>
          </div>
        </div>
      </aside>

      <div className="sa-content">
        {/* Header */}
        <header className="sa-header">
          <div>
            <h1 className="sa-page-title">
              {activeTab === 'dashboard' && 'System Overview'}
              {activeTab === 'services' && 'Microservice Health'}
              {activeTab === 'users' && 'Admin Users'}
              {activeTab === 'tenants' && 'Tenant Management'}
            </h1>
            <p className="sa-page-sub">Super Admin Portal — Campus One Platform</p>
          </div>
          <div className="sa-header-badge">SUPER_ADMIN</div>
        </header>

        {/* Dashboard Tab */}
        {activeTab === 'dashboard' && (
          <section className="sa-section">
            <div className="sa-kpi-grid">
              <div className="sa-kpi sa-kpi--accent">
                <div className="sa-kpi-icon">⚙️</div>
                <div className="sa-kpi-val">{MOCK_HEALTH.filter(h => h.status === 'online').length}/{MOCK_HEALTH.length}</div>
                <div className="sa-kpi-label">Services Online</div>
              </div>
              <div className="sa-kpi">
                <div className="sa-kpi-icon">👥</div>
                <div className="sa-kpi-val">{MOCK_USERS.filter(u => u.status === 'active').length}</div>
                <div className="sa-kpi-label">Active Admins</div>
              </div>
              <div className="sa-kpi">
                <div className="sa-kpi-icon">🏫</div>
                <div className="sa-kpi-val">{MOCK_TENANTS.length}</div>
                <div className="sa-kpi-label">Active Tenants</div>
              </div>
              <div className="sa-kpi sa-kpi--warn">
                <div className="sa-kpi-icon">⚠️</div>
                <div className="sa-kpi-val">{MOCK_HEALTH.filter(h => h.status === 'degraded').length}</div>
                <div className="sa-kpi-label">Services Degraded</div>
              </div>
            </div>

            <h2 className="sa-section-title">Service Status</h2>
            <div className="sa-service-grid">
              {MOCK_HEALTH.map((s) => (
                <div key={s.module} className={`sa-service-card sa-service--${s.status}`}>
                  <div className="sa-service-top">
                    <span className="sa-service-name">{s.module}</span>
                    <span className={`sa-badge sa-badge--${s.status}`}>{s.status}</span>
                  </div>
                  <div className="sa-service-detail">Port: {s.port}</div>
                  <div className="sa-service-detail">v{s.version}</div>
                  <div className="sa-service-health-url">
                    <code>/api/v1/{s.module}/health</code>
                  </div>
                </div>
              ))}
            </div>

            <h2 className="sa-section-title">Event Bus Topics (Kafka)</h2>
            <div className="sa-table-wrap">
              <table className="sa-table">
                <thead><tr><th>Topic</th><th>Module</th><th>Description</th></tr></thead>
                <tbody>
                  <tr><td><code>graduation.verified.v1</code></td><td>graduation → alumni</td><td>Triggers alumni log creation and push notification</td></tr>
                  <tr><td><code>enrollment.subject.selected.v1</code></td><td>enrollment</td><td>Student adds subject to cart</td></tr>
                  <tr><td><code>enrollment.checkout.submitted.v1</code></td><td>enrollment</td><td>Enrollment confirmed button clicked</td></tr>
                  <tr><td><code>alumni.registration.submitted.v1</code></td><td>alumni</td><td>Alumni registration submitted (internal or legacy)</td></tr>
                  <tr><td><code>alumni.record.requested.v1</code></td><td>alumni</td><td>Document request (TOR, Diploma, etc.) submitted</td></tr>
                  <tr><td><code>auth.user.login.v1</code></td><td>auth</td><td>User login attempt</td></tr>
                </tbody>
              </table>
            </div>
          </section>
        )}

        {/* Services Tab */}
        {activeTab === 'services' && (
          <section className="sa-section">
            <div className="sa-table-wrap">
              <table className="sa-table">
                <thead><tr><th>Service</th><th>Port</th><th>Version</th><th>Health Endpoint</th><th>Status</th><th>Last Checked</th></tr></thead>
                <tbody>
                  {MOCK_HEALTH.map((s) => (
                    <tr key={s.module}>
                      <td><strong>{s.module}</strong></td>
                      <td>{s.port}</td>
                      <td>v{s.version}</td>
                      <td><code className="sa-code">/api/v1/{s.module}/health</code></td>
                      <td><span className={`sa-badge sa-badge--${s.status}`}>{s.status}</span></td>
                      <td className="sa-muted">{new Date(s.lastChecked).toLocaleTimeString()}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </section>
        )}

        {/* Users Tab */}
        {activeTab === 'users' && (
          <section className="sa-section">
            <div className="sa-table-wrap">
              <table className="sa-table">
                <thead><tr><th>Admin User</th><th>Role</th><th>Tenant</th><th>Status</th></tr></thead>
                <tbody>
                  {MOCK_USERS.map((u) => (
                    <tr key={u.id}>
                      <td>
                        <div className="sa-user-name">{u.full_name}</div>
                        <div className="sa-muted">{u.email}</div>
                      </td>
                      <td><code className="sa-code">{u.role}</code></td>
                      <td>{u.tenant_id}</td>
                      <td><span className={`sa-badge ${u.status === 'active' ? 'sa-badge--online' : 'sa-badge--offline'}`}>{u.status}</span></td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </section>
        )}

        {/* Tenants Tab */}
        {activeTab === 'tenants' && (
          <section className="sa-section">
            {MOCK_TENANTS.map((t) => (
              <div key={t.id} className="sa-tenant-card">
                <div className="sa-tenant-header">
                  <div>
                    <div className="sa-tenant-name">{t.name}</div>
                    <div className="sa-muted">tenant_id: {t.id}</div>
                  </div>
                  <div className="sa-tenant-badges">
                    <span className={`sa-badge sa-badge--${t.status === 'active' ? 'online' : 'offline'}`}>{t.status}</span>
                    <span className="sa-badge sa-badge--plan">{t.plan}</span>
                  </div>
                </div>
                <div className="sa-tenant-modules">
                  <div className="sa-modules-label">Enabled Modules:</div>
                  <div className="sa-modules-list">
                    {t.modules.map((m) => (
                      <span key={m} className="sa-module-tag">{m}</span>
                    ))}
                  </div>
                </div>
              </div>
            ))}
          </section>
        )}
      </div>

      <style>{superAdminStyles}</style>
    </main>
  );
}

const superAdminStyles = `
  @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&display=swap');
  .sa-page { display: flex; min-height: 100vh; background: #080808; font-family: 'Inter', sans-serif; color: #fff; }
  .sa-sidebar { width: 240px; background: #0f0f0f; border-right: 1px solid #1a1a1a; display: flex; flex-direction: column; padding: 24px 0; flex-shrink: 0; }
  .sa-logo { display: flex; align-items: center; gap: 10px; padding: 0 20px 24px; border-bottom: 1px solid #1a1a1a; margin-bottom: 16px; }
  .sa-logo-mark { background: #F5A623; color: #111; font-weight: 800; font-size: 14px; border-radius: 8px; padding: 6px 10px; }
  .sa-logo-text { font-weight: 700; font-size: 14px; color: #fff; line-height: 1.2; }
  .sa-logo-sub { font-size: 11px; color: #F5A623; font-weight: 600; }
  .sa-nav { flex: 1; display: flex; flex-direction: column; gap: 4px; padding: 0 12px; }
  .sa-nav-item { display: flex; align-items: center; gap: 10px; padding: 10px 12px; background: none; border: none; border-radius: 10px; color: #666; font-size: 13px; font-weight: 500; cursor: pointer; font-family: 'Inter', sans-serif; text-align: left; transition: all 0.15s; }
  .sa-nav-item:hover { background: #1a1a1a; color: #fff; }
  .sa-nav-item.active { background: rgba(245,166,35,0.1); color: #F5A623; font-weight: 600; }
  .sa-sidebar-footer { padding: 20px; border-top: 1px solid #1a1a1a; display: flex; align-items: center; gap: 10px; }
  .sa-avatar { width: 36px; height: 36px; background: linear-gradient(135deg, #F5A623, #e8940f); border-radius: 50%; display: flex; align-items: center; justify-content: center; font-weight: 800; font-size: 12px; color: #111; flex-shrink: 0; }
  .sa-name { font-size: 13px; font-weight: 600; }
  .sa-role { font-size: 11px; color: #F5A623; }
  .sa-content { flex: 1; display: flex; flex-direction: column; overflow: hidden; }
  .sa-header { padding: 28px 32px; border-bottom: 1px solid #1a1a1a; display: flex; align-items: center; justify-content: space-between; }
  .sa-page-title { font-size: 22px; font-weight: 800; margin: 0 0 4px; }
  .sa-page-sub { font-size: 12px; color: #555; margin: 0; }
  .sa-header-badge { background: rgba(245,166,35,0.12); color: #F5A623; font-size: 11px; font-weight: 700; padding: 6px 14px; border-radius: 20px; border: 1px solid rgba(245,166,35,0.2); }
  .sa-section { flex: 1; padding: 28px 32px; overflow-y: auto; }
  .sa-section-title { font-size: 16px; font-weight: 700; margin: 28px 0 16px; color: #ccc; }
  .sa-kpi-grid { display: grid; grid-template-columns: repeat(4, 1fr); gap: 16px; margin-bottom: 32px; }
  .sa-kpi { background: #111; border: 1px solid #1a1a1a; border-radius: 16px; padding: 24px; display: flex; flex-direction: column; align-items: center; gap: 8px; }
  .sa-kpi--accent { border-color: rgba(245,166,35,0.2); background: rgba(245,166,35,0.04); }
  .sa-kpi--warn { border-color: rgba(239,68,68,0.2); background: rgba(239,68,68,0.04); }
  .sa-kpi-icon { font-size: 28px; }
  .sa-kpi-val { font-size: 32px; font-weight: 800; }
  .sa-kpi--accent .sa-kpi-val { color: #F5A623; }
  .sa-kpi--warn .sa-kpi-val { color: #f87171; }
  .sa-kpi-label { font-size: 12px; color: #888; }
  .sa-service-grid { display: grid; grid-template-columns: repeat(4, 1fr); gap: 12px; margin-bottom: 32px; }
  .sa-service-card { background: #111; border: 1px solid #1a1a1a; border-radius: 14px; padding: 18px; }
  .sa-service--online { border-color: rgba(34,197,94,0.2); }
  .sa-service--degraded { border-color: rgba(245,166,35,0.2); }
  .sa-service--offline { border-color: rgba(239,68,68,0.2); }
  .sa-service-top { display: flex; justify-content: space-between; align-items: center; margin-bottom: 10px; }
  .sa-service-name { font-size: 14px; font-weight: 700; text-transform: capitalize; }
  .sa-service-detail { font-size: 12px; color: #666; }
  .sa-service-health-url { margin-top: 8px; font-family: monospace; font-size: 11px; color: #555; background: #0a0a0a; border-radius: 6px; padding: 4px 8px; }
  .sa-table-wrap { border-radius: 14px; border: 1px solid #1a1a1a; overflow: hidden; }
  .sa-table { width: 100%; border-collapse: collapse; font-size: 13px; }
  .sa-table th { background: #0f0f0f; color: #555; font-weight: 600; padding: 12px 16px; text-align: left; font-size: 11px; text-transform: uppercase; letter-spacing: 0.05em; }
  .sa-table td { padding: 14px 16px; border-top: 1px solid #141414; color: #bbb; vertical-align: middle; }
  .sa-table code { font-family: monospace; font-size: 11px; }
  .sa-code { background: #0a0a0a; padding: 3px 7px; border-radius: 4px; color: #888; }
  .sa-muted { font-size: 11px; color: #555; }
  .sa-user-name { font-weight: 600; color: #fff; margin-bottom: 2px; }
  .sa-badge { display: inline-flex; align-items: center; font-size: 11px; font-weight: 600; padding: 3px 9px; border-radius: 20px; }
  .sa-badge--online { background: rgba(34,197,94,0.12); color: #4ade80; }
  .sa-badge--offline { background: rgba(239,68,68,0.12); color: #f87171; }
  .sa-badge--degraded { background: rgba(245,166,35,0.12); color: #F5A623; }
  .sa-badge--plan { background: rgba(99,102,241,0.12); color: #818cf8; }
  .sa-tenant-card { background: #0f0f0f; border: 1px solid #1a1a1a; border-radius: 16px; padding: 24px; margin-bottom: 16px; }
  .sa-tenant-header { display: flex; justify-content: space-between; align-items: center; margin-bottom: 16px; }
  .sa-tenant-name { font-size: 18px; font-weight: 700; }
  .sa-tenant-badges { display: flex; gap: 8px; }
  .sa-tenant-modules { display: flex; align-items: center; gap: 12px; flex-wrap: wrap; }
  .sa-modules-label { font-size: 12px; color: #666; }
  .sa-modules-list { display: flex; gap: 8px; flex-wrap: wrap; }
  .sa-module-tag { background: rgba(245,166,35,0.1); color: #F5A623; border: 1px solid rgba(245,166,35,0.2); font-size: 12px; font-weight: 600; padding: 4px 12px; border-radius: 20px; }
`;
