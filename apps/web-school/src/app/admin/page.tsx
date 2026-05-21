'use client';
import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';

const adminRedirects = {
  super_admin: '/super-admin/dashboard',
  applicant_admin: '/applicant-admin/dashboard',
  student_admin: '/student-admin/dashboard',
  alumni_admin: '/alumni-admin/dashboard',
} as const;

export default function AdminPage() {
  const router = useRouter();
  const { role, loading } = useAuth();

  useEffect(() => {
    if (loading) return;
    if (!role) {
      router.replace('/login');
      return;
    }
    router.replace(adminRedirects[role as keyof typeof adminRedirects] || '/login');
  }, [loading, role, router]);

  if (loading) return null;

  return (
    null
  );
}
