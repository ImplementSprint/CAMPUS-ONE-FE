'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';

type IconType = 'lock' | 'bell' | 'mail' | 'shield' | 'download' | 'user';

function SettingIcon({ type }: { type: IconType }) {
  if (type === 'lock') {
    return (
      <svg viewBox="0 0 24 24" aria-hidden="true" className="h-5 w-5 fill-none stroke-current stroke-[2.1] stroke-linecap-round stroke-linejoin-round">
        <rect x="5" y="10" width="14" height="10" rx="2" />
        <path d="M8 10V8a4 4 0 0 1 8 0v2" />
      </svg>
    );
  }

  if (type === 'bell') {
    return (
      <svg viewBox="0 0 24 24" aria-hidden="true" className="h-5 w-5 fill-none stroke-current stroke-[2.1] stroke-linecap-round stroke-linejoin-round">
        <path d="M8 9a4 4 0 1 1 8 0v3.2c0 .8.3 1.6.9 2.2l1 1.1H6.1l1-1.1c.6-.6.9-1.4.9-2.2V9" />
        <path d="M10 17a2 2 0 0 0 4 0" />
      </svg>
    );
  }

  if (type === 'mail') {
    return (
      <svg viewBox="0 0 24 24" aria-hidden="true" className="h-5 w-5 fill-none stroke-current stroke-[2.1] stroke-linecap-round stroke-linejoin-round">
        <rect x="4" y="6" width="16" height="12" rx="2" />
        <path d="m5 8 7 5 7-5" />
      </svg>
    );
  }

  if (type === 'shield') {
    return (
      <svg viewBox="0 0 24 24" aria-hidden="true" className="h-5 w-5 fill-none stroke-current stroke-[2.1] stroke-linecap-round stroke-linejoin-round">
        <path d="M12 3 5 6v5c0 4.4 2.7 8.5 7 10 4.3-1.5 7-5.6 7-10V6l-7-3Z" />
      </svg>
    );
  }

  if (type === 'user') {
    return (
      <svg viewBox="0 0 24 24" aria-hidden="true" className="h-5 w-5 fill-none stroke-current stroke-[2.1] stroke-linecap-round stroke-linejoin-round">
        <circle cx="12" cy="8" r="4" />
        <path d="M3 20c0-4 4-8 9-8s9 4 9 8" />
      </svg>
    );
  }

  return (
    <svg viewBox="0 0 24 24" aria-hidden="true" className="h-5 w-5 fill-none stroke-current stroke-[2.1] stroke-linecap-round stroke-linejoin-round">
      <path d="M12 4v9" />
      <path d="m8.5 10.5 3.5 3.5 3.5-3.5" />
      <path d="M5 18h14" />
    </svg>
  );
}

function SettingRow({
  icon,
  title,
  description,
  action,
}: {
  icon: IconType;
  title: string;
  description: string;
  action?: React.ReactNode;
}) {
  return (
    <div className="flex items-center justify-between rounded-[14px] px-0 py-1 text-left transition hover:bg-slate-50/40">
      <span className="flex items-center gap-3">
        <span className="grid h-10 w-10 place-items-center rounded-full bg-[#f6d978] text-[#8f6a00]">
          <SettingIcon type={icon} />
        </span>
        <span>
          <span className="block text-[16px] font-semibold text-slate-950">{title}</span>
          <span className="block text-[14px] font-normal text-[#58739b]">{description}</span>
        </span>
      </span>
      {action ?? <span className="pr-2 text-[#8ea0c1]">&gt;</span>}
    </div>
  );
}

function Toggle({ checked, onToggle, label }: { checked: boolean; onToggle: () => void; label: string }) {
  return (
    <button
      type="button"
      className={`setting-toggle ${checked ? 'on' : ''}`}
      role="switch"
      aria-checked={checked}
      aria-label={label}
      onClick={onToggle}
    >
      <span />
    </button>
  );
}

export function AdminSettingsPage() {
  const router = useRouter();
  const { user } = useAuth();
  const [pushNotifications, setPushNotifications] = useState(true);
  const [emailNotifications, setEmailNotifications] = useState(true);

  const handleLogOut = async () => {
    const { supabase } = await import('@/lib/supabase');
    await supabase.auth.signOut();
    router.push('/login');
  };

  return (
    <section className="resource-screen" aria-label="Admin Settings">
      <header className="screen-header">
        <div>
          <h1>Settings</h1>
          <p>Manage your admin account and preferences</p>
        </div>
      </header>

      <div className="screen-content space-y-4">
        {/* Account Section */}
        <section className="rounded-[16px] border border-slate-200 bg-white px-4 py-4 shadow-[0_1px_2px_rgba(15,23,42,0.02)] sm:px-5 sm:py-5">
          <h3 className="text-[18px] font-bold text-slate-950">Account</h3>
          <div className="mt-4 space-y-5">
            <div className="flex items-center justify-between rounded-[14px] px-0 py-3 text-left">
              <span className="flex items-center gap-3">
                <span className="grid h-10 w-10 place-items-center rounded-full bg-[#f6d978] text-[#8f6a00] font-bold">
                  AO
                </span>
                <span>
                  <span className="block text-[16px] font-semibold text-slate-950">Admin Email</span>
                  <span className="block text-[14px] font-normal text-[#58739b]">{user?.email || 'admin@example.com'}</span>
                </span>
              </span>
            </div>
            <SettingRow icon="lock" title="Change Password" description="Update your account password" />
          </div>
        </section>

        {/* Notifications Section */}
        <section className="rounded-[16px] border border-slate-200 bg-white px-4 py-4 shadow-[0_1px_2px_rgba(15,23,42,0.02)] sm:px-5 sm:py-5">
          <h3 className="text-[18px] font-bold text-slate-950">Notifications</h3>
          <div className="mt-4 space-y-5">
            <div className="flex items-center justify-between gap-4">
              <SettingRow icon="bell" title="Push Notifications" description="Receive admin alerts" />
              <Toggle checked={pushNotifications} onToggle={() => setPushNotifications((prev) => !prev)} label="Toggle push notifications" />
            </div>
            <div className="flex items-center justify-between gap-4">
              <SettingRow icon="mail" title="Email Notifications" description="Receive admin updates via email" />
              <Toggle checked={emailNotifications} onToggle={() => setEmailNotifications((prev) => !prev)} label="Toggle email notifications" />
            </div>
          </div>
        </section>

        {/* Privacy & Security Section */}
        <section className="rounded-[16px] border border-slate-200 bg-white px-4 py-4 shadow-[0_1px_2px_rgba(15,23,42,0.02)] sm:px-5 sm:py-5">
          <h3 className="text-[18px] font-bold text-slate-950">Privacy &amp; Security</h3>
          <div className="mt-4 space-y-5">
            <SettingRow icon="shield" title="Privacy Policy" description="View our privacy policy" />
            <SettingRow icon="shield" title="Terms &amp; Conditions" description="View terms of service" />
            <SettingRow icon="download" title="Download My Data" description="Export your personal data" />
          </div>
        </section>

        {/* Log Out Button */}
        <button
          onClick={handleLogOut}
          className="mt-1 h-10 w-full rounded-[12px] bg-[#bf6060] text-[15px] font-bold text-white shadow-[0_8px_20px_rgba(191,96,96,0.18)] transition hover:bg-[#b25353]"
          type="button"
        >
          Log Out
        </button>
      </div>
    </section>
  );
}
