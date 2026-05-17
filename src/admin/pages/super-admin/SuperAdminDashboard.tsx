'use client';

import { useState } from 'react';
import { schemaRooms, kafkaAlerts, masterUsers, securityControls, journeyMetrics } from '../../data/super-admin-modules';
import { InfrastructurePage } from './views/InfrastructurePage';
import { IAMPage } from './views/IAMPage';
import { SystemOpsPage } from './views/SystemOpsPage';
import { AnalyticsPage } from './views/AnalyticsPage';

type Module = 'dashboard' | 'infrastructure' | 'iam' | 'system-ops' | 'analytics';

const NAV: { id: Module; icon: string; label: string; group: string }[] = [
  { id: 'dashboard',      icon: '🏠', label: 'System Overview',           group: 'Home' },
  { id: 'infrastructure', icon: '🗄️', label: 'Infrastructure & Services', group: 'Operations' },
  { id: 'iam',            icon: '🔐', label: 'Identity & Access (IAM)',    group: 'Operations' },
  { id: 'system-ops',     icon: '⚙️', label: 'System Ops & Compliance',   group: 'Operations' },
  { id: 'analytics',      icon: '📊', label: 'Master Analytics',           group: 'Intelligence' },
];

const GROUP_ORDER = ['Home', 'Operations', 'Intelligence'];

// ─── Dashboard Overview ───────────────────────────────────────────────────────
function DashboardOverview({ onNavigate }: { onNavigate: (m: Module) => void }) {
  const degradedSchemas = schemaRooms.filter(s => s.health !== 'healthy').length;
  const criticalAlerts = kafkaAlerts.filter(a => a.severity === 'critical' && !a.resolved).length;
  const mfaIssues = masterUsers.filter(u => !u.mfa_enabled && u.status === 'active' && u.role !== 'SUPER_ADMIN').length;
  const securityFails = securityControls.filter(s => s.status === 'fail').length;
  const totalStudents = journeyMetrics.find(m => m.stage === 'Active Students')?.count ?? 0;
  const totalAlumni = journeyMetrics.find(m => m.stage === 'Registered Alumni')?.count ?? 0;

  const kpis = [
    { label: 'Schema Rooms',      value: `${schemaRooms.length - degradedSchemas}/${schemaRooms.length}`, sub: 'healthy',          color: '#4ade80', alert: degradedSchemas > 0 },
    { label: 'Kafka Alerts',      value: criticalAlerts,  sub: 'critical unresolved', color: criticalAlerts > 0 ? '#f87171' : '#4ade80', alert: criticalAlerts > 0 },
    { label: 'MFA Gaps',          value: mfaIssues,       sub: 'admin accounts',      color: mfaIssues > 0 ? '#F5A623' : '#4ade80',   alert: mfaIssues > 0 },
    { label: 'Security Failures', value: securityFails,   sub: 'controls failing',    color: securityFails > 0 ? '#f87171' : '#4ade80', alert: securityFails > 0 },
    { label: 'Active Students',   value: totalStudents.toLocaleString(), sub: 'platform-wide', color: '#38bdf8', alert: false },
    { label: 'Registered Alumni', value: totalAlumni,     sub: 'total registered',    color: '#a78bfa', alert: false },
  ];

  const moduleCards: { id: Module; icon: string; title: string; desc: string }[] = [
    { id: 'infrastructure', icon: '🗄️', title: 'Infrastructure & Services', desc: 'Schema Registry · Module Manifest · Kafka Gateway' },
    { id: 'iam',            icon: '🔐', title: 'Identity & Access Management', desc: 'Role Permissions · User Directory · MFA Governance' },
    { id: 'system-ops',     icon: '⚙️', title: 'System Ops & Compliance', desc: 'Global Config · Audit Trail · Security Controls' },
    { id: 'analytics',      icon: '📊', title: 'Master Analytics', desc: 'Journey Funnel · Cross-Service Reports' },
  ];

  return (
    <section>
      <header style={{ marginBottom: 28 }}>
        <h2 style={{ fontSize: 22, fontWeight: 800, margin: '0 0 6px', color: '#fff' }}>Campus One — Super Admin</h2>
        <p style={{ fontSize: 13, color: '#888', margin: 0 }}>System Governance & Infrastructure · Global view across all schemas, services, and users.</p>
      </header>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(180px, 1fr))', gap: 14, marginBottom: 32 }}>
        {kpis.map(k => (
          <div key={k.label} style={{ background: '#111', border: `1px solid ${k.alert ? k.color + '30' : '#1f1f1f'}`, borderRadius: 14, padding: '18px 16px' }}>
            <div style={{ fontSize: 28, fontWeight: 800, color: k.color }}>{k.value}</div>
            <div style={{ fontSize: 11, color: '#888', marginTop: 4 }}>{k.sub}</div>
            <div style={{ fontSize: 12, fontWeight: 600, color: '#ccc', marginTop: 6 }}>{k.label}</div>
          </div>
        ))}
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(260px, 1fr))', gap: 16 }}>
        {moduleCards.map(mc => (
          <button key={mc.id} id={`overview-${mc.id}`} type="button" onClick={() => onNavigate(mc.id)}
            style={{ background: '#111', border: '1.5px solid #1f1f1f', borderRadius: 14, padding: '22px 20px', textAlign: 'left', cursor: 'pointer', display: 'flex', flexDirection: 'column', gap: 8, transition: 'border-color 0.15s', fontFamily: 'inherit' }}
            onMouseEnter={e => (e.currentTarget.style.borderColor = '#F5A623')}
            onMouseLeave={e => (e.currentTarget.style.borderColor = '#1f1f1f')}>
            <span style={{ fontSize: 24 }}>{mc.icon}</span>
            <strong style={{ fontSize: 14, fontWeight: 700, color: '#fff' }}>{mc.title}</strong>
            <span style={{ fontSize: 11, color: '#666', lineHeight: 1.5 }}>{mc.desc}</span>
          </button>
        ))}
      </div>
    </section>
  );
}

// ─── Page title map ───────────────────────────────────────────────────────────
const PAGE_TITLE: Record<Module, string> = {
  dashboard:      'System Overview',
  infrastructure: 'Infrastructure & Service Orchestration',
  iam:            'Identity & Access Management',
  'system-ops':   'System Operations & Compliance',
  analytics:      'Master System Analytics',
};

// ─── Shell ────────────────────────────────────────────────────────────────────
export default function SuperAdminPage() {
  const [active, setActive] = useState<Module>('dashboard');

  return (
    <main style={{ display: 'flex', minHeight: '100vh', background: '#080808', fontFamily: "'Inter', sans-serif", color: '#fff' }}>
      {/* Sidebar */}
      <aside style={{ width: 256, background: '#0f0f0f', borderRight: '1px solid #1a1a1a', display: 'flex', flexDirection: 'column', padding: '24px 0', flexShrink: 0, position: 'sticky', top: 0, height: '100vh', overflowY: 'auto' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '0 20px 24px', borderBottom: '1px solid #1a1a1a', marginBottom: 16 }}>
          <span style={{ background: '#F5A623', color: '#111', fontWeight: 800, fontSize: 14, borderRadius: 8, padding: '6px 10px' }}>C1</span>
          <div>
            <div style={{ fontWeight: 700, fontSize: 14, color: '#fff', lineHeight: 1.2 }}>Campus One</div>
            <div style={{ fontSize: 11, color: '#F5A623', fontWeight: 600 }}>Super Admin</div>
          </div>
        </div>

        <nav style={{ flex: 1, padding: '0 12px', display: 'flex', flexDirection: 'column', gap: 2 }}>
          {GROUP_ORDER.map(group => {
            const items = NAV.filter(n => n.group === group);
            return (
              <div key={group}>
                <div style={{ fontSize: 10, color: '#444', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.1em', padding: '12px 12px 6px' }}>{group}</div>
                {items.map(item => (
                  <button key={item.id} id={`nav-sa-${item.id}`} type="button" onClick={() => setActive(item.id)}
                    style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '9px 12px', background: active === item.id ? 'rgba(245,166,35,0.1)' : 'none', border: 'none', borderRadius: 10, color: active === item.id ? '#F5A623' : '#777', fontSize: 12, fontWeight: active === item.id ? 600 : 500, cursor: 'pointer', fontFamily: 'inherit', textAlign: 'left', width: '100%', transition: 'all 0.15s' }}>
                    {item.icon} {item.label}
                  </button>
                ))}
              </div>
            );
          })}
        </nav>

        <div style={{ padding: '20px', borderTop: '1px solid #1a1a1a', display: 'flex', alignItems: 'center', gap: 10 }}>
          <div style={{ width: 36, height: 36, background: 'linear-gradient(135deg,#F5A623,#e8940f)', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 800, fontSize: 12, color: '#111', flexShrink: 0 }}>SA</div>
          <div>
            <div style={{ fontSize: 13, fontWeight: 600, color: '#fff' }}>Super Admin</div>
            <div style={{ fontSize: 11, color: '#F5A623' }}>SUPER_ADMIN</div>
          </div>
        </div>
      </aside>

      {/* Content */}
      <div style={{ flex: 1, overflowY: 'auto' }}>
        <header style={{ padding: '24px 32px', borderBottom: '1px solid #1a1a1a', display: 'flex', alignItems: 'center', justifyContent: 'space-between', position: 'sticky', top: 0, background: '#080808', zIndex: 10 }}>
          <div>
            <h1 style={{ fontSize: 20, fontWeight: 800, margin: 0, color: '#fff' }}>{PAGE_TITLE[active]}</h1>
            <p style={{ fontSize: 12, color: '#555', margin: '2px 0 0' }}>Super Admin Portal — Campus One Platform</p>
          </div>
          <span style={{ background: 'rgba(245,166,35,0.12)', color: '#F5A623', fontSize: 11, fontWeight: 700, padding: '6px 14px', borderRadius: 20, border: '1px solid rgba(245,166,35,0.2)' }}>SUPER_ADMIN</span>
        </header>

        <div style={{ padding: '32px', maxWidth: 1200 }}>
          {active === 'dashboard'      && <DashboardOverview onNavigate={setActive} />}
          {active === 'infrastructure' && <InfrastructurePage />}
          {active === 'iam'            && <IAMPage />}
          {active === 'system-ops'     && <SystemOpsPage />}
          {active === 'analytics'      && <AnalyticsPage />}
        </div>
      </div>

      <style>{`@import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&display=swap');`}</style>
    </main>
  );
}
