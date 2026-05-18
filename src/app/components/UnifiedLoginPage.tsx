'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { login, getRedirectPath, isMobileDevice, isAnyAdmin } from '@/services/auth.service';
import { AlertCircle, Loader2, ArrowLeft } from 'lucide-react';

export function UnifiedLoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    // watchdog to ensure UI doesn't stay stuck if login promise never settles
    const watchdog = setTimeout(() => {
      setLoading(false);
      setError('Request timed out. Please try again.');
    }, 12000);
    try {
      const result = await login({ email, password });
      if (result.success && result.user) {
        if (isAnyAdmin(result.user.role) && isMobileDevice()) {
          setError('Admin access is only available on desktop/web browsers.');
          setLoading(false);
          return;
        }
        router.push(getRedirectPath(result.user.role));
      } else {
        setError(result.error || 'Login failed. Please try again.');
      }
    } catch {
      setError('An unexpected error occurred. Please try again.');
    } finally {
      clearTimeout(watchdog);
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col">
      {/* Header */}
      <header className="bg-[#1a1a1a] text-white h-14 flex items-center justify-between px-6 flex-shrink-0">
        <button onClick={() => router.push('/')}
          className="w-9 h-9 flex items-center justify-center rounded-lg hover:bg-white/10 transition-colors">
          <ArrowLeft className="w-5 h-5" />
        </button>
        <div className="flex items-center gap-0.5">
          <span className="text-[#F59E0B] font-bold text-base tracking-tight">CAMPUS</span>
          <span className="text-white font-light text-base tracking-tight">Portal</span>
        </div>
        <div className="w-9" />
      </header>

      {/* Centered card */}
      <div className="flex-1 flex items-center justify-center px-4 py-12">
        <div className="w-full max-w-md bg-white rounded-2xl shadow-xl p-8">
          <div className="mb-6">
            <h1 className="text-2xl font-bold text-[#1a1a1a]">Sign In</h1>
            <p className="text-sm text-gray-500 mt-1">Access your campus portal</p>
          </div>

          <div className="bg-blue-50 border border-blue-200 rounded-lg p-3 mb-6 flex gap-3">
            <AlertCircle className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" />
            <div>
              <p className="text-xs text-blue-900 font-semibold mb-1">Who can log in here?</p>
              <ul className="text-xs text-blue-700 space-y-1">
                <li>• <span className="font-semibold">Students:</span> Access your dashboard and grades</li>
                <li>• <span className="font-semibold">Professors:</span> Manage classes and encode grades</li>
                <li>• <span className="font-semibold">Alumni:</span> Connect with your alma mater</li>
                <li>• <span className="font-semibold">Admin:</span> Manage applications (web only)</li>
              </ul>
            </div>
          </div>

          {error && (
            <div className="bg-red-50 border border-red-200 rounded-lg p-3 mb-4 flex gap-2">
              <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0" />
              <p className="text-sm text-red-700">{error}</p>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Email Address</label>
              <input type="email" value={email} onChange={e => setEmail(e.target.value)} required
                className="w-full px-3 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#F59E0B] text-sm"
                placeholder="your.email@example.com" disabled={loading} />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Password</label>
              <input type="password" value={password} onChange={e => setPassword(e.target.value)} required
                className="w-full px-3 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#F59E0B] text-sm"
                placeholder="Enter your password" disabled={loading} />
            </div>
            <button type="submit" disabled={loading}
              className="w-full h-12 rounded-xl bg-[#F59E0B] text-white font-bold text-sm tracking-wide hover:bg-[#D97706] transition-all shadow-lg disabled:opacity-50 flex items-center justify-center gap-2">
              {loading ? <><Loader2 className="w-5 h-5 animate-spin" />Signing in...</> : 'Sign In'}
            </button>
          </form>

          <div className="mt-6 space-y-3">
            {/* Alumni registration removed */}
            <button onClick={() => router.push('/admissions/track')}
              className="w-full h-11 rounded-lg border-2 border-gray-300 text-gray-700 font-semibold text-sm hover:bg-gray-50 transition-colors">
              Track Application Status
            </button>
            <button onClick={() => router.push('/')}
              className="w-full h-11 rounded-lg border-2 border-transparent text-gray-500 font-semibold text-sm hover:bg-gray-50 transition-colors">
              ← Back to Home
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
