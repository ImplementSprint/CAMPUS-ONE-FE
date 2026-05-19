'use client'
import type { ApplicantType, SchoolLevel } from "../types/admissions.types";

const AVAILABLE: Record<SchoolLevel, ApplicantType[]> = {
  Kinder: ["Freshman"],
  Elementary: ["Freshman", "Transferee"],
  "Junior High School": ["Freshman", "Transferee", "Returnee"],
  "Senior High School": ["Freshman", "Transferee", "Returnee"],
  College: ["Freshman", "Transferee", "Shiftee", "Returnee"],
};

const TYPE_META: Record<ApplicantType, { desc: string }> = {
  Freshman: {
    desc: "First-time applicant, no prior enrollment",
  },
  Transferee: {
    desc: "Coming from another school or institution",
  },
  Shiftee: {
    desc: "Changing program within the school",
  },
  Returnee: {
    desc: "Returning after a leave or gap period",
  },
};

const ALL: ApplicantType[] = ["Freshman", "Transferee", "Shiftee", "Returnee"];

interface Props {
  schoolLevel: SchoolLevel;
  selected: ApplicantType | null;
  onSelect: (type: ApplicantType) => void;
}

export function ApplicantTypeSelection({ schoolLevel, selected, onSelect }: Props) {
  const available = AVAILABLE[schoolLevel];

  return (
    <div className="space-y-2.5">
      <p className="text-xs font-semibold text-gray-400 uppercase tracking-widest mb-3">
        Applicant Type
      </p>

      {ALL.map((type) => {
        const isAvail = available.includes(type);
        const isSel = selected === type;
        const meta = TYPE_META[type];

        return (
          <button
            key={type}
            onClick={() => isAvail && onSelect(type)}
            disabled={!isAvail}
            className={`w-full flex items-center justify-between px-4 py-3.5 rounded-xl border-2 transition-all duration-150 text-left active:scale-[0.98] ${
              !isAvail
                ? "border-gray-100 bg-gray-50 opacity-50 cursor-not-allowed"
                : isSel
                ? "border-[#F59E0B] bg-[#FFFBEB] shadow-sm"
                : "border-gray-200 bg-white hover:border-gray-300"
            }`}
          >
            <div className="flex-1">
              <div
                className={`font-semibold text-sm ${
                  isSel ? "text-[#92400E]" : isAvail ? "text-gray-800" : "text-gray-400"
                }`}
              >
                {type}
              </div>

              <div className="text-xs text-gray-400 mt-0.5">{meta.desc}</div>
            </div>

            {!isAvail ? (
              <span className="text-[10px] bg-gray-200 text-gray-400 px-2 py-0.5 rounded-full">
                N/A
              </span>
            ) : (
              <div
                className={`w-5 h-5 rounded-full border-2 flex items-center justify-center transition-all ${
                  isSel ? "border-[#F59E0B] bg-[#F59E0B]" : "border-gray-300"
                }`}
              >
                {isSel && (
                  <svg
                    className="w-3 h-3 text-white"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={3}
                      d="M5 13l4 4L19 7"
                    />
                  </svg>
                )}
              </div>
            )}
          </button>
        );
      })}
    </div>
  );
}