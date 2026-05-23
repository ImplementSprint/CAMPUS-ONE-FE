'use client';
import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';
import { adminRoles, type UserRole } from '@/services/auth.service';
import { decideProtectedRouteAccess } from '@/services/route-access.service';

interface ProtectedRouteProps {
  children: React.ReactNode;
  allowedRoles?: UserRole[];
}

export function ProtectedRoute({ children, allowedRoles }: ProtectedRouteProps) {
  const router = useRouter();
  const { user, role, loading } = useAuth();
  const accessDecision = decideProtectedRouteAccess({
    loading,
    hasUser: !!user,
    role,
    allowedRoles,
  });

  useEffect(() => {
    if (accessDecision.redirectTo) {
      router.replace(accessDecision.redirectTo);
    }
  }, [accessDecision.redirectTo, router]);

  // Still loading, not logged in, or wrong role - show nothing
  if (!accessDecision.canRender) return null;

  // Admin desktop check
  if (role && adminRoles.includes(role as (typeof adminRoles)[number])) {
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
