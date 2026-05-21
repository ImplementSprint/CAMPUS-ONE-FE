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
    <div className="w-screen h-screen overflow-hidden bg-gray-100">
      <div className="relative h-screen w-full max-w-[430px] mx-auto flex flex-col bg-gray-100 overflow-hidden">
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
