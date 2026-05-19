 'use client';

import { useState } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { supabase } from '@/lib/supabase';
import '../alumni.css';

const navItems = [
  { href: '/alumni/dashboard', label: 'Dashboard' },
  { href: '/alumni/dashboard/profile', label: 'Profile' },
  { href: '/alumni/dashboard/document-request', label: 'Document Request' },
  { href: '/alumni/dashboard/card-application', label: 'Card Application' },
  { href: '/alumni/dashboard/clearance-tracker', label: 'Clearance Tracker' },
];

export default function AlumniDashboardLayout({ children }: { children: React.ReactNode }) {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const pathname = usePathname();
  const router = useRouter();

  const handleSignOut = async () => {
    await supabase.auth.signOut();
    router.push('/login');
  };

  return (
    <div className="flex min-h-screen flex-col bg-slate-50 text-slate-900">
      {sidebarOpen && <div className="fixed inset-0 z-40 bg-black/30 lg:hidden" onClick={() => setSidebarOpen(false)} />}

      <aside className={`fixed inset-y-0 left-0 z-50 w-64 transform border-r bg-white transition-transform lg:translate-x-0 ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'}`}>
        <div className="flex h-16 items-center gap-3 border-b px-4">
          <div className="grid h-10 w-10 place-items-center rounded-xl bg-amber-500 text-lg font-black text-white">C</div>
          <div>
            <p className="text-sm font-black uppercase tracking-[0.2em] text-amber-500">Campus</p>
            <p className="text-xs text-slate-500">Alumni Portal</p>
          </div>
        </div>

        <nav className="space-y-1 p-3">
          {navItems.map((item) => {
            const isActive = pathname === item.href || pathname.startsWith(`${item.href}/`);
            return (
              <Link
                key={item.label}
                href={item.href}
                onClick={() => setSidebarOpen(false)}
                className={`flex items-center gap-3 rounded-xl px-3 py-2 text-sm font-semibold transition ${isActive ? 'bg-amber-500 text-white' : 'text-slate-600 hover:bg-slate-100'}`}
              >
                <span>{item.label}</span>
              </Link>
            );
          })}
        </nav>

        <div className="mt-auto border-t p-4">
          <button
            type="button"
            onClick={handleSignOut}
            className="w-full rounded-xl border border-slate-200 bg-white px-4 py-2 text-sm font-semibold text-slate-700 hover:bg-slate-50"
          >
            Sign out
          </button>
        </div>
      </aside>

      <div className="lg:pl-64">
        <header className="sticky top-0 z-30 border-b bg-white/90 backdrop-blur">
          <div className="flex h-16 items-center justify-between px-4 sm:px-6">
            <button
              type="button"
              className="rounded-lg border border-slate-200 px-3 py-2 text-sm font-semibold lg:hidden"
              onClick={() => setSidebarOpen((state) => !state)}
            >
              Menu
            </button>
            <div className="ml-auto flex items-center gap-3">
              <span className="rounded-full bg-slate-100 px-3 py-1 text-sm font-semibold text-slate-700">John Doe</span>
            </div>
          </div>
        </header>

        <main className="p-4 sm:p-6">{children}</main>
      </div>
    </div>
  );
}
