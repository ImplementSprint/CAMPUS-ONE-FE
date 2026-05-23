import Link from 'next/link';

type SubmittedPageProps = {
  searchParams: Promise<{ school?: string }>;
};

export default async function SchoolSubmittedPage({ searchParams }: SubmittedPageProps) {
  const { school } = await searchParams;
  const slug = school?.trim().toLowerCase() ?? '';

  return (
    <main className="min-h-screen bg-[#f6f8fb] px-6 py-10 text-[#071943]">
      <div className="mx-auto grid min-h-[calc(100vh-5rem)] max-w-3xl place-items-center">
        <section className="w-full rounded-[8px] border border-[#dfe5ee] bg-white p-8 text-center shadow-sm sm:p-10">
          <p className="text-xs font-black uppercase tracking-[0.18em] text-[#ff5b00]">Submitted</p>
          <h1 className="mt-3 text-3xl font-black tracking-tight">Your school is in review</h1>
          <p className="mx-auto mt-4 max-w-xl text-sm leading-6 text-[#52607e]">
            Campus One received the registration. A platform reviewer will approve the portal, send owner access, or contact the representative if more details are needed.
          </p>

          {slug && (
            <div className="mx-auto mt-6 max-w-md rounded-[8px] border border-[#e6ebf2] bg-[#fbfcfe] p-4 text-left">
              <p className="text-xs font-black uppercase tracking-[0.12em] text-[#66728c]">Requested portal</p>
              <p className="mt-1 break-all text-sm font-black">{slug}.campusone.app</p>
            </div>
          )}

          <div className="mt-8 flex flex-col justify-center gap-3 sm:flex-row">
            <Link href={slug ? `/school/status?school=${encodeURIComponent(slug)}` : '/school/status'} className="inline-flex h-11 items-center justify-center rounded-[8px] bg-[#ff5b00] px-5 text-sm font-black text-white">
              Check status
            </Link>
            <Link href="/" className="inline-flex h-11 items-center justify-center rounded-[8px] border border-[#cfd8e5] bg-white px-5 text-sm font-black">
              Back to home
            </Link>
          </div>
        </section>
      </div>
    </main>
  );
}
