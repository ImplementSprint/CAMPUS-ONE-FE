'use client'
import { useState } from "react";
import { supabase } from "@/shared/lib/supabase";

interface FormState {
  email: string;
  password: string;
}

interface FormErrors {
  email?: string;
  password?: string;
  general?: string;
}

export function LoginPage() {
  const [form, setForm] = useState<FormState>({ email: "", password: "" });
  const [errors, setErrors] = useState<FormErrors>({});
  const [loading, setLoading] = useState(false);
  const [showPass, setShowPass] = useState(false);

  const set = (field: keyof FormState) => (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm((p) => ({ ...p, [field]: e.target.value }));
    setErrors((p) => ({ ...p, [field]: undefined, general: undefined }));
  };

  const validate = (): boolean => {
    const errs: FormErrors = {};
    if (!form.email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email))
      errs.email = "Enter a valid email address";
    if (!form.password) errs.password = "Password is required";
    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleLogin = async () => {
    if (!validate()) return;
    setLoading(true);
    const { error } = await supabase.auth.signInWithPassword({
      email: form.email,
      password: form.password,
    });
    setLoading(false);
    if (error) {
      setErrors({ general: "Invalid email or password. Please try again." });
    } else {
      // Redirect to student portal dashboard after successful login (enrolled students only)
      window.location.href = "/desktop";
    }
  };

  const EyeOpen = () => (
    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
    </svg>
  );

  const EyeOff = () => (
    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21" />
    </svg>
  );

  return (
    <div className="w-screen min-h-screen bg-gray-100 flex items-start justify-center overflow-y-auto">
      <div className="w-full min-h-screen flex flex-col bg-gray-100">
        {/* Header */}
        <header className="bg-[#1a1a1a] text-white h-14 flex items-center justify-center px-4 flex-shrink-0">
          <div className="flex items-center gap-0.5">
            <span className="text-[#F59E0B] font-bold text-base tracking-tight">CAMPUS</span>
            <span className="text-white font-light text-base tracking-tight">Portal</span>
          </div>
        </header>

        <div className="flex-1 overflow-y-auto px-4 pt-6 pb-10">
          {/* Page heading */}
          <div className="mb-6">
            <h1 className="text-xl font-bold text-[#1a1a1a]">Student Portal Login</h1>
            <p className="text-sm text-gray-500 mt-1">
              For enrolled students only. Sign in to access your student portal.
            </p>
          </div>

          {/* Info banner */}
          <div className="bg-blue-50 border border-blue-200 rounded-xl px-4 py-3 mb-5 flex gap-3">
            <svg className="w-4 h-4 text-blue-500 flex-shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <p className="text-xs text-blue-700 leading-relaxed">
              This login is for <span className="font-semibold">enrolled students</span> with an active school account. If you are applying for the first time, use the Admissions portal instead.
            </p>
          </div>

          {/* Form */}
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-5 space-y-4">
            {/* Email */}
            <div>
              <label className="block text-xs font-semibold text-gray-600 mb-1.5">
                School Email Address
              </label>
              <input
                type="email"
                value={form.email}
                onChange={set("email")}
                placeholder="yourname@school.edu.ph"
                className={`w-full h-12 px-4 rounded-xl border text-sm bg-gray-50 focus:outline-none focus:ring-2 focus:ring-[#F59E0B] focus:border-transparent transition-all ${
                  errors.email ? "border-red-400 bg-red-50" : "border-gray-200"
                }`}
              />
              {errors.email && <p className="text-xs text-red-500 mt-1">{errors.email}</p>}
            </div>

            {/* Password */}
            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label className="block text-xs font-semibold text-gray-600">Password</label>
                <button
                  type="button"
                  className="text-xs text-[#F59E0B] font-semibold hover:underline"
                  onClick={() => {/* TODO: forgot password flow */}}
                >
                  Forgot password?
                </button>
              </div>
              <div className="relative">
                <input
                  type={showPass ? "text" : "password"}
                  value={form.password}
                  onChange={set("password")}
                  placeholder="Enter your password"
                  className={`w-full h-12 px-4 pr-11 rounded-xl border text-sm bg-gray-50 focus:outline-none focus:ring-2 focus:ring-[#F59E0B] focus:border-transparent transition-all ${
                    errors.password ? "border-red-400 bg-red-50" : "border-gray-200"
                  }`}
                />
                <button
                  type="button"
                  onClick={() => setShowPass((p) => !p)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                  aria-label={showPass ? "Hide password" : "Show password"}
                >
                  {showPass ? <EyeOff /> : <EyeOpen />}
                </button>
              </div>
              {errors.password && <p className="text-xs text-red-500 mt-1">{errors.password}</p>}
            </div>

            {errors.general && (
              <div className="bg-red-50 border border-red-200 rounded-xl px-4 py-3 text-xs text-red-600">
                {errors.general}
              </div>
            )}
          </div>

          {/* Login button */}
          <div className="mt-5 space-y-3">
            <button
              onClick={handleLogin}
              disabled={loading}
              className="w-full h-12 rounded-xl bg-[#1a1a1a] text-white font-bold text-sm tracking-wide shadow-lg active:bg-gray-800 transition-all disabled:opacity-60 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
              {loading ? (
                <>
                  <svg className="w-4 h-4 animate-spin" viewBox="0 0 24 24" fill="none">
                    <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" className="opacity-25" />
                    <path fill="currentColor" className="opacity-75" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                  </svg>
                  Signing in…
                </>
              ) : (
                "Sign In →"
              )}
            </button>

            {/* Divider */}
            <div className="flex items-center gap-3">
              <div className="flex-1 h-px bg-gray-200" />
              <span className="text-xs text-gray-400">or</span>
              <div className="flex-1 h-px bg-gray-200" />
            </div>

            {/* Link to admissions */}
            <div className="bg-amber-50 border border-amber-200 rounded-xl px-4 py-3.5 text-center">
              <p className="text-xs text-amber-800 font-medium">New applicant? Not yet enrolled?</p>
              <a
                href="/admissions"
                className="text-sm font-bold text-[#F59E0B] hover:underline mt-0.5 inline-block"
              >
                Apply through the Admissions Portal →
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
