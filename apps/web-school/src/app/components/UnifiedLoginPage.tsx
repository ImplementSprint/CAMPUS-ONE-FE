'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { AlertCircle, ArrowLeft, Loader2 } from 'lucide-react';
import { getRedirectPath, isAdminRole, login } from '@/services/auth.service';
import { schoolPortalLabels } from '@/shared/school-reference';
import { FormField } from '@/shared/ui/forms/FormField';
import { Surface } from '@/shared/ui/layout/Surface';

export function UnifiedLoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const checkIsMobile = () => {
    if (typeof window === 'undefined') return false;
    return /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
  };

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    setError('');
    setLoading(true);

    try {
      const result = await login({ email, password });
      if (result.success && result.user) {
        if (isAdminRole(result.user.role) && checkIsMobile()) {
          setError('School administration is available from desktop browsers only.');
          setLoading(false);
          return;
        }

        window.location.assign(getRedirectPath(result.user.role));
      } else {
        setError(result.error || 'Sign in failed. Check your email and password, then try again.');
      }
    } catch {
      setError('Sign in failed. Check your connection and try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="grid min-h-screen bg-campus-page text-campus-ink md:grid-cols-[minmax(280px,440px)_1fr]">
      <section className="hidden border-r border-neutral-800 bg-campus-ink px-10 py-9 text-white md:flex md:flex-col md:justify-between">
        <div className="flex items-center gap-3">
          <span className="grid h-10 w-10 place-items-center overflow-hidden rounded-lg bg-white">
            <img src="/logo.png" alt="" className="h-8 w-8 object-contain" />
          </span>
          <div>
            <p className="text-lg font-semibold">{schoolPortalLabels.productName}</p>
            <p className="text-sm text-campus-brand">{schoolPortalLabels.publicPortal}</p>
          </div>
        </div>

        <div className="max-w-sm">
          <h2 className="text-2xl font-semibold text-white">Campus One School Portal</h2>
          <p className="mt-3 text-sm leading-6 text-neutral-300">
            Sign in to continue to student, faculty, alumni, or administration tools.
          </p>
        </div>

        <p className="text-xs text-neutral-500">Copyright 2026 Campus One.</p>
      </section>

      <section className="flex min-w-0 flex-col">
        <header className="flex h-14 items-center justify-between border-b border-campus-border bg-white px-4 md:hidden">
          <button
            type="button"
            aria-label="Back to school portal"
            onClick={() => router.push('/')}
            className="grid h-11 w-11 place-items-center rounded-md border border-campus-border bg-white text-campus-ink"
          >
            <ArrowLeft className="h-5 w-5" aria-hidden="true" />
          </button>
          <div className="text-center">
            <p className="text-sm font-semibold">{schoolPortalLabels.productName}</p>
            <p className="text-xs text-campus-muted">{schoolPortalLabels.publicPortal}</p>
          </div>
          <span className="h-11 w-11" aria-hidden="true" />
        </header>

        <div className="flex flex-1 items-center justify-center px-4 py-8 md:px-8">
          <Surface className="w-full max-w-md p-5 sm:p-6">
            <div>
              <h1 className="text-2xl font-semibold text-campus-ink">Sign in</h1>
              <p className="mt-1 text-sm text-campus-muted">Sign in to access your portal.</p>
            </div>

            <div className="mt-5 rounded-lg border border-campus-border bg-[#fbfaf6] p-4">
              <p className="text-sm font-medium text-campus-ink">Portal access</p>
              <ul className="mt-2 space-y-1 text-sm text-campus-muted">
                <li>Students can view grades, subjects, and school records.</li>
                <li>Faculty can manage classes and encode grades.</li>
                <li>Alumni and school administrators use their assigned accounts.</li>
              </ul>
            </div>

            {error ? (
              <div role="alert" className="mt-5 flex gap-3 rounded-lg border border-red-200 bg-red-50 p-3 text-sm text-red-800">
                <AlertCircle className="mt-0.5 h-5 w-5 flex-shrink-0" aria-hidden="true" />
                <p>{error}</p>
              </div>
            ) : null}

            <form onSubmit={handleSubmit} className="mt-5 grid gap-4">
              <FormField id="email" label="Email address">
                <input
                  id="email"
                  name="email"
                  type="email"
                  autoComplete="email"
                  value={email}
                  onChange={(event) => setEmail(event.target.value)}
                  required
                  disabled={loading}
                  className="h-11 w-full rounded-md border border-neutral-300 bg-white px-3 text-sm text-neutral-950 outline-none focus:border-campus-brand focus:ring-2 focus:ring-campus-brand/30 disabled:cursor-not-allowed disabled:bg-neutral-100"
                  placeholder="your.email@example.com"
                />
              </FormField>

              <FormField id="password" label="Password">
                <input
                  id="password"
                  name="password"
                  type="password"
                  autoComplete="current-password"
                  value={password}
                  onChange={(event) => setPassword(event.target.value)}
                  required
                  disabled={loading}
                  className="h-11 w-full rounded-md border border-neutral-300 bg-white px-3 text-sm text-neutral-950 outline-none focus:border-campus-brand focus:ring-2 focus:ring-campus-brand/30 disabled:cursor-not-allowed disabled:bg-neutral-100"
                  placeholder="Enter your password"
                />
              </FormField>

              <button
                type="submit"
                disabled={loading}
                className="mt-1 inline-flex h-11 w-full items-center justify-center gap-2 rounded-md bg-campus-brand px-4 text-sm font-semibold text-campus-ink transition-colors hover:bg-campus-brandStrong hover:text-white disabled:cursor-not-allowed disabled:opacity-60"
              >
                {loading ? (
                  <>
                    <Loader2 className="h-4 w-4 animate-spin" aria-hidden="true" />
                    Signing in...
                  </>
                ) : (
                  'Sign in'
                )}
              </button>
            </form>

            <button
              type="button"
              onClick={() => router.push('/')}
              className="mt-4 inline-flex h-11 w-full items-center justify-center gap-2 rounded-md border border-campus-border bg-white px-4 text-sm font-medium text-campus-ink transition-colors hover:bg-[#fbfaf6]"
            >
              <ArrowLeft className="h-4 w-4" aria-hidden="true" />
              Back to school portal
            </button>
          </Surface>
        </div>
      </section>
    </main>
  );
}
