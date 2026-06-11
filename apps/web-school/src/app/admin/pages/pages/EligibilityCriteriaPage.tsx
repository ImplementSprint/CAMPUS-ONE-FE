import { useState } from "react";
import { Edit, ChevronDown, ChevronUp, GraduationCap } from "lucide-react";

interface Program {
  id: string;
  name: string;
  minGPA: number;
  requiredDocs: string[];
  ageLimit: string;
  examPassingScore: number;
}

export function EligibilityCriteriaPage() {
  const [expandedPrograms, setExpandedPrograms] = useState<string[]>(["PROG-001"]);
  const [statusMessage, setStatusMessage] = useState<string | null>(null);
  
  const [programs] = useState<Program[]>([
    {
      id: "PROG-001",
      name: "BS Computer Science",
      minGPA: 3.0,
      requiredDocs: ["High School Diploma", "Transcript of Records", "Birth Certificate", "Valid ID"],
      ageLimit: "18-25 years",
      examPassingScore: 75
    },
    {
      id: "PROG-002",
      name: "BS Nursing",
      minGPA: 3.5,
      requiredDocs: ["High School Diploma", "Transcript of Records", "Birth Certificate", "Valid ID", "Medical Certificate"],
      ageLimit: "18-30 years",
      examPassingScore: 80
    },
    {
      id: "PROG-003",
      name: "BS Business Administration",
      minGPA: 2.8,
      requiredDocs: ["High School Diploma", "Transcript of Records", "Birth Certificate", "Valid ID"],
      ageLimit: "18-28 years",
      examPassingScore: 70
    },
  ]);

  const toggleExpand = (id: string) => {
    setExpandedPrograms(prev =>
      prev.includes(id) ? prev.filter(p => p !== id) : [...prev, id]
    );
  };

  return (
    <div className="p-10">
      {statusMessage && (
        <div className="mb-6 rounded-md border border-amber-200 bg-amber-50 px-4 py-3 text-sm font-medium text-amber-800" role="status">
          {statusMessage}
        </div>
      )}
      <div className="space-y-4">
        {programs.map((program) => {
          const isExpanded = expandedPrograms.includes(program.id);
          
          return (
            <div key={program.id} className="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden">
              {/* Header */}
              <button
                onClick={() => toggleExpand(program.id)}
                className="w-full flex items-center justify-between p-6 hover:bg-gray-50 transition-colors"
              >
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-[#F59E0B] to-[#D97706] flex items-center justify-center shadow-lg">
                    <GraduationCap className="w-6 h-6 text-white" />
                  </div>
                  <div className="text-left">
                    <h3 className="text-lg font-bold text-gray-900">{program.name}</h3>
                    <p className="text-sm text-gray-500">{program.id}</p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      setStatusMessage(`Eligibility editing requires the admissions criteria service for ${program.name}.`);
                    }}
                    className="p-2 text-[#F59E0B] hover:bg-amber-50 rounded-lg transition-colors"
                  >
                    <Edit className="w-5 h-5" />
                  </button>
                  {isExpanded ? (
                    <ChevronUp className="w-6 h-6 text-gray-400" />
                  ) : (
                    <ChevronDown className="w-6 h-6 text-gray-400" />
                  )}
                </div>
              </button>

              {/* Expanded Content */}
              {isExpanded && (
                <div className="px-6 pb-6 border-t border-gray-200">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
                    {/* Minimum GPA */}
                    <div className="bg-blue-50 rounded-xl p-4 border border-blue-200">
                      <p className="text-sm font-semibold text-blue-600 mb-2">Minimum GPA</p>
                      <p className="text-3xl font-bold text-blue-700">{program.minGPA}</p>
                    </div>

                    {/* Exam Passing Score */}
                    <div className="bg-green-50 rounded-xl p-4 border border-green-200">
                      <p className="text-sm font-semibold text-green-600 mb-2">Exam Passing Score</p>
                      <p className="text-3xl font-bold text-green-700">{program.examPassingScore}%</p>
                    </div>

                    {/* Age Limit */}
                    <div className="bg-purple-50 rounded-xl p-4 border border-purple-200">
                      <p className="text-sm font-semibold text-purple-600 mb-2">Age Limit</p>
                      <p className="text-xl font-bold text-purple-700">{program.ageLimit}</p>
                    </div>

                    {/* Required Documents */}
                    <div className="bg-amber-50 rounded-xl p-4 border border-amber-200">
                      <p className="text-sm font-semibold text-amber-600 mb-3">Required Documents</p>
                      <ul className="space-y-2">
                        {program.requiredDocs.map((doc, idx) => (
                          <li key={idx} className="flex items-center gap-2 text-sm text-amber-700">
                            <div className="w-1.5 h-1.5 rounded-full bg-amber-600"></div>
                            {doc}
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
