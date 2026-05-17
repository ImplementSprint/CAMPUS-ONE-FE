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

