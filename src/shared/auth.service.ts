import { supabase } from '@/shared/lib/supabase';

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

async function detectUserRole(email: string): Promise<UserRole | null> {
  const applicantDb = supabase.schema('applicant');
  const studentDb = supabase.schema('student');
  const facultyDb = supabase.schema('faculty');
  const alumniDb = supabase.schema('alumni');

  const { data: student } = await studentDb.from('student_accounts').select('id').eq('email', email).maybeSingle();
  if (student) return 'student';

  // Admin roles: prefer the refactored custom schema data.
  // Fallback to legacy public `admin_users` only if present.
  const { data: admin } = await supabase.from('admin_users').select('role').eq('email', email).maybeSingle();
  if (admin?.role && adminRoles.includes(admin.role as (typeof adminRoles)[number])) return admin.role as UserRole;


  // Professor records are keyed by id/UID in backend runtime queries.
  // Match against auth UID (Supabase user id), not login email.
const { data: professor } = await facultyDb
  .from('professor_users')
  .select('id')
  .eq('email', email)
  .maybeSingle();

if (professor) return 'professor';

  const { data: alumni } = await alumniDb.from('alumni').select('id').eq('email', email).maybeSingle();
  if (alumni) return 'alumni';

  try {
    const { data: applicant } = await applicantDb
      .from('applicant_profiles')
      .select('id')
      .eq('email', email)
      .maybeSingle();
    if (applicant) return 'applicant';
  } catch {
    // Non-blocking: applicant_profiles can fail (e.g., 406) for some users.
    // In that case, continue role detection (e.g., student lookup should still succeed).
  }


  return null;
}

export async function login(credentials: LoginCredentials): Promise<LoginResponse> {
  const { email, password } = credentials;
  try {
    const { data, error } = await supabase.auth.signInWithPassword({ email, password });
    if (error) return { success: false, error: error.message };

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
