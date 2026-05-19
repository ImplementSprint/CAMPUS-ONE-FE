'use client'

import { useState } from 'react'
import { DashboardSidebar } from './DashboardSidebar'
import { DashboardTopNav } from './DashboardTopNav'

interface DashboardLayoutProps {
  children: (activeItem: string) => React.ReactNode
}

export function DashboardLayout({ children }: DashboardLayoutProps) {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false)
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false)
  const [activeItem, setActiveItem] = useState('dashboard')

  return (
    <div className="flex h-screen bg-gray-50 overflow-hidden">
      <DashboardSidebar
        isOpen={isSidebarOpen}
        isCollapsed={isSidebarCollapsed}
        onClose={() => setIsSidebarOpen(false)}
        onToggleCollapse={() => setIsSidebarCollapsed((prev) => !prev)}
        activeItem={activeItem}
        onNavigate={setActiveItem}
      />

      <div className="flex-1 flex flex-col overflow-hidden min-w-0">
        <DashboardTopNav
          onMenuClick={() => setIsSidebarOpen((prev) => !prev)}
          activeItem={activeItem}
        />
        <main className="flex-1 overflow-y-auto scroll-smooth">
          {children(activeItem)}
        </main>
      </div>
    </div>
  )
}
