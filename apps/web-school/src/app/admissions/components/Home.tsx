'use client'
import { useState } from "react";
import type { AppSession } from "../types/admissions.types";
import { SelectionTags } from "./SelectionTags";

interface HomeProps {
  session: AppSession;
}

type PaymentMethod = "credit-card" | "ewallet" | "online-banking";

export function Home({ session }: HomeProps) {
  const [selectedPaymentMethod, setSelectedPaymentMethod] = useState<PaymentMethod>("credit-card");

  const guidelines = [
    "Applicants must ensure that all personal information submitted is correct and complete.",
    "All required documents must be uploaded before the application deadline.",
    "Applicants must regularly check their portal notifications for updates.",
    "Submission of false information may lead to disqualification of the application.",
  ];

  const handleProceedToPayment = () => {
    // Payment processing is completed by the configured school payment provider.
    console.log("Proceeding to payment with method:", selectedPaymentMethod);
  };

  return (
    <div className="px-4 pt-5 pb-5">
      {/* Selection Tags - Show school level and applicant type if available */}
      {session.schoolLevel && session.applicantType && (
        <SelectionTags schoolLevel={session.schoolLevel} applicantType={session.applicantType} />
      )}

      {/* Guidelines Section */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-5 mb-4">
        <div className="pb-4 border-b border-gray-100 mb-4">
          <h2 className="text-sm font-bold text-[#1a1a1a]">Guidelines</h2>
        </div>

        <div className="space-y-3">
          {guidelines.map((guideline, index) => (
            <div key={index} className="flex gap-3">
              <span className="flex-shrink-0 w-6 h-6 flex items-center justify-center rounded-full bg-[#F59E0B] text-white text-xs font-bold">
                {index + 1}
              </span>
              <p className="text-sm text-gray-700 leading-relaxed pt-0.5">{guideline}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Reservation Fee Section */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-5 mb-4">
        <div className="pb-4 border-b border-gray-100 mb-4">
          <h2 className="text-sm font-bold text-[#1a1a1a]">Reservation Fee</h2>
        </div>

        <div className="text-center mb-6">
          <p className="text-xs font-semibold text-gray-600 mb-2">RESERVATION FEE:</p>
          <p className="text-3xl font-bold text-red-600">PHP 10,000.00</p>
        </div>

        {/* Payment Method Selection */}
        <div className="space-y-3">
          <p className="text-xs font-semibold text-gray-600 mb-3">Payment Method</p>

          <label className="flex items-center gap-3 p-3 border border-gray-200 rounded-lg cursor-pointer hover:bg-gray-50 transition-colors">
            <input
              type="radio"
              name="payment-method"
              value="credit-card"
              checked={selectedPaymentMethod === "credit-card"}
              onChange={() => setSelectedPaymentMethod("credit-card")}
              className="w-4 h-4 accent-[#F59E0B]"
            />
            <span className="text-sm font-medium text-gray-700">Credit / Debit Card</span>
          </label>

          <label className="flex items-center gap-3 p-3 border border-gray-200 rounded-lg cursor-pointer hover:bg-gray-50 transition-colors">
            <input
              type="radio"
              name="payment-method"
              value="ewallet"
              checked={selectedPaymentMethod === "ewallet"}
              onChange={() => setSelectedPaymentMethod("ewallet")}
              className="w-4 h-4 accent-[#F59E0B]"
            />
            <span className="text-sm font-medium text-gray-700">E-Wallet (GCash / Paymaya)</span>
          </label>

          <label className="flex items-center gap-3 p-3 border border-gray-200 rounded-lg cursor-pointer hover:bg-gray-50 transition-colors">
            <input
              type="radio"
              name="payment-method"
              value="online-banking"
              checked={selectedPaymentMethod === "online-banking"}
              onChange={() => setSelectedPaymentMethod("online-banking")}
              className="w-4 h-4 accent-[#F59E0B]"
            />
            <span className="text-sm font-medium text-gray-700">Online Banking</span>
          </label>
        </div>
      </div>

      {/* Proceed to Payment Button */}
      <div className="mt-6 flex flex-col-reverse gap-3 border-t border-neutral-200 pt-4 sm:flex-row sm:justify-end">
        <button
          onClick={handleProceedToPayment}
          className="h-11 rounded-md bg-campus-ink px-4 text-sm font-semibold text-white transition-colors hover:bg-neutral-800 sm:min-w-44"
        >
          Proceed to Payment
        </button>
      </div>
    </div>
  );
}
