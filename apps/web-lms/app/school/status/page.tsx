import Link from 'next/link';
import { headers } from 'next/headers';
import { buildSchoolPortalUrl } from '@campus-one/api-client';

type StatusPageProps = {
  searchParams: Promise<{ school?: string }>;
};

type SchoolStatus = {
  schoolId?: string;
  schoolSlug?: string;
  displayName?: string;
  schoolType?: string | null;
  status?: string | null;
};

async function getSchoolStatus(slug: string): Promise<{ school?: SchoolStatus; message?: string }> {
  if (!slug) return { message: 'Enter a school slug to check review status.' };

  const headerStore = await headers();
  const protocol = headerStore.get('x-forwarded-proto') ?? 'http';
  const host = headerStore.get('host') ?? 'localhost:3000';
  const baseUrl = `${protocol}://${host}`;

  try {
    const response = await fetch(`${baseUrl}/api/schools/${encodeURIComponent(slug)}`, { cache: 'no-store' });
    const data = await response.json();

    if (!response.ok) return { message: data.message ?? 'School status was not found.' };
    return { school: data };
  } catch {
    return { message: 'Could not load school status from the frontend proxy.' };
  }
}

function formatStatus(status?: string | null) {
  return status ? status.replace(/_/g, ' ') : 'pending review';
}

export default async function SchoolStatusPage({ searchParams }: StatusPageProps) {
  const { school } = await searchParams;
  const slug = school?.trim().toLowerCase() ?? '';
  const result = await getSchoolStatus(slug);
  const status = result.school?.status;
  const isApproved = status === 'approved';
  const portalUrl = result.school?.schoolSlug
    ? buildSchoolPortalUrl(result.school.schoolSlug, {
        platformDomain: process.env.NEXT_PUBLIC_TENANT_PORTAL_DOMAIN ?? 'itsandbox.site',
      })
    : null;

  return (
    <main className="min-h-screen bg-[#f6f8fb] px-6 py-10 text-[#071943]">
      <div className="mx-auto grid min-h-[calc(100vh-5rem)] max-w-3xl place-items-center">
        <section className="w-full rounded-[8px] border border-[#dfe5ee] bg-white p-8 shadow-sm sm:p-10">
          <p className="text-xs font-black uppercase tracking-[0.18em] text-[#ff5b00]">School Status</p>
          <h1 className="mt-3 text-3xl font-black tracking-tight">{result.school?.displayName ?? 'Review status'}</h1>

          {result.school ? (
            <div className="mt-6 rounded-[8px] border border-[#e6ebf2] bg-[#fbfcfe] p-5">
              <p className="text-xs font-black uppercase tracking-[0.12em] text-[#66728c]">Current state</p>
              <p className="mt-2 text-2xl font-black capitalize">{formatStatus(status)}</p>
              <p className="mt-2 break-all text-sm text-[#52607e]">{result.school.schoolSlug}.campusone.app</p>
            </div>
          ) : (
            <p className="mt-5 rounded-[8px] border border-amber-200 bg-amber-50 p-4 text-sm font-bold text-amber-900">{result.message}</p>
          )}

          <div className="mt-8 flex flex-col gap-3 sm:flex-row">
            {isApproved && result.school?.schoolSlug && (
              <Link href={portalUrl ?? '/'} className="inline-flex h-11 items-center justify-center rounded-[8px] bg-[#ff5b00] px-5 text-sm font-black text-white">
                Continue to portal
              </Link>
            )}
            <Link href="/" className="inline-flex h-11 items-center justify-center rounded-[8px] border border-[#cfd8e5] bg-white px-5 text-sm font-black">
              Back to home
            </Link>
          </div>
        </section>
      </div>
    </main>
  );
}
