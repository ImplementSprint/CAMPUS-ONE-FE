'use client'
import { useState } from "react";
import type { AppSession, SchoolLevel } from "../types/admissions.types";
import { MobileHeader } from "./MobileHeader";
import { SidebarDrawer } from "./SidebarDrawer";
import {
  Home,
  User,
  Users,
  GraduationCap,
  UsersRound,
  FileText,
  Upload,
  Clock,
  HelpCircle,
  Settings,
  LogOut,
} from "lucide-react";

interface AdmissionsMobileLayoutProps {
  session: AppSession;
  children: React.ReactNode;
  onNavigate?: (step: string) => void;
}

interface MenuItem {
  label: string;
  icon: React.ComponentType<{ className?: string }>;
}

const MENU_BY_SCHOOL_LEVEL: Record<SchoolLevel, MenuItem[]> = {
  Kinder: [
    { label: "Results", icon: Home },
    { label: "Personal Information", icon: User },
    { label: "Parent Information", icon: Users },
    { label: "Academic Background", icon: GraduationCap },
    { label: "Documents Uploading", icon: Upload },
    { label: "Activity Log", icon: Clock },
  ],
  Elementary: [
    { label: "Results", icon: Home },
    { label: "Personal Information", icon: User },
    { label: "Parent Information", icon: Users },
    { label: "Academic Background", icon: GraduationCap },
    { label: "Documents Uploading", icon: Upload },
    { label: "Activity Log", icon: Clock },
  ],
  "Junior High School": [
    { label: "Results", icon: Home },
    { label: "Personal Information", icon: User },
    { label: "Parent Information", icon: Users },
    { label: "Academic Background", icon: GraduationCap },
    { label: "Program", icon: FileText },
    { label: "Documents Uploading", icon: Upload },
    { label: "Activity Log", icon: Clock },
  ],
  "Senior High School": [
    { label: "Results", icon: Home },
    { label: "Personal Information", icon: User },
    { label: "Parent Information", icon: Users },
    { label: "Academic Background", icon: GraduationCap },
    { label: "Program", icon: FileText },
    { label: "Documents Uploading", icon: Upload },
    { label: "Activity Log", icon: Clock },
  ],
  College: [
    { label: "Results", icon: Home },
    { label: "Personal Information", icon: User },
    { label: "Parent Information", icon: Users },
    { label: "Academic Background", icon: GraduationCap },
    { label: "Alumni Relative Information", icon: UsersRound },
    { label: "Program", icon: FileText },
    { label: "Documents Uploading", icon: Upload },
    { label: "Activity Log", icon: Clock },
  ],
};

function menuItemToStep(label: string): string {
  const map: Record<string, string> = {
    Results: "result",
    "Personal Information": "personal-profile",
    "Parent Information": "parent-info",
    "Academic Background": "academic-background",
    "Alumni Relative Information": "alumni-info",
    Program: "program-selection",
    "Documents Uploading": "documents",
    "Activity Log": "activity-log",
  };
  return map[label] || "";
}

function getInitials(first: string, last: string): string {
  const f = first.trim()[0] ?? "";
  const l = last.trim()[0] ?? "";
  return (f + l).toUpperCase() || "?";
}

export function AdmissionsMobileLayout({
  session,
  children,
  onNavigate,
}: AdmissionsMobileLayoutProps) {
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);

  const showHamburger = !!session.applicantId;
  const menuItems = session.schoolLevel ? MENU_BY_SCHOOL_LEVEL[session.schoolLevel] : [];
  const initials = session.firstName ? getInitials(session.firstName, session.lastName) : "";
  const fullName = `${session.firstName} ${session.lastName}`.trim() || "Applicant";

  return (
    <div className="w-screen h-screen flex overflow-hidden bg-gray-100 admissions-desktop-layout">
      {/* 🖥️ Desktop Permanent Sidebar (Visible on Desktop only if logged in) */}
      {showHamburger && (
        <aside className="hidden md:flex md:w-64 md:flex-col bg-[#1a1a1a] text-white h-full flex-shrink-0 z-30">
          {/* Logo / Branding */}
          <div className="p-6 border-b border-gray-800 flex items-center gap-1.5">
            <span className="text-[#F59E0B] font-bold text-xl tracking-tight">CAMPUS</span>
            <span className="text-white font-light text-xl tracking-tight">Portal</span>
          </div>

          {/* User Profile Summary */}
          <div className="px-4 py-5 border-b border-gray-800 flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-gray-600 flex items-center justify-center text-sm font-bold text-white flex-shrink-0">
              {initials || "A"}
            </div>
            <div className="min-w-0 flex-1">
              <p className="text-sm font-semibold text-white truncate">{fullName}</p>
              <p className="text-xs text-gray-400 uppercase tracking-wide">Applicant</p>
            </div>
          </div>

          {/* Sidebar Menu Items */}
          <nav className="flex-1 overflow-y-auto px-3 py-4 space-y-1">
            {menuItems.map((item) => {
              const step = menuItemToStep(item.label);
              const isActive = session.step === step || (session.step === "select" && step === "result");
              const Icon = item.icon;

              return (
                <button
                  key={item.label}
                  onClick={() => step && onNavigate?.(step)}
                  className={`w-full px-4 py-3 rounded-md transition-all duration-150 text-left font-normal text-sm flex items-center gap-3 ${
                    isActive
                      ? "bg-[#F59E0B] text-white"
                      : "text-gray-300 hover:bg-gray-800"
                  }`}
                >
                  <Icon className="w-5 h-5 flex-shrink-0" />
                  <span>{item.label}</span>
                </button>
              );
            })}
          </nav>

          {/* Bottom Sidebar Action Items */}
          <div className="px-3 py-4 space-y-1 border-t border-gray-800">
            <button className="w-full px-4 py-3 rounded-md text-left font-normal text-sm text-gray-300 hover:bg-gray-800 transition-all duration-150 flex items-center gap-3">
              <HelpCircle className="w-5 h-5 flex-shrink-0" />
              <span>Help</span>
            </button>
            <button className="w-full px-4 py-3 rounded-md text-left font-normal text-sm text-gray-300 hover:bg-gray-800 transition-all duration-150 flex items-center gap-3">
              <Settings className="w-5 h-5 flex-shrink-0" />
              <span>Settings</span>
            </button>
            <button className="w-full px-4 py-3 rounded-md text-left font-normal text-sm text-gray-300 hover:bg-gray-800 transition-all duration-150 flex items-center gap-3">
              <LogOut className="w-5 h-5 flex-shrink-0" />
              <span>Log out</span>
            </button>
          </div>
        </aside>
      )}

      {/* Main Screen Layout Container */}
      <div className="flex-1 flex flex-col h-full overflow-hidden min-w-0">
        {/* Mobile Header (Only visible on Mobile screens, or on initial steps) */}
        <div className={`${showHamburger ? "md:hidden" : ""} flex-shrink-0 z-20`}>
          <MobileHeader
            session={session}
            onMenuClick={showHamburger ? () => setIsDrawerOpen((prev) => !prev) : undefined}
          />
        </div>

        {/* 🖥️ Desktop Header (Visible on Desktop only when logged in) */}
        {showHamburger && (
          <header className="hidden md:flex h-14 bg-white border-b border-gray-200 items-center justify-between px-6 flex-shrink-0 z-20">
            <h2 className="text-sm font-semibold text-gray-700">Admissions Portal</h2>
            <div className="flex items-center gap-2">
              <span className="text-xs text-gray-400 font-medium">Applicant ID: {session.applicantId}</span>
            </div>
          </header>
        )}

        {/* Sliding Sidebar Drawer for Mobile */}
        {showHamburger && (
          <div className="md:hidden">
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
          </div>
        )}

        {/* Scrollable Page Content */}
        <div className="flex-1 overflow-y-auto overflow-x-hidden bg-gray-50 flex flex-col">
          {/* Mobile Simulator View (Mobile screens) vs Spacious Desktop Frame */}
          <div className="flex-1 md:w-full md:max-w-4xl md:mx-auto md:px-6 md:py-8 flex flex-col md:justify-start">
            <div className="flex-1 flex flex-col bg-white md:rounded-2xl md:shadow-sm md:border md:border-gray-200 overflow-hidden relative">
              <div className="flex-1 flex flex-col relative">
                {children}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}