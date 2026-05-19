'use client'
import { useState, useEffect } from "react";
import { UnifiedAdminLayout } from "../components/UnifiedAdminLayout";
import { StudentList } from "../components/StudentList";
import { StudentDetail } from "../components/StudentDetail";
import { Users, CheckCircle, XCircle, Clock, GraduationCap } from "lucide-react";
import { fetchStudentStats, type StudentStats } from "../services/student-admin.service";

interface StudentAdminDashboardProps {
  onSwitchPortal: (portal: "applicant" | "student") => void;
}

export function StudentAdminDashboard({ onSwitchPortal }: StudentAdminDashboardProps) {
  const [selectedStudentId, setSelectedStudentId] = useState<string | null>(null);
  const [view, setView] = useState<"dashboard" | "students">("dashboard");
  const [stats, setStats] = useState<StudentStats>({
    total: 0,
    active: 0,
    inactive: 0,
    pending: 0,
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadStats();
  }, []);

  const loadStats = async () => {
    setLoading(true);
    const result = await fetchStudentStats();
    if (result.data) {
      setStats(result.data);
    }
    setLoading(false);
  };

  const handleSelectStudent = (id: string) => {
    setSelectedStudentId(id);
  };

  const handleBackFromDetail = () => {
    setSelectedStudentId(null);
    loadStats();
  };

  const currentView = selectedStudentId ? "detail" : view;

  const handleNavigate = (newView: string) => {
    if (newView === "dashboard" || newView === "students") {
      setView(newView as "dashboard" | "students");
      setSelectedStudentId(null);
    }
  };

  return (
    <UnifiedAdminLayout
      currentPortal="student"
      currentView={currentView}
      onNavigate={handleNavigate}
      onSwitchPortal={onSwitchPortal}
    >
      {selectedStudentId ? (
        <div className="p-8">
          <StudentDetail
            studentId={selectedStudentId}
            onBack={handleBackFromDetail}
          />
        </div>
      ) : view === "dashboard" ? (
        <div className="p-10">
          {loading ? (
            <div className="flex items-center justify-center py-32">
              <div className="text-center">
                <div className="relative">
                  <div className="animate-spin rounded-full h-16 w-16 border-4 border-gray-200 border-t-[#F59E0B] mx-auto"></div>
                  <div className="absolute inset-0 flex items-center justify-center">
                    <GraduationCap className="w-6 h-6 text-[#F59E0B]" />
                  </div>
                </div>
                <p className="mt-6 text-sm font-medium text-gray-600">Loading dashboard...</p>
              </div>
            </div>
          ) : (
            <div className="space-y-8">
              {/* Stats Cards */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {/* Total Students */}
                <div className="group relative bg-white rounded-2xl p-6 border border-gray-200 shadow-sm hover:shadow-xl hover:border-blue-300 transition-all duration-300 overflow-hidden">
                  <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-blue-50 to-transparent rounded-full -mr-16 -mt-16 opacity-50"></div>
                  <div className="relative">
                    <div className="flex items-center justify-between mb-4">
                      <div className="p-3 bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl shadow-lg shadow-blue-500/30">
                        <GraduationCap className="w-6 h-6 text-white" />
                      </div>
                      <span className="text-xs font-semibold text-blue-600 bg-blue-50 px-3 py-1 rounded-full">All</span>
                    </div>
                    <p className="text-4xl font-bold text-gray-900 mb-1">{stats.total}</p>
                    <p className="text-sm font-medium text-gray-600">Total Students</p>
                  </div>
                </div>

                {/* Active Students */}
                <div className="group relative bg-white rounded-2xl p-6 border border-gray-200 shadow-sm hover:shadow-xl hover:border-green-300 transition-all duration-300 overflow-hidden">
                  <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-green-50 to-transparent rounded-full -mr-16 -mt-16 opacity-50"></div>
                  <div className="relative">
                    <div className="flex items-center justify-between mb-4">
                      <div className="p-3 bg-gradient-to-br from-green-500 to-green-600 rounded-xl shadow-lg shadow-green-500/30">
                        <CheckCircle className="w-6 h-6 text-white" />
                      </div>
                      <span className="text-xs font-semibold text-green-600 bg-green-50 px-3 py-1 rounded-full">Active</span>
                    </div>
                    <p className="text-4xl font-bold text-green-600 mb-1">{stats.active}</p>
                    <p className="text-sm font-medium text-gray-600">Active</p>
                  </div>
                </div>

                {/* Inactive Students */}
                <div className="group relative bg-white rounded-2xl p-6 border border-gray-200 shadow-sm hover:shadow-xl hover:border-gray-300 transition-all duration-300 overflow-hidden">
                  <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-gray-50 to-transparent rounded-full -mr-16 -mt-16 opacity-50"></div>
                  <div className="relative">
                    <div className="flex items-center justify-between mb-4">
                      <div className="p-3 bg-gradient-to-br from-gray-500 to-gray-600 rounded-xl shadow-lg shadow-gray-500/30">
                        <XCircle className="w-6 h-6 text-white" />
                      </div>
                      <span className="text-xs font-semibold text-gray-600 bg-gray-50 px-3 py-1 rounded-full">Inactive</span>
                    </div>
                    <p className="text-4xl font-bold text-gray-600 mb-1">{stats.inactive}</p>
                    <p className="text-sm font-medium text-gray-600">Inactive</p>
                  </div>
                </div>

                {/* Pending Activation */}
                <div className="group relative bg-white rounded-2xl p-6 border border-gray-200 shadow-sm hover:shadow-xl hover:border-amber-300 transition-all duration-300 overflow-hidden">
                  <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-amber-50 to-transparent rounded-full -mr-16 -mt-16 opacity-50"></div>
                  <div className="relative">
                    <div className="flex items-center justify-between mb-4">
                      <div className="p-3 bg-gradient-to-br from-amber-500 to-amber-600 rounded-xl shadow-lg shadow-amber-500/30">
                        <Clock className="w-6 h-6 text-white" />
                      </div>
                      <span className="text-xs font-semibold text-amber-600 bg-amber-50 px-3 py-1 rounded-full">Pending</span>
                    </div>
                    <p className="text-4xl font-bold text-amber-600 mb-1">{stats.pending}</p>
                    <p className="text-sm font-medium text-gray-600">Pending Activation</p>
                  </div>
                </div>
              </div>

              {/* Quick Actions */}
              <div className="bg-white rounded-2xl p-8 border border-gray-200 shadow-sm">
                <div className="flex items-center justify-between mb-6">
                  <div>
                    <h3 className="text-xl font-bold text-gray-900">Quick Actions</h3>
                    <p className="text-sm text-gray-500 mt-1">Common tasks and shortcuts</p>
                  </div>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <button
                    onClick={() => setView("students")}
                    className="group relative flex items-center justify-between p-6 border-2 border-gray-200 rounded-2xl hover:border-[#F59E0B] hover:shadow-lg transition-all duration-300 overflow-hidden"
                  >
                    <div className="absolute inset-0 bg-gradient-to-r from-amber-50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                    <div className="relative flex items-center gap-4">
                      <div className="p-3 bg-gradient-to-br from-amber-50 to-amber-100 rounded-xl group-hover:from-[#F59E0B] group-hover:to-[#D97706] transition-all duration-300 shadow-sm">
                        <GraduationCap className="w-6 h-6 text-[#F59E0B] group-hover:text-white transition-colors" />
                      </div>
                      <div className="text-left">
                        <p className="font-bold text-gray-900 text-base">View All Students</p>
                        <p className="text-sm text-gray-500 mt-0.5">Manage enrolled students</p>
                      </div>
                    </div>
                    <div className="relative text-2xl text-gray-300 group-hover:text-[#F59E0B] group-hover:translate-x-1 transition-all duration-300">→</div>
                  </button>

                  <button
                    onClick={() => onSwitchPortal("applicant")}
                    className="group relative flex items-center justify-between p-6 border-2 border-gray-200 rounded-2xl hover:border-blue-500 hover:shadow-lg transition-all duration-300 overflow-hidden"
                  >
                    <div className="absolute inset-0 bg-gradient-to-r from-blue-50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                    <div className="relative flex items-center gap-4">
                      <div className="p-3 bg-gradient-to-br from-blue-50 to-blue-100 rounded-xl group-hover:from-blue-500 group-hover:to-blue-600 transition-all duration-300 shadow-sm">
                        <Users className="w-6 h-6 text-blue-500 group-hover:text-white transition-colors" />
                      </div>
                      <div className="text-left">
                        <p className="font-bold text-gray-900 text-base">Manage Applicants</p>
                        <p className="text-sm text-gray-500 mt-0.5">Switch to Applicant Portal</p>
                      </div>
                    </div>
                    <div className="relative text-2xl text-gray-300 group-hover:text-blue-500 group-hover:translate-x-1 transition-all duration-300">→</div>
                  </button>
                </div>
              </div>

              {/* Recent Activity Preview */}
              <div className="bg-gradient-to-br from-white to-gray-50 rounded-2xl p-8 border border-gray-200 shadow-sm">
                <div className="flex items-center justify-between mb-6">
                  <div>
                    <h3 className="text-xl font-bold text-gray-900">Recent Activity</h3>
                    <p className="text-sm text-gray-500 mt-1">Latest student enrollments</p>
                  </div>
                  <button
                    onClick={() => setView("students")}
                    className="text-sm font-semibold text-[#F59E0B] hover:text-[#D97706] transition-colors"
                  >
                    View All →
                  </button>
                </div>
                <div className="text-center py-12">
                  <GraduationCap className="w-12 h-12 text-gray-300 mx-auto mb-3" />
                  <p className="text-sm text-gray-500">Click "View All Students" to see recent activity</p>
                </div>
              </div>
            </div>
          )}
        </div>
      ) : (
        <div className="p-8">
          <StudentList
            onSelectStudent={handleSelectStudent}
            onRefresh={loadStats}
            onBack={() => setView("dashboard")}
          />
        </div>
      )}
    </UnifiedAdminLayout>
  );
}
