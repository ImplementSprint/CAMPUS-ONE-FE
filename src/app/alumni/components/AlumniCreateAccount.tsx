'use client'
import { useState } from "react";
import { createAlumniProfile } from "../services/alumni.service";

interface FormState {
  email: string;
}

interface FormErrors {
  email?: string;
  general?: string;
}

interface AlumniCreateAccountProps {
  onSuccess: (alumniId: string, email: string) => void;
  onBack: () => void;
}

export function AlumniCreateAccount({ onSuccess, onBack }: AlumniCreateAccountProps) {
  const [form, setForm] = useState<FormState>({ email: "" });
  const [errors, setErrors] = useState<FormErrors>({});
  const [loading, setLoading] = useState(false);

  const set = (field: keyof FormState) => (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm((p) => ({ ...p, [field]: e.target.value }));
    setErrors((p) => ({ ...p, [field]: undefined }));
  };

  const validate = (): boolean => {
    const errs: FormErrors = {};
    if (!form.email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) {
      errs.email = "Enter a valid email address";
    }
    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleSubmit = async () => {
    if (!validate()) return;
    setLoading(true);

    const res = await createAlumniProfile({ email: form.email });

    setLoading(false);

    if (res.error) {
      setErrors({ general: res.error.message });
    } else {
      onSuccess(res.data!.id, form.email);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-900 to-slate-800 flex flex-col">
      {/* Header */}
      <div className="bg-slate-900 border-b border-slate-700 px-4 py-4 flex items-center gap-3">
        <button
          onClick={onBack}
          className="p-2 hover:bg-slate-800 rounded-lg transition"
        >
          <svg className="w-5 h-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
        </button>
        <div className="flex-1">
          <h1 className="text-lg font-bold text-white">Create Alumni Account</h1>
          <p className="text-xs text-slate-400">Step 1 of 2</p>
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto px-4 pt-6 pb-28">
        {/* Context banner */}
        <div className="bg-blue-50 border border-blue-200 rounded-xl px-4 py-3 mb-6 flex gap-3">
          <svg className="w-4 h-4 text-blue-500 flex-shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          <div className="text-xs text-blue-800 leading-relaxed">
            <p>Provide your email to create your alumni account. You'll receive a confirmation email to verify your account.</p>
          </div>
        </div>

        <div className="bg-slate-800 rounded-2xl border border-slate-700 p-5 space-y-4">
          {/* Email */}
          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1.5">
              Email Address
              <span className="ml-1 text-slate-500 font-normal">(used for account login)</span>
            </label>
            <input
              type="email"
              value={form.email}
              onChange={set("email")}
              placeholder="your.email@example.com"
              className="w-full px-3 py-2.5 border rounded-lg text-sm bg-slate-700 text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-amber-500 border-slate-600"
            />
            {errors.email && <p className="text-xs text-red-400 mt-1">{errors.email}</p>}
          </div>

          {errors.general && (
            <div className="bg-red-900/30 border border-red-700 rounded-lg px-3 py-2 text-xs text-red-300">
              {errors.general}
            </div>
          )}
        </div>
      </div>

      {/* Buttons */}
      <div className="fixed bottom-0 left-0 right-0 bg-slate-900 border-t border-slate-700 px-4 py-3 flex gap-3">
        <button
          onClick={onBack}
          className="flex-1 px-4 py-2.5 border border-slate-600 text-slate-300 font-semibold rounded-lg hover:bg-slate-800 transition"
        >
          Back
        </button>
        <button
          onClick={handleSubmit}
          disabled={loading}
          className="flex-1 px-4 py-2.5 bg-amber-500 hover:bg-amber-600 disabled:bg-slate-600 text-white font-semibold rounded-lg transition"
        >
          {loading ? "Creating..." : "Continue"}
        </button>
      </div>
    </div>
  );
}

