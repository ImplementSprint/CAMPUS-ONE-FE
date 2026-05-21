'use client'
import { ReactNode } from "react";
import { logout, getCurrentUser } from "@/services/auth.service";
import { LogOut, LayoutDashboard, FileText, Users, Settings } from "lucide-react";

interface AdminWebLayoutProps {
  children: ReactNode;
  currentView: "dashboard" | "applications" | "detail";
  onNavigate?: (view: "dashboard" | "applications") => void;
}

export function AdminWebLayout({ children, currentView, onNavigate }: AdminWebLayoutProps) {
  const user = getCurrentUser();

  const menuItems = [
    { id: "dashboard", label: "Dashboard", icon: LayoutDashboard, enabled: true },
    { id: "applications", label: "Applications", icon: FileText, enabled: true },
    { id: "users", label: "Users", icon: Users, enabled: false },
    { id: "settings", label: "Settings", icon: Settings, enabled: false },
  ];

  const handleMenuClick = (itemId: string) => {
    if (itemId === "dashboard" || itemId === "applications") {
      onNavigate?.(itemId as "dashboard" | "applications");
    }
  };

  return (
    <div className="flex h-screen bg-gray-100">
      {/* Sidebar */}
      <div className="w-64 bg-[#1a1a1a] text-white flex flex-col flex-shrink-0">
        {/* Logo */}
        <div className="p-6 border-b border-gray-700">
          <div className="flex items-center gap-2 mb-1">
            <img src="/logo.png" alt="Logo" className="w-8 h-8 object-contain rounded-lg" />
            <div className="flex items-baseline gap-0.5">
              <span className="text-[#F59E0B] font-bold text-xl">CAMPUS</span>
              <span className="text-white font-normal text-xl">Admin</span>
            </div>
          </div>
          <p className="text-xs text-gray-400">Admissions Management</p>
        </div>

        {/* Navigation */}
        <nav className="flex-1 overflow-y-auto py-4">
          {menuItems.map((item) => {
            const Icon = item.icon;
            const isActive = currentView === item.id;
            
            // Only show enabled items
            if (!item.enabled) return null;
            
            return (
              <button
                key={item.id}
                onClick={() => handleMenuClick(item.id)}
                className={`w-full flex items-center gap-3 px-6 py-3 text-sm transition-colors ${
                  isActive
                    ? "bg-[#F59E0B] text-white"
                    : "text-gray-300 hover:bg-gray-800 hover:text-white cursor-pointer"
                }`}
              >
                <Icon className="w-4 h-4" />
                {item.label}
              </button>
            );
          })}
        </nav>

        {/* User Info & Logout */}
        <div className="p-4 border-t border-gray-700">
          <div className="mb-3 px-2">
            <p className="text-sm font-medium text-white truncate">
              {user?.name || user?.email}
            </p>
            <p className="text-xs text-gray-400">Administrator</p>
          </div>
          <button
            onClick={logout}
            className="w-full flex items-center gap-3 px-4 py-3 text-sm text-gray-300 hover:bg-gray-800 hover:text-white rounded transition-colors"
          >
            <LogOut className="w-4 h-4" />
            Log out
          </button>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Header */}
        <header className="bg-white border-b border-gray-200 h-16 flex items-center justify-between px-8 flex-shrink-0">
          <div>
            <h1 className="text-lg font-bold text-gray-900">
              {currentView === "dashboard" && "Dashboard"}
              {currentView === "applications" && "Applications"}
              {currentView === "detail" && "Application Details"}
            </h1>
          </div>
          <div className="flex items-center gap-4">
            <div className="text-right">
              <div className="font-medium text-sm text-gray-900">
                {user?.name || "Admin"}
              </div>
              <div className="text-xs text-gray-500">
                {user?.email}
              </div>
            </div>
            <div className="w-10 h-10 rounded-full bg-[#F59E0B] flex items-center justify-center font-bold text-white">
              {(user?.name || user?.email || "A").charAt(0).toUpperCase()}
            </div>
          </div>
        </header>

        {/* Content Area */}
        <main className="flex-1 overflow-y-auto bg-gray-50">
          {children}
        </main>
      </div>
    </div>
  );
}
