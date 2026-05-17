'use client';
import { useEffect, useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { getCourses } from '@/lib/api';
import DashboardLayout from '@/components/DashboardLayout';

type Course = { offeringId: string; subjectCode: string; subjectName: string; units: number; section: string; schedule: string | null; room: string | null; instructor: string | null };

export default function CoursesPage() {
  const { user, loading: authLoading } = useAuth();
  const [courses, setCourses] = useState<Course[]>([]);
  const [totalUnits, setTotalUnits] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (authLoading || !user) return;
    getCourses(user.id)
      .then(data => { setCourses(data.courses); setTotalUnits(data.totalUnits); })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, [user, authLoading]);

  return (
    <DashboardLayout>
      <div className="p-6 w-full space-y-5">
        <div>
          <h1 className="text-xl font-black text-gray-900">My Courses</h1>
          <p className="text-sm text-gray-500 mt-0.5">Currently enrolled courses</p>
        </div>

        {loading ? <div className="text-center py-10 text-gray-400">Loading...</div>
          : courses.length === 0 ? (
            <div className="bg-white rounded-2xl border border-gray-200 p-10 text-center">
              <p className="text-3xl mb-3">📚</p>
              <p className="font-black text-gray-900">No enrolled courses</p>
              <p className="text-sm text-gray-500 mt-1">You are not enrolled in any courses yet.</p>
            </div>
          ) : (
            <>
              <div className="bg-white rounded-2xl border border-gray-200 p-5 flex justify-between">
                <div><p className="text-xs text-gray-500 font-semibold">Total Courses</p><p className="text-2xl font-black text-gray-900 mt-1">{courses.length}</p></div>
                <div className="text-right"><p className="text-xs text-gray-500 font-semibold">Total Units</p><p className="text-2xl font-black text-gray-900 mt-1">{totalUnits}</p></div>
              </div>

              <div className="space-y-3">
                {courses.map(c => (
                  <div key={c.offeringId} className="bg-white rounded-2xl border border-gray-200 p-5">
                    <div className="flex items-start justify-between gap-4">
                      <div className="flex-1">
                        <p className="font-black text-gray-900">{c.subjectName}</p>
                        <p className="text-sm text-gray-500 mt-0.5">{c.subjectCode} • {c.section} • {c.units} units</p>
                        <div className="mt-3 space-y-1.5">
                          {c.schedule && <p className="text-sm text-gray-600">🕐 {c.schedule}</p>}
                          {c.room && <p className="text-sm text-gray-600">📍 {c.room}</p>}
                          {c.instructor && <p className="text-sm text-gray-600">👤 {c.instructor}</p>}
                        </div>
                      </div>
                      <span className="bg-green-100 text-green-700 text-xs font-semibold px-3 py-1.5 rounded-full whitespace-nowrap">Enrolled</span>
                    </div>
                  </div>
                ))}
              </div>
            </>
          )}
      </div>
    </DashboardLayout>
  );
}

