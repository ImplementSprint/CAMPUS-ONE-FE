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

async function detectRole(email: string): Promise<UserRole | null> {
  // Check student accounts
  const { data: student } = await supabase.from('student_accounts').select('id').eq('email', email).maybeSingle();
  if (student) return 'student';

  // Check admin_users — role column determines which admin type
  const { data: admin } = await supabase.from('admin_users').select('id, role').eq('email', email).maybeSingle();
  if (admin) {
    const roleMap: Record<string, UserRole> = {
      student_admin:    'student_admin',
      applicant_admin:  'applicant_admin',
      alumni_admin:     'alumni_admin',
      super_admin:      'super_admin',
      admin:            'applicant_admin', // fallback for legacy rows
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
    // Get initial session with a timeout to avoid stalling the app if the client is unresponsive
    (async () => {
      try {
        const timeoutMs = 8000;
        const timeout = new Promise<{ data: { session: any }; error?: any }>((resolve) =>
          setTimeout(() => resolve({ data: { session: null }, error: new Error('getSession timed out') }), timeoutMs)
        );
        const res = (await Promise.race([supabase.auth.getSession(), timeout])) as any;
        const { data: { session } = { session: null }, error } = res ?? {};
        if (error) {
          // Stale/invalid refresh token — clear everything and treat as logged out
          supabase.auth.signOut().catch(() => {});
          if (typeof window !== 'undefined') sessionStorage.removeItem('auth_user');
          setUser(null);
          setRole(null);
          setLoading(false);
          return;
        }
        resolveUser(session?.user ?? null);
      } catch (e) {
        // Ensure we don't leave the app stuck
        supabase.auth.signOut().catch(() => {});
        if (typeof window !== 'undefined') sessionStorage.removeItem('auth_user');
        setUser(null);
        setRole(null);
        setLoading(false);
      }
    })();

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
