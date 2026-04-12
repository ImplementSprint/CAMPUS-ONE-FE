'use client'
import { useState, useEffect } from "react";
import { getCurrentUser, logout } from "@/services/auth.service";
import { LogOut, BookOpen, Users, ClipboardCheck, Bell, Menu, X } from "lucide-react";
import { getProfessorClasses, getProfessorStats } from "../services/professor.service";
import { ClassList } from "../components/ClassList";
import { ClassDetail } from "../components/ClassDetail";

type View = "dashboard" | "classes" | "class-detail";

export function ProfessorDashboard() {
  const user = getCurrentUser();
  const [view, setView] = useState<View>("dashboard");
  const [selectedClassId, setSelectedClassId] = useState<string | null>(null);
  const [stats, setStats] = useState({ totalClasses: 0, totalStudents: 0, pendingSubmissions: 0 });
  const [loading, setLoading] = useState(true);
  const [menuOpen, setMenuOpen] = useState(false);

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
    setMenuOpen(false);
  };

  const handleBackToDashboard = () => {
    setView("dashboard");
    setSelectedClassId(null);
  };

  const handleBackToClasses = () => {
    setView("classes");
    setSelectedClassId(null);
  };

  return (
    <div className="w-screen h-screen overflow-hidden bg-gray-100">
      <div className="relative h-screen w-full max-w-[430px] mx-auto flex flex-col bg-gray-100">
        {/* Header */}
        <header className="bg-[#1a1a1a] text-white h-14 flex items-center justify-between px-4 flex-shrink-0 relative z-50">
          <button
            onClick={() => setMenuOpen(!menuOpen)}
            className="w-9 h-9 flex items-center justify-center rounded-lg hover:bg-white/10 transition-colors"
          >
            {menuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>

          <div className="flex items-center gap-0.5">
            <span className="text-[#F59E0B] font-bold text-base tracking-tight">CAMPUS</span>
            <span className="text-white font-light text-base tracking-tight">Faculty</span>
          </div>

          <button
            onClick={logout}
            className="w-9 h-9 flex items-center justify-center rounded-lg hover:bg-white/10 transition-colors"
          >
            <LogOut className="w-5 h-5" />
          </button>
        </header>

        {/* Side Menu */}
        {menuOpen && (
          <>
            <div
              className="fixed inset-0 bg-black/50 z-30"
              onClick={() => setMenuOpen(false)}
            />
            <div className="fixed top-14 left-0 w-64 bg-white shadow-lg z-40 rounded-r-xl">
              <div className="p-4 space-y-2">
                <button
                  onClick={() => {
                    setView("dashboard");
                    setMenuOpen(false);
                  }}
                  className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${
                    view === "dashboard"
                      ? "bg-[#F59E0B] text-white"
                      : "text-gray-700 hover:bg-gray-100"
                  }`}
                >
                  <BookOpen className="w-5 h-5" />
                  <span className="font-medium text-sm">Dashboard</span>
                </button>

                <button
                  onClick={() => {
                    setView("classes");
                    setMenuOpen(false);
                  }}
                  className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${
                    view === "classes"
                      ? "bg-[#F59E0B] text-white"
                      : "text-gray-700 hover:bg-gray-100"
                  }`}
                >
                  <Users className="w-5 h-5" />
                  <span className="font-medium text-sm">My Classes</span>
                </button>
              </div>
            </div>
          </>
        )}

        {/* Content */}
        <div className="flex-1 overflow-y-auto">
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
        </div>
      </div>
    </div>
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
    <div className="px-4 py-6 space-y-4">
      {/* Welcome Section */}
      <div className="bg-white rounded-xl p-4 border border-gray-100">
        <h1 className="text-lg font-bold text-gray-900 mb-1">Welcome, Professor!</h1>
        <p className="text-sm text-gray-600">{user?.name || user?.email}</p>
      </div>

      {/* Stats Cards */}
      {loading ? (
        <div className="text-center py-8">
          <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-[#F59E0B] mx-auto"></div>
          <p className="text-sm text-gray-600 mt-3">Loading...</p>
        </div>
      ) : (
        <div className="grid grid-cols-3 gap-3">
          <div className="bg-white rounded-xl p-4 border border-gray-100 text-center">
            <BookOpen className="w-6 h-6 text-[#F59E0B] mx-auto mb-2" />
            <p className="text-2xl font-bold text-gray-900">{stats.totalClasses}</p>
            <p className="text-xs text-gray-600 mt-1">Classes</p>
          </div>

          <div className="bg-white rounded-xl p-4 border border-gray-100 text-center">
            <Users className="w-6 h-6 text-[#F59E0B] mx-auto mb-2" />
            <p className="text-2xl font-bold text-gray-900">{stats.totalStudents}</p>
            <p className="text-xs text-gray-600 mt-1">Students</p>
          </div>

          <div className="bg-white rounded-xl p-4 border border-gray-100 text-center">
            <ClipboardCheck className="w-6 h-6 text-[#F59E0B] mx-auto mb-2" />
            <p className="text-2xl font-bold text-gray-900">{stats.pendingSubmissions}</p>
            <p className="text-xs text-gray-600 mt-1">Pending</p>
          </div>
        </div>
      )}

      {/* Quick Actions */}
      <div className="space-y-3">
        <h2 className="text-sm font-bold text-gray-900">Quick Actions</h2>

        <button
          onClick={onViewClasses}
          className="w-full bg-white rounded-xl p-4 border border-gray-100 hover:bg-gray-50 active:bg-gray-100 transition-colors flex items-center gap-3"
        >
          <div className="w-10 h-10 bg-[#F59E0B]/10 rounded-lg flex items-center justify-center">
            <BookOpen className="w-5 h-5 text-[#F59E0B]" />
          </div>
          <div className="flex-1 text-left">
            <p className="text-sm font-semibold text-gray-900">View My Classes</p>
            <p className="text-xs text-gray-600">Manage your assigned subjects</p>
          </div>
        </button>

        <button className="w-full bg-white rounded-xl p-4 border border-gray-100 hover:bg-gray-50 active:bg-gray-100 transition-colors flex items-center gap-3">
          <div className="w-10 h-10 bg-[#F59E0B]/10 rounded-lg flex items-center justify-center">
            <ClipboardCheck className="w-5 h-5 text-[#F59E0B]" />
          </div>
          <div className="flex-1 text-left">
            <p className="text-sm font-semibold text-gray-900">Encode Grades</p>
            <p className="text-xs text-gray-600">Input student grades</p>
          </div>
        </button>

        <button className="w-full bg-white rounded-xl p-4 border border-gray-100 hover:bg-gray-50 active:bg-gray-100 transition-colors flex items-center gap-3">
          <div className="w-10 h-10 bg-[#F59E0B]/10 rounded-lg flex items-center justify-center">
            <Bell className="w-5 h-5 text-[#F59E0B]" />
          </div>
          <div className="flex-1 text-left">
            <p className="text-sm font-semibold text-gray-900">Post Announcement</p>
            <p className="text-xs text-gray-600">Notify your students</p>
          </div>
        </button>
      </div>

      {/* Info Box */}
      <div className="bg-purple-50 border border-purple-200 rounded-xl p-4">
        <h3 className="text-sm font-bold text-purple-900 mb-2">Professor Module</h3>
        <p className="text-xs text-purple-700 leading-relaxed">
          Manage your classes, students, grades, and announcements all in one place.
        </p>
      </div>
    </div>
  );
}
