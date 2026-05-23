'use client';

import Image from 'next/image';
import { useSearchParams } from 'next/navigation';
import { ArrowRight, LockKeyhole } from 'lucide-react';
import { FormEvent, Suspense, useState } from 'react';

import { getRedirectPath, loginWithSupabase } from '@/lib/auth.service';

function LoginForm() {
  const searchParams = useSearchParams();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);

  async function handleSubmit(event: FormEvent) {
    event.preventDefault();
    setMessage('');
    setLoading(true);

    const result = await loginWithSupabase(email, password);
    if (!result.success || !result.user) {
      setMessage(result.error ?? 'Invalid email or password.');
      setLoading(false);
      return;
    }

    const requestedNext = searchParams.get('next');
    const fallback = getRedirectPath(result.user.role);
    window.location.href = requestedNext && requestedNext.startsWith('/') ? requestedNext : fallback;
  }

  return (
    <main className="min-h-screen bg-[#f6f8fb] px-6 py-10 text-[#071943]">
      <div className="mx-auto flex min-h-[calc(100vh-5rem)] max-w-[1080px] items-center justify-center">
        <div className="grid w-full overflow-hidden rounded-[8px] border border-[#dfe5ee] bg-white shadow-[0_20px_55px_rgba(17,30,64,0.10)] lg:grid-cols-[0.95fr_1.05fr]">
          <section className="flex flex-col justify-between bg-[#071943] p-8 text-white sm:p-10">
            <div>
              <span className="relative mb-8 flex h-12 w-12 overflow-hidden rounded-[8px]">
                <Image src="/brand/tigo-app-icon.png" alt="" fill sizes="48px" className="object-cover" priority />
              </span>
              <h1 className="max-w-[420px] text-3xl font-black leading-tight sm:text-4xl">Sign in to Campus One operations.</h1>
              <p className="mt-5 max-w-[430px] text-sm leading-6 text-white/72">
                School teams continue to their workspace. Super admins are routed to the platform school review queue.
              </p>
            </div>
            <p className="mt-10 text-xs font-bold uppercase tracking-[0.18em] text-white/45">Platform Access</p>
          </section>

          <section className="p-8 sm:p-10">
            <div className="mb-7">
              <span className="mb-4 flex h-11 w-11 items-center justify-center rounded-[8px] bg-[#fff2e9] text-[#ff5b00]">
                <LockKeyhole className="h-5 w-5" />
              </span>
              <h2 className="text-2xl font-black">Login</h2>
              <p className="mt-1 text-sm text-[#52607e]">Use your Campus One account credentials.</p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              <label className="block">
                <span className="mb-1 block text-xs font-black uppercase text-[#435176]">Email address</span>
                <input
                  required
                  type="email"
                  value={email}
                  onChange={(event) => setEmail(event.target.value)}
                  className="h-12 w-full rounded-[8px] border border-[#dfe5ee] bg-[#fbfcfe] px-3 text-sm outline-none focus:border-[#ff8c45]"
                  placeholder="name@campusone.app"
                />
              </label>

              <label className="block">
                <span className="mb-1 block text-xs font-black uppercase text-[#435176]">Password</span>
                <input
                  required
                  type="password"
                  value={password}
                  onChange={(event) => setPassword(event.target.value)}
                  className="h-12 w-full rounded-[8px] border border-[#dfe5ee] bg-[#fbfcfe] px-3 text-sm outline-none focus:border-[#ff8c45]"
                  placeholder="Enter password"
                />
              </label>

              {message && <p className="rounded-[8px] border border-rose-200 bg-rose-50 p-3 text-sm font-bold text-rose-700">{message}</p>}

              <button
                type="submit"
                disabled={loading}
                className="inline-flex h-12 w-full items-center justify-center gap-3 rounded-[8px] bg-[#ff5b00] px-5 text-sm font-black text-white transition hover:bg-[#e94f00] disabled:cursor-not-allowed disabled:opacity-60"
              >
                {loading ? 'Signing in...' : 'Sign in'}
                <ArrowRight className="h-4 w-4" />
              </button>
            </form>
          </section>
        </div>
      </div>
    </main>
  );
}

export default function LoginPage() {
  return (
    <Suspense
      fallback={
        <main className="grid min-h-screen place-items-center bg-[#f6f8fb] px-6 text-sm font-bold text-[#52607e]">
          Loading login
        </main>
      }
    >
      <LoginForm />
    </Suspense>
  );
}
