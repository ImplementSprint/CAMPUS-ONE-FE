'use client';
import { useEffect, useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { getDeficiencies } from '@/lib/api';
import DashboardLayout from '@/components/DashboardLayout';

export default function DeficienciesPage() {
  const { user, loading: authLoading } = useAuth();
  const [deficiencies, setDeficiencies] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (authLoading || !user) return;
    getDeficiencies(user.id)
      .then(setDeficiencies)
      .catch(() => setDeficiencies([]))
      .finally(() => setLoading(false));
  }, [user, authLoading]);

  return (
    <DashboardLayout>
      <div className="p-6 w-full space-y-5">
        <div className="flex items-center gap-3">
          <span className="text-2xl">⚠️</span>
          <h1 className="text-xl font-black text-gray-900">Deficiencies</h1>
        </div>

        {loading ? <div className="text-center py-10 text-gray-400">Loading...</div>
          : deficiencies.length === 0 ? (
            <div className="bg-green-50 border border-green-300 rounded-2xl p-8 text-center">
              <div className="w-16 h-16 rounded-full border-4 border-green-400 flex items-center justify-center mx-auto mb-4">
                <span className="text-green-500 text-2xl">✓</span>
              </div>
              <p className="font-black text-gray-900 text-lg">No deficiencies found</p>
              <p className="text-sm text-gray-500 mt-1">You have met all academic requirements</p>
            </div>
          ) : (
            <>
              <div className="bg-amber-50 border border-amber-300 rounded-xl p-4">
                <p className="font-semibold text-gray-900 text-sm">Outstanding Deficiencies</p>
                <p className="text-sm text-gray-600 mt-1">The following items must be resolved before full enrollment clearance.</p>
              </div>
              <div className="space-y-3">
                {deficiencies.map((d, i) => (
                  <div key={i} className="bg-red-50 border border-red-200 rounded-xl p-5">
                    <div className="flex justify-between items-start gap-4">
                      <div>
                        <p className="font-semibold text-gray-900">{d.code} — {d.title}</p>
                        <p className="text-sm text-gray-500 mt-1">Grade: {d.finalGrade ?? '—'}</p>
                      </div>
                      <span className="bg-red-500 text-white text-xs font-semibold px-3 py-1.5 rounded-full whitespace-nowrap">{d.remarks}</span>
                    </div>
                  </div>
                ))}
              </div>
              <div className="bg-amber-50 border border-amber-200 rounded-xl p-4 flex gap-3">
                <span className="text-amber-500">ℹ️</span>
                <p className="text-sm text-gray-700">Please coordinate with your adviser or registrar to resolve these deficiencies.</p>
              </div>
            </>
          )}
      </div>
    </DashboardLayout>
  );
}

