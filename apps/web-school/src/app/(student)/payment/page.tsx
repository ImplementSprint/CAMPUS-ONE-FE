'use client';
import { useEffect, useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { getBillingBalance, getEnrollmentHistory } from '@/lib/api';
import DashboardLayout from '@/components/DashboardLayout';

export default function PaymentPage() {
  const { user, loading: authLoading } = useAuth();
  const [enrollments, setEnrollments] = useState<any[]>([]);
  const [balance, setBalance] = useState<any | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (authLoading || !user) return;
    Promise.all([getEnrollmentHistory(user.id), getBillingBalance(user.id)])
      .then(([history, balanceData]) => {
        setEnrollments(history);
        setBalance(balanceData);
      })
      .catch(() => {
        setEnrollments([]);
        setBalance(null);
      })
      .finally(() => setLoading(false));
  }, [user, authLoading]);

  const fmt = (iso: string) => new Date(iso).toLocaleDateString('en-PH', { year: 'numeric', month: 'long', day: 'numeric' });
  const statusColor = (s: string) => s === 'enrolled' ? 'bg-green-100 text-green-700' : 'bg-amber-100 text-amber-700';
  const totalUnits = enrollments.reduce((s, e) => s + (e.units ?? 0), 0);

  return (
    <DashboardLayout>
      <div className="p-6 w-full space-y-5">
        <h1 className="text-xl font-black text-gray-900">Balance & Payment</h1>

        <div className="bg-[#374151] rounded-2xl p-5">
          <div className="flex items-center gap-3 mb-4">
            <span className="text-white font-semibold">Account Summary</span>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="bg-gray-700 rounded-xl p-4">
              <p className="text-gray-300 text-xs font-medium mb-1">Enrolled Subjects</p>
              <p className="text-white text-2xl font-black">{enrollments.length}</p>
            </div>
            <div className="bg-gray-700 rounded-xl p-4">
              <p className="text-gray-300 text-xs font-medium mb-1">Total Units</p>
              <p className="text-green-400 text-2xl font-black">{totalUnits}</p>
            </div>
            <div className="bg-gray-700 rounded-xl p-4">
              <p className="text-gray-300 text-xs font-medium mb-1">Balance Due</p>
              <p className="text-amber-300 text-2xl font-black">PHP {Number(balance?.balanceDue ?? 0).toLocaleString('en-PH')}</p>
            </div>
            <div className="bg-gray-700 rounded-xl p-4">
              <p className="text-gray-300 text-xs font-medium mb-1">Payment Status</p>
              <p className="text-white text-lg font-black capitalize">{String(balance?.paymentStatus ?? 'unpaid').replace(/_/g, ' ')}</p>
            </div>
          </div>
        </div>

        {loading ? <div className="text-center py-10 text-gray-400">Loading...</div>
          : enrollments.length === 0 ? (
            <div className="bg-white rounded-2xl border border-gray-200 p-8 text-center text-gray-400">No enrollment records found.</div>
          ) : (
            <div className="bg-white rounded-2xl border border-gray-200 overflow-hidden">
              <div className="px-5 py-4 border-b border-gray-100">
                <p className="font-semibold text-gray-900">Enrolled Subjects</p>
              </div>
              <div className="divide-y divide-gray-100">
                {enrollments.map(e => (
                  <div key={e.id} className="flex items-center justify-between px-5 py-4">
                    <div>
                      <p className="font-semibold text-gray-900 text-sm">{e.subjectCode} - {e.subjectName}</p>
                      <p className="text-xs text-gray-400 mt-0.5">{e.section} - {e.schedule ?? 'TBA'}</p>
                      <p className="text-xs text-gray-400">{fmt(e.enrolledAt)}</p>
                    </div>
                    <div className="text-right">
                      <p className="font-semibold text-gray-900 text-sm">{e.units} units</p>
                      <span className={`text-xs font-semibold px-2 py-0.5 rounded-full ${statusColor(e.status)}`}>{e.status}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

        <div className="bg-white rounded-2xl border border-gray-200 p-5">
          <p className="font-semibold text-gray-900 mb-4">Manual Payment Options</p>
          <div className="space-y-3">
            {[['CARD', 'Credit/Debit Card', 'Visa, Mastercard, JCB', 'bg-blue-500'],
              ['BANK', 'Online Banking', 'BPI, BDO, Metrobank, UnionBank', 'bg-green-500'],
              ['OTC', 'Over-the-Counter', '7-Eleven, Cebuana, MLhuillier', 'bg-amber-500']
            ].map(([code, title, sub, color]) => (
              <div key={title} className="flex items-center gap-4 p-4 border border-gray-100 rounded-xl">
                <div className={`w-11 h-11 ${color} rounded-xl flex items-center justify-center text-[10px] font-bold text-white`}>{code}</div>
                <div>
                  <p className="font-semibold text-gray-900 text-sm">{title}</p>
                  <p className="text-xs text-gray-500">{sub}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
