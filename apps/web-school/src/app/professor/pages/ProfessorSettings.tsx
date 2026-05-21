'use client'
import { useState } from 'react';
import { User, Lock, Bell, Mail, Moon, LogOut, ChevronRight } from 'lucide-react';

export function ProfessorSettings() {
  const [notifications, setNotifications] = useState(true);
  const [emailAlerts, setEmailAlerts] = useState(false);
  const [darkMode, setDarkMode] = useState(false);

  return (
    <div className="mx-auto w-full max-w-2xl space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Settings</h1>
        <p className="text-sm text-gray-500 mt-1">Manage your account preferences</p>
      </div>

      {/* Profile Settings */}
      <div className="space-y-3">
        <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider px-1">Profile Settings</p>
        <div className="bg-white rounded-2xl border border-gray-100 divide-y divide-gray-100">
          <button className="w-full flex items-center gap-4 px-6 py-4 hover:bg-gray-50 transition-colors">
            <div className="w-10 h-10 rounded-xl bg-gray-100 flex items-center justify-center flex-shrink-0">
              <User className="w-5 h-5 text-gray-600" />
            </div>
            <span className="flex-1 text-sm font-medium text-gray-900 text-left">Edit Personal Information</span>
            <ChevronRight className="w-4 h-4 text-gray-400" />
          </button>
          <button className="w-full flex items-center gap-4 px-6 py-4 hover:bg-gray-50 transition-colors">
            <div className="w-10 h-10 rounded-xl bg-gray-100 flex items-center justify-center flex-shrink-0">
              <Lock className="w-5 h-5 text-gray-600" />
            </div>
            <span className="flex-1 text-sm font-medium text-gray-900 text-left">Change Password</span>
            <ChevronRight className="w-4 h-4 text-gray-400" />
          </button>
        </div>
      </div>

      {/* Preferences */}
      <div className="space-y-3">
        <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider px-1">Preferences</p>
        <div className="bg-white rounded-2xl border border-gray-100 divide-y divide-gray-100">
          {[
            { icon: Bell, label: 'Push Notifications', sub: 'Receive alerts on your device', value: notifications, setter: setNotifications },
            { icon: Mail, label: 'Email Alerts', sub: 'Receive daily summaries', value: emailAlerts, setter: setEmailAlerts },
            { icon: Moon, label: 'Dark Mode', sub: 'Switch to dark theme', value: darkMode, setter: setDarkMode },
          ].map(({ icon: Icon, label, sub, value, setter }) => (
            <div key={label} className="flex items-center gap-4 px-6 py-4">
              <div className="w-10 h-10 rounded-xl bg-gray-100 flex items-center justify-center flex-shrink-0">
                <Icon className="w-5 h-5 text-gray-600" />
              </div>
              <div className="flex-1">
                <p className="text-sm font-medium text-gray-900">{label}</p>
                <p className="text-xs text-gray-500 mt-0.5">{sub}</p>
              </div>
              <button
                onClick={() => setter(!value)}
                className={`relative w-12 h-6 rounded-full transition-colors flex-shrink-0 ${value ? 'bg-[#F59E0B]' : 'bg-gray-300'}`}
              >
                <span className={`absolute top-0.5 left-0.5 w-5 h-5 bg-white rounded-full shadow transition-transform ${value ? 'translate-x-6' : 'translate-x-0'}`} />
              </button>
            </div>
          ))}
        </div>
      </div>

      {/* Security */}
      <div className="space-y-3">
        <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider px-1">Security</p>
        <div className="bg-white rounded-2xl border border-gray-100">
          <button className="w-full flex items-center gap-4 px-6 py-4 hover:bg-red-50 transition-colors rounded-2xl">
            <div className="w-10 h-10 rounded-xl bg-red-100 flex items-center justify-center flex-shrink-0">
              <LogOut className="w-5 h-5 text-red-500" />
            </div>
            <span className="flex-1 text-sm font-medium text-red-500 text-left">Sign Out Everywhere</span>
          </button>
        </div>
      </div>
    </div>
  );
}
