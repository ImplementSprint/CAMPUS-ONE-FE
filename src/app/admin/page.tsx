'use client';
import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { getCurrentUser, getRedirectPath, isAnyAdmin } from '@/services/auth.service';

export default function AdminPage() {
  const router = useRouter();

  useEffect(() => {
    const user = getCurrentUser();
    if (!user) { router.replace('/login'); return; }
    if (isAnyAdmin(user.role)) {
      router.replace(getRedirectPath(user.role));
    } else {
      router.replace('/login');
    }
  }, []);

  return null;
}
