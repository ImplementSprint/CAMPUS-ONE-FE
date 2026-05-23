'use client';

import { useEffect, useState } from 'react';
import { ProtectedRoute } from '@/app/components/ProtectedRoute';
import { getAuditEvents, type AuditEvent } from '@/lib/api';

function AuditPageContent() {
  const [events, setEvents] = useState<AuditEvent[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    setLoading(true);
    getAuditEvents(100)
      .then((result) => {
        setEvents((result.events ?? []) as AuditEvent[]);
        setError(null);
      })
      .catch((auditError) => {
        setError(auditError instanceof Error ? auditError.message : 'Could not load audit events');
      })
      .finally(() => setLoading(false));
  }, []);

  return (
    <main className="min-h-screen bg-slate-50 px-6 py-8">
      <section className="mx-auto max-w-6xl space-y-5">
        <header>
          <h1 className="text-3xl font-black tracking-tight text-slate-950">Audit Events</h1>
          <p className="mt-2 text-sm text-slate-600">Review recent platform and school activity captured by backend audit logging.</p>
        </header>

        <div className="overflow-hidden rounded-lg border border-slate-200 bg-white shadow-sm">
          <div className="grid grid-cols-[1.1fr_1fr_1fr_1.2fr] gap-4 border-b border-slate-200 bg-slate-100 px-4 py-3 text-xs font-bold uppercase tracking-wide text-slate-600">
            <div>Action</div>
            <div>Actor</div>
            <div>Tenant</div>
            <div>Created</div>
          </div>

          {loading ? (
            <div className="px-4 py-8 text-sm text-slate-500">Loading audit events...</div>
          ) : error ? (
            <div className="px-4 py-8 text-sm text-red-600">{error}</div>
          ) : events.length === 0 ? (
            <div className="px-4 py-8 text-sm text-slate-500">No audit events found.</div>
          ) : events.map((event, index) => (
            <div key={event.id ?? `${event.action}-${index}`} className="grid grid-cols-[1.1fr_1fr_1fr_1.2fr] gap-4 border-b border-slate-100 px-4 py-4 text-sm last:border-b-0">
              <div className="font-semibold text-slate-950">{event.action}</div>
              <div className="text-slate-700">{event.actor_email ?? 'Unknown'}</div>
              <div className="text-slate-700">{event.institution_id ?? 'Platform'}</div>
              <div className="text-slate-500">{new Date(event.created_at).toLocaleString()}</div>
            </div>
          ))}
        </div>
      </section>
    </main>
  );
}

export default function AuditPage() {
  return (
    <ProtectedRoute allowedRoles={['super_admin']}>
      <AuditPageContent />
    </ProtectedRoute>
  );
}
