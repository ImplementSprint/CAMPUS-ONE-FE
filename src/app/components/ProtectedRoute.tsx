'use client';
import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';
import type { UserRole } from '@/services/auth.service';
import { isAnyAdmin } from '@/services/auth.service';

interface ProtectedRouteProps {
  children: React.ReactNode;
  allowedRoles?: UserRole[];
}

const rolePaths: Record<UserRole, string> = {
  applicant:       '/admissions',
  student:         '/dashboard',
  professor:       '/professor',
  alumni:          '/alumni/dashboard',
  student_admin:   '/admin/student',
  applicant_admin: '/admin/applicant',
  alumni_admin:    '/admin/alumni',
  super_admin:     '/admin/super',
};

export function ProtectedRoute({ children, allowedRoles }: ProtectedRouteProps) {
  const router = useRouter();
  const { user, role, loading } = useAuth();

  useEffect(() => {
    if (loading) return;
    if (!user) { router.replace('/login'); return; }
    if (allowedRoles && role && !allowedRoles.includes(role)) {
      router.replace(rolePaths[role] || '/');
    }
  }, [loading, user, role]);

  if (loading) return null;
  if (!user) return null;
  if (allowedRoles && role && !allowedRoles.includes(role)) return null;

  // Block all admin roles from mobile
  if (role && isAnyAdmin(role)) {
    const isDesktop = typeof window !== 'undefined' && !('ReactNativeWebView' in window);
    if (!isDesktop) {
      return (
        <div className="min-h-screen flex items-center justify-center bg-gray-100 p-4">
          <div className="bg-white rounded-xl shadow-lg p-6 max-w-md text-center">
            <h2 className="text-xl font-bold text-gray-900 mb-2">Desktop Access Only</h2>
            <p className="text-sm text-gray-600 mb-4">The admin panel is only accessible from desktop browsers.</p>
            <button onClick={() => router.push('/login')}
              className="px-6 py-2 bg-amber-500 text-white rounded-lg font-semibold text-sm hover:bg-amber-600 transition-colors">
              Back to Login
            </button>
          </div>
        </div>
      );
    }
  }

  return <>{children}</>;
}
