'use client'
import { LayoutDashboard, FileText, X } from "lucide-react";

interface AdminSidebarProps {
  isOpen: boolean;
  onClose: () => void;
  currentView: "dashboard" | "applications" | "detail";
}

export function AdminSidebar({ isOpen, onClose, currentView }: AdminSidebarProps) {
  return (
    <>
      {/* Backdrop */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-40 transition-opacity"
          onClick={onClose}
        />
      )}

      {/* Drawer */}
      <div
        className={`fixed top-0 left-0 h-full w-[280px] bg-white z-50 transform transition-transform duration-300 ease-in-out ${
          isOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        {/* Header */}
        <div className="h-14 bg-[#1a1a1a] flex items-center justify-between px-4">
          <div className="flex items-center gap-0.5">
            <span className="text-white font-semibold text-base tracking-tight">Campus One Admin</span>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 flex items-center justify-center rounded-lg hover:bg-white/10 transition-colors text-white"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Navigation */}
        <nav className="p-4 space-y-2">
          <button
            onClick={onClose}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${
              currentView === "dashboard"
                ? "bg-[#F59E0B] text-white"
                : "text-gray-700 hover:bg-gray-100"
            }`}
          >
            <LayoutDashboard className="w-5 h-5" />
            <span className="font-medium text-sm">Dashboard</span>
          </button>

          <button
            onClick={onClose}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${
              currentView === "applications" || currentView === "detail"
                ? "bg-[#F59E0B] text-white"
                : "text-gray-700 hover:bg-gray-100"
            }`}
          >
            <FileText className="w-5 h-5" />
            <span className="font-medium text-sm">Applications</span>
          </button>
        </nav>

        {/* Footer */}
        <div className="absolute bottom-0 left-0 right-0 p-4 border-t border-gray-200">
          <div className="text-xs text-gray-500 text-center">
            School Administration
          </div>
        </div>
      </div>
    </>
  );
}
