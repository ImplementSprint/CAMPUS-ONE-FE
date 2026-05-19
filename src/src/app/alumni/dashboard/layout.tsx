'use client';
<<<<<<< HEAD

import { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import {
  BadgeCheck,
  Bell,
  ChevronDown,
  ClipboardList,
  CreditCard,
  FileText,
  IdCard,
  LayoutGrid,
  LogOut,
  Menu,
  Zap,
  Settings,
} from 'lucide-react';
=======
import { useState } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
>>>>>>> 57fc38d9ff45965d75ad134eebf190823cbbebfe
import { supabase } from '@/lib/supabase';
import '../alumni.css';

const navItems = [
<<<<<<< HEAD
  { href: '/alumni/dashboard', label: 'Overview', icon: LayoutGrid },
  { href: '/alumni/dashboard/my-requests', label: 'My Requests', icon: ClipboardList },
  { href: '/alumni/dashboard/billing-payments', label: 'Billing & Payments', icon: CreditCard },
  { href: '/alumni/dashboard/document-request', label: 'Document Request', icon: FileText },
  { href: '/alumni/dashboard/card-application', label: 'Card Application', icon: IdCard },
  { href: '/alumni/dashboard/clearance-tracker', label: 'Clearance Tracker', icon: BadgeCheck },
=======
  { href: '/alumni/dashboard', label: 'Dashboard' },
  { href: '/alumni/dashboard/profile', label: 'Profile' },
  { href: '/alumni/dashboard/document-request', label: 'Document Request' },
  { href: '/alumni/dashboard/card-application', label: 'Card Application' },
  { href: '/alumni/dashboard/clearance-tracker', label: 'Clearance Tracker' },
>>>>>>> 57fc38d9ff45965d75ad134eebf190823cbbebfe
];

export default function AlumniDashboardLayout({ children }: { children: React.ReactNode }) {
  const [sidebarOpen, setSidebarOpen] = useState(false);
<<<<<<< HEAD
  const [notificationsOpen, setNotificationsOpen] = useState(false);
  const pathname = usePathname();
  const router = useRouter();
  const displayName = 'John Doe';
  const initials = 'N';
  const isProfilePage = pathname === '/alumni/dashboard/profile';
  const isSettingsPage = pathname === '/alumni/dashboard/settings';
=======
  const pathname = usePathname();
  const router = useRouter();
>>>>>>> 57fc38d9ff45965d75ad134eebf190823cbbebfe

  const handleSignOut = async () => {
    await supabase.auth.signOut();
    router.push('/login');
  };

  return (
<<<<<<< HEAD
    <div className="min-h-screen bg-[#f4f6fb] text-slate-900 antialiased">
      {sidebarOpen && (
        <button
          type="button"
          className="fixed inset-0 z-40 bg-black/30 backdrop-blur-[1px] lg:hidden"
          aria-label="Close menu"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      <aside
        className={`fixed inset-y-0 left-0 z-50 flex w-[246px] flex-col border-r border-white/5 bg-[#050505] transition-transform duration-300 lg:translate-x-0 ${
          sidebarOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        <div className="flex h-[64px] items-center gap-3 border-b border-white/10 px-4">
          <div className="grid h-10 w-10 place-items-center overflow-hidden rounded-[10px] bg-white shadow-[0_1px_4px_rgba(0,0,0,0.18)]">
            <Image src="/logo.png" alt="Campus One" width={40} height={40} className="h-10 w-10 rounded-[10px] object-cover" priority />
          </div>
          <div className="leading-none">
            <div className="flex items-baseline gap-1">
              <span className="text-[15px] font-black tracking-tight text-[#d3a12e]">CAMPUS</span>
              <span className="text-[15px] font-semibold tracking-tight text-[#8a8f99]">Portal</span>
            </div>
          </div>
        </div>

        <nav className="flex-1 overflow-y-auto px-3 py-4">
          <div className="flex h-full flex-col">
            <div className="space-y-1.5">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isOverview = item.href === '/alumni/dashboard';
              const isActive = isOverview
                ? pathname === item.href
                : pathname === item.href || pathname.startsWith(`${item.href}/`);

              return (
                <Link
                  key={item.label}
                  href={item.href}
                  aria-current={isActive ? 'page' : undefined}
                  onClick={() => setSidebarOpen(false)}
                  className={`flex w-full items-center gap-3 rounded-[18px] px-4 py-3 text-left text-[15px] font-semibold transition-all ${
                    isActive
                      ? 'bg-[#1b1b1b] text-white shadow-[inset_0_0_0_1px_rgba(255,255,255,0.06)] hover:bg-[#232323] hover:text-white'
                      : 'text-[#9aa0ad] hover:bg-transparent hover:text-[#9aa0ad]'
                  }`}
                >
                  <Icon className="h-[18px] w-[18px] flex-shrink-0" />
                  <span>{item.label}</span>
                </Link>
              );
            })}
            </div>

            <div className="mt-auto pt-4">
            <button
              type="button"
              onClick={() => router.push('/alumni/dashboard/settings')}
              className={`flex w-full items-center gap-3 rounded-[18px] px-4 py-3 text-left text-[15px] font-semibold transition ${
                isSettingsPage ? 'bg-[#1b1b1b] text-white shadow-[inset_0_0_0_1px_rgba(255,255,255,0.06)]' : 'text-[#9aa0ad] hover:bg-white/5 hover:text-white'
              }`}
            >
              <Settings className="h-[18px] w-[18px] flex-shrink-0" />
              <span>Settings</span>
            </button>
            <button
              type="button"
              onClick={handleSignOut}
              className="mt-1 flex w-full items-center gap-3 rounded-[18px] px-4 py-3 text-left text-[15px] font-semibold text-[#db7b7b] transition hover:bg-white/5 hover:text-[#ff9b9b]"
            >
              <LogOut className="h-[18px] w-[18px] flex-shrink-0" />
              <span>Log Out</span>
            </button>
            </div>
          </div>
        </nav>

        <div className="p-3 pt-0">
          <button
            type="button"
            onClick={() => router.push('/alumni/dashboard/profile')}
            className={`relative flex w-full items-center gap-3 rounded-[22px] border px-3 py-2.5 text-left transition ${
              isProfilePage
                ? 'border-white/12 bg-[#141414] shadow-[inset_0_0_0_1px_rgba(255,255,255,0.05)]'
                : 'border-white/10 bg-[#111111] shadow-[inset_0_0_0_1px_rgba(255,255,255,0.04)] hover:bg-[#171717]'
            }`}
          >
            <span className="absolute -left-3 top-1/2 grid h-10 w-10 -translate-y-1/2 place-items-center rounded-full border border-white/10 bg-[#151515] text-white shadow-[0_10px_18px_rgba(0,0,0,0.28)]">
              <Zap className="h-4 w-4 text-white" />
            </span>

            <div className="grid h-11 w-11 shrink-0 place-items-center rounded-full border border-slate-600 bg-[#1b2230] text-[14px] font-bold text-white">
              {initials}
            </div>

            <div className="min-w-0 flex-1">
              <p className="truncate text-[14px] font-semibold text-white">{displayName}</p>
              <p className="text-[12px] text-sky-300">Alumni</p>
            </div>

            <ChevronDown className="h-4 w-4 shrink-0 text-slate-400" />
          </button>
        </div>
      </aside>

      <div className="min-h-screen lg:pl-[246px]">
        <header className="sticky top-0 z-30 flex h-[64px] items-center justify-between border-b border-slate-200/80 bg-[#f7f8fc]/95 px-4 backdrop-blur-sm sm:px-6 lg:px-8">
          <button
            type="button"
            className="inline-flex h-10 w-10 items-center justify-center rounded-2xl border border-slate-200 bg-white text-slate-700 shadow-[0_1px_2px_rgba(15,23,42,0.04)] transition hover:bg-slate-50 lg:hidden"
            aria-label="Toggle sidebar"
            onClick={() => setSidebarOpen((value) => !value)}
          >
            <Menu className="h-5 w-5" />
          </button>
          <div className="relative ml-auto flex items-center gap-2">
            <button
              type="button"
              className="relative grid h-10 w-10 place-items-center rounded-2xl border border-slate-200 bg-white text-slate-700 shadow-[0_1px_2px_rgba(15,23,42,0.04)] transition hover:bg-slate-50"
              aria-label="Notifications"
              onClick={() => setNotificationsOpen((value) => !value)}
            >
              <Bell className="h-4 w-4" />
              <span className="absolute -right-1 -top-1 grid h-5 min-w-5 place-items-center rounded-full bg-[#356dff] px-1 text-[11px] font-bold text-white shadow-sm">
                3
              </span>
            </button>

            {notificationsOpen && (
              <div className="absolute right-0 top-12 z-40 w-[430px] rounded-[20px] border border-slate-200 bg-white p-4 shadow-[0_24px_50px_rgba(15,23,42,0.14)]">
                <div className="mb-4">
                  <h3 className="text-[18px] font-black leading-none text-slate-950">Notifications</h3>
                  <p className="mt-2 text-[16px] text-[#58739b]">Recent updates from your portal.</p>
                </div>

                <div className="space-y-6">
                  {[
                    {
                      title: 'Profile update reminder',
                      desc: 'Review your contact details before the next verification cycle.',
                      time: '2 min ago',
                    },
                    {
                      title: 'Document request received',
                      desc: 'Your latest document request is now being processed.',
                      time: '1 hour ago',
                    },
                    {
                      title: 'Clearance tracker moved',
                      desc: 'Your clearance status changed to In Review.',
                      time: 'Yesterday',
                    },
                  ].map((item) => (
                    <div key={item.title} className="flex gap-3">
                      <span className="mt-1 grid h-4 w-4 shrink-0 place-items-center rounded-full bg-[#f6d978] ring-4 ring-[#fff9e7]">
                        <span className="h-2.5 w-2.5 rounded-full bg-[#f4ae2d]" />
                      </span>
                      <div>
                        <h4 className="text-[16px] font-black leading-none text-slate-950">{item.title}</h4>
                        <p className="mt-2 text-[15px] leading-[1.45] text-[#58739b]">{item.desc}</p>
                        <p className="mt-2 text-[14px] text-[#7386a7]">{item.time}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </header>
        <main className="px-4 py-8 sm:px-6 lg:px-8">{children}</main>
      </div>
    </div>
  );
}
=======
    <div className="alumni-shell">
      {/* Sidebar */}
      <aside className={`alumni-sidebar ${sidebarOpen ? 'open' : ''}`}>
        <div className="alumni-sidebar-header">
          <p>CAMPUS ONE</p>
          <small>Office of Alumni Relations</small>
        </div>
        <nav className="alumni-sidebar-nav">
          {navItems.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className={pathname === item.href ? 'active' : ''}
              onClick={() => setSidebarOpen(false)}
            >
              {item.label}
            </Link>
          ))}
        </nav>
      </aside>

      {/* Scrim */}
      {sidebarOpen && (
        <button className="alumni-scrim" onClick={() => setSidebarOpen(false)} aria-label="Close menu" />
      )}

      {/* Main content */}
      <div className="alumni-content">
        <header className="alumni-top-bar">
          <button
            className="alumni-menu-btn"
            onClick={() => setSidebarOpen((o) => !o)}
            aria-label="Toggle menu"
          >
            <span /><span /><span />
          </button>
          <div className="alumni-top-bar-center">
            <h1>DASHBOARD</h1>
            <p>Alumni Portal</p>
          </div>
          <button
            onClick={handleSignOut}
            style={{ background: 'transparent', border: '1px solid rgba(255,255,255,0.15)', borderRadius: 8, color: '#fff', padding: '6px 12px', cursor: 'pointer', fontSize: '0.8rem' }}
          >
            Sign Out
          </button>
        </header>
        <main className="alumni-main">{children}</main>
      </div>
    </div>
  );
}
>>>>>>> 57fc38d9ff45965d75ad134eebf190823cbbebfe
