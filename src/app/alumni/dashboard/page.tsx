'use client';

import Link from 'next/link';
import { useAuth } from '@/contexts/AuthContext';
import { ProtectedRoute } from '../../components/ProtectedRoute';
import { BadgeCheck, CalendarDays, ChevronRight, Folder, FolderDown, ShieldCheck } from 'lucide-react';

const stats = [
  { value: '2', label: 'Active applications', action: 'View all', icon: Folder, iconWrap: 'bg-[#efe9ff] text-[#8a63ff]' },
  { value: '1', label: 'Pending payments', action: 'View invoice', icon: CalendarDays, iconWrap: 'bg-[#e7efff] text-[#4b79ff]' },
  { value: '1', label: 'Items for pickup', action: 'Arrange pickup', icon: FolderDown, iconWrap: 'bg-[#fff1db] text-[#f59e0b]' },
  { value: '3', label: 'Completed requests', action: 'View history', icon: ShieldCheck, iconWrap: 'bg-[#e3f5e8] text-[#16a34a]' },
] as const;

const requests = [
  { title: 'Alumni Card Application', type: 'Alumni Card', status: 'Processing' },
  { title: 'Diploma Copy Request', type: 'Document Request', status: 'Under Verification' },
  { title: 'Background Clearance', type: 'Clearance', status: 'Shipped' },
] as const;

const sideCards = [
  { title: 'Request documents', description: 'Order transcripts, diplomas, or other documents.', icon: Folder, href: '/alumni/dashboard/document-request' },
  { title: 'Apply for alumni card', description: 'Get your official alumni identification card.', icon: BadgeCheck, href: '/alumni/dashboard/card-application' },
  { title: 'View clearance status', description: 'Check the status of background clearance requests.', icon: ChevronRight, href: '/alumni/dashboard/clearance-tracker' },
] as const;

function StatCard({ value, label, action, icon: Icon, iconWrap }: { value: string; label: string; action: string; icon: any; iconWrap: string; }) {
  return (
    <article className="flex min-h-[126px] flex-col rounded-[18px] border border-slate-200/70 bg-white px-5 py-5 shadow-[0_1px_2px_rgba(15,23,42,0.03),0_10px_26px_rgba(15,23,42,0.04)]">
      <div className="flex items-start gap-4">
        <div className={`grid h-11 w-11 place-items-center rounded-2xl ${iconWrap}`}>
          <Icon className="h-[19px] w-[19px]" />
        </div>
        <div>
          <div className="text-[34px] font-semibold leading-none tracking-[-0.05em] text-slate-950">{value}</div>
          <div className="mt-2 text-[14px] font-medium leading-[1.15] text-slate-600">{label}</div>
        </div>
      </div>
      <div className="mt-auto flex items-center justify-between pt-4">
        <span className="text-[16px] font-medium leading-tight text-[#356dff]">{action}</span>
        <ChevronRight className="h-4 w-4 shrink-0 text-slate-400" />
      </div>
    </article>
  );
}

function DashboardContent() {
  const { user } = useAuth();
  const displayName = user?.user_metadata?.full_name || user?.email || 'Alumni';
  const initials = displayName.slice(0, 2).toUpperCase();

  return (
    <section className="dashboard-screen">
      <div className="dashboard-grid">
        <section className="dashboard-panel panel-hero">
          <div className="hero-banner">
            <h2>Hello, {displayName.split(' ')[0]}!</h2>
            <p>Welcome to your alumni dashboard. Access your services and track your activities.</p>
          </div>
        </section>

        <section className="dashboard-panel panel-overview">
          <h3 className="section-head">Overview</h3>
          <div className="overview-grid">
            <article className="mini-stat"><span>Member Since</span><strong>2024</strong></article>
            <article className="mini-stat"><span>Services Used</span><strong>0</strong></article>
            <article className="mini-stat"><span>Alumni Network</span><strong>5,420</strong></article>
            <article className="mini-stat"><span>Profile Status</span><strong>Active</strong></article>
          </div>
        </section>

        <section className="dashboard-panel panel-actions">
          <h3 className="section-head">Quick Actions</h3>
          <div className="quick-stack">
            <Link className="quick-yellow" href="/alumni/dashboard/card-application">
              <strong>Apply for Alumni Card</strong>
              <span>Get your official alumni identification</span>
            </Link>
            <Link className="quick-dark" href="/alumni/dashboard/document-request">
              <strong>Request Documents</strong>
              <span>Order official transcripts and certificates</span>
            </Link>
            <Link className="quick-dark" href="/alumni/dashboard/clearance-tracker">
              <strong>Track Clearance Routing</strong>
              <span>Monitor Library, Finance, Dean, and Labs sign-offs</span>
            </Link>
          </div>
        </section>

        <section className="dashboard-panel panel-profile">
          <h3 className="section-head">Profile</h3>
          <article className="profile-box">
            <div className="avatar-web">{initials}</div>
            <div>
              <strong>{displayName}</strong>
              <p>{user?.email}</p>
            </div>
            <Link className="ghost-btn" href="/alumni/dashboard/profile">
              View Full Profile
            </Link>
          </article>
        </section>

        <section className="dashboard-panel panel-activity">
          <h3 className="section-head">Recent Activity</h3>
          <ul className="status-list activity-list">
            <li>Account created and verified.</li>
            <li>Profile information updated.</li>
            <li>No pending payment holds.</li>
            <li>Eligible for card application processing.</li>
          </ul>
        </section>
      </div>
    </section>
  );
}

export default function AlumniDashboardPage() {
  return (
    <ProtectedRoute allowedRoles={['alumni']}>
      <DashboardContent />
    </ProtectedRoute>
  );
}
