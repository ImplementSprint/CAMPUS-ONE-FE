'use client';
import { createContext, useContext, useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase';
import { User } from '@supabase/supabase-js';
import type { UserRole } from '@/services/auth.service';

interface AuthContextType {
  user: User | null;
  role: UserRole | null;
  loading: boolean;
}

const AuthContext = createContext<AuthContextType>({
  user: null,
  role: null,
  loading: true,
});

function readStoredAuthUser(): { id: string; email: string; role: UserRole } | null {
  if (typeof window === 'undefined') return null;

  const cached = sessionStorage.getItem('auth_user');
  if (!cached) return null;

  try {
    const parsed = JSON.parse(cached) as { id?: string; email?: string; role?: UserRole };
    if (parsed.id && parsed.email && parsed.role) {
      return { id: parsed.id, email: parsed.email, role: parsed.role };
    }
  } catch {
    return null;
  }

  return null;
}

async function detectRole(email: string): Promise<UserRole | null> {
  const applicationDb = supabase.schema('application');
  const studentDb = supabase.schema('student');
  const facultyDb = supabase.schema('faculty');
  const alumniDb = supabase.schema('alumni');

  const checks: { table: string; role: UserRole }[] = [
    { table: 'student_accounts',   role: 'student' },
    { table: 'admin_users',        role: 'admin' },
    { table: 'professor_users',    role: 'professor' },
    { table: 'accounts',           role: 'alumni' },
    { table: 'applicant_profiles', role: 'applicant' },
  ];
  for (const { table, role } of checks) {
    const db =
      table === 'student_accounts' ? studentDb :
      table === 'professor_users' ? facultyDb :
      table === 'accounts' ? alumniDb :
      table === 'applicant_profiles' ? applicationDb :
      supabase;

    const { data } = await db.from(table).select('id').eq('email', email).maybeSingle();
    if (data) return role;
  }
  return null;
}

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [role, setRole] = useState<UserRole | null>(null);
  const [loading, setLoading] = useState(true);

  const resolveUser = async (u: User | null) => {
    setUser(u);
    if (u?.email) {
      // Check sessionStorage first (fast path)
      const cached = typeof window !== 'undefined' ? sessionStorage.getItem('auth_user') : null;
      if (cached) {
        try {
          const parsed = JSON.parse(cached);
          if (parsed.email === u.email && parsed.role) {
            setRole(parsed.role as UserRole);
            setLoading(false);
            return;
          }
        } catch { /* ignore */ }
      }
      // Fallback: detect from DB
      const detectedRole = await detectRole(u.email);
      setRole(detectedRole);
      if (detectedRole && typeof window !== 'undefined') {
        sessionStorage.setItem('auth_user', JSON.stringify({ id: u.id, email: u.email, role: detectedRole }));
      }
    } else {
      setRole(null);
      if (typeof window !== 'undefined') {
        sessionStorage.removeItem('auth_user');
      }
    }
    setLoading(false);
  };

  useEffect(() => {
    const storedUser = readStoredAuthUser();

    if (storedUser) {
      setUser({ id: storedUser.id, email: storedUser.email } as User);
      setRole(storedUser.role);
      setLoading(false);
    }

    // Get initial session — if refresh token is invalid, sign out cleanly
    supabase.auth.getSession().then(({ data: { session }, error }) => {
      if (error) {
        // Stale/invalid refresh token — clear everything and treat as logged out
        const cachedUser = readStoredAuthUser();
        if (cachedUser) {
          setUser({ id: cachedUser.id, email: cachedUser.email } as User);
          setRole(cachedUser.role);
          setLoading(false);
          return;
        }

        supabase.auth.signOut().catch(() => {});
        if (typeof window !== 'undefined') sessionStorage.removeItem('auth_user');
        setUser(null);
        setRole(null);
        setLoading(false);
        return;
      }

      if (!session?.user) {
        const cachedUser = readStoredAuthUser();
        if (cachedUser) {
          setUser({ id: cachedUser.id, email: cachedUser.email } as User);
          setRole(cachedUser.role);
          setLoading(false);
          return;
        }
      }

      resolveUser(session?.user ?? null);
    });

    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      if (event === 'TOKEN_REFRESHED' && !session) {
        // Token refresh failed — clear session
        if (typeof window !== 'undefined') sessionStorage.removeItem('auth_user');
        setUser(null);
        setRole(null);
        setLoading(false);
        return;
      }
      resolveUser(session?.user ?? null);
    });

    return () => subscription.unsubscribe();
  }, []);

  return (
    <AuthContext.Provider value={{ user, role, loading }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
