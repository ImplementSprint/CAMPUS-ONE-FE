'use client';

import { ProtectedRoute } from '../../../components/ProtectedRoute';
import { Download } from 'lucide-react';

const history = [
  { id: 'PAY-2024-002', service: 'Document Request (shipping)', amount: '₱120', date: 'Apr 28, 2024' },
  { id: 'PAY-2024-003', service: 'Alumni Membership Fee', amount: '₱50', date: 'Mar 1, 2024' },
] as const;

function BillingPaymentsContent() {
  return (
    <section className="space-y-6">
      <div className="flex items-start justify-between gap-4">
        <div>
          <h1 className="text-[42px] font-black leading-[0.95] tracking-[-0.05em] text-slate-950 sm:text-[48px]">Payments</h1>
          <p className="mt-2 text-[18px] font-medium text-[#58739b]">Pay outstanding invoices and review payment history</p>
        </div>
      </div>

      <section>
        <h2 className="mb-4 text-[26px] font-bold tracking-[-0.03em] text-slate-950">Unpaid Invoices</h2>
        <article className="rounded-[18px] border border-slate-200/70 bg-white px-6 py-5 shadow-[0_1px_2px_rgba(15,23,42,0.03),0_10px_26px_rgba(15,23,42,0.04)]">
          <div className="flex items-start justify-between gap-4">
            <div>
              <div className="text-[18px] font-semibold text-slate-950">Alumni Card</div>
              <div className="mt-2 text-[15px] text-slate-500">May 2, 2024</div>
            </div>
            <div className="text-right">
              <div className="text-[28px] font-black leading-none tracking-[-0.04em] text-slate-950">₱300</div>
              <button className="mt-4 inline-flex h-10 items-center justify-center rounded-[10px] bg-[#356dff] px-4 text-[15px] font-semibold text-white shadow-sm">Pay Now</button>
            </div>
          </div>
        </article>
      </section>

      <section>
        <h2 className="mb-4 text-[26px] font-bold tracking-[-0.03em] text-slate-950">Payment History</h2>
        <div className="overflow-hidden rounded-[18px] border border-slate-200/70 bg-white shadow-[0_1px_2px_rgba(15,23,42,0.03),0_10px_26px_rgba(15,23,42,0.04)]">
          <div className="grid grid-cols-[1.1fr_1.6fr_0.7fr_0.9fr] gap-4 border-b border-slate-200/70 bg-[#f8faff] px-5 py-4 text-[14px] font-medium uppercase tracking-[0.05em] text-[#5b7196]">
            <div>Transaction ID</div>
            <div>Service</div>
            <div>Amount</div>
            <div>Date</div>
          </div>
          {history.map((item) => (
            <div key={item.id} className="grid grid-cols-[1.1fr_1.6fr_0.7fr_0.9fr] gap-4 border-b border-slate-100 px-5 py-5 last:border-b-0">
              <div>
                <div className="text-[17px] font-bold tracking-[-0.02em] text-slate-950">{item.id}</div>
                <button className="mt-5 inline-flex items-center gap-1.5 text-[15px] font-medium text-[#356dff]">
                  <Download className="h-4 w-4" /> Download Receipt
                </button>
              </div>
              <div className="text-[17px] leading-[1.3] text-slate-950">{item.service}</div>
              <div className="text-[17px] text-slate-950">{item.amount}</div>
              <div className="text-[17px] text-slate-950">{item.date}</div>
            </div>
          ))}
        </div>
      </section>
    </section>
  );
}

export default function BillingPaymentsPage() {
  return (
    <ProtectedRoute allowedRoles={['alumni']}>
      <BillingPaymentsContent />
    </ProtectedRoute>
  );
}