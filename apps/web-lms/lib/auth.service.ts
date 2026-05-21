export type UserRole =
  | 'applicant'
  | 'student'
  | 'professor'
  | 'alumni'
  | 'student_admin'
  | 'applicant_admin'
  | 'alumni_admin'
  | 'super_admin';

export interface AuthUser {
  id: string;
  email: string;
  role: UserRole;
  name?: string;
}

export interface LoginResponse {
  success: boolean;
  user?: AuthUser;
  error?: string;
}

export async function loginWithSupabase(email: string, password: string): Promise<LoginResponse> {
  try {
    const res = await fetch('/api/auth/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password }),
    });
    const data = await res.json();
    if (!res.ok) return { success: false, error: data.message ?? 'Invalid email or password.' };

    const authUser: AuthUser = { id: data.user.id, email: data.user.email, role: data.user.role as UserRole };
    if (typeof window !== 'undefined') {
      sessionStorage.setItem('auth_user', JSON.stringify(authUser));
    }
    return { success: true, user: authUser };
  } catch {
    return { success: false, error: 'Network error. Please try again.' };
  }
}

export function getCurrentUser(): AuthUser | null {
  if (typeof window === 'undefined') return null;
  const json = sessionStorage.getItem('auth_user');
  if (json) {
    try { return JSON.parse(json) as AuthUser; } catch { /* fall through */ }
  }
  return null;
}

export async function getCurrentUserAsync(): Promise<AuthUser | null> {
  if (typeof window !== 'undefined') {
    const json = sessionStorage.getItem('auth_user');
    if (json) {
      try {
        const user = JSON.parse(json) as AuthUser;
        return user;
      } catch { /* fall through */ }
    }
  }
  try {
    const res = await fetch('/api/auth/me');
    if (!res.ok) return null;
    const data = await res.json();
    if (!data.id) return null;
    const user: AuthUser = { id: data.id, email: data.email, role: data.role as UserRole };
    if (typeof window !== 'undefined') {
      sessionStorage.setItem('auth_user', JSON.stringify(user));
    }
    return user;
  } catch {
    return null;
  }
}

export async function logout(): Promise<void> {
  if (typeof window !== 'undefined') {
    sessionStorage.removeItem('auth_user');
    await fetch('/api/auth/logout', { method: 'POST' });
    window.location.href = '/';
  }
}

export function getRedirectPath(role: UserRole): string {
  const paths: Record<UserRole, string> = {
    student_admin:   '/dashboard',
    applicant_admin: '/dashboard',
    alumni_admin:    '/dashboard',
    super_admin:     '/dashboard',
    student:         '/dashboard',
    professor:       '/dashboard',
    alumni:          '/dashboard',
    applicant:       '/dashboard',
  };
  return paths[role] ?? '/dashboard';
}

export function isAdmin(role: UserRole): boolean {
  return ['student_admin', 'applicant_admin', 'alumni_admin', 'super_admin'].includes(role);
}
