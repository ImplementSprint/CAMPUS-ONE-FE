'use client'

interface AlumniSignUpHomeProps {
  onStart: () => void;
}

export function AlumniSignUpHome({ onStart }: AlumniSignUpHomeProps) {
  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-900 to-slate-800 flex flex-col">
      {/* Header */}
      <div className="bg-slate-900 border-b border-slate-700 px-4 py-4">
        <h1 className="text-lg font-bold text-white">Alumni Sign Up</h1>
        <p className="text-xs text-slate-400">Register your alumni account</p>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto px-4 pt-8 pb-20 flex flex-col items-center justify-center">
        <div className="text-center max-w-sm">
          <div className="w-16 h-16 bg-amber-500 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg className="w-8 h-8 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4" />
            </svg>
          </div>
          <h2 className="text-2xl font-bold text-white mb-2">Welcome Back, Alumni</h2>
          <p className="text-slate-300 text-sm mb-8">
            Register your alumni account to stay connected with the campus community, access alumni resources, and network with fellow graduates.
          </p>

          <div className="space-y-3 mb-8">
            <div className="flex items-start gap-3 text-left">
              <div className="w-5 h-5 rounded-full bg-amber-500 flex items-center justify-center flex-shrink-0 mt-0.5">
                <svg className="w-3 h-3 text-white" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                </svg>
              </div>
              <div>
                <p className="text-white font-semibold text-sm">Access Alumni Network</p>
                <p className="text-slate-400 text-xs">Connect with fellow graduates</p>
              </div>
            </div>

            <div className="flex items-start gap-3 text-left">
              <div className="w-5 h-5 rounded-full bg-amber-500 flex items-center justify-center flex-shrink-0 mt-0.5">
                <svg className="w-3 h-3 text-white" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                </svg>
              </div>
              <div>
                <p className="text-white font-semibold text-sm">Exclusive Resources</p>
                <p className="text-slate-400 text-xs">Access alumni-only content</p>
              </div>
            </div>

            <div className="flex items-start gap-3 text-left">
              <div className="w-5 h-5 rounded-full bg-amber-500 flex items-center justify-center flex-shrink-0 mt-0.5">
                <svg className="w-3 h-3 text-white" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                </svg>
              </div>
              <div>
                <p className="text-white font-semibold text-sm">Career Opportunities</p>
                <p className="text-slate-400 text-xs">Find job postings and mentorship</p>
              </div>
            </div>
          </div>

          <button
            onClick={onStart}
            className="w-full bg-amber-500 hover:bg-amber-600 text-white font-semibold py-3 rounded-lg transition"
          >
            Get Started
          </button>
        </div>
      </div>
    </div>
  );
}

