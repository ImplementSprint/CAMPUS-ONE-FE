import Link from 'next/link';
import { SchoolStatusLookup } from '@/components/platform/SchoolStatusLookup';

export default function SchoolStatusPage() {
  return (
    <main className="min-h-screen bg-slate-50 px-4 py-10 text-slate-950">
      <section className="mx-auto max-w-3xl rounded-lg border border-slate-200 bg-white p-6 shadow-sm md:p-8">
        <Link href="/" className="text-sm font-semibold text-slate-600 hover:text-slate-950">
          Back to Campus Portal
        </Link>
        <p className="mt-8 text-xs font-semibold uppercase tracking-wide text-amber-700">School status</p>
        <h1 className="mt-2 text-3xl font-semibold text-slate-950">Find an approved school portal</h1>
        <p className="mt-3 text-sm leading-6 text-slate-600">
          Approved schools are searchable here. Pending registrations will appear after platform approval.
        </p>
        <div className="mt-8">
          <SchoolStatusLookup />
        </div>
      </section>
    </main>
  );
}
