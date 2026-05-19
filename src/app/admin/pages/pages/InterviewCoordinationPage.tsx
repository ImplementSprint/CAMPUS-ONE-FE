import { useState } from "react";
import { Plus, User, Calendar, Clock } from "lucide-react";

interface Interview {
  id: string;
  day: string;
  time: string;
  applicant: string;
  interviewer: string;
  status: "Scheduled" | "Done" | "No-show";
}

export function InterviewCoordinationPage() {
  const [interviews] = useState<Interview[]>([
    { id: "INT-001", day: "Monday", time: "09:00 AM", applicant: "Maria Santos", interviewer: "Dr. Smith", status: "Scheduled" },
    { id: "INT-002", day: "Monday", time: "10:00 AM", applicant: "Juan Dela Cruz", interviewer: "Prof. Johnson", status: "Done" },
    { id: "INT-003", day: "Tuesday", time: "09:00 AM", applicant: "Ana Reyes", interviewer: "Dean Martinez", status: "Scheduled" },
    { id: "INT-004", day: "Wednesday", time: "02:00 PM", applicant: "Pedro Garcia", interviewer: "Dr. Smith", status: "No-show" },
  ]);

  const days = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"];
  const times = ["09:00 AM", "10:00 AM", "11:00 AM", "02:00 PM", "03:00 PM", "04:00 PM"];

  const getStatusColor = (status: string) => {
    switch (status) {
      case "Scheduled": return "bg-blue-50 text-blue-600 border-blue-200";
      case "Done": return "bg-green-50 text-green-600 border-green-200";
      case "No-show": return "bg-red-50 text-red-600 border-red-200";
      default: return "bg-gray-50 text-gray-600 border-gray-200";
    }
  };

  return (
    <div className="p-10">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-bold text-gray-900">Weekly Interview Schedule</h2>
        <button className="px-6 py-3 bg-gradient-to-r from-[#F59E0B] to-[#D97706] text-white rounded-xl font-semibold hover:from-[#D97706] hover:to-[#B45309] transition-all shadow-lg flex items-center gap-2">
          <Plus className="w-5 h-5" />
          Book Interview Slot
        </button>
      </div>

      {/* Calendar Grid */}
      <div className="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                <th className="px-4 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider w-32">Time</th>
                {days.map((day) => (
                  <th key={day} className="px-4 py-4 text-center text-xs font-semibold text-gray-600 uppercase tracking-wider">
                    {day}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {times.map((time) => (
                <tr key={time} className="hover:bg-gray-50 transition-colors">
                  <td className="px-4 py-4 text-sm font-semibold text-gray-700 bg-gray-50">{time}</td>
                  {days.map((day) => {
                    const interview = interviews.find(i => i.day === day && i.time === time);
                    
                    return (
                      <td key={`${day}-${time}`} className="px-2 py-2">
                        {interview ? (
                          <div className={`p-3 rounded-xl border ${getStatusColor(interview.status)}`}>
                            <div className="flex items-center gap-2 mb-1">
                              <User className="w-4 h-4" />
                              <p className="text-xs font-semibold truncate">{interview.applicant}</p>
                            </div>
                            <p className="text-xs text-gray-600 truncate mb-1">{interview.interviewer}</p>
                            <span className="text-xs font-semibold">{interview.status}</span>
                          </div>
                        ) : (
                          <div className="p-3 rounded-xl border-2 border-dashed border-gray-200 hover:border-[#F59E0B] hover:bg-amber-50 transition-all cursor-pointer text-center">
                            <Plus className="w-4 h-4 text-gray-400 mx-auto" />
                          </div>
                        )}
                      </td>
                    );
                  })}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
