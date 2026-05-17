'use client'
import { useState } from "react";
import { updateAlumniProfile } from "../services/alumni.service";

interface FormState {
  firstName: string;
  lastName: string;
  graduationYear: string;
  department: string;
}

interface FormErrors {
  firstName?: string;
  lastName?: string;
  graduationYear?: string;
  department?: string;
  general?: string;
}

interface AlumniProfileProps {
  alumniId: string;
  email: string;
  onSuccess: (referenceNumber: string) => void;
  onBack: () => void;
}

export function AlumniProfile({ alumniId, email, onSuccess, onBack }: AlumniProfileProps) {
  const [form, setForm] = useState<FormState>({
    firstName: "",
    lastName: "",
    graduationYear: new Date().getFullYear().toString(),
    department: "",
  });
  const [errors, setErrors] = useState<FormErrors>({});
  const [loading, setLoading] = useState(false);

  const set = (field: keyof FormState) => (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setForm((p) => ({ ...p, [field]: e.target.value }));
    setErrors((p) => ({ ...p, [field]: undefined }));
  };

  const validate = (): boolean => {
    const errs: FormErrors = {};
    if (!form.firstName.trim()) errs.firstName = "First name is required";
    if (!form.lastName.trim()) errs.lastName = "Last name is required";
    if (!form.graduationYear) errs.graduationYear = "Graduation year is required";
    if (!form.department) errs.department = "Department is required";
    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleSubmit = async () => {
    if (!validate()) return;
    setLoading(true);

    const res = await updateAlumniProfile(alumniId, {
      first_name: form.firstName,
      last_name: form.lastName,
      graduation_year: parseInt(form.graduationYear),
      department: form.department,
    });

    setLoading(false);

    if (res.error) {
      setErrors({ general: res.error.message });
    } else {
      onSuccess(res.data?.reference_number || "ALM-" + alumniId.slice(0, 8).toUpperCase());
    }
  };

  const currentYear = new Date().getFullYear();
  const years = Array.from({ length: 60 }, (_, i) => currentYear - i);

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
          <h1 className="text-lg font-bold text-white">Complete Your Profile</h1>
          <p className="text-xs text-slate-400">Step 2 of 2</p>
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto px-4 pt-6 pb-28">
        <div className="bg-slate-800 rounded-2xl border border-slate-700 p-5 space-y-4">
          {/* First Name */}
          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1.5">First Name</label>
            <input
              type="text"
              value={form.firstName}
              onChange={set("firstName")}
              placeholder="John"
              className={`w-full px-3 py-2.5 border rounded-lg text-sm bg-slate-700 text-white placeholder-slate-500 focus:outline-none focus:ring-2 ${errors.firstName ? 'border-red-500' : 'border-slate-600'}`}
            />
            {errors.firstName && <p className="text-xs text-red-400 mt-1">{errors.firstName}</p>}
          </div>

          {/* Last Name */}
          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1.5">Last Name</label>
            <input
              type="text"
              value={form.lastName}
              onChange={set("lastName")}
              placeholder="Doe"
              className={`w-full px-3 py-2.5 border rounded-lg text-sm bg-slate-700 text-white placeholder-slate-500 focus:outline-none focus:ring-2 ${errors.lastName ? 'border-red-500' : 'border-slate-600'}`}
            />
            {errors.lastName && <p className="text-xs text-red-400 mt-1">{errors.lastName}</p>}
          </div>

          {/* Graduation Year */}
          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1.5">Graduation Year</label>
            <select
              value={form.graduationYear}
              onChange={set("graduationYear")}
              className={`w-full px-3 py-2.5 border rounded-lg text-sm bg-slate-700 text-white focus:outline-none focus:ring-2 ${errors.graduationYear ? 'border-red-500' : 'border-slate-600'}`}
            >
              <option value="">Select year</option>
              {years.map((year) => (
                <option key={year} value={year}>
                  {year}
                </option>
              ))}
            </select>
            {errors.graduationYear && <p className="text-xs text-red-400 mt-1">{errors.graduationYear}</p>}
          </div>

          {/* Department */}
          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1.5">Department</label>
            <select
              value={form.department}
              onChange={set("department")}
              className={`w-full px-3 py-2.5 border rounded-lg text-sm bg-slate-700 text-white focus:outline-none focus:ring-2 ${errors.department ? 'border-red-500' : 'border-slate-600'}`}
            >
              <option value="">Select department</option>
              <option value="College of Engineering">College of Engineering</option>
              <option value="College of Arts and Sciences">College of Arts and Sciences</option>
              <option value="College of Business">College of Business</option>
              <option value="College of Education">College of Education</option>
              <option value="College of Health Sciences">College of Health Sciences</option>
              <option value="College of Law">College of Law</option>
            </select>
            {errors.department && <p className="text-xs text-red-400 mt-1">{errors.department}</p>}
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
          {loading ? "Registering..." : "Complete Registration"}
        </button>
      </div>
    </div>
  );
}

