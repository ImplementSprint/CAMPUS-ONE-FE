'use client'
import { useState } from "react";
import type { SchoolLevel, ApplicantType } from "../types/admissions.types";
import { SelectionTags } from "./SelectionTags";
import { saveApplicantProfile, logEvent } from "@/applicant/services/admissions.service";

interface FormState {
  firstName: string;
  lastName: string;
  middleName: string;
  birthdate: string;
  mobileNumber: string;
  street: string;
  barangay: string;
  city: string;
  province: string;
  zipCode: string;
}

interface FormErrors {
  firstName?: string;
  lastName?: string;
  birthdate?: string;
  mobileNumber?: string;
  street?: string;
  barangay?: string;
  city?: string;
  province?: string;
  zipCode?: string;
  general?: string;
}

interface PersonalProfileProps {
  schoolLevel: SchoolLevel;
  applicantType: ApplicantType;
  applicantId: string;
  onSuccess: (firstName: string, lastName: string) => void;
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

export function PersonalProfile({
  schoolLevel,
  applicantType,
  applicantId,
  onSuccess,
  onBack,
}: PersonalProfileProps) {
  const [form, setForm] = useState<FormState>({
    firstName: "",
    lastName: "",
    middleName: "",
    birthdate: "",
    mobileNumber: "",
    street: "",
    barangay: "",
    city: "",
    province: "",
    zipCode: "",
  });

  const [errors, setErrors] = useState<FormErrors>({});
  const [loading, setLoading] = useState(false);

  const set = (field: keyof FormState) => (v: string) => {
    setForm((p) => ({ ...p, [field]: v }));
    setErrors((p) => ({ ...p, [field]: undefined }));
  };

  const validate = (): boolean => {
    const errs: FormErrors = {};

    if (!form.firstName.trim()) errs.firstName = "First name is required";
    if (!form.lastName.trim()) errs.lastName = "Last name is required";
    if (!form.birthdate) errs.birthdate = "Birthdate is required";

    if (!form.mobileNumber.trim()) {
      errs.mobileNumber = "Mobile number is required";
    } else if (!/^[0-9+\-\s()]{7,15}$/.test(form.mobileNumber)) {
      errs.mobileNumber = "Enter a valid mobile number";
    }

    if (!form.street.trim()) errs.street = "Street address is required";
    if (!form.barangay.trim()) errs.barangay = "Barangay is required";
    if (!form.city.trim()) errs.city = "City is required";
    if (!form.province.trim()) errs.province = "Province is required";
    if (!form.zipCode.trim()) errs.zipCode = "ZIP code is required";

    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleSave = async () => {
    if (!validate()) return;

    setLoading(true);

    const fullAddress = [
      form.street,
      form.barangay,
      form.city,
      form.province,
      form.zipCode,
    ]
      .filter(Boolean)
      .join(", ");

    const res = await saveApplicantProfile({
      applicant_id: applicantId,
      first_name: form.firstName,
      last_name: form.lastName,
      middle_name: form.middleName,
      birthdate: form.birthdate,
      mobile_number: form.mobileNumber,
      address: fullAddress,
      school_level: schoolLevel,
      applicant_type: applicantType,
    });

    setLoading(false);

    if (
      res.error &&
      !res.error.message.includes("placeholder") &&
      !res.error.message.includes("fetch")
    ) {
      setErrors({ general: res.error.message });
      return;
    }

    await logEvent("profile_completed", schoolLevel, applicantType, {
      applicant_id: applicantId,
    });

    onSuccess(form.firstName, form.lastName);
  };

  return (
    <div className="flex-1 overflow-y-auto px-4 pt-5 pb-36">
      <SelectionTags schoolLevel={schoolLevel} applicantType={applicantType} />

      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-5 space-y-4">
        <div className="grid grid-cols-2 gap-3">
          <InputField
            label="First Name"
            value={form.firstName}
            onChange={set("firstName")}
            placeholder="Juan"
            error={errors.firstName}
          />
          <InputField
            label="Last Name"
            value={form.lastName}
            onChange={set("lastName")}
            placeholder="Dela Cruz"
            error={errors.lastName}
          />
        </div>

        <InputField
          label="Middle Name"
          value={form.middleName}
          onChange={set("middleName")}
          placeholder="Santos"
          optional
        />

        <InputField
          label="Birthdate"
          value={form.birthdate}
          onChange={set("birthdate")}
          placeholder=""
          type="date"
          error={errors.birthdate}
        />

        <InputField
          label="Mobile Number"
          value={form.mobileNumber}
          onChange={set("mobileNumber")}
          placeholder="09XX XXX XXXX"
          type="tel"
          error={errors.mobileNumber}
        />

        <div className="space-y-3 pt-1">
          <p className="text-xs font-semibold text-gray-600">Address</p>

          <InputField
            label="Street"
            value={form.street}
            onChange={set("street")}
            placeholder="House No., Street"
            error={errors.street}
          />

          <InputField
            label="Barangay"
            value={form.barangay}
            onChange={set("barangay")}
            placeholder="Enter barangay"
            error={errors.barangay}
          />

          <div className="grid grid-cols-2 gap-3">
            <InputField
              label="City / Municipality"
              value={form.city}
              onChange={set("city")}
              placeholder="Enter city"
              error={errors.city}
            />
            <InputField
              label="Province"
              value={form.province}
              onChange={set("province")}
              placeholder="Enter province"
              error={errors.province}
            />
          </div>

          <InputField
            label="ZIP Code"
            value={form.zipCode}
            onChange={set("zipCode")}
            placeholder="Enter ZIP code"
            error={errors.zipCode}
          />
        </div>

        {errors.general && (
          <div className="bg-red-50 border border-red-200 rounded-xl px-4 py-3 text-xs text-red-600">
            {errors.general}
          </div>
        )}
      </div>

      <div className="fixed bottom-0 left-1/2 -translate-x-1/2 w-full max-w-[430px] bg-white border-t border-gray-100 px-4 py-4 space-y-2.5 z-20">
        <button
          onClick={handleSave}
          disabled={loading}
          className="w-full h-12 rounded-xl bg-[#F59E0B] text-white font-bold text-sm tracking-wide shadow-lg shadow-amber-100 active:bg-[#D97706] transition-all disabled:opacity-60 disabled:cursor-not-allowed flex items-center justify-center gap-2"
        >
          {loading ? (
            <>
              <svg className="w-4 h-4 animate-spin" viewBox="0 0 24 24" fill="none">
                <circle
                  cx="12"
                  cy="12"
                  r="10"
                  stroke="currentColor"
                  strokeWidth="4"
                  className="opacity-25"
                />
                <path
                  fill="currentColor"
                  className="opacity-75"
                  d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"
                />
              </svg>
              Saving...
            </>
          ) : (
            "Save Profile"
          )}
        </button>

        <button
          onClick={onBack}
          className="w-full h-11 rounded-xl border-2 border-gray-200 text-gray-600 font-semibold text-sm hover:border-gray-300 transition-colors"
        >
          Back
        </button>
      </div>
    </div>
  );
}