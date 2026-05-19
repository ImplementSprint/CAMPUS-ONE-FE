'use client'
import type { SchoolLevel, ApplicantType } from "../types/admissions.types";

interface SelectionTagsProps {
  schoolLevel: SchoolLevel | null;
  applicantType: ApplicantType | null;
}

export function SelectionTags({ schoolLevel, applicantType }: SelectionTagsProps) {
  if (!schoolLevel && !applicantType) return null;
  return (
    <div className="flex items-center gap-2 flex-wrap mb-4">
      {schoolLevel && (
        <span className="inline-flex items-center gap-1 text-xs font-semibold bg-[#FFF3CD] text-[#92400E] px-3 py-1 rounded-full">
          <span className="w-1.5 h-1.5 rounded-full bg-[#F59E0B] inline-block" />
          {schoolLevel}
        </span>
      )}
      {applicantType && (
        <span className="inline-flex items-center gap-1 text-xs font-semibold bg-gray-100 text-gray-600 px-3 py-1 rounded-full">
          <span className="w-1.5 h-1.5 rounded-full bg-gray-400 inline-block" />
          {applicantType}
        </span>
      )}
    </div>
  );
}
