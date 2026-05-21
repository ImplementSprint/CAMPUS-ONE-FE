"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname, useSearchParams } from "next/navigation";
import { ChevronDown, ChevronRight, LogOut } from "lucide-react";
import { NavItem, navigation } from "@/lib/navigation";
import { cn } from "@/lib/utils";
import { logout } from "@/lib/auth.service";

interface SidebarProps {
  className?: string;
}

export function Sidebar({ className }: SidebarProps) {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const fullPath = pathname + (searchParams.toString() ? `?${searchParams.toString()}` : "");
  const [userEmail, setUserEmail] = useState<string>("");

  useEffect(() => {
    fetch("/api/auth/me", { credentials: "same-origin" })
      .then((r) => r.json())
      .then((data) => {
        if (data?.email) setUserEmail(data.email);
      })
      .catch(() => {});
  }, []);

  const displayName = userEmail ? userEmail.split("@")[0] : "";
  const initials = displayName.slice(0, 2).toUpperCase() || "--";

  return (
    <aside className={cn("flex h-screen w-72 flex-col bg-gradient-to-b from-[#1a1a1a] to-[#0a0a0a] text-white flex-shrink-0 shadow-2xl", className)}>
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
        <p className="text-xs text-gray-400 ml-12 -mt-1">Student Management</p>
      </div>

      <div className="flex-1 overflow-y-auto py-6 px-4">
        <p className="text-xs text-gray-400 mb-3 px-3 uppercase tracking-wider font-semibold">Menu</p>
        <nav className="flex flex-col gap-1">
          {navigation.map((item) => (
            <SidebarGroup key={item.title} item={item} activePathname={pathname} fullPath={fullPath} />
          ))}
        </nav>
      </div>

      <div className="p-6 border-t border-gray-800">
        <div className="flex items-center gap-3 mb-4 px-3">
          <div className="w-10 h-10 rounded-full bg-gradient-to-br from-[#F59E0B] to-[#D97706] flex items-center justify-center font-bold text-white shadow-lg shrink-0">
            {initials}
          </div>
          <div className="flex flex-col min-w-0">
            <span className="text-sm font-semibold text-white truncate">{displayName || userEmail}</span>
            <span className="text-xs text-gray-400 truncate">{userEmail}</span>
          </div>
        </div>
        <button onClick={() => logout()} className="w-full flex items-center justify-center gap-2 px-4 py-3 text-sm font-medium text-gray-300 hover:bg-red-500/10 hover:text-red-400 rounded-xl transition-all duration-200 border border-gray-800 hover:border-red-500/30">
          <LogOut className="w-4 h-4" />
          Log out
        </button>
      </div>
    </aside>
  );
}

function SidebarGroup({ item, activePathname, fullPath }: { item: NavItem; activePathname: string; fullPath: string }) {
  const hasSubItems = item.items && item.items.length > 0;
  const isActive = activePathname === item.href || (hasSubItems && item.items?.some(sub => fullPath.startsWith(sub.href)));
  const [isExpanded, setIsExpanded] = useState(isActive);

  useEffect(() => {
    if (isActive && hasSubItems) {
      setIsExpanded(true);
    }
  }, [isActive, hasSubItems]);

  const Icon = item.icon;

  if (!hasSubItems) {
    return (
      <Link
        href={item.href}
        className={cn(
          "w-full flex items-center gap-3 px-4 py-3 text-sm font-medium rounded-xl transition-all duration-200",
          isActive
            ? "bg-gradient-to-r from-[#F59E0B] to-[#D97706] text-white shadow-lg shadow-amber-500/20"
            : "text-gray-300 hover:bg-gray-800/50 hover:text-white"
        )}
      >
        {Icon && <Icon className="w-5 h-5" />}
        {item.title}
      </Link>
    );
  }

  return (
    <div className="flex flex-col gap-1">
      <button
        onClick={() => setIsExpanded(!isExpanded)}
        className={cn(
          "w-full flex items-center justify-between px-4 py-3 text-sm font-medium rounded-xl transition-all duration-200",
          isActive
            ? "bg-gradient-to-r from-[#F59E0B] to-[#D97706] text-white shadow-lg shadow-amber-500/20"
            : "text-gray-300 hover:bg-gray-800/50 hover:text-white"
        )}
      >
        <div className="flex items-center gap-3">
          {Icon && <Icon className="w-5 h-5" />}
          {item.title}
        </div>
        {hasSubItems && (
          isExpanded ? (
            <ChevronDown className="h-3.5 w-3.5 opacity-50" />
          ) : (
            <ChevronRight className="h-3.5 w-3.5 opacity-50" />
          )
        )}
      </button>
      {isExpanded && hasSubItems && (
        <div className="ml-9 mt-0.5 space-y-1 flex flex-col border-l border-gray-700 pl-3">
          {item.items?.map((subItem) => (
            <Link
              key={subItem.title}
              href={subItem.href}
              className={cn(
                "flex items-center justify-between rounded-lg py-1.5 text-[12px] font-medium transition-all group/sub",
                fullPath === subItem.href
                  ? "text-[#F59E0B]"
                  : "text-gray-400 hover:text-white"
              )}
            >
              <span>{subItem.title}</span>
              {subItem.locked && (
                <div className="bg-red-500/10 p-0.5 rounded flex items-center justify-center">
                  <svg className="w-2.5 h-2.5 text-red-500" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M18 8h-1V6c0-2.76-2.24-5-5-5S7 3.24 7 6v2H6c-1.1 0-2 .9-2 2v10c0 1.1.9 2 2 2h12c1.1 0 2-.9 2-2V10c0-1.1-.9-2-2-2zM9 6c0-1.66 1.34-3 3-3s3 1.34 3 3v2H9V6zm9 14H6V10h12v10zm-6-3c1.1 0 2-.9 2-2s-.9-2-2-2-2 .9-2 2 .9 2 2 2z"/>
                  </svg>
                </div>
              )}
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
