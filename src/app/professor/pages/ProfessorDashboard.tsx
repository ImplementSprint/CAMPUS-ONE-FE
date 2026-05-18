'use client'
import { useState, useEffect, useCallback } from "react";
import { getCurrentUser, logout } from "@/services/auth.service";
import {
  LogOut, BookOpen, Users, ClipboardCheck, Bell,
  Calendar, Megaphone, HelpCircle, Settings, LayoutDashboard,
  GraduationCap, ChevronRight,
} from "lucide-react";
import { getProfessorStats } from "../services/professor.service";
import { ClassList } from "../components/ClassList";
import { ClassDetail } from "../components/ClassDetail";
import { ProfessorAnnouncements } from "./ProfessorAnnouncements";
import { ProfessorGrades } from "./ProfessorGrades";
import { ProfessorSchedule } from "./ProfessorSchedule";
import { ProfessorStudents } from "./ProfessorStudents";
import { ProfessorHelp } from "./ProfessorHelp";
import { ProfessorSettings } from "./ProfessorSettings";
import NotificationBell from '@/components/NotificationBell';

type View =
  | "dashboard" | "classes" | "class-detail"
  | "announcements" | "grades" | "schedule"
  | "students" | "help" | "settings";

const NAV_ITEMS = [
  { id: "dashboard",     label: "Dashboard",      icon: LayoutDashboard },
  { id: "classes",       label: "My Classes",      icon: BookOpen },
  { id: "students",      label: "Students",        icon: Users },
  { id: "grades",        label: "Encode Grades",   icon: ClipboardCheck },
  { id: "announcements", label: "Announcements",   icon: Megaphone },
  { id: "schedule",      label: "My Schedule",     icon: Calendar },
] as const;

const BOTTOM_NAV = [
  { id: "help",     label: "Help & Support", icon: HelpCircle },
  { id: "settings", label: "Settings",       icon: Settings },
] as const;

export function ProfessorDashboard() {
  const user = getCurrentUser();
  const [view, setView] = useState<View>("dashboard");
  const [selectedClassId, setSelectedClassId] = useState<string | null>(null);
  const [stats, setStats] = useState({ totalClasses: 0, totalStudents: 0, pendingSubmissions: 0 });
  const [loading, setLoading] = useState(true);

  const loadStats = useCallback(async () => {
    if (!user?.id) return;
    setLoading(true);
    try {
      const result = await getProfessorStats(user.id);
      setStats(result.data ?? { totalClasses: 0, totalStudents: 0, pendingSubmissions: 0 });
    } catch {
      setStats({ totalClasses: 0, totalStudents: 0, pendingSubmissions: 0 });
    } finally {
      setLoading(false);
    }
  }, [user?.id]);

  useEffect(() => {
    if (user?.id) loadStats();
    else setLoading(false);
  }, [user?.id, loadStats]);

  const handleViewClass = (classId: string) => {
    setSelectedClassId(classId);
    setView("class-detail");
  };

  const navigate = (v: View) => {
    setView(v);
    if (v !== "class-detail") setSelectedClassId(null);
  };

  const viewLabel = NAV_ITEMS.find(n => n.id === view)?.label
    ?? BOTTOM_NAV.find(n => n.id === view)?.label
    ?? (view === "class-detail" ? "Class Detail" : "Dashboard");

  return (
    <div className="flex h-screen bg-gray-50 overflow-hidden">

      {/* ── Sidebar ─────────────────────────────────────────────── */}
      <aside className="w-72 bg-[#1a1a1a] flex flex-col flex-shrink-0 h-full">
        {/* Logo */}
        <div className="h-20 flex items-center gap-3 px-7 border-b border-white/10">
          <GraduationCap className="w-7 h-7 text-[#F59E0B]" />
          <div className="flex items-baseline gap-1">
            <span className="text-[#F59E0B] font-bold text-xl tracking-tight">CAMPUS</span>
            <span className="text-white/70 font-light text-base ml-1">Faculty</span>
          </div>
        </div>

        {/* Main Nav */}
        <nav className="flex-1 px-4 py-5 space-y-1 overflow-y-auto">
          {NAV_ITEMS.map(({ id, label, icon: Icon }) => (
            <button
              key={id}
              onClick={() => navigate(id as View)}
              className={`w-full flex items-center gap-3.5 px-4 py-3 rounded-xl text-sm font-medium transition-colors ${
                view === id
                  ? "bg-[#F59E0B] text-white"
                  : "text-white/60 hover:text-white hover:bg-white/10"
              }`}
            >
              <Icon className="w-5 h-5 flex-shrink-0" />
              {label}
            </button>
          ))}
        </nav>

        {/* Bottom Nav */}
        <div className="px-4 pb-4 space-y-1 border-t border-white/10 pt-4">
          {BOTTOM_NAV.map(({ id, label, icon: Icon }) => (
            <button
              key={id}
              onClick={() => navigate(id as View)}
              className={`w-full flex items-center gap-3.5 px-4 py-3 rounded-xl text-sm font-medium transition-colors ${
                view === id
                  ? "bg-[#F59E0B] text-white"
                  : "text-white/60 hover:text-white hover:bg-white/10"
              }`}
            >
              <Icon className="w-5 h-5 flex-shrink-0" />
              {label}
            </button>
          ))}

          {/* User + Logout */}
          <div className="mt-2 pt-4 border-t border-white/10 flex items-center gap-3 px-4">
            <div className="w-9 h-9 rounded-full bg-[#F59E0B] flex items-center justify-center flex-shrink-0">
              <span className="text-sm font-bold text-white">
                {(user?.name || user?.email || "P").charAt(0).toUpperCase()}
              </span>
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-semibold text-white truncate">{user?.name || "Professor"}</p>
              <p className="text-xs text-white/40 truncate">{user?.email}</p>
            </div>
            <button
              onClick={logout}
              title="Logout"
              className="text-white/40 hover:text-white transition-colors"
            >
              <LogOut className="w-4 h-4" />
            </button>
          </div>
        </div>
      </aside>

      {/* ── Main Area ────────────────────────────────────────────── */}
      <div className="flex-1 flex flex-col overflow-hidden">

        {/* Top Bar */}
        <header className="h-20 bg-white border-b border-gray-200 flex items-center justify-between px-10 flex-shrink-0">
          <div className="flex items-center gap-2 text-sm text-gray-500">
            <span className="text-base">Faculty Portal</span>
            <ChevronRight className="w-4 h-4" />
            <span className="text-base font-semibold text-gray-900">{viewLabel}</span>
          </div>
          <div className="flex items-center gap-4">
            <NotificationBell />
            <div className="w-9 h-9 rounded-full bg-[#F59E0B] flex items-center justify-center">
              <span className="text-sm font-bold text-white">
                {(user?.name || user?.email || "P").charAt(0).toUpperCase()}
              </span>
            </div>
          </div>
        </header>

        {/* Page Content */}
        <main className="flex-1 overflow-y-auto p-10">
          {view === "dashboard" && (
            <DashboardView
              user={user}
              stats={stats}
              loading={loading}
              onNavigate={navigate}
            />
          )}
          {view === "classes" && (
            <ClassList
              professorId={user?.id || ""}
              onViewClass={handleViewClass}
              onBack={() => navigate("dashboard")}
            />
          )}
          {view === "class-detail" && selectedClassId && (
            <ClassDetail
              classId={selectedClassId}
              professorId={user?.id || ""}
              onBack={() => navigate("classes")}
            />
          )}
          {view === "announcements" && <ProfessorAnnouncements />}
          {view === "grades"         && <ProfessorGrades />}
          {view === "schedule"       && <ProfessorSchedule />}
          {view === "students"       && <ProfessorStudents />}
          {view === "help"           && <ProfessorHelp />}
          {view === "settings"       && <ProfessorSettings />}
        </main>
      </div>
    </div>
  );
}

// ── Dashboard Home View ──────────────────────────────────────────
function DashboardView({
  user, stats, loading, onNavigate,
}: {
  user: any;
  stats: { totalClasses: number; totalStudents: number; pendingSubmissions: number };
  loading: boolean;
  onNavigate: (v: View) => void;
}) {
  return (
    <div className="space-y-10">
      {/* Page Title */}
      <div>
        <h1 className="text-3xl font-bold text-gray-900">
          Welcome back, {user?.name || "Professor"}!
        </h1>
        <p className="text-base text-gray-500 mt-2">{user?.email}</p>
      </div>

      {/* Stats */}
      {loading ? (
        <div className="grid grid-cols-3 gap-6">
          {[1,2,3].map(i => (
            <div key={i} className="bg-white rounded-2xl border border-gray-200 p-8 animate-pulse">
              <div className="h-5 bg-gray-200 rounded w-1/2 mb-5" />
              <div className="h-10 bg-gray-200 rounded w-1/3" />
            </div>
          ))}
        </div>
      ) : (
        <div className="grid grid-cols-3 gap-6">
          {[
            { icon: BookOpen,       label: "Total Classes",       value: stats.totalClasses,       color: "bg-amber-50 text-[#F59E0B]" },
            { icon: Users,          label: "Total Students",      value: stats.totalStudents,      color: "bg-blue-50 text-blue-600" },
            { icon: ClipboardCheck, label: "Pending Submissions", value: stats.pendingSubmissions, color: "bg-purple-50 text-purple-600" },
          ].map(({ icon: Icon, label, value, color }) => (
            <div key={label} className="bg-white rounded-2xl border border-gray-200 p-8 flex items-center gap-6">
              <div className={`w-16 h-16 rounded-2xl flex items-center justify-center flex-shrink-0 ${color}`}>
                <Icon className="w-8 h-8" />
              </div>
              <div>
                <p className="text-4xl font-bold text-gray-900">{value}</p>
                <p className="text-sm text-gray-500 mt-1">{label}</p>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Quick Actions */}
      <div>
        <h2 className="text-xl font-semibold text-gray-900 mb-5">Quick Actions</h2>
        <div className="grid grid-cols-2 gap-5">
          {[
            { icon: BookOpen,       label: "View My Classes",    sub: "Manage your assigned subjects",   view: "classes"       as View, color: "bg-amber-50 text-[#F59E0B]" },
            { icon: ClipboardCheck, label: "Encode Grades",      sub: "Input and submit student grades", view: "grades"        as View, color: "bg-green-50 text-green-600" },
            { icon: Megaphone,      label: "Post Announcement",  sub: "Notify your students",            view: "announcements" as View, color: "bg-blue-50 text-blue-600" },
            { icon: Users,          label: "My Students",        sub: "View enrolled students",          view: "students"      as View, color: "bg-purple-50 text-purple-600" },
            { icon: Calendar,       label: "My Schedule",        sub: "View your weekly timetable",      view: "schedule"      as View, color: "bg-rose-50 text-rose-600" },
          ].map(({ icon: Icon, label, sub, view, color }) => (
            <button
              key={label}
              onClick={() => onNavigate(view)}
              className="bg-white rounded-2xl border border-gray-200 p-6 flex items-center gap-5 hover:border-[#F59E0B] hover:shadow-md transition-all text-left group"
            >
              <div className={`w-14 h-14 rounded-2xl flex items-center justify-center flex-shrink-0 ${color}`}>
                <Icon className="w-7 h-7" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-base font-semibold text-gray-900 group-hover:text-[#F59E0B] transition-colors">{label}</p>
                <p className="text-sm text-gray-500 mt-1">{sub}</p>
              </div>
              <ChevronRight className="w-5 h-5 text-gray-400 group-hover:text-[#F59E0B] transition-colors flex-shrink-0" />
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
