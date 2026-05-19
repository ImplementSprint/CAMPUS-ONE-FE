import { useState } from "react";
import { Plus, Calendar, Clock, MapPin, User, Edit } from "lucide-react";

interface ExamSchedule {
  id: string;
  date: string;
  time: string;
  venue: string;
  proctor: string;
  registered: number;
}

interface ExamResult {
  id: string;
  applicantName: string;
  score: number | null;
}

export function EntranceExaminationPage() {
  const [schedules] = useState<ExamSchedule[]>([
    { id: "EX-001", date: "2026-05-01", time: "09:00 AM", venue: "Room 101", proctor: "Dr. Smith", registered: 25 },
    { id: "EX-002", date: "2026-05-01", time: "02:00 PM", venue: "Room 102", proctor: "Prof. Johnson", registered: 30 },
    { id: "EX-003", date: "2026-05-02", time: "09:00 AM", venue: "Room 101", proctor: "Dr. Williams", registered: 28 },
  ]);

  const [results, setResults] = useState<ExamResult[]>([
    { id: "APP-001", applicantName: "Maria Santos", score: 92 },
    { id: "APP-002", applicantName: "Juan Dela Cruz", score: null },
    { id: "APP-003", applicantName: "Ana Reyes", score: 85 },
  ]);

  return (
    <div className="p-10 space-y-8">
      {/* Schedule Section */}
      <div>
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold text-gray-900">Exam Schedule</h2>
          <button className="px-6 py-3 bg-gradient-to-r from-[#F59E0B] to-[#D97706] text-white rounded-xl font-semibold hover:from-[#D97706] hover:to-[#B45309] transition-all shadow-lg flex items-center gap-2">
            <Plus className="w-5 h-5" />
            Add Schedule
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {schedules.map((schedule) => (
            <div key={schedule.id} className="bg-white rounded-2xl p-6 border border-gray-200 shadow-sm hover:shadow-lg transition-all">
              <div className="flex items-center justify-between mb-4">
                <span className="text-sm font-mono text-gray-500">{schedule.id}</span>
                <span className="px-3 py-1 bg-blue-50 text-blue-600 rounded-full text-xs font-semibold">
                  {schedule.registered} registered
                </span>
              </div>
              
              <div className="space-y-3">
                <div className="flex items-center gap-3 text-gray-700">
                  <Calendar className="w-5 h-5 text-[#F59E0B]" />
                  <span className="font-medium">{schedule.date}</span>
                </div>
                <div className="flex items-center gap-3 text-gray-700">
                  <Clock className="w-5 h-5 text-[#F59E0B]" />
                  <span className="font-medium">{schedule.time}</span>
                </div>
                <div className="flex items-center gap-3 text-gray-700">
                  <MapPin className="w-5 h-5 text-[#F59E0B]" />
                  <span className="font-medium">{schedule.venue}</span>
                </div>
                <div className="flex items-center gap-3 text-gray-700">
                  <User className="w-5 h-5 text-[#F59E0B]" />
                  <span className="font-medium">{schedule.proctor}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Results Encoding Section */}
      <div>
        <h2 className="text-2xl font-bold text-gray-900 mb-6">Results Encoding</h2>
        
        <div className="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 border-b border-gray-200">
                <tr>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">ID</th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Applicant Name</th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Score</th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {results.map((result) => (
                  <tr key={result.id} className="hover:bg-gray-50 transition-colors">
                    <td className="px-6 py-4 text-sm font-mono text-gray-900">{result.id}</td>
                    <td className="px-6 py-4 text-sm font-medium text-gray-900">{result.applicantName}</td>
                    <td className="px-6 py-4">
                      {result.score !== null ? (
                        <span className="text-2xl font-bold text-green-600">{result.score}</span>
                      ) : (
                        <span className="text-sm text-gray-400 italic">Not encoded</span>
                      )}
                    </td>
                    <td className="px-6 py-4">
                      <button className="px-4 py-2 bg-[#F59E0B] text-white rounded-lg font-semibold hover:bg-[#D97706] transition-colors flex items-center gap-2">
                        <Edit className="w-4 h-4" />
                        {result.score !== null ? "Edit" : "Encode"} Score
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}
