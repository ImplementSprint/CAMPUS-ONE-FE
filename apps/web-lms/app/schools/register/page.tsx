import Link from 'next/link';
import { SchoolRegistrationForm } from '@/components/platform/SchoolRegistrationForm';

export default function SchoolRegistrationPage() {
  return (
    <main className="min-h-screen bg-slate-50 px-4 py-10 text-slate-950">
      <div className="mx-auto max-w-5xl">
        <Link href="/" className="text-sm font-semibold text-slate-600 hover:text-slate-950">
          Back to Campus Portal
        </Link>
        <section className="mt-8 rounded-lg border border-slate-200 bg-white p-6 shadow-sm md:p-8">
          <p className="text-xs font-semibold uppercase tracking-wide text-amber-700">School onboarding</p>
          <h1 className="mt-2 text-3xl font-semibold tracking-normal text-slate-950">Register a school portal</h1>
          <p className="mt-3 max-w-2xl text-sm leading-6 text-slate-600">
            Submit the school details for platform review. Approved schools receive an internal portal on their assigned subdomain.
          </p>
          <div className="mt-8">
            <SchoolRegistrationForm />
          </div>
        </section>
      </div>
    </main>
  );
}
