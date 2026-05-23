import type { UserRole } from './auth.service';

export const rolePaths = {
  applicant: '/admissions',
  student: '/dashboard',
  professor: '/professor',
  alumni: '/alumni/dashboard',
  super_admin: '/super-admin/dashboard',
  applicant_admin: '/applicant-admin/dashboard',
  student_admin: '/student-admin/dashboard',
  alumni_admin: '/alumni-admin/dashboard',
} as const satisfies Record<UserRole, string>;

export type ProtectedRouteAccessInput = {
  loading: boolean;
  hasUser: boolean;
  role?: UserRole | string | null;
  allowedRoles?: readonly UserRole[];
};

export type ProtectedRouteAccessDecision = {
  canRender: boolean;
  redirectTo: string | null;
};

function getRoleHomePath(role: UserRole | string | null | undefined): string {
  if (!role) return '/login';
  return rolePaths[role as UserRole] ?? '/';
}

export function decideProtectedRouteAccess({
  loading,
  hasUser,
  role,
  allowedRoles,
}: ProtectedRouteAccessInput): ProtectedRouteAccessDecision {
  if (loading) {
    return { canRender: false, redirectTo: null };
  }

  if (!hasUser) {
    return { canRender: false, redirectTo: '/login' };
  }

  if (allowedRoles && (!role || !allowedRoles.includes(role as UserRole))) {
    return { canRender: false, redirectTo: getRoleHomePath(role) };
  }

  return { canRender: true, redirectTo: null };
}
