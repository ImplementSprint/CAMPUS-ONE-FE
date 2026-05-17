'use client'
import { useState } from 'react'
import { systemConfigs, auditTrail, securityControls } from '../../../data/super-admin-modules'

const OUTCOME_COLOR: Record<string, string> = { success: '#4ade80', failure: '#f87171', blocked: '#F5A623' }
const SEC_COLOR: Record<string, string> = { pass: '#4ade80', warning: '#F5A623', fail: '#f87171' }
const ROLE_COLORS: Record<string, string> = {
  SUPER_ADMIN: '#F5A623', ALUMNI_ADMIN: '#a78bfa', STUDENT_ADMIN: '#38bdf8', APPLICANT_ADMIN: '#4ade80',
}

export function SystemOpsPage() {
  const [configs, setConfigs] = useState(systemConfigs)
  const [editing, setEditing] = useState<string | null>(null)
  const [editValue, setEditValue] = useState('')

  const startEdit = (key: string, val: string) => { setEditing(key); setEditValue(val) }
  const saveEdit = (key: string) => {
    setConfigs(cur => cur.map(c => c.key === key ? { ...c, value: editValue } : c))
    setEditing(null)
  }

  const academic = configs.filter(c => c.category === 'academic')
  const maintenance = configs.filter(c => c.category === 'maintenance')
  const system = configs.filter(c => c.category === 'system')

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 32 }}>

      {/* Section 1: Global System Configuration */}
      <section>
        <h2 style={sectionTitle}>âš™ï¸ Global System Configuration</h2>
        <p style={sectionSub}>System-wide variables â€” Academic Year, Semester, Enrollment window, and Maintenance Mode toggles.</p>

        {[{ label: 'Academic Settings', items: academic }, { label: 'Maintenance', items: maintenance }, { label: 'System (Read-Only)', items: system }].map(group => (
          <div key={group.label} style={{ marginTop: 20 }}>
            <h3 style={{ fontSize: 12, color: '#F5A623', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: 10 }}>{group.label}</h3>
            <div style={{ ...tableWrap }}>
              <table style={tableStyle}>
                <thead><tr>
                  {['Key', 'Label', 'Value', ''].map(h => <th key={h} style={thStyle}>{h}</th>)}
                </tr></thead>
                <tbody>
                  {group.items.map(cfg => (
                    <tr key={cfg.key}>
                      <td style={tdStyle}><code style={{ fontSize: 11, color: '#F5A623' }}>{cfg.key}</code></td>
                      <td style={tdStyle}>{cfg.label}</td>
                      <td style={tdStyle}>
                        {editing === cfg.key ? (
                          <input
                            value={editValue} onChange={e => setEditValue(e.target.value)}
                            style={{ background: '#0a0a0a', border: '1px solid #F5A623', borderRadius: 6, color: '#fff', fontSize: 12, padding: '4px 8px', width: '100%' }}
                          />
                        ) : (
                          <span style={{ fontSize: 12, color: cfg.value === 'true' ? '#4ade80' : cfg.value === 'false' ? '#f87171' : '#ccc' }}>
                            {cfg.value || <em style={{ color: '#555' }}>â€”</em>}
                          </span>
                        )}
                      </td>
                      <td style={tdStyle}>
                        {cfg.editable && editing !== cfg.key && (
                          <button style={actionBtn} type="button" onClick={() => startEdit(cfg.key, cfg.value)}>Edit</button>
                        )}
                        {editing === cfg.key && (
                          <div style={{ display: 'flex', gap: 6 }}>
                            <button style={actionBtn} type="button" onClick={() => saveEdit(cfg.key)}>Save</button>
                            <button style={{ ...actionBtn, color: '#888', borderColor: '#333', background: 'transparent' }} type="button" onClick={() => setEditing(null)}>Cancel</button>
                          </div>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        ))}
      </section>

      {/* Section 2: Administrative Audit Trail */}
      <section>
        <h2 style={sectionTitle}>ðŸ“‹ Administrative Audit Trail</h2>
        <p style={sectionSub}>Read-only, high-security record of every action taken by any admin across all schemas. Cannot be deleted or modified.</p>
        <div style={{ ...tableWrap, marginTop: 16 }}>
          <table style={tableStyle}>
            <thead><tr>
              {['Timestamp', 'Admin', 'Role', 'Action', 'Schema', 'Outcome'].map(h => <th key={h} style={thStyle}>{h}</th>)}
            </tr></thead>
            <tbody>
              {auditTrail.map(a => (
                <tr key={a.audit_id}>
                  <td style={{ ...tdStyle, fontSize: 11, color: '#555', whiteSpace: 'nowrap' }}>{a.timestamp}</td>
                  <td style={tdStyle}><strong style={{ color: '#fff', fontSize: 12 }}>{a.admin_name}</strong></td>
                  <td style={tdStyle}><span style={{ ...pill, background: ROLE_COLORS[a.admin_role] + '20', color: ROLE_COLORS[a.admin_role], fontSize: 10 }}>{a.admin_role}</span></td>
                  <td style={{ ...tdStyle, fontSize: 12 }}>{a.action}</td>
                  <td style={tdStyle}><code style={{ fontSize: 11, color: '#a78bfa' }}>{a.schema}</code></td>
                  <td style={tdStyle}><span style={{ ...pill, background: OUTCOME_COLOR[a.outcome] + '20', color: OUTCOME_COLOR[a.outcome] }}>{a.outcome}</span></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <p style={{ fontSize: 11, color: '#555', marginTop: 8 }}>ðŸ”’ Audit trail is append-only. Connect to <code style={{ color: '#888' }}>GET /api/v1/system/audit</code> to load live records.</p>
      </section>

      {/* Section 3: Platform Security Compliance */}
      <section>
        <h2 style={sectionTitle}>ðŸ›¡ï¸ Platform Security Compliance</h2>
        <p style={sectionSub}>System-wide encryption health, data privacy policy status, and security certificate monitoring.</p>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 12, marginTop: 16 }}>
          {securityControls.map(ctrl => (
            <div key={ctrl.control_id} style={{ ...card, borderColor: SEC_COLOR[ctrl.status] + '30' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: 12, flexWrap: 'wrap' }}>
                <div style={{ flex: 1 }}>
                  <div style={{ display: 'flex', gap: 10, alignItems: 'center', marginBottom: 6 }}>
                    <span style={{ ...pill, background: SEC_COLOR[ctrl.status] + '20', color: SEC_COLOR[ctrl.status] }}>{ctrl.status.toUpperCase()}</span>
                    <strong style={{ fontSize: 13, color: '#fff' }}>{ctrl.area}</strong>
                  </div>
                  <p style={{ fontSize: 12, color: '#888', margin: 0, lineHeight: 1.5 }}>{ctrl.description}</p>
                  {ctrl.remediation && (
                    <p style={{ fontSize: 11, color: '#F5A623', margin: '8px 0 0', padding: '6px 10px', background: 'rgba(245,166,35,0.06)', borderRadius: 6, borderLeft: '2px solid #F5A623' }}>
                      âš ï¸ {ctrl.remediation}
                    </p>
                  )}
                </div>
                <div style={{ fontSize: 10, color: '#555', whiteSpace: 'nowrap' }}>Last scan: {ctrl.last_scan}</div>
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  )
}

const sectionTitle: React.CSSProperties = { fontSize: 16, fontWeight: 800, color: '#fff', margin: '0 0 6px' }
const sectionSub: React.CSSProperties = { fontSize: 12, color: '#888', margin: 0 }
const card: React.CSSProperties = { background: '#111', border: '1px solid #1f1f1f', borderRadius: 14, padding: '16px 18px' }
const pill: React.CSSProperties = { display: 'inline-flex', alignItems: 'center', fontSize: 11, fontWeight: 600, padding: '3px 9px', borderRadius: 20 }
const tableWrap: React.CSSProperties = { background: '#111', border: '1px solid #1f1f1f', borderRadius: 14, overflow: 'hidden' }
const tableStyle: React.CSSProperties = { width: '100%', borderCollapse: 'collapse', fontSize: 12 }
const thStyle: React.CSSProperties = { background: '#0f0f0f', color: '#555', fontWeight: 600, padding: '10px 14px', textAlign: 'left', fontSize: 11, textTransform: 'uppercase', letterSpacing: '0.05em' }
const tdStyle: React.CSSProperties = { padding: '12px 14px', borderTop: '1px solid #1a1a1a', color: '#bbb', verticalAlign: 'middle' }
const actionBtn: React.CSSProperties = { background: 'rgba(245,166,35,0.1)', border: '1px solid rgba(245,166,35,0.2)', borderRadius: 6, color: '#F5A623', fontSize: 11, fontWeight: 600, padding: '4px 10px', cursor: 'pointer', fontFamily: 'inherit' }

