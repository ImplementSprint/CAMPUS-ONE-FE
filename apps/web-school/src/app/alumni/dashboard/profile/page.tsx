 'use client';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/lib/supabase';
import { ProtectedRoute } from '../../../components/ProtectedRoute';
import { getAlumniProfile, type AlumniProfile } from '../../services/alumni.service';

function SettingIcon({ type }: { type: 'lock' | 'bell' | 'mail' | 'shield' | 'download' }) {
  if (type === 'lock') return <svg viewBox="0 0 24 24" aria-hidden="true"><rect x="5" y="10" width="14" height="10" rx="2" /><path d="M8 10V8a4 4 0 0 1 8 0v2" /></svg>;
  if (type === 'bell') return <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M8 9a4 4 0 1 1 8 0v3.2c0 .8.3 1.6.9 2.2l1 1.1H6.1l1-1.1c.6-.6.9-1.4.9-2.2V9" /><path d="M10 17a2 2 0 0 0 4 0" /></svg>;
  if (type === 'mail') return <svg viewBox="0 0 24 24" aria-hidden="true"><rect x="4" y="6" width="16" height="12" rx="2" /><path d="m5 8 7 5 7-5" /></svg>;
  if (type === 'shield') return <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M12 3 5 6v5c0 4.4 2.7 8.5 7 10 4.3-1.5 7-5.6 7-10V6l-7-3Z" /></svg>;
  return <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M12 4v9" /><path d="m8.5 10.5 3.5 3.5 3.5-3.5" /><path d="M5 18h14" /></svg>;
}

function Toggle({ checked, onToggle, label }: { checked: boolean; onToggle: () => void; label: string }) {
  return (
    <button type="button" className={`setting-toggle ${checked ? 'on' : ''}`} role="switch" aria-checked={checked} aria-label={label} onClick={onToggle}>
      <span />
    </button>
  );
}

function ProfileContent() {
  const { user } = useAuth();
  const router = useRouter();
  const [profile, setProfile] = useState<AlumniProfile | null>(null);
  const [profileLoading, setProfileLoading] = useState(false);
  const [pushNotifications, setPushNotifications] = useState(true);
  const [emailNotifications, setEmailNotifications] = useState(true);

  useEffect(() => {
    if (!user?.id) return;
    setProfileLoading(true);
    getAlumniProfile(user.id).then((result) => {
      setProfile(result.data ?? null);
      setProfileLoading(false);
    });
  }, [user?.id]);

  const handleSignOut = async () => {
    await supabase.auth.signOut();
    router.push('/login');
  };

  return (
    <section className="profile-main-layout" aria-label="Profile settings">
      <aside className="section-card settings-card" aria-label="Alumni profile">
        <header>
          <h2>Alumni Profile</h2>
          <p>{profileLoading ? 'Loading alumni profile...' : profile?.full_name ?? user?.email ?? 'Alumni account'}</p>
        </header>

        <div className="settings-group">
          <h3>Academic Record</h3>
          <div className="setting-row">
            <span className="setting-copy"><strong>Program</strong><small>{profile?.program ?? 'Not available'}</small></span>
          </div>
          <div className="setting-row">
            <span className="setting-copy"><strong>Academic Unit</strong><small>{profile?.academic_unit ?? 'Not available'}</small></span>
          </div>
          <div className="setting-row">
            <span className="setting-copy"><strong>Graduation Year</strong><small>{profile?.graduation_year ?? 'Not available'}</small></span>
          </div>
          <div className="setting-row">
            <span className="setting-copy"><strong>Student ID</strong><small>{profile?.student_id ?? 'Not available'}</small></span>
          </div>
        </div>
      </aside>

      <aside className="section-card settings-card" aria-label="Notifications and privacy settings">
        <header>
          <h2>Settings</h2>
          <p>Manage account notifications and privacy. Signed in as <strong style={{ color: '#f5a623' }}>{user?.email}</strong></p>
        </header>

        <div className="settings-group">
          <h3>Account</h3>
          <a className="setting-row clickable" href="#">
            <span className="setting-icon-wrap"><SettingIcon type="lock" /></span>
            <span className="setting-copy"><strong>Change Password</strong><small>Update your account password</small></span>
            <span className="setting-chevron">&gt;</span>
          </a>
        </div>

        <div className="settings-group">
          <h3>Notifications</h3>
          <div className="setting-row">
            <span className="setting-icon-wrap"><SettingIcon type="bell" /></span>
            <span className="setting-copy"><strong>Push Notifications</strong><small>Receive app notifications</small></span>
            <Toggle checked={pushNotifications} onToggle={() => setPushNotifications((p) => !p)} label="Toggle push notifications" />
          </div>
          <div className="setting-row">
            <span className="setting-icon-wrap"><SettingIcon type="mail" /></span>
            <span className="setting-copy"><strong>Email Notifications</strong><small>Receive updates via email</small></span>
            <Toggle checked={emailNotifications} onToggle={() => setEmailNotifications((p) => !p)} label="Toggle email notifications" />
          </div>
        </div>

        <div className="settings-group">
          <h3>Privacy &amp; Security</h3>
          <a className="setting-row clickable" href="#">
            <span className="setting-icon-wrap"><SettingIcon type="shield" /></span>
            <span className="setting-copy"><strong>Privacy Policy</strong><small>View our privacy policy</small></span>
            <span className="setting-chevron">&gt;</span>
          </a>
          <a className="setting-row clickable" href="#">
            <span className="setting-icon-wrap"><SettingIcon type="shield" /></span>
            <span className="setting-copy"><strong>Terms &amp; Conditions</strong><small>View terms of service</small></span>
            <span className="setting-chevron">&gt;</span>
          </a>
          <a className="setting-row clickable" href="#">
            <span className="setting-icon-wrap"><SettingIcon type="download" /></span>
            <span className="setting-copy"><strong>Download My Data</strong><small>Export your personal data</small></span>
            <span className="setting-chevron">&gt;</span>
          </a>
        </div>

        <button className="signout-btn" type="button" onClick={handleSignOut}>
          Sign Out
        </button>
      </aside>
    </section>
  );
}

export default function ProfilePage() {
  return (
    <ProtectedRoute allowedRoles={['alumni']}>
      <ProfileContent />
    </ProtectedRoute>
  );
}
