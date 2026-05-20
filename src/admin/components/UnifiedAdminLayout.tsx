'use client'
import { ReactNode } from "react";
import { logout, getCurrentUser } from "@/shared/auth.service";
import { LogOut, LayoutDashboard, FileText, GraduationCap, Bell } from "lucide-react";
import { Sidebar } from "@/admin/alumni-admin/components/layout/Sidebar";

interface UnifiedAdminLayoutProps {
  children: ReactNode;
  currentPortal?: "applicant" | "student" | "alumni";
  currentView?: string;
  onNavigate?: (view: string) => void;
}

export function UnifiedAdminLayout({ 
  children, 
  currentPortal = "alumni", 
  currentView = "dashboard", 
  onNavigate
}: UnifiedAdminLayoutProps) {
  const user = getCurrentUser();

  if (currentPortal === "alumni") {
    return (
      <div className="flex h-screen alumni-admin-shell">
        <Sidebar />

        <div className="flex-1 flex flex-col overflow-hidden alumni-admin-content">
          <header className="alumni-admin-topbar h-[68px] flex items-center justify-end px-6 flex-shrink-0">
            <button className="relative h-10 w-10 rounded-2xl bg-white text-slate-500 shadow-sm transition-colors hover:bg-slate-50">
              <Bell className="mx-auto h-5 w-5" />
              <span className="absolute -right-1 -top-1 min-w-[18px] h-[18px] rounded-full bg-blue-500 px-1 text-[11px] font-semibold leading-[18px] text-white">3</span>
            </button>
          </header>

          <main className="flex-1 overflow-y-auto alumni-admin-main">
            {children}
          </main>
        </div>
      </div>
    );
  }

  const applicantMenuItems = [
    { id: "dashboard", label: "Dashboard", icon: LayoutDashboard },
    { id: "applications", label: "Applications", icon: FileText },
  ];

  const studentMenuItems = [
    { id: "dashboard", label: "Dashboard", icon: LayoutDashboard },
    { id: "students", label: "Students", icon: GraduationCap },
  ];

  const menuItems = currentPortal === "applicant" ? applicantMenuItems : studentMenuItems;

  return (
    <div className="flex h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      {/* Sidebar */}
      <div className="w-72 bg-gradient-to-b from-[#1a1a1a] to-[#0a0a0a] text-white flex flex-col flex-shrink-0 shadow-2xl">
        {/* Logo */}
        <div className="p-8 border-b border-gray-800">
          <div className="flex items-center gap-2 mb-2">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#F59E0B] to-[#D97706] flex items-center justify-center">
              <span className="text-white font-bold text-lg">C</span>
            </div>
            <div>
              <div className="flex items-center gap-1">
                <span className="text-[#F59E0B] font-bold text-xl">CAMPUS</span>
                <span className="text-white font-light text-xl">Admin</span>
              </div>
            </div>
          </div>
          <p className="text-xs text-gray-400 ml-12 -mt-1">
            {currentPortal === "applicant" ? "Applicant Management" : "Student Management"}
          </p>
        </div>

        {/* Navigation */}
        <nav className="flex-1 overflow-y-auto py-6 px-4">
          <p className="text-xs text-gray-400 mb-3 px-3 uppercase tracking-wider font-semibold">Menu</p>
          <div className="space-y-1">
            {menuItems.map((item) => {
              const Icon = item.icon;
              const isActive = currentView === item.id;
              
              return (
                <button
                  key={item.id}
                  onClick={() => onNavigate?.(item.id)}
                  className={`w-full flex items-center gap-3 px-4 py-3 text-sm font-medium rounded-xl transition-all duration-200 ${
                    isActive
                      ? "bg-gradient-to-r from-[#F59E0B] to-[#D97706] text-white shadow-lg shadow-amber-500/20"
                      : "text-gray-300 hover:bg-gray-800/50 hover:text-white"
                  }`}
                >
                  <Icon className="w-5 h-5" />
                  {item.label}
                </button>
              );
            })}
          </div>
        </nav>

        {/* User Info & Logout */}
        <div className="p-6 border-t border-gray-800">
          <div className="mb-4 px-3">
            <div className="flex items-center gap-3 mb-3">
              <div className="w-10 h-10 rounded-full bg-gradient-to-br from-[#F59E0B] to-[#D97706] flex items-center justify-center font-bold text-white shadow-lg">
                {(user?.name || user?.email || "A").charAt(0).toUpperCase()}
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-semibold text-white truncate">
                  {user?.name || user?.email}
                </p>
                <p className="text-xs text-gray-400">Administrator</p>
              </div>
            </div>
          </div>
          <button
            onClick={logout}
            className="w-full flex items-center justify-center gap-2 px-4 py-3 text-sm font-medium text-gray-300 hover:bg-red-500/10 hover:text-red-400 rounded-xl transition-all duration-200 border border-gray-800 hover:border-red-500/30"
          >
            <LogOut className="w-4 h-4" />
            Log out
          </button>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Header */}
        <header className="bg-white/80 backdrop-blur-sm border-b border-gray-200 h-20 flex items-center justify-between px-10 flex-shrink-0 shadow-sm">
          <div>
            <h1 className="text-2xl font-bold text-gray-900 mb-0.5">
              {currentView === "dashboard" && "Dashboard"}
              {currentView === "applications" && "Applications"}
              {currentView === "students" && "Students"}
              {currentView === "detail" && (currentPortal === "applicant" ? "Application Details" : "Student Details")}
            </h1>
            <p className="text-sm text-gray-500">
              {currentView === "dashboard" && `Welcome back, ${user?.name || "Admin"}`}
              {currentView === "applications" && "Manage and review all applications"}
              {currentView === "students" && "Manage enrolled students"}
              {currentView === "detail" && "View and manage details"}
            </p>
          </div>
          <div className="flex items-center gap-4">
            <button className="relative p-2.5 rounded-xl hover:bg-gray-100 transition-colors">
              <Bell className="w-5 h-5 text-gray-600" />
              <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-red-500 rounded-full"></span>
            </button>
            <div className="h-10 w-px bg-gray-200"></div>
            <div className="flex items-center gap-3">
              <div className="text-right">
                <div className="font-semibold text-sm text-gray-900">
                  {user?.name || "Admin"}
                </div>
                <div className="text-xs text-gray-500">
                  {user?.email}
                </div>
              </div>
              <div className="w-11 h-11 rounded-full bg-gradient-to-br from-[#F59E0B] to-[#D97706] flex items-center justify-center font-bold text-white shadow-lg">
                {(user?.name || user?.email || "A").charAt(0).toUpperCase()}
              </div>
            </div>
          </div>
        </header>

        {/* Content Area */}
        <main className="flex-1 overflow-y-auto">
          {children}
        </main>
      </div>
    </div>
  );
}
