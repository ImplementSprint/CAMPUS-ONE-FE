'use client'
import type { AppSession, SchoolLevel } from "../types/admissions.types";
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

interface SidebarDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  session: AppSession;
  activeStep: AppSession["step"];
  onNavigate: (step: string) => void;
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

function getInitials(first: string, last: string): string {
  const f = first.trim()[0] ?? "";
  const l = last.trim()[0] ?? "";
  return (f + l).toUpperCase() || "?";
}

function menuItemToStep(label: string): string {
  const map: Record<string, string> = {
    Results: "result",
    "Personal Information": "personal-profile",
    "Parent Information": "parent-info",
    "Academic Background": "academic-background",
    "Alumni Relative Information": "alumni-info",
    Program: "program",
    "Documents Uploading": "documents",
    "Activity Log": "activity-log",
  };
  return map[label] || "";
}

export function SidebarDrawer({
  isOpen,
  onClose,
  session,
  activeStep,
  onNavigate,
}: SidebarDrawerProps) {
  const menuItems = session.schoolLevel ? MENU_BY_SCHOOL_LEVEL[session.schoolLevel] : [];
  const initials = getInitials(session.firstName, session.lastName);
  const fullName = `${session.firstName} ${session.lastName}`.trim() || "Applicant";

  return (
    <>
      <div
        onClick={onClose}
        className={`absolute inset-0 z-30 bg-black/30 transition-opacity duration-300 ${
          isOpen ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none"
        }`}
      />

      <div
        id="sidebar-drawer"
        className={`absolute top-0 left-0 z-40 h-full w-[280px] bg-[#1a1a1a] text-white transform transition-transform duration-300 ease-out ${
          isOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <div className="flex h-full flex-col">
          <div className="bg-[#1a1a1a] px-4 py-6">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-full bg-gray-600 flex items-center justify-center flex-shrink-0">
                <User className="w-6 h-6 text-gray-300" />
              </div>

              <div className="flex-1 min-w-0">
                <p className="text-base font-semibold text-white truncate">{fullName}</p>
                <p className="text-xs text-gray-400 uppercase tracking-wide">Applicant</p>
              </div>
            </div>
          </div>

          <nav className="flex-1 overflow-y-auto px-3 py-4 space-y-1">
            {menuItems.map((item) => {
              const step = menuItemToStep(item.label);
              const isActive = activeStep === step || (activeStep === "select" && step === "result");
              const Icon = item.icon;

              return (
                <button
                  key={item.label}
                  onClick={() => {
                    if (step) {
                      onNavigate(step);
                      onClose();
                    }
                  }}
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
        </div>
      </div>
    </>
  );
}