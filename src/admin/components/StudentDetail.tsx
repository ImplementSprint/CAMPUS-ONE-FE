'use client'
import { useState, useEffect } from "react";
import { ArrowLeft, Mail, Phone, MapPin, Calendar, CheckCircle, XCircle, User } from "lucide-react";
import {
  fetchStudentDetails,
  activateStudentAccount,
  deactivateStudentAccount,
} from "@/admin/services/student-admin.service";

interface StudentDetailProps {
  studentId: string;
  onBack: () => void;
}

export function StudentDetail({ studentId, onBack }: StudentDetailProps) {
  const [student, setStudent] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState(false);

  useEffect(() => {
    loadStudentDetails();
  }, [studentId]);

  const loadStudentDetails = async () => {
    setLoading(true);
    const result = await fetchStudentDetails(studentId);
    if (result.data) {
      setStudent(result.data);
    }
    setLoading(false);
  };

  const handleActivate = async () => {
    if (!confirm("Activate this student account?")) return;
    
    setActionLoading(true);
    const result = await activateStudentAccount(studentId);
    if (!result.error) {
      await loadStudentDetails();
    }
    setActionLoading(false);
  };

  const handleDeactivate = async () => {
    if (!confirm("Deactivate this student account?")) return;
    
    setActionLoading(true);
    const result = await deactivateStudentAccount(studentId);
    if (!result.error) {
      await loadStudentDetails();
    }
    setActionLoading(false);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-[#F59E0B] mx-auto"></div>
          <p className="mt-4 text-sm text-gray-600">Loading student details...</p>
        </div>
      </div>
    );
  }

  if (!student) {
    return (
      <div className="text-center py-20">
        <p className="text-gray-500">Student not found</p>
      </div>
    );
  }

  const profile = student.applicant_profiles;
  const isActive = student.enrollment_status === "active";

  return (
    <div>
      {/* Header */}
      <div className="mb-6">
        <button
          onClick={onBack}
          className="flex items-center gap-2 text-gray-600 hover:text-gray-900 transition-colors mb-4"
        >
          <ArrowLeft className="w-4 h-4" />
          <span className="text-sm font-medium">Back to Students</span>
        </button>
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-bold text-gray-900">{profile?.full_name || "N/A"}</h2>
            <p className="text-sm text-gray-600 mt-1">Student Number: {student.student_number}</p>
          </div>
          <div className="flex gap-3">
            {isActive ? (
              <button
                onClick={handleDeactivate}
                disabled={actionLoading}
                className="flex items-center gap-2 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 disabled:opacity-50 transition-colors"
              >
                <XCircle className="w-4 h-4" />
                Deactivate
              </button>
            ) : (
              <button
                onClick={handleActivate}
                disabled={actionLoading}
                className="flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:opacity-50 transition-colors"
              >
                <CheckCircle className="w-4 h-4" />
                Activate
              </button>
            )}
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Info */}
        <div className="lg:col-span-2 space-y-6">
          {/* Personal Information */}
          <div className="bg-white rounded-xl p-6 border border-gray-200 shadow-sm">
            <h3 className="text-lg font-bold text-gray-900 mb-4">Personal Information</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="text-xs font-semibold text-gray-600 uppercase tracking-wider">
                  Full Name
                </label>
                <p className="mt-1 text-sm text-gray-900">{profile?.full_name || "N/A"}</p>
              </div>
              <div>
                <label className="text-xs font-semibold text-gray-600 uppercase tracking-wider">
                  Birthdate
                </label>
                <p className="mt-1 text-sm text-gray-900">{profile?.birthdate || "N/A"}</p>
              </div>
              <div>
                <label className="text-xs font-semibold text-gray-600 uppercase tracking-wider">
                  Email
                </label>
                <p className="mt-1 text-sm text-gray-900 flex items-center gap-2">
                  <Mail className="w-4 h-4 text-gray-400" />
                  {student.email}
                </p>
              </div>
              <div>
                <label className="text-xs font-semibold text-gray-600 uppercase tracking-wider">
                  Mobile Number
                </label>
                <p className="mt-1 text-sm text-gray-900 flex items-center gap-2">
                  <Phone className="w-4 h-4 text-gray-400" />
                  {profile?.mobile_number || "N/A"}
                </p>
              </div>
              <div className="md:col-span-2">
                <label className="text-xs font-semibold text-gray-600 uppercase tracking-wider">
                  Address
                </label>
                <p className="mt-1 text-sm text-gray-900 flex items-start gap-2">
                  <MapPin className="w-4 h-4 text-gray-400 mt-0.5" />
                  {profile?.address || "N/A"}
                </p>
              </div>
            </div>
          </div>

          {/* Academic Information */}
          <div className="bg-white rounded-xl p-6 border border-gray-200 shadow-sm">
            <h3 className="text-lg font-bold text-gray-900 mb-4">Academic Information</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="text-xs font-semibold text-gray-600 uppercase tracking-wider">
                  School Level
                </label>
                <p className="mt-1 text-sm text-gray-900">{profile?.school_level || "N/A"}</p>
              </div>
              <div>
                <label className="text-xs font-semibold text-gray-600 uppercase tracking-wider">
                  Applicant Type
                </label>
                <p className="mt-1 text-sm text-gray-900">{profile?.applicant_type || "N/A"}</p>
              </div>
              <div>
                <label className="text-xs font-semibold text-gray-600 uppercase tracking-wider">
                  Enrolled Date
                </label>
                <p className="mt-1 text-sm text-gray-900 flex items-center gap-2">
                  <Calendar className="w-4 h-4 text-gray-400" />
                  {new Date(student.enrolled_at).toLocaleDateString()}
                </p>
              </div>
              <div>
                <label className="text-xs font-semibold text-gray-600 uppercase tracking-wider">
                  Status
                </label>
                <p className="mt-1">
                  <span
                    className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-semibold ${
                      isActive
                        ? "bg-green-100 text-green-800"
                        : "bg-gray-100 text-gray-800"
                    }`}
                  >
                    {isActive ? <CheckCircle className="w-3 h-3" /> : <XCircle className="w-3 h-3" />}
                    {student.enrollment_status.charAt(0).toUpperCase() + student.enrollment_status.slice(1)}
                  </span>
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Account Status */}
          <div className="bg-white rounded-xl p-6 border border-gray-200 shadow-sm">
            <h3 className="text-lg font-bold text-gray-900 mb-4">Account Status</h3>
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600">Enrollment Status</span>
                <span
                  className={`px-2 py-1 rounded text-xs font-semibold ${
                    isActive ? "bg-green-100 text-green-800" : "bg-gray-100 text-gray-800"
                  }`}
                >
                  {student.enrollment_status}
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600">Password Set</span>
                <span
                  className={`px-2 py-1 rounded text-xs font-semibold ${
                    student.password_hash ? "bg-green-100 text-green-800" : "bg-amber-100 text-amber-800"
                  }`}
                >
                  {student.password_hash ? "Yes" : "Pending"}
                </span>
              </div>
            </div>
          </div>

          {/* Quick Info */}
          <div className="bg-blue-50 rounded-xl p-6 border border-blue-200">
            <h3 className="text-sm font-bold text-blue-900 mb-2">Student Information</h3>
            <p className="text-xs text-blue-700 leading-relaxed">
              This student was enrolled from application ID: {student.applicant_id}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
