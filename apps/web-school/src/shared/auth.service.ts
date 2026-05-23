import { writeCachedBackendAccessToken } from '@/services/backend-session.service';

export type UserRole =
  | 'applicant'
  | 'student'
  | 'professor'
  | 'alumni'
  | 'super_admin'
  | 'applicant_admin'
  | 'student_admin'
  | 'alumni_admin';

export const adminRoles = ['super_admin', 'applicant_admin', 'student_admin', 'alumni_admin'] as const;

export interface AuthUser {
  id: string;
  email: string;
  role: UserRole;
  name?: string;
  applicantId?: string;
  studentId?: string;
}

export interface LoginCredentials {
  email: string;
  password: string;
}

export interface LoginResponse {
  success: boolean;
  user?: AuthUser;
  error?: string;
}

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000';

type BackendLoginResponse = {
  user?: {
    id?: string;
    email?: string;
    role?: string;
  };
  session?: {
    access_token?: string;
  };
  message?: string;
};

export async function login(credentials: LoginCredentials): Promise<LoginResponse> {
  const { email, password } = credentials;
  try {
    const response = await fetch(`${API_BASE_URL}/api/auth/signin`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password }),
    });
    const data = await response.json().catch(() => ({})) as BackendLoginResponse;
    if (!response.ok) return { success: false, error: data.message ?? 'Login failed' };

    const role = data.user?.role as UserRole | undefined;
    if (!data.user?.id || !data.user.email || !role || !data.session?.access_token) {
      return { success: false, error: 'Login failed' };
    }

    const authUser: AuthUser = {
      id: data.user.id,
      email: data.user.email,
      role,
    };

    if (typeof window !== 'undefined') {
      sessionStorage.setItem('auth_user', JSON.stringify(authUser));
      writeCachedBackendAccessToken(sessionStorage, data.session.access_token);
    }

    return { success: true, user: authUser };
  } catch {
    return { success: false, error: 'An error occurred during login.' };
  }
}

export function getCurrentUser(): AuthUser | null {
  if (typeof window === 'undefined') return null;
  const userJson = sessionStorage.getItem('auth_user');
  if (!userJson) return null;
  try { return JSON.parse(userJson) as AuthUser; } catch { return null; }
}

export function logout(): void {
  if (typeof window !== 'undefined') {
    sessionStorage.removeItem('auth_user');
    sessionStorage.removeItem('backend_access_token');
    fetch(`${API_BASE_URL}/api/auth/signout`, { method: 'POST' }).catch(() => undefined);
    window.location.href = '/login';
  }
}

export function isAuthenticated(): boolean {
  return getCurrentUser() !== null;
}

export function hasRole(role: UserRole): boolean {
  return getCurrentUser()?.role === role;
}

export function getRedirectPath(role: UserRole): string {
  const paths: Record<UserRole, string> = {
    applicant: '/admissions',
    student: '/dashboard',
    professor: '/professor',
    alumni: '/alumni/dashboard',
    super_admin: '/super-admin/dashboard',
    applicant_admin: '/applicant-admin/dashboard',
    student_admin: '/student-admin/dashboard',
    alumni_admin: '/alumni-admin/dashboard',
  };
  return paths[role] || '/';
}

export function isMobileDevice(): boolean {
  if (typeof window === 'undefined') return false;
  return /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
}

export function canAccessAdmin(): boolean {
  const user = getCurrentUser();
  if (!user || !adminRoles.includes(user.role as (typeof adminRoles)[number])) return false;
  if (typeof window === 'undefined') return false;
  return !('ReactNativeWebView' in window);
}

export function isAdminRole(role: UserRole | null | undefined): role is (typeof adminRoles)[number] {
  return !!role && adminRoles.includes(role as (typeof adminRoles)[number]);
}
