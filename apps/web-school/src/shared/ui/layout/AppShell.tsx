'use client';

import { useState, type ReactNode } from 'react';
import {
  AlertTriangle,
  BookOpen,
  ClipboardCheck,
  ClipboardList,
  GraduationCap,
  HelpCircle,
  Home,
  LogOut,
  Repeat,
  Settings,
  User,
  WalletCards,
} from 'lucide-react';
import { logout } from '@/services/auth.service';
import { schoolPortalLabels } from '@/shared/school-reference';
import { SideNav, type NavItem } from './SideNav';
import { TopBar } from './TopBar';

type AppShellProps = {
  title: string;
  children: ReactNode;
  navItems?: NavItem[];
  navTitle?: string;
  portalLabel?: string;
  secondaryItems?: NavItem[];
};

const defaultStudentNav: NavItem[] = [
  { href: '/dashboard', label: 'Dashboard', icon: Home },
  { href: '/profile', label: 'Profile', icon: User },
  { href: '/courses', label: 'Course Details', icon: BookOpen },
  { href: '/evaluation', label: 'Evaluation', icon: ClipboardList },
  { href: '/enrollment', label: 'Online Enrollment', icon: GraduationCap },
  { href: '/advised', label: 'Advised Courses', icon: ClipboardCheck },
  { href: '/add-drop', label: 'Add / Drop', icon: Repeat },
  { href: '/payment', label: 'Balance Payment', icon: WalletCards },
  { href: '/grades', label: 'View Semestral Grades', icon: ClipboardList },
  { href: '/deficiencies', label: 'Deficiencies', icon: AlertTriangle },
  { href: '/graduation', label: 'Graduation', icon: GraduationCap },
  { href: '/subjects', label: 'Subjects', icon: BookOpen },
];

export function AppShell({
  title,
  children,
  navItems = defaultStudentNav,
  navTitle,
  portalLabel = schoolPortalLabels.student,
  secondaryItems,
}: AppShellProps) {
  const [navigationOpen, setNavigationOpen] = useState(false);

  const defaultSecondaryItems: NavItem[] = [
    { href: '/help', label: 'Help', icon: HelpCircle },
    { href: '/settings', label: 'Settings', icon: Settings },
    {
      label: 'Log out',
      icon: LogOut,
      onClick: logout,
    },
  ];
  const resolvedSecondaryItems = secondaryItems ?? defaultSecondaryItems;

  return (
    <div className="min-h-screen bg-campus-page">
      {navigationOpen ? (
        <div className="fixed inset-0 z-40 bg-black/40 md:hidden" onClick={() => setNavigationOpen(false)} />
      ) : null}

      <div className={`fixed inset-y-0 left-0 z-50 transform transition-transform md:translate-x-0 ${navigationOpen ? 'translate-x-0' : '-translate-x-full'}`}>
        <SideNav
          title={navTitle ?? portalLabel}
          subtitle={portalLabel}
          items={navItems}
          secondaryItems={resolvedSecondaryItems}
          onClose={() => setNavigationOpen(false)}
        />
      </div>

      <div className="min-w-0 md:pl-64">
        <TopBar title={title} portalLabel={portalLabel} onOpenNavigation={() => setNavigationOpen(true)} />
        <main className="mx-auto w-full max-w-[1440px] px-4 py-6 md:px-6">
          {children}
        </main>
      </div>
    </div>
  );
}
