'use client';

import { AppShell } from '@/shared/ui/layout/AppShell';

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  return <AppShell title="Student Dashboard">{children}</AppShell>;
}

