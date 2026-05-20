'use client';
import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { getCurrentUser, canAccessAdmin, type UserRole } from '@/shared/auth.service';

interface ProtectedRouteProps {
  children: React.ReactNode;
  allowedRoles?: UserRole[];
}

export function ProtectedRoute({ children, allowedRoles }: ProtectedRouteProps) {
  const router = useRouter();
  const user = getCurrentUser();

  useEffect(() => {
    if (!user) { router.replace('/login'); return; }
    if (allowedRoles && !allowedRoles.includes(user.role)) {
      const paths: Record<UserRole, string> = {
        applicant: '/admissions', student: '/dashboard',
        professor: '/professor', alumni: '/alumni/dashboard',
        super_admin: '/super-admin/dashboard',
        applicant_admin: '/applicant-admin/dashboard',
        student_admin: '/student-admin/dashboard',
        alumni_admin: '/alumni-admin/dashboard',
      };
      router.replace(paths[user.role] || '/');
    }
  }, []);

  if (!user) return null;
  if (allowedRoles && !allowedRoles.includes(user.role)) return null;

  if (!canAccessAdmin() && (user.role === 'super_admin' || user.role === 'applicant_admin' || user.role === 'student_admin' || user.role === 'alumni_admin')) {
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

  return <>{children}</>;
}
