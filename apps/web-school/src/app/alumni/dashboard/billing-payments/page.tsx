'use client';

import { useEffect, useMemo, useState } from 'react';
import { Download } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { ProtectedRoute } from '../../../components/ProtectedRoute';
import { getAlumniRecordRequests, type AlumniRecordRequest } from '../../services/alumni.service';

function documentLabel(type: AlumniRecordRequest['document_type']) {
  switch (type) {
    case 'TOR':
      return 'Transcript of Records';
    case 'DIPLOMA':
      return 'Diploma';
    case 'GOOD_MORAL':
      return 'Good Moral Certificate';
    case 'CERTIFICATE':
      return 'Certificate of Graduation';
    default:
      return type;
  }
}

function BillingPaymentsContent() {
  const { user } = useAuth();
  const [requests, setRequests] = useState<AlumniRecordRequest[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user?.id) return;
    setLoading(true);
    getAlumniRecordRequests(user.id).then((result) => {
      setRequests(result.data ?? []);
      setLoading(false);
    });
  }, [user?.id]);

  const unpaid = useMemo(
    () => requests.filter((request) => (request.payment_status ?? 'pending') !== 'paid'),
    [requests],
  );
  const paid = useMemo(
    () => requests.filter((request) => (request.payment_status ?? 'pending') === 'paid'),
    [requests],
  );

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
        {loading ? (
          <div className="rounded-[18px] border border-slate-200/70 bg-white px-6 py-5 text-[15px] text-[#58739b]">Loading invoices...</div>
        ) : unpaid.length === 0 ? (
          <div className="rounded-[18px] border border-slate-200/70 bg-white px-6 py-5 text-[15px] text-[#58739b]">No unpaid invoices.</div>
        ) : unpaid.map((request) => (
          <article key={request.log_id} className="mb-3 rounded-[18px] border border-slate-200/70 bg-white px-6 py-5 shadow-[0_1px_2px_rgba(15,23,42,0.03),0_10px_26px_rgba(15,23,42,0.04)]">
            <div className="flex items-start justify-between gap-4">
              <div>
                <div className="text-[18px] font-semibold text-slate-950">{documentLabel(request.document_type)}</div>
                <div className="mt-2 text-[15px] text-slate-500">{new Date(request.created_at).toLocaleDateString()}</div>
              </div>
              <div className="text-right">
                <div className="text-[28px] font-black leading-none tracking-[-0.04em] text-slate-950">PHP {request.fee_amount ?? 0}</div>
                <button className="mt-4 inline-flex h-10 items-center justify-center rounded-[10px] bg-[#356dff] px-4 text-[15px] font-semibold text-white shadow-sm">Pay Now</button>
              </div>
            </div>
          </article>
        ))}
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
          {paid.length === 0 ? (
            <div className="px-5 py-5 text-[15px] text-[#58739b]">No paid document requests yet.</div>
          ) : paid.map((item) => (
            <div key={item.log_id} className="grid grid-cols-[1.1fr_1.6fr_0.7fr_0.9fr] gap-4 border-b border-slate-100 px-5 py-5 last:border-b-0">
              <div>
                <div className="text-[17px] font-bold tracking-[-0.02em] text-slate-950">{item.log_id}</div>
                <button className="mt-5 inline-flex items-center gap-1.5 text-[15px] font-medium text-[#356dff]">
                  <Download className="h-4 w-4" /> Download Receipt
                </button>
              </div>
              <div className="text-[17px] leading-[1.3] text-slate-950">{documentLabel(item.document_type)}</div>
              <div className="text-[17px] text-slate-950">PHP {item.fee_amount ?? 0}</div>
              <div className="text-[17px] text-slate-950">{new Date(item.created_at).toLocaleDateString()}</div>
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
