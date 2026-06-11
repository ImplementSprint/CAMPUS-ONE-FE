'use client'
import { useEffect, useState } from "react";
import type { SchoolLevel, ApplicantType } from "../types/admissions.types";
import { CheckCircle, Copy, Mail, FileText } from "lucide-react";

interface ApplicationConfirmationProps {
  referenceNumber: string;
  email: string;
  schoolLevel: SchoolLevel;
  applicantType: ApplicantType;
  applicantName: string;
}

export function ApplicationConfirmation({
  referenceNumber,
  email,
  schoolLevel,
  applicantType,
  applicantName,
}: ApplicationConfirmationProps) {
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText(referenceNumber);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-green-50 to-white px-4 py-8">
      <div className="max-w-2xl mx-auto">
        {/* Success Icon */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-20 h-20 bg-green-500 rounded-full mb-4 animate-bounce">
            <CheckCircle className="w-12 h-12 text-white" />
          </div>
          <h1 className="text-3xl font-bold text-[#1a1a1a] mb-2">
            Application Submitted!
          </h1>
          <p className="text-gray-600">
            Thank you, {applicantName}! Your application has been received.
          </p>
        </div>

        {/* Reference Number Card */}
        <div className="bg-white rounded-2xl shadow-lg border-2 border-[#F59E0B] p-6 mb-6">
          <div className="text-center">
            <p className="text-sm font-semibold text-gray-600 mb-2">
              YOUR REFERENCE NUMBER
            </p>
            <div className="flex items-center justify-center gap-3 mb-4">
              <p className="text-3xl font-bold text-[#F59E0B] font-mono tracking-wider">
                {referenceNumber}
              </p>
              <button
                onClick={handleCopy}
                className="p-2 rounded-lg hover:bg-gray-100 transition-colors"
                title="Copy to clipboard"
              >
                {copied ? (
                  <CheckCircle className="w-5 h-5 text-green-500" />
                ) : (
                  <Copy className="w-5 h-5 text-gray-400" />
                )}
              </button>
            </div>
            <div className="bg-amber-50 border border-amber-200 rounded-xl px-4 py-3">
              <p className="text-xs text-amber-800 font-semibold">
                Important: Save this reference number. You'll need it to track your application.
              </p>
            </div>
          </div>
        </div>

        {/* Application Details */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 mb-6">
          <h2 className="text-lg font-bold text-[#1a1a1a] mb-4">Application Details</h2>
          <div className="space-y-3">
            <div className="flex justify-between py-2 border-b border-gray-100">
              <span className="text-sm text-gray-600">Applicant Name</span>
              <span className="text-sm font-semibold text-gray-900">{applicantName}</span>
            </div>
            <div className="flex justify-between py-2 border-b border-gray-100">
              <span className="text-sm text-gray-600">Email Address</span>
              <span className="text-sm font-semibold text-gray-900">{email}</span>
            </div>
            <div className="flex justify-between py-2 border-b border-gray-100">
              <span className="text-sm text-gray-600">School Level</span>
              <span className="text-sm font-semibold text-gray-900">{schoolLevel}</span>
            </div>
            <div className="flex justify-between py-2">
              <span className="text-sm text-gray-600">Applicant Type</span>
              <span className="text-sm font-semibold text-gray-900">{applicantType}</span>
            </div>
          </div>
        </div>

        {/* Next Steps */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 mb-6">
          <h2 className="text-lg font-bold text-[#1a1a1a] mb-4 flex items-center gap-2">
            <FileText className="w-5 h-5 text-[#F59E0B]" />
            What Happens Next?
          </h2>
          <div className="space-y-4">
            <div className="flex gap-3">
              <div className="flex-shrink-0 w-8 h-8 bg-[#F59E0B] text-white rounded-full flex items-center justify-center text-sm font-bold">
                1
              </div>
              <div>
                <p className="text-sm font-semibold text-gray-900 mb-1">Email Confirmation</p>
                <p className="text-xs text-gray-600">
                  Check your email at <span className="font-semibold">{email}</span> for your reference number and next steps.
                </p>
              </div>
            </div>
            <div className="flex gap-3">
              <div className="flex-shrink-0 w-8 h-8 bg-[#F59E0B] text-white rounded-full flex items-center justify-center text-sm font-bold">
                2
              </div>
              <div>
                <p className="text-sm font-semibold text-gray-900 mb-1">Application Review</p>
                <p className="text-xs text-gray-600">
                  Our admissions team will review your application and documents. This typically takes 3-5 business days.
                </p>
              </div>
            </div>
            <div className="flex gap-3">
              <div className="flex-shrink-0 w-8 h-8 bg-[#F59E0B] text-white rounded-full flex items-center justify-center text-sm font-bold">
                3
              </div>
              <div>
                <p className="text-sm font-semibold text-gray-900 mb-1">Track Your Status</p>
                <p className="text-xs text-gray-600">
                  Use your reference number to check your application status anytime.
                </p>
              </div>
            </div>
            <div className="flex gap-3">
              <div className="flex-shrink-0 w-8 h-8 bg-[#F59E0B] text-white rounded-full flex items-center justify-center text-sm font-bold">
                4
              </div>
              <div>
                <p className="text-sm font-semibold text-gray-900 mb-1">Admission Decision</p>
                <p className="text-xs text-gray-600">
                  You'll receive an email notification once a decision has been made on your application.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Email Notice */}
        <div className="bg-blue-50 border border-blue-200 rounded-xl px-4 py-3 mb-6">
          <div className="flex gap-3">
            <Mail className="w-5 h-5 text-blue-500 flex-shrink-0 mt-0.5" />
            <div className="text-xs text-blue-800 leading-relaxed">
              <p className="font-semibold mb-1">Check Your Email</p>
              <p>
                We've sent a confirmation email to <span className="font-semibold">{email}</span> with your reference number and important information. 
                If you don't see it, please check your spam folder.
              </p>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="space-y-3">
          <a
            href="/admissions/track"
            className="block w-full h-12 rounded-xl bg-[#F59E0B] text-white font-bold text-sm tracking-wide shadow-lg shadow-amber-100 hover:bg-[#D97706] transition-all flex items-center justify-center"
          >
            Track My Application
          </a>
          <a
            href="/"
            className="block w-full h-12 rounded-xl border-2 border-gray-200 text-gray-700 font-semibold text-sm tracking-wide hover:border-gray-300 transition-all flex items-center justify-center"
          >
            Return to Home
          </a>
        </div>

        {/* Contact Info */}
        <div className="mt-8 text-center text-xs text-gray-500">
          <p>Need help? Contact the Admissions Office</p>
          <p className="mt-1">
            Email: <a href="mailto:admissions@campus.edu" className="text-[#F59E0B] hover:underline">admissions@campus.edu</a> | 
            Phone: <a href="tel:+1234567890" className="text-[#F59E0B] hover:underline">(123) 456-7890</a>
          </p>
        </div>
      </div>
    </div>
  );
}
