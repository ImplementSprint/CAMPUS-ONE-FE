'use client'
import { useState, useEffect } from "react";
import { getCurrentUser, logout } from "@/shared/auth.service";
import { LogOut, BookOpen, Users, ClipboardCheck, Bell, Settings, HelpCircle, Menu, X, BarChart3, Calendar } from "lucide-react";
import { getProfessorClasses, getProfessorStats } from "@/professor/services/professor.service";
import { ClassList } from "../components/ClassList";
import { ClassDetail } from "../components/ClassDetail";

type View = "dashboard" | "classes" | "class-detail";

export function ProfessorDashboard() {
  const user = getCurrentUser();
  const [view, setView] = useState<View>("dashboard");
  const [selectedClassId, setSelectedClassId] = useState<string | null>(null);
  const [stats, setStats] = useState({ totalClasses: 0, totalStudents: 0, pendingSubmissions: 0 });
  const [loading, setLoading] = useState(true);
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    // Check if mobile
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
      setSidebarOpen(window.innerWidth >= 768);
    };
    
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  useEffect(() => {
    if (user?.id) {
      loadStats();
    }
  }, [user]);

  const loadStats = async () => {
    if (!user?.id) return;
    setLoading(true);
    const result = await getProfessorStats(user.id);
    if (result.data) {
      setStats(result.data);
    }
    setLoading(false);
  };

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
    if (isMobile) {
      setSidebarOpen(false);
    }
  };

  return (
    <div className="flex h-screen bg-gray-50 overflow-hidden">
      {/* Mobile Overlay */}
      {isMobile && sidebarOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-30 md:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside
        className={`fixed md:relative z-40 h-screen w-64 bg-gradient-to-b from-[#1a1a1a] to-[#0f0f0f] text-white flex flex-col transition-transform duration-300 ease-in-out ${
          sidebarOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'
        }`}
      >
        {/* Logo Section */}
        <div className="px-6 py-6 border-b border-gray-700">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 bg-[#F59E0B] rounded-lg flex items-center justify-center">
                <BookOpen className="w-5 h-5 text-black" />
              </div>
              <div>
                <div className="text-sm font-bold">
                  <span className="text-[#F59E0B]">CAMPUS</span>
                  <span className="text-white"> Faculty</span>
                </div>
                <p className="text-xs text-gray-400">Professor Portal</p>
              </div>
            </div>
            {isMobile && (
              <button
                onClick={() => setSidebarOpen(false)}
                className="md:hidden p-1 hover:bg-gray-700 rounded-lg transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            )}
          </div>
        </div>

        {/* Navigation */}
        <nav className="flex-1 px-4 py-6 space-y-2 overflow-y-auto">
          {/* Main Section */}
          <div className="space-y-1">
            <NavButton
              icon={<BarChart3 className="w-5 h-5" />}
              label="Dashboard"
              active={view === "dashboard"}
              onClick={() => {
                setView("dashboard");
                handleNavClick();
              }}
            />
            <NavButton
              icon={<BookOpen className="w-5 h-5" />}
              label="My Classes"
              active={view === "classes"}
              onClick={() => {
                setView("classes");
                handleNavClick();
              }}
            />
          </div>

          {/* Divider */}
          <div className="h-px bg-gray-700 my-4"></div>

          {/* Management Section */}
          <div className="space-y-1">
            <NavButton
              icon={<Users className="w-5 h-5" />}
              label="Students"
              active={false}
              onClick={handleNavClick}
            />
            <NavButton
              icon={<ClipboardCheck className="w-5 h-5" />}
              label="Encode Grades"
              active={false}
              onClick={handleNavClick}
            />
            <NavButton
              icon={<Bell className="w-5 h-5" />}
              label="Announcements"
              active={false}
              onClick={handleNavClick}
            />
            <NavButton
              icon={<Calendar className="w-5 h-5" />}
              label="Schedule"
              active={false}
              onClick={handleNavClick}
            />
          </div>

          {/* Divider */}
          <div className="h-px bg-gray-700 my-4"></div>

          {/* Settings Section */}
          <div className="space-y-1">
            <NavButton
              icon={<Settings className="w-5 h-5" />}
              label="Settings"
              active={false}
              onClick={handleNavClick}
            />
            <NavButton
              icon={<HelpCircle className="w-5 h-5" />}
              label="Help & Support"
              active={false}
              onClick={handleNavClick}
            />
          </div>
        </nav>

        {/* User Section */}
        <div className="px-4 py-4 border-t border-gray-700">
          <div className="mb-4 pb-4 border-b border-gray-700">
            <p className="text-xs text-gray-400 mb-1">Logged in as</p>
            <p className="text-sm font-semibold text-white truncate">{user?.name || user?.email}</p>
          </div>
          <button
            onClick={logout}
            className="w-full flex items-center gap-3 px-4 py-3 rounded-lg text-red-400 hover:bg-red-500/10 transition-colors font-medium text-sm"
          >
            <LogOut className="w-5 h-5" />
            <span>Log Out</span>
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Top Navbar */}
        <header className="bg-white border-b border-gray-200 px-6 py-4 flex items-center justify-between flex-shrink-0">
          <div className="flex items-center gap-4">
            <button
              onClick={() => setSidebarOpen(!sidebarOpen)}
              className="md:hidden p-2 hover:bg-gray-100 rounded-lg transition-colors"
            >
              <Menu className="w-6 h-6 text-gray-700" />
            </button>
            <div>
              <h1 className="text-2xl font-bold text-gray-900">
                {view === "dashboard" && "Dashboard"}
                {view === "classes" && "My Classes"}
                {view === "class-detail" && "Class Details"}
              </h1>
              <p className="text-sm text-gray-500 mt-0.5">Welcome back, Professor</p>
            </div>
          </div>
        </header>

        {/* Content Area */}
        <main className="flex-1 overflow-y-auto">
          {view === "dashboard" && (
            <DashboardView
              user={user}
              stats={stats}
              loading={loading}
              onViewClasses={() => setView("classes")}
            />
          )}

          {view === "classes" && (
            <ClassList
              professorId={user?.id || ""}
              onViewClass={handleViewClass}
              onBack={handleBackToDashboard}
            />
          )}

          {view === "class-detail" && selectedClassId && (
            <ClassDetail
              classId={selectedClassId}
              professorId={user?.id || ""}
              onBack={handleBackToClasses}
            />
          )}
        </main>
      </div>
    </div>
  );
}

// Navigation Button Component
function NavButton({
  icon,
  label,
  active,
  onClick,
}: {
  icon: React.ReactNode;
  label: string;
  active: boolean;
  onClick: () => void;
}) {
  return (
    <button
      onClick={onClick}
      className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-all duration-200 ${
        active
          ? 'bg-[#F59E0B] text-white shadow-lg shadow-[#F59E0B]/20'
          : 'text-gray-300 hover:bg-gray-800 hover:text-white'
      }`}
    >
      {icon}
      <span className="font-medium text-sm">{label}</span>
    </button>
  );
}

// Dashboard View Component
function DashboardView({
  user,
  stats,
  loading,
  onViewClasses,
}: {
  user: any;
  stats: any;
  loading: boolean;
  onViewClasses: () => void;
}) {
  return (
    <div className="p-6 md:p-8 max-w-7xl mx-auto">
      {/* Welcome Section */}
      <div className="mb-8">
        <h2 className="text-3xl font-bold text-gray-900 mb-2">Welcome back, Professor!</h2>
        <p className="text-gray-600">{user?.name || user?.email}</p>
      </div>

      {/* Stats Grid */}
      {loading ? (
        <div className="flex items-center justify-center py-16">
          <div className="text-center">
            <div className="w-12 h-12 border-4 border-[#F59E0B] border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
            <p className="text-gray-600">Loading statistics...</p>
          </div>
        </div>
      ) : (
        <>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            {/* Classes Card */}
            <div className="bg-white rounded-xl p-6 border border-gray-200 hover:shadow-lg transition-shadow">
              <div className="flex items-start justify-between mb-4">
                <div className="w-12 h-12 bg-[#F59E0B]/10 rounded-lg flex items-center justify-center">
                  <BookOpen className="w-6 h-6 text-[#F59E0B]" />
                </div>
                <span className="text-xs font-semibold text-[#F59E0B] bg-[#F59E0B]/10 px-3 py-1 rounded-full">Active</span>
              </div>
              <p className="text-gray-600 text-sm mb-1">Total Classes</p>
              <p className="text-4xl font-bold text-gray-900">{stats.totalClasses}</p>
              <p className="text-xs text-gray-500 mt-3">Classes assigned this semester</p>
            </div>

            {/* Students Card */}
            <div className="bg-white rounded-xl p-6 border border-gray-200 hover:shadow-lg transition-shadow">
              <div className="flex items-start justify-between mb-4">
                <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                  <Users className="w-6 h-6 text-blue-600" />
                </div>
                <span className="text-xs font-semibold text-blue-600 bg-blue-100 px-3 py-1 rounded-full">Total</span>
              </div>
              <p className="text-gray-600 text-sm mb-1">Total Students</p>
              <p className="text-4xl font-bold text-gray-900">{stats.totalStudents}</p>
              <p className="text-xs text-gray-500 mt-3">Across all your classes</p>
            </div>

            {/* Pending Card */}
            <div className="bg-white rounded-xl p-6 border border-gray-200 hover:shadow-lg transition-shadow">
              <div className="flex items-start justify-between mb-4">
                <div className="w-12 h-12 bg-red-100 rounded-lg flex items-center justify-center">
                  <ClipboardCheck className="w-6 h-6 text-red-600" />
                </div>
                <span className="text-xs font-semibold text-red-600 bg-red-100 px-3 py-1 rounded-full">Pending</span>
              </div>
              <p className="text-gray-600 text-sm mb-1">Pending Submissions</p>
              <p className="text-4xl font-bold text-gray-900">{stats.pendingSubmissions}</p>
              <p className="text-xs text-gray-500 mt-3">Awaiting your review</p>
            </div>
          </div>

          {/* Quick Actions Section */}
          <div className="mb-8">
            <h3 className="text-lg font-bold text-gray-900 mb-4">Quick Actions</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <button
                onClick={onViewClasses}
                className="bg-white rounded-xl p-5 border border-gray-200 hover:border-[#F59E0B] hover:shadow-lg transition-all group"
              >
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 bg-[#F59E0B]/10 rounded-lg flex items-center justify-center group-hover:bg-[#F59E0B]/20 transition-colors">
                    <BookOpen className="w-6 h-6 text-[#F59E0B]" />
                  </div>
                  <div className="text-left flex-1">
                    <p className="font-semibold text-gray-900 text-sm">View My Classes</p>
                    <p className="text-xs text-gray-600 mt-1">Manage your assigned subjects</p>
                  </div>
                </div>
              </button>

              <button className="bg-white rounded-xl p-5 border border-gray-200 hover:border-[#F59E0B] hover:shadow-lg transition-all group">
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 bg-[#F59E0B]/10 rounded-lg flex items-center justify-center group-hover:bg-[#F59E0B]/20 transition-colors">
                    <ClipboardCheck className="w-6 h-6 text-[#F59E0B]" />
                  </div>
                  <div className="text-left flex-1">
                    <p className="font-semibold text-gray-900 text-sm">Encode Grades</p>
                    <p className="text-xs text-gray-600 mt-1">Input and manage student grades</p>
                  </div>
                </div>
              </button>

              <button className="bg-white rounded-xl p-5 border border-gray-200 hover:border-[#F59E0B] hover:shadow-lg transition-all group">
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 bg-[#F59E0B]/10 rounded-lg flex items-center justify-center group-hover:bg-[#F59E0B]/20 transition-colors">
                    <Bell className="w-6 h-6 text-[#F59E0B]" />
                  </div>
                  <div className="text-left flex-1">
                    <p className="font-semibold text-gray-900 text-sm">Post Announcement</p>
                    <p className="text-xs text-gray-600 mt-1">Notify your students</p>
                  </div>
                </div>
              </button>
            </div>
          </div>

          {/* Info Section */}
          <div className="bg-gradient-to-r from-[#F59E0B]/10 to-amber-50 border border-[#F59E0B]/20 rounded-xl p-6">
            <div className="flex items-start gap-4">
              <div className="w-10 h-10 bg-[#F59E0B] rounded-lg flex items-center justify-center flex-shrink-0">
                <BookOpen className="w-6 h-6 text-white" />
              </div>
              <div>
                <h3 className="font-bold text-gray-900 mb-1">Professor Dashboard</h3>
                <p className="text-sm text-gray-700 leading-relaxed">
                  Manage your classes, students, grades, and announcements all in one place. Use the sidebar to navigate between different sections of your dashboard.
                </p>
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
}
