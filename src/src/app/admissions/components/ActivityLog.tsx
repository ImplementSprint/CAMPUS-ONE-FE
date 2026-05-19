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
    { id: 1, text: "Encode Lorem Ipsum.", completed: true },
    { id: 2, text: "Received Lorem Ipsum.", completed: true },
    { id: 3, text: "Accomplish the Following.", completed: true, subtasks: [
      "Lorem Ipsum",
      "Lorem Ipsum Dolor",
      "Update Lorem Ipsum",
      "Upload Lorem Ipsum",
      "Encode Lorem Ipsum",
      "Answer Lorem Ipsum."
    ]},
    { id: 4, text: "Accomplish Lorem Ipsum.", completed: true },
    { id: 5, text: "Receive Lorem Ipsum.", completed: false },
    { id: 6, text: "Select Lorem Ipsum.", completed: false },
    { id: 7, text: "Pay Lorem Ipsum.", completed: false },
  ];

  const activityLogs: ActivityLogEntry[] = [
    {
      sequence: 1,
      activityName: "LOREM IPSUM RECEIVED.",
      action: "1-JAN-25",
      newActivity: "CONTINUE THE REGISTRATION"
    },
    {
      sequence: 2,
      activityName: "COMPLETE THE LOREM IPSUM APPLICATION.",
      action: "1-JAN-25",
      newActivity: "WAIT FOR THE ORAD TO VERIFY YOU REQUIREMENTS AND ENCODED GRADES"
    },
    {
      sequence: 3,
      activityName: "LOREM IPSUM VERIFIED.",
      action: "3-JAN-25",
      newActivity: "PROCEED WITH ONLINE PAYMENT"
    },
    {
      sequence: 4,
      activityName: "PAID LOREM IPSUM FEE",
      action: "4-JAN-25",
      newActivity: "DOWNLOAD TEST PERMIT"
    },
    {
      sequence: 5,
      activityName: "PRINTED LOREM IPSUM TEST PERMIT",
      action: "5-JAN-25",
      newActivity: "TAKE THE TEST"
    },
  ];

  const handlePayment = () => {
    // TODO: Integrate with payment gateway
    console.log("Processing payment with method:", paymentMethod);
    setPaymentCompleted(true);
  };

  const handlePrintReceipt = () => {
    // TODO: Generate and print receipt
    console.log("Printing receipt");
  };

  const handleSubmitTestingCenter = () => {
    // TODO: Submit testing center selection
    console.log("Selected testing center:", selectedTestingCenter);
  };

  const handleSubmitReschedule = () => {
    // TODO: Submit reschedule request
    console.log("Reschedule request:", { examSchedule, rescheduleReason });
  };

  const isAccepted = applicationStatus === "Passed";

  // For testing: Force show payment tab (remove this line in production)
  // const isAccepted = true;

  return (
    <div className="flex-1 overflow-y-auto">
      <div className="px-4 pt-5 pb-8">
        <SelectionTags schoolLevel={schoolLevel} applicantType={applicantType} />

        {/* Application Status Debug (remove in production) */}
        <div className="mb-3 p-2 bg-blue-50 border border-blue-200 rounded-lg">
          <p className="text-xs text-blue-800">
            <span className="font-semibold">Status:</span> {applicationStatus} 
            {isAccepted && <span className="ml-2 text-green-600">✓ Payment tab visible</span>}
          </p>
        </div>

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
                              <li key={idx} className="text-xs text-gray-600">• {subtask}</li>
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
                  Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.
                </p>

                <div className="mb-4">
                  <label className="block text-xs font-semibold text-gray-600 mb-2">Exam Schedule:</label>
                  <select
                    value={selectedTestingCenter}
                    onChange={(e) => setSelectedTestingCenter(e.target.value)}
                    className="w-full h-11 px-3 rounded-lg border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-[#F59E0B]"
                  >
                    <option value="">Select schedule</option>
                    <option value="schedule1">Lorem Ipsum - January 15, 2025</option>
                    <option value="schedule2">Lorem Ipsum - January 20, 2025</option>
                    <option value="schedule3">Lorem Ipsum - January 25, 2025</option>
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
                  Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.
                </p>

                <div className="mb-4">
                  <label className="block text-xs font-semibold text-gray-600 mb-2">Exam Schedule:</label>
                  <select
                    value={examSchedule}
                    onChange={(e) => setExamSchedule(e.target.value)}
                    className="w-full h-11 px-3 rounded-lg border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-[#F59E0B]"
                  >
                    <option value="">Select new schedule</option>
                    <option value="schedule1">Lorem Ipsum - February 1, 2025</option>
                    <option value="schedule2">Lorem Ipsum - February 5, 2025</option>
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
                    <p className="text-3xl font-bold text-red-600">₱{admissionFee.toFixed(2)}</p>
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
                  <p className="text-sm text-gray-600 mb-6">Thank you for your payment. ♥</p>
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
