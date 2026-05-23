'use client';

import type { SchoolOnboardingStatus, SchoolReviewRecord } from '@campus-one/shared-contracts';
import { Check, Loader2, RefreshCcw, RotateCcw, ShieldAlert, X } from 'lucide-react';
import { useEffect, useMemo, useState } from 'react';

type ReviewAction = 'approve' | 'reject' | 'suspend' | 'reactivate';

const statusStyles: Record<SchoolOnboardingStatus, string> = {
  pending_review: 'bg-amber-50 text-amber-800 border-amber-200',
  approved: 'bg-emerald-50 text-emerald-800 border-emerald-200',
  rejected: 'bg-rose-50 text-rose-800 border-rose-200',
  suspended: 'bg-slate-100 text-slate-700 border-slate-200',
};

function formatStatus(status: string) {
  return status.replace(/_/g, ' ');
}

function actionLabel(action: ReviewAction) {
  return action.charAt(0).toUpperCase() + action.slice(1);
}

function visibleActions(record: SchoolReviewRecord): ReviewAction[] {
  if (record.onboardingStatus === 'pending_review') return ['approve', 'reject'];
  if (record.onboardingStatus === 'approved') return ['suspend'];
  if (record.onboardingStatus === 'suspended') return ['reactivate'];
  if (record.onboardingStatus === 'rejected') return ['approve'];
  return [];
}

export function PlatformSchoolsDashboard() {
  const [schools, setSchools] = useState<SchoolReviewRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState('');
  const [actingKey, setActingKey] = useState('');

  const counts = useMemo(() => {
    return schools.reduce(
      (acc, record) => {
        acc.total += 1;
        acc[record.onboardingStatus] += 1;
        return acc;
      },
      { total: 0, pending_review: 0, approved: 0, rejected: 0, suspended: 0 },
    );
  }, [schools]);

  async function loadSchools() {
    setLoading(true);
    setMessage('');

    try {
      const response = await fetch('/api/platform/schools', { cache: 'no-store' });
      const data = await response.json();

      if (!response.ok) {
        setMessage(data.message ?? 'Could not load platform school reviews.');
        setSchools([]);
        return;
      }

      setSchools(data.schools ?? []);
    } catch {
      setMessage('Could not reach the platform review proxy.');
      setSchools([]);
    } finally {
      setLoading(false);
    }
  }

  async function submitAction(record: SchoolReviewRecord, action: ReviewAction) {
    const reason =
      action === 'reject' || action === 'suspend'
        ? window.prompt(`${actionLabel(action)} reason`, record.rejectionReason ?? '')
        : '';

    if ((action === 'reject' || action === 'suspend') && reason === null) return;

    const key = `${record.school.schoolId}:${action}`;
    setActingKey(key);
    setMessage('');

    try {
      const response = await fetch(`/api/platform/schools/${encodeURIComponent(record.school.schoolId)}/${action}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(reason ? { reason } : {}),
      });
      const data = await response.json();

      if (!response.ok) {
        setMessage(data.message ?? `Could not ${action} school.`);
        return;
      }

      await loadSchools();
    } catch {
      setMessage(`Could not ${action} school.`);
    } finally {
      setActingKey('');
    }
  }

  useEffect(() => {
    void loadSchools();
  }, []);

  return (
    <main className="min-h-screen bg-[#f6f8fb] text-[#071943]">
      <div className="mx-auto max-w-[1440px] px-6 py-8 lg:px-10">
        <header className="flex flex-col gap-5 border-b border-[#dfe5ee] pb-6 lg:flex-row lg:items-end lg:justify-between">
          <div>
            <p className="text-xs font-black uppercase tracking-[0.18em] text-[#ff5b00]">Platform Review</p>
            <h1 className="mt-2 text-3xl font-black tracking-tight">School review queue</h1>
            <p className="mt-2 max-w-2xl text-sm leading-6 text-[#52607e]">
              Review submitted schools, approve portals, and manage suspended institutions using the backend platform contracts.
            </p>
          </div>
          <button
            type="button"
            onClick={() => void loadSchools()}
            className="inline-flex h-10 items-center justify-center gap-2 rounded-[8px] border border-[#cfd8e5] bg-white px-4 text-sm font-black text-[#071943] shadow-sm hover:bg-[#fbfcfe]"
          >
            <RefreshCcw className="h-4 w-4" />
            Refresh
          </button>
        </header>

        <section className="mt-6 grid gap-4 sm:grid-cols-2 xl:grid-cols-5">
          {[
            ['Total', counts.total],
            ['Pending', counts.pending_review],
            ['Approved', counts.approved],
            ['Rejected', counts.rejected],
            ['Suspended', counts.suspended],
          ].map(([label, value]) => (
            <div key={label} className="rounded-[8px] border border-[#dfe5ee] bg-white p-5 shadow-sm">
              <p className="text-xs font-black uppercase tracking-[0.12em] text-[#66728c]">{label}</p>
              <p className="mt-2 text-3xl font-black">{value}</p>
            </div>
          ))}
        </section>

        {message && (
          <div className="mt-6 flex items-start gap-3 rounded-[8px] border border-amber-200 bg-amber-50 p-4 text-sm font-bold text-amber-900">
            <ShieldAlert className="mt-0.5 h-4 w-4 shrink-0" />
            {message}
          </div>
        )}

        <section className="mt-6 overflow-hidden rounded-[8px] border border-[#dfe5ee] bg-white shadow-sm">
          <div className="grid grid-cols-[1.2fr_0.8fr_0.8fr_0.75fr_1fr] gap-4 border-b border-[#e6ebf2] bg-[#fbfcfe] px-5 py-3 text-xs font-black uppercase tracking-[0.12em] text-[#66728c] max-lg:hidden">
            <span>School</span>
            <span>Representative</span>
            <span>Contact</span>
            <span>Status</span>
            <span>Actions</span>
          </div>

          {loading ? (
            <div className="flex min-h-[260px] items-center justify-center gap-3 text-sm font-bold text-[#52607e]">
              <Loader2 className="h-5 w-5 animate-spin" />
              Loading school reviews
            </div>
          ) : schools.length === 0 ? (
            <div className="grid min-h-[260px] place-items-center px-6 text-center">
              <div>
                <p className="text-lg font-black">No school reviews found</p>
                <p className="mt-2 text-sm text-[#52607e]">Submitted school registrations will appear here when the backend returns review records.</p>
              </div>
            </div>
          ) : (
            <div className="divide-y divide-[#eef2f6]">
              {schools.map((record) => (
                <article key={record.school.schoolId} className="grid gap-4 px-5 py-5 lg:grid-cols-[1.2fr_0.8fr_0.8fr_0.75fr_1fr] lg:items-center">
                  <div>
                    <p className="font-black">{record.school.displayName}</p>
                    <p className="mt-1 text-sm text-[#52607e]">{record.school.schoolSlug}.campusone.app</p>
                    <p className="mt-1 text-xs font-bold text-[#66728c]">{record.schoolType}</p>
                  </div>
                  <div>
                    <p className="text-sm font-bold">{record.representative}</p>
                    <p className="mt-1 text-xs text-[#66728c]">{record.contactNumber}</p>
                  </div>
                  <div>
                    <p className="break-all text-sm font-bold">{record.contactEmail}</p>
                    <p className="mt-1 text-xs text-[#66728c]">Invitation: {record.ownerInvitationStatus ?? 'pending'}</p>
                  </div>
                  <div>
                    <span className={`inline-flex rounded-[999px] border px-3 py-1 text-xs font-black capitalize ${statusStyles[record.onboardingStatus]}`}>
                      {formatStatus(record.onboardingStatus)}
                    </span>
                    {record.rejectionReason && <p className="mt-2 text-xs text-rose-700">{record.rejectionReason}</p>}
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {visibleActions(record).map((action) => {
                      const key = `${record.school.schoolId}:${action}`;
                      const busy = actingKey === key;
                      const Icon = action === 'approve' || action === 'reactivate' ? Check : action === 'reject' ? X : RotateCcw;

                      return (
                        <button
                          key={action}
                          type="button"
                          disabled={Boolean(actingKey)}
                          onClick={() => void submitAction(record, action)}
                          className="inline-flex h-9 items-center justify-center gap-2 rounded-[8px] border border-[#d7e0eb] bg-white px-3 text-xs font-black text-[#071943] hover:bg-[#f6f8fb] disabled:cursor-not-allowed disabled:opacity-60"
                        >
                          {busy ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : <Icon className="h-3.5 w-3.5" />}
                          {actionLabel(action)}
                        </button>
                      );
                    })}
                  </div>
                </article>
              ))}
            </div>
          )}
        </section>
      </div>
    </main>
  );
}
