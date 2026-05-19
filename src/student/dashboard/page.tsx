'use client';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { getDashboardData } from '@/shared/lib/api';
import { useAuth } from '@/shared/contexts/AuthContext';
import DashboardLayout from '@/shared/components/DashboardLayout';
import Link from 'next/link';

export default function DashboardPage() {
  const router = useRouter();
  const { user, loading: authLoading } = useAuth();
  const [name, setName] = useState('');
  const [enrolledCourses, setEnrolledCourses] = useState(0);
  const [enrolledUnits, setEnrolledUnits] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (authLoading) return;
    if (!user) { router.push('/login'); return; }

    const loadDashboard = async () => {
      try {
        const dashboardData = await getDashboardData(user.id);
        setName(dashboardData.name);
        setEnrolledCourses(dashboardData.enrolledCourses);
        setEnrolledUnits(dashboardData.enrolledUnits);
      } catch (error) {
        console.error('Failed to load dashboard:', error);
      } finally {
        setLoading(false);
      }
    };
    
    loadDashboard();
  }, [user, authLoading, router]);

  const stats = [
    { label: 'Subjects in Cart', value: '0', color: 'text-amber-500', icon: '🛒' },
    { label: 'Cart Units', value: '0', color: 'text-blue-500', icon: '📅' },
    { label: 'Enrolled Courses', value: String(enrolledCourses), color: 'text-green-500', icon: '⏱️' },
    { label: 'Enrolled Units', value: String(enrolledUnits), color: 'text-purple-500', icon: '📈' },
  ];

  return (
    <DashboardLayout>
      <div className="p-3.5 md:p-6 w-full pb-8">
        {loading ? (
          <div className="flex items-center justify-center py-20">
            <div className="text-center">
              <div className="w-12 h-12 border-4 border-amber-500 border-t-transparent rounded-full animate-spin mx-auto mb-3"></div>
              <p className="text-sm text-gray-500">Loading dashboard...</p>
            </div>
          </div>
        ) : (
          <>
            <div className="mb-3">
              <h1 className="text-xl font-black text-gray-900">Dashboard</h1>
              <p className="text-xs text-gray-500 mt-1">Welcome back, {name || 'Student'}</p>
            </div>

        {/* Stats grid */}
        <div className="grid grid-cols-2 gap-2.5 mb-3">
          {stats.map(s => (
            <div key={s.label} className="bg-white rounded-xl p-4 shadow-sm">
              <span className={`text-xl mb-1 block ${s.color}`}>{s.icon}</span>
              <p className="text-lg font-black text-gray-900 mb-1">{s.value}</p>
              <p className="text-xs text-gray-500 leading-tight">{s.label}</p>
            </div>
          ))}
        </div>

        {/* Enrollment Status */}
        <div className="bg-[#0B1220] rounded-xl p-4 mb-3">
          <p className="text-white font-black mb-2 text-sm">Enrollment Status</p>
          <div className="space-y-1.5 text-xs">
            <div className="flex justify-between py-1.5"><span className="text-gray-300 font-bold">Current Semester</span><span className="text-white font-semibold">Spring 2026</span></div>
            <div className="flex justify-between py-1.5"><span className="text-gray-300 font-bold">Enrollment Period</span><span className="text-green-400 font-semibold">Open</span></div>
            <div className="flex justify-between py-1.5"><span className="text-gray-300 font-bold">Cart Units</span><span className="text-amber-400 font-semibold">0 / 24</span></div>
            <div className="flex justify-between py-1.5"><span className="text-gray-300 font-bold">Enrolled Units</span><span className="text-blue-400 font-semibold">{enrolledUnits}</span></div>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="bg-white rounded-xl p-4 shadow-sm">
          <p className="font-semibold text-gray-900 mb-2.5 text-sm">Quick Actions</p>
          <div className="space-y-2.5">
            <Link href="/subjects" className="block w-full text-center py-2.5 rounded-xl font-semibold text-sm bg-gray-100 text-gray-900 hover:bg-amber-500 hover:text-white transition">Browse Subjects</Link>
            <Link href="/courses" className="block w-full text-center py-2.5 rounded-xl font-semibold text-sm bg-gray-100 text-gray-900 hover:bg-amber-500 hover:text-white transition">View My Schedule</Link>
            <Link href="/grades" className="block w-full text-center py-2.5 rounded-xl font-semibold text-sm bg-gray-100 text-gray-900 hover:bg-amber-500 hover:text-white transition">Check Grades</Link>
          </div>
        </div>
          </>
        )}
      </div>
    </DashboardLayout>
  );
}
