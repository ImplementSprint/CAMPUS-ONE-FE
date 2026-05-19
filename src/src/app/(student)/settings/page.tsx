'use client';
import { useState } from 'react';
<<<<<<< HEAD
import { useRouter } from 'next/navigation';
import { supabase } from '@/lib/supabase';
import DashboardLayout from '@/components/DashboardLayout';

function SettingIcon({ type }: { type: 'lock' | 'bell' | 'mail' | 'shield' | 'download' }) {
  if (type === 'lock') return <svg viewBox="0 0 24 24" aria-hidden="true" className="h-[14px] w-[14px]"><rect x="5" y="10" width="14" height="10" rx="2" fill="none" stroke="currentColor" strokeWidth="1.8" /><path d="M8 10V8a4 4 0 0 1 8 0v2" fill="none" stroke="currentColor" strokeWidth="1.8" /></svg>;
  if (type === 'bell') return <svg viewBox="0 0 24 24" aria-hidden="true" className="h-[14px] w-[14px]"><path d="M8 9a4 4 0 1 1 8 0v3.2c0 .8.3 1.6.9 2.2l1 1.1H6.1l1-1.1c.6-.6.9-1.4.9-2.2V9" fill="none" stroke="currentColor" strokeWidth="1.8" /><path d="M10 17a2 2 0 0 0 4 0" fill="none" stroke="currentColor" strokeWidth="1.8" /></svg>;
  if (type === 'mail') return <svg viewBox="0 0 24 24" aria-hidden="true" className="h-[14px] w-[14px]"><rect x="4" y="6" width="16" height="12" rx="2" fill="none" stroke="currentColor" strokeWidth="1.8" /><path d="m5 8 7 5 7-5" fill="none" stroke="currentColor" strokeWidth="1.8" /></svg>;
  if (type === 'shield') return <svg viewBox="0 0 24 24" aria-hidden="true" className="h-[14px] w-[14px]"><path d="M12 3 5 6v5c0 4.4 2.7 8.5 7 10 4.3-1.5 7-5.6 7-10V6l-7-3Z" fill="none" stroke="currentColor" strokeWidth="1.8" /></svg>;
  return <svg viewBox="0 0 24 24" aria-hidden="true" className="h-[14px] w-[14px]"><path d="M12 4v9" fill="none" stroke="currentColor" strokeWidth="1.8" /><path d="m8.5 10.5 3.5 3.5 3.5-3.5" fill="none" stroke="currentColor" strokeWidth="1.8" /><path d="M5 18h14" fill="none" stroke="currentColor" strokeWidth="1.8" /></svg>;
}

function Toggle({ checked, onToggle, label }: { checked: boolean; onToggle: () => void; label: string }) {
  return (
    <button
      type="button"
      className={`relative h-6 w-11 rounded-full transition-colors ${checked ? 'bg-amber-500' : 'bg-slate-300'}`}
      role="switch"
      aria-checked={checked}
      aria-label={label}
      onClick={onToggle}
    >
      <span
        className={`absolute top-0.5 h-5 w-5 rounded-full bg-white shadow transition-transform ${checked ? 'translate-x-5' : 'translate-x-0.5'}`}
      />
    </button>
  );
}

export default function SettingsPage() {
  const router = useRouter();
  const [pushNotifications, setPushNotifications] = useState(true);
  const [emailNotifications, setEmailNotifications] = useState(true);

  const handleSignOut = async () => {
    await supabase.auth.signOut();
    router.push('/login');
=======
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/lib/supabase';
import DashboardLayout from '@/components/DashboardLayout';

const settingItems = [
  { icon: '🔔', title: 'Notifications', desc: 'Manage notification preferences' },
  { icon: '🔒', title: 'Privacy & Security', desc: 'Change password and security settings' },
  { icon: '🌐', title: 'Language', desc: 'English (US)' },
  { icon: '🌙', title: 'Dark Mode', desc: 'Toggle dark mode' },
];

export default function SettingsPage() {
  const { user } = useAuth();
  const email = user?.email ?? '';
  const [newPw, setNewPw] = useState('');
  const [confirmPw, setConfirmPw] = useState('');
  const [saving, setSaving] = useState(false);
  const [msg, setMsg] = useState('');

  const handleChangePassword = async (e: React.FormEvent) => {
    e.preventDefault();
    if (newPw !== confirmPw) { setMsg('Passwords do not match.'); return; }
    if (newPw.length < 6) { setMsg('Password must be at least 6 characters.'); return; }
    setSaving(true);
    const { error } = await supabase.auth.updateUser({ password: newPw });
    setSaving(false);
    setMsg(error ? error.message : 'Password updated successfully.');
    if (!error) { setNewPw(''); setConfirmPw(''); }
>>>>>>> 57fc38d9ff45965d75ad134eebf190823cbbebfe
  };

  return (
    <DashboardLayout>
<<<<<<< HEAD
      <section className="w-full px-4 py-6 sm:px-6 lg:px-8" aria-label="Settings">
        <div className="mx-auto w-full rounded-2xl border border-slate-200 bg-white p-6 sm:p-7">
          <header>
            <h1 className="text-[2rem] font-black leading-none tracking-tight text-[#0b1a3a]">Settings</h1>
            <p className="mt-3 text-base text-slate-500">Manage account notifications and privacy.</p>
          </header>

          <div className="mt-6 space-y-3.5">
            <section className="rounded-2xl border border-slate-200 bg-[#fbfcff] p-4">
              <h2 className="mb-3 text-[1.15rem] font-extrabold tracking-tight text-[#0f2043]">Account</h2>
              <a className="flex items-center gap-3 rounded-xl px-2 py-2 hover:bg-slate-50" href="#">
                <span className="grid h-8 w-8 place-items-center rounded-full bg-[#f4d870] text-[#6f5600]">
                  <SettingIcon type="lock" />
                </span>
                <span className="flex-1">
                  <span className="block text-[1.05rem] font-extrabold leading-tight text-[#0c1d3d]">Change Password</span>
                  <span className="block text-[0.86rem] text-slate-500">Update your account password</span>
                </span>
                <span className="text-[1.15rem] text-slate-400">&gt;</span>
              </a>
            </section>

            <section className="rounded-2xl border border-slate-200 bg-[#fbfcff] p-4">
              <h2 className="mb-3 text-[1.15rem] font-extrabold tracking-tight text-[#0f2043]">Notifications</h2>

              <div className="flex items-center gap-3 px-2 py-2">
                <span className="grid h-8 w-8 place-items-center rounded-full bg-[#f4d870] text-[#6f5600]">
                  <SettingIcon type="bell" />
                </span>
                <span className="flex-1">
                  <span className="block text-[1.05rem] font-extrabold leading-tight text-[#0c1d3d]">Push Notifications</span>
                  <span className="block text-[0.86rem] text-slate-500">Receive app notifications</span>
                </span>
                <Toggle checked={pushNotifications} onToggle={() => setPushNotifications((state) => !state)} label="Toggle push notifications" />
              </div>

              <div className="flex items-center gap-3 px-2 py-2">
                <span className="grid h-8 w-8 place-items-center rounded-full bg-[#f4d870] text-[#6f5600]">
                  <SettingIcon type="mail" />
                </span>
                <span className="flex-1">
                  <span className="block text-[1.05rem] font-extrabold leading-tight text-[#0c1d3d]">Email Notifications</span>
                  <span className="block text-[0.86rem] text-slate-500">Receive updates via email</span>
                </span>
                <Toggle checked={emailNotifications} onToggle={() => setEmailNotifications((state) => !state)} label="Toggle email notifications" />
              </div>
            </section>

            <section className="rounded-2xl border border-slate-200 bg-[#fbfcff] p-4">
              <h2 className="mb-3 text-[1.15rem] font-extrabold tracking-tight text-[#0f2043]">Privacy &amp; Security</h2>

              <a className="flex items-center gap-3 rounded-xl px-2 py-2 hover:bg-slate-50" href="#">
                <span className="grid h-8 w-8 place-items-center rounded-full bg-[#f4d870] text-[#6f5600]">
                  <SettingIcon type="shield" />
                </span>
                <span className="flex-1">
                  <span className="block text-[1.05rem] font-extrabold leading-tight text-[#0c1d3d]">Privacy Policy</span>
                  <span className="block text-[0.86rem] text-slate-500">View our privacy policy</span>
                </span>
                <span className="text-[1.15rem] text-slate-400">&gt;</span>
              </a>

              <a className="flex items-center gap-3 rounded-xl px-2 py-2 hover:bg-slate-50" href="#">
                <span className="grid h-8 w-8 place-items-center rounded-full bg-[#f4d870] text-[#6f5600]">
                  <SettingIcon type="shield" />
                </span>
                <span className="flex-1">
                  <span className="block text-[1.05rem] font-extrabold leading-tight text-[#0c1d3d]">Terms &amp; Conditions</span>
                  <span className="block text-[0.86rem] text-slate-500">View terms of service</span>
                </span>
                <span className="text-[1.15rem] text-slate-400">&gt;</span>
              </a>

              <a className="flex items-center gap-3 rounded-xl px-2 py-2 hover:bg-slate-50" href="#">
                <span className="grid h-8 w-8 place-items-center rounded-full bg-[#f4d870] text-[#6f5600]">
                  <SettingIcon type="download" />
                </span>
                <span className="flex-1">
                  <span className="block text-[1.05rem] font-extrabold leading-tight text-[#0c1d3d]">Download My Data</span>
                  <span className="block text-[0.86rem] text-slate-500">Export your personal data</span>
                </span>
                <span className="text-[1.15rem] text-slate-400">&gt;</span>
              </a>
            </section>

            <button
              type="button"
              onClick={handleSignOut}
              className="mt-2 w-full rounded-xl bg-[#cf6464] py-2.5 text-base font-bold text-white transition hover:bg-[#bb5656]"
            >
              Log Out
            </button>
          </div>
        </div>
      </section>
=======
      <div className="p-6 w-full space-y-5">
        <h1 className="text-xl font-black text-gray-900">Settings</h1>

        {/* Account */}
        <div className="bg-white rounded-2xl border border-gray-200 p-5">
          <p className="font-semibold text-gray-900 mb-4">Account Information</p>
          <div className="flex items-center gap-4 p-4 bg-gray-50 rounded-xl">
            <div className="w-12 h-12 rounded-full bg-amber-500 flex items-center justify-center text-white font-black text-lg">
              {email.charAt(0).toUpperCase()}
            </div>
            <div>
              <p className="font-semibold text-gray-900 text-sm">{email}</p>
              <p className="text-xs text-gray-400 mt-0.5">Student Account</p>
            </div>
          </div>
        </div>

        {/* Settings items */}
        <div className="bg-white rounded-2xl border border-gray-200 p-5 space-y-2">
          {settingItems.map(item => (
            <div key={item.title} className="flex items-center gap-4 border border-gray-100 rounded-xl p-4 hover:bg-gray-50 transition cursor-pointer">
              <div className="w-10 h-10 bg-gray-100 rounded-xl flex items-center justify-center text-lg">{item.icon}</div>
              <div className="flex-1">
                <p className="font-semibold text-gray-900 text-sm">{item.title}</p>
                <p className="text-xs text-gray-500 mt-0.5">{item.desc}</p>
              </div>
              <span className="text-gray-300">›</span>
            </div>
          ))}
        </div>

        {/* Change password */}
        <div className="bg-white rounded-2xl border border-gray-200 p-5">
          <p className="font-semibold text-gray-900 mb-4">Change Password</p>
          <form onSubmit={handleChangePassword} className="space-y-4">
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1.5">New Password</label>
              <input type="password" value={newPw} onChange={e => setNewPw(e.target.value)} required placeholder="••••••••"
                className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-amber-400" />
            </div>
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1.5">Confirm New Password</label>
              <input type="password" value={confirmPw} onChange={e => setConfirmPw(e.target.value)} required placeholder="••••••••"
                className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-amber-400" />
            </div>
            {msg && <p className={`text-sm font-medium ${msg.includes('success') ? 'text-green-600' : 'text-red-500'}`}>{msg}</p>}
            <button type="submit" disabled={saving}
              className="w-full bg-amber-500 hover:bg-amber-600 text-white font-semibold py-3 rounded-xl transition disabled:opacity-60 text-sm">
              {saving ? 'Saving...' : 'Update Password'}
            </button>
          </form>
        </div>
      </div>
>>>>>>> 57fc38d9ff45965d75ad134eebf190823cbbebfe
    </DashboardLayout>
  );
}
