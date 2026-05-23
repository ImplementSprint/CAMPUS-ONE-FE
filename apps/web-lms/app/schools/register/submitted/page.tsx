import Link from 'next/link';

type SubmittedPageProps = {
  searchParams: Promise<{ school?: string }>;
};

export default async function SubmittedPage({ searchParams }: SubmittedPageProps) {
  const { school } = await searchParams;
  const slug = school?.trim().toLowerCase();

  return (
    <main className="min-h-screen bg-slate-50 px-4 py-10 text-slate-950">
      <section className="mx-auto max-w-3xl rounded-lg border border-slate-200 bg-white p-6 shadow-sm md:p-8">
        <p className="text-xs font-semibold uppercase tracking-wide text-amber-700">Submitted</p>
        <h1 className="mt-2 text-3xl font-semibold text-slate-950">School registration is under review</h1>
        <p className="mt-3 text-sm leading-6 text-slate-600">
          The platform team will review the school profile, validate the requested subdomain, and activate the portal after approval.
        </p>
        {slug && (
          <p className="mt-5 rounded-lg border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-700">
            Requested subdomain: <span className="font-semibold text-slate-950">{slug}</span>
          </p>
        )}
        <div className="mt-6 flex flex-wrap gap-3">
          <Link
            href="/schools/status"
            className="inline-flex h-10 items-center rounded-lg bg-slate-950 px-4 text-sm font-semibold text-white hover:bg-slate-800"
          >
            Check status
          </Link>
          <Link
            href="/"
            className="inline-flex h-10 items-center rounded-lg border border-slate-300 px-4 text-sm font-semibold text-slate-700 hover:bg-slate-50"
          >
            Back to portal
          </Link>
        </div>
      </section>
    </main>
  );
}
