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
    <div className="min-h-screen bg-gray-100">
      <div className="flex flex-col min-h-screen">
        <AdminSidebar
          isOpen={isDrawerOpen}
          onClose={() => setIsDrawerOpen(false)}
          currentView={currentView}
        />

        <div className="flex-shrink-0 z-20">
          <AdminHeader onMenuClick={() => setIsDrawerOpen((prev) => !prev)} />
        </div>

        <div className="flex-1 overflow-y-auto overflow-x-hidden">
          {children}
        </div>
      </div>
    </div>
  );
}
