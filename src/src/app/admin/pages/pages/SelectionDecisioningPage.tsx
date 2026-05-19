import { useState, useEffect } from "react";
import { User, GraduationCap, CheckCircle, XCircle, Clock, Loader2, Award } from "lucide-react";
import { fetchSelectionDecisioningList, updateApplicationStatus } from "../../services/admin.service";

interface Applicant {
  id: string;
  name: string;
  referenceNumber?: string;
  schoolLevel?: string;
  applicantType?: string;
  program: string;
  examScore: number;
  interviewScore: number;
  gpa: number;
}

export function SelectionDecisioningPage() {
  const [applicants, setApplicants] = useState<Applicant[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedApplicant, setSelectedApplicant] = useState<Applicant | null>(null);
  const [decision, setDecision] = useState<"Accept" | "Reject" | "Waitlist" | null>(null);
  const [remarks, setRemarks] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const loadApplicants = async () => {
    setLoading(true);
    const res = await fetchSelectionDecisioningList();
    if (res.data) {
      setApplicants(res.data);
    }
    setLoading(false);
  };

  useEffect(() => {
    loadApplicants();
  }, []);

  const handleSubmitDecision = async () => {
    if (!decision || !selectedApplicant) return;

    // Map Accept -> Passed, Reject -> Not Accepted, Waitlist -> Under Review
    const dbStatus = decision === "Accept" 
      ? "Passed" 
      : decision === "Reject" 
        ? "Not Accepted" 
        : "Under Review";

    const confirmMsg = decision === "Waitlist"
      ? `Are you sure you want to flag ${selectedApplicant.name} as Waitlisted?`
      : `Are you sure you want to ${decision === "Accept" ? "Accept" : "Reject"} ${selectedApplicant.name}?\nThis will automatically dispatch an official email notification.`;

    if (!confirm(confirmMsg)) return;

    setSubmitting(true);
    try {
      const res = await updateApplicationStatus(selectedApplicant.id, dbStatus, remarks || undefined);
      if (res.error) throw new Error(res.error.message);
      
      alert(
        decision === "Waitlist"
          ? `Successfully waitlisted ${selectedApplicant.name}!`
          : `Decision successfully submitted! An automated admission email has been dispatched to ${selectedApplicant.name}.`
      );

      setSelectedApplicant(null);
      setDecision(null);
      setRemarks("");
      await loadApplicants();
    } catch (err: any) {
      alert(`Error submitting decision: ${err.message}`);
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="p-10 flex flex-col items-center justify-center py-32 bg-white rounded-2xl border border-gray-200 shadow-sm m-10">
        <Loader2 className="w-12 h-12 text-[#F59E0B] animate-spin mb-4" />
        <p className="text-gray-500 font-semibold">Retrieving applicants awaiting decision from Supabase...</p>
      </div>
    );
  }

  return (
    <div className="p-10">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Panel - Applicant List */}
        <div className="lg:col-span-1">
          <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-6">
            <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center justify-between">
              <span>Awaiting Decision</span>
              <span className="px-2.5 py-0.5 bg-amber-50 text-[#F59E0B] rounded-full text-xs font-bold border border-amber-200">
                {applicants.length} pending
              </span>
            </h3>
            
            {applicants.length === 0 ? (
              <div className="text-center py-10 text-gray-500 text-sm">
                No applicants currently under review.
              </div>
            ) : (
              <div className="space-y-3 max-h-[600px] overflow-y-auto pr-1">
                {applicants.map((applicant) => (
                  <button
                    key={applicant.id}
                    onClick={() => {
                      setSelectedApplicant(applicant);
                      setDecision(null);
                      setRemarks("");
                    }}
                    className={`w-full text-left p-4 rounded-xl border-2 transition-all ${
                      selectedApplicant?.id === applicant.id
                        ? "border-[#F59E0B] bg-amber-50"
                        : "border-gray-200 hover:border-gray-300"
                    }`}
                  >
                    <div className="flex items-center gap-3 mb-2">
                      <div className="w-10 h-10 rounded-full bg-gradient-to-br from-[#F59E0B] to-[#D97706] flex items-center justify-center text-white font-semibold">
                        {applicant.name.charAt(0)}
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="font-semibold text-gray-900 truncate">{applicant.name}</p>
                        <div className="flex items-center gap-2 mt-0.5">
                          <span className="text-[9px] font-bold text-gray-500 uppercase tracking-wider bg-gray-100 px-1.5 py-0.5 rounded">
                            {applicant.schoolLevel || "College"}
                          </span>
                          <span className="text-xs text-[#F59E0B] font-semibold font-mono truncate" title={applicant.referenceNumber || applicant.id}>
                            {applicant.referenceNumber || applicant.id}
                          </span>
                        </div>
                      </div>
                    </div>
                    <p className="text-xs text-gray-600 truncate font-medium flex items-center gap-1">
                      <GraduationCap className="w-3.5 h-3.5 text-gray-400" />
                      {applicant.program}
                    </p>
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Right Panel - Profile & Decision */}
        <div className="lg:col-span-2">
          {selectedApplicant ? (
            <div className="space-y-6">
              {/* Profile Summary */}
              <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-8 relative overflow-hidden">
                <div className="absolute top-0 right-0 p-6 opacity-5">
                  <Award className="w-32 h-32 text-gray-900" />
                </div>
                
                <div className="flex items-start gap-6 mb-6">
                  <div className="w-20 h-20 rounded-full bg-gradient-to-br from-[#F59E0B] to-[#D97706] flex items-center justify-center text-white font-bold text-2xl shadow-lg">
                    {selectedApplicant.name.charAt(0)}
                  </div>
                  <div className="flex-1">
                    <h2 className="text-2xl font-bold text-gray-900 mb-1">{selectedApplicant.name}</h2>
                    <div className="flex items-center gap-2 mb-3">
                      <span className="px-2 py-0.5 bg-gray-100 text-gray-600 text-xs font-bold rounded uppercase">
                        {selectedApplicant.schoolLevel || "College"}
                      </span>
                      <span className="px-2 py-0.5 bg-amber-50 text-[#F59E0B] text-xs font-semibold rounded font-mono border border-amber-200">
                        {selectedApplicant.referenceNumber || selectedApplicant.id}
                      </span>
                    </div>
                    <div className="flex items-center gap-2 text-gray-700">
                      <GraduationCap className="w-5 h-5 text-[#F59E0B]" />
                      <span className="font-semibold">{selectedApplicant.program}</span>
                    </div>
                  </div>
                </div>

                {/* Scores */}
                <div className="grid grid-cols-3 gap-4">
                  <div className="bg-blue-50 rounded-xl p-4 border border-blue-100 shadow-sm">
                    <p className="text-xs text-blue-600 font-bold uppercase tracking-wider mb-1">Entrance Exam</p>
                    <p className="text-3xl font-black text-blue-700">{selectedApplicant.examScore}%</p>
                  </div>
                  <div className="bg-purple-50 rounded-xl p-4 border border-purple-100 shadow-sm">
                    <p className="text-xs text-purple-600 font-bold uppercase tracking-wider mb-1">Interview</p>
                    <p className="text-3xl font-black text-purple-700">{selectedApplicant.interviewScore}%</p>
                  </div>
                  <div className="bg-green-50 rounded-xl p-4 border border-green-100 shadow-sm">
                    <p className="text-xs text-green-600 font-bold uppercase tracking-wider mb-1">Incoming GPA</p>
                    <p className="text-3xl font-black text-green-700">{selectedApplicant.gpa.toFixed(2)}</p>
                  </div>
                </div>
              </div>

              {/* Decision Panel */}
              <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-8">
                <h3 className="text-xl font-bold text-gray-900 mb-6">Make Selection Decision</h3>
                
                {/* Decision Options */}
                <div className="grid grid-cols-3 gap-4 mb-6">
                  <button
                    onClick={() => setDecision("Accept")}
                    disabled={submitting}
                    className={`p-4 rounded-xl border-2 transition-all ${
                      decision === "Accept"
                        ? "border-green-500 bg-green-50"
                        : "border-gray-200 hover:border-green-300"
                    } disabled:opacity-50`}
                  >
                    <CheckCircle className={`w-8 h-8 mx-auto mb-2 ${decision === "Accept" ? "text-green-600" : "text-gray-400"}`} />
                    <p className={`text-sm font-bold ${decision === "Accept" ? "text-green-700" : "text-gray-600"}`}>Accept</p>
                  </button>
                  <button
                    onClick={() => setDecision("Reject")}
                    disabled={submitting}
                    className={`p-4 rounded-xl border-2 transition-all ${
                      decision === "Reject"
                        ? "border-red-500 bg-red-50"
                        : "border-gray-200 hover:border-red-300"
                    } disabled:opacity-50`}
                  >
                    <XCircle className={`w-8 h-8 mx-auto mb-2 ${decision === "Reject" ? "text-red-600" : "text-gray-400"}`} />
                    <p className={`text-sm font-bold ${decision === "Reject" ? "text-red-700" : "text-gray-600"}`}>Reject</p>
                  </button>
                  <button
                    onClick={() => setDecision("Waitlist")}
                    disabled={submitting}
                    className={`p-4 rounded-xl border-2 transition-all ${
                      decision === "Waitlist"
                        ? "border-amber-500 bg-amber-50"
                        : "border-gray-200 hover:border-amber-300"
                    } disabled:opacity-50`}
                  >
                    <Clock className={`w-8 h-8 mx-auto mb-2 ${decision === "Waitlist" ? "text-amber-600" : "text-gray-400"}`} />
                    <p className={`text-sm font-bold ${decision === "Waitlist" ? "text-amber-700" : "text-gray-600"}`}>Waitlist</p>
                  </button>
                </div>

                {/* Remarks */}
                <div className="mb-6">
                  <label className="block text-sm font-bold text-gray-700 mb-2">Decision Remarks / Rejection Reason</label>
                  <textarea
                    value={remarks}
                    onChange={(e) => setRemarks(e.target.value)}
                    disabled={submitting}
                    rows={4}
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#F59E0B] focus:border-transparent resize-none disabled:bg-gray-50"
                    placeholder={
                      decision === "Reject" 
                        ? "Explain the reason for rejection (this will be emailed to the applicant)..." 
                        : "Add any optional internal notes or remarks about this decision..."
                    }
                  />
                </div>

                {/* Submit Button */}
                <button
                  onClick={handleSubmitDecision}
                  disabled={!decision || submitting}
                  className="w-full py-3.5 bg-gradient-to-r from-[#F59E0B] to-[#D97706] text-white rounded-xl font-bold hover:from-[#D97706] hover:to-[#B45309] transition-all disabled:opacity-50 disabled:cursor-not-allowed shadow-lg flex items-center justify-center gap-2"
                >
                  {submitting ? (
                    <>
                      <Loader2 className="w-5 h-5 animate-spin" />
                      Submitting Decision...
                    </>
                  ) : (
                    "Submit Decision"
                  )}
                </button>
              </div>
            </div>
          ) : (
            <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-20 text-center">
              <User className="w-16 h-16 text-gray-300 mx-auto mb-4 animate-pulse" />
              <p className="text-gray-500 font-medium">Select an applicant to review and make a selection decision</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
