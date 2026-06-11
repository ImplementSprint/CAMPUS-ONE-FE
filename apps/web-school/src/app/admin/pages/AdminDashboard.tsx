'use client'
import { useState, useEffect } from "react";
import { ApplicationList, ApplicationDetail } from "../components";
import { AdminWebLayout } from "../components/AdminWebLayout";
import { Users, CheckCircle, XCircle, Clock, FileText } from "lucide-react";
import { fetchDashboardStats, type DashboardStats } from "../services/admin.service";

export function AdminDashboard() {
  const [selectedApplicationId, setSelectedApplicationId] = useState<string | null>(null);
  const [view, setView] = useState<"dashboard" | "applications">("dashboard");
  const [stats, setStats] = useState<DashboardStats>({
    total: 0,
    pending: 0,
    accepted: 0,
    rejected: 0,
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadStats();
  }, []);

  const loadStats = async () => {
    setLoading(true);
    const result = await fetchDashboardStats();
    if (result.data) {
      setStats(result.data);
    }
    setLoading(false);
  };

  const handleSelectApplication = (id: string) => {
    setSelectedApplicationId(id);
  };

  const handleBackFromDetail = () => {
    setSelectedApplicationId(null);
    loadStats();
  };

  const currentView = selectedApplicationId ? "detail" : view;

  const handleNavigate = (newView: "dashboard" | "applications") => {
    setView(newView);
    setSelectedApplicationId(null);
  };

  return (
    <AdminWebLayout currentView={currentView} onNavigate={handleNavigate}>
      {selectedApplicationId ? (
        <div className="p-8">
          <ApplicationDetail
            applicationId={selectedApplicationId}
            onBack={handleBackFromDetail}
          />
        </div>
      ) : view === "dashboard" ? (
        <div className="p-8">
          {loading ? (
            <div className="flex items-center justify-center py-20">
              <div className="text-center">
                <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-[#F59E0B] mx-auto"></div>
                <p className="mt-4 text-sm text-gray-600">Loading dashboard...</p>
              </div>
            </div>
          ) : (
            <div className="space-y-6">
              {/* Page Header */}
              <div>
                <h2 className="text-2xl font-bold text-gray-900">Overview</h2>
                <p className="text-sm text-gray-600 mt-1">
                  Monitor and manage all admission applications
                </p>
              </div>

              {/* Stats Cards */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {/* Total Applications */}
                <div className="bg-white rounded-xl p-6 border border-gray-200 shadow-sm">
                  <div className="flex items-center justify-between mb-4">
                    <div className="p-3 bg-blue-50 rounded-lg">
                      <Users className="w-6 h-6 text-blue-600" />
                    </div>
                  </div>
                  <p className="text-3xl font-bold text-gray-900">{stats.total}</p>
                  <p className="text-sm text-gray-600 mt-1">Total Applications</p>
                </div>

                {/* Pending Review */}
                <div className="bg-white rounded-xl p-6 border border-gray-200 shadow-sm">
                  <div className="flex items-center justify-between mb-4">
                    <div className="p-3 bg-amber-50 rounded-lg">
                      <Clock className="w-6 h-6 text-amber-600" />
                    </div>
                  </div>
                  <p className="text-3xl font-bold text-amber-600">{stats.pending}</p>
                  <p className="text-sm text-gray-600 mt-1">Pending Review</p>
                </div>

                {/* Accepted */}
                <div className="bg-white rounded-xl p-6 border border-gray-200 shadow-sm">
                  <div className="flex items-center justify-between mb-4">
                    <div className="p-3 bg-green-50 rounded-lg">
                      <CheckCircle className="w-6 h-6 text-green-600" />
                    </div>
                  </div>
                  <p className="text-3xl font-bold text-green-600">{stats.accepted}</p>
                  <p className="text-sm text-gray-600 mt-1">Accepted</p>
                </div>

                {/* Rejected */}
                <div className="bg-white rounded-xl p-6 border border-gray-200 shadow-sm">
                  <div className="flex items-center justify-between mb-4">
                    <div className="p-3 bg-red-50 rounded-lg">
                      <XCircle className="w-6 h-6 text-red-600" />
                    </div>
                  </div>
                  <p className="text-3xl font-bold text-red-600">{stats.rejected}</p>
                  <p className="text-sm text-gray-600 mt-1">Rejected</p>
                </div>
              </div>

              {/* Quick Actions */}
              <div className="bg-white rounded-xl p-6 border border-gray-200 shadow-sm">
                <h3 className="text-lg font-bold text-gray-900 mb-4">Quick Actions</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <button
                    onClick={() => setView("applications")}
                    className="flex items-center justify-between p-4 border-2 border-gray-200 rounded-lg hover:border-[#F59E0B] hover:bg-amber-50 transition-all group"
                  >
                    <div className="flex items-center gap-3">
                      <div className="p-2 bg-amber-50 rounded-lg group-hover:bg-[#F59E0B] transition-colors">
                        <FileText className="w-5 h-5 text-[#F59E0B] group-hover:text-white" />
                      </div>
                      <div className="text-left">
                        <p className="font-semibold text-gray-900">View All Applications</p>
                        <p className="text-xs text-gray-600">Review and manage submissions</p>
                      </div>
                    </div>
                    <span className="text-xs font-semibold text-gray-400 group-hover:text-[#F59E0B]">Open</span>
                  </button>

                  <button className="flex items-center justify-between p-4 border-2 border-gray-200 rounded-lg hover:border-gray-300 hover:bg-gray-50 transition-all opacity-50 cursor-not-allowed">
                    <div className="flex items-center gap-3">
                      <div className="p-2 bg-gray-100 rounded-lg">
                        <Users className="w-5 h-5 text-gray-400" />
                      </div>
                      <div className="text-left">
                        <p className="font-semibold text-gray-600">Manage Users</p>
                        <p className="text-xs text-gray-500">Coming soon</p>
                      </div>
                    </div>
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      ) : (
        <div className="p-8">
          <ApplicationList 
            onSelectApplication={handleSelectApplication} 
            onRefresh={loadStats}
            onBack={() => setView("dashboard")}
          />
        </div>
      )}
    </AdminWebLayout>
  );
}
