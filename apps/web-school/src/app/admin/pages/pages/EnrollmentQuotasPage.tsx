import { useState } from "react";
import { Edit, TrendingUp, AlertTriangle } from "lucide-react";

interface Quota {
  id: string;
  program: string;
  totalSlots: number;
  accepted: number;
  remaining: number;
}

export function EnrollmentQuotasPage() {
  const [quotas] = useState<Quota[]>([
    { id: "Q-001", program: "BS Computer Science", totalSlots: 120, accepted: 98, remaining: 22 },
    { id: "Q-002", program: "BS Business Administration", totalSlots: 100, accepted: 85, remaining: 15 },
    { id: "Q-003", program: "BS Nursing", totalSlots: 80, accepted: 76, remaining: 4 },
    { id: "Q-004", program: "BS Engineering", totalSlots: 150, accepted: 89, remaining: 61 },
  ]);

  const getPercentFilled = (accepted: number, total: number) => {
    return Math.round((accepted / total) * 100);
  };

  const getStatusColor = (percentFilled: number) => {
    if (percentFilled >= 80) return { bg: "bg-red-500", text: "text-red-600", border: "border-red-200", bgLight: "bg-red-50" };
    if (percentFilled >= 50) return { bg: "bg-amber-500", text: "text-amber-600", border: "border-amber-200", bgLight: "bg-amber-50" };
    return { bg: "bg-green-500", text: "text-green-600", border: "border-green-200", bgLight: "bg-green-50" };
  };

  return (
    <div className="p-10">
      <div className="space-y-6">
        {quotas.map((quota) => {
          const percentFilled = getPercentFilled(quota.accepted, quota.totalSlots);
          const colors = getStatusColor(percentFilled);
          const isLow = percentFilled >= 80;

          return (
            <div key={quota.id} className="bg-white rounded-2xl p-6 border border-gray-200 shadow-sm hover:shadow-lg transition-all">
              <div className="flex items-start justify-between mb-6">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2">
                    <h3 className="text-xl font-bold text-gray-900">{quota.program}</h3>
                    {isLow && (
                      <span className={`flex items-center gap-1 px-3 py-1 ${colors.bgLight} ${colors.text} rounded-full text-xs font-semibold border ${colors.border}`}>
                        <AlertTriangle className="w-3 h-3" />
                        Low Availability
                      </span>
                    )}
                  </div>
                  <p className="text-sm text-gray-500 font-mono">{quota.id}</p>
                </div>
                <button
                  onClick={() => alert(`Edit quota for ${quota.program}`)}
                  className="p-2 text-[#F59E0B] hover:bg-amber-50 rounded-lg transition-colors"
                >
                  <Edit className="w-5 h-5" />
                </button>
              </div>

              <div className="grid grid-cols-3 gap-4 mb-6">
                <div className="bg-blue-50 rounded-xl p-4 border border-blue-200">
                  <p className="text-sm font-semibold text-blue-600 mb-1">Total Slots</p>
                  <p className="text-3xl font-bold text-blue-700">{quota.totalSlots}</p>
                </div>
                <div className="bg-green-50 rounded-xl p-4 border border-green-200">
                  <p className="text-sm font-semibold text-green-600 mb-1">Accepted</p>
                  <p className="text-3xl font-bold text-green-700">{quota.accepted}</p>
                </div>
                <div className={`${colors.bgLight} rounded-xl p-4 border ${colors.border}`}>
                  <p className={`text-sm font-semibold ${colors.text} mb-1`}>Remaining</p>
                  <p className={`text-3xl font-bold ${colors.text}`}>{quota.remaining}</p>
                </div>
              </div>

              {/* Progress Bar */}
              <div className="space-y-2">
                <div className="flex justify-between items-center text-sm">
                  <span className="font-semibold text-gray-700">Enrollment Progress</span>
                  <span className={`font-bold ${colors.text}`}>{percentFilled}% Filled</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-4 overflow-hidden">
                  <div
                    className={`${colors.bg} h-4 rounded-full transition-all duration-500 flex items-center justify-end pr-2`}
                    style={{ width: `${percentFilled}%` }}
                  >
                    {percentFilled > 10 && (
                      <TrendingUp className="w-3 h-3 text-white" />
                    )}
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
