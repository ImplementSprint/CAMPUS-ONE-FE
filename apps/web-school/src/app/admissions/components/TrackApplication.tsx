'use client'
import { useState } from "react";
import { trackApplication } from "../services/admissions.service";
import { Search, FileText, Mail, Hash, ArrowRight, Info, Home } from "lucide-react";

interface TrackApplicationProps {
  onSuccess: (email: string, referenceNumber: string) => void;
}

export function TrackApplication({ onSuccess }: TrackApplicationProps) {
  const [email, setEmail] = useState("");
  const [referenceNumber, setReferenceNumber] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (!email || !referenceNumber) {
      setError("Please enter both email and reference number");
      return;
    }

    setLoading(true);
    const res = await trackApplication(email, referenceNumber);
    setLoading(false);

    if (res.error) {
      setError(res.error.message);
    } else {
      // Pass email and reference number to parent
      onSuccess(email, referenceNumber);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 flex items-center justify-center px-4 py-12">
      <div className="w-full max-w-2xl">
        {/* Back to Home Link */}
        <div className="mb-6">
          <a
            href="/"
            className="inline-flex items-center gap-2 text-sm font-semibold text-gray-600 hover:text-gray-900 transition-colors group"
          >
            <div className="p-2 rounded-lg group-hover:bg-white transition-colors">
              <Home className="w-4 h-4" />
            </div>
            Back to Home
          </a>
        </div>

        {/* Header */}
        <div className="text-center mb-10">
          <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-br from-[#F59E0B] to-[#D97706] rounded-2xl mb-6 shadow-xl shadow-amber-500/30">
            <Search className="w-10 h-10 text-white" />
          </div>
          <h1 className="text-4xl font-bold text-gray-900 mb-3">Track Your Application</h1>
          <p className="text-base text-gray-600 max-w-md mx-auto">
            Enter your email and reference number to check your application status
          </p>
        </div>

        {/* Form Card */}
        <div className="bg-white rounded-2xl shadow-lg border border-gray-200 p-8 md:p-10">
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Email */}
            <div>
              <label className="flex items-center gap-2 text-sm font-bold text-gray-700 mb-3">
                <Mail className="w-4 h-4 text-[#F59E0B]" />
                Email Address
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@email.com"
                className="w-full h-14 px-5 rounded-xl border-2 border-gray-200 text-base bg-gray-50 focus:outline-none focus:ring-2 focus:ring-[#F59E0B] focus:border-transparent transition-all placeholder:text-gray-400"
              />
              <p className="text-xs text-gray-500 mt-2 ml-1">
                Use the email address you provided during application
              </p>
            </div>

            {/* Reference Number */}
            <div>
              <label className="flex items-center gap-2 text-sm font-bold text-gray-700 mb-3">
                <Hash className="w-4 h-4 text-[#F59E0B]" />
                Reference Number
              </label>
              <input
                type="text"
                value={referenceNumber}
                onChange={(e) => setReferenceNumber(e.target.value.toUpperCase())}
                placeholder="REF-2025-00001"
                className="w-full h-14 px-5 rounded-xl border-2 border-gray-200 text-base bg-gray-50 focus:outline-none focus:ring-2 focus:ring-[#F59E0B] focus:border-transparent transition-all font-mono placeholder:text-gray-400"
              />
              <p className="text-xs text-gray-500 mt-2 ml-1">
                Check your email for your reference number
              </p>
            </div>

            {/* Error Message */}
            {error && (
              <div className="bg-red-50 border-2 border-red-200 rounded-xl px-5 py-4 flex items-start gap-3">
                <div className="w-5 h-5 rounded-full bg-red-500 flex items-center justify-center flex-shrink-0 mt-0.5">
                  <span className="text-white text-xs font-bold">!</span>
                </div>
                <p className="text-sm text-red-700 font-medium">{error}</p>
              </div>
            )}

            {/* Submit Button */}
            <button
              type="submit"
              disabled={loading}
              className="w-full h-14 rounded-xl bg-gradient-to-r from-[#F59E0B] to-[#D97706] text-white font-bold text-base tracking-wide shadow-lg shadow-amber-500/30 hover:shadow-xl hover:shadow-amber-500/40 active:scale-[0.98] transition-all disabled:opacity-60 disabled:cursor-not-allowed flex items-center justify-center gap-3 group"
            >
              {loading ? (
                <>
                  <div className="w-5 h-5 border-3 border-white border-t-transparent rounded-full animate-spin"></div>
                  Checking Application...
                </>
              ) : (
                <>
                  <FileText className="w-5 h-5" />
                  Access Application
                  <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                </>
              )}
            </button>
          </form>
        </div>

        {/* Help Section */}
        <div className="mt-8 grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* New Application Link */}
          <div className="bg-white rounded-xl border border-gray-200 p-5 hover:border-[#F59E0B] hover:shadow-md transition-all">
            <div className="flex items-start gap-3">
              <div className="w-10 h-10 rounded-lg bg-amber-50 flex items-center justify-center flex-shrink-0">
                <FileText className="w-5 h-5 text-[#F59E0B]" />
              </div>
              <div>
                <p className="text-sm font-bold text-gray-900 mb-1">New Application?</p>
                <p className="text-xs text-gray-600 mb-2">
                  Don't have a reference number yet?
                </p>
                <a
                  href="/admissions"
                  className="text-xs font-semibold text-[#F59E0B] hover:text-[#D97706] transition-colors inline-flex items-center gap-1"
                >
                  Start Application
                  <ArrowRight className="w-3 h-3" />
                </a>
              </div>
            </div>
          </div>

          {/* Help Info */}
          <div className="bg-blue-50 rounded-xl border border-blue-200 p-5">
            <div className="flex items-start gap-3">
              <div className="w-10 h-10 rounded-lg bg-blue-100 flex items-center justify-center flex-shrink-0">
                <Info className="w-5 h-5 text-blue-600" />
              </div>
              <div>
                <p className="text-sm font-bold text-blue-900 mb-1">Need Help?</p>
                <p className="text-xs text-blue-700 leading-relaxed">
                  Can't find your reference number? Check your email inbox (including spam folder) or contact admissions.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Additional Info */}
        <div className="mt-6 text-center">
          <p className="text-xs text-gray-500">
            Your reference number was sent to your email after submitting your application
          </p>
        </div>
      </div>
    </div>
  );
}
