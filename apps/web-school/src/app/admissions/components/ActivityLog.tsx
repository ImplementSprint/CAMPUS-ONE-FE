'use client'
import { useState, useEffect } from "react";
import type { SchoolLevel, ApplicantType, AdmissionStatus } from "../types/admissions.types";
import { SelectionTags } from "./SelectionTags";
import { CheckCircle2, CreditCard, ListTodo, Clock } from "lucide-react";
import { supabase } from "@/lib/supabase";

interface ActivityLogProps {
  schoolLevel: SchoolLevel;
  applicantType: ApplicantType;
  applicantId: string;
}

type PaymentMethod = "credit_card" | "e_wallet" | "online_banking";
type TabType = "tasks" | "payment" | "activity";

interface ActivityLogEntry {
  sequence: number;
  activityName: string;
  action: string;
  newActivity: string;
}

export function ActivityLog({ schoolLevel, applicantType, applicantId }: ActivityLogProps) {
  const [activeTab, setActiveTab] = useState<TabType>("tasks");
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>("credit_card");
  const [paymentCompleted, setPaymentCompleted] = useState(false);
  const [selectedTestingCenter, setSelectedTestingCenter] = useState("");
  const [rescheduleReason, setRescheduleReason] = useState("");
  const [examSchedule, setExamSchedule] = useState("");
  const [applicationStatus, setApplicationStatus] = useState<AdmissionStatus>("Under Review");
  const [loading, setLoading] = useState(true);
  const [actionMessage, setActionMessage] = useState<{ type: "error" | "success"; text: string } | null>(null);

  const admissionFee = 600.00;

  useEffect(() => {
    fetchApplicationStatus();
  }, [applicantId]);

  const fetchApplicationStatus = async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from("applicant_profiles")
      .select("status")
      .eq("id", applicantId)
      .single();

    if (data) {
      setApplicationStatus(data.status as AdmissionStatus);
    }
    setLoading(false);
  };

  const taskList = [
    { id: 1, text: "Create applicant account.", completed: true },
    { id: 2, text: "Submit personal, parent, and academic information.", completed: true },
    { id: 3, text: "Complete required admissions documents.", completed: true, subtasks: [
      "Review the document checklist",
      "Upload required files",
      "Wait for records office validation",
      "Resolve missing or unclear documents when requested"
    ]},
    { id: 4, text: "Wait for admissions review.", completed: applicationStatus === "Passed" },
    { id: 5, text: "Select an exam schedule when available.", completed: false },
    { id: 6, text: "Pay the admission fee after acceptance.", completed: paymentCompleted },
  ];

  const activityLogs: ActivityLogEntry[] = [
    {
      sequence: 1,
      activityName: "APPLICATION CREATED",
      action: "Submitted",
      newActivity: "Complete applicant profile"
    },
    {
      sequence: 2,
      activityName: "PROFILE AND DOCUMENTS SUBMITTED",
      action: "Submitted",
      newActivity: "Wait for records validation"
    },
    {
      sequence: 3,
      activityName: "ADMISSIONS REVIEW",
      action: applicationStatus,
      newActivity: applicationStatus === "Passed" ? "Proceed with payment and exam scheduling" : "Wait for admissions decision"
    },
    {
      sequence: 4,
      activityName: "ADMISSION FEE",
      action: paymentCompleted ? "Paid" : "Pending",
      newActivity: paymentCompleted ? "Download official receipt" : "Complete payment when available"
    },
  ];

  const handlePayment = () => {
    setPaymentCompleted(true);
    setActionMessage({ type: "success", text: "Payment recorded for this session. Connect the payment gateway before using this in production." });
  };

  const handlePrintReceipt = () => {
    setActionMessage({ type: "success", text: "Receipt generation will use the official payment record once the gateway is connected." });
  };

  const handleSubmitTestingCenter = () => {
    if (!selectedTestingCenter) {
      setActionMessage({ type: "error", text: "Select an exam schedule before submitting." });
      return;
    }
    setActionMessage({ type: "success", text: "Exam schedule selection saved for this session." });
  };

  const handleSubmitReschedule = () => {
    if (!examSchedule || !rescheduleReason.trim()) {
      setActionMessage({ type: "error", text: "Select a new schedule and provide a reason for the reschedule request." });
      return;
    }
    setActionMessage({ type: "success", text: "Reschedule request prepared for admissions review." });
  };

  const isAccepted = applicationStatus === "Passed";

  // For testing: Force show payment tab (remove this line in production)
  // const isAccepted = true;

  return (
    <div className="flex-1 overflow-y-auto">
      <div className="px-4 pt-5 pb-8">
        <SelectionTags schoolLevel={schoolLevel} applicantType={applicantType} />

        <div className="mb-3 rounded-lg border border-gray-200 bg-white p-3">
          <p className="text-xs text-gray-700">
            <span className="font-semibold">Application status:</span> {applicationStatus}
          </p>
        </div>

        {actionMessage && (
          <div
            className={`mb-3 rounded-md border px-3 py-2 text-sm font-medium ${
              actionMessage.type === "error"
                ? "border-red-200 bg-red-50 text-red-700"
                : "border-green-200 bg-green-50 text-green-700"
            }`}
            role={actionMessage.type === "error" ? "alert" : "status"}
          >
            {actionMessage.text}
          </div>
        )}

        {/* Tabs */}
        <div className="flex gap-2 mb-4 overflow-x-auto pb-2">
          <button
            onClick={() => setActiveTab("tasks")}
            className={`flex items-center gap-2 px-4 py-2.5 rounded-lg font-semibold text-sm whitespace-nowrap transition-colors ${
              activeTab === "tasks"
                ? "bg-[#F59E0B] text-white"
                : "bg-white text-gray-600 border border-gray-200"
            }`}
          >
            <ListTodo className="w-4 h-4" />
            Task List
          </button>

          <button
            onClick={() => setActiveTab("payment")}
            className={`flex items-center gap-2 px-4 py-2.5 rounded-lg font-semibold text-sm whitespace-nowrap transition-colors ${
              activeTab === "payment"
                ? "bg-[#F59E0B] text-white"
                : "bg-white text-gray-600 border border-gray-200"
            } ${!isAccepted ? "opacity-50" : ""}`}
          >
            <CreditCard className="w-4 h-4" />
            Admission Fee Payment
            {!isAccepted && <span className="text-[10px] ml-1">(Locked)</span>}
          </button>

          <button
            onClick={() => setActiveTab("activity")}
            className={`flex items-center gap-2 px-4 py-2.5 rounded-lg font-semibold text-sm whitespace-nowrap transition-colors ${
              activeTab === "activity"
                ? "bg-[#F59E0B] text-white"
                : "bg-white text-gray-600 border border-gray-200"
            }`}
          >
            <Clock className="w-4 h-4" />
            Activity Log
          </button>
        </div>

        {/* Task List Tab - Portrait/Vertical */}
        {activeTab === "tasks" && (
          <div className="space-y-4">
            {/* Task List Card */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
              <div className="bg-[#1a1a1a] px-4 py-3">
                <h3 className="text-sm font-bold text-white">TASK LIST</h3>
              </div>

              <div className="p-4 space-y-3">
                {taskList.map((task) => (
                  <div key={task.id}>
                    <div className="flex items-start gap-2">
                      <CheckCircle2 
                        className={`w-5 h-5 flex-shrink-0 mt-0.5 ${
                          task.completed ? "text-green-500" : "text-gray-300"
                        }`}
                      />
                      <div className="flex-1">
                        <p className={`text-sm ${task.completed ? "text-gray-800" : "text-gray-500"}`}>
                          {task.id}.) {task.text}
                        </p>
                        {task.subtasks && (
                          <ul className="ml-4 mt-2 space-y-1">
                            {task.subtasks.map((subtask, idx) => (
                              <li key={idx} className="text-xs text-gray-600">- {subtask}</li>
                            ))}
                          </ul>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Testing Center */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
              <div className="bg-[#1a1a1a] px-4 py-3">
                <h3 className="text-sm font-bold text-white">TESTING CENTER</h3>
              </div>

              <div className="p-4">
                <p className="text-xs text-gray-600 mb-4 leading-relaxed">
                  Choose the exam schedule assigned by admissions. Available slots depend on your school level and applicant type.
                </p>

                <div className="mb-4">
                  <label className="block text-xs font-semibold text-gray-600 mb-2">Exam Schedule:</label>
                  <select
                    value={selectedTestingCenter}
                    onChange={(e) => setSelectedTestingCenter(e.target.value)}
                    className="w-full h-11 px-3 rounded-lg border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-[#F59E0B]"
                  >
                    <option value="">Select schedule</option>
                    <option value="morning">Main Campus - Morning Session</option>
                    <option value="afternoon">Main Campus - Afternoon Session</option>
                    <option value="online">Online Proctored Session</option>
                  </select>
                </div>

                <button
                  onClick={handleSubmitTestingCenter}
                  className="w-full h-11 rounded-lg bg-[#1a1a1a] text-white font-semibold text-sm hover:bg-black transition-all"
                >
                  SUBMIT
                </button>
              </div>
            </div>

            {/* Request for Reschedule */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
              <div className="bg-[#1a1a1a] px-4 py-3">
                <h3 className="text-sm font-bold text-white">REQUEST FOR RESCHEDULE</h3>
              </div>

              <div className="p-4">
                <p className="text-xs text-gray-600 mb-4 leading-relaxed">
                  Request a different exam schedule when the assigned slot conflicts with your availability. Admissions will review the request.
                </p>

                <div className="mb-4">
                  <label className="block text-xs font-semibold text-gray-600 mb-2">Exam Schedule:</label>
                  <select
                    value={examSchedule}
                    onChange={(e) => setExamSchedule(e.target.value)}
                    className="w-full h-11 px-3 rounded-lg border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-[#F59E0B]"
                  >
                    <option value="">Select new schedule</option>
                    <option value="next-week">Next available weekday</option>
                    <option value="weekend">Next available weekend</option>
                  </select>
                </div>

                <div className="mb-4">
                  <label className="block text-xs font-semibold text-gray-600 mb-2">Reason:</label>
                  <input
                    type="text"
                    value={rescheduleReason}
                    onChange={(e) => setRescheduleReason(e.target.value)}
                    className="w-full h-11 px-3 rounded-lg border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-[#F59E0B]"
                    placeholder="Enter reason for reschedule"
                  />
                </div>

                <button
                  onClick={handleSubmitReschedule}
                  className="w-full h-11 rounded-lg bg-[#1a1a1a] text-white font-semibold text-sm hover:bg-black transition-all"
                >
                  SUBMIT
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Payment Tab */}
        {activeTab === "payment" && (
          isAccepted ? (
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
            <div className="bg-[#1a1a1a] px-4 py-3">
              <h3 className="text-sm font-bold text-white">ADMISSION FEE PAYMENT</h3>
            </div>

            <div className="p-4">
              {!paymentCompleted ? (
                <>
                  <div className="text-center mb-6">
                    <p className="text-xs font-semibold text-gray-600 mb-2">ADMISSION FEE:</p>
                    <p className="text-3xl font-bold text-red-600">PHP {admissionFee.toFixed(2)}</p>
                  </div>

                  <div className="space-y-3 mb-6">
                    <p className="text-xs font-semibold text-gray-600">Payment Method</p>

                    <label className="flex items-center gap-3 p-3 border border-gray-200 rounded-lg cursor-pointer hover:bg-gray-50 active:bg-gray-100 transition-colors">
                      <input
                        type="radio"
                        name="payment"
                        value="credit_card"
                        checked={paymentMethod === "credit_card"}
                        onChange={(e) => setPaymentMethod(e.target.value as PaymentMethod)}
                        className="w-4 h-4 accent-[#F59E0B]"
                      />
                      <span className="text-sm text-gray-700">Credit/Debit Card</span>
                    </label>

                    <label className="flex items-center gap-3 p-3 border border-gray-200 rounded-lg cursor-pointer hover:bg-gray-50 active:bg-gray-100 transition-colors">
                      <input
                        type="radio"
                        name="payment"
                        value="e_wallet"
                        checked={paymentMethod === "e_wallet"}
                        onChange={(e) => setPaymentMethod(e.target.value as PaymentMethod)}
                        className="w-4 h-4 accent-[#F59E0B]"
                      />
                      <span className="text-sm text-gray-700">E-Wallet (Gcash/Paymaya)</span>
                    </label>

                    <label className="flex items-center gap-3 p-3 border border-gray-200 rounded-lg cursor-pointer hover:bg-gray-50 active:bg-gray-100 transition-colors">
                      <input
                        type="radio"
                        name="payment"
                        value="online_banking"
                        checked={paymentMethod === "online_banking"}
                        onChange={(e) => setPaymentMethod(e.target.value as PaymentMethod)}
                        className="w-4 h-4 accent-[#F59E0B]"
                      />
                      <span className="text-sm text-gray-700">Online Banking</span>
                    </label>
                  </div>

                  <button
                    onClick={handlePayment}
                    className="w-full h-12 rounded-xl bg-[#F59E0B] text-white font-bold text-sm hover:bg-[#D97706] active:bg-[#B45309] transition-all shadow-lg shadow-amber-100"
                  >
                    Proceed to Payment
                  </button>
                </>
              ) : (
                <div className="text-center py-8">
                  <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <CheckCircle2 className="w-8 h-8 text-green-600" />
                  </div>
                  <p className="text-lg font-semibold text-gray-800 mb-2">Payment Successful!</p>
                  <p className="text-sm text-gray-600 mb-6">Thank you for your payment.</p>
                  <button
                    onClick={handlePrintReceipt}
                    className="px-6 h-11 rounded-lg bg-[#1a1a1a] text-white font-semibold text-sm hover:bg-black transition-all"
                  >
                    Print E-Receipt
                  </button>
                </div>
              )}
            </div>
          </div>
          ) : (
            <div className="bg-amber-50 border border-amber-200 rounded-xl p-6 text-center">
              <div className="w-12 h-12 bg-amber-100 rounded-full flex items-center justify-center mx-auto mb-3">
                <CreditCard className="w-6 h-6 text-amber-600" />
              </div>
              <p className="text-sm text-amber-900 font-semibold mb-1">Payment Not Available Yet</p>
              <p className="text-xs text-amber-700">
                The admission fee payment option will be available once your application has been reviewed and accepted by the admissions office.
              </p>
              <div className="mt-4 p-3 bg-white rounded-lg border border-amber-200">
                <p className="text-xs text-gray-600">
                  <span className="font-semibold">Current Status:</span> {applicationStatus}
                </p>
              </div>
            </div>
          )
        )}

        {/* Activity Log Tab */}
        {activeTab === "activity" && (
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
            <div className="bg-[#1a1a1a] px-4 py-3">
              <h3 className="text-sm font-bold text-white">ACTIVITY LOG</h3>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50 border-b border-gray-200">
                  <tr>
                    <th className="px-4 py-3 text-left text-xs font-bold text-gray-700">#</th>
                    <th className="px-4 py-3 text-left text-xs font-bold text-gray-700">Activity Name</th>
                    <th className="px-4 py-3 text-left text-xs font-bold text-gray-700">Date</th>
                    <th className="px-4 py-3 text-left text-xs font-bold text-gray-700">Next Step</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {activityLogs.map((log) => (
                    <tr key={log.sequence} className="hover:bg-gray-50">
                      <td className="px-4 py-3 text-sm text-gray-800">{log.sequence}</td>
                      <td className="px-4 py-3 text-sm text-gray-800">{log.activityName}</td>
                      <td className="px-4 py-3 text-sm text-gray-600">{log.action}</td>
                      <td className="px-4 py-3 text-sm text-gray-600">{log.newActivity}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
