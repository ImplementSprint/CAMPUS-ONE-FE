'use client'
import { useState } from "react";
import type { AppSession } from "../types/admissions.types";
import { MobileHeader } from "./MobileHeader";
import { SidebarDrawer } from "./SidebarDrawer";

interface AdmissionsMobileLayoutProps {
  session: AppSession;
  children: React.ReactNode;
  onNavigate?: (step: string) => void;
}

export function AdmissionsMobileLayout({
  session,
  children,
  onNavigate,
}: AdmissionsMobileLayoutProps) {
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);

  const showHamburger = !!session.applicantId;

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col">
      {showHamburger && (
        <SidebarDrawer
          isOpen={isDrawerOpen}
          onClose={() => setIsDrawerOpen(false)}
          session={session}
          activeStep={session.step}
          onNavigate={(step) => {
            onNavigate?.(step);
            setIsDrawerOpen(false);
          }}
        />
      )}

      <div className="flex-shrink-0 z-20">
        <MobileHeader
          session={session}
          onMenuClick={showHamburger ? () => setIsDrawerOpen((prev) => !prev) : undefined}
        />
      </div>

      <div className="flex-1 overflow-y-auto">
        <div className="max-w-3xl mx-auto w-full px-4 py-6">
          {children}
        </div>
      </div>
    </div>
  );
}
