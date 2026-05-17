'use client'
import { useState } from 'react'
import { schemaRooms, serviceManifests, kafkaTopics, kafkaAlerts } from '../../../data/super-admin-modules'

const healthColor = (h: string) => h === 'healthy' ? '#4ade80' : h === 'degraded' ? '#F5A623' : h === 'isolated' ? '#f87171' : '#6b7280'
const manifestColor = (s: string) => s === 'registered' ? '#4ade80' : s === 'version-mismatch' ? '#F5A623' : '#f87171'
const lagColor = (lag: number) => lag === 0 ? '#4ade80' : lag < 10 ? '#F5A623' : '#f87171'
const topicStatusColor = (s: string) => s === 'active' ? '#4ade80' : s === 'idle' ? '#9ca3af' : '#f87171'
const alertSeverityColor = (s: string) => s === 'critical' ? '#f87171' : s === 'warning' ? '#F5A623' : '#38bdf8'

export function InfrastructurePage() {
  const [resolvedAlerts, setResolvedAlerts] = useState<string[]>(
    kafkaAlerts.filter(a => a.resolved).map(a => a.alert_id)
  )

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 32 }}>

      {/* Section 1: Service Schema Registry */}
      <section>
        <h2 style={sectionTitle}>ðŸ“‚ Service Schema Registry</h2>
        <p style={sectionSub}>Monitoring the isolation and health of the five database rooms across the monorepo.</p>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(260px, 1fr))', gap: 16, marginTop: 16 }}>
          {schemaRooms.map(r => (
            <div key={r.id} style={{ ...card, borderColor: healthColor(r.health) + '40' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 10 }}>
                <strong style={{ fontSize: 14, color: '#fff' }}>{r.name}</strong>
                <span style={{ ...pill, background: healthColor(r.health) + '20', color: healthColor(r.health) }}>{r.health}</span>
              </div>
              <code style={{ fontSize: 11, color: '#F5A623' }}>schema: {r.schema}</code>
              <p style={{ fontSize: 11, color: '#888', marginTop: 8, lineHeight: 1.5 }}>{r.description}</p>
              <div style={{ display: 'flex', gap: 16, marginTop: 12 }}>
                <span style={statItem}><strong>{r.tables}</strong> tables</span>
                <span style={statItem}><strong>{r.connections}</strong> connections</span>
              </div>
              <div style={{ fontSize: 10, color: '#555', marginTop: 8 }}>Last checked: {r.lastChecked}</div>
            </div>
          ))}
        </div>
      </section>

      {/* Section 2: Module Manifest Controller */}
      <section>
        <h2 style={sectionTitle}>ðŸ”Œ Module Manifest Controller</h2>
        <p style={sectionSub}>Managing service ID cards â€” ensuring all microservices are registered, versioned, and communicating correctly.</p>
        <div style={tableWrap}>
          <table style={tableStyle}>
            <thead><tr>
              {['Service', 'Version', 'Port', 'Base URL', 'Consumes', 'Emits', 'Heartbeat', 'Status'].map(h => <th key={h} style={thStyle}>{h}</th>)}
            </tr></thead>
            <tbody>
              {serviceManifests.map(s => (
                <tr key={s.service_id}>
                  <td style={tdStyle}><strong style={{ color: '#fff' }}>{s.name}</strong></td>
                  <td style={tdStyle}><code style={{ color: '#888', fontSize: 11 }}>v{s.version}</code></td>
                  <td style={tdStyle}>{s.port}</td>
                  <td style={tdStyle}><code style={{ fontSize: 11, color: '#F5A623' }}>{s.base_url}</code></td>
                  <td style={tdStyle}>{s.consumes.map(t => <div key={t} style={{ fontSize: 10, color: '#666' }}>{t || 'â€”'}</div>)}</td>
                  <td style={tdStyle}>{s.emits.map(t => <div key={t} style={{ fontSize: 10, color: '#38bdf8' }}>{t}</div>)}</td>
                  <td style={{ ...tdStyle, fontSize: 11, color: '#555' }}>{s.last_heartbeat}</td>
                  <td style={tdStyle}><span style={{ ...pill, background: manifestColor(s.status) + '20', color: manifestColor(s.status) }}>{s.status}</span></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      {/* Section 3: Kafka Alert Gateway */}
      <section>
        <h2 style={sectionTitle}>âš¡ Kafka Alert Gateway</h2>
        <p style={sectionSub}>Notification engine performance and system-wide alert traffic across all event bus topics.</p>

        <div style={tableWrap}>
          <table style={tableStyle}>
            <thead><tr>
              {['Topic', 'Producer â†’ Consumer', 'Throughput/min', 'Lag', 'Status'].map(h => <th key={h} style={thStyle}>{h}</th>)}
            </tr></thead>
            <tbody>
              {kafkaTopics.map(t => (
                <tr key={t.topic}>
                  <td style={tdStyle}><code style={{ fontSize: 11, color: '#a78bfa' }}>{t.topic}</code><div style={{ fontSize: 10, color: '#555', marginTop: 3 }}>{t.description}</div></td>
                  <td style={tdStyle}><span style={{ fontSize: 11, color: '#888' }}>{t.producer} â†’ {t.consumer}</span></td>
                  <td style={tdStyle}><strong style={{ color: '#fff' }}>{t.throughput_per_min}</strong></td>
                  <td style={tdStyle}><strong style={{ color: lagColor(t.lag) }}>{t.lag}</strong></td>
                  <td style={tdStyle}><span style={{ ...pill, background: topicStatusColor(t.status) + '20', color: topicStatusColor(t.status) }}>{t.status}</span></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <h3 style={{ fontSize: 13, color: '#F5A623', marginTop: 24, marginBottom: 12 }}>Active Alerts</h3>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
          {kafkaAlerts.map(alert => (
            <div key={alert.alert_id} style={{ ...card, borderColor: alertSeverityColor(alert.severity) + '40', opacity: resolvedAlerts.includes(alert.alert_id) ? 0.4 : 1 }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                <div style={{ display: 'flex', gap: 12, alignItems: 'flex-start' }}>
                  <span style={{ ...pill, background: alertSeverityColor(alert.severity) + '20', color: alertSeverityColor(alert.severity), flexShrink: 0 }}>{alert.severity}</span>
                  <div>
                    <code style={{ fontSize: 11, color: '#a78bfa' }}>{alert.topic}</code>
                    <p style={{ fontSize: 12, color: '#ccc', margin: '4px 0 0' }}>{alert.message}</p>
                    <span style={{ fontSize: 10, color: '#555' }}>{alert.timestamp}</span>
                  </div>
                </div>
                {!resolvedAlerts.includes(alert.alert_id) && (
                  <button style={actionBtn} type="button" onClick={() => setResolvedAlerts(r => [...r, alert.alert_id])}>Resolve</button>
                )}
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
const statItem: React.CSSProperties = { fontSize: 11, color: '#888' }
const tableWrap: React.CSSProperties = { background: '#111', border: '1px solid #1f1f1f', borderRadius: 14, overflow: 'hidden', marginTop: 16 }
const tableStyle: React.CSSProperties = { width: '100%', borderCollapse: 'collapse', fontSize: 12 }
const thStyle: React.CSSProperties = { background: '#0f0f0f', color: '#555', fontWeight: 600, padding: '10px 14px', textAlign: 'left', fontSize: 11, textTransform: 'uppercase', letterSpacing: '0.05em' }
const tdStyle: React.CSSProperties = { padding: '12px 14px', borderTop: '1px solid #1a1a1a', color: '#bbb', verticalAlign: 'middle' }
const actionBtn: React.CSSProperties = { background: 'rgba(245,166,35,0.1)', border: '1px solid rgba(245,166,35,0.2)', borderRadius: 6, color: '#F5A623', fontSize: 11, fontWeight: 600, padding: '4px 10px', cursor: 'pointer', fontFamily: 'inherit', flexShrink: 0 }

