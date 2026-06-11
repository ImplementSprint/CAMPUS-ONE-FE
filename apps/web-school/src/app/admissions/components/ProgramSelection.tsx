'use client'
import { useState } from "react";
import type {
  SchoolLevel,
  ApplicantType,
  CollegeDepartment,
  CollegeProgram,
  SeniorHighTrack,
  TVLStrand,
} from "../types/admissions.types";
import { SelectionTags } from "./SelectionTags";
import { saveProgramSelection } from "../services/admissions.service";
import {
  COLLEGE_DEPARTMENTS,
  getProgramsForDepartment,
  SENIOR_HIGH_TRACKS,
  TVL_STRANDS,
  hasStrandSelection,
  getEducationLevelDisplay,
} from "../services/program.config";

interface Props {
  schoolLevel: SchoolLevel;
  applicantType: ApplicantType;
  onSuccess: (data: {
    collegeDepartment?: CollegeDepartment;
    collegeProgram?: CollegeProgram;
    seniorHighTrack?: SeniorHighTrack;
    tvlStrand?: TVLStrand;
  }) => void;
  onBack: () => void;
}

export function ProgramSelection({
  schoolLevel,
  applicantType,
  onSuccess,
  onBack,
}: Props) {
  const [collegeDepartment, setCollegeDepartment] = useState<CollegeDepartment | null>(null);
  const [collegeProgram, setCollegeProgram] = useState<CollegeProgram | null>(null);
  const [seniorHighTrack, setSeniorHighTrack] = useState<SeniorHighTrack | null>(null);
  const [tvlStrand, setTvlStrand] = useState<TVLStrand | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const getAvailablePrograms = (): CollegeProgram[] => {
    if (!collegeDepartment) return [];
    return getProgramsForDepartment(collegeDepartment);
  };

  const canContinue = (): boolean => {
    if (schoolLevel === "College") {
      return !!collegeDepartment && !!collegeProgram;
    }
    if (schoolLevel === "Senior High School") {
      if (!seniorHighTrack) return false;
      if (seniorHighTrack === "TVL" && !tvlStrand) return false;
      return true;
    }
    return true;
  };

  const handleContinue = async () => {
    if (!canContinue()) return;

    setLoading(true);
    setError(null);

    // Get applicant_id from session storage or context
    const applicantId = sessionStorage.getItem("applicant_id") || "";

    if (schoolLevel === "College") {
      const res = await saveProgramSelection({
        applicant_id: applicantId,
        school_level: schoolLevel,
        applicant_type: applicantType,
        college_department: collegeDepartment!,
        college_program: collegeProgram!,
      });

      if (res.error) {
        setError(res.error.message);
        setLoading(false);
        return;
      }

      onSuccess({
        collegeDepartment: collegeDepartment!,
        collegeProgram: collegeProgram!,
      });
    } else if (schoolLevel === "Senior High School") {
      const res = await saveProgramSelection({
        applicant_id: applicantId,
        school_level: schoolLevel,
        applicant_type: applicantType,
        senior_high_track: seniorHighTrack!,
        tvl_strand: seniorHighTrack === "TVL" ? tvlStrand! : undefined,
      });

      if (res.error) {
        setError(res.error.message);
        setLoading(false);
        return;
      }

      const data: any = { seniorHighTrack: seniorHighTrack! };
      if (seniorHighTrack === "TVL") {
        data.tvlStrand = tvlStrand;
      }
      onSuccess(data);
    } else {
      // For other levels (Junior High, Elementary, Kinder), no additional selection needed
      const res = await saveProgramSelection({
        applicant_id: applicantId,
        school_level: schoolLevel,
        applicant_type: applicantType,
      });

      if (res.error) {
        setError(res.error.message);
        setLoading(false);
        return;
      }

      onSuccess({});
    }

    setLoading(false);
  };

  // For Junior High, Elementary, and Kinder - just show the education level
  if (
    schoolLevel === "Junior High School" ||
    schoolLevel === "Elementary" ||
    schoolLevel === "Kinder"
  ) {
    return (
      <div className="px-4 pt-5 pb-5">
        <SelectionTags schoolLevel={schoolLevel} applicantType={applicantType} />

        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-5">
          <div className="space-y-4">
            <div className="py-3">
              <p className="text-xs font-semibold text-gray-400 uppercase tracking-widest mb-2">
                Education Level
              </p>
              <p className="text-sm font-semibold text-gray-800 p-3 bg-gray-50 rounded-lg">
                {getEducationLevelDisplay(schoolLevel)}
              </p>
            </div>
          </div>
        </div>

        <div className="mt-6 flex flex-col-reverse gap-3 border-t border-neutral-200 pt-4 sm:flex-row sm:justify-end">
          <button
            onClick={handleContinue}
            className="h-11 rounded-md bg-campus-brand px-4 text-sm font-semibold text-campus-ink transition-colors hover:bg-campus-brandStrong hover:text-white sm:min-w-36"
          >
            Continue
          </button>
          <button
            onClick={onBack}
            className="h-11 rounded-md border border-neutral-300 px-4 text-sm font-medium text-neutral-700 transition-colors hover:bg-neutral-50 sm:min-w-28"
          >
            Back
          </button>
        </div>
      </div>
    );
  }

  // College program selection
  if (schoolLevel === "College") {
    const availablePrograms = getAvailablePrograms();

    return (
      <div className="px-4 pt-5 pb-5">
        <SelectionTags schoolLevel={schoolLevel} applicantType={applicantType} />

        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-5 space-y-4">
          {/* Department Selection */}
          <div>
            <p className="text-xs font-semibold text-gray-400 uppercase tracking-widest mb-2.5">
              College Department <span className="text-red-500">*</span>
            </p>
            <select
              aria-label="College Department"
              value={collegeDepartment ?? ""}
              onChange={(e) => {
                setCollegeDepartment(e.target.value as CollegeDepartment);
                setCollegeProgram(null); // Reset program when department changes
              }}
              className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-[#F59E0B] focus:outline-none font-medium text-sm text-gray-800 bg-white transition-colors"
            >
              <option value="">Select a department...</option>
              {COLLEGE_DEPARTMENTS.map((dept) => (
                <option key={dept} value={dept}>
                  {dept}
                </option>
              ))}
            </select>
          </div>

          {/* Program Selection */}
          <div>
            <p className="text-xs font-semibold text-gray-400 uppercase tracking-widest mb-2.5">
              Program / Course <span className="text-red-500">*</span>
            </p>
            <select
              aria-label="Program / Course"
              value={collegeProgram ?? ""}
              onChange={(e) => setCollegeProgram(e.target.value as CollegeProgram)}
              disabled={!collegeDepartment}
              className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-[#F59E0B] focus:outline-none font-medium text-sm text-gray-800 bg-white transition-colors disabled:bg-gray-50 disabled:text-gray-400"
            >
              <option value="">
                {collegeDepartment ? "Select a program..." : "Select a department first"}
              </option>
              {availablePrograms.map((prog) => (
                <option key={prog} value={prog}>
                  {prog}
                </option>
              ))}
            </select>
          </div>

          {/* Program Description */}
          {collegeProgram && (
            <div>
              <p className="text-xs font-semibold text-gray-400 uppercase tracking-widest mb-2.5">
                Program Description
              </p>
              <div className="w-full px-4 py-3 border border-gray-200 rounded-xl bg-gray-50 text-sm text-gray-500 min-h-[120px]">
                {/* Description will be populated by admin */}
                <p className="italic">Program description will be available soon.</p>
              </div>
            </div>
          )}
        </div>

        <div className="mt-6 flex flex-col-reverse gap-3 border-t border-neutral-200 pt-4 sm:flex-row sm:justify-end">
          <button
            onClick={handleContinue}
            disabled={!canContinue()}
            className={`h-11 rounded-md px-4 text-sm font-semibold transition-colors sm:min-w-36 ${
              canContinue()
                ? "bg-campus-brand text-campus-ink hover:bg-campus-brandStrong hover:text-white"
                : "bg-gray-100 text-gray-400 cursor-not-allowed"
            }`}
          >
            Continue
          </button>
          <button
            onClick={onBack}
            className="h-11 rounded-md border border-neutral-300 px-4 text-sm font-medium text-neutral-700 transition-colors hover:bg-neutral-50 sm:min-w-28"
          >
            Back
          </button>
        </div>
      </div>
    );
  }

  // Senior High School track selection
  if (schoolLevel === "Senior High School") {
    return (
      <div className="px-4 pt-5 pb-5">
        <SelectionTags schoolLevel={schoolLevel} applicantType={applicantType} />

        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-5 space-y-4">
          {/* Track Selection */}
          <div>
            <p className="text-xs font-semibold text-gray-400 uppercase tracking-widest mb-2.5">
              Track <span className="text-red-500">*</span>
            </p>
            <div className="space-y-2.5">
              {SENIOR_HIGH_TRACKS.map((track) => (
                <button
                  key={track}
                  onClick={() => {
                    setSeniorHighTrack(track);
                    setTvlStrand(null); // Reset strand when track changes
                  }}
                  className={`w-full px-4 py-3.5 rounded-xl border-2 transition-all duration-150 text-left active:scale-[0.98] font-semibold text-sm ${
                    seniorHighTrack === track
                      ? "border-[#F59E0B] bg-[#FFFBEB] text-[#92400E]"
                      : "border-gray-200 bg-white text-gray-800 hover:border-gray-300"
                  }`}
                >
                  {track}
                </button>
              ))}
            </div>
          </div>

          {/* Strand Selection (for TVL track) */}
          {seniorHighTrack === "TVL" && (
            <div>
              <p className="text-xs font-semibold text-gray-400 uppercase tracking-widest mb-2.5">
                Strand (TVL) <span className="text-red-500">*</span>
              </p>
              <div className="space-y-2.5">
                {TVL_STRANDS.map((strand) => (
                  <button
                    key={strand}
                    onClick={() => setTvlStrand(strand)}
                    className={`w-full px-4 py-3.5 rounded-xl border-2 transition-all duration-150 text-left active:scale-[0.98] font-semibold text-sm ${
                      tvlStrand === strand
                        ? "border-[#F59E0B] bg-[#FFFBEB] text-[#92400E]"
                        : "border-gray-200 bg-white text-gray-800 hover:border-gray-300"
                    }`}
                  >
                    {strand}
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>

        <div className="mt-6 flex flex-col-reverse gap-3 border-t border-neutral-200 pt-4 sm:flex-row sm:justify-end">
          <button
            onClick={handleContinue}
            disabled={!canContinue()}
            className={`h-11 rounded-md px-4 text-sm font-semibold transition-colors sm:min-w-36 ${
              canContinue()
                ? "bg-campus-brand text-campus-ink hover:bg-campus-brandStrong hover:text-white"
                : "bg-gray-100 text-gray-400 cursor-not-allowed"
            }`}
          >
            Continue
          </button>
          <button
            onClick={onBack}
            className="h-11 rounded-md border border-neutral-300 px-4 text-sm font-medium text-neutral-700 transition-colors hover:bg-neutral-50 sm:min-w-28"
          >
            Back
          </button>
        </div>
      </div>
    );
  }

  return null;
}
