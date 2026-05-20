"use client"
import { useState, useEffect } from "react";
import { getCurrentUser, logout } from "@/services/auth.service";
import { LogOut, BookOpen, Users, ClipboardCheck, Bell, Settings, HelpCircle, Menu, X, BarChart3, Calendar } from "lucide-react";
import { getProfessorStats } from "../services/professor.service";
import { ClassList } from "../components/ClassList";
import { ClassDetail } from "../components/ClassDetail";
import { ProfessorStudents } from "./ProfessorStudents";
import { ProfessorGrades } from "./ProfessorGrades";
import { ProfessorAnnouncements } from "./ProfessorAnnouncements";
import { ProfessorSchedule } from "./ProfessorSchedule";
import { ProfessorSettings } from "./ProfessorSettings";
import { ProfessorHelp } from "./ProfessorHelp";

type View = "dashboard" | "classes" | "class-detail" | "students" | "grades" | "announcements" | "schedule" | "settings" | "help";

export function ProfessorDashboard() {
  const user = getCurrentUser();
  const [view, setView] = useState<View>("dashboard");
  const [selectedClassId, setSelectedClassId] = useState<string | null>(null);
  const [stats, setStats] = useState({ totalClasses: 0, totalStudents: 0, pendingSubmissions: 0 });
  const [loading, setLoading] = useState(true);
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
      setSidebarOpen(window.innerWidth >= 768);
    };
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  useEffect(() => {
    if (user?.id) loadStats();
  }, [user?.id]);

  async function loadStats() {
    if (!user?.id) return;
    setLoading(true);
    try {
      const result = await getProfessorStats(user.id);
      if (result.data) setStats(result.data);
    } finally {
      setLoading(false);
    }
  }

  const handleViewClass = (classId: string) => {
    setSelectedClassId(classId);
    setView("class-detail");
  };

  const handleBackToDashboard = () => {
    setView("dashboard");
    setSelectedClassId(null);
  };

  const handleBackToClasses = () => {
    setView("classes");
    setSelectedClassId(null);
  };

  const handleNavClick = () => {
    if (isMobile) setSidebarOpen(false);
  };

  return (
    <div className="flex h-screen bg-gray-50 overflow-hidden">
      {isMobile && sidebarOpen && (
        <div className="fixed inset-0 bg-black/50 z-30 md:hidden" onClick={() => setSidebarOpen(false)} />
      )}

      <aside className={`fixed md:relative z-40 h-screen w-64 bg-gradient-to-b from-[#1a1a1a] to-[#0f0f0f] text-white flex flex-col transition-transform duration-300 ease-in-out ${sidebarOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'}`}>
        <div className="px-6 py-6 border-b border-gray-700">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <img src="/logo.png" alt="Campus One" className="w-8 h-8 object-contain" />
              <div>
                <div className="text-sm font-bold">
                  <span className="text-[#F59E0B]">CAMPUS</span>
                  <span className="text-white"> Faculty</span>
                </div>
                <p className="text-xs text-gray-400">Professor Portal</p>
              </div>
            </div>
            {isMobile && (
              <button onClick={() => setSidebarOpen(false)} className="md:hidden p-1 hover:bg-gray-700 rounded-lg transition-colors"><X className="w-5 h-5" /></button>
            )}
          </div>
        </div>

        <nav className="flex-1 px-4 py-6 space-y-2 overflow-y-auto">
          <div className="space-y-1">
            <NavButton icon={<BarChart3 className="w-5 h-5" />} label="Dashboard" active={view === "dashboard"} onClick={() => { setView("dashboard"); handleNavClick(); }} />
            <NavButton icon={<BookOpen className="w-5 h-5" />} label="My Classes" active={view === "classes"} onClick={() => { setView("classes"); handleNavClick(); }} />
          </div>

          <div className="h-px bg-gray-700 my-4" />

          <div className="space-y-1">
            <NavButton icon={<Users className="w-5 h-5" />} label="Students" active={view === "students"} onClick={() => { setView("students"); handleNavClick(); }} />
            <NavButton icon={<ClipboardCheck className="w-5 h-5" />} label="Encode Grades" active={view === "grades"} onClick={() => { setView("grades"); handleNavClick(); }} />
            <NavButton icon={<Bell className="w-5 h-5" />} label="Announcements" active={view === "announcements"} onClick={() => { setView("announcements"); handleNavClick(); }} />
            <NavButton icon={<Calendar className="w-5 h-5" />} label="Schedule" active={view === "schedule"} onClick={() => { setView("schedule"); handleNavClick(); }} />
          </div>

          <div className="h-px bg-gray-700 my-4" />

          <div className="space-y-1">
            <NavButton icon={<Settings className="w-5 h-5" />} label="Settings" active={view === "settings"} onClick={() => { setView("settings"); handleNavClick(); }} />
            <NavButton icon={<HelpCircle className="w-5 h-5" />} label="Help & Support" active={view === "help"} onClick={() => { setView("help"); handleNavClick(); }} />
          </div>
        </nav>

        <div className="px-4 py-4 border-t border-gray-700">
          <div className="mb-4 pb-4 border-b border-gray-700">
            <p className="text-xs text-gray-400 mb-1">Logged in as</p>
            <p className="text-sm font-semibold text-white truncate">{user?.name || user?.email}</p>
          </div>
          <button onClick={logout} className="w-full flex items-center gap-3 px-4 py-3 rounded-lg text-red-400 hover:bg-red-500/10 transition-colors font-medium text-sm">
            <LogOut className="w-5 h-5" />
            <span>Log Out</span>
          </button>
        </div>
      </aside>

      <div className="flex-1 flex flex-col overflow-hidden">
        <header className="bg-white border-b border-gray-200 px-6 py-4 flex items-center justify-between flex-shrink-0">
          <div className="flex items-center gap-4">
            <button onClick={() => setSidebarOpen(!sidebarOpen)} className="md:hidden p-2 hover:bg-gray-100 rounded-lg transition-colors"><Menu className="w-6 h-6 text-gray-700" /></button>
            <div>
              <h1 className="text-2xl font-bold text-gray-900">{view === "dashboard" ? "Dashboard" : view === "classes" ? "My Classes" : "Class Details"}</h1>
              <p className="text-sm text-gray-500 mt-0.5">Welcome back, Professor</p>
            </div>
          </div>
        </header>

        <main className="flex-1 overflow-y-auto">
          {view === "dashboard" && <DashboardView user={user} stats={stats} loading={loading} onViewClasses={() => setView("classes")} onViewGrades={() => setView("grades")} onViewAnnouncements={() => setView("announcements")} onViewStudents={() => setView("students")} onViewSchedule={() => setView("schedule")} />}
          {view === "classes" && <ClassList professorId={user?.id || ""} onViewClass={handleViewClass} onBack={handleBackToDashboard} />}
          {view === "class-detail" && selectedClassId && <ClassDetail classId={selectedClassId} professorId={user?.id || ""} onBack={handleBackToClasses} />}
          {view === "students" && <div className="p-6 md:p-8"><ProfessorStudents /></div>}
          {view === "grades" && <div className="p-6 md:p-8"><ProfessorGrades /></div>}
          {view === "announcements" && <div className="p-6 md:p-8"><ProfessorAnnouncements /></div>}
          {view === "schedule" && <div className="p-6 md:p-8"><ProfessorSchedule /></div>}
          {view === "settings" && <div className="p-6 md:p-8"><ProfessorSettings /></div>}
          {view === "help" && <div className="p-6 md:p-8"><ProfessorHelp /></div>}
        </main>
      </div>
    </div>
  );
}

function NavButton({ icon, label, active, onClick }: { icon: React.ReactNode; label: string; active: boolean; onClick: () => void }) {
  return (
    <button onClick={onClick} className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-all duration-200 ${active ? 'bg-[#F59E0B] text-white shadow-lg shadow-[#F59E0B]/20' : 'text-gray-300 hover:bg-gray-800 hover:text-white'}`}>
      {icon}
      <span className="font-medium text-sm">{label}</span>
    </button>
  );
}

function DashboardView({ user, stats, loading, onViewClasses, onViewGrades, onViewAnnouncements, onViewStudents, onViewSchedule }: { user: any; stats: any; loading: boolean; onViewClasses: () => void; onViewGrades: () => void; onViewAnnouncements: () => void; onViewStudents: () => void; onViewSchedule: () => void }) {
  const quickActions = [
    {
      label: "View My Classes",
      description: "Manage your assigned subjects",
      icon: BookOpen,
      onClick: onViewClasses,
      accent: "bg-amber-50 text-[#F59E0B] group-hover:bg-[#F59E0B] group-hover:text-white",
      borderHover: "hover:border-amber-200",
      arrowHover: "group-hover:text-[#F59E0B]",
    },
    {
      label: "Encode Grades",
      description: "Input and manage student grades",
      icon: ClipboardCheck,
      onClick: onViewGrades,
      accent: "bg-emerald-50 text-emerald-600 group-hover:bg-emerald-500 group-hover:text-white",
      borderHover: "hover:border-emerald-200",
      arrowHover: "group-hover:text-emerald-500",
    },
    {
      label: "Post Announcement",
      description: "Notify your students",
      icon: Bell,
      onClick: onViewAnnouncements,
      accent: "bg-blue-50 text-blue-600 group-hover:bg-blue-500 group-hover:text-white",
      borderHover: "hover:border-blue-200",
      arrowHover: "group-hover:text-blue-500",
    },
    {
      label: "My Students",
      description: "View enrolled students",
      icon: Users,
      onClick: onViewStudents,
      accent: "bg-purple-50 text-purple-600 group-hover:bg-purple-500 group-hover:text-white",
      borderHover: "hover:border-purple-200",
      arrowHover: "group-hover:text-purple-500",
    },
    {
      label: "My Schedule",
      description: "View your weekly timetable",
      icon: Calendar,
      onClick: onViewSchedule,
      accent: "bg-rose-50 text-rose-600 group-hover:bg-rose-500 group-hover:text-white",
      borderHover: "hover:border-rose-200",
      arrowHover: "group-hover:text-rose-500",
    },
  ];

  return (
    <div className="w-full px-6 py-6 md:px-8 md:py-8 lg:px-10 lg:py-10">
      <div className="mb-10 md:mb-12">
        <h2 className="text-[30px] md:text-[32px] font-bold text-gray-900 mb-2">Welcome back, Professor!</h2>
        <p className="text-sm text-gray-600">{user?.name || user?.email}</p>
      </div>

      {loading ? (
        <div className="flex items-center justify-center py-20 md:py-24">
          <div className="text-center">
            <div className="w-12 h-12 border-4 border-[#F59E0B] border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
            <p className="text-gray-600">Loading statistics...</p>
          </div>
        </div>
      ) : (
        <>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-8 mb-10 md:mb-12">
            <div className="bg-white rounded-2xl p-6 border border-gray-200 hover:shadow-lg transition-shadow min-h-[124px]">
              <div className="flex items-center gap-4">
                <div className="w-14 h-14 bg-[#F59E0B]/10 rounded-xl flex items-center justify-center shrink-0">
                  <BookOpen className="w-6 h-6 text-[#F59E0B]" />
                </div>
                <div className="flex-1">
                  <p className="text-3xl font-bold text-gray-900 leading-none">{stats.totalClasses}</p>
                  <p className="text-sm text-gray-600 mt-2">Total Classes</p>
                  <p className="text-xs text-gray-500 mt-1.5">Classes assigned this semester</p>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-2xl p-6 border border-gray-200 hover:shadow-lg transition-shadow min-h-[124px]">
              <div className="flex items-center gap-4">
                <div className="w-14 h-14 bg-blue-100 rounded-xl flex items-center justify-center shrink-0">
                  <Users className="w-6 h-6 text-blue-600" />
                </div>
                <div className="flex-1">
                  <p className="text-3xl font-bold text-gray-900 leading-none">{stats.totalStudents}</p>
                  <p className="text-sm text-gray-600 mt-2">Total Students</p>
                  <p className="text-xs text-gray-500 mt-1.5">Across all your classes</p>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-2xl p-6 border border-gray-200 hover:shadow-lg transition-shadow min-h-[124px]">
              <div className="flex items-center gap-4">
                <div className="w-14 h-14 bg-red-100 rounded-xl flex items-center justify-center shrink-0">
                  <ClipboardCheck className="w-6 h-6 text-red-600" />
                </div>
                <div className="flex-1">
                  <p className="text-3xl font-bold text-gray-900 leading-none">{stats.pendingSubmissions}</p>
                  <p className="text-sm text-gray-600 mt-2">Pending Submissions</p>
                  <p className="text-xs text-gray-500 mt-1.5">Awaiting your review</p>
                </div>
              </div>
            </div>
          </div>

          <div className="mb-10 md:mb-12">
            <h3 className="text-lg font-bold text-gray-900 mb-5">Quick Actions</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6">
              {quickActions.map(({ label, description, icon: Icon, onClick, accent, borderHover, arrowHover }) => (
                <button
                  key={label}
                  onClick={onClick}
                  className={`group flex items-center justify-between rounded-2xl border border-gray-200 bg-white px-7 py-5 min-h-[84px] transition-all hover:shadow-lg ${borderHover}`}
                >
                  <div className="flex items-center gap-5">
                    <div className={`flex h-14 w-14 items-center justify-center rounded-xl transition-colors ${accent}`}>
                      <Icon className="h-7 w-7" />
                    </div>
                    <div className="text-left">
                      <p className="text-[15px] font-semibold text-gray-900">{label}</p>
                      <p className="mt-1 text-sm text-gray-600">{description}</p>
                    </div>
                  </div>
                  <span className={`text-[28px] leading-none text-gray-300 transition-colors ${arrowHover}`}>›</span>
                </button>
              ))}
            </div>
          </div>
        </>
      )}
    </div>
  );
}
