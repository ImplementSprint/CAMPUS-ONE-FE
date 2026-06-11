'use client';

import type { ReactNode } from 'react';
import {
  BadgeCheck,
  FileText,
  GraduationCap,
  Home,
  LogOut,
  Megaphone,
  ShieldCheck,
  Users,
} from 'lucide-react';
import { logout } from '@/shared/auth.service';
import { schoolPortalLabels } from '@/shared/school-reference';
import { AppShell } from '@/shared/ui/layout/AppShell';
import type { NavItem } from '@/shared/ui/layout/SideNav';

interface UnifiedAdminLayoutProps {
  children: ReactNode;
  currentPortal?: 'applicant' | 'student' | 'alumni';
  currentView?: string;
  onNavigate?: (view: string) => void;
}

const alumniNavItems: NavItem[] = [
  { href: '/alumni-admin/dashboard', label: 'Dashboard', icon: Home },
  { href: '/alumni-admin/graduate-exit-onboarding', label: 'Graduate Exit', icon: GraduationCap },
  { href: '/alumni-admin/membership-id-services', label: 'Membership IDs', icon: BadgeCheck },
  { href: '/alumni-admin/record-document-fulfillment', label: 'Documents', icon: FileText },
  { href: '/alumni-admin/engagement-communication', label: 'Engagement', icon: Megaphone },
  { href: '/alumni-admin/data-governance-privacy', label: 'Data Governance', icon: ShieldCheck },
];

const fallbackNavItems = [
  { id: 'dashboard', label: 'Dashboard', icon: Home },
  { id: 'applications', label: 'Applications', icon: FileText },
  { id: 'students', label: 'Students', icon: Users },
];

export function UnifiedAdminLayout({
  children,
  currentPortal = 'alumni',
  currentView = 'dashboard',
  onNavigate,
}: UnifiedAdminLayoutProps) {
  const navItems: NavItem[] = currentPortal === 'alumni'
    ? alumniNavItems
    : fallbackNavItems.map((item) => ({
        label: item.label,
        icon: item.icon,
        active: currentView === item.id,
        onClick: () => onNavigate?.(item.id),
      }));

  const navTitle = currentPortal === 'alumni'
    ? 'Alumni Admin'
    : currentPortal === 'applicant'
      ? 'Applicant Admin'
      : 'Student Admin';

  return (
    <AppShell
      title={navTitle}
      navTitle={navTitle}
      portalLabel={schoolPortalLabels.administration}
      navItems={navItems}
      secondaryItems={[{ label: 'Log out', icon: LogOut, onClick: logout }]}
    >
      {children}
    </AppShell>
  );
}
