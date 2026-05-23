'use client';

import { useState } from 'react';
import { ArrowRight, Loader2, Search } from 'lucide-react';
import { buildSchoolPortalUrl } from '@campus-one/api-client';
import type { PublicSchool } from '@campus-one/shared-contracts';

export function SchoolStatusLookup() {
  const [slug, setSlug] = useState('');
  const [school, setSchool] = useState<PublicSchool | null>(null);
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);

  const submit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const normalized = slug.trim().toLowerCase();
    if (!normalized) return;

    setLoading(true);
    setMessage('');
    setSchool(null);

    try {
      const response = await fetch(`/api/schools/${encodeURIComponent(normalized)}`);
      const data = await response.json();
      if (!response.ok) {
        setMessage('No approved portal was found for that subdomain yet.');
        return;
      }
      setSchool(data);
    } catch {
      setMessage('Network error. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const portalUrl = school
    ? buildSchoolPortalUrl(school.schoolSlug, {
        baseUrl: process.env.NEXT_PUBLIC_SCHOOL_PORTAL_BASE_URL,
        platformDomain: process.env.NEXT_PUBLIC_SCHOOL_PORTAL_DOMAIN ?? process.env.NEXT_PUBLIC_TENANT_BASE_DOMAIN,
      })
    : null;

  return (
    <div className="space-y-5">
      <form onSubmit={submit} className="flex flex-col gap-3 sm:flex-row">
        <label className="min-w-0 flex-1">
          <span className="text-xs font-semibold uppercase tracking-wide text-slate-600">School subdomain</span>
          <input
            value={slug}
            onChange={(event) => setSlug(event.target.value)}
            placeholder="example-school"
            className="mt-1 h-11 w-full rounded-lg border border-slate-300 px-3 text-sm outline-none transition-colors focus:border-amber-600 focus:ring-2 focus:ring-amber-100"
          />
        </label>
        <button
          type="submit"
          disabled={loading}
          className="mt-auto inline-flex h-11 items-center justify-center gap-2 rounded-lg bg-slate-900 px-4 text-sm font-semibold text-white transition-colors hover:bg-slate-800 disabled:cursor-not-allowed disabled:opacity-60"
        >
          {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Search className="h-4 w-4" />}
          Check
        </button>
      </form>

      {message && <p className="text-sm text-slate-600">{message}</p>}

      {school && portalUrl && (
        <div className="rounded-lg border border-emerald-200 bg-emerald-50 p-4 text-sm text-emerald-900">
          <p className="font-semibold">{school.displayName} is approved.</p>
          <a
            href={portalUrl}
            className="mt-3 inline-flex items-center gap-2 font-semibold text-emerald-800 hover:text-emerald-950"
          >
            Open school portal
            <ArrowRight className="h-4 w-4" />
          </a>
        </div>
      )}
    </div>
  );
}
