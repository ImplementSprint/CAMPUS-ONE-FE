'use client'
import { useState, useEffect } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { 
  CheckCircle, 
  Clock, 
  XCircle, 
  FileText, 
  Calendar, 
  User, 
  Mail, 
  Hash,
  Download,
  AlertCircle,
  LogOut,
  Home
} from "lucide-react";
import { fetchApplicationStatus, type FullApplicationStatus } from "../services/tracking.service";

export function ApplicationStatusPage() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const [status, setStatus] = useState<FullApplicationStatus | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const email = searchParams.get("email");
  const refNumber = searchParams.get("ref");

  useEffect(() => {
    if (!email || !refNumber) {
      router.push("/admissions/track");
      return;
    }
    loadStatus();
  }, [email, refNumber]);

  const loadStatus = async () => {
    if (!email || !refNumber) return;

    setLoading(true);
    const result = await fetchApplicationStatus(email, refNumber);
    
    if (result.error || !result.data) {
      setError(result.error?.message || "Failed to load application");
      setLoading(false);
      return;
    }

    setStatus(result.data);
    setLoading(false);
  };

  const handleLogout = () => {
    router.push("/admissions/track");
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "Passed":
        return "text-green-700 bg-green-50 border-green-200";
      case "Not Accepted":
        return "text-red-700 bg-red-50 border-red-200";
      default:
        return "text-amber-700 bg-amber-50 border-amber-200";
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "Passed":
        return <CheckCircle className="w-6 h-6 text-green-600" />;
      case "Not Accepted":
        return <XCircle className="w-6 h-6 text-red-600" />;
      default:
        return <Clock className="w-6 h-6 text-amber-600" />;
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 flex items-center justify-center">
        <div className="text-center">
          <div className="relative inline-block">
            <div className="w-16 h-16 border-4 border-gray-200 border-t-[#F59E0B] rounded-full animate-spin"></div>
            <div className="absolute inset-0 flex items-center justify-center">
              <FileText className="w-6 h-6 text-[#F59E0B]" />
            </div>
          </div>
          <p className="mt-6 text-sm font-medium text-gray-600">Loading application status...</p>
        </div>
      </div>
    );
  }

  if (error || !status) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 flex items-center justify-center p-4">
        <div className="max-w-md w-full bg-white rounded-2xl shadow-lg border border-gray-200 p-8 text-center">
          <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <AlertCircle className="w-8 h-8 text-red-600" />
          </div>
          <h2 className="text-xl font-bold text-gray-900 mb-2">Error Loading Application</h2>
          <p className="text-sm text-gray-600 mb-6">{error}</p>
          <button
            onClick={() => router.push("/admissions/track")}
            className="w-full h-12 rounded-xl bg-[#F59E0B] text-white font-semibold hover:bg-[#D97706] transition-colors"
          >
            Back to Track Application
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      {/* Header */}
      <header className="bg-white border-b border-gray-200 sticky top-0 z-10 shadow-sm">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <button
                onClick={() => router.push("/")}
                className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <Home className="w-5 h-5 text-gray-600" />
              </button>
              <div>
                <h1 className="text-xl font-bold text-gray-900">Application Status</h1>
                <p className="text-sm text-gray-500">{status.application.reference_number}</p>
              </div>
            </div>
            <button
              onClick={handleLogout}
              className="flex items-center gap-2 px-4 py-2 text-sm font-semibold text-gray-700 hover:bg-gray-100 rounded-lg transition-colors"
            >
              <LogOut className="w-4 h-4" />
              Exit
            </button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left Column - Status & Progress */}
          <div className="lg:col-span-2 space-y-6">
            {/* Status Overview Card */}
            <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6">
              <div className="flex items-start justify-between mb-6">
                <div>
                  <h2 className="text-2xl font-bold text-gray-900 mb-1">
                    {status.application.full_name}
                  </h2>
                  <p className="text-sm text-gray-600">
                    {status.application.school_level} - {status.application.applicant_type}
                  </p>
                </div>
                <div className={`flex items-center gap-2 px-4 py-2 rounded-xl border-2 ${getStatusColor(status.application.status)}`}>
                  {getStatusIcon(status.application.status)}
                  <span className="font-bold text-sm">{status.application.status}</span>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-xl">
                  <Calendar className="w-5 h-5 text-gray-400" />
                  <div>
                    <p className="text-xs text-gray-500">Submitted</p>
                    <p className="text-sm font-semibold text-gray-900">
                      {new Date(status.application.application_submitted_at).toLocaleDateString()}
                    </p>
                  </div>
                </div>
                {status.application.reviewed_at && (
                  <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-xl">
                    <Calendar className="w-5 h-5 text-gray-400" />
                    <div>
                      <p className="text-xs text-gray-500">Last Updated</p>
                      <p className="text-sm font-semibold text-gray-900">
                        {new Date(status.application.reviewed_at).toLocaleDateString()}
                      </p>
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Progress Tracker */}
            <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6">
              <h3 className="text-lg font-bold text-gray-900 mb-6">Application Progress</h3>
              <div className="space-y-4">
                {status.progress.map((step, index) => (
                  <div key={step.step} className="relative">
                    {index < status.progress.length - 1 && (
                      <div
                        className={`absolute left-5 top-12 w-0.5 h-12 ${
                          step.status === "completed" ? "bg-green-500" : "bg-gray-200"
                        }`}
                      />
                    )}
                    <div className="flex items-start gap-4">
                      <div
                        className={`w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0 ${
                          step.status === "completed"
                            ? "bg-green-500 text-white"
                            : step.status === "current"
                            ? "bg-amber-500 text-white"
                            : "bg-gray-200 text-gray-400"
                        }`}
                      >
                        {step.status === "completed" ? (
                          <CheckCircle className="w-5 h-5" />
                        ) : step.status === "current" ? (
                          <Clock className="w-5 h-5" />
                        ) : (
                          <span className="text-sm font-bold">{step.step}</span>
                        )}
                      </div>
                      <div className="flex-1 pt-1">
                        <p className="font-semibold text-gray-900">{step.label}</p>
                        {step.date && (
                          <p className="text-xs text-gray-500 mt-1">
                            {new Date(step.date).toLocaleString()}
                          </p>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Admin Remarks */}
            {status.remarks && (
              <div className="bg-red-50 border-2 border-red-200 rounded-2xl p-6">
                <div className="flex items-start gap-3">
                  <AlertCircle className="w-6 h-6 text-red-600 flex-shrink-0 mt-0.5" />
                  <div>
                    <h3 className="text-lg font-bold text-red-900 mb-2">Admin Remarks</h3>
                    <p className="text-sm text-red-700 leading-relaxed">{status.remarks}</p>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Right Column - Details & Documents */}
          <div className="space-y-6">
            {/* Applicant Details */}
            <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6">
              <h3 className="text-lg font-bold text-gray-900 mb-4">Applicant Details</h3>
              <div className="space-y-3">
                <div className="flex items-center gap-3">
                  <User className="w-4 h-4 text-gray-400" />
                  <div>
                    <p className="text-xs text-gray-500">Full Name</p>
                    <p className="text-sm font-medium text-gray-900">{status.application.full_name}</p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <Mail className="w-4 h-4 text-gray-400" />
                  <div>
                    <p className="text-xs text-gray-500">Email</p>
                    <p className="text-sm font-medium text-gray-900">{status.application.email}</p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <Hash className="w-4 h-4 text-gray-400" />
                  <div>
                    <p className="text-xs text-gray-500">Reference Number</p>
                    <p className="text-sm font-mono font-medium text-gray-900">
                      {status.application.reference_number}
                    </p>
                  </div>
                </div>
                {status.application.applicant_number && (
                  <div className="flex items-center gap-3 p-3 bg-green-50 rounded-lg border border-green-200">
                    <CheckCircle className="w-4 h-4 text-green-600" />
                    <div>
                      <p className="text-xs text-green-700 font-semibold">Applicant Number</p>
                      <p className="text-sm font-mono font-bold text-green-900">
                        {status.application.applicant_number}
                      </p>
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Uploaded Documents */}
            <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6">
              <h3 className="text-lg font-bold text-gray-900 mb-4">Uploaded Documents</h3>
              {status.documents.length === 0 ? (
                <p className="text-sm text-gray-500 text-center py-4">No documents uploaded yet</p>
              ) : (
                <div className="space-y-2">
                  {status.documents.map((doc) => (
                    <div
                      key={doc.id}
                      className="flex items-center justify-between p-3 border border-gray-200 rounded-lg hover:border-[#F59E0B] transition-colors"
                    >
                      <div className="flex items-center gap-3 flex-1 min-w-0">
                        <FileText className="w-4 h-4 text-gray-400 flex-shrink-0" />
                        <div className="min-w-0">
                          <p className="text-sm font-medium text-gray-900 truncate">
                            {doc.document_name}
                          </p>
                          <p className="text-xs text-gray-500 truncate">{doc.file_name}</p>
                        </div>
                      </div>
                      <a
                        href={doc.file_url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="p-2 hover:bg-amber-50 rounded-lg transition-colors flex-shrink-0"
                      >
                        <Download className="w-4 h-4 text-[#F59E0B]" />
                      </a>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
