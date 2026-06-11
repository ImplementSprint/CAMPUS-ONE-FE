'use client'
import { useState, useEffect } from "react";
import { ArrowLeft, User, Mail, Phone, MapPin, Calendar, FileText, CheckCircle, XCircle, Download, GraduationCap, Users as UsersIcon, Edit } from "lucide-react";
import { fetchApplicationDetail, updateApplicationStatus, updateProgramSelection, type ApplicationDetail as ApplicationDetailType } from "../services/admin.service";

interface ApplicationDetailProps {
  applicationId: string;
  onBack: () => void;
}

export function ApplicationDetail({ applicationId, onBack }: ApplicationDetailProps) {
  const [application, setApplication] = useState<ApplicationDetailType | null>(null);
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState(false);
  const [rejectionReason, setRejectionReason] = useState("");
  const [showRejectModal, setShowRejectModal] = useState(false);
  const [showProgramModal, setShowProgramModal] = useState(false);
  const [selectedDepartment, setSelectedDepartment] = useState("");
  const [selectedProgram, setSelectedProgram] = useState("");
  const [statusMessage, setStatusMessage] = useState<{ type: "error" | "success"; text: string } | null>(null);

  useEffect(() => {
    loadApplication();
  }, [applicationId]);

  const loadApplication = async () => {
    setLoading(true);
    const result = await fetchApplicationDetail(applicationId);
    if (result.data) {
      setApplication(result.data);
      // Set current program if exists
      if (result.data.program_selection) {
        setSelectedDepartment(result.data.program_selection.college_department || "");
        setSelectedProgram(result.data.program_selection.college_program || "");
      }
    }
    setLoading(false);
  };

  // College Programs Data
  const collegeDepartments = {
    "College of Engineering": [
      "BS Computer Engineering",
      "BS Electrical Engineering",
      "BS Mechanical Engineering",
      "BS Civil Engineering",
      "BS Electronics Engineering"
    ],
    "College of Business Administration": [
      "BS Business Administration",
      "BS Accountancy",
      "BS Marketing Management",
      "BS Financial Management"
    ],
    "College of Arts and Sciences": [
      "BS Psychology",
      "BS Biology",
      "BS Mathematics",
      "AB Communication",
      "AB Political Science"
    ],
    "College of Education": [
      "BS Elementary Education",
      "BS Secondary Education",
      "BS Physical Education"
    ],
    "College of Information Technology": [
      "BS Information Technology",
      "BS Computer Science",
      "BS Information Systems"
    ]
  };

  const handleOpenProgramModal = () => {
    setShowProgramModal(true);
  };

  const handleUpdateProgram = async () => {
    setStatusMessage(null);
    if (!selectedDepartment || !selectedProgram) {
      setStatusMessage({ type: "error", text: "Please select both department and program." });
      return;
    }

    setUpdating(true);
    const result = await updateProgramSelection(applicationId, selectedDepartment, selectedProgram);
    if (result.data) {
      setStatusMessage({ type: "success", text: "Program updated successfully." });
      setShowProgramModal(false);
      await loadApplication();
    } else {
      setStatusMessage({ type: "error", text: "Failed to update program: " + result.error?.message });
    }
    setUpdating(false);
  };

  const handleAccept = async () => {
    if (!application) return;
    
    if (!confirm("Are you sure you want to ACCEPT this application?")) return;

    setStatusMessage(null);
    setUpdating(true);
    const result = await updateApplicationStatus(applicationId, "Passed");
    if (result.data) {
      setStatusMessage({ type: "success", text: "Application accepted. Email notification sent to applicant." });
      await loadApplication();
    } else {
      setStatusMessage({ type: "error", text: "Failed to update application: " + result.error?.message });
    }
    setUpdating(false);
  };

  const handleReject = async () => {
    setStatusMessage(null);
    if (!rejectionReason.trim()) {
      setStatusMessage({ type: "error", text: "Please provide a reason for rejection." });
      return;
    }

    setUpdating(true);
    const result = await updateApplicationStatus(applicationId, "Not Accepted", rejectionReason);
    if (result.data) {
      setStatusMessage({ type: "success", text: "Application rejected. Email notification sent to applicant." });
      setShowRejectModal(false);
      await loadApplication();
    } else {
      setStatusMessage({ type: "error", text: "Failed to update application: " + result.error?.message });
    }
    setUpdating(false);
  };

  if (loading) {
    return (
      <div className="flex-1 flex items-center justify-center py-12">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#F59E0B] mx-auto"></div>
          <p className="mt-4 text-sm text-gray-600">Loading application...</p>
        </div>
      </div>
    );
  }

  if (!application) {
    return (
      <div className="flex-1 flex items-center justify-center py-12">
        <div className="text-center">
          <p className="text-red-600 text-sm">Application not found</p>
          <button onClick={onBack} className="mt-4 text-[#F59E0B] hover:underline text-sm">
            Go Back
          </button>
        </div>
      </div>
    );
  }

  const getStatusBadge = () => {
    const styles: Record<string, string> = {
      "Under Review": "bg-amber-50 text-amber-700 border-amber-200",
      "Missing Requirements": "bg-orange-50 text-orange-700 border-orange-200",
      "For Exam": "bg-blue-50 text-blue-700 border-blue-200",
      "For Interview": "bg-indigo-50 text-indigo-700 border-indigo-200",
      "Accepted": "bg-green-50 text-green-700 border-green-200",
      "Rejected": "bg-red-50 text-red-700 border-red-200",
      "Waitlisted": "bg-purple-50 text-purple-700 border-purple-200",
      "Passed": "bg-green-50 text-green-700 border-green-200",
      "Not Accepted": "bg-red-50 text-red-700 border-red-200",
    };

    return (
      <span className={`px-3 py-1.5 rounded-lg text-xs font-semibold border ${styles[application.status]}`}>
        {application.status}
      </span>
    );
  };

  return (
    <>
      {/* Page Title */}
      <div className="bg-white px-4 pt-4 pb-3 border-b border-gray-100">
        <div className="flex items-center gap-3 mb-2">
          <button
            onClick={onBack}
            className="w-8 h-8 flex items-center justify-center rounded-lg hover:bg-gray-100 transition-colors"
          >
            <ArrowLeft className="w-5 h-5 text-gray-600" />
          </button>
          <div className="flex-1 min-w-0">
            <h1 className="text-[15px] font-bold text-[#1a1a1a] truncate">{application.full_name}</h1>
            <p className="text-xs text-gray-400 mt-0.5 font-mono">{application.reference_number}</p>
          </div>
          {getStatusBadge()}
        </div>
      </div>

      {/* Content */}
      <div className="px-4 pt-4 pb-28 space-y-3">
        {statusMessage && (
          <div
            className={`rounded-md border px-4 py-3 text-sm font-medium ${
              statusMessage.type === "error"
                ? "border-red-200 bg-red-50 text-red-700"
                : "border-green-200 bg-green-50 text-green-700"
            }`}
            role={statusMessage.type === "error" ? "alert" : "status"}
          >
            {statusMessage.text}
          </div>
        )}

        {/* Applicant Number (if accepted) */}
        {application.applicant_number && (
          <div className="bg-green-50 border border-green-200 rounded-xl p-4">
            <p className="text-xs text-green-700 font-semibold mb-1">Applicant Number</p>
            <p className="text-lg font-bold text-green-900 font-mono">{application.applicant_number}</p>
          </div>
        )}

        {/* Personal Information */}
        <div className="bg-white rounded-xl p-4 border border-gray-100">
          <div className="flex items-center gap-2 mb-3">
            <User className="w-4 h-4 text-[#F59E0B]" />
            <h2 className="text-sm font-bold text-gray-900">Personal Information</h2>
          </div>
          <div className="space-y-2.5">
            <div>
              <p className="text-xs text-gray-500">Full Name</p>
              <p className="text-sm font-medium text-gray-900">{application.first_name} {application.middle_name} {application.last_name}</p>
            </div>
            <div>
              <p className="text-xs text-gray-500">Birthdate</p>
              <p className="text-sm font-medium text-gray-900">{new Date(application.birthdate).toLocaleDateString()}</p>
            </div>
            <div>
              <p className="text-xs text-gray-500">Email</p>
              <p className="text-sm font-medium text-gray-900 flex items-center gap-2">
                <Mail className="w-3.5 h-3.5 text-gray-400" />
                {application.email}
              </p>
            </div>
            <div>
              <p className="text-xs text-gray-500">Mobile Number</p>
              <p className="text-sm font-medium text-gray-900 flex items-center gap-2">
                <Phone className="w-3.5 h-3.5 text-gray-400" />
                {application.mobile_number}
              </p>
            </div>
            <div>
              <p className="text-xs text-gray-500">Address</p>
              <p className="text-sm font-medium text-gray-900 flex items-start gap-2">
                <MapPin className="w-3.5 h-3.5 text-gray-400 mt-0.5 flex-shrink-0" />
                <span>{application.address}</span>
              </p>
            </div>
          </div>
        </div>

        {/* Program Information */}
        <div className="bg-white rounded-xl p-4 border border-gray-100">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-2">
              <GraduationCap className="w-4 h-4 text-[#F59E0B]" />
              <h2 className="text-sm font-bold text-gray-900">Program Information</h2>
            </div>
            {application.school_level === "College" && (
              <button
                onClick={handleOpenProgramModal}
                className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-[#F59E0B] hover:bg-amber-50 rounded-lg transition-colors"
              >
                <Edit className="w-3.5 h-3.5" />
                Edit
              </button>
            )}
          </div>
          <div className="space-y-2.5">
            <div>
              <p className="text-xs text-gray-500">School Level</p>
              <p className="text-sm font-medium text-gray-900">{application.school_level}</p>
            </div>
            <div>
              <p className="text-xs text-gray-500">Applicant Type</p>
              <p className="text-sm font-medium text-gray-900">{application.applicant_type}</p>
            </div>
            {application.program_selection?.college_department && (
              <div>
                <p className="text-xs text-gray-500">Department</p>
                <p className="text-sm font-medium text-gray-900">{application.program_selection.college_department}</p>
              </div>
            )}
            {application.program_selection?.college_program && (
              <div>
                <p className="text-xs text-gray-500">Program</p>
                <p className="text-sm font-medium text-gray-900">{application.program_selection.college_program}</p>
              </div>
            )}
            {application.program_selection?.senior_high_track && (
              <div>
                <p className="text-xs text-gray-500">Track</p>
                <p className="text-sm font-medium text-gray-900">{application.program_selection.senior_high_track}</p>
              </div>
            )}
            {application.school_level === "College" && !application.program_selection?.college_program && (
              <div className="bg-amber-50 border border-amber-200 rounded-lg p-3 mt-2">
                <p className="text-xs text-amber-700 font-medium">No program assigned yet. Click "Edit" to assign a program.</p>
              </div>
            )}
          </div>
        </div>

        {/* Parent Information */}
        {application.parent_info && (
          <div className="bg-white rounded-xl p-4 border border-gray-100">
            <div className="flex items-center gap-2 mb-3">
              <UsersIcon className="w-4 h-4 text-[#F59E0B]" />
              <h2 className="text-sm font-bold text-gray-900">Parent/Guardian Information</h2>
            </div>
            <div className="space-y-3">
              {/* Father */}
              <div className="pb-3 border-b border-gray-100">
                <p className="text-xs font-semibold text-gray-700 mb-2">Father</p>
                <div className="space-y-1.5 pl-3">
                  <div>
                    <p className="text-xs text-gray-500">Name</p>
                    <p className="text-sm font-medium text-gray-900">{application.parent_info.father_name}</p>
                  </div>
                  <div>
                    <p className="text-xs text-gray-500">Contact</p>
                    <p className="text-sm font-medium text-gray-900">{application.parent_info.father_contact}</p>
                  </div>
                  <div>
                    <p className="text-xs text-gray-500">Address</p>
                    <p className="text-sm font-medium text-gray-900">{application.parent_info.father_address}</p>
                  </div>
                </div>
              </div>

              {/* Mother */}
              <div className="pb-3 border-b border-gray-100">
                <p className="text-xs font-semibold text-gray-700 mb-2">Mother</p>
                <div className="space-y-1.5 pl-3">
                  <div>
                    <p className="text-xs text-gray-500">Name</p>
                    <p className="text-sm font-medium text-gray-900">{application.parent_info.mother_name}</p>
                  </div>
                  <div>
                    <p className="text-xs text-gray-500">Contact</p>
                    <p className="text-sm font-medium text-gray-900">{application.parent_info.mother_contact}</p>
                  </div>
                  <div>
                    <p className="text-xs text-gray-500">Address</p>
                    <p className="text-sm font-medium text-gray-900">{application.parent_info.mother_address}</p>
                  </div>
                </div>
              </div>

              {/* Guardian */}
              {application.parent_info.guardian_name && (
                <div>
                  <p className="text-xs font-semibold text-gray-700 mb-2">Guardian</p>
                  <div className="space-y-1.5 pl-3">
                    <div>
                      <p className="text-xs text-gray-500">Name</p>
                      <p className="text-sm font-medium text-gray-900">{application.parent_info.guardian_name}</p>
                    </div>
                    <div>
                      <p className="text-xs text-gray-500">Home Phone</p>
                      <p className="text-sm font-medium text-gray-900">{application.parent_info.guardian_phone_home || "N/A"}</p>
                    </div>
                    <div>
                      <p className="text-xs text-gray-500">Address</p>
                      <p className="text-sm font-medium text-gray-900">{application.parent_info.guardian_address || "N/A"}</p>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Academic Background */}
        {application.academic_background.length > 0 && (
          <div className="bg-white rounded-xl p-4 border border-gray-100">
            <div className="flex items-center gap-2 mb-3">
              <GraduationCap className="w-4 h-4 text-[#F59E0B]" />
              <h2 className="text-sm font-bold text-gray-900">Academic Background</h2>
            </div>
            <div className="space-y-2.5">
              {application.academic_background.map((entry, index) => (
                <div key={index} className="border-l-2 border-[#F59E0B] pl-3 py-1">
                  <p className="text-sm font-semibold text-gray-900">{entry.grade_level}</p>
                  <p className="text-xs text-gray-600">{entry.school_name}</p>
                  <p className="text-xs text-gray-500">Completed: {entry.completion_year}</p>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Alumni Relatives */}
        {application.alumni_relatives.length > 0 && (
          <div className="bg-white rounded-xl p-4 border border-gray-100">
            <div className="flex items-center gap-2 mb-3">
              <UsersIcon className="w-4 h-4 text-[#F59E0B]" />
              <h2 className="text-sm font-bold text-gray-900">Alumni Relatives</h2>
            </div>
            <div className="space-y-2.5">
              {application.alumni_relatives.map((relative, index) => (
                <div key={index} className="border-l-2 border-purple-500 pl-3 py-1">
                  <p className="text-sm font-semibold text-gray-900">{relative.name}</p>
                  <p className="text-xs text-gray-600">{relative.relationship} - {relative.college}</p>
                  <p className="text-xs text-gray-500">Batch {relative.batch_year} - {relative.contact_number}</p>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Documents */}
        <div className="bg-white rounded-xl p-4 border border-gray-100">
          <div className="flex items-center gap-2 mb-3">
            <FileText className="w-4 h-4 text-[#F59E0B]" />
            <h2 className="text-sm font-bold text-gray-900">Submitted Documents</h2>
          </div>
          {application.documents.length === 0 ? (
            <p className="text-xs text-gray-500">No documents submitted</p>
          ) : (
            <div className="space-y-2">
              {application.documents.map((doc) => (
                <div key={doc.id} className="flex items-center justify-between p-2.5 border border-gray-200 rounded-lg">
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-gray-900 truncate">{doc.document_name}</p>
                    <p className="text-xs text-gray-500 truncate">{doc.file_name}</p>
                  </div>
                  <a
                    href={doc.file_url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-1.5 px-3 py-1.5 text-[#F59E0B] hover:bg-amber-50 rounded-lg transition-colors flex-shrink-0 ml-2"
                  >
                    <Download className="w-3.5 h-3.5" />
                    <span className="text-xs font-medium">View</span>
                  </a>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Timeline */}
        <div className="bg-white rounded-xl p-4 border border-gray-100">
          <div className="flex items-center gap-2 mb-3">
            <Calendar className="w-4 h-4 text-[#F59E0B]" />
            <h2 className="text-sm font-bold text-gray-900">Timeline</h2>
          </div>
          <div className="space-y-2.5">
            <div>
              <p className="text-xs text-gray-500">Submitted</p>
              <p className="text-sm font-medium text-gray-900">
                {new Date(application.application_submitted_at).toLocaleString()}
              </p>
            </div>
            {application.reviewed_at && (
              <div>
                <p className="text-xs text-gray-500">Reviewed</p>
                <p className="text-sm font-medium text-gray-900">
                  {new Date(application.reviewed_at).toLocaleString()}
                </p>
              </div>
            )}
          </div>
        </div>

        {/* Rejection Reason */}
        {application.status === "Not Accepted" && application.rejection_reason && (
          <div className="bg-red-50 border border-red-200 rounded-xl p-4">
            <h2 className="text-sm font-bold text-red-900 mb-2">Rejection Reason</h2>
            <p className="text-sm text-red-700">{application.rejection_reason}</p>
          </div>
        )}
      </div>

      {/* Action Buttons */}
      {application.status === "Under Review" && (
        <div className="mt-6 flex flex-col-reverse gap-3 border-t border-neutral-200 px-4 pt-4 sm:flex-row sm:justify-end">
          <button
            onClick={handleAccept}
            disabled={updating}
            className="inline-flex h-11 w-full items-center justify-center gap-2 rounded-md bg-green-600 px-4 text-sm font-semibold text-white transition-colors hover:bg-green-700 disabled:cursor-not-allowed disabled:opacity-50 sm:w-auto"
          >
            <CheckCircle className="w-5 h-5" />
            Accept Application
          </button>
          <button
            onClick={() => setShowRejectModal(true)}
            disabled={updating}
            className="inline-flex h-11 w-full items-center justify-center gap-2 rounded-md bg-red-600 px-4 text-sm font-semibold text-white transition-colors hover:bg-red-700 disabled:cursor-not-allowed disabled:opacity-50 sm:w-auto"
          >
            <XCircle className="w-5 h-5" />
            Reject Application
          </button>
        </div>
      )}

      {/* Reject Modal */}
      {showRejectModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl p-6 max-w-md w-full mx-4">
            <h3 className="text-lg font-bold text-gray-900 mb-2">Reject Application</h3>
            <p className="text-sm text-gray-600 mb-4">
              Please provide a reason for rejecting this application. This will be sent to the applicant.
            </p>
            <textarea
              value={rejectionReason}
              onChange={(e) => setRejectionReason(e.target.value)}
              placeholder="Enter rejection reason..."
              className="w-full px-3 py-2.5 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 min-h-[100px]"
            />
            <div className="flex gap-3 mt-4">
              <button
                onClick={() => setShowRejectModal(false)}
                disabled={updating}
                className="flex-1 h-11 rounded-xl border border-gray-300 text-gray-700 font-semibold text-sm hover:bg-gray-50 disabled:opacity-50 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleReject}
                disabled={updating || !rejectionReason.trim()}
                className="flex-1 h-11 rounded-xl bg-red-600 text-white font-semibold text-sm hover:bg-red-700 disabled:opacity-50 transition-colors"
              >
                {updating ? "Rejecting..." : "Confirm Reject"}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Program Assignment Modal */}
      {showProgramModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl p-6 max-w-md w-full mx-4">
            <div className="flex items-center gap-2 mb-2">
              <GraduationCap className="w-5 h-5 text-[#F59E0B]" />
              <h3 className="text-lg font-bold text-gray-900">Assign College Program</h3>
            </div>
            <p className="text-sm text-gray-600 mb-4">
              Select the department and program for this applicant.
            </p>
            
            {/* Department Selection */}
            <div className="mb-4">
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Department
              </label>
              <select
                value={selectedDepartment}
                onChange={(e) => {
                  setSelectedDepartment(e.target.value);
                  setSelectedProgram(""); // Reset program when department changes
                }}
                className="w-full px-4 py-3 text-sm border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#F59E0B] focus:border-transparent"
              >
                <option value="">Select Department</option>
                {Object.keys(collegeDepartments).map((dept) => (
                  <option key={dept} value={dept}>
                    {dept}
                  </option>
                ))}
              </select>
            </div>

            {/* Program Selection */}
            <div className="mb-6">
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Program
              </label>
              <select
                value={selectedProgram}
                onChange={(e) => setSelectedProgram(e.target.value)}
                disabled={!selectedDepartment}
                className="w-full px-4 py-3 text-sm border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#F59E0B] focus:border-transparent disabled:bg-gray-100 disabled:cursor-not-allowed"
              >
                <option value="">Select Program</option>
                {selectedDepartment &&
                  collegeDepartments[selectedDepartment as keyof typeof collegeDepartments].map((program) => (
                    <option key={program} value={program}>
                      {program}
                    </option>
                  ))}
              </select>
            </div>

            {/* Selected Program Preview */}
            {selectedDepartment && selectedProgram && (
              <div className="bg-amber-50 border border-amber-200 rounded-xl p-3 mb-4">
                <p className="text-xs font-semibold text-amber-900 mb-1">Selected Program:</p>
                <p className="text-sm font-bold text-amber-900">{selectedProgram}</p>
                <p className="text-xs text-amber-700 mt-0.5">{selectedDepartment}</p>
              </div>
            )}

            {/* Action Buttons */}
            <div className="flex gap-3">
              <button
                onClick={() => {
                  setShowProgramModal(false);
                  // Reset to original values
                  if (application?.program_selection) {
                    setSelectedDepartment(application.program_selection.college_department || "");
                    setSelectedProgram(application.program_selection.college_program || "");
                  }
                }}
                disabled={updating}
                className="flex-1 h-11 rounded-xl border border-gray-300 text-gray-700 font-semibold text-sm hover:bg-gray-50 disabled:opacity-50 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleUpdateProgram}
                disabled={updating || !selectedDepartment || !selectedProgram}
                className="flex-1 h-11 rounded-xl bg-[#F59E0B] text-white font-semibold text-sm hover:bg-[#D97706] disabled:opacity-50 transition-colors"
              >
                {updating ? "Updating..." : "Save Program"}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
