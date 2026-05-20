'use client';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { login, getRedirectPath, isAdminRole } from '@/services/auth.service';
import { AlertCircle, Loader2, ArrowLeft } from 'lucide-react';

export function UnifiedLoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  const checkIsMobile = () => {
    if (typeof window === 'undefined') return false;
    return /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      const result = await login({ email, password });
      if (result.success && result.user) {
        if (isAdminRole(result.user.role) && checkIsMobile()) {
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
      setLoading(false);
    }
  };

  return (
    <div className="w-screen h-screen flex bg-gray-50 overflow-hidden font-sans">
      {/* 🖥️ Desktop Branding Left Panel */}
      <div className="hidden md:flex flex-col justify-between w-[400px] lg:w-[480px] xl:w-[540px] bg-[#1a1a1a] p-12 text-white relative flex-shrink-0 z-10 shadow-2xl">
        {/* Background glow or overlay details */}
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-amber-500/10 via-transparent to-transparent pointer-events-none" />
        
        {/* Brand Logo */}
        <div className="flex items-center gap-2.5 z-10">
          <div className="flex items-center gap-1.5">
            <span className="text-[#F59E0B] font-bold text-2xl tracking-tight">CAMPUS</span>
            <span className="text-white font-light text-2xl tracking-tight">Portal</span>
          </div>
          <img 
            src="/logo.png" 
            alt="CAMPUS One Logo" 
            className="w-7 h-7 object-contain rounded-md"
          />
        </div>

        {/* Hero Content */}
        <div className="my-auto space-y-6 z-10 max-w-sm">
          <h2 className="text-3xl lg:text-4xl font-extrabold leading-tight text-white">
            Empowering Education, Connecting Lives.
          </h2>
          <p className="text-gray-400 text-sm lg:text-base leading-relaxed">
            Welcome to the CAMPUS One Portal. Your unified gateway to check admissions, manage course modules, and view real-time student updates.
          </p>
          <div className="pt-4 flex items-center gap-3 text-xs text-[#F59E0B]">
            <span className="w-2 h-2 rounded-full bg-[#F59E0B] animate-ping" />
            <span className="font-semibold uppercase tracking-wider">System Live & Operational</span>
          </div>
        </div>

        {/* Footer info */}
        <div className="text-xs text-gray-500 z-10">
          <p>© 2026 CAMPUS One. All rights reserved.</p>
        </div>
      </div>

      {/* 📱 Mobile Simulator Wrapper / Form Container */}
      <div className="flex-1 flex flex-col justify-center items-center overflow-y-auto px-4 md:px-12 bg-gray-50 relative w-full h-full">
        {/* Subtle dot/grid pattern */}
        <div className="absolute inset-0 z-0 bg-[radial-gradient(#e5e7eb_1px,transparent_1px)] [background-size:16px_16px] opacity-70"></div>
        <div className="absolute inset-0 z-0 bg-gradient-to-br from-white/40 to-transparent"></div>

        {/* Mobile Header (Hidden on Desktop) */}
        <header className="md:hidden bg-[#1a1a1a] text-white h-14 w-full flex items-center justify-between px-4 fixed top-0 left-0 z-20">
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

        {/* Login Page Card (Fluid on desktop, centered on mobile) */}
        <div className="w-full max-w-[440px] bg-white rounded-3xl shadow-2xl shadow-gray-200/60 border border-gray-100 p-6 md:p-10 space-y-6 mt-14 md:mt-0 relative z-10">
          
          {/* Header Title */}
          <div>
            <h1 className="text-2xl font-bold text-[#1a1a1a]">Login</h1>
            <p className="text-sm text-gray-500 mt-1">Sign in to access your portal</p>
          </div>

          {/* Alert / Who can log in banner */}
          <div className="bg-blue-50/80 border border-blue-100 rounded-xl p-3.5 flex gap-3 text-left">
            <AlertCircle className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" />
            <div>
              <p className="text-xs text-blue-900 font-bold mb-1">Who can log in here?</p>
              <ul className="text-xs text-blue-800 space-y-1 font-medium">
                <li>• <span className="font-semibold text-blue-950">Students:</span> Access your dashboard and grades</li>
                <li>• <span className="font-semibold text-blue-950">Professors:</span> Manage classes and encode grades</li>
                <li>• <span className="font-semibold text-blue-950">Alumni:</span> Connect with your alma mater</li>
                <li>• <span className="font-semibold text-blue-950">Admin:</span> Manage applications (web only)</li>
              </ul>
            </div>
          </div>

          {/* General Login Error Feedback */}
          {error && (
            <div className="bg-red-50 border border-red-200 rounded-xl p-3.5 flex gap-2">
              <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0" />
              <p className="text-xs text-red-700 font-semibold">{error}</p>
            </div>
          )}

          {/* Submission Form */}
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-xs font-bold text-gray-500 mb-1.5 uppercase tracking-wider">Email Address</label>
              <input 
                type="email" 
                value={email} 
                onChange={e => setEmail(e.target.value)} 
                required
                className="w-full h-11 px-4 border border-gray-200 bg-gray-50 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#F59E0B] focus:border-transparent transition-all text-sm"
                placeholder="your.email@example.com" 
                disabled={loading} 
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-gray-500 mb-1.5 uppercase tracking-wider">Password</label>
              <input 
                type="password" 
                value={password} 
                onChange={e => setPassword(e.target.value)} 
                required
                className="w-full h-11 px-4 border border-gray-200 bg-gray-50 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#F59E0B] focus:border-transparent transition-all text-sm"
                placeholder="Enter your password" 
                disabled={loading} 
              />
            </div>
            <button 
              type="submit" 
              disabled={loading}
              className="w-full h-12 mt-2 rounded-xl bg-[#F59E0B] text-white font-bold text-sm tracking-wide shadow-lg shadow-amber-100 hover:bg-[#D97706] active:bg-[#B45309] transition-all disabled:opacity-50 flex items-center justify-center gap-2"
            >
              {loading ? (
                <>
                  <Loader2 className="w-5 h-5 animate-spin" />
                  <span>Signing in...</span>
                </>
              ) : (
                <span>Sign In</span>
              )}
            </button>
          </form>

          {/* Quick Action Navigation Links */}
          <div className="pt-2">
            <button 
              onClick={() => router.push('/')}
              className="w-full h-12 rounded-xl border-2 border-[#F59E0B] text-[#F59E0B] font-bold text-sm hover:bg-amber-50 active:bg-amber-100/50 transition-all flex items-center justify-center gap-1"
            >
              ← Back to Home
            </button>
          </div>

        </div>
      </div>
    </div>
  );
}
