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
    <div className="w-screen h-screen overflow-hidden bg-gray-100">
      <div className="relative h-screen w-full max-w-[430px] mx-auto flex flex-col bg-gray-100 overflow-hidden">
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

        <div className="flex-1 overflow-y-auto overflow-x-hidden">
          {children}
        </div>
      </div>
    </div>
  );
}