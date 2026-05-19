import { supabase } from '@/lib/supabase';

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
  const { data: student } = await supabase.from('student_accounts').select('id').eq('email', email).maybeSingle();
  if (student) return 'student';

  // Check admin_users table for admin role
  const { data: admin } = await supabase.from('admin_users').select('id, role').eq('email', email).maybeSingle();
  if (admin) {
    // Map admin roles to UserRole
    if (admin.role === 'super_admin') return 'admin';
    if (admin.role === 'applicant_admin') return 'admin'; // Will be handled by portal switching
    if (admin.role === 'student_admin') return 'admin';
    if (admin.role === 'alumni_admin') return 'admin';
    return 'admin';
  }

  const { data: professor } = await supabase.from('professor_users').select('id').eq('email', email).maybeSingle();
  if (professor) return 'professor';

  const { data: alumni } = await supabase.from('alumni').select('id').eq('email', email).maybeSingle();
  if (alumni) return 'alumni';

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

    // Get admin-specific info if user is admin
    let adminRole = null;
    if (role === 'admin') {
      const { data: adminData } = await supabase
        .from('admin_users')
        .select('role, full_name')
        .eq('email', email)
        .single();
      
      if (adminData) {
        adminRole = adminData.role;
      }
    }

    const authUser: AuthUser = {
      id: data.user.id,
      email: data.user.email ?? email,
      role,
      name: adminRole ? undefined : undefined, // Will be fetched from respective tables
    };

    if (typeof window !== 'undefined') {
      sessionStorage.setItem('auth_user', JSON.stringify(authUser));
      // Store admin role separately for portal detection
      if (adminRole) {
        sessionStorage.setItem('admin_role', adminRole);
      }
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
    sessionStorage.removeItem('admin_role');
    supabase.auth.signOut();
    window.location.href = '/login';
  }
}

export function getAdminRole(): string | null {
  if (typeof window === 'undefined') return null;
  return sessionStorage.getItem('admin_role');
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
