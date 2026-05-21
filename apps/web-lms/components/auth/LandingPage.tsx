'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { UserPlus, LogIn, GraduationCap, ArrowRight, X, Eye, EyeOff, Search } from 'lucide-react';
import { buildSchoolPortalUrl } from '@campus-one/api-client';
import type { PublicSchool } from '@campus-one/shared-contracts';
import { loginWithSupabase, getRedirectPath } from '@/lib/auth.service';

type ModalType = 'signup' | 'login' | null;

export function LandingPage() {
  const router = useRouter();
  const [activeModal, setActiveModal] = useState<ModalType>(null);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [confirmPasswordError, setConfirmPasswordError] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [schoolQuery, setSchoolQuery] = useState('');
  const [schoolResults, setSchoolResults] = useState<PublicSchool[]>([]);
  const [schoolError, setSchoolError] = useState('');
  const [schoolSearchLoading, setSchoolSearchLoading] = useState(false);

  const resetForm = () => {
    setEmail('');
    setPassword('');
    setConfirmPassword('');
    setShowPassword(false);
    setShowConfirmPassword(false);
    setConfirmPasswordError('');
    setError('');
  };

  const closeModal = () => { setActiveModal(null); resetForm(); };
  const switchModal = (to: ModalType) => { setActiveModal(to); resetForm(); };

  const handleSchoolSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    setSchoolError('');
    setSchoolSearchLoading(true);

    try {
      const params = schoolQuery.trim() ? `?search=${encodeURIComponent(schoolQuery.trim())}` : '';
      const response = await fetch(`/api/schools${params}`);
      const data = await response.json();

      if (!response.ok) {
        setSchoolError(data.message ?? 'Unable to search schools.');
        return;
      }

      setSchoolResults(data);
      if (data.length === 0) setSchoolError('No approved schools matched your search.');
    } catch {
      setSchoolError('Network error. Please try again.');
    } finally {
      setSchoolSearchLoading(false);
    }
  };

  const openSchoolPortal = (school: PublicSchool) => {
    const portalUrl = buildSchoolPortalUrl(school.schoolSlug, {
      baseUrl: process.env.NEXT_PUBLIC_SCHOOL_PORTAL_BASE_URL,
      platformDomain: process.env.NEXT_PUBLIC_SCHOOL_PORTAL_DOMAIN,
    });
    window.location.assign(portalUrl);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (activeModal === 'signup') {
      if (password !== confirmPassword) {
        setConfirmPasswordError('Passwords do not match.');
        return;
      }
      setConfirmPasswordError('');
      // Signup via local API (JSON-file store)
      setLoading(true);
      try {
        const res = await fetch('/api/auth/signup', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ email, password }),
        });
        const data = await res.json();
        if (!res.ok) { setError(data.message ?? 'Sign up failed.'); return; }
        router.push('/dashboard');
      } catch {
        setError('Network error. Please try again.');
      } finally {
        setLoading(false);
      }
      return;
    }

    setLoading(true);
    try {
      const result = await loginWithSupabase(email, password);
      if (result.success && result.user) {
        router.push(getRedirectPath(result.user.role));
        return;
      }
      setError(result.error ?? 'Invalid email or password.');
    } catch {
      setError('Network error. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#1a1a1a] via-[#2d2d2d] to-[#1a1a1a] flex flex-col">
      {/* Header */}
      <header className="bg-transparent text-white h-16 flex items-center justify-center px-6 flex-shrink-0">
        <div className="flex items-center gap-2">
          <GraduationCap className="w-8 h-8 text-[#F59E0B]" />
          <div className="flex items-center gap-1">
            <span className="text-[#F59E0B] font-bold text-xl tracking-tight">CAMPUS</span>
            <span className="text-white font-light text-xl tracking-tight">Portal</span>
          </div>
        </div>
      </header>

      {/* Main content */}
      <div className="flex-1 flex items-center justify-center px-4 py-12">
        <div className="w-full max-w-lg">
          <div className="text-center mb-10">
            <h1 className="text-4xl font-bold text-white mb-3">Welcome</h1>
            <p className="text-lg text-gray-300">Your gateway to education</p>
          </div>

          {/* Sign Up */}
          <div className="mb-6">
            <p className="text-xs font-bold text-gray-400 tracking-wider uppercase mb-3">NEW TO CAMPUS?</p>
            <button
              onClick={() => setActiveModal('signup')}
              className="w-full bg-[#F59E0B] text-white rounded-2xl p-6 shadow-2xl hover:bg-[#D97706] transition-all group relative overflow-hidden"
            >
              <div className="relative flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center flex-shrink-0">
                    <UserPlus className="w-6 h-6" />
                  </div>
                  <div className="text-left">
                    <h2 className="text-lg font-bold mb-0.5">Sign Up</h2>
                    <p className="text-xs text-white/80">Create your account</p>
                  </div>
                </div>
                <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </div>
            </button>
          </div>

          {/* Login */}
          <div className="mb-8">
            <p className="text-xs font-bold text-gray-400 tracking-wider uppercase mb-3">ALREADY HAVE AN ACCOUNT?</p>
            <button
              onClick={() => setActiveModal('login')}
              className="w-full bg-white/10 backdrop-blur-sm text-white rounded-2xl p-6 border border-white/20 hover:bg-white/15 transition-all group"
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-white/10 rounded-xl flex items-center justify-center flex-shrink-0">
                    <LogIn className="w-6 h-6" />
                  </div>
                  <div className="text-left">
                    <h2 className="text-lg font-bold mb-0.5">Login</h2>
                    <p className="text-xs text-gray-300">Existing users</p>
                  </div>
                </div>
                <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </div>
            </button>
          </div>

          <form onSubmit={handleSchoolSearch} className="rounded-2xl border border-white/10 bg-white/5 p-4">
            <label className="block text-xs font-bold text-gray-400 tracking-wider uppercase mb-3">
              FIND YOUR SCHOOL
            </label>
            <div className="flex gap-2">
              <input
                value={schoolQuery}
                onChange={(e) => setSchoolQuery(e.target.value)}
                placeholder="Search school name or subdomain"
                className="min-w-0 flex-1 rounded-xl border border-white/10 bg-black/20 px-4 py-3 text-sm text-white placeholder-gray-500 outline-none transition-colors focus:border-[#F59E0B] focus:ring-1 focus:ring-[#F59E0B]"
              />
              <button
                type="submit"
                disabled={schoolSearchLoading}
                className="h-11 w-11 rounded-xl bg-white text-[#1a1a1a] transition-colors hover:bg-gray-100 disabled:cursor-not-allowed disabled:opacity-60"
                aria-label="Search schools"
                title="Search schools"
              >
                <Search className="mx-auto h-4 w-4" />
              </button>
            </div>
            {schoolError && <p className="mt-3 text-xs text-red-300">{schoolError}</p>}
            {schoolResults.length > 0 && (
              <div className="mt-3 divide-y divide-white/10 overflow-hidden rounded-xl border border-white/10">
                {schoolResults.map((school) => (
                  <button
                    key={school.schoolId}
                    type="button"
                    onClick={() => openSchoolPortal(school)}
                    className="flex w-full items-center justify-between gap-3 bg-white/[0.03] px-4 py-3 text-left text-sm text-white transition-colors hover:bg-white/10"
                  >
                    <span className="min-w-0">
                      <span className="block truncate font-semibold">{school.displayName}</span>
                      <span className="block truncate text-xs text-gray-400">{school.schoolSlug}</span>
                    </span>
                    <ArrowRight className="h-4 w-4 flex-shrink-0 text-gray-400" />
                  </button>
                ))}
              </div>
            )}
          </form>
        </div>
      </div>

      <div className="px-6 pb-6 text-center">
        <p className="text-xs text-gray-400">Need help? Contact admissions office</p>
      </div>

      {/* Modal overlay */}
      {activeModal && (
        <div
          className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 px-4"
          onClick={(e) => e.target === e.currentTarget && closeModal()}
        >
          <div className="bg-[#1e1e1e] border border-white/10 rounded-3xl w-full max-w-sm p-8 shadow-2xl relative">
            <button onClick={closeModal} className="absolute top-4 right-4 text-gray-400 hover:text-white transition-colors">
              <X className="w-5 h-5" />
            </button>

            <div className="flex items-center gap-3 mb-8">
              <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${activeModal === 'signup' ? 'bg-[#F59E0B]' : 'bg-white/10'}`}>
                {activeModal === 'signup' ? <UserPlus className="w-5 h-5 text-white" /> : <LogIn className="w-5 h-5 text-white" />}
              </div>
              <div>
                <h2 className="text-white font-bold text-xl">
                  {activeModal === 'signup' ? 'Create Account' : 'Welcome Back'}
                </h2>
                <p className="text-gray-400 text-xs">
                  {activeModal === 'signup' ? 'Sign up to get started' : 'Login to your account'}
                </p>
              </div>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-gray-400 uppercase tracking-wider mb-1.5">
                  Email Address <span className="text-red-400">*</span>
                </label>
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="you@example.com"
                  className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white placeholder-gray-500 text-sm focus:outline-none focus:border-[#F59E0B] focus:ring-1 focus:ring-[#F59E0B] transition-colors"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-gray-400 uppercase tracking-wider mb-1.5">
                  Password <span className="text-red-400">*</span>
                </label>
                <div className="relative">
                  <input
                    type={showPassword ? 'text' : 'password'}
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="••••••••"
                    className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 pr-11 text-white placeholder-gray-500 text-sm focus:outline-none focus:border-[#F59E0B] focus:ring-1 focus:ring-[#F59E0B] transition-colors"
                  />
                  <button type="button" onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-white transition-colors">
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              {activeModal === 'signup' && (
                <div>
                  <label className="block text-xs font-semibold text-gray-400 uppercase tracking-wider mb-1.5">
                    Confirm Password <span className="text-red-400">*</span>
                  </label>
                  <div className="relative">
                    <input
                      type={showConfirmPassword ? 'text' : 'password'}
                      required
                      value={confirmPassword}
                      onChange={(e) => { setConfirmPassword(e.target.value); setConfirmPasswordError(''); }}
                      placeholder="••••••••"
                      className={`w-full bg-white/5 border rounded-xl px-4 py-3 pr-11 text-white placeholder-gray-500 text-sm focus:outline-none focus:ring-1 transition-colors ${
                        confirmPasswordError
                          ? 'border-red-400 focus:border-red-400 focus:ring-red-400'
                          : 'border-white/10 focus:border-[#F59E0B] focus:ring-[#F59E0B]'
                      }`}
                    />
                    <button type="button" onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-white transition-colors">
                      {showConfirmPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>
                  {confirmPasswordError && <p className="text-red-400 text-xs mt-1.5">{confirmPasswordError}</p>}
                </div>
              )}

              {error && <p className="text-red-400 text-xs text-center">{error}</p>}

              <button
                type="submit"
                disabled={loading}
                className={`w-full py-3 rounded-xl font-bold text-sm transition-all mt-2 disabled:opacity-60 disabled:cursor-not-allowed ${
                  activeModal === 'signup'
                    ? 'bg-[#F59E0B] hover:bg-[#D97706] text-white'
                    : 'bg-white text-[#1a1a1a] hover:bg-gray-100'
                }`}
              >
                {loading
                  ? (activeModal === 'signup' ? 'Creating account…' : 'Signing in…')
                  : (activeModal === 'signup' ? 'Create Account' : 'Login')}
              </button>
            </form>

            <p className="text-center text-xs text-gray-400 mt-6">
              {activeModal === 'signup' ? (
                <>Already have an account?{' '}
                  <button onClick={() => switchModal('login')} className="text-[#F59E0B] hover:underline font-semibold">Login</button>
                </>
              ) : (
                <>Don&apos;t have an account?{' '}
                  <button onClick={() => switchModal('signup')} className="text-[#F59E0B] hover:underline font-semibold">Sign Up</button>
                </>
              )}
            </p>
          </div>
        </div>
      )}
    </div>
  );
}
