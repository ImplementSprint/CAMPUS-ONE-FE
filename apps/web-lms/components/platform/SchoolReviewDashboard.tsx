'use client';

import { useCallback, useEffect, useMemo, useState, type ReactNode } from 'react';
import {
  Check,
  ExternalLink,
  Loader2,
  PauseCircle,
  RefreshCcw,
  RotateCcw,
  X,
} from 'lucide-react';
import { buildSchoolPortalUrl } from '@campus-one/api-client';
import type { PlatformSchoolReviewActionResponse, PlatformSchoolReviewRecord } from '@campus-one/shared-contracts';

const FILTERS = [
  { label: 'Pending', value: 'pending_review' },
  { label: 'Approved', value: 'approved' },
  { label: 'Rejected', value: 'rejected' },
  { label: 'Suspended', value: 'suspended' },
] as const;

type ReviewAction = 'approve' | 'reject' | 'suspend' | 'reactivate';
type ReviewFilter = (typeof FILTERS)[number]['value'];

export function SchoolReviewDashboard() {
  const [filter, setFilter] = useState<ReviewFilter>(FILTERS[0].value);
  const [schools, setSchools] = useState<PlatformSchoolReviewRecord[]>([]);
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState<ReviewAction | null>(null);
  const [pendingAction, setPendingAction] = useState<ReviewAction | null>(null);
  const [reason, setReason] = useState('');
  const [message, setMessage] = useState('');

  const selectedSchool = useMemo(
    () => schools.find((school) => school.id === selectedId) ?? schools[0] ?? null,
    [schools, selectedId],
  );

  const loadSchools = useCallback(async () => {
    setLoading(true);
    setMessage('');

    try {
      const response = await fetch(`/api/platform/schools?status=${encodeURIComponent(filter)}`);
      const data = await response.json();
      if (!response.ok) {
        setMessage(data.message ?? 'Could not load schools.');
        setSchools([]);
        return;
      }
      setSchools(data.schools ?? []);
      setSelectedId((current) => current ?? data.schools?.[0]?.id ?? null);
    } catch {
      setMessage('Network error. Please try again.');
      setSchools([]);
    } finally {
      setLoading(false);
    }
  }, [filter]);

  useEffect(() => {
    void loadSchools();
  }, [loadSchools]);

  const runAction = async (action: ReviewAction) => {
    if (!selectedSchool) return;
    if ((action === 'reject' || action === 'suspend') && !reason.trim()) {
      setPendingAction(action);
      setMessage('Add a reason before continuing.');
      return;
    }

    setActionLoading(action);
    setMessage('');

    try {
      const response = await fetch(`/api/platform/schools/${selectedSchool.id}/${action}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ reason: reason.trim() || undefined }),
      });
      const data = await response.json() as PlatformSchoolReviewActionResponse | { message?: string };

      if (!response.ok) {
        setMessage(data.message ?? 'Review action failed.');
        return;
      }

      setMessage(data.message ?? 'School updated.');
      setReason('');
      setPendingAction(null);
      await loadSchools();
    } catch {
      setMessage('Network error. Please try again.');
    } finally {
      setActionLoading(null);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-3 border-b border-slate-200 pb-5 lg:flex-row lg:items-end lg:justify-between">
        <div>
          <p className="text-xs font-semibold uppercase tracking-wide text-amber-700">Platform operations</p>
          <h1 className="mt-1 text-2xl font-semibold text-slate-950">School review queue</h1>
          <p className="mt-2 max-w-2xl text-sm text-slate-600">
            Review new school registrations, control portal activation, and open approved tenant portals.
          </p>
        </div>
        <button
          type="button"
          onClick={() => void loadSchools()}
          className="inline-flex h-10 items-center justify-center gap-2 rounded-lg border border-slate-300 px-3 text-sm font-semibold text-slate-700 transition-colors hover:bg-slate-50"
        >
          <RefreshCcw className="h-4 w-4" />
          Refresh
        </button>
      </div>

      <div className="flex flex-wrap gap-2">
        {FILTERS.map((item) => (
          <button
            key={item.value}
            type="button"
            onClick={() => {
              setFilter(item.value);
              setSelectedId(null);
            }}
            className={`h-9 rounded-lg px-3 text-sm font-semibold transition-colors ${
              filter === item.value
                ? 'bg-slate-950 text-white'
                : 'border border-slate-300 text-slate-700 hover:bg-slate-50'
            }`}
          >
            {item.label}
          </button>
        ))}
      </div>

      {message && <p className="rounded-lg border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-900">{message}</p>}

      <div className="grid gap-6 xl:grid-cols-[minmax(0,1fr)_360px]">
        <div className="overflow-hidden rounded-lg border border-slate-200 bg-white">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-slate-200 text-sm">
              <thead className="bg-slate-50 text-left text-xs font-semibold uppercase tracking-wide text-slate-500">
                <tr>
                  <th className="px-4 py-3">School</th>
                  <th className="px-4 py-3">Subdomain</th>
                  <th className="px-4 py-3">Status</th>
                  <th className="px-4 py-3">Owner</th>
                  <th className="px-4 py-3">Submitted</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {loading ? (
                  <tr>
                    <td colSpan={5} className="px-4 py-10 text-center text-slate-500">
                      <Loader2 className="mx-auto mb-2 h-5 w-5 animate-spin" />
                      Loading schools
                    </td>
                  </tr>
                ) : schools.length === 0 ? (
                  <tr>
                    <td colSpan={5} className="px-4 py-10 text-center text-slate-500">
                      No schools in this queue.
                    </td>
                  </tr>
                ) : (
                  schools.map((school) => (
                    <tr
                      key={school.id}
                      onClick={() => setSelectedId(school.id)}
                      className={`cursor-pointer transition-colors ${
                        selectedSchool?.id === school.id ? 'bg-amber-50/70' : 'hover:bg-slate-50'
                      }`}
                    >
                      <td className="px-4 py-3">
                        <span className="block font-semibold text-slate-950">{school.name}</span>
                        <span className="block text-xs text-slate-500">{school.email}</span>
                      </td>
                      <td className="px-4 py-3 text-slate-700">{school.targetSubdomain}</td>
                      <td className="px-4 py-3">
                        <StatusBadge status={school.status} />
                      </td>
                      <td className="px-4 py-3 text-slate-700">{school.ownerActivationStatus}</td>
                      <td className="px-4 py-3 text-slate-700">{formatDate(school.createdAt)}</td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>

        <ReviewPanel
          school={selectedSchool}
          pendingAction={pendingAction}
          reason={reason}
          actionLoading={actionLoading}
          onReasonChange={setReason}
          onChooseAction={setPendingAction}
          onRunAction={(action) => void runAction(action)}
        />
      </div>
    </div>
  );
}

function ReviewPanel(props: {
  school: PlatformSchoolReviewRecord | null;
  pendingAction: ReviewAction | null;
  reason: string;
  actionLoading: ReviewAction | null;
  onReasonChange: (value: string) => void;
  onChooseAction: (action: ReviewAction | null) => void;
  onRunAction: (action: ReviewAction) => void;
}) {
  if (!props.school) {
    return (
      <aside className="rounded-lg border border-slate-200 bg-white p-5 text-sm text-slate-500">
        Select a school to review details.
      </aside>
    );
  }

  const portalUrl = props.school.status === 'approved'
    ? buildSchoolPortalUrl(props.school.targetSubdomain, {
        platformDomain: process.env.NEXT_PUBLIC_SCHOOL_PORTAL_DOMAIN ?? process.env.NEXT_PUBLIC_TENANT_BASE_DOMAIN ?? 'itsandbox.site',
      })
    : null;

  return (
    <aside className="rounded-lg border border-slate-200 bg-white p-5">
      <div className="border-b border-slate-200 pb-4">
        <StatusBadge status={props.school.status} />
        <h2 className="mt-3 text-lg font-semibold text-slate-950">{props.school.name}</h2>
        <p className="mt-1 text-sm text-slate-600">{props.school.representative}</p>
      </div>

      <dl className="mt-4 space-y-3 text-sm">
        <Detail label="Email" value={props.school.email} />
        <Detail label="Contact" value={props.school.contactNumber} />
        <Detail label="School type" value={props.school.schoolType} />
        <Detail label="Subdomain" value={props.school.targetSubdomain} />
        <Detail label="Setup progress" value={`${props.school.setupProgress}%`} />
        {props.school.rejectionReason && <Detail label="Rejection reason" value={props.school.rejectionReason} />}
      </dl>

      {portalUrl && (
        <a
          href={portalUrl}
          target="_blank"
          rel="noreferrer"
          className="mt-5 inline-flex h-10 w-full items-center justify-center gap-2 rounded-lg border border-slate-300 text-sm font-semibold text-slate-700 transition-colors hover:bg-slate-50"
        >
          <ExternalLink className="h-4 w-4" />
          Open tenant portal
        </a>
      )}

      <div className="mt-5 grid grid-cols-2 gap-2">
        {props.school.status !== 'approved' && (
          <ActionButton action="approve" label="Approve" icon={<Check className="h-4 w-4" />} {...props} />
        )}
        {props.school.status === 'approved' && (
          <ActionButton action="suspend" label="Suspend" icon={<PauseCircle className="h-4 w-4" />} {...props} />
        )}
        {props.school.status === 'suspended' && (
          <ActionButton action="reactivate" label="Reactivate" icon={<RotateCcw className="h-4 w-4" />} {...props} />
        )}
        {props.school.status !== 'rejected' && (
          <ActionButton action="reject" label="Reject" icon={<X className="h-4 w-4" />} {...props} />
        )}
      </div>

      {(props.pendingAction === 'reject' || props.pendingAction === 'suspend') && (
        <div className="mt-4">
          <label className="text-xs font-semibold uppercase tracking-wide text-slate-600" htmlFor="review-reason">
            Reason
          </label>
          <textarea
            id="review-reason"
            value={props.reason}
            onChange={(event) => props.onReasonChange(event.target.value)}
            rows={4}
            className="mt-1 w-full resize-none rounded-lg border border-slate-300 p-3 text-sm outline-none transition-colors focus:border-amber-600 focus:ring-2 focus:ring-amber-100"
          />
          <button
            type="button"
            onClick={() => props.onRunAction(props.pendingAction as ReviewAction)}
            disabled={Boolean(props.actionLoading)}
            className="mt-3 inline-flex h-10 w-full items-center justify-center gap-2 rounded-lg bg-slate-950 text-sm font-semibold text-white transition-colors hover:bg-slate-800 disabled:cursor-not-allowed disabled:opacity-60"
          >
            {props.actionLoading ? <Loader2 className="h-4 w-4 animate-spin" /> : <ArrowIcon />}
            Continue
          </button>
        </div>
      )}
    </aside>
  );
}

function ActionButton(props: {
  action: ReviewAction;
  label: string;
  icon: ReactNode;
  pendingAction: ReviewAction | null;
  actionLoading: ReviewAction | null;
  onChooseAction: (action: ReviewAction | null) => void;
  onRunAction: (action: ReviewAction) => void;
}) {
  const requiresReason = props.action === 'reject' || props.action === 'suspend';
  const active = props.pendingAction === props.action;

  return (
    <button
      type="button"
      onClick={() => {
        if (requiresReason) {
          props.onChooseAction(active ? null : props.action);
          return;
        }
        props.onRunAction(props.action);
      }}
      disabled={Boolean(props.actionLoading)}
      className={`inline-flex h-10 items-center justify-center gap-2 rounded-lg border px-3 text-sm font-semibold transition-colors disabled:cursor-not-allowed disabled:opacity-60 ${
        active ? 'border-slate-950 bg-slate-950 text-white' : 'border-slate-300 text-slate-700 hover:bg-slate-50'
      }`}
    >
      {props.actionLoading === props.action ? <Loader2 className="h-4 w-4 animate-spin" /> : props.icon}
      {props.label}
    </button>
  );
}

function ArrowIcon() {
  return <Check className="h-4 w-4" />;
}

function Detail(props: { label: string; value: string }) {
  return (
    <div>
      <dt className="text-xs font-semibold uppercase tracking-wide text-slate-500">{props.label}</dt>
      <dd className="mt-0.5 break-words text-slate-900">{props.value}</dd>
    </div>
  );
}

function StatusBadge({ status }: { status: string }) {
  const styles: Record<string, string> = {
    pending_review: 'border-amber-200 bg-amber-50 text-amber-800',
    approved: 'border-emerald-200 bg-emerald-50 text-emerald-800',
    rejected: 'border-red-200 bg-red-50 text-red-800',
    suspended: 'border-slate-300 bg-slate-100 text-slate-700',
  };

  return (
    <span className={`inline-flex rounded-full border px-2.5 py-1 text-xs font-semibold ${styles[status] ?? styles.suspended}`}>
      {status.replace(/_/g, ' ')}
    </span>
  );
}

function formatDate(value: string) {
  return new Intl.DateTimeFormat('en', { month: 'short', day: 'numeric', year: 'numeric' }).format(new Date(value));
}
