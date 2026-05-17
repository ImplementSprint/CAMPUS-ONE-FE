'use client'
import { useState } from 'react'
import { journeyMetrics, crossServiceReports } from '../../../data/super-admin-modules'

const REPORT_STATUS_COLOR: Record<string, string> = { ready: '#4ade80', generating: '#38bdf8', stale: '#F5A623' }

export function AnalyticsPage() {
  const [reports, setReports] = useState(crossServiceReports)

  const regenerate = (reportId: string) => {
    setReports(cur => cur.map(r => r.report_id === reportId ? { ...r, status: 'generating' } : r))
    setTimeout(() => {
      setReports(cur => cur.map(r => r.report_id === reportId ? { ...r, status: 'ready', last_generated: new Date().toISOString().slice(0, 16).replace('T', ' ') } : r))
    }, 2000)
  }

  const maxCount = Math.max(...journeyMetrics.map(m => m.count))

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 32 }}>

      {/* Section 1: Unified System Dashboard */}
      <section>
        <h2 style={sectionTitle}>ðŸŒ Unified System Dashboard</h2>
        <p style={sectionSub}>Bird's-eye view of the entire student journey â€” from new applications through to alumni employment and registration rates.</p>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(180px, 1fr))', gap: 14, marginTop: 20 }}>
          {journeyMetrics.map(m => (
            <div key={m.stage} style={{ background: '#111', border: `1px solid ${m.color}30`, borderRadius: 14, padding: '18px 16px' }}>
              <div style={{ fontSize: 11, color: '#888', marginBottom: 8, lineHeight: 1.4 }}>{m.stage}</div>
              <div style={{ fontSize: 28, fontWeight: 800, color: m.color }}>{m.count.toLocaleString()}</div>
              <div style={{ fontSize: 11, color: m.change_pct >= 0 ? '#4ade80' : '#f87171', marginTop: 4 }}>
                {m.change_pct >= 0 ? 'â–²' : 'â–¼'} {Math.abs(m.change_pct)}% vs last period
              </div>
              <div style={{ marginTop: 12, height: 4, background: '#1a1a1a', borderRadius: 4, overflow: 'hidden' }}>
                <div style={{ height: '100%', width: `${(m.count / maxCount) * 100}%`, background: m.color, borderRadius: 4 }} />
              </div>
            </div>
          ))}
        </div>

        <div style={{ marginTop: 24, background: '#111', border: '1px solid #1f1f1f', borderRadius: 14, padding: '20px 22px' }}>
          <h3 style={{ fontSize: 13, color: '#fff', margin: '0 0 16px', fontWeight: 700 }}>Conversion Funnel</h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
            {journeyMetrics.map((m, i) => {
              const prev = journeyMetrics[i - 1]
              const conversionRate = prev ? Math.round((m.count / prev.count) * 100) : 100
              return (
                <div key={m.stage} style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
                  <div style={{ width: 180, fontSize: 11, color: '#888', flexShrink: 0 }}>{m.stage}</div>
                  <div style={{ flex: 1, height: 20, background: '#1a1a1a', borderRadius: 6, overflow: 'hidden', position: 'relative' }}>
                    <div style={{ height: '100%', width: `${(m.count / maxCount) * 100}%`, background: m.color, borderRadius: 6, transition: 'width 0.4s' }} />
                  </div>
                  <div style={{ width: 80, fontSize: 11, color: '#ccc', textAlign: 'right', flexShrink: 0 }}>
                    {m.count.toLocaleString()} {prev ? <span style={{ color: conversionRate >= 80 ? '#4ade80' : '#F5A623' }}>({conversionRate}%)</span> : null}
                  </div>
                </div>
              )
            })}
          </div>
        </div>
      </section>

      {/* Section 2: Cross-Service Reporting */}
      <section>
        <h2 style={sectionTitle}>ðŸ“Š Cross-Service Reporting</h2>
        <p style={sectionSub}>Generate reports pulling data from multiple schemas to analyze overall platform health and institutional performance.</p>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 14, marginTop: 16 }}>
          {reports.map(r => (
            <div key={r.report_id} style={{ background: '#111', border: '1px solid #1f1f1f', borderRadius: 14, padding: '18px 20px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: 16, flexWrap: 'wrap' }}>
                <div style={{ flex: 1 }}>
                  <div style={{ display: 'flex', gap: 10, alignItems: 'center', marginBottom: 8 }}>
                    <span style={{ ...pill, background: REPORT_STATUS_COLOR[r.status] + '20', color: REPORT_STATUS_COLOR[r.status] }}>
                      {r.status === 'generating' ? 'âŸ³ generating...' : r.status}
                    </span>
                    <strong style={{ fontSize: 13, color: '#fff' }}>{r.title}</strong>
                  </div>
                  <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap', marginBottom: 8 }}>
                    {r.schemas.map(s => <span key={s} style={{ ...pill, background: 'rgba(167,139,250,0.1)', color: '#a78bfa', fontSize: 10 }}>{s}</span>)}
                  </div>
                  <div style={{ display: 'flex', gap: 20, fontSize: 11, color: '#555' }}>
                    <span>{r.row_count.toLocaleString()} rows</span>
                    <span>Last generated: {r.last_generated}</span>
                  </div>
                </div>
                <div style={{ display: 'flex', gap: 8 }}>
                  <button style={actionBtn} type="button" onClick={() => regenerate(r.report_id)} disabled={r.status === 'generating'}>
                    {r.status === 'generating' ? 'Generating...' : 'Regenerate'}
                  </button>
                  {r.status === 'ready' && (
                    <button style={{ ...actionBtn, color: '#4ade80', borderColor: 'rgba(74,222,128,0.2)', background: 'rgba(74,222,128,0.08)' }} type="button">
                      Export CSV
                    </button>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
        <p style={{ fontSize: 11, color: '#555', marginTop: 12 }}>Connect to <code style={{ color: '#888' }}>POST /api/v1/system/reports/generate</code> and <code style={{ color: '#888' }}>GET /api/v1/system/reports/:id/export</code> for live data.</p>
      </section>
    </div>
  )
}

const sectionTitle: React.CSSProperties = { fontSize: 16, fontWeight: 800, color: '#fff', margin: '0 0 6px' }
const sectionSub: React.CSSProperties = { fontSize: 12, color: '#888', margin: 0 }
const pill: React.CSSProperties = { display: 'inline-flex', alignItems: 'center', fontSize: 11, fontWeight: 600, padding: '3px 9px', borderRadius: 20 }
const actionBtn: React.CSSProperties = { background: 'rgba(245,166,35,0.1)', border: '1px solid rgba(245,166,35,0.2)', borderRadius: 6, color: '#F5A623', fontSize: 11, fontWeight: 600, padding: '4px 12px', cursor: 'pointer', fontFamily: 'inherit' }

