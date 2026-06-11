'use client'
import { useState } from "react";
import { AdminHeader } from "./AdminHeader";
import { AdminSidebar } from "./AdminSidebar";

interface AdminMobileLayoutProps {
  children: React.ReactNode;
  currentView: "dashboard" | "applications" | "detail";
}

export function AdminMobileLayout({ children, currentView }: AdminMobileLayoutProps) {
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);

  return (
    <div className="min-h-screen bg-campus-page">
      <div className="relative flex min-h-screen w-full flex-col bg-campus-page">
        <AdminSidebar
          isOpen={isDrawerOpen}
          onClose={() => setIsDrawerOpen(false)}
          currentView={currentView}
        />

        <div className="flex-shrink-0 z-20">
          <AdminHeader onMenuClick={() => setIsDrawerOpen((prev) => !prev)} />
        </div>

        <main className="mx-auto w-full max-w-6xl flex-1 overflow-x-hidden px-4 py-6 md:px-6">
          {children}
        </main>
      </div>
    </div>
  );
}
