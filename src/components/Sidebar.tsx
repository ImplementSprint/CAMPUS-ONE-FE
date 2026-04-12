'use client';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { supabase } from '@/lib/supabase';
import { useState } from 'react';

export default function Sidebar({ onClose }: { onClose?: () => void }) {
  const pathname = usePathname();
  const router = useRouter();
  const [enrollOpen, setEnrollOpen] = useState(true);

  const handleLogout = async () => {
    await supabase.auth.signOut();
    router.refresh();
    router.push('/login');
  };

  const active = (href: string) => pathname === href || pathname.startsWith(href + '/');

  return (
    <aside className="w-64 min-h-screen bg-black flex flex-col flex-shrink-0">
      {/* Logo + X */}
      <div className="px-5 py-5 flex items-center justify-between border-b border-gray-800">
        <span className="text-lg font-extrabold">
          <span className="text-amber-500">CAMPUS</span>
          <span className="text-white"> Portal</span>
        </span>
        {onClose && (
          <button onClick={onClose} className="text-white hover:text-amber-400 transition">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        )}
      </div>

      <nav className="flex-1 px-3 py-4 overflow-y-auto space-y-1">

        {/* Dashboard */}
        <NavItem href="/dashboard" active={active('/dashboard')}>
          <IconDashboard /> Dashboard
        </NavItem>

        {/* Profile */}
        <NavItem href="/profile" active={active('/profile')}>
          <IconProfile /> Profile
        </NavItem>

        {/* Course Details */}
        <NavItem href="/courses" active={active('/courses')}>
          <IconBook /> Course Details
        </NavItem>

        {/* Evaluation */}
        <NavItem href="/evaluation" active={active('/evaluation')}>
          <IconClipboard /> Evaluation
        </NavItem>

        {/* Enrollment group */}
        <button onClick={() => setEnrollOpen(v => !v)}
          className={`w-full flex items-center justify-between px-4 py-3 rounded-full text-sm font-semibold transition
            ${enrollOpen ? 'bg-amber-500 text-white' : 'text-gray-300 hover:bg-gray-800'}`}>
          <span className="flex items-center gap-3">
            <IconGradCap /> Enrollment
          </span>
          <svg className={`w-4 h-4 transition-transform ${enrollOpen ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
          </svg>
        </button>

        {enrollOpen && (
          <div className="ml-4 pl-3 border-l border-gray-700 space-y-0.5">
            <SubNavItem href="/enrollment" active={active('/enrollment')}>
              <IconDoc /> Online Enrollment
            </SubNavItem>
            <SubNavItem href="/payment" active={active('/payment')}>
              <IconWallet /> Balance Payment
            </SubNavItem>
            <SubNavItem href="/advised" active={active('/advised')}>
              <IconList /> Advised Courses
            </SubNavItem>
            <SubNavItem href="/deficiencies" active={active('/deficiencies')}>
              <IconAlert /> Deficiencies
            </SubNavItem>
          </div>
        )}

        {/* View Semestral Grades */}
        <NavItem href="/grades" active={active('/grades')}>
          <IconChart /> View Semestral Grades
        </NavItem>

        {/* Graduation */}
        <NavItem href="/graduation" active={active('/graduation')}>
          <IconGradCap /> Graduation
        </NavItem>

      </nav>

      {/* Bottom */}
      <div className="px-3 pb-4 border-t border-gray-800 pt-3 space-y-1">
        <NavItem href="/help" active={active('/help')}>
          <IconHelp /> Help
        </NavItem>
        <NavItem href="/settings" active={active('/settings')}>
          <IconSettings /> Settings
        </NavItem>
        <button onClick={handleLogout}
          className="w-full flex items-center gap-3 px-4 py-3 rounded-full text-sm font-semibold text-red-400 hover:bg-gray-800 transition">
          <IconLogout /> Log Out
        </button>
      </div>
    </aside>
  );
}

function NavItem({ href, active, children }: { href: string; active: boolean; children: React.ReactNode }) {
  return (
    <Link href={href}
      className={`flex items-center gap-3 px-4 py-3 rounded-full text-sm font-semibold transition
        ${active ? 'bg-amber-500 text-white' : 'text-gray-300 hover:bg-gray-800'}`}>
      {children}
    </Link>
  );
}

function SubNavItem({ href, active, children }: { href: string; active: boolean; children: React.ReactNode }) {
  return (
    <Link href={href}
      className={`flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm transition
        ${active ? 'text-white font-semibold' : 'text-gray-400 hover:text-white font-medium'}`}>
      {children}
    </Link>
  );
}

// ─── Icons ────────────────────────────────────────────────────────────────────

const iconClass = 'w-5 h-5 flex-shrink-0';

function IconDashboard() {
  return (
    <svg className={iconClass} fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <rect x="3" y="3" width="7" height="7" rx="1" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" />
      <rect x="14" y="3" width="7" height="7" rx="1" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" />
      <rect x="3" y="14" width="7" height="7" rx="1" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" />
      <rect x="14" y="14" width="7" height="7" rx="1" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

function IconProfile() {
  return (
    <svg className={iconClass} fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
    </svg>
  );
}

function IconBook() {
  return (
    <svg className={iconClass} fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
    </svg>
  );
}

function IconClipboard() {
  return (
    <svg className={iconClass} fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
    </svg>
  );
}

function IconGradCap() {
  return (
    <svg className={iconClass} fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 14l9-5-9-5-9 5 9 5z" />
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 14l6.16-3.422A12.083 12.083 0 0121 13c0 5.523-4.477 10-10 10S1 18.523 1 13c0-.34.016-.678.048-1.013L12 14z" />
    </svg>
  );
}

function IconDoc() {
  return (
    <svg className={iconClass} fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
    </svg>
  );
}

function IconWallet() {
  return (
    <svg className={iconClass} fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" />
    </svg>
  );
}

function IconList() {
  return (
    <svg className={iconClass} fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01" />
    </svg>
  );
}

function IconAlert() {
  return (
    <svg className={iconClass} fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
    </svg>
  );
}

function IconChart() {
  return (
    <svg className={iconClass} fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
    </svg>
  );
}

function IconHelp() {
  return (
    <svg className={iconClass} fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
    </svg>
  );
}

function IconSettings() {
  return (
    <svg className={iconClass} fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
    </svg>
  );
}

function IconLogout() {
  return (
    <svg className={iconClass} fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
    </svg>
  );
}
