'use client';
import { useRouter } from 'next/navigation';
import { UserPlus, LogIn, GraduationCap, ArrowRight } from 'lucide-react';

export function UnifiedEntryPage() {
  const router = useRouter();

  return (
    <div className="h-dvh w-full bg-gradient-to-br from-[#1a1a1a] via-[#2d2d2d] to-[#1a1a1a]">
      <div className="relative mx-auto grid h-full w-full max-w-6xl grid-rows-[auto_1fr_auto] px-4 sm:px-6 lg:px-10">
        <header className="bg-transparent text-white h-14 flex items-center justify-center px-4 sm:h-16">
          <div className="flex items-center gap-2.5">
            <div className="flex items-center gap-1.5">
              <span className="text-[#F59E0B] font-bold text-xl tracking-tight">CAMPUS</span>
              <span className="text-white font-light text-xl tracking-tight">Portal</span>
            </div>
            <img src="/logo.png" alt="Logo" className="w-6 h-6 object-contain rounded-md" />
          </div>
        </header>

        <div className="flex items-center justify-center py-2 sm:py-4">
          <div className="w-full max-w-3xl">
          <div className="text-center mb-6 sm:mb-8">
            <h1 className="text-3xl font-bold text-white mb-3">Welcome</h1>
            <p className="text-base text-gray-300">Your gateway to education</p>
          </div>

          <div className="mb-4 sm:mb-5">
            <p className="text-xs font-bold text-gray-400 tracking-wider uppercase mb-2.5">NEW TO CAMPUS?</p>
            <div className="space-y-3">
              <button
                onClick={() => router.push('/admissions')}
                className="w-full bg-[#F59E0B] text-white rounded-2xl p-4 sm:p-5 shadow-2xl hover:bg-[#D97706] active:scale-[0.98] transition-all group relative overflow-hidden"
              >
                <div className="relative flex items-center justify-between">
                  <div className="flex items-center gap-3 sm:gap-4">
                    <div className="w-10 h-10 sm:w-11 sm:h-11 bg-white/20 rounded-xl flex items-center justify-center flex-shrink-0">
                      <UserPlus className="w-5 h-5" />
                    </div>
                    <div className="text-left">
                      <h2 className="text-base sm:text-lg font-bold mb-0.5">New Applicant</h2>
                      <p className="text-xs text-white/80">Start your application</p>
                    </div>
                  </div>
                  <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                </div>
              </button>

              <button
                onClick={() => router.push('/alumni/register')}
                className="w-full bg-[#2d3748] text-white rounded-2xl p-4 sm:p-5 border-2 border-[#F59E0B] hover:bg-[#374151] active:scale-[0.98] transition-all group"
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3 sm:gap-4">
                    <div className="w-10 h-10 sm:w-11 sm:h-11 bg-[#F59E0B]/20 rounded-xl flex items-center justify-center flex-shrink-0">
                      <GraduationCap className="w-5 h-5 text-[#F59E0B]" />
                    </div>
                    <div className="text-left">
                      <h2 className="text-base sm:text-lg font-bold mb-0.5 text-[#F59E0B]">Alumni Sign Up</h2>
                      <p className="text-xs text-gray-300">Register your alumni account</p>
                    </div>
                  </div>
                  <ArrowRight className="w-5 h-5 text-[#F59E0B] group-hover:translate-x-1 transition-transform" />
                </div>
              </button>
            </div>
          </div>

          <div className="mb-5 sm:mb-6">
            <p className="text-xs font-bold text-gray-400 tracking-wider uppercase mb-2.5">ALREADY HAVE AN ACCOUNT?</p>
            <button
              onClick={() => router.push('/login')}
              className="w-full bg-white/10 backdrop-blur-sm text-white rounded-2xl p-4 sm:p-5 border border-white/20 hover:bg-white/15 active:scale-[0.98] transition-all group"
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3 sm:gap-4">
                  <div className="w-10 h-10 sm:w-11 sm:h-11 bg-white/10 rounded-xl flex items-center justify-center flex-shrink-0">
                    <LogIn className="w-5 h-5" />
                  </div>
                  <div className="text-left">
                    <h2 className="text-base sm:text-lg font-bold mb-0.5">Sign In</h2>
                    <p className="text-xs text-gray-300">Existing users</p>
                  </div>
                </div>
                <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </div>
            </button>
          </div>

          <div className="space-y-3">
            <button
              onClick={() => router.push('/admissions/track')}
              className="w-full text-center py-2 text-sm text-gray-300 hover:text-white transition-colors"
            >
              Track Application Status →
            </button>
          </div>
          </div>
        </div>

        <div className="px-6 pb-3 sm:pb-4 text-center sm:px-8">
          <p className="text-xs text-gray-400">Need help? Contact admissions office</p>
        </div>
      </div>
    </div>
  );
}
