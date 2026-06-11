'use client';

import { useState } from 'react';
import { schoolPortalLabels } from '@/shared/school-reference';
import type { AppSession, SchoolLevel } from '../types/admissions.types';
import { MobileHeader } from './MobileHeader';
import { SidebarDrawer } from './SidebarDrawer';
import {
  Clock,
  FileText,
  GraduationCap,
  HelpCircle,
  Home,
  LogOut,
  Settings,
  Upload,
  User,
  Users,
  UsersRound,
} from 'lucide-react';

interface AdmissionsMobileLayoutProps {
  session: AppSession;
  children: React.ReactNode;
  onNavigate?: (step: string) => void;
}

interface MenuItem {
  label: string;
  icon: React.ComponentType<{ className?: string }>;
}

const MENU_BY_SCHOOL_LEVEL: Record<SchoolLevel, MenuItem[]> = {
  Kinder: [
    { label: 'Results', icon: Home },
    { label: 'Personal Information', icon: User },
    { label: 'Parent Information', icon: Users },
    { label: 'Academic Background', icon: GraduationCap },
    { label: 'Documents Uploading', icon: Upload },
    { label: 'Activity Log', icon: Clock },
  ],
  Elementary: [
    { label: 'Results', icon: Home },
    { label: 'Personal Information', icon: User },
    { label: 'Parent Information', icon: Users },
    { label: 'Academic Background', icon: GraduationCap },
    { label: 'Documents Uploading', icon: Upload },
    { label: 'Activity Log', icon: Clock },
  ],
  'Junior High School': [
    { label: 'Results', icon: Home },
    { label: 'Personal Information', icon: User },
    { label: 'Parent Information', icon: Users },
    { label: 'Academic Background', icon: GraduationCap },
    { label: 'Program', icon: FileText },
    { label: 'Documents Uploading', icon: Upload },
    { label: 'Activity Log', icon: Clock },
  ],
  'Senior High School': [
    { label: 'Results', icon: Home },
    { label: 'Personal Information', icon: User },
    { label: 'Parent Information', icon: Users },
    { label: 'Academic Background', icon: GraduationCap },
    { label: 'Program', icon: FileText },
    { label: 'Documents Uploading', icon: Upload },
    { label: 'Activity Log', icon: Clock },
  ],
  College: [
    { label: 'Results', icon: Home },
    { label: 'Personal Information', icon: User },
    { label: 'Parent Information', icon: Users },
    { label: 'Academic Background', icon: GraduationCap },
    { label: 'Alumni Relative Information', icon: UsersRound },
    { label: 'Program', icon: FileText },
    { label: 'Documents Uploading', icon: Upload },
    { label: 'Activity Log', icon: Clock },
  ],
};

function menuItemToStep(label: string): string {
  const map: Record<string, string> = {
    Results: 'result',
    'Personal Information': 'personal-profile',
    'Parent Information': 'parent-info',
    'Academic Background': 'academic-background',
    'Alumni Relative Information': 'alumni-info',
    Program: 'program-selection',
    'Documents Uploading': 'documents',
    'Activity Log': 'activity-log',
  };
  return map[label] || '';
}

function getInitials(first: string, last: string): string {
  const f = first.trim()[0] ?? '';
  const l = last.trim()[0] ?? '';
  return (f + l).toUpperCase() || '?';
}

export function AdmissionsMobileLayout({
  session,
  children,
  onNavigate,
}: AdmissionsMobileLayoutProps) {
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);

  const showNavigation = !!session.applicantId;
  const menuItems = session.schoolLevel ? MENU_BY_SCHOOL_LEVEL[session.schoolLevel] : [];
  const initials = session.firstName ? getInitials(session.firstName, session.lastName) : '';
  const fullName = `${session.firstName} ${session.lastName}`.trim() || 'Applicant';

  return (
    <div className="min-h-screen bg-neutral-100 admissions-desktop-layout">
      {showNavigation ? (
        <aside className="fixed inset-y-0 left-0 z-30 hidden w-64 flex-col border-r border-neutral-800 bg-campus-ink text-white md:flex">
          <div className="flex items-center gap-2 border-b border-neutral-800 p-6">
            <span className="grid h-9 w-9 place-items-center overflow-hidden rounded-lg bg-white">
              <img src="/logo.png" alt="" className="h-7 w-7 object-contain" />
            </span>
            <div>
              <p className="text-sm font-semibold">{schoolPortalLabels.productName}</p>
              <p className="text-xs text-campus-brand">{schoolPortalLabels.admissions}</p>
            </div>
          </div>

          <div className="flex items-center gap-3 border-b border-neutral-800 px-4 py-5">
            <div className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-full bg-neutral-700 text-sm font-bold text-white">
              {initials || 'A'}
            </div>
            <div className="min-w-0 flex-1">
              <p className="truncate text-sm font-semibold text-white">{fullName}</p>
              <p className="text-xs text-neutral-400">Applicant</p>
            </div>
          </div>

          <nav className="flex-1 space-y-1 overflow-y-auto px-3 py-4">
            {menuItems.map((item) => {
              const step = menuItemToStep(item.label);
              const isActive = session.step === step || (session.step === 'select' && step === 'result');
              const Icon = item.icon;

              return (
                <button
                  key={item.label}
                  type="button"
                  onClick={() => step && onNavigate?.(step)}
                  className={`flex h-11 w-full items-center gap-3 rounded-md px-4 text-left text-sm transition-colors ${
                    isActive ? 'bg-campus-brand text-campus-ink' : 'text-neutral-300 hover:bg-neutral-800'
                  }`}
                >
                  <Icon className="h-5 w-5 flex-shrink-0" aria-hidden="true" />
                  <span>{item.label}</span>
                </button>
              );
            })}
          </nav>

          <div className="space-y-1 border-t border-neutral-800 px-3 py-4">
            <button type="button" className="flex h-11 w-full items-center gap-3 rounded-md px-4 text-left text-sm text-neutral-300 transition-colors hover:bg-neutral-800">
              <HelpCircle className="h-5 w-5 flex-shrink-0" aria-hidden="true" />
              <span>Help</span>
            </button>
            <button type="button" className="flex h-11 w-full items-center gap-3 rounded-md px-4 text-left text-sm text-neutral-300 transition-colors hover:bg-neutral-800">
              <Settings className="h-5 w-5 flex-shrink-0" aria-hidden="true" />
              <span>Settings</span>
            </button>
            <button type="button" className="flex h-11 w-full items-center gap-3 rounded-md px-4 text-left text-sm text-neutral-300 transition-colors hover:bg-neutral-800">
              <LogOut className="h-5 w-5 flex-shrink-0" aria-hidden="true" />
              <span>Log out</span>
            </button>
          </div>
        </aside>
      ) : null}

      <div className={showNavigation ? 'md:pl-64' : ''}>
        <div className={`${showNavigation ? 'md:hidden' : ''} sticky top-0 z-20`}>
          <MobileHeader
            session={session}
            onMenuClick={showNavigation ? () => setIsDrawerOpen((prev) => !prev) : undefined}
          />
        </div>

        {showNavigation ? (
          <header className="sticky top-0 z-20 hidden h-16 items-center justify-between border-b border-neutral-200 bg-white px-6 md:flex">
            <h2 className="text-sm font-semibold text-campus-ink">{schoolPortalLabels.admissions}</h2>
            <span className="text-xs font-medium text-campus-muted">Applicant ID: {session.applicantId}</span>
          </header>
        ) : null}

        {showNavigation ? (
          <div className="md:hidden">
            <SidebarDrawer
              isOpen={isDrawerOpen}
              onClose={() => setIsDrawerOpen(false)}
              session={session}
              activeStep={session.step}
              onNavigate={(step) => {
                onNavigate?.(step);
                setIsDrawerOpen(false);
              }}
            />
          </div>
        ) : null}

        <main className="mx-auto grid w-full max-w-6xl gap-6 px-4 py-6 md:px-6">
          <div className="min-w-0 overflow-hidden rounded-lg border border-neutral-200 bg-white shadow-sm">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
}
