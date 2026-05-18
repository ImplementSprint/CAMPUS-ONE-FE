import { supabase } from '@/lib/supabase';
import { signOut as apiSignOut } from '@/lib/api';

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
    console.debug('[auth] login start', { email });
    // Protect against network/backend hangs by racing signIn with a timeout
    const signInPromise = supabase.auth.signInWithPassword({ email, password });
    const timeoutMs = 8000;
    const timeoutPromise = new Promise<{ data: any; error: Error | null }>((resolve) => {
      setTimeout(() => resolve({ data: null, error: new Error('Sign-in timed out') }), timeoutMs);
    });
    const { data, error } = await Promise.race([signInPromise, timeoutPromise]);

    if (error) {
      console.debug('[auth] signIn response error', error);
      return { success: false, error: error.message };
    }
    if (!data.user) return { success: false, error: 'Login failed' };

    console.debug('[auth] login success', { userId: data.user.id });

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

export async function logout(): Promise<void> {
  if (typeof window === 'undefined') return;
  try {
    // Sign out from Supabase (client)
    await supabase.auth.signOut();
  } catch (err) {
    console.error('Supabase signOut error:', err);
  }

  // Fire-and-forget backend signout to avoid blocking the UI if the API is slow/unreachable
  apiSignOut().catch(() => undefined);

  // Clear client-side cached auth and navigate to login
  try {
    // remove our cached user
    sessionStorage.removeItem('auth_user');

    // remove any localStorage keys that Supabase or related libs may have left behind
    try {
      const keys = Object.keys(localStorage);
      for (const k of keys) {
        if (!k) continue;
        const lower = k.toLowerCase();
        if (lower.includes('supabase') || lower.includes('sb:') || lower.includes('sb-') || lower.includes('auth')) {
          localStorage.removeItem(k);
        }
      }
      // common explicit key
      localStorage.removeItem('supabase.auth.token');
    } catch (e) {
      console.debug('[auth] clearing localStorage failed', e);
    }

    // Best-effort: remove Supabase-related IndexedDB databases if available
    try {
      if ('indexedDB' in window && typeof (indexedDB as any).databases === 'function') {
        // indexedDB.databases() is not available in all browsers
        // wrap in try/catch to avoid throwing
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        (indexedDB as any).databases().then((dbs: any[]) => {
          dbs.forEach((db) => {
            try {
              if (db?.name && String(db.name).toLowerCase().includes('supabase')) {
                indexedDB.deleteDatabase(db.name);
              }
            } catch {
              // ignore
            }
          });
        }).catch(() => {});
      }
    } catch (e) {
      /* ignore */
    }

    // Force a reload to ensure any in-memory clients reinitialize
    window.location.replace('/login?ts=' + Date.now());
  } catch (err) {
    console.error('Logout cleanup error:', err);
    // fallback
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
