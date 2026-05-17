'use client'
import { useState } from "react";
import type { SchoolLevel, ApplicantType } from "../types/admissions.types";
import { SelectionTags } from "./SelectionTags";
import { logEvent, saveAcademicBackground } from "../services/admissions.service";
import { ChevronDown, Plus, Pencil, Trash2 } from "lucide-react";

interface GradeEntry {
  id: string;
  level: string;
  schoolName: string;
  completionYear: string;
  isEditing?: boolean;
}

interface FormState {
  grades: GradeEntry[];
}

interface FormErrors {
  [key: string]: string;
}

interface AcademicBackgroundProps {
  schoolLevel: SchoolLevel;
  applicantType: ApplicantType;
  applicantId: string;
  onSuccess: () => void;
  onBack: () => void;
}

function getGradeLevels(schoolLevel: SchoolLevel): string[] {
  switch (schoolLevel) {
    case "College":
      return ["Grade 12", "Grade 11", "Grade 10", "Grade 9", "Grade 8", "Grade 7", "Grade 6"];
    case "Senior High School":
      return ["Grade 10", "Grade 9", "Grade 8", "Grade 7", "Grade 6"];
    case "Junior High School":
      return ["Grade 6", "Grade 5", "Grade 4", "Grade 3", "Grade 2", "Grade 1"];
    case "Elementary":
      return ["Kindergarten", "Nursery"];
    case "Kinder":
      return ["Nursery", "Preschool"];
    default:
      return [];
  }
}

function generateYearOptions(): string[] {
  const currentYear = new Date().getFullYear();
  const years: string[] = [];
  for (let i = 0; i <= 20; i++) {
    years.push((currentYear - i).toString());
  }
  return years;
}

export function AcademicBackground({
  schoolLevel,
  applicantType,
  applicantId,
  onSuccess,
  onBack,
}: AcademicBackgroundProps) {
  const gradeLevels = getGradeLevels(schoolLevel);
  const yearOptions = generateYearOptions();

  const [form, setForm] = useState<FormState>({
    grades: gradeLevels.map((level, index) => ({
      id: `initial-${index}`,
      level,
      schoolName: "",
      completionYear: "",
      isEditing: false,
    })),
  });

  const [errors, setErrors] = useState<FormErrors>({});
  const [loading, setLoading] = useState(false);

  const updateGrade = (id: string, field: keyof GradeEntry, value: string | boolean) => {
    setForm((prev) => {
      const newGrades = prev.grades.map((grade) =>
        grade.id === id ? { ...grade, [field]: value } : grade
      );
      return { grades: newGrades };
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
    const newId = `custom-${Date.now()}`;
    setForm((prev) => ({
      grades: [
        ...prev.grades,
        {
          id: newId,
          level: "",
          schoolName: "",
          completionYear: "",
          isEditing: true,
        },
      ],
    }));
  };

  const deleteRow = (id: string) => {
    setForm((prev) => ({
      grades: prev.grades.filter((grade) => grade.id !== id),
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

  const toggleEdit = (id: string) => {
    setForm((prev) => ({
      grades: prev.grades.map((grade) =>
        grade.id === id ? { ...grade, isEditing: !grade.isEditing } : grade
      ),
    }));
  };

  const validateForm = (): boolean => {
    const newErrors: FormErrors = {};

    form.grades.forEach((grade) => {
      if (!grade.level.trim()) {
        newErrors[`${grade.id}-level`] = "Required";
      }
      if (!grade.schoolName.trim()) {
        newErrors[`${grade.id}-schoolName`] = "Required";
      }
      if (!grade.completionYear.trim()) {
        newErrors[`${grade.id}-completionYear`] = "Required";
      }
    });

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSave = async () => {
    if (!validateForm()) {
      return;
    }

    setLoading(true);

    const entries = form.grades.map(grade => ({
      grade_level: grade.level,
      school_name: grade.schoolName,
      completion_year: grade.completionYear,
    }));

    const res = await saveAcademicBackground({
      applicant_id: applicantId,
      entries,
    });

    if (res.error) {
      setErrors({ general: res.error.message });
      setLoading(false);
      return;
    }

    await logEvent("profile_completed", schoolLevel, applicantType, {
      applicant_id: applicantId,
      info_type: "academic",
    });

    setLoading(false);
    onSuccess();
  };

  return (
    <div className="flex-1 overflow-y-auto px-4 pt-5 pb-36">
      <SelectionTags schoolLevel={schoolLevel} applicantType={applicantType} />

      {/* Academic Background Card */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-5 mb-4">
        <div className="pb-3 border-b border-gray-100 mb-4">
          <h3 className="text-sm font-bold text-[#1a1a1a]">Academic Background</h3>
        </div>

        {/* Table Header */}
        <div className="grid grid-cols-[100px_1fr_110px_50px] gap-2 mb-3">
          <div className="text-xs font-bold text-gray-700">Level</div>
          <div className="text-xs font-bold text-gray-700">School Name</div>
          <div className="text-xs font-bold text-gray-700">Year</div>
          <div className="text-xs font-bold text-gray-700 text-center"></div>
        </div>

        {/* Table Rows */}
        <div className="space-y-3">
          {form.grades.map((grade) => {
            const isCustomRow = grade.id.startsWith("custom-");
            const canEdit = isCustomRow || grade.isEditing;

            return (
              <div key={grade.id} className="grid grid-cols-[100px_1fr_110px_50px] gap-2 items-start">
                {/* Level */}
                {canEdit ? (
                  <input
                    type="text"
                    value={grade.level}
                    onChange={(e) => updateGrade(grade.id, "level", e.target.value)}
                    placeholder="Grade"
                    className={`w-full h-11 px-2 rounded-lg border text-sm bg-white focus:outline-none focus:ring-2 focus:ring-[#F59E0B] focus:border-transparent transition-all ${
                      errors[`${grade.id}-level`] ? "border-red-400" : "border-gray-200"
                    }`}
                  />
                ) : (
                  <div className="h-11 px-2 rounded-lg border border-gray-200 bg-gray-50 flex items-center text-sm text-gray-700">
                    {grade.level}
                  </div>
                )}

                {/* School Name Input - Always Editable */}
                <div>
                  <input
                    type="text"
                    value={grade.schoolName}
                    onChange={(e) => updateGrade(grade.id, "schoolName", e.target.value)}
                    placeholder="School name"
                    className={`w-full h-11 px-2 rounded-lg border text-sm bg-white focus:outline-none focus:ring-2 focus:ring-[#F59E0B] focus:border-transparent transition-all ${
                      errors[`${grade.id}-schoolName`] ? "border-red-400" : "border-gray-200"
                    }`}
                  />
                </div>

                {/* Completion Year Dropdown */}
                <div className="relative">
                  <select
                    value={grade.completionYear}
                    onChange={(e) => updateGrade(grade.id, "completionYear", e.target.value)}
                    className={`w-full h-11 px-2 pr-6 rounded-lg border text-sm bg-white appearance-none focus:outline-none focus:ring-2 focus:ring-[#F59E0B] focus:border-transparent transition-all ${
                      errors[`${grade.id}-completionYear`] ? "border-red-400" : "border-gray-200"
                    }`}
                  >
                    <option value=""></option>
                    {yearOptions.map((year) => (
                      <option key={year} value={year}>
                        {year}
                      </option>
                    ))}
                  </select>
                  <ChevronDown className="absolute right-2 top-1/2 -translate-y-1/2 w-3 h-3 text-gray-400 pointer-events-none" />
                </div>

                {/* Actions */}
                <div className="flex items-center justify-center">
                  {!isCustomRow && (
                    <button
                      onClick={() => toggleEdit(grade.id)}
                      className="p-2 rounded-lg hover:bg-gray-100 transition-colors"
                      title={grade.isEditing ? "Lock" : "Edit"}
                    >
                      <Pencil className={`w-4 h-4 ${grade.isEditing ? "text-[#F59E0B]" : "text-gray-500"}`} />
                    </button>
                  )}
                  {isCustomRow && (
                    <button
                      onClick={() => deleteRow(grade.id)}
                      className="p-2 rounded-lg hover:bg-red-50 transition-colors"
                      title="Delete"
                    >
                      <Trash2 className="w-4 h-4 text-red-500" />
                    </button>
                  )}
                </div>
              </div>
            );
          })}
        </div>

        {/* Add Row Button */}
        <button
          onClick={addNewRow}
          className="mt-4 w-full h-11 rounded-lg border-2 border-dashed border-gray-300 text-gray-600 hover:border-[#F59E0B] hover:text-[#F59E0B] transition-all flex items-center justify-center gap-2 font-medium text-sm"
        >
          <Plus className="w-4 h-4" />
          Add Another Grade Level
        </button>
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
