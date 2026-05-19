import { supabase } from '@/shared/lib/supabase';

export type UserRole = 'applicant' | 'student' | 'professor' | 'alumni' | 'admin';

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
<<<<<<< HEAD
  const { data: student } = await supabase.schema('student').from('student_accounts').select('id').eq('email', email).maybeSingle();
  if (student) return 'student';

  const { data: admin } = await supabase.schema('admin').from('admin_users').select('id').eq('email', email).maybeSingle();
  if (admin) return 'admin';

  const { data: professor } = await supabase.schema('faculty').from('professor_users').select('id').eq('email', email).maybeSingle();
  if (professor) return 'professor';

  const { data: applicant } = await supabase.schema('applicant').from('applicant_profiles').select('id').eq('email', email).maybeSingle();
=======
  const { data: student } = await supabase.from('student_accounts').select('id').eq('email', email).maybeSingle();
  if (student) return 'student';

  const { data: admin } = await supabase.from('admin_users').select('id').eq('email', email).maybeSingle();
  if (admin) return 'admin';

  const { data: professor } = await supabase.from('professor_users').select('id').eq('email', email).maybeSingle();
  if (professor) return 'professor';

  const { data: applicant } = await supabase.from('applicant_profiles').select('id').eq('email', email).maybeSingle();
>>>>>>> 57fc38d9ff45965d75ad134eebf190823cbbebfe
  if (applicant) return 'applicant';

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
    alumni: '/alumni',
    admin: '/admin',
  };
  return paths[role] || '/';
}

export function isMobileDevice(): boolean {
  if (typeof window === 'undefined') return false;
  return /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
}

export function canAccessAdmin(): boolean {
  const user = getCurrentUser();
  if (user?.role !== 'admin') return false;
  if (typeof window === 'undefined') return false;
  return !('ReactNativeWebView' in window);
}
