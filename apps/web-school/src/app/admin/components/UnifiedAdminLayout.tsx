'use client';

import type { ReactNode } from 'react';
import {
  AlertTriangle,
  Award,
  BarChart2,
  BarChart3,
  BellRing,
  BookOpen,
  Calendar,
  CheckCircle,
  ClipboardList,
  FileCheck,
  FileText,
  GraduationCap,
  HeadphonesIcon,
  HelpCircle,
  Inbox,
  LayoutDashboard,
  Library,
  LogOut,
  Shield,
  Users,
} from 'lucide-react';
import { logout, getCurrentUser } from '@/services/auth.service';
import { schoolPortalLabels } from '@/shared/school-reference';
import { AppShell } from '@/shared/ui/layout/AppShell';
import type { NavItem } from '@/shared/ui/layout/SideNav';

interface UnifiedAdminLayoutProps {
  children: ReactNode;
  currentPortal: 'applicant' | 'student';
  currentView: string;
  onNavigate?: (view: string) => void;
}

const viewTitles: Record<string, string> = {
  dashboard: 'Dashboard',
  'admissions-scope-guide': 'Admissions Scope Guide',
  applications: 'Applications',
  'application-queue': 'Application Queue',
  'document-verification': 'Document Verification',
  'selection-decisioning': 'Selection & Decisioning',
  'entrance-examination': 'Entrance Examination',
  'interview-coordination': 'Interview Coordination',
  'eligibility-criteria': 'Eligibility Criteria',
  'enrollment-quotas': 'Enrollment Quotas',
  'admissions-analytics': 'Admissions Analytics',
  'applicant-helpdesk': 'Applicant Help Desk',
  'transmission-logs': 'Transmission Logs',
  directory: 'Student Directory',
  enrollment: 'Enrollment Center',
  academics: 'Academic Hub',
  honors: 'Honors Tracker',
  clearance: 'Clearance & Deficiencies',
  reports: 'Reports',
  catalog: 'Subject Catalog',
  requests: 'Service Requests',
  notifications: 'Notification Center',
  students: 'Students',
  detail: 'Details',
};

const applicantMenuItems = [
  { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { id: 'admissions-scope-guide', label: 'Admissions Scope Guide', icon: BookOpen },
  { id: 'application-queue', label: 'Application Queue', icon: Inbox },
  { id: 'document-verification', label: 'Document Verification', icon: FileCheck },
  { id: 'selection-decisioning', label: 'Selection & Decisioning', icon: CheckCircle },
  { id: 'entrance-examination', label: 'Entrance Examination', icon: ClipboardList },
  { id: 'interview-coordination', label: 'Interview Coordination', icon: Calendar },
  { id: 'eligibility-criteria', label: 'Eligibility Criteria', icon: Shield },
  { id: 'enrollment-quotas', label: 'Enrollment Quotas', icon: Users },
  { id: 'admissions-analytics', label: 'Admissions Analytics', icon: BarChart3 },
  { id: 'applicant-helpdesk', label: 'Applicant Help Desk', icon: HelpCircle },
  { id: 'transmission-logs', label: 'Transmission Logs', icon: FileText },
];

const studentMenuItems = [
  { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { id: 'directory', label: 'Student Directory', icon: GraduationCap },
  { id: 'enrollment', label: 'Enrollment Center', icon: ClipboardList },
  { id: 'academics', label: 'Academic Hub', icon: BookOpen },
  { id: 'honors', label: 'Honors Tracker', icon: Award },
  { id: 'clearance', label: 'Clearance & Deficiencies', icon: AlertTriangle },
  { id: 'reports', label: 'Reports', icon: BarChart2 },
  { id: 'catalog', label: 'Subject Catalog', icon: Library },
  { id: 'requests', label: 'Service Requests', icon: HeadphonesIcon },
  { id: 'notifications', label: 'Notification Center', icon: BellRing },
];

export function UnifiedAdminLayout({
  children,
  currentPortal,
  currentView,
  onNavigate,
}: UnifiedAdminLayoutProps) {
  const user = getCurrentUser();
  const menuItems = currentPortal === 'applicant' ? applicantMenuItems : studentMenuItems;
  const navItems: NavItem[] = menuItems.map((item) => ({
    label: item.label,
    icon: item.icon,
    active: currentView === item.id,
    onClick: () => onNavigate?.(item.id),
  }));
  const title = currentView === 'detail'
    ? currentPortal === 'applicant' ? 'Application Details' : 'Student Details'
    : viewTitles[currentView] ?? 'School Administration';

  return (
    <AppShell
      title={title}
      navTitle={currentPortal === 'applicant' ? 'Applicant Admin' : 'Student Admin'}
      portalLabel={schoolPortalLabels.administration}
      navItems={navItems}
      secondaryItems={[{ label: 'Log out', icon: LogOut, onClick: logout }]}
    >
      <div className="mb-5 border-b border-campus-border pb-4">
        <p className="text-sm text-campus-muted">
          {currentView === 'dashboard'
            ? `Welcome back, ${user?.name || 'Admin'}`
            : currentPortal === 'applicant'
              ? 'Review applicant records, requirements, decisions, and support work.'
              : 'Manage enrolled student records, enrollment, academics, and service requests.'}
        </p>
      </div>
      {children}
    </AppShell>
  );
}
