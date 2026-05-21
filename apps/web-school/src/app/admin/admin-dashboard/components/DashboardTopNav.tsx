'use client'

import { useState } from 'react'
import { Bell, Search, Menu, ChevronDown, User, LogOut, Settings, X } from 'lucide-react'

interface TopNavProps {
  onMenuClick: () => void
  activeItem: string
}

const pageLabels: Record<string, string> = {
  dashboard: 'Dashboard',
  students: 'Students',
  professors: 'Professors',
  courses: 'Courses',
  schedules: 'Schedules',
  grades: 'Grades',
  announcements: 'Announcements',
  settings: 'Settings',
}

const notifications = [
  { id: 1, text: 'New student enrollment request', time: '2m ago', unread: true },
  { id: 2, text: 'Grade submission deadline today', time: '1h ago', unread: true },
  { id: 3, text: 'Prof. Reyes submitted grades for MATH 301', time: '3h ago', unread: false },
  { id: 4, text: 'System maintenance scheduled for Sunday', time: '1d ago', unread: false },
]

export function DashboardTopNav({ onMenuClick, activeItem }: TopNavProps) {
  const [showProfile, setShowProfile] = useState(false)
  const [showNotifications, setShowNotifications] = useState(false)

  const unreadCount = notifications.filter((n) => n.unread).length

  const closeAll = () => {
    setShowProfile(false)
    setShowNotifications(false)
  }

  return (
    <header className="h-16 bg-white border-b border-gray-100 flex items-center justify-between px-4 md:px-6 flex-shrink-0 sticky top-0 z-30 shadow-sm">
      {/* Left */}
      <div className="flex items-center gap-3 md:gap-4">
        <button
          onClick={onMenuClick}
          className="lg:hidden w-9 h-9 flex items-center justify-center rounded-xl hover:bg-gray-100 transition-colors text-gray-600"
        >
          <Menu className="w-5 h-5" />
        </button>
        <div>
          <h1 className="text-base font-bold text-gray-900 leading-tight">
            {pageLabels[activeItem] ?? 'Dashboard'}
          </h1>
          <p className="text-[11px] text-gray-400 hidden sm:block">
            Academic Year 2024–2025 &bull; Semester 2
          </p>
        </div>
      </div>

      {/* Right */}
      <div className="flex items-center gap-1.5 md:gap-2">
        {/* Search */}
        <div className="hidden md:flex items-center gap-2 bg-gray-50 border border-gray-200 rounded-xl px-3 py-2 w-44 lg:w-60 focus-within:border-[#F59E0B] focus-within:bg-white transition-colors">
          <Search className="w-3.5 h-3.5 text-gray-400 flex-shrink-0" />
          <input
            type="text"
            placeholder="Search anything..."
            className="bg-transparent text-sm text-gray-700 placeholder-gray-400 outline-none w-full"
          />
        </div>

        {/* Mobile search icon */}
        <button className="md:hidden w-9 h-9 flex items-center justify-center rounded-xl hover:bg-gray-100 transition-colors text-gray-500">
          <Search className="w-4 h-4" />
        </button>

        {/* Notifications */}
        <div className="relative">
          <button
            onClick={() => {
              setShowNotifications((p) => !p)
              setShowProfile(false)
            }}
            className="w-9 h-9 flex items-center justify-center rounded-xl hover:bg-gray-100 transition-colors relative text-gray-500 hover:text-gray-800"
          >
            <Bell className="w-4 h-4" />
            {unreadCount > 0 && (
              <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-[#F59E0B] rounded-full border-2 border-white" />
            )}
          </button>

          {showNotifications && (
            <>
              <div className="fixed inset-0 z-40" onClick={closeAll} />
              <div className="absolute right-0 top-12 w-80 bg-white rounded-2xl shadow-2xl border border-gray-100 z-50 overflow-hidden">
                <div className="px-4 py-3 border-b border-gray-100 flex items-center justify-between">
                  <span className="font-bold text-sm text-gray-900">Notifications</span>
                  <div className="flex items-center gap-2">
                    <span className="text-[10px] bg-[#F59E0B] text-black font-bold px-2 py-0.5 rounded-full">
                      {unreadCount} new
                    </span>
                    <button onClick={closeAll} className="text-gray-400 hover:text-gray-600">
                      <X className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
                {notifications.map((n) => (
                  <div
                    key={n.id}
                    className={`px-4 py-3 border-b border-gray-50 hover:bg-gray-50 cursor-pointer transition-colors ${
                      n.unread ? 'bg-amber-50/40' : ''
                    }`}
                  >
                    <div className="flex items-start gap-2.5">
                      <div
                        className={`w-2 h-2 rounded-full mt-1.5 flex-shrink-0 ${
                          n.unread ? 'bg-[#F59E0B]' : 'bg-gray-200'
                        }`}
                      />
                      <div className="min-w-0">
                        <p className="text-xs font-medium text-gray-800 leading-snug">{n.text}</p>
                        <p className="text-[10px] text-gray-400 mt-0.5">{n.time}</p>
                      </div>
                    </div>
                  </div>
                ))}
                <div className="px-4 py-2.5 text-center">
                  <button className="text-xs text-[#F59E0B] font-semibold hover:underline">
                    View all notifications
                  </button>
                </div>
              </div>
            </>
          )}
        </div>

        {/* Divider */}
        <div className="w-px h-6 bg-gray-200 hidden sm:block" />

        {/* Profile */}
        <div className="relative">
          <button
            onClick={() => {
              setShowProfile((p) => !p)
              setShowNotifications(false)
            }}
            className="flex items-center gap-2 rounded-xl hover:bg-gray-100 transition-colors pl-1 pr-2 py-1.5"
          >
            <div className="w-7 h-7 rounded-full bg-gradient-to-br from-[#F59E0B] to-[#D97706] flex items-center justify-center text-black font-bold text-xs shadow-sm">
              AD
            </div>
            <div className="hidden sm:block text-left">
              <p className="text-xs font-bold text-gray-900 leading-tight">Admin User</p>
              <p className="text-[10px] text-gray-400">Super Admin</p>
            </div>
            <ChevronDown
              className={`w-3.5 h-3.5 text-gray-400 hidden sm:block transition-transform duration-150 ${
                showProfile ? 'rotate-180' : ''
              }`}
            />
          </button>

          {showProfile && (
            <>
              <div className="fixed inset-0 z-40" onClick={closeAll} />
              <div className="absolute right-0 top-12 w-56 bg-white rounded-2xl shadow-2xl border border-gray-100 z-50 overflow-hidden">
                <div className="px-4 py-3.5 border-b border-gray-100 bg-gradient-to-r from-amber-50 to-white">
                  <div className="flex items-center gap-2.5">
                    <div className="w-9 h-9 rounded-full bg-gradient-to-br from-[#F59E0B] to-[#D97706] flex items-center justify-center text-black font-bold text-sm shadow-md">
                      AD
                    </div>
                    <div>
                      <p className="font-bold text-sm text-gray-900">Admin User</p>
                      <p className="text-[10px] text-gray-500">admin@campus.edu</p>
                    </div>
                  </div>
                </div>
                <div className="py-1.5">
                  <button className="w-full flex items-center gap-3 px-4 py-2.5 text-sm text-gray-700 hover:bg-gray-50 transition-colors">
                    <User className="w-4 h-4 text-gray-400" />
                    My Profile
                  </button>
                  <button className="w-full flex items-center gap-3 px-4 py-2.5 text-sm text-gray-700 hover:bg-gray-50 transition-colors">
                    <Settings className="w-4 h-4 text-gray-400" />
                    Settings
                  </button>
                  <div className="border-t border-gray-100 mt-1 pt-1">
                    <button className="w-full flex items-center gap-3 px-4 py-2.5 text-sm text-red-500 hover:bg-red-50 transition-colors font-medium">
                      <LogOut className="w-4 h-4" />
                      Log Out
                    </button>
                  </div>
                </div>
              </div>
            </>
          )}
        </div>
      </div>
    </header>
  )
}
