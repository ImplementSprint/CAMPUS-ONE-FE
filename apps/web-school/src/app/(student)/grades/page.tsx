'use client';
import { useEffect, useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { getGrades, getGradeSummary } from '@/lib/api';
import DashboardLayout from '@/components/DashboardLayout';

type GradeRow = { code: string; subject: string; units: number; grade: string; remarks: string };

export default function GradesPage() {
  const { user, loading: authLoading } = useAuth();
  const [grades, setGrades] = useState<GradeRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [studentName, setStudentName] = useState('');
  const [program, setProgram] = useState('');
  const [totalUnits, setTotalUnits] = useState(0);
  const [passedUnits, setPassedUnits] = useState(0);
  const [failedUnits, setFailedUnits] = useState(0);
  const [standing, setStanding] = useState('no_grades');
  const [gwa, setGwa] = useState('—');

  useEffect(() => {
    if (authLoading || !user) return;
    Promise.all([getGrades(user.id), getGradeSummary(user.id)])
      .then(([data, summary]) => {
        setStudentName(data.studentName);
        setProgram(data.program);
        setGrades(data.grades);
        setTotalUnits(summary.totalUnits ?? data.totalUnits);
        setPassedUnits(summary.passedUnits ?? 0);
        setFailedUnits(summary.failedUnits ?? 0);
        setGwa(summary.gwa ?? data.gwa);
        setStanding(summary.status ?? 'no_grades');
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, [user, authLoading]);

  const remarksBadge = (r: string) => {
    if (r === 'Passed') return 'bg-green-500 text-white';
    if (r === 'Failed') return 'bg-red-500 text-white';
    return 'bg-amber-400 text-white';
  };
  const gradeBadge = (r: string) => {
    if (r === 'Passed') return 'bg-green-100 text-green-700';
    if (r === 'Failed') return 'bg-red-100 text-red-700';
    return 'bg-amber-100 text-amber-700';
  };

  return (
    <DashboardLayout>

      <div className="p-6 w-full">
        <h1 className="text-xl font-black text-gray-900">View Semestral Grades</h1>

        {/* Student Summary */}
        <div className="bg-[#374151] rounded-2xl p-5">
          <div className="flex items-center gap-2 mb-4">
            <span className="text-white text-lg">🎖️</span>
            <span className="text-white font-semibold">Student Summary</span>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {[['Student Name', studentName || '—'], ['Program', program || '—'], ['Year Level', '—'], ['Semester', 'AY 2025-2026']].map(([l, v]) => (
              <div key={l}>
                <p className="text-gray-300 text-xs font-medium mb-1">{l}</p>
                <p className="text-white text-sm font-semibold">{v}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Grades Table */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden">
          <div className="px-5 py-4 border-b border-gray-100">
            <p className="font-semibold text-gray-900">Semestral Grades</p>
          </div>
          {loading ? (
            <div className="p-8 text-center text-gray-400">Loading...</div>
          ) : grades.length === 0 ? (
            <div className="p-8 text-center text-gray-400">No grades available yet.</div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="bg-gray-50 border-b border-gray-200">
                    <th className="text-left px-5 py-3 font-semibold text-gray-600">Code</th>
                    <th className="text-left px-5 py-3 font-semibold text-gray-600">Subject</th>
                    <th className="text-center px-5 py-3 font-semibold text-gray-600">Units</th>
                    <th className="text-center px-5 py-3 font-semibold text-gray-600">Grade</th>
                    <th className="text-center px-5 py-3 font-semibold text-gray-600">Remarks</th>
                  </tr>
                </thead>
                <tbody>
                  {grades.map((g, i) => (
                    <tr key={i} className="border-b border-gray-100 hover:bg-gray-50">
                      <td className="px-5 py-4 font-semibold text-gray-900">{g.code}</td>
                      <td className="px-5 py-4 text-gray-700">{g.subject}</td>
                      <td className="px-5 py-4 text-center text-gray-700">{g.units}</td>
                      <td className="px-5 py-3 text-center">
                        <span className={`px-3 py-1 rounded-full text-xs font-semibold ${gradeBadge(g.remarks)}`}>{g.grade}</span>
                      </td>
                      <td className="px-5 py-3 text-center">
                        <span className={`px-3 py-1 rounded-full text-xs font-semibold ${remarksBadge(g.remarks)}`}>{g.remarks}</span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
              <div className="flex justify-between px-5 py-3 border-t border-gray-100">
                <span className="text-sm font-semibold text-gray-700">Total Units This Semester:</span>
                <span className="text-sm font-semibold text-gray-900">{totalUnits}</span>
              </div>
            </div>
          )}
        </div>

        {/* GWA + Honors */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden">
          <div className="px-5 py-4 border-b border-gray-100 flex items-center gap-2">
            <span className="text-amber-500">📈</span>
            <p className="font-semibold text-gray-900">Latin Honors Eligibility</p>
          </div>
          <div className="p-5 grid grid-cols-3 gap-3">
            <div className="bg-amber-400 rounded-2xl p-4"><p className="text-white text-xs font-medium mb-1">Current GWA</p><p className="text-white text-2xl font-black">{gwa}</p></div>
            <div className="bg-blue-500 rounded-2xl p-4"><p className="text-white text-xs font-medium mb-1">Passed Units</p><p className="text-white text-2xl font-black">{passedUnits}</p></div>
            <div className="bg-green-500 rounded-2xl p-4"><p className="text-white text-xs font-medium mb-1">Standing</p><p className="text-white text-base font-black capitalize">{standing.replace(/_/g, ' ')}</p></div>
          </div>
          {failedUnits > 0 ? (
            <div className="mx-5 mb-5 rounded-xl border border-red-200 bg-red-50 p-4 text-sm font-semibold text-red-700">
              {failedUnits} failed unit{failedUnits === 1 ? '' : 's'} need registrar/adviser follow-up.
            </div>
          ) : null}
          <div className="px-5 pb-5">
            <div className="bg-gray-50 rounded-xl border border-gray-200 p-4">
              <p className="font-semibold text-gray-900 mb-3 text-sm">Latin Honors Requirements</p>
              {[['Summa Cum Laude', 'GWA ≤ 1.20', 'bg-amber-400'], ['Magna Cum Laude', 'GWA 1.21 – 1.45', 'bg-blue-500'], ['Cum Laude', 'GWA 1.46 – 1.75', 'bg-green-500']].map(([l, r, c]) => (
                <div key={l} className="flex justify-between items-center py-2 border-b border-gray-100 last:border-0">
                  <span className="text-sm text-gray-700">{l}</span>
                  <span className={`px-3 py-1 rounded-full text-xs font-semibold text-white ${c}`}>{r}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
