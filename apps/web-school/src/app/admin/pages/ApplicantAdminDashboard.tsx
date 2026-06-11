'use client'
import { useState, useEffect } from "react";
import { UnifiedAdminLayout } from "../components/UnifiedAdminLayout";
import { ApplicationList, ApplicationDetail } from "../components";
import { Users, CheckCircle, XCircle, Clock, FileText, TrendingUp, Calendar as CalendarIcon, ClipboardCheck, BookOpen } from "lucide-react";
import { fetchDashboardStats, type DashboardStats } from "../services/admin.service";

// Import new page components
import { ApplicationQueuePage } from "./pages/ApplicationQueuePage";
import { DocumentVerificationPage } from "./pages/DocumentVerificationPage";
import { SelectionDecisioningPage } from "./pages/SelectionDecisioningPage";
import { EntranceExaminationPage } from "./pages/EntranceExaminationPage";
import { InterviewCoordinationPage } from "./pages/InterviewCoordinationPage";
import { EligibilityCriteriaPage } from "./pages/EligibilityCriteriaPage";
import { EnrollmentQuotasPage } from "./pages/EnrollmentQuotasPage";
import { AdmissionsAnalyticsPage } from "./pages/AdmissionsAnalyticsPage";
import { ApplicantHelpDeskPage } from "./pages/ApplicantHelpDeskPage";
import { TransmissionLogsPage } from "./pages/TransmissionLogsPage";
import { AdmissionsScopeGuidePage } from "./pages/AdmissionsScopeGuidePage";

interface ApplicantAdminDashboardProps {
}

export function ApplicantAdminDashboard({}: ApplicantAdminDashboardProps) {
  const [selectedApplicationId, setSelectedApplicationId] = useState<string | null>(null);
  const [view, setView] = useState<string>("dashboard");
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

  const handleNavigate = (newView: string) => {
    setView(newView);
    setSelectedApplicationId(null);
  };

  // Calculate enrollment fill rate
  const enrollmentFillRate = stats.total > 0
    ? Math.round(((stats.accepted + stats.pending) / (stats.total * 1.5)) * 100)
    : 0;

  // Render page content based on current view
  const renderPageContent = () => {
    if (selectedApplicationId) {
      return (
        <div className="p-8">
          <ApplicationDetail
            applicationId={selectedApplicationId}
            onBack={handleBackFromDetail}
          />
        </div>
      );
    }

    switch (view) {
      case "application-queue":
        return <ApplicationQueuePage onSelectApplication={handleSelectApplication} />;
      case "document-verification":
        return <DocumentVerificationPage />;
      case "selection-decisioning":
        return <SelectionDecisioningPage />;
      case "entrance-examination":
        return <EntranceExaminationPage />;
      case "interview-coordination":
        return <InterviewCoordinationPage />;
      case "eligibility-criteria":
        return <EligibilityCriteriaPage />;
      case "enrollment-quotas":
        return <EnrollmentQuotasPage />;
      case "admissions-analytics":
        return <AdmissionsAnalyticsPage stats={stats} />;
      case "applicant-helpdesk":
        return <ApplicantHelpDeskPage />;
      case "transmission-logs":
        return <TransmissionLogsPage />;
      case "admissions-scope-guide":
        return <AdmissionsScopeGuidePage onBack={() => setView("dashboard")} onNavigateToView={handleNavigate} />;
      case "applications":
        return (
          <div className="p-8">
            <ApplicationList
              onSelectApplication={handleSelectApplication}
              onRefresh={loadStats}
              onBack={() => setView("dashboard")}
            />
          </div>
        );
      case "dashboard":
      default:
        return renderDashboard();
    }
  };

  const renderDashboard = () => (
    <div className="p-10">
      {loading ? (
        <div className="flex items-center justify-center py-32">
          <div className="text-center">
            <div className="relative">
              <div className="animate-spin rounded-full h-16 w-16 border-4 border-gray-200 border-t-[#F59E0B] mx-auto"></div>
              <div className="absolute inset-0 flex items-center justify-center">
                <FileText className="w-6 h-6 text-[#F59E0B]" />
              </div>
            </div>
            <p className="mt-6 text-sm font-medium text-gray-600">Loading dashboard...</p>
          </div>
        </div>
      ) : (
        <div className="space-y-8">
          {/* Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6">
            {/* Total Applications */}
            <div className="group relative bg-white rounded-2xl p-6 border border-gray-200 shadow-sm hover:shadow-xl hover:border-blue-300 transition-all duration-300 overflow-hidden">
              <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-blue-50 to-transparent rounded-full -mr-16 -mt-16 opacity-50"></div>
              <div className="relative">
                <div className="flex items-center justify-between mb-4">
                  <div className="p-3 bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl shadow-lg shadow-blue-500/30">
                    <Users className="w-6 h-6 text-white" />
                  </div>
                  <span className="text-xs font-semibold text-blue-600 bg-blue-50 px-3 py-1 rounded-full">All</span>
                </div>
                <p className="text-4xl font-bold text-gray-900 mb-1">{stats.total}</p>
                <p className="text-sm font-medium text-gray-600">Total Applications</p>
              </div>
            </div>

            {/* Pending Review */}
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
                <p className="text-sm font-medium text-gray-600">Pending Review</p>
              </div>
            </div>

            {/* Accepted */}
            <div className="group relative bg-white rounded-2xl p-6 border border-gray-200 shadow-sm hover:shadow-xl hover:border-green-300 transition-all duration-300 overflow-hidden">
              <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-green-50 to-transparent rounded-full -mr-16 -mt-16 opacity-50"></div>
              <div className="relative">
                <div className="flex items-center justify-between mb-4">
                  <div className="p-3 bg-gradient-to-br from-green-500 to-green-600 rounded-xl shadow-lg shadow-green-500/30">
                    <CheckCircle className="w-6 h-6 text-white" />
                  </div>
                  <span className="text-xs font-semibold text-green-600 bg-green-50 px-3 py-1 rounded-full">Accepted</span>
                </div>
                <p className="text-4xl font-bold text-green-600 mb-1">{stats.accepted}</p>
                <p className="text-sm font-medium text-gray-600">Accepted</p>
              </div>
            </div>

            {/* Rejected */}
            <div className="group relative bg-white rounded-2xl p-6 border border-gray-200 shadow-sm hover:shadow-xl hover:border-red-300 transition-all duration-300 overflow-hidden">
              <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-red-50 to-transparent rounded-full -mr-16 -mt-16 opacity-50"></div>
              <div className="relative">
                <div className="flex items-center justify-between mb-4">
                  <div className="p-3 bg-gradient-to-br from-red-500 to-red-600 rounded-xl shadow-lg shadow-red-500/30">
                    <XCircle className="w-6 h-6 text-white" />
                  </div>
                  <span className="text-xs font-semibold text-red-600 bg-red-50 px-3 py-1 rounded-full">Rejected</span>
                </div>
                <p className="text-4xl font-bold text-red-600 mb-1">{stats.rejected}</p>
                <p className="text-sm font-medium text-gray-600">Rejected</p>
              </div>
            </div>

            {/* Enrollment Fill Rate - NEW */}
            <div className="group relative bg-white rounded-2xl p-6 border border-gray-200 shadow-sm hover:shadow-xl hover:border-purple-300 transition-all duration-300 overflow-hidden">
              <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-purple-50 to-transparent rounded-full -mr-16 -mt-16 opacity-50"></div>
              <div className="relative">
                <div className="flex items-center justify-between mb-4">
                  <div className="p-3 bg-gradient-to-br from-purple-500 to-purple-600 rounded-xl shadow-lg shadow-purple-500/30">
                    <TrendingUp className="w-6 h-6 text-white" />
                  </div>
                  <span className="text-xs font-semibold text-purple-600 bg-purple-50 px-3 py-1 rounded-full">Quota</span>
                </div>
                <p className="text-4xl font-bold text-purple-600 mb-1">{enrollmentFillRate}%</p>
                <p className="text-sm font-medium text-gray-600">Enrollment Fill Rate</p>
                <div className="mt-3 w-full bg-gray-200 rounded-full h-2">
                  <div
                    className="bg-gradient-to-r from-purple-500 to-purple-600 h-2 rounded-full transition-all duration-500"
                    style={{ width: `${Math.min(enrollmentFillRate, 100)}%` }}
                  ></div>
                </div>
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
                onClick={() => setView("application-queue")}
                className="group relative flex items-center justify-between p-6 border-2 border-gray-200 rounded-2xl hover:border-[#F59E0B] hover:shadow-lg transition-all duration-300 overflow-hidden"
              >
                <div className="absolute inset-0 bg-gradient-to-r from-amber-50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                <div className="relative flex items-center gap-4">
                  <div className="p-3 bg-gradient-to-br from-amber-50 to-amber-100 rounded-xl group-hover:from-[#F59E0B] group-hover:to-[#D97706] transition-all duration-300 shadow-sm">
                    <FileText className="w-6 h-6 text-[#F59E0B] group-hover:text-white transition-colors" />
                  </div>
                  <div className="text-left">
                    <p className="font-bold text-gray-900 text-base">View Application Queue</p>
                    <p className="text-sm text-gray-500 mt-0.5">Review new submissions</p>
                  </div>
                </div>
                <div className="relative text-xs font-semibold text-gray-400 group-hover:text-[#F59E0B] transition-all duration-300">Open</div>
              </button>

              <button
                onClick={() => setView("entrance-examination")}
                className="group relative flex items-center justify-between p-6 border-2 border-gray-200 rounded-2xl hover:border-purple-500 hover:shadow-lg transition-all duration-300 overflow-hidden"
              >
                <div className="absolute inset-0 bg-gradient-to-r from-purple-50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                <div className="relative flex items-center gap-4">
                  <div className="p-3 bg-gradient-to-br from-purple-50 to-purple-100 rounded-xl group-hover:from-purple-500 group-hover:to-purple-600 transition-all duration-300 shadow-sm">
                    <ClipboardCheck className="w-6 h-6 text-purple-500 group-hover:text-white transition-colors" />
                  </div>
                  <div className="text-left">
                    <p className="font-bold text-gray-900 text-base">Schedule Examination</p>
                    <p className="text-sm text-gray-500 mt-0.5">Manage entrance exams</p>
                  </div>
                </div>
                <div className="relative text-xs font-semibold text-gray-400 group-hover:text-purple-500 transition-all duration-300">Open</div>
              </button>

              <button
                onClick={() => setView("transmission-logs")}
                className="group relative flex items-center justify-between p-6 border-2 border-gray-200 rounded-2xl hover:border-blue-500 hover:shadow-lg transition-all duration-300 overflow-hidden"
              >
                <div className="absolute inset-0 bg-gradient-to-r from-blue-50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                <div className="relative flex items-center gap-4">
                  <div className="p-3 bg-gradient-to-br from-blue-50 to-blue-100 rounded-xl group-hover:from-blue-500 group-hover:to-blue-600 transition-all duration-300 shadow-sm">
                    <FileText className="w-6 h-6 text-blue-500 group-hover:text-white transition-colors" />
                  </div>
                  <div className="text-left">
                    <p className="font-bold text-gray-900 text-base">View Transmission Logs</p>
                    <p className="text-sm text-gray-500 mt-0.5">Audit trail of communications</p>
                  </div>
                </div>
                <div className="relative text-xs font-semibold text-gray-400 group-hover:text-blue-500 transition-all duration-300">Open</div>
              </button>

              <button
                onClick={() => setView("admissions-scope-guide" as any)}
                className="group relative flex items-center justify-between p-6 border-2 border-gray-200 rounded-2xl hover:border-amber-500 hover:shadow-lg transition-all duration-300 overflow-hidden"
              >
                <div className="absolute inset-0 bg-gradient-to-r from-amber-50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                <div className="relative flex items-center gap-4">
                  <div className="p-3 bg-gradient-to-br from-amber-50 to-amber-100 rounded-xl group-hover:from-amber-500 group-hover:to-amber-600 transition-all duration-300 shadow-sm">
                    <BookOpen className="w-6 h-6 text-amber-500 group-hover:text-white transition-colors" />
                  </div>
                  <div className="text-left">
                    <p className="font-bold text-gray-900 text-base">Mobile Admissions Guide</p>
                    <p className="text-sm text-gray-500 mt-0.5">Explore mobile mapping & audit parameters</p>
                  </div>
                </div>
                <div className="relative text-xs font-semibold text-gray-400 group-hover:text-amber-500 transition-all duration-300">Open</div>
              </button>
            </div>
          </div>

          {/* Recent Activity Preview */}
          <div className="bg-gradient-to-br from-white to-gray-50 rounded-2xl p-8 border border-gray-200 shadow-sm">
            <div className="flex items-center justify-between mb-6">
              <div>
                <h3 className="text-xl font-bold text-gray-900">Recent Activity</h3>
                <p className="text-sm text-gray-500 mt-1">Latest application submissions</p>
              </div>
              <button
                onClick={() => setView("application-queue")}
                className="text-sm font-semibold text-[#F59E0B] hover:text-[#D97706] transition-colors"
              >
                View All
              </button>
            </div>
            <div className="text-center py-12">
              <FileText className="w-12 h-12 text-gray-300 mx-auto mb-3" />
              <p className="text-sm text-gray-500">Click "View All" to see recent activity in the application queue</p>
            </div>
          </div>
        </div>
      )}
    </div>
  );

  return (
    <UnifiedAdminLayout
      currentPortal="applicant"
      currentView={currentView}
      onNavigate={handleNavigate}
    >
      {renderPageContent()}
    </UnifiedAdminLayout>
  );
}
