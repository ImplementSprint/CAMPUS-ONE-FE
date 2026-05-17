'use client'
import { useState } from "react";
import type { SchoolLevel, ApplicantType } from "../types/admissions.types";
import { SelectionTags } from "./SelectionTags";
import { logEvent, saveParentInformation } from "../services/admissions.service";

interface FormState {
  // Father Information
  fatherName: string;
  fatherAddress: string;
  fatherContactNo: string;
  
  // Guardian Information
  guardianName: string;
  guardianAddress: string;
  guardianPhoneHome: string;
  guardianPhoneWork: string;
  
  // Mother Information
  motherName: string;
  motherAddress: string;
  motherContactNo: string;
}

interface FormErrors {
  [key: string]: string;
}

interface ParentInformationProps {
  schoolLevel: SchoolLevel;
  applicantType: ApplicantType;
  applicantId: string;
  onSuccess: () => void;
  onBack: () => void;
}

function InputField({
  label,
  value,
  onChange,
  placeholder,
  type = "text",
  error,
  optional = false,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  placeholder: string;
  type?: string;
  error?: string;
  optional?: boolean;
}) {
  return (
    <div>
      <label className="flex items-center gap-1.5 text-xs font-semibold text-gray-600 mb-1.5">
        {label}
        {optional && <span className="text-gray-400 font-normal">(optional)</span>}
      </label>
      <input
        type={type}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className={`w-full h-12 px-4 rounded-xl border text-sm bg-gray-50 focus:outline-none focus:ring-2 focus:ring-[#F59E0B] focus:border-transparent transition-all ${
          error ? "border-red-400 bg-red-50" : "border-gray-200"
        }`}
      />
      {error && <p className="text-xs text-red-500 mt-1">{error}</p>}
    </div>
  );
}

function TextAreaField({
  label,
  value,
  onChange,
  placeholder,
  error,
  optional = false,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  placeholder: string;
  error?: string;
  optional?: boolean;
}) {
  return (
    <div>
      <label className="flex items-center gap-1.5 text-xs font-semibold text-gray-600 mb-1.5">
        {label}
        {optional && <span className="text-gray-400 font-normal">(optional)</span>}
      </label>
      <textarea
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        rows={3}
        className={`w-full px-4 py-3 rounded-xl border text-sm bg-gray-50 focus:outline-none focus:ring-2 focus:ring-[#F59E0B] focus:border-transparent transition-all resize-none ${
          error ? "border-red-400 bg-red-50" : "border-gray-200"
        }`}
      />
      {error && <p className="text-xs text-red-500 mt-1">{error}</p>}
    </div>
  );
}

export function ParentInformation({
  schoolLevel,
  applicantType,
  applicantId,
  onSuccess,
  onBack,
}: ParentInformationProps) {
  const [form, setForm] = useState<FormState>({
    fatherName: "",
    fatherAddress: "",
    fatherContactNo: "",
    guardianName: "",
    guardianAddress: "",
    guardianPhoneHome: "",
    guardianPhoneWork: "",
    motherName: "",
    motherAddress: "",
    motherContactNo: "",
  });

  const [errors, setErrors] = useState<FormErrors>({});
  const [loading, setLoading] = useState(false);

  const set = (field: keyof FormState) => (v: string) => {
    setForm((prev) => ({ ...prev, [field]: v }));
    // Clear error for this field when user starts typing
    if (errors[field]) {
      setErrors((prev) => ({ ...prev, [field]: "" }));
    }
  };

  const validateForm = (): boolean => {
    const newErrors: FormErrors = {};

    // Father Information - all required
    if (!form.fatherName.trim()) {
      newErrors.fatherName = "Father's name is required";
    }
    if (!form.fatherAddress.trim()) {
      newErrors.fatherAddress = "Father's address is required";
    }
    if (!form.fatherContactNo.trim()) {
      newErrors.fatherContactNo = "Father's contact number is required";
    }

    // Guardian Information - all OPTIONAL (no validation needed)

    // Mother Information - all required
    if (!form.motherName.trim()) {
      newErrors.motherName = "Mother's name is required";
    }
    if (!form.motherAddress.trim()) {
      newErrors.motherAddress = "Mother's address is required";
    }
    if (!form.motherContactNo.trim()) {
      newErrors.motherContactNo = "Mother's contact number is required";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSave = async () => {
    if (!validateForm()) {
      return;
    }

    setLoading(true);

    // Import the service function
    const { saveParentInformation } = await import("../services/admissions.service");
    
    const res = await saveParentInformation({
      applicant_id: applicantId,
      father_name: form.fatherName,
      father_address: form.fatherAddress,
      father_contact: form.fatherContactNo,
      guardian_name: form.guardianName,
      guardian_address: form.guardianAddress,
      guardian_phone_home: form.guardianPhoneHome,
      guardian_phone_work: form.guardianPhoneWork,
      mother_name: form.motherName,
      mother_address: form.motherAddress,
      mother_contact: form.motherContactNo,
    });

    if (res.error) {
      setErrors({ general: res.error.message });
      setLoading(false);
      return;
    }

    // Log the event
    await logEvent("parent_info_submitted", schoolLevel, applicantType, {
      applicant_id: applicantId,
    });

    setLoading(false);
    onSuccess();
  };

  return (
    <div className="flex-1 overflow-y-auto px-4 pt-5 pb-36">
      <SelectionTags schoolLevel={schoolLevel} applicantType={applicantType} />

      {/* Father Information Card */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-5 space-y-4 mb-4">
        <div className="pb-3 border-b border-gray-100">
          <h3 className="text-sm font-bold text-[#1a1a1a]">Father Information</h3>
        </div>

        <InputField
          label="Father's Name"
          value={form.fatherName}
          onChange={set("fatherName")}
          placeholder="Enter father's full name"
          error={errors.fatherName}
        />

        <TextAreaField
          label="Address"
          value={form.fatherAddress}
          onChange={set("fatherAddress")}
          placeholder="House No., Street, Barangay, City, Province"
          error={errors.fatherAddress}
        />

        <InputField
          label="Contact No."
          value={form.fatherContactNo}
          onChange={set("fatherContactNo")}
          placeholder="09XX XXX XXXX"
          type="tel"
          error={errors.fatherContactNo}
        />
      </div>

      {/* Guardian Information Card */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-5 space-y-4 mb-4">
        <div className="pb-3 border-b border-gray-100">
          <h3 className="text-sm font-bold text-[#1a1a1a]">Guardian Information</h3>
          <p className="text-xs text-gray-500 mt-1">(Optional - if different from parents)</p>
        </div>

        <InputField
          label="Guardian's Name"
          value={form.guardianName}
          onChange={set("guardianName")}
          placeholder="Enter guardian's full name"
          error={errors.guardianName}
          optional
        />

        <TextAreaField
          label="Address"
          value={form.guardianAddress}
          onChange={set("guardianAddress")}
          placeholder="House No., Street, Barangay, City, Province"
          error={errors.guardianAddress}
          optional
        />

        <InputField
          label="Phone (Home)"
          value={form.guardianPhoneHome}
          onChange={set("guardianPhoneHome")}
          placeholder="02 XXXX XXXX"
          type="tel"
          error={errors.guardianPhoneHome}
          optional
        />

        <InputField
          label="Phone (Work)"
          value={form.guardianPhoneWork}
          onChange={set("guardianPhoneWork")}
          placeholder="02 XXXX XXXX"
          type="tel"
          error={errors.guardianPhoneWork}
          optional
        />
      </div>

      {/* Mother Information Card */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-5 space-y-4 mb-4">
        <div className="pb-3 border-b border-gray-100">
          <h3 className="text-sm font-bold text-[#1a1a1a]">Mother Information</h3>
        </div>

        <InputField
          label="Mother's Name"
          value={form.motherName}
          onChange={set("motherName")}
          placeholder="Enter mother's full name"
          error={errors.motherName}
        />

        <TextAreaField
          label="Address"
          value={form.motherAddress}
          onChange={set("motherAddress")}
          placeholder="House No., Street, Barangay, City, Province"
          error={errors.motherAddress}
        />

        <InputField
          label="Contact No."
          value={form.motherContactNo}
          onChange={set("motherContactNo")}
          placeholder="09XX XXX XXXX"
          type="tel"
          error={errors.motherContactNo}
        />
      </div>

        {/* Bottom Action Buttons */}
      <div className="sticky bottom-0 w-full bg-white border-t border-gray-100 px-4 py-4 space-y-2.5 z-20">
        {errors.general && (
          <div className="bg-red-50 border border-red-200 rounded-xl px-4 py-3 text-xs text-red-600 mb-2">
            {errors.general}
          </div>
        )}
        <button
          onClick={handleSave}
          disabled={loading}
          className="w-full h-12 rounded-xl bg-[#F59E0B] text-white font-bold text-sm tracking-wide shadow-lg shadow-amber-100 active:bg-[#D97706] transition-all disabled:opacity-60 disabled:cursor-not-allowed flex items-center justify-center"
        >
          {loading ? "Saving..." : "Continue →"}
        </button>
        <button
          onClick={onBack}
          disabled={loading}
          className="w-full h-12 rounded-xl border-2 border-[#F59E0B] text-[#F59E0B] font-bold text-sm tracking-wide active:bg-amber-50 transition-all disabled:opacity-60 disabled:cursor-not-allowed"
        >
          Back
        </button>
      </div>
    </div>
  );
}
