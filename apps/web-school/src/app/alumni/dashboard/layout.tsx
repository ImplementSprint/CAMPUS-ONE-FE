'use client';

import { BadgeCheck, CreditCard, FileText, GraduationCap, Home, LogOut, Settings, User } from 'lucide-react';
import { logout } from '@/services/auth.service';
import { schoolPortalLabels } from '@/shared/school-reference';
import { AppShell } from '@/shared/ui/layout/AppShell';
import type { NavItem } from '@/shared/ui/layout/SideNav';
import '../alumni.css';

const navItems: NavItem[] = [
  { href: '/alumni/dashboard', label: 'Dashboard', icon: Home },
  { href: '/alumni/dashboard/profile', label: 'Profile', icon: User },
  { href: '/alumni/dashboard/document-request', label: 'Document Request', icon: FileText },
  { href: '/alumni/dashboard/my-requests', label: 'My Requests', icon: BadgeCheck },
  { href: '/alumni/dashboard/card-application', label: 'Card Application', icon: CreditCard },
  { href: '/alumni/dashboard/billing-payments', label: 'Billing & Payments', icon: CreditCard },
  { href: '/alumni/dashboard/clearance-tracker', label: 'Clearance Tracker', icon: GraduationCap },
];

export default function AlumniDashboardLayout({ children }: { children: React.ReactNode }) {
  const secondaryItems: NavItem[] = [
    { href: '/alumni/dashboard/settings', label: 'Settings', icon: Settings },
    { label: 'Log out', icon: LogOut, onClick: logout },
  ];

  return (
    <AppShell
      title="Alumni Services"
      navTitle="Alumni Services"
      portalLabel={schoolPortalLabels.alumni}
      navItems={navItems}
      secondaryItems={secondaryItems}
    >
      {children}
    </AppShell>
  );
}
