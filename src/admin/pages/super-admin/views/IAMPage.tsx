'use client'
import { useState } from 'react'
import { rolePermissions, masterUsers, type AdminRole, type Permission } from '../../../data/super-admin-modules'

const ROLE_COLORS: Record<AdminRole, string> = {
  SUPER_ADMIN: '#F5A623', ALUMNI_ADMIN: '#a78bfa', STUDENT_ADMIN: '#38bdf8', APPLICANT_ADMIN: '#4ade80',
}
const PERM_COLORS: Record<Permission, string> = {
  read: '#38bdf8', write: '#a78bfa', approve: '#4ade80', delete: '#f87171', export: '#F5A623',
}
const STATUS_COLOR: Record<string, string> = { active: '#4ade80', suspended: '#f87171', pending: '#F5A623' }

export function IAMPage() {
  const [users, setUsers] = useState(masterUsers)

  const toggleStatus = (userId: string) => {
    setUsers(cur => cur.map(u =>
      u.user_id === userId ? { ...u, status: u.status === 'active' ? 'suspended' : 'active' } : u
    ))
  }

  const toggleMFA = (userId: string) => {
    setUsers(cur => cur.map(u =>
      u.user_id === userId ? { ...u, mfa_enabled: !u.mfa_enabled } : u
    ))
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 32 }}>

      {/* Section 1: Admin Access Governance */}
      <section>
        <h2 style={sectionTitle}>ðŸ” Admin Access Governance</h2>
        <p style={sectionSub}>Define and audit specific permissions assigned to each admin role across all schemas. Changes here reflect system-wide access policy.</p>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 12, marginTop: 16 }}>
          {rolePermissions.map((rp, i) => (
            <div key={i} style={card}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 12 }}>
                <div style={{ display: 'flex', gap: 12, alignItems: 'center' }}>
                  <span style={{ ...pill, background: ROLE_COLORS[rp.role] + '20', color: ROLE_COLORS[rp.role] }}>{rp.role}</span>
                  <span style={{ fontSize: 12, color: '#888' }}>on <strong style={{ color: '#ccc' }}>{rp.scope}</strong></span>
                </div>
                <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap' }}>
                  {(['read', 'write', 'approve', 'delete', 'export'] as Permission[]).map(perm => {
                    const granted = rp.permissions.includes(perm)
                    return (
                      <span key={perm} style={{
                        ...pill, opacity: granted ? 1 : 0.25,
                        background: granted ? PERM_COLORS[perm] + '20' : '#1a1a1a',
                        color: granted ? PERM_COLORS[perm] : '#444',
                        border: `1px solid ${granted ? PERM_COLORS[perm] + '30' : '#222'}`,
                      }}>{perm}</span>
                    )
                  })}
                </div>
              </div>
            </div>
          ))}
        </div>
        <p style={{ fontSize: 11, color: '#555', marginTop: 12 }}>âš ï¸ Permission editing is a backend operation. These reflect current role policy â€” connect to <code style={{ color: '#888' }}>POST /api/v1/system/roles/permissions</code> to modify.</p>
      </section>

      {/* Section 2: Unified User Directory */}
      <section>
        <h2 style={sectionTitle}>ðŸ‘¥ Unified User Directory</h2>
        <p style={sectionSub}>Master accounts and authentication credentials for all admin users across the platform. MFA and account status managed here.</p>

        <div style={{ ...tableWrap, marginTop: 16 }}>
          <table style={tableStyle}>
            <thead><tr>
              {['Admin User', 'Role', 'Tenant', 'Last Login', 'MFA', 'Status', 'Actions'].map(h => <th key={h} style={thStyle}>{h}</th>)}
            </tr></thead>
            <tbody>
              {users.map(u => (
                <tr key={u.user_id}>
                  <td style={tdStyle}>
                    <strong style={{ color: '#fff', fontSize: 13 }}>{u.full_name}</strong>
                    <div style={{ fontSize: 11, color: '#555', marginTop: 2 }}>{u.email}</div>
                  </td>
                  <td style={tdStyle}><span style={{ ...pill, background: ROLE_COLORS[u.role] + '20', color: ROLE_COLORS[u.role], fontSize: 10 }}>{u.role}</span></td>
                  <td style={tdStyle}><code style={{ fontSize: 11, color: '#888' }}>{u.tenant_id}</code></td>
                  <td style={{ ...tdStyle, fontSize: 11, color: '#555' }}>{u.last_login}</td>
                  <td style={tdStyle}>
                    <span style={{ ...pill, background: u.mfa_enabled ? 'rgba(74,222,128,0.12)' : 'rgba(248,113,113,0.12)', color: u.mfa_enabled ? '#4ade80' : '#f87171' }}>
                      {u.mfa_enabled ? 'âœ“ On' : 'âœ— Off'}
                    </span>
                  </td>
                  <td style={tdStyle}><span style={{ ...pill, background: STATUS_COLOR[u.status] + '20', color: STATUS_COLOR[u.status] }}>{u.status}</span></td>
                  <td style={tdStyle}>
                    <div style={{ display: 'flex', gap: 6 }}>
                      {u.role !== 'SUPER_ADMIN' && (
                        <button style={actionBtn} type="button" onClick={() => toggleStatus(u.user_id)}>
                          {u.status === 'active' ? 'Suspend' : 'Reinstate'}
                        </button>
                      )}
                      {!u.mfa_enabled && u.role !== 'SUPER_ADMIN' && (
                        <button style={{ ...actionBtn, color: '#38bdf8', borderColor: 'rgba(56,189,248,0.2)', background: 'rgba(56,189,248,0.08)' }} type="button" onClick={() => toggleMFA(u.user_id)}>
                          Enforce MFA
                        </button>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>
    </div>
  )
}

const sectionTitle: React.CSSProperties = { fontSize: 16, fontWeight: 800, color: '#fff', margin: '0 0 6px' }
const sectionSub: React.CSSProperties = { fontSize: 12, color: '#888', margin: 0 }
const card: React.CSSProperties = { background: '#111', border: '1px solid #1f1f1f', borderRadius: 14, padding: '14px 18px' }
const pill: React.CSSProperties = { display: 'inline-flex', alignItems: 'center', fontSize: 11, fontWeight: 600, padding: '3px 9px', borderRadius: 20 }
const tableWrap: React.CSSProperties = { background: '#111', border: '1px solid #1f1f1f', borderRadius: 14, overflow: 'hidden' }
const tableStyle: React.CSSProperties = { width: '100%', borderCollapse: 'collapse', fontSize: 12 }
const thStyle: React.CSSProperties = { background: '#0f0f0f', color: '#555', fontWeight: 600, padding: '10px 14px', textAlign: 'left', fontSize: 11, textTransform: 'uppercase', letterSpacing: '0.05em' }
const tdStyle: React.CSSProperties = { padding: '12px 14px', borderTop: '1px solid #1a1a1a', color: '#bbb', verticalAlign: 'middle' }
const actionBtn: React.CSSProperties = { background: 'rgba(245,166,35,0.1)', border: '1px solid rgba(245,166,35,0.2)', borderRadius: 6, color: '#F5A623', fontSize: 11, fontWeight: 600, padding: '4px 10px', cursor: 'pointer', fontFamily: 'inherit' }

