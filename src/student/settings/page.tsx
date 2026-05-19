'use client';
import { useState } from 'react';
import { useAuth } from '@/shared/contexts/AuthContext';
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
    </DashboardLayout>
  );
}
