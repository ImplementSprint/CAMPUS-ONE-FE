'use client'

import { useState } from 'react'
import {
  LayoutDashboard,
  Users,
  GraduationCap,
  BookOpen,
  Calendar,
  Award,
  Megaphone,
  Settings,
  ChevronLeft,
  ChevronRight,
  X,
  LogOut,
} from 'lucide-react'

interface SidebarProps {
  isOpen: boolean
  isCollapsed: boolean
  onClose: () => void
  onToggleCollapse: () => void
  activeItem: string
  onNavigate: (item: string) => void
}

const navItems = [
  { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { id: 'students', label: 'Students', icon: Users },
  { id: 'professors', label: 'Professors', icon: GraduationCap },
  { id: 'courses', label: 'Courses', icon: BookOpen },
  { id: 'schedules', label: 'Schedules', icon: Calendar },
  { id: 'grades', label: 'Grades', icon: Award },
  { id: 'announcements', label: 'Announcements', icon: Megaphone },
]

const bottomItems = [
  { id: 'settings', label: 'Settings', icon: Settings },
]

export function DashboardSidebar({
  isOpen,
  isCollapsed,
  onClose,
  onToggleCollapse,
  activeItem,
  onNavigate,
}: SidebarProps) {
  return (
    <>
      {/* Mobile Backdrop */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black/70 z-40 lg:hidden backdrop-blur-sm transition-opacity"
          onClick={onClose}
        />
      )}

      {/* Sidebar */}
      <aside
        className={`
          fixed top-0 left-0 h-full bg-[#0B0F14] z-50 flex flex-col
          transition-all duration-300 ease-in-out border-r border-white/5
          ${isOpen ? 'translate-x-0' : '-translate-x-full'}
          lg:translate-x-0 lg:static lg:z-auto
          ${isCollapsed ? 'lg:w-[72px]' : 'lg:w-[260px]'}
          w-[260px]
        `}
      >
        {/* Logo */}
        <div
          className={`flex items-center h-16 border-b border-white/8 flex-shrink-0 ${
            isCollapsed ? 'lg:justify-center lg:px-4 px-5' : 'px-5'
          } justify-between`}
        >
          <div className={`flex items-center gap-2 ${isCollapsed ? 'lg:hidden' : ''}`}>
            <img src="/logo.png" alt="Logo" className="w-7 h-7 object-contain rounded-lg" />
            <div className="flex items-baseline gap-0.5">
              <span className="text-[#F59E0B] font-black text-base tracking-tight">CAMPUS</span>
              <span className="text-white font-extralight text-base tracking-tight"> ONE</span>
            </div>
          </div>

          {/* Collapsed logo */}
          <div className={`${isCollapsed ? 'lg:flex hidden' : 'hidden'} items-center justify-center`}>
            <img src="/logo.png" alt="Logo" className="w-8 h-8 object-contain rounded-lg" />
          </div>

          {/* Mobile close */}
          <button
            onClick={onClose}
            className="lg:hidden w-8 h-8 flex items-center justify-center rounded-lg hover:bg-white/10 text-white/60 hover:text-white transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Role badge */}
        <div className={`px-4 pt-4 pb-1 ${isCollapsed ? 'lg:hidden' : ''}`}>
          <div className="bg-[#F59E0B]/10 border border-[#F59E0B]/20 rounded-xl px-3 py-2.5">
            <p className="text-[#F59E0B] text-[10px] font-bold tracking-widest uppercase">
              Super Admin
            </p>
            <p className="text-white/40 text-[10px] mt-0.5">Academic Management</p>
          </div>
        </div>

        {/* Nav label */}
        {!isCollapsed && (
          <div className="px-4 pt-4 pb-1 lg:block hidden">
            <p className="text-[10px] font-bold text-white/20 tracking-widest uppercase">Navigation</p>
          </div>
        )}
        <div className="px-4 pt-4 pb-1 lg:hidden">
          <p className="text-[10px] font-bold text-white/20 tracking-widest uppercase">Navigation</p>
        </div>

        {/* Main nav */}
        <nav className="flex-1 overflow-y-auto px-3 space-y-0.5 pb-2">
          {navItems.map((item) => {
            const Icon = item.icon
            const isActive = activeItem === item.id
            return (
              <button
                key={item.id}
                onClick={() => {
                  onNavigate(item.id)
                  onClose()
                }}
                title={isCollapsed ? item.label : undefined}
                className={`
                  w-full flex items-center rounded-xl transition-all duration-150 group
                  ${isCollapsed ? 'lg:justify-center lg:p-3 px-3 py-2.5 gap-3' : 'gap-3 px-3 py-2.5'}
                  ${
                    isActive
                      ? 'bg-[#F59E0B] text-black shadow-lg shadow-[#F59E0B]/25'
                      : 'text-white/50 hover:text-white hover:bg-white/6'
                  }
                `}
              >
                <Icon
                  className={`flex-shrink-0 transition-transform group-hover:scale-105 ${
                    isCollapsed ? 'lg:w-5 lg:h-5 w-4 h-4' : 'w-4 h-4'
                  }`}
                />
                <span
                  className={`font-medium text-sm ${
                    isCollapsed ? 'lg:hidden' : ''
                  }`}
                >
                  {item.label}
                </span>
                {!isCollapsed && isActive && (
                  <span className="ml-auto w-1.5 h-1.5 bg-black/40 rounded-full" />
                )}
              </button>
            )
          })}
        </nav>

        {/* Bottom section */}
        <div className="border-t border-white/8 flex-shrink-0">
          <div className={`px-3 py-2 space-y-0.5`}>
            {bottomItems.map((item) => {
              const Icon = item.icon
              const isActive = activeItem === item.id
              return (
                <button
                  key={item.id}
                  onClick={() => {
                    onNavigate(item.id)
                    onClose()
                  }}
                  title={isCollapsed ? item.label : undefined}
                  className={`
                    w-full flex items-center rounded-xl transition-all duration-150
                    ${isCollapsed ? 'lg:justify-center lg:p-3 px-3 py-2.5 gap-3' : 'gap-3 px-3 py-2.5'}
                    ${
                      isActive
                        ? 'bg-[#F59E0B] text-black'
                        : 'text-white/50 hover:text-white hover:bg-white/6'
                    }
                  `}
                >
                  <Icon className="w-4 h-4 flex-shrink-0" />
                  <span className={`font-medium text-sm ${isCollapsed ? 'lg:hidden' : ''}`}>
                    {item.label}
                  </span>
                </button>
              )
            })}
          </div>

          {/* User info */}
          <div className={`px-4 py-3 border-t border-white/8 ${isCollapsed ? 'lg:hidden' : ''}`}>
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-full bg-gradient-to-br from-[#F59E0B] to-[#D97706] flex items-center justify-center text-black font-bold text-xs flex-shrink-0 shadow-md">
                AD
              </div>
              <div className="min-w-0 flex-1">
                <p className="text-white text-xs font-semibold truncate">Admin User</p>
                <p className="text-white/30 text-[10px] truncate">admin@campus.edu</p>
              </div>
              <button className="w-7 h-7 flex items-center justify-center rounded-lg hover:bg-white/10 text-white/30 hover:text-red-400 transition-colors flex-shrink-0">
                <LogOut className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>

          {/* Collapse toggle - desktop only */}
          <button
            onClick={onToggleCollapse}
            className="hidden lg:flex w-full items-center justify-center py-3 text-white/25 hover:text-white/60 hover:bg-white/5 transition-colors border-t border-white/8"
          >
            {isCollapsed ? (
              <ChevronRight className="w-4 h-4" />
            ) : (
              <div className="flex items-center gap-1.5 text-[11px]">
                <ChevronLeft className="w-3.5 h-3.5" />
                <span>Collapse</span>
              </div>
            )}
          </button>
        </div>
      </aside>
    </>
  )
}
