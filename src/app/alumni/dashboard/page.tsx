'use client';
import Link from 'next/link';
import { useAuth } from '@/contexts/AuthContext';
import { ProtectedRoute } from '../../components/ProtectedRoute';

function DashboardContent() {
  const { user } = useAuth();
  const displayName = user?.user_metadata?.full_name || user?.email || 'Alumni';
  const initials = displayName.slice(0, 2).toUpperCase();

  return (
    <section className="dashboard-screen">
      <div className="dashboard-grid">
        {/* Hero */}
        <section className="dashboard-panel panel-hero">
          <div className="hero-banner">
            <h2>Hello, {displayName.split(' ')[0]}!</h2>
            <p>Welcome to your alumni dashboard. Access your services and track your activities.</p>
          </div>
        </section>

        {/* Overview */}
        <section className="dashboard-panel panel-overview">
          <h3 className="section-head">Overview</h3>
          <div className="overview-grid">
            <article className="mini-stat"><span>Member Since</span><strong>2024</strong></article>
            <article className="mini-stat"><span>Services Used</span><strong>0</strong></article>
            <article className="mini-stat"><span>Alumni Network</span><strong>5,420</strong></article>
            <article className="mini-stat"><span>Profile Status</span><strong>Active</strong></article>
          </div>
        </section>

        {/* Quick Actions */}
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

        {/* Profile */}
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

        {/* Activity */}
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
