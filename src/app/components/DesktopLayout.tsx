'use client'
import { ReactNode, useState } from "react";
import { useRouter, usePathname } from "next/navigation";
import {
  User, BookOpen, ClipboardCheck, BookMarked, Calendar, CalendarDays,
  GraduationCap, CreditCard, FileText, AlertCircle, CheckSquare,
  CalendarClock, Award, HelpCircle, Settings, LogOut, Menu, X, ClipboardList,
} from "lucide-react";
import { logout } from '@/services/auth.service';

interface DesktopLayoutProps {
  children: ReactNode;
}

export function DesktopLayout({ children }: DesktopLayoutProps) {
  const router = useRouter();
  const pathname = usePathname();
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const menuItems = [
    { path: "/desktop/profile", label: "Profile", icon: User },
    { path: "/desktop/admissions", label: "Admissions", icon: ClipboardList },
    { path: "/desktop/course-details", label: "Course Details", icon: BookOpen },
    { path: "/desktop/evaluation", label: "Evaluation", icon: ClipboardCheck },
    { path: "/desktop/curriculum", label: "Curriculum", icon: BookMarked },
    { path: "/desktop/course-offerings", label: "Course Offerings", icon: Calendar },
    { path: "/desktop/schedule", label: "Schedule", icon: CalendarDays },
    { path: "/desktop/enrollment", label: "Enrollment", icon: GraduationCap },
    { path: "/desktop/online-enrollment", label: "Online Enrollment", icon: GraduationCap },
    { path: "/desktop/balance-payment", label: "Balance Payment", icon: CreditCard },
    { path: "/desktop/advised-courses", label: "Advised Courses", icon: FileText },
    { path: "/desktop/deficiencies", label: "Deficiencies", icon: AlertCircle },
    { path: "/desktop/requirement-checklist", label: "Requirement Checklist", icon: CheckSquare },
    { path: "/desktop/events", label: "Events", icon: CalendarClock },
    { path: "/desktop/graduation", label: "Graduation", icon: Award },
    { path: "/desktop/help", label: "Help", icon: HelpCircle },
    { path: "/desktop/settings", label: "Settings", icon: Settings },
  ];

  return (
    <div className="flex h-screen bg-gray-100">
      {isSidebarOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-40 lg:hidden" onClick={() => setIsSidebarOpen(false)} />
      )}
      <div className={`fixed lg:static inset-y-0 left-0 w-64 bg-[#1a1a1a] text-white flex flex-col z-50 transform transition-transform duration-300 lg:transform-none ${isSidebarOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"}`}>
        <div className="p-6 border-b border-gray-700 flex items-center justify-between">
          <div className="flex items-center gap-1">
            <span className="text-[#F59E0B] font-bold text-xl">CAMPUS</span>
            <span className="text-white font-normal text-xl">Portal</span>
          </div>
          <button onClick={() => setIsSidebarOpen(false)} className="lg:hidden text-gray-400 hover:text-white">
            <X className="w-6 h-6" />
          </button>
        </div>
        <nav className="flex-1 overflow-y-auto py-4">
          {menuItems.map((item) => {
            const Icon = item.icon;
            const isActive = pathname === item.path;
            return (
              <button key={item.path} onClick={() => { router.push(item.path); setIsSidebarOpen(false); }}
                className={`w-full flex items-center gap-3 px-6 py-3 text-sm transition-colors ${isActive ? "bg-[#F59E0B] text-white" : "text-gray-300 hover:bg-gray-800 hover:text-white"}`}>
                <Icon className="w-4 h-4" />
                {item.label}
              </button>
            );
          })}
        </nav>
        <div className="p-4 border-t border-gray-700">
          <button onClick={() => logout()} className="w-full flex items-center gap-3 px-4 py-3 text-sm text-gray-300 hover:bg-gray-800 hover:text-white rounded transition-colors">
            <LogOut className="w-4 h-4" />
            Log out
          </button>
        </div>
      </div>
      <div className="flex-1 flex flex-col w-full lg:w-auto">
        <header className="bg-black text-white h-16 flex items-center justify-between px-4 lg:px-8">
          <div className="flex items-center gap-3">
            <button onClick={() => setIsSidebarOpen(true)} className="lg:hidden text-white">
              <Menu className="w-6 h-6" />
            </button>
            <div className="flex items-center gap-1">
              <span className="text-[#F59E0B] font-bold text-base lg:text-lg">CAMPUS</span>
              <span className="text-white font-normal text-base lg:text-lg">Portal</span>
            </div>
          </div>
          <div className="flex items-center gap-2 lg:gap-4">
            <div className="hidden sm:block text-right">
              <div className="font-medium text-sm lg:text-base">Juan Dela Cruz</div>
              <div className="text-xs text-gray-400">Student</div>
            </div>
            <div className="w-8 h-8 lg:w-10 lg:h-10 rounded-full bg-[#F59E0B] flex items-center justify-center font-bold text-sm lg:text-base">JD</div>
          </div>
        </header>
        <main className="flex-1 overflow-y-auto p-4 lg:p-8">{children}</main>
      </div>
    </div>
  );
}
