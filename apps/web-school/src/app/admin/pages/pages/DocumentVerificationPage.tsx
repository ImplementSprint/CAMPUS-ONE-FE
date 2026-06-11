import { useState, useEffect } from "react";
import { FileCheck, CheckCircle, XCircle, AlertCircle, RefreshCw, Loader2, Clock, Eye } from "lucide-react";
import { 
  fetchDocumentVerificationList, 
  verifyApplicantDocuments, 
  requestApplicantDocumentReupload 
} from "../../services/admin.service";

interface Applicant {
  id: string;
  name: string;
  referenceNumber?: string;
  schoolLevel?: string;
  applicantType?: string;
  documents: Array<{
    id: string;
    name: string;
    required: boolean;
    status: string;
    url: string | null;
  }>;
}

export function DocumentVerificationPage() {
  const [applicants, setApplicants] = useState<Applicant[]>([]);
  const [loading, setLoading] = useState(true);
  const [actionId, setActionId] = useState<string | null>(null);
  const [statusMessage, setStatusMessage] = useState<{ type: "error" | "success"; text: string } | null>(null);

  const loadVerificationList = async () => {
    setLoading(true);
    const res = await fetchDocumentVerificationList();
    if (res.data) {
      setApplicants(res.data);
    }
    setLoading(false);
  };

  useEffect(() => {
    loadVerificationList();
  }, []);

  const handleVerifyAll = async (applicantId: string, name: string) => {
    if (!confirm(`Are you sure you want to verify and approve all uploaded documents for ${name}?`)) return;
    
    setStatusMessage(null);
    setActionId(applicantId);
    try {
      const res = await verifyApplicantDocuments(applicantId);
      if (res.error) throw new Error(res.error.message);
      setStatusMessage({ type: "success", text: `Successfully verified all documents for ${name}.` });
      await loadVerificationList();
    } catch (err: any) {
      setStatusMessage({ type: "error", text: `Error verifying documents: ${err.message}` });
    } finally {
      setActionId(null);
    }
  };

  const handleRequestReupload = async (applicantId: string, name: string) => {
    if (!confirm(`Are you sure you want to flag missing or incorrect documents for ${name}?\nThis will request the student to re-upload them from their mobile app.`)) return;

    setStatusMessage(null);
    setActionId(applicantId);
    try {
      const res = await requestApplicantDocumentReupload(applicantId);
      if (res.error) throw new Error(res.error.message);
      setStatusMessage({ type: "success", text: `Documents flagged. Re-upload requests dispatched to ${name}'s dashboard.` });
      await loadVerificationList();
    } catch (err: any) {
      setStatusMessage({ type: "error", text: `Error initiating re-upload request: ${err.message}` });
    } finally {
      setActionId(null);
    }
  };

  const getInitials = (name: string) => {
    return name ? name.split(" ").map(n => n[0]).join("") : "A";
  };

  const renderStatus = (status: string) => {
    switch (status) {
      case "Verified":
        return (
          <div className="flex items-center gap-1.5 px-3 py-1 bg-green-50 border border-green-200 text-green-700 rounded-lg text-xs font-semibold">
            <CheckCircle className="w-3.5 h-3.5 text-green-500" />
            Verified
          </div>
        );
      case "Requested":
        return (
          <div className="flex items-center gap-1.5 px-3 py-1 bg-red-50 border border-red-200 text-red-700 rounded-lg text-xs font-semibold animate-pulse">
            <RefreshCw className="w-3.5 h-3.5 text-red-500" />
            Needs Re-upload
          </div>
        );
      case "not_uploaded":
        return (
          <div className="flex items-center gap-1.5 px-3 py-1 bg-gray-50 border border-gray-200 text-gray-400 rounded-lg text-xs font-medium">
            <XCircle className="w-3.5 h-3.5 text-gray-400" />
            Missing
          </div>
        );
      case "submitted":
      default:
        return (
          <div className="flex items-center gap-1.5 px-3 py-1 bg-amber-50 border border-amber-200 text-amber-700 rounded-lg text-xs font-semibold shadow-sm animate-pulse">
            <Clock className="w-3.5 h-3.5 text-amber-500 animate-spin-once" />
            Pending Audit
          </div>
        );
    }
  };

  return (
    <div className="p-10">
      {statusMessage && (
        <div
          className={`mb-6 rounded-md border px-4 py-3 text-sm font-medium ${
            statusMessage.type === "error"
              ? "border-red-200 bg-red-50 text-red-700"
              : "border-green-200 bg-green-50 text-green-700"
          }`}
          role={statusMessage.type === "error" ? "alert" : "status"}
        >
          {statusMessage.text}
        </div>
      )}
      {loading ? (
        <div className="flex flex-col items-center justify-center py-32 bg-white rounded-2xl border border-gray-200 shadow-sm">
          <Loader2 className="w-12 h-12 text-[#F59E0B] animate-spin mb-4" />
          <p className="text-gray-500 font-medium">Fetching document verification status from Supabase...</p>
        </div>
      ) : applicants.length === 0 ? (
        <div className="text-center py-20 bg-white rounded-2xl border border-gray-200 shadow-sm text-gray-500">
          No applicant documents submitted for verification.
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {applicants.map((applicant) => {
            const allVerified = applicant.documents
              .filter(doc => doc.required)
              .every(doc => doc.status === "Verified");
            const isProcessing = actionId === applicant.id;
            
            return (
              <div key={applicant.id} className="bg-white rounded-2xl p-6 border border-gray-200 shadow-sm hover:shadow-xl transition-all relative overflow-hidden flex flex-col justify-between min-h-[420px]">
                <div>
                  {/* Header */}
                  <div className="flex items-center gap-4 mb-6">
                    <div className="w-14 h-14 rounded-full bg-gradient-to-br from-[#F59E0B] to-[#D97706] flex items-center justify-center text-white font-bold text-lg shadow-lg">
                      {getInitials(applicant.name)}
                    </div>
                    <div className="flex-1">
                      <h3 className="font-bold text-gray-900 line-clamp-1 text-base">{applicant.name}</h3>
                      <div className="flex items-center gap-2 mt-0.5">
                        <span className="text-[10px] font-bold text-gray-500 uppercase tracking-wider bg-gray-100 px-2 py-0.5 rounded">
                          {applicant.schoolLevel || "College"}
                        </span>
                        <span className="text-xs text-[#F59E0B] font-semibold font-mono truncate max-w-[120px]" title={applicant.referenceNumber || applicant.id}>
                          {applicant.referenceNumber || applicant.id}
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Documents Checklist */}
                  <div className="space-y-3 mb-6 max-h-[220px] overflow-y-auto pr-1">
                    {applicant.documents.map((doc) => (
                      <div key={doc.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-xl">
                        <div className="flex flex-col gap-0.5">
                          <span className="text-sm font-medium text-gray-700">
                            {doc.name}
                            {doc.required && <span className="text-red-500 ml-1">*</span>}
                          </span>
                          {doc.url && (
                            <a 
                              href={doc.url} 
                              target="_blank" 
                              rel="noopener noreferrer"
                              className="text-xs text-blue-600 hover:text-blue-800 hover:underline flex items-center gap-1 font-semibold mt-0.5 transition-colors"
                            >
                              <Eye className="w-3.5 h-3.5" />
                              View Submitted File
                            </a>
                          )}
                        </div>
                        {renderStatus(doc.status)}
                      </div>
                    ))}
                  </div>
                </div>

                {/* Actions */}
                {allVerified ? (
                  <div className="flex items-center gap-2 p-3 bg-green-50 border border-green-200 rounded-xl justify-center">
                    <CheckCircle className="w-5 h-5 text-green-600" />
                    <span className="text-sm font-semibold text-green-700">All Verified & Cleared</span>
                  </div>
                ) : (
                  <div className="grid grid-cols-2 gap-3">
                    <button 
                      onClick={() => handleVerifyAll(applicant.id, applicant.name)}
                      disabled={isProcessing}
                      className="px-4 py-2.5 bg-gradient-to-r from-green-500 to-green-600 text-white rounded-xl font-semibold hover:from-green-600 hover:to-green-700 transition-all shadow-sm flex items-center justify-center gap-2 disabled:opacity-50"
                    >
                      {isProcessing ? (
                        <Loader2 className="w-4 h-4 animate-spin" />
                      ) : (
                        <FileCheck className="w-4 h-4" />
                      )}
                      Verify
                    </button>
                    <button 
                      onClick={() => handleRequestReupload(applicant.id, applicant.name)}
                      disabled={isProcessing}
                      className="px-4 py-2.5 bg-white border-2 border-gray-200 text-gray-700 rounded-xl font-semibold hover:border-[#F59E0B] hover:text-[#F59E0B] transition-all flex items-center justify-center gap-2 disabled:opacity-50"
                    >
                      {isProcessing ? (
                        <Loader2 className="w-4 h-4 animate-spin" />
                      ) : (
                        <RefreshCw className="w-4 h-4" />
                      )}
                      Request
                    </button>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
