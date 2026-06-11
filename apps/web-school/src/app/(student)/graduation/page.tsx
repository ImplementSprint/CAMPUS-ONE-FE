'use client';
import { useEffect, useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { getGraduationData } from '@/lib/api';
import DashboardLayout from '@/components/DashboardLayout';

function getHonors(gwa: number) {
  if (gwa <= 1.20) return { label: 'Summa Cum Laude', bg: 'bg-amber-50', border: 'border-amber-400', text: 'text-amber-800', badge: 'bg-amber-400', msg: "You're graduating as Summa Cum Laude. Outstanding academic excellence." };
  if (gwa <= 1.45) return { label: 'Magna Cum Laude', bg: 'bg-blue-50', border: 'border-blue-400', text: 'text-blue-800', badge: 'bg-blue-500', msg: "You're graduating as Magna Cum Laude. Exceptional academic achievement." };
  if (gwa <= 1.75) return { label: 'Cum Laude', bg: 'bg-green-50', border: 'border-green-400', text: 'text-green-800', badge: 'bg-green-500', msg: "You're graduating as Cum Laude. Great academic performance." };
  return null;
}

export default function GraduationPage() {
  const { user, loading: authLoading } = useAuth();
  const [loading, setLoading] = useState(true);
  const [studentName, setStudentName] = useState('');
  const [program, setProgram] = useState('');
  const [yearLevel, setYearLevel] = useState<number | null>(null);
  const [grades, setGrades] = useState<any[]>([]);

  useEffect(() => {
    if (authLoading || !user) return;
    getGraduationData(user.id)
      .then(d => {
        setStudentName(d.studentName ?? '');
        setProgram(d.program ?? '');
        setYearLevel(d.yearLevel ?? null);
        setGrades(d.grades ?? []);
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, [user, authLoading]);

  const passed = grades.filter(g => g.remarks !== 'Failed' && g.finalGrade != null);
  const totalUnits = passed.reduce((s: number, g: any) => s + (g.units ?? 0), 0);
  const gwa = totalUnits > 0
    ? passed.reduce((s: number, g: any) => s + parseFloat(g.finalGrade) * (g.units ?? 0), 0) / totalUnits
    : null;
  const isFinalYear = (yearLevel ?? 0) >= 4;
  const honors = gwa !== null ? getHonors(gwa) : null;

  return (
    <DashboardLayout>
      <div className="p-6 w-full space-y-5">
        {loading ? <div className="text-center py-10 text-gray-400">Loading...</div> : (
          <>
            <div className="bg-[#0B0F14] rounded-2xl p-6 text-center">
              <p className="text-gray-400 text-xs font-semibold tracking-widest uppercase mb-1">Graduation Status</p>
              <p className="text-white text-xl font-black">{studentName || 'Student'}</p>
              <p className="text-gray-400 text-sm mt-1">{program}</p>
              {yearLevel && <span className="mt-3 inline-block bg-amber-500 text-white text-xs font-semibold px-4 py-1.5 rounded-full">Year {yearLevel}</span>}
            </div>

            {isFinalYear && gwa !== null ? (
              honors ? (
                <div className={`${honors.bg} border-2 ${honors.border} rounded-2xl p-6 text-center`}>
                  <p className={`text-xl font-black ${honors.text}`}>{honors.label}</p>
                  <p className={`text-sm mt-2 ${honors.text}`}>{honors.msg}</p>
                  <span className={`mt-3 inline-block ${honors.badge} text-white text-sm font-semibold px-4 py-1.5 rounded-full`}>GWA: {gwa.toFixed(2)}</span>
                </div>
              ) : (
                <div className="bg-gray-50 border border-gray-200 rounded-2xl p-6 text-center">
                  <p className="font-black text-gray-900">Graduating Student</p>
                  <p className="text-sm text-gray-500 mt-2">Congratulations! Your GWA of {gwa.toFixed(2)} does not qualify for Latin Honors.</p>
                  <span className="mt-3 inline-block bg-gray-200 text-gray-700 text-sm font-semibold px-4 py-1.5 rounded-full">GWA: {gwa.toFixed(2)}</span>
                </div>
              )
            ) : !isFinalYear ? (
              <div className="bg-amber-50 border border-amber-300 rounded-2xl p-5 text-center">
                <p className="font-black text-amber-800">Not Yet Eligible</p>
                <p className="text-sm text-amber-700 mt-1">Graduation eligibility is determined in your final year.</p>
                {gwa !== null && <span className="mt-3 inline-block bg-gray-200 text-gray-700 text-xs font-semibold px-3 py-1 rounded-full">Current GWA: {gwa.toFixed(2)}</span>}
              </div>
            ) : null}

            {gwa !== null && (
              <div className="grid grid-cols-3 gap-3">
                <div className="bg-amber-400 rounded-2xl p-4 text-center"><p className="text-white text-xs font-medium mb-1">GWA</p><p className="text-white text-2xl font-black">{gwa.toFixed(2)}</p></div>
                <div className="bg-blue-500 rounded-2xl p-4 text-center"><p className="text-white text-xs font-medium mb-1">Subjects</p><p className="text-white text-2xl font-black">{passed.length}</p></div>
                <div className="bg-green-500 rounded-2xl p-4 text-center"><p className="text-white text-xs font-medium mb-1">Total Units</p><p className="text-white text-2xl font-black">{totalUnits}</p></div>
              </div>
            )}

            <div className="bg-white rounded-2xl border border-gray-200 p-5">
              <p className="font-semibold text-gray-900 mb-3">Latin Honors Scale</p>
              {[['Summa Cum Laude', 'GWA <= 1.20', 'bg-amber-400', gwa !== null && gwa <= 1.20],
                ['Magna Cum Laude', 'GWA 1.21 - 1.45', 'bg-blue-500', gwa !== null && gwa > 1.20 && gwa <= 1.45],
                ['Cum Laude', 'GWA 1.46 - 1.75', 'bg-green-500', gwa !== null && gwa > 1.45 && gwa <= 1.75]
              ].map(([l, r, c, active]) => (
                <div key={l as string} className={`flex items-center gap-3 py-3 px-3 rounded-xl mb-1 ${active ? 'bg-gray-50' : ''}`}>
                  <div className={`w-1 h-9 rounded-full ${c}`} />
                  <div className="flex-1">
                    <p className={`text-sm ${active ? 'font-black text-gray-900' : 'font-semibold text-gray-700'}`}>{l as string}</p>
                    <p className="text-xs text-gray-400">{r as string}</p>
                  </div>
                  {active && <span className="text-green-600 text-xs font-semibold">Active</span>}
                </div>
              ))}
            </div>
          </>
        )}
      </div>
    </DashboardLayout>
  );
}
