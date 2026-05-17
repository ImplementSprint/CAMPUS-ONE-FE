import { supabase } from '@/lib/supabase';

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

async function detectUserRole(email: string): Promise<UserRole | null> {
  // Check student accounts first
  const { data: student } = await supabase.from('student_accounts').select('id').eq('email', email).maybeSingle();
  if (student) return 'student';

  // Check admin_users table — role column determines which admin type
  const { data: admin } = await supabase.from('admin_users').select('id, role').eq('email', email).maybeSingle();
  if (admin) {
    const roleMap: Record<string, UserRole> = {
      student_admin:    'student_admin',
      applicant_admin:  'applicant_admin',
      alumni_admin:     'alumni_admin',
      super_admin:      'super_admin',
      // fallback for existing rows that just have 'admin'
      admin:            'applicant_admin',
    };
    return roleMap[admin.role] ?? 'applicant_admin';
  }

  // Check professor
  const { data: professor } = await supabase.from('professor_users').select('id').eq('email', email).maybeSingle();
  if (professor) return 'professor';

  // Check alumni
  const { data: alumni } = await supabase.from('alumni').select('id').eq('email', email).maybeSingle();
  if (alumni) return 'alumni';

  // Check applicant
  const { data: applicant } = await supabase.from('applicant_profiles').select('id').eq('email', email).maybeSingle();
  if (applicant) return 'applicant';

  return null;
}

export async function login(credentials: LoginCredentials): Promise<LoginResponse> {
  const { email, password } = credentials;

  try {
    const { data, error } = await supabase.auth.signInWithPassword({ email, password });

    if (error) return { success: false, error: error.message };
    if (!data.user) return { success: false, error: 'Login failed' };

    const role = await detectUserRole(email);
    if (!role) return { success: false, error: 'No account found with this email.' };

    const authUser: AuthUser = {
      id: data.user.id,
      email: data.user.email ?? email,
      role,
    };

    if (typeof window !== 'undefined') {
      sessionStorage.setItem('auth_user', JSON.stringify(authUser));
    }

    return { success: true, user: authUser };
  } catch (err) {
    console.error('Login error:', err);
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
    supabase.auth.signOut();
    window.location.href = '/login';
  }
}

export function isAuthenticated(): boolean {
  return getCurrentUser() !== null;
}

export function hasRole(role: UserRole): boolean {
  return getCurrentUser()?.role === role;
}

export function isAnyAdmin(role: UserRole): boolean {
  return ['student_admin', 'applicant_admin', 'alumni_admin', 'super_admin'].includes(role);
}

export function getRedirectPath(role: UserRole): string {
  const paths: Record<UserRole, string> = {
    applicant:       '/admissions',
    student:         '/dashboard',
    professor:       '/professor',
    alumni:          '/alumni/dashboard',
    student_admin:   '/admin/student',
    applicant_admin: '/admin/applicant',
    alumni_admin:    '/admin/alumni',
    super_admin:     '/admin/super',
  };
  return paths[role] || '/';
}

export function isMobileDevice(): boolean {
  if (typeof window === 'undefined') return false;
  return /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
}

export function canAccessAdmin(): boolean {
  const user = getCurrentUser();
  if (!user) return false;
  if (!isAnyAdmin(user.role)) return false;
  if (typeof window === 'undefined') return false;
  return !('ReactNativeWebView' in window);
}
