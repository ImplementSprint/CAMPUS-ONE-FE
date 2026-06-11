'use client'
import type { SchoolLevel } from "../types/admissions.types";

const LEVELS: { level: SchoolLevel; sub: string }[] = [
  { level: "Kinder", sub: "Ages 5-6" },
  { level: "Elementary", sub: "Grades 1-6" },
  { level: "Junior High School", sub: "Grades 7-10" },
  { level: "Senior High School", sub: "Grades 11-12" },
  { level: "College", sub: "Undergraduate" },
];

interface Props {
  selected: SchoolLevel | null;
  onSelect: (level: SchoolLevel) => void;
}

export function SchoolLevelSelection({ selected, onSelect }: Props) {
  return (
    <div className="space-y-2.5">
      <p className="text-xs font-semibold text-gray-400 uppercase tracking-widest mb-3">
        School Level
      </p>

      {LEVELS.map(({ level, sub }) => {
        const isSelected = selected === level;

        return (
          <button
            key={level}
            onClick={() => onSelect(level)}
            className={`w-full flex items-center justify-between px-4 py-3.5 rounded-xl border-2 transition-all duration-150 text-left active:scale-[0.98] ${
              isSelected
                ? "border-[#F59E0B] bg-[#FFFBEB] shadow-sm"
                : "border-gray-200 bg-white hover:border-gray-300"
            }`}
          >
            <div className="flex-1">
              <div
                className={`font-semibold text-sm ${
                  isSelected ? "text-[#92400E]" : "text-gray-800"
                }`}
              >
                {level}
              </div>

              <div className="text-xs text-gray-400 mt-0.5">{sub}</div>
            </div>

            <div
              className={`w-5 h-5 rounded-full border-2 flex items-center justify-center flex-shrink-0 transition-all ${
                isSelected ? "border-[#F59E0B] bg-[#F59E0B]" : "border-gray-300"
              }`}
            >
              {isSelected && (
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
          </button>
        );
      })}
    </div>
  );
}
