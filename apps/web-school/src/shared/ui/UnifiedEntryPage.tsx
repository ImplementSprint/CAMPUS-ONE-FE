'use client';
import { useRouter } from 'next/navigation';
import { UserPlus, LogIn, GraduationCap, ArrowRight } from 'lucide-react';

export function UnifiedEntryPage() {
  const router = useRouter();

  return (
    <div className="w-screen h-screen overflow-hidden bg-gradient-to-br from-[#1a1a1a] via-[#2d2d2d] to-[#1a1a1a]">
      <div className="relative h-screen w-full max-w-[430px] mx-auto flex flex-col">
        <header className="bg-transparent text-white h-16 flex items-center justify-center px-4 flex-shrink-0 pt-4">
          <div className="flex items-center gap-3">
            <img src="/logo.png" alt="Campus One" className="w-10 h-10 object-contain" />
            <div className="flex items-center gap-1">
              <span className="text-[#F59E0B] font-bold text-xl tracking-tight">CAMPUS</span>
              <span className="text-white font-light text-xl tracking-tight">Portal</span>
            </div>
          </div>
        </header>

        <div className="flex-1 overflow-y-auto px-6 flex flex-col justify-center pb-8">
          <div className="text-center mb-12">
            <h1 className="text-3xl font-bold text-white mb-3">Welcome</h1>
            <p className="text-base text-gray-300">Your gateway to education</p>
          </div>

          <div className="space-y-4 mb-8">
            <button
              onClick={() => router.push('/admissions')}
              className="w-full bg-[#F59E0B] text-white rounded-2xl p-6 shadow-2xl hover:bg-[#D97706] active:scale-[0.98] transition-all group relative overflow-hidden"
            >
              <div className="relative flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center flex-shrink-0">
                    <UserPlus className="w-6 h-6" />
                  </div>
                  <div className="text-left">
                    <h2 className="text-lg font-bold mb-0.5">New Applicant</h2>
                    <p className="text-xs text-white/80">Start your application</p>
                  </div>
                </div>
                <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </div>
            </button>

            <button
              onClick={() => router.push('/login')}
              className="w-full bg-white/10 backdrop-blur-sm text-white rounded-2xl p-6 border border-white/20 hover:bg-white/15 active:scale-[0.98] transition-all group"
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-white/10 rounded-xl flex items-center justify-center flex-shrink-0">
                    <LogIn className="w-6 h-6" />
                  </div>
                  <div className="text-left">
                    <h2 className="text-lg font-bold mb-0.5">Sign In</h2>
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
              className="w-full text-center py-3 text-sm text-gray-300 hover:text-white transition-colors"
            >
              Track Application Status →
            </button>
          </div>
        </div>

        <div className="px-6 pb-6 text-center">
          <p className="text-xs text-gray-400">Need help? Contact admissions office</p>
        </div>
      </div>
    </div>
  );
}
