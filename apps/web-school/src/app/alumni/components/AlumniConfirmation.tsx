'use client'
import { useRouter } from "next/navigation";

interface AlumniConfirmationProps {
  referenceNumber: string | null;
}

export function AlumniConfirmation({ referenceNumber }: AlumniConfirmationProps) {
  const router = useRouter();

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-900 to-slate-800 flex flex-col">
      {/* Header */}
      <div className="bg-slate-900 border-b border-slate-700 px-4 py-4">
        <h1 className="text-lg font-bold text-white">Registration Complete</h1>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto px-4 pt-8 pb-20 flex flex-col items-center justify-center">
        <div className="text-center max-w-sm">
          <div className="w-16 h-16 bg-green-500 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg className="w-8 h-8 text-white" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
            </svg>
          </div>
          <h2 className="text-2xl font-bold text-white mb-2">Welcome to Alumni Network</h2>
          <p className="text-slate-300 text-sm mb-6">
            Your alumni account has been successfully created. You can now access exclusive alumni resources and connect with fellow graduates.
          </p>

          {referenceNumber && (
            <div className="bg-slate-700 rounded-lg px-4 py-3 mb-6 border border-slate-600">
              <p className="text-xs text-slate-400 mb-1">Your Reference Number</p>
              <p className="text-lg font-mono font-bold text-amber-400">{referenceNumber}</p>
            </div>
          )}

          <div className="space-y-2 mb-8">
            <p className="text-slate-300 text-sm">Next steps:</p>
            <ul className="text-left space-y-2 text-sm text-slate-300">
              <li className="flex items-center gap-2">
                <span className="w-5 h-5 rounded-full bg-amber-500 flex items-center justify-center text-xs text-white font-bold">1</span>
                Check your email for verification link
              </li>
              <li className="flex items-center gap-2">
                <span className="w-5 h-5 rounded-full bg-amber-500 flex items-center justify-center text-xs text-white font-bold">2</span>
                Verify your email address
              </li>
              <li className="flex items-center gap-2">
                <span className="w-5 h-5 rounded-full bg-amber-500 flex items-center justify-center text-xs text-white font-bold">3</span>
                Log in to your alumni account
              </li>
            </ul>
          </div>

          <button
            onClick={() => router.push("/login")}
            className="w-full bg-amber-500 hover:bg-amber-600 text-white font-semibold py-3 rounded-lg transition"
          >
            Go to Login
          </button>
        </div>
      </div>
    </div>
  );
}
