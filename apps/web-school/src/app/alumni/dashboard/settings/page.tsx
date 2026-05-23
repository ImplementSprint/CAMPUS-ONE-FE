'use client';

import { useEffect, useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { ProtectedRoute } from '../../../components/ProtectedRoute';

type IconType = 'lock' | 'bell' | 'mail' | 'shield' | 'download';

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

function SettingsContent() {
  const { user } = useAuth();
  const [pushNotifications, setPushNotifications] = useState(true);
  const [emailNotifications, setEmailNotifications] = useState(true);

  const storageKey = user?.id ? `campus-one:alumni-settings:${user.id}` : null;

  useEffect(() => {
    if (!storageKey) return;
    const stored = window.localStorage.getItem(storageKey);
    if (!stored) return;
    try {
      const parsed = JSON.parse(stored) as { pushNotifications?: boolean; emailNotifications?: boolean };
      if (typeof parsed.pushNotifications === 'boolean') setPushNotifications(parsed.pushNotifications);
      if (typeof parsed.emailNotifications === 'boolean') setEmailNotifications(parsed.emailNotifications);
    } catch {
      window.localStorage.removeItem(storageKey);
    }
  }, [storageKey]);

  useEffect(() => {
    if (!storageKey) return;
    window.localStorage.setItem(
      storageKey,
      JSON.stringify({ pushNotifications, emailNotifications }),
    );
  }, [emailNotifications, pushNotifications, storageKey]);

  return (
    <section className="mx-auto w-full max-w-[1450px] rounded-[18px] border border-slate-200 bg-white px-5 py-5 shadow-[0_1px_2px_rgba(15,23,42,0.03),0_14px_34px_rgba(15,23,42,0.04)] sm:px-6 sm:py-6" aria-label="Settings">
      <header className="mb-8">
        <h2 className="text-[42px] font-black leading-none tracking-[-0.06em] text-slate-950">Settings</h2>
        <p className="mt-3 text-[18px] text-[#58739b]">Manage account notifications and privacy.</p>
      </header>

      <div className="space-y-4">
        <section className="rounded-[16px] border border-slate-200 bg-white px-4 py-4 shadow-[0_1px_2px_rgba(15,23,42,0.02)] sm:px-5 sm:py-5">
          <h3 className="text-[18px] font-bold text-slate-950">Account</h3>
          <div className="mt-4">
            <SettingRow icon="lock" title="Change Password" description="Update your account password" />
          </div>
        </section>

        <section className="rounded-[16px] border border-slate-200 bg-white px-4 py-4 shadow-[0_1px_2px_rgba(15,23,42,0.02)] sm:px-5 sm:py-5">
          <h3 className="text-[18px] font-bold text-slate-950">Notifications</h3>
          <div className="mt-4 space-y-5">
            <div className="flex items-center justify-between gap-4">
              <SettingRow icon="bell" title="Push Notifications" description="Receive app notifications" />
              <Toggle checked={pushNotifications} onToggle={() => setPushNotifications((prev) => !prev)} label="Toggle push notifications" />
            </div>
            <div className="flex items-center justify-between gap-4">
              <SettingRow icon="mail" title="Email Notifications" description="Receive updates via email" />
              <Toggle checked={emailNotifications} onToggle={() => setEmailNotifications((prev) => !prev)} label="Toggle email notifications" />
            </div>
          </div>
        </section>

        <section className="rounded-[16px] border border-slate-200 bg-white px-4 py-4 shadow-[0_1px_2px_rgba(15,23,42,0.02)] sm:px-5 sm:py-5">
          <h3 className="text-[18px] font-bold text-slate-950">Privacy &amp; Security</h3>
          <div className="mt-4 space-y-5">
            <SettingRow icon="shield" title="Privacy Policy" description="View our privacy policy" />
            <SettingRow icon="shield" title="Terms &amp; Conditions" description="View terms of service" />
            <SettingRow icon="download" title="Download My Data" description="Export your personal data" />
          </div>
        </section>

        <button
          className="mt-1 h-10 w-full rounded-[12px] bg-[#bf6060] text-[15px] font-bold text-white shadow-[0_8px_20px_rgba(191,96,96,0.18)] transition hover:bg-[#b25353]"
          type="button"
        >
          Log Out
        </button>
      </div>
    </section>
  );
}

export default function SettingsPage() {
  return (
    <ProtectedRoute allowedRoles={['alumni']}>
      <SettingsContent />
    </ProtectedRoute>
  );
}
