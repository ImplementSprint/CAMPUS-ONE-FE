'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { BookOpen, ClipboardList, GraduationCap, Loader2, ShoppingCart } from 'lucide-react';
import { getDashboardData } from '@/lib/api';
import { useAuth } from '@/contexts/AuthContext';
import { AppShell } from '@/shared/ui/layout/AppShell';
import { PageHeader } from '@/shared/ui/layout/PageHeader';
import { Surface } from '@/shared/ui/layout/Surface';

export default function DashboardPage() {
  const router = useRouter();
  const { user, loading: authLoading } = useAuth();
  const [name, setName] = useState('');
  const [enrolledCourses, setEnrolledCourses] = useState(0);
  const [enrolledUnits, setEnrolledUnits] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (authLoading) return;
    if (!user) {
      router.push('/login');
      return;
    }

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
    { label: 'Subjects in Cart', value: '0', icon: ShoppingCart },
    { label: 'Cart Units', value: '0', icon: ClipboardList },
    { label: 'Enrolled Courses', value: String(enrolledCourses), icon: BookOpen },
    { label: 'Enrolled Units', value: String(enrolledUnits), icon: GraduationCap },
  ];

  return (
    <AppShell title="Student Dashboard">
      {loading ? (
        <div className="flex items-center justify-center py-24">
          <div className="text-center">
            <Loader2 className="mx-auto mb-3 h-10 w-10 animate-spin text-campus-brand" aria-hidden="true" />
            <p className="text-sm text-campus-muted">Loading dashboard...</p>
          </div>
        </div>
      ) : (
        <>
          <PageHeader
            title="Dashboard"
            description={`Welcome back, ${name || 'Student'}. Review enrollment status, units, and quick actions.`}
          />

          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {stats.map((stat) => {
              const Icon = stat.icon;
              return (
                <Surface key={stat.label} className="p-4">
                  <div className="flex items-center justify-between gap-3">
                    <div>
                      <p className="text-2xl font-semibold text-campus-ink">{stat.value}</p>
                      <p className="mt-1 text-sm text-campus-muted">{stat.label}</p>
                    </div>
                    <span className="grid h-10 w-10 place-items-center rounded-lg bg-[#fbfaf6] text-campus-brandStrong">
                      <Icon className="h-5 w-5" aria-hidden="true" />
                    </span>
                  </div>
                </Surface>
              );
            })}
          </div>

          <div className="mt-4 grid gap-4 lg:grid-cols-[1fr_360px]">
            <Surface className="p-5">
              <h2 className="text-base font-semibold text-campus-ink">Enrollment Status</h2>
              <div className="mt-4 divide-y divide-campus-border text-sm">
                <StatusRow label="Current Semester" value="Spring 2026" />
                <StatusRow label="Enrollment Period" value="Open" />
                <StatusRow label="Cart Units" value="0 / 24" />
                <StatusRow label="Enrolled Units" value={String(enrolledUnits)} />
              </div>
            </Surface>

            <Surface className="p-5">
              <h2 className="text-base font-semibold text-campus-ink">Quick Actions</h2>
              <div className="mt-4 grid gap-2">
                <QuickAction href="/subjects">Browse Subjects</QuickAction>
                <QuickAction href="/courses">View My Schedule</QuickAction>
                <QuickAction href="/grades">Check Grades</QuickAction>
              </div>
            </Surface>
          </div>
        </>
      )}
    </AppShell>
  );
}

function StatusRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-center justify-between gap-3 py-3">
      <span className="text-campus-muted">{label}</span>
      <span className="font-medium text-campus-ink">{value}</span>
    </div>
  );
}

function QuickAction({ href, children }: { href: string; children: React.ReactNode }) {
  return (
    <Link
      href={href}
      className="flex h-11 items-center justify-center rounded-md border border-campus-border px-4 text-sm font-medium text-campus-ink transition-colors hover:bg-[#fbfaf6]"
    >
      {children}
    </Link>
  );
}
