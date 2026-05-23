'use client';
import { createContext, useContext, useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase';
import { User } from '@supabase/supabase-js';
import { adminRoles, type UserRole } from '@/services/auth.service';
import {
  clearCachedBackendSession,
  loadBackendAuthBootstrap,
  readCachedBackendAccessToken,
  readCachedBackendAuthUser,
  writeCachedBackendAccessToken,
  writeCachedBackendAuthUser,
} from '@/services/backend-session.service';

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
  return readCachedBackendAuthUser(sessionStorage);
}

function isAdminRole(role: UserRole | null | undefined): role is (typeof adminRoles)[number] {
  return !!role && adminRoles.includes(role as (typeof adminRoles)[number]);
}

async function detectRole(email: string): Promise<UserRole | null> {
  const applicantDb = supabase.schema('applicant');
  const studentDb = supabase.schema('student');
  const facultyDb = supabase.schema('faculty');
  const alumniDb = supabase.schema('alumni');

  const { data: student } = await studentDb.from('student_accounts').select('id').eq('email', email).maybeSingle();
  if (student) return 'student';

  // Professor: backend/runtime queries appear to key professor_users by `id` (auth UID), not email.
  const { data: professor } = await facultyDb.from('professor_users').select('id').eq('id', email).maybeSingle();
  if (professor) return 'professor';

  const { data: alumni } = await alumniDb.from('alumni').select('id').eq('email', email).maybeSingle();
  if (alumni) return 'alumni';

  const { data: applicant } = await applicantDb.from('applicant_profiles').select('id').eq('email', email).maybeSingle();
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
            const cachedRole = parsed.role as UserRole;
            if (isAdminRole(cachedRole)) {
              const detectedRole = await detectRole(u.email);
              setRole(detectedRole);
              if (detectedRole && typeof window !== 'undefined') {
                writeCachedBackendAuthUser(sessionStorage, { id: u.id, email: u.email, role: detectedRole });
              }
            } else {
              setRole(cachedRole);
            }
            setLoading(false);
            return;
          }
        } catch { /* ignore */ }
      }
      // Fallback: detect from DB
      const detectedRole = await detectRole(u.email);
      setRole(detectedRole);
      if (detectedRole && typeof window !== 'undefined') {
        writeCachedBackendAuthUser(sessionStorage, { id: u.id, email: u.email, role: detectedRole });
      }
    } else {
      setRole(null);
      if (typeof window !== 'undefined') {
        clearCachedBackendSession(sessionStorage);
      }
    }
    setLoading(false);
  };

  useEffect(() => {
    const storedUser = readStoredAuthUser();
    const storedAccessToken = typeof window !== 'undefined'
      ? readCachedBackendAccessToken(sessionStorage)
      : null;

    if (storedAccessToken) {
      loadBackendAuthBootstrap(storedAccessToken).then((backendBootstrap) => {
        if (backendBootstrap) {
          setUser({ id: backendBootstrap.user.id, email: backendBootstrap.user.email } as User);
          setRole(backendBootstrap.user.role);
          setLoading(false);
          return;
        }

        if (storedUser) {
          setUser({ id: storedUser.id, email: storedUser.email } as User);
          setRole(storedUser.role);
        } else {
          clearCachedBackendSession(sessionStorage);
          setUser(null);
          setRole(null);
        }
        setLoading(false);
      });
      return;
    }

    if (storedUser) {
      setUser({ id: storedUser.id, email: storedUser.email } as User);
      if (isAdminRole(storedUser.role)) {
        detectRole(storedUser.email).then((detectedRole) => {
          setRole(detectedRole);
          if (detectedRole && typeof window !== 'undefined') {
            writeCachedBackendAuthUser(sessionStorage, { id: storedUser.id, email: storedUser.email, role: detectedRole });
          }
          setLoading(false);
        });
      } else {
        setRole(storedUser.role);
        setLoading(false);
      }
    }

    // Get initial session — if refresh token is invalid, sign out cleanly
    supabase.auth.getSession().then(async ({ data: { session }, error }) => {
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
        if (typeof window !== 'undefined') clearCachedBackendSession(sessionStorage);
        setUser(null);
        setRole(null);
        setLoading(false);
        return;
      }

      if (typeof window !== 'undefined') {
        writeCachedBackendAccessToken(sessionStorage, session?.access_token ?? null);
      }
      const backendBootstrap = await loadBackendAuthBootstrap(session?.access_token ?? null);
      if (backendBootstrap) {
        setUser({ id: backendBootstrap.user.id, email: backendBootstrap.user.email } as User);
        setRole(backendBootstrap.user.role);
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
        if (typeof window !== 'undefined') clearCachedBackendSession(sessionStorage);
        setUser(null);
        setRole(null);
        setLoading(false);
        return;
      }
      if (typeof window !== 'undefined') {
        writeCachedBackendAccessToken(sessionStorage, session?.access_token ?? null);
      }
      loadBackendAuthBootstrap(session?.access_token ?? null).then((backendBootstrap) => {
        if (backendBootstrap) {
          setUser({ id: backendBootstrap.user.id, email: backendBootstrap.user.email } as User);
          setRole(backendBootstrap.user.role);
          setLoading(false);
          return;
        }

        resolveUser(session?.user ?? null);
      });
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
