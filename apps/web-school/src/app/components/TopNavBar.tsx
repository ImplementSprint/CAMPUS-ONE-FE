'use client'
import { Menu, Bell } from "lucide-react";

export function TopNavBar() {
  return (
    <div className="fixed top-0 left-0 right-0 bg-black h-14 flex items-center justify-between px-4 z-50">
      <button className="text-white p-1">
        <Menu className="w-6 h-6" />
      </button>
      
      <div className="flex items-center gap-1">
        <span className="text-[#F59E0B] font-bold text-lg">CAMPUS</span>
        <span className="text-white font-normal text-lg">Portal</span>
      </div>
      
      <button className="text-white p-1">
        <Bell className="w-6 h-6" />
      </button>
    </div>
  );
}
