'use client'
import { useState, useEffect } from "react";
import type { AdmissionResult, SchoolLevel, ApplicantType } from "../types/admissions.types";
import { getApplicantAdmissionResult, logEvent } from "../services/admissions.service";

// Helper function to get the program display value based on school level
function getProgramDisplay({
  schoolLevel,
  collegeProgram,
  collegeDepartment,
  seniorHighTrack,
  tvlStrand,
}: {
  schoolLevel: SchoolLevel;
  collegeProgram?: string | null;
  collegeDepartment?: string | null;
  seniorHighTrack?: string | null;
  tvlStrand?: string | null;
}): string {
  switch (schoolLevel) {
    case "College":
      if (collegeDepartment && collegeProgram) {
        return `${collegeDepartment} - ${collegeProgram}`;
      }
      return collegeProgram || "College Program";
    case "Senior High School":
      if (tvlStrand && seniorHighTrack === "TVL") {
        return `${seniorHighTrack} - ${tvlStrand}`;
      }
      return seniorHighTrack || "Senior High School";
    case "Junior High School":
      return "Junior High School";
    case "Elementary":
      return "Grade School";
    case "Kinder":
      return "Kindergarten";
    default:
      return "N/A";
  }
}

interface Props {
  applicantId: string;
  schoolLevel: SchoolLevel;
  applicantType: ApplicantType;
  firstName: string;
  lastName: string;
  collegeProgram?: string | null;
  collegeDepartment?: string | null;
  seniorHighTrack?: string | null;
  tvlStrand?: string | null;
}

export function AdmissionResultPortal({
  applicantId,
  schoolLevel,
  applicantType,
  firstName,
  lastName,
  collegeProgram,
  collegeDepartment,
  seniorHighTrack,
  tvlStrand,
}: Props) {
  const [result, setResult] = useState<AdmissionResult | null>(null);
  const [loading, setLoading] = useState(true);

  const programDisplay = getProgramDisplay({
    schoolLevel,
    collegeProgram,
    collegeDepartment,
    seniorHighTrack,
    tvlStrand,
  });

  useEffect(() => {
    const load = async () => {
      setLoading(true);
      const res = await getApplicantAdmissionResult(applicantId);
      if (res.error) {
        // No result row yet — applicant is still under review
        setResult(null);
      } else {
        setResult(res.data);
        await logEvent("result_checked", schoolLevel, applicantType, { applicant_id: applicantId });
      }
      setLoading(false);
    };

    load();
  }, [applicantId, schoolLevel, applicantType]);

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center py-20 gap-3">
        <div className="w-10 h-10 border-4 border-[#F59E0B] border-t-transparent rounded-full animate-spin" />
        <p className="text-sm text-gray-400">Loading your result...</p>
      </div>
    );
  }

  // No result row yet - application is still being processed
  if (!result) {
    return (
      <div className="rounded-xl border-2 border-yellow-200 bg-yellow-50 p-5 text-center space-y-2">
        <div className="text-sm font-semibold text-yellow-700">Pending Review</div>
        <p className="text-sm font-bold text-yellow-800">Application Under Review</p>
        <p className="text-xs text-yellow-700 leading-relaxed">
          Your application has been submitted and is currently being reviewed. You will be notified once a decision is made.
        </p>
      </div>
    );
  }

  // Mock exam scores - in real app, this would come from the result data
  const examScores = {
    mentalAbility: 99,
    english: 98,
    mathematics: 99,
  };

  const fullName = `${lastName.toUpperCase()}, ${firstName.toUpperCase()}`;
  const birthDate = "January 1, 2003"; // This should come from profile data

  return (
    <div className="space-y-4">
      {/* Applicant Information Section */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="bg-[#1a1a1a] px-5 py-3">
          <h3 className="text-sm font-bold text-white">Applicant Information</h3>
        </div>
        <div className="p-5 space-y-3">
          <div className="grid grid-cols-[140px_1fr] gap-2">
            <span className="text-xs font-semibold text-gray-600">Applicant Number:</span>
            <span className="text-xs text-gray-800">{applicantId || "20258907"}</span>
          </div>
          <div className="grid grid-cols-[140px_1fr] gap-2">
            <span className="text-xs font-semibold text-gray-600">Applicant Name:</span>
            <span className="text-xs text-gray-800">{fullName}</span>
          </div>
          <div className="grid grid-cols-[140px_1fr] gap-2">
            <span className="text-xs font-semibold text-gray-600">Birth Date:</span>
            <span className="text-xs text-gray-800">{birthDate}</span>
          </div>
        </div>
      </div>

      {/* Program Reserved Section */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="bg-[#1a1a1a] px-5 py-3">
          <h3 className="text-sm font-bold text-white">Program Reserved</h3>
        </div>
        <div className="p-5 space-y-4">
          <div className="grid grid-cols-[140px_1fr] gap-2">
            <span className="text-xs font-semibold text-gray-600">Priority Program:</span>
            <span className="text-xs text-gray-800 uppercase">{programDisplay}</span>
          </div>

          <div className="grid grid-cols-[140px_1fr] gap-2 items-center">
            <span className="text-xs font-semibold text-gray-600">Status:</span>
            <span className="text-sm font-bold text-green-600">
              {result.status === "Passed" ? "Qualified" : result.status}
            </span>
          </div>

          {/* Exam Scores Table */}
          {result.status === "Passed" && (
            <div className="border border-gray-200 rounded-lg overflow-hidden mt-4">
              <div className="grid grid-cols-4 bg-gray-50 border-b border-gray-200">
                <div className="px-4 py-3 text-xs font-bold text-gray-700 text-center border-r border-gray-200">
                  SCORE STATUS
                </div>
                <div className="px-4 py-3 text-xs font-bold text-gray-700 text-center border-r border-gray-200">
                  MENTAL ABILITY
                </div>
                <div className="px-4 py-3 text-xs font-bold text-gray-700 text-center border-r border-gray-200">
                  ENGLISH
                </div>
                <div className="px-4 py-3 text-xs font-bold text-gray-700 text-center">
                  MATHEMATICS
                </div>
              </div>
              <div className="grid grid-cols-4 bg-white">
                <div className="px-4 py-4 text-xs text-gray-600 text-center border-r border-gray-200 flex items-center justify-center">
                  {/* Empty cell for score status label */}
                </div>
                <div className="px-4 py-4 border-r border-gray-200">
                  <div className="text-center">
                    <div className="text-lg font-bold text-gray-800">{examScores.mentalAbility}</div>
                    <div className="text-xs text-green-600 font-medium">Qualified</div>
                  </div>
                </div>
                <div className="px-4 py-4 border-r border-gray-200">
                  <div className="text-center">
                    <div className="text-lg font-bold text-gray-800">{examScores.english}</div>
                    <div className="text-xs text-green-600 font-medium">Qualified</div>
                  </div>
                </div>
                <div className="px-4 py-4">
                  <div className="text-center">
                    <div className="text-lg font-bold text-gray-800">{examScores.mathematics}</div>
                    <div className="text-xs text-green-600 font-medium">Qualified</div>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Status Message */}
      {result.status === "Passed" && (
        <div className="bg-green-50 border border-green-200 rounded-xl p-4">
          <p className="text-sm font-bold text-green-800 mb-1">Congratulations!</p>
          <p className="text-xs text-green-700 leading-relaxed">
            You have successfully qualified for admission. Please check your email for further instructions and next steps.
          </p>
        </div>
      )}

      {result.status === "Not Accepted" && (
        <div className="bg-red-50 border border-red-200 rounded-xl p-4">
          <p className="text-sm font-bold text-red-800 mb-1">Application Not Accepted</p>
          <p className="text-xs text-red-700 leading-relaxed">
            We regret to inform you that your application was not accepted. Please contact the admissions office for more information.
          </p>
        </div>
      )}
    </div>
  );
}
