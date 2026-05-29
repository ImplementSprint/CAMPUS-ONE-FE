import { headers } from 'next/headers';
import { redirect } from 'next/navigation';
import { hasSchoolOwnerActivationErrors, validateSchoolOwnerActivation } from '@/lib/owner-activation-validation';

type ActivatePageProps = {
  searchParams: Promise<{ token?: string; tokenHash?: string }>;
};

async function activateOwner(formData: FormData) {
  'use server';

  const token = String(formData.get('token') ?? '').trim();
  const tokenHash = String(formData.get('tokenHash') ?? '').trim();
  const password = String(formData.get('password') ?? '').trim();
  const validation = validateSchoolOwnerActivation({ token, tokenHash, password });

  if (hasSchoolOwnerActivationErrors(validation.errors)) {
    throw new Error(Object.values(validation.errors)[0] ?? 'Could not activate owner account.');
  }

  const headerStore = await headers();
  const protocol = headerStore.get('x-forwarded-proto') ?? 'http';
  const host = headerStore.get('host') ?? 'localhost:3000';
  const baseUrl = `${protocol}://${host}`;

  const response = await fetch(`${baseUrl}/api/school/owner-activation`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(validation.payload),
    cache: 'no-store',
  });

  const result = await response.json();
  if (!response.ok) {
    throw new Error(result.message ?? 'Could not activate owner account.');
  }

  redirect(result.portalUrl);
}

export default async function SchoolOwnerActivatePage({ searchParams }: ActivatePageProps) {
  const { token = '', tokenHash = '' } = await searchParams;

  return (
    <main className="min-h-screen bg-[#f6f8fb] px-6 py-10 text-[#071943]">
      <div className="mx-auto grid min-h-[calc(100vh-5rem)] max-w-3xl place-items-center">
        <section className="w-full rounded-[8px] border border-[#dfe5ee] bg-white p-8 shadow-sm sm:p-10">
          <p className="text-xs font-black uppercase tracking-[0.18em] text-[#ff5b00]">Owner Activation</p>
          <h1 className="mt-3 text-3xl font-black tracking-tight">Create your school owner account</h1>
          <form action={activateOwner} className="mt-8 space-y-4">
            <input type="hidden" name="token" value={token} />
            <input type="hidden" name="tokenHash" value={tokenHash} />
            <label className="block">
              <span className="text-sm font-black text-[#263654]">Password</span>
              <input
                name="password"
                type="password"
                minLength={8}
                required
                className="mt-2 h-12 w-full rounded-[8px] border border-[#cfd8e5] px-4 text-sm outline-none focus:border-[#ff5b00]"
              />
            </label>
            <button className="inline-flex h-11 items-center justify-center rounded-[8px] bg-[#ff5b00] px-5 text-sm font-black text-white">
              Activate account
            </button>
          </form>
        </section>
      </div>
    </main>
  );
}
