'use client';

import { useEffect, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { ArrowLeft, Loader2, LockKeyhole } from 'lucide-react';
import { supabase } from '@/lib/supabase';

export default function ResetPasswordPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const tokenHash = searchParams.get('token_hash');
  const type = searchParams.get('type');
  const email = searchParams.get('email') ?? '';

  const [loading, setLoading] = useState(true);
  const [ready, setReady] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [message, setMessage] = useState('');

  useEffect(() => {
    const initializeSession = async () => {
      setLoading(true);
      setMessage('');

      if (tokenHash && (type === 'invite' || type === 'recovery')) {
        const { error } = await supabase.auth.verifyOtp({
          type: type as 'invite' | 'recovery',
          token_hash: tokenHash,
        });

        if (error) {
          setMessage(error.message);
          setLoading(false);
          return;
        }
      }

      const { data } = await supabase.auth.getSession();
      setReady(Boolean(data.session));
      setLoading(false);
    };

    initializeSession();
  }, [tokenHash, type]);

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    setMessage('');

    if (password.length < 8) {
      setMessage('Password must be at least 8 characters long.');
      return;
    }

    if (password !== confirmPassword) {
      setMessage('Passwords do not match.');
      return;
    }

    setSubmitting(true);
    try {
      const { error } = await supabase.auth.updateUser({ password });
      if (error) {
        setMessage(error.message);
        setSubmitting(false);
        return;
      }

      await supabase.auth.signOut();
      router.replace('/login?reset=success');
    } catch (err) {
      setMessage(err instanceof Error ? err.message : 'Failed to update password.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#f8fafc] flex items-center justify-center px-4 py-10">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,_rgba(245,158,11,0.12),_transparent_45%)] pointer-events-none" />
      <div className="relative w-full max-w-md bg-white border border-gray-100 shadow-2xl shadow-gray-200/50 rounded-3xl overflow-hidden">
        <div className="bg-[#111827] px-6 py-5 text-white flex items-center justify-between">
          <button
            type="button"
            onClick={() => router.push('/login')}
            className="w-9 h-9 rounded-lg hover:bg-white/10 flex items-center justify-center transition"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>
          <div className="flex items-center gap-2 text-sm font-semibold">
            <LockKeyhole className="w-4 h-4 text-[#F59E0B]" />
            CAMPUS Portal
          </div>
          <div className="w-9" />
        </div>

        <div className="p-6 md:p-8 space-y-5">
          <div>
            <h1 className="text-2xl font-bold text-[#111827]">Set your password</h1>
            <p className="text-sm text-gray-500 mt-1">
              {email ? `Finish setup for ${email}` : 'Use the secure link from your acceptance email to finish setup.'}
            </p>
          </div>

          {message && (
            <div className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700 font-medium">
              {message}
            </div>
          )}

          {loading ? (
            <div className="py-10 flex items-center justify-center text-gray-500 gap-2">
              <Loader2 className="w-5 h-5 animate-spin" />
              Checking secure link...
            </div>
          ) : !ready ? (
            <div className="rounded-2xl bg-amber-50 border border-amber-200 p-4 text-sm text-amber-900">
              The secure setup link is not active in this session. Please open the link from your email again.
            </div>
          ) : (
            <form className="space-y-4" onSubmit={handleSubmit}>
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-gray-500 mb-1.5">New Password</label>
                <input
                  type="password"
                  value={password}
                  onChange={(event) => setPassword(event.target.value)}
                  disabled={submitting}
                  className="w-full h-11 px-4 rounded-xl border border-gray-200 bg-gray-50 focus:outline-none focus:ring-2 focus:ring-[#F59E0B]"
                  placeholder="Enter a new password"
                />
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-gray-500 mb-1.5">Confirm Password</label>
                <input
                  type="password"
                  value={confirmPassword}
                  onChange={(event) => setConfirmPassword(event.target.value)}
                  disabled={submitting}
                  className="w-full h-11 px-4 rounded-xl border border-gray-200 bg-gray-50 focus:outline-none focus:ring-2 focus:ring-[#F59E0B]"
                  placeholder="Re-enter your new password"
                />
              </div>

              <button
                type="submit"
                disabled={submitting}
                className="w-full h-12 rounded-xl bg-[#F59E0B] text-white font-bold text-sm hover:bg-[#D97706] transition disabled:opacity-60 flex items-center justify-center gap-2"
              >
                {submitting ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    Updating...
                  </>
                ) : (
                  'Set Password'
                )}
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}
