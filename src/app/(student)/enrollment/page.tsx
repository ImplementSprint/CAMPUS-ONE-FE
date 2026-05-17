'use client';
import { useEffect, useState } from 'react';
import { getEnrollmentStatus, getProfile } from '@/lib/api';
import { useAuth } from '@/contexts/AuthContext';
import DashboardLayout from '@/components/DashboardLayout';
import Link from 'next/link';

export default function EnrollmentPage() {
  const { user, loading: authLoading } = useAuth();
  const [student, setStudent] = useState<any>(null);
  const [enrollment, setEnrollment] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [selectedTerm, setSelectedTerm] = useState('');
  const [termOpen, setTermOpen] = useState(false);
  const [schoolYear] = useState('2025-2026');
  const [checkingEnrollment, setCheckingEnrollment] = useState(false);
  const termOptions = ['First Term', 'Second Term', 'Summer'];

  useEffect(() => {
    if (authLoading || !user) return;
    
    const loadStudent = async () => {
      try {
        const profileData = await getProfile(user.id);
        if (profileData.applicant) {
          setStudent({
            ...profileData.applicant,
            studentNumber: profileData.studentNumber ?? '—',
            id: user.id
          });
        }
      } catch (error) {
        console.error('Failed to load student data:', error);
      } finally {
        setLoading(false);
      }
    };
    
    loadStudent();
  }, [user, authLoading]);

  const handleTermSelect = async (term: string) => {
    setTermOpen(false);
    setSelectedTerm(term);
    if (!student) return;
    
    setCheckingEnrollment(true);
    try {
      const statusData = await getEnrollmentStatus(student.id, schoolYear, term);
      setEnrollment(statusData);
    } catch (error) {
      console.error('Failed to check enrollment:', error);
      setEnrollment(null);
    } finally {
      setCheckingEnrollment(false);
    }
  };

  return (
    <DashboardLayout>
      <div className="p-3.5 md:p-6 w-full pb-8">
        <div className="bg-white rounded-xl shadow-sm p-4">
          <h1 className="text-base font-semibold text-gray-900">Online Enrollment</h1>
          <div className="h-1.5 w-28 bg-amber-500 rounded-full mt-2 mb-4" />

          {loading ? <div className="py-10 text-center text-gray-400 text-sm">Loading...</div> : (
            <>
              <p className="text-xs font-semibold text-gray-900 mb-1.5">Student Details</p>
              <div className="border border-gray-200 rounded-xl overflow-hidden mb-4">
                {[
                  ['Student Name', student ? `${student.first_name} ${student.last_name}` : '—'],
                  ['Student Number', student?.studentNumber ?? '—'],
                  ['Program', student?.program ?? '—'],
                  ['School Year', `A.Y. ${schoolYear}`],
                  ['Status', student?.status === 'Passed' ? 'Regular' : 'Irregular'],
                ].map(([l, v], i, arr) => (
                  <div key={l} className={`flex justify-between items-center px-3 py-3.5 ${i < arr.length - 1 ? 'border-b border-gray-100' : ''}`}>
                    <span className="text-xs text-gray-500 font-medium">{l}</span>
                    <span className="text-xs font-semibold text-gray-900">{v}</span>
                  </div>
                ))}
              </div>

              {/* Term selector */}
              <p className="text-xs font-semibold text-gray-900 mb-1.5">Select Term</p>
              <div className="relative mb-3">
                <button onClick={() => setTermOpen(v => !v)}
                  className="w-full flex justify-between items-center border border-gray-200 rounded-xl px-3 py-2.5 bg-gray-50 text-xs font-semibold text-gray-900 hover:bg-gray-100 transition">
                  <span className={selectedTerm ? 'text-gray-900' : 'text-gray-400'}>{selectedTerm ? `A.Y. ${schoolYear}: ${selectedTerm}` : 'Select a term'}</span>
                  <span className="text-xs">{termOpen ? '▲' : '▼'}</span>
                </button>
                {termOpen && (
                  <div className="absolute top-full left-0 right-0 mt-1 bg-white border border-gray-200 rounded-xl shadow-lg z-10 overflow-hidden">
                    {termOptions.map(t => (
                      <button key={t} onClick={() => handleTermSelect(t)}
                        className={`w-full flex justify-between items-center px-3 py-3 text-xs text-left hover:bg-amber-50 border-b border-gray-100 last:border-0 transition
                          ${t === selectedTerm ? 'bg-amber-50 font-semibold text-gray-900' : 'text-gray-700'}`}>
                        <span>A.Y. {schoolYear}: {t}</span>
                        {t === selectedTerm && <span className="text-amber-500 text-sm">✓</span>}
                      </button>
                    ))}
                  </div>
                )}
              </div>

              {checkingEnrollment ? (
                <div className="flex items-center justify-center py-4">
                  <div className="w-8 h-8 border-4 border-amber-500 border-t-transparent rounded-full animate-spin"></div>
                </div>
              ) : enrollment ? (
                <div className="bg-green-50 border border-green-200 rounded-xl p-3.5">
                  <div className="flex items-center gap-2 mb-2">
                    <span className="text-green-600 text-lg">✓</span>
                    <span className="font-semibold text-green-700 text-xs">Already Enrolled</span>
                  </div>
                  <p className="text-xs text-gray-600">Status: <strong>{enrollment.status}</strong></p>
                  <p className="text-xs text-gray-600">Total Units: <strong>{enrollment.total_units}</strong></p>
                </div>
              ) : selectedTerm ? (
                <>
                  <div className="bg-blue-50 rounded-xl p-3 mb-3">
                    <p className="text-xs text-gray-700">You are eligible to enroll for A.Y. {schoolYear}: {selectedTerm}. Tap below to proceed.</p>
                  </div>
                  <Link href={`/enrollment/enroll?schoolYear=${encodeURIComponent(schoolYear)}&term=${encodeURIComponent(selectedTerm)}`}
                    className="block w-full text-center bg-amber-500 hover:bg-amber-600 text-white font-semibold py-2.5 rounded-xl transition text-sm">
                    Proceed to Enrollment
                  </Link>
                </>
              ) : null}
            </>
          )}
        </div>
      </div>
    </DashboardLayout>
  );
}

