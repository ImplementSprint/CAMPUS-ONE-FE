'use client'
import { useState } from "react";
import type { SchoolLevel, ApplicantType } from "../types/admissions.types";
import { SelectionTags } from "./SelectionTags";
import { createApplicantProfile, logEvent } from "../services/admissions.service";

interface FormState {
  email: string;
}

interface FormErrors {
  email?: string;
  general?: string;
}

interface CreateAccountProps {
  schoolLevel: SchoolLevel;
  applicantType: ApplicantType;
  onSuccess: (applicantId: string, email: string) => void;
}

export function CreateAccount({ schoolLevel, applicantType, onSuccess }: CreateAccountProps) {
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
    
    const res = await createApplicantProfile({ 
      email: form.email, 
      school_level: schoolLevel, 
      applicant_type: applicantType 
    });
    
    setLoading(false);
    
    if (res.error) {
      setErrors({ general: res.error.message });
    } else {
      await logEvent("account_created", schoolLevel, applicantType, { email: form.email });
      onSuccess(res.data!.id, form.email);
    }
  };

  return (
    <div className="flex-1 overflow-y-auto px-4 pt-5 pb-28">
      <SelectionTags schoolLevel={schoolLevel} applicantType={applicantType} />

      {/* Context banner */}
      <div className="bg-blue-50 border border-blue-200 rounded-xl px-4 py-3 mb-4 flex gap-3">
        <svg className="w-4 h-4 text-blue-500 flex-shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
        <div className="text-xs text-blue-800 leading-relaxed">
          <p>Provide your email to start your application. After submission, you'll receive a <span className="font-semibold">Reference Number</span> to track your application status.</p>
        </div>
      </div>

      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-5 space-y-4">
        {/* Email */}
        <div>
          <label className="block text-xs font-semibold text-gray-600 mb-1.5">
            Email Address <span className="text-red-500">*</span>
            <span className="ml-1 text-gray-400 font-normal">(used to track your application)</span>
          </label>
          <input
            type="email"
            value={form.email}
            onChange={set("email")}
            placeholder="you@email.com"
            className={`w-full h-12 px-4 rounded-xl border text-sm bg-gray-50 focus:outline-none focus:ring-2 focus:ring-[#F59E0B] focus:border-transparent transition-all ${errors.email ? "border-red-400 bg-red-50" : "border-gray-200"}`}
          />
          {errors.email && <p className="text-xs text-red-500 mt-1">{errors.email}</p>}
        </div>

        {errors.general && (
          <div className="bg-red-50 border border-red-200 rounded-xl px-4 py-3 text-xs text-red-600">{errors.general}</div>
        )}
      </div>

      {/* Fixed Bottom */}
      <div className="fixed bottom-0 left-1/2 -translate-x-1/2 w-full max-w-[430px] bg-white border-t border-gray-100 px-4 py-4 space-y-3 z-20">
        <button
          onClick={handleSubmit}
          disabled={loading}
          className="w-full h-12 rounded-xl bg-[#F59E0B] text-white font-bold text-sm tracking-wide shadow-lg shadow-amber-100 active:bg-[#D97706] transition-all disabled:opacity-60 disabled:cursor-not-allowed flex items-center justify-center gap-2"
        >
          {loading ? (
            <><svg className="w-4 h-4 animate-spin" viewBox="0 0 24 24" fill="none"><circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" className="opacity-25"/><path fill="currentColor" className="opacity-75" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"/></svg>Starting Application…</>
          ) : "Start Application →"}
        </button>
        <p className="text-center text-xs text-gray-400">
          Already have a reference number?{" "}
          <a href="/admissions/track" className="text-[#F59E0B] font-semibold hover:underline">
            Track your application
          </a>
        </p>
      </div>
    </div>
  );
}
