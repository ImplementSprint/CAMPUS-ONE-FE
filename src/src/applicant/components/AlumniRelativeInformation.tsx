'use client'
import { useState } from "react";
import type { SchoolLevel, ApplicantType } from "../types/admissions.types";
import { SelectionTags } from "./SelectionTags";
import { logEvent, saveAlumniRelatives } from "@/applicant/services/admissions.service";
import { ChevronDown, Plus, Trash2 } from "lucide-react";

interface AlumniEntry {
  id: string;
  name: string;
  relationship: string;
  college: string;
  batch: string;
  contactNumber: string;
}

interface FormState {
  alumni: AlumniEntry[];
}

interface FormErrors {
  [key: string]: string;
}

interface AlumniRelativeInformationProps {
  schoolLevel: SchoolLevel;
  applicantType: ApplicantType;
  applicantId: string;
  onSuccess: () => void;
  onBack: () => void;
}

const RELATIONSHIP_OPTIONS = [
  "Parent",
  "Sibling",
  "Grandparent",
  "Aunt/Uncle",
  "Cousin",
  "Other Relative",
];

const COLLEGE_OPTIONS = [
  "College of Arts and Sciences",
  "College of Business Administration",
  "College of Engineering",
  "College of Education",
  "College of Nursing",
  "College of Computer Studies",
  "College of Law",
  "College of Medicine",
];

function generateBatchYears(): string[] {
  const currentYear = new Date().getFullYear();
  const years: string[] = [];
  for (let i = 0; i <= 50; i++) {
    years.push((currentYear - i).toString());
  }
  return years;
}

export function AlumniRelativeInformation({
  schoolLevel,
  applicantType,
  applicantId,
  onSuccess,
  onBack,
}: AlumniRelativeInformationProps) {
  const batchYears = generateBatchYears();

  const [form, setForm] = useState<FormState>({
    alumni: [
      {
        id: "initial-1",
        name: "",
        relationship: "",
        college: "",
        batch: "",
        contactNumber: "",
      },
    ],
  });

  const [errors, setErrors] = useState<FormErrors>({});
  const [loading, setLoading] = useState(false);

  const updateAlumni = (id: string, field: keyof AlumniEntry, value: string) => {
    setForm((prev) => {
      const newAlumni = prev.alumni.map((alumni) =>
        alumni.id === id ? { ...alumni, [field]: value } : alumni
      );
      return { alumni: newAlumni };
    });

    // Clear error for this field
    const errorKey = `${id}-${field}`;
    if (errors[errorKey]) {
      setErrors((prev) => {
        const newErrors = { ...prev };
        delete newErrors[errorKey];
        return newErrors;
      });
    }
  };

  const addNewRow = () => {
    const newId = `alumni-${Date.now()}`;
    setForm((prev) => ({
      alumni: [
        ...prev.alumni,
        {
          id: newId,
          name: "",
          relationship: "",
          college: "",
          batch: "",
          contactNumber: "",
        },
      ],
    }));
  };

  const deleteRow = (id: string) => {
    // Don't allow deleting if it's the last row
    if (form.alumni.length === 1) {
      return;
    }

    setForm((prev) => ({
      alumni: prev.alumni.filter((alumni) => alumni.id !== id),
    }));

    // Clear errors for this row
    setErrors((prev) => {
      const newErrors = { ...prev };
      Object.keys(newErrors).forEach((key) => {
        if (key.startsWith(`${id}-`)) {
          delete newErrors[key];
        }
      });
      return newErrors;
    });
  };

  const validateForm = (): boolean => {
    const newErrors: FormErrors = {};

    // Check if at least one alumni has any data filled
    const hasAnyData = form.alumni.some(
      (alumni) =>
        alumni.name.trim() ||
        alumni.relationship.trim() ||
        alumni.college.trim() ||
        alumni.batch.trim() ||
        alumni.contactNumber.trim()
    );

    // If any data is filled, validate those rows
    if (hasAnyData) {
      form.alumni.forEach((alumni) => {
        const hasPartialData =
          alumni.name.trim() ||
          alumni.relationship.trim() ||
          alumni.college.trim() ||
          alumni.batch.trim() ||
          alumni.contactNumber.trim();

        if (hasPartialData) {
          // If any field is filled, all fields are required
          if (!alumni.name.trim()) {
            newErrors[`${alumni.id}-name`] = "Required";
          }
          if (!alumni.relationship.trim()) {
            newErrors[`${alumni.id}-relationship`] = "Required";
          }
          if (!alumni.college.trim()) {
            newErrors[`${alumni.id}-college`] = "Required";
          }
          if (!alumni.batch.trim()) {
            newErrors[`${alumni.id}-batch`] = "Required";
          }
          if (!alumni.contactNumber.trim()) {
            newErrors[`${alumni.id}-contactNumber`] = "Required";
          }
        }
      });
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSave = async () => {
    if (!validateForm()) {
      return;
    }

    setLoading(true);

    // Filter out empty entries
    const filledAlumni = form.alumni.filter(
      (alumni) =>
        alumni.name.trim() ||
        alumni.relationship.trim() ||
        alumni.college.trim() ||
        alumni.batch.trim() ||
        alumni.contactNumber.trim()
    );

    const relatives = filledAlumni.map((alumni) => ({
      name: alumni.name,
      relationship: alumni.relationship,
      college: alumni.college,
      batch_year: alumni.batch,
      contact_number: alumni.contactNumber,
    }));

    const res = await saveAlumniRelatives({
      applicant_id: applicantId,
      relatives,
    });

    if (res.error) {
      setErrors({ general: res.error.message });
      setLoading(false);
      return;
    }

    await logEvent("profile_completed", schoolLevel, applicantType, {
      applicant_id: applicantId,
      info_type: "alumni",
    });

    setLoading(false);
    onSuccess();
  };

  return (
    <div className="flex-1 overflow-y-auto px-4 pt-5 pb-36">
      <SelectionTags schoolLevel={schoolLevel} applicantType={applicantType} />

      {/* Alumni Relative Information Card */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-5 mb-4">
        <div className="pb-3 border-b border-gray-100 mb-4">
          <h3 className="text-sm font-bold text-[#1a1a1a]">Alumni-Relative Information</h3>
        </div>

        {/* Table - Mobile Optimized */}
        <div className="overflow-x-auto -mx-5 px-5">
          <div className="min-w-[700px]">
            {/* Table Header */}
            <div className="grid grid-cols-[140px_100px_120px_90px_110px_50px] gap-2 mb-3">
              <div className="text-xs font-bold text-gray-700">Name</div>
              <div className="text-xs font-bold text-gray-700">Relation</div>
              <div className="text-xs font-bold text-gray-700">College</div>
              <div className="text-xs font-bold text-gray-700">Batch</div>
              <div className="text-xs font-bold text-gray-700">Contact</div>
              <div className="text-xs font-bold text-gray-700"></div>
            </div>

            {/* Table Rows */}
            <div className="space-y-3">
              {form.alumni.map((alumni) => (
                <div
                  key={alumni.id}
                  className="grid grid-cols-[140px_100px_120px_90px_110px_50px] gap-2 items-start"
                >
                  {/* Name */}
                  <input
                    type="text"
                    value={alumni.name}
                    onChange={(e) => updateAlumni(alumni.id, "name", e.target.value)}
                    placeholder="Name"
                    className={`w-full h-11 px-2 rounded-lg border text-xs bg-white focus:outline-none focus:ring-2 focus:ring-[#F59E0B] focus:border-transparent transition-all ${
                      errors[`${alumni.id}-name`] ? "border-red-400" : "border-gray-200"
                    }`}
                  />

                  {/* Relationship Dropdown */}
                  <div className="relative">
                    <select
                      value={alumni.relationship}
                      onChange={(e) => updateAlumni(alumni.id, "relationship", e.target.value)}
                      className={`w-full h-11 px-2 pr-6 rounded-lg border text-xs bg-white appearance-none focus:outline-none focus:ring-2 focus:ring-[#F59E0B] focus:border-transparent transition-all ${
                        errors[`${alumni.id}-relationship`] ? "border-red-400" : "border-gray-200"
                      }`}
                    >
                      <option value=""></option>
                      {RELATIONSHIP_OPTIONS.map((rel) => (
                        <option key={rel} value={rel}>
                          {rel}
                        </option>
                      ))}
                    </select>
                    <ChevronDown className="absolute right-2 top-1/2 -translate-y-1/2 w-3 h-3 text-gray-400 pointer-events-none" />
                  </div>

                  {/* College Dropdown */}
                  <div className="relative">
                    <select
                      value={alumni.college}
                      onChange={(e) => updateAlumni(alumni.id, "college", e.target.value)}
                      className={`w-full h-11 px-2 pr-6 rounded-lg border text-xs bg-white appearance-none focus:outline-none focus:ring-2 focus:ring-[#F59E0B] focus:border-transparent transition-all ${
                        errors[`${alumni.id}-college`] ? "border-red-400" : "border-gray-200"
                      }`}
                    >
                      <option value=""></option>
                      {COLLEGE_OPTIONS.map((college) => (
                        <option key={college} value={college}>
                          {college}
                        </option>
                      ))}
                    </select>
                    <ChevronDown className="absolute right-2 top-1/2 -translate-y-1/2 w-3 h-3 text-gray-400 pointer-events-none" />
                  </div>

                  {/* Batch Year Dropdown */}
                  <div className="relative">
                    <select
                      value={alumni.batch}
                      onChange={(e) => updateAlumni(alumni.id, "batch", e.target.value)}
                      className={`w-full h-11 px-2 pr-6 rounded-lg border text-xs bg-white appearance-none focus:outline-none focus:ring-2 focus:ring-[#F59E0B] focus:border-transparent transition-all ${
                        errors[`${alumni.id}-batch`] ? "border-red-400" : "border-gray-200"
                      }`}
                    >
                      <option value=""></option>
                      {batchYears.map((year) => (
                        <option key={year} value={year}>
                          {year}
                        </option>
                      ))}
                    </select>
                    <ChevronDown className="absolute right-2 top-1/2 -translate-y-1/2 w-3 h-3 text-gray-400 pointer-events-none" />
                  </div>

                  {/* Contact Number */}
                  <input
                    type="tel"
                    value={alumni.contactNumber}
                    onChange={(e) => updateAlumni(alumni.id, "contactNumber", e.target.value)}
                    placeholder="09XX"
                    className={`w-full h-11 px-2 rounded-lg border text-xs bg-white focus:outline-none focus:ring-2 focus:ring-[#F59E0B] focus:border-transparent transition-all ${
                      errors[`${alumni.id}-contactNumber`] ? "border-red-400" : "border-gray-200"
                    }`}
                  />

                  {/* Delete Button */}
                  <div className="flex items-center justify-center">
                    {form.alumni.length > 1 && (
                      <button
                        onClick={() => deleteRow(alumni.id)}
                        className="p-2 rounded-lg hover:bg-red-50 transition-colors"
                        title="Delete"
                      >
                        <Trash2 className="w-4 h-4 text-red-500" />
                      </button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Add Row Button */}
        <button
          onClick={addNewRow}
          className="mt-4 px-4 h-10 rounded-lg border border-gray-300 text-gray-600 hover:border-[#F59E0B] hover:text-[#F59E0B] transition-all flex items-center gap-2 font-medium text-sm"
        >
          <Plus className="w-4 h-4" />
          Add a new entry
        </button>

        {/* Note */}
        <div className="mt-4 p-3 bg-gray-50 rounded-lg">
          <p className="text-xs text-gray-500 italic">
            NOTE: If there are no relative alumni, leave the field blank.
          </p>
        </div>
      </div>

      {/* Bottom Action Buttons */}
      <div className="fixed bottom-0 left-1/2 -translate-x-1/2 w-full max-w-[430px] bg-white border-t border-gray-100 px-4 py-4 space-y-2.5 z-20">
        {errors.general && (
          <div className="bg-red-50 border border-red-200 rounded-xl px-4 py-3 text-xs text-red-600 mb-2">
            {errors.general}
          </div>
        )}
        <button
          onClick={handleSave}
          disabled={loading}
          className="w-full h-12 rounded-xl bg-[#1a1a1a] text-white font-semibold text-sm tracking-wide active:bg-black transition-all disabled:opacity-60 disabled:cursor-not-allowed flex items-center justify-center"
        >
          {loading ? "Saving..." : "Next"}
        </button>
        <button
          onClick={onBack}
          disabled={loading}
          className="w-full h-12 rounded-xl border-2 border-gray-300 text-gray-700 font-semibold text-sm tracking-wide active:bg-gray-50 transition-all disabled:opacity-60 disabled:cursor-not-allowed"
        >
          Back
        </button>
      </div>
    </div>
  );
}
