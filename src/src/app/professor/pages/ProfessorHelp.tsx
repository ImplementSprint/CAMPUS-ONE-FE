'use client'
import { useState } from 'react';
import { MessageCircle, Mail, ChevronDown, ChevronUp, AlertTriangle } from 'lucide-react';

const faqs = [
  { question: 'How do I encode grades?', answer: 'Go to the Encode Grades tab, select your subject, and click Edit Grades.' },
  { question: 'Can I export my student list?', answer: 'Yes, inside the Students tab, click the options menu to export.' },
];

export function ProfessorHelp() {
  const [expandedFaq, setExpandedFaq] = useState<number | null>(null);

  return (
    <div className="mx-auto w-full max-w-5xl space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Help & Support</h1>
        <p className="text-sm text-gray-500 mt-1">Find answers or contact support</p>
      </div>

      {/* Contact Card */}
      <div className="mx-auto max-w-lg bg-white rounded-2xl border border-gray-100 p-10 text-center">
        <div className="w-20 h-20 rounded-full bg-[#F59E0B]/10 flex items-center justify-center mx-auto mb-5">
          <MessageCircle className="w-10 h-10 text-[#F59E0B]" />
        </div>
        <h2 className="text-xl font-bold text-gray-900 mb-2">Need immediate help?</h2>
        <p className="text-sm text-gray-600 mb-6">Our support team is available Mon–Fri, 8AM to 5PM.</p>
        <a href="mailto:support@campus.edu"
          className="flex items-center justify-center gap-2 bg-gray-900 text-white text-sm font-semibold px-6 py-3 rounded-xl hover:bg-gray-800 transition-colors w-full">
          <Mail className="w-4 h-4" /> Contact Support
        </a>
      </div>

      {/* FAQs */}
      <div className="mx-auto max-w-2xl space-y-3">
        <h2 className="text-lg font-bold text-gray-900">Frequently Asked Questions</h2>
        {faqs.map((faq, i) => (
          <div key={i} className="bg-white rounded-xl border border-gray-100 overflow-hidden">
            <button
              onClick={() => setExpandedFaq(expandedFaq === i ? null : i)}
              className="w-full flex items-center justify-between px-6 py-5 text-left hover:bg-gray-50 transition-colors"
            >
              <span className="text-base font-semibold text-gray-900 flex-1 pr-4">{faq.question}</span>
              {expandedFaq === i
                ? <ChevronUp className="w-5 h-5 text-gray-500 flex-shrink-0" />
                : <ChevronDown className="w-5 h-5 text-gray-500 flex-shrink-0" />
              }
            </button>
            {expandedFaq === i && (
              <div className="px-6 pb-5 border-t border-gray-100">
                <p className="text-sm text-gray-600 leading-relaxed pt-4">{faq.answer}</p>
              </div>
            )}
          </div>
        ))}
      </div>

      {/* System Info */}
      <div className="mx-auto max-w-2xl space-y-3">
        <h2 className="text-lg font-bold text-gray-900">System Info</h2>
        <div className="bg-white rounded-xl border border-gray-100 divide-y divide-gray-100">
          <div className="flex items-center justify-between px-6 py-4">
            <span className="text-sm text-gray-600">App Version</span>
            <span className="text-sm font-medium text-gray-900">1.0.0 (Build 42)</span>
          </div>
          <div className="flex items-center justify-between px-6 py-4">
            <span className="text-sm text-gray-600">Environment</span>
            <span className="text-sm font-medium text-gray-900">Production</span>
          </div>
        </div>
      </div>

      {/* Report Issue */}
      <div className="mx-auto w-fit">
        <a href="mailto:support@campus.edu?subject=Bug%20Report%20-%20Professor%20Portal"
          className="inline-flex items-center gap-2 bg-red-50 text-red-500 text-sm font-semibold px-6 py-4 rounded-xl hover:bg-red-100 transition-colors">
          <AlertTriangle className="w-4 h-4" /> Report an Issue
        </a>
      </div>
    </div>
  );
}
