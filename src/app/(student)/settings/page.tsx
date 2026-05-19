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
 'use client';
import { useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/shared/lib/supabase';
import DashboardLayout from '@/shared/components/DashboardLayout';

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
  };

  return (
    <DashboardLayout>
      <div className="p-6 w-full space-y-5">
        <h1 className="text-xl font-black text-gray-900">Settings</h1>

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
    </DashboardLayout>
  );
}
                </span>
