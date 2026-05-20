'use client';
import { useEffect, useMemo, useState } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';
import { getEnrollmentOfferings, submitEnrollment } from '@/lib/api';
import { supabase } from '@/lib/supabase';
import DashboardLayout from '@/components/DashboardLayout';

type Mode = 'block' | 'manual';
type Offering = {
  id: string;
  subjectCode: string;
  subjectTitle: string;
  units: number;
  section: string;
  schedule: string | null;
  room: string | null;
  slotsTotal: number;
  slotsTaken: number;
  isFull: boolean;
  hasAssignment: boolean;
};
type CartItem = { offeringId: string; subjectCode: string; subjectTitle: string; units: number };

export default function EnrollPage() {
  const params = useSearchParams();
  const router = useRouter();
  const { user, loading: authLoading } = useAuth();

  const schoolYear = params.get('schoolYear') ?? '2025-2026';
  const term = params.get('term') ?? 'First Term';

  const [mode, setMode] = useState<Mode>('block');
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [program, setProgram] = useState('');
  const [offerings, setOfferings] = useState<Offering[]>([]);
  const [cart, setCart] = useState<CartItem[]>([]);
  const [query, setQuery] = useState('');
  const [showConfirm, setShowConfirm] = useState(false);
  const [success, setSuccess] = useState<{ count: number } | null>(null);
  const [error, setError] = useState('');

  useEffect(() => {
    if (authLoading || !user) return;

    // Get program info for display
    supabase.schema('student')
      .from('student_accounts')
      .select('applicant_id')
      .eq('id', user.id)
      .maybeSingle()
      .then(async ({ data: studentAccount }) => {
        if (!studentAccount?.applicant_id) return;

        const { data: profile } = await supabase
          .schema('applicant')
          .from('applicant_profiles')
          .select('program')
          .eq('id', studentAccount.applicant_id)
          .maybeSingle();

        if (profile) setProgram(profile.program ?? '');
      });

    // Load offerings from backend (uses curriculum table)
    getEnrollmentOfferings({ studentId: user.id })
      .then((data: Offering[]) => setOfferings(data))
      .catch(() => setOfferings([]))
      .finally(() => setLoading(false));
  }, [user, authLoading]);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return offerings;
    return offerings.filter(o =>
      (o.subjectTitle + o.subjectCode).toLowerCase().includes(q)
    );
  }, [query, offerings]);

  const totalUnits = cart.reduce((s, i) => s + i.units, 0);
  const inCart = (id: string) => cart.some(i => i.offeringId === id);

  const addToCart = (o: Offering) => {
    if (inCart(o.id) || o.isFull || !o.hasAssignment || totalUnits + o.units > 24) return;
    setCart(prev => [...prev, { offeringId: o.id, subjectCode: o.subjectCode, subjectTitle: o.subjectTitle, units: o.units }]);
  };

  const handleSubmit = async (offeringIds: string[]) => {
    if (!user) return;
    setSubmitting(true);
    setError('');
    try {
      const result = await submitEnrollment({
        studentId: user.id,
        classAssignmentIds: offeringIds,
      });

      // Push notification
      await supabase.from('notifications').insert({
        profile_id: user.id,
        title: 'Enrollment Submitted',
        body: `You have been enrolled in ${result.count} subject(s) for ${term}, AY ${schoolYear}.`,
        is_read: false,
      });

      setSuccess({ count: result.count });
      setCart([]);
    } catch (err: any) {
      setError(err.message || 'Enrollment failed. Please try again.');
    } finally {
      setSubmitting(false);
      setShowConfirm(false);
    }
  };

  // Block mode: all offerings (admin-assigned curriculum)
  const blockTotal = offerings.reduce((s, o) => s + o.units, 0);

  return (
    <DashboardLayout>
      <div className="p-6 w-full space-y-5">
        <div>
          <h1 className="text-xl font-black text-gray-900">Enrollment</h1>
          <p className="text-sm text-gray-500">{program} • A.Y. {schoolYear}: {term}</p>
        </div>

        {/* Mode toggle */}
        <div className="flex bg-gray-100 rounded-xl p-1 gap-1">
          <button onClick={() => setMode('block')}
            className={`flex-1 flex items-center justify-center gap-2 py-2.5 rounded-lg text-sm font-semibold transition
              ${mode === 'block' ? 'bg-amber-500 text-white' : 'text-gray-500 hover:text-gray-700'}`}>
            ⊞ Block Schedule
          </button>
          <button onClick={() => setMode('manual')}
            className={`flex-1 flex items-center justify-center gap-2 py-2.5 rounded-lg text-sm font-semibold transition
              ${mode === 'manual' ? 'bg-amber-500 text-white' : 'text-gray-500 hover:text-gray-700'}`}>
            ☰ Pick Subjects
          </button>
        </div>

        {error && (
          <div className="bg-red-50 border border-red-200 rounded-xl p-4 text-sm text-red-700">{error}</div>
        )}

        {loading ? <div className="text-center py-10 text-gray-400">Loading...</div> : (

          mode === 'block' ? (
            /* ── BLOCK SCHEDULE ── */
            <div className="bg-white rounded-2xl border border-gray-200 p-5 space-y-4">
              {offerings.length === 0 ? (
                <div className="text-center py-8">
                  <p className="text-3xl mb-3">⚠️</p>
                  <p className="font-semibold text-gray-700">No curriculum found for your program.</p>
                  <p className="text-sm text-gray-400 mt-1">Please use "Pick Subjects" mode or contact your adviser.</p>
                </div>
              ) : (
                <>
                  <div className="flex justify-between bg-gray-50 border border-gray-200 rounded-xl px-5 py-4 text-sm">
                    <span className="text-gray-500">Courses: <strong className="text-gray-900">{offerings.length}</strong></span>
                    <span className="text-gray-500">Units: <strong className="text-gray-900">{blockTotal}</strong></span>
                    <span className="text-gray-500">Section: <strong className="text-gray-900">{offerings[0]?.section ?? '—'}</strong></span>
                  </div>

                  <div className="space-y-3">
                    {offerings.map(o => (
                      <div key={o.id} className="border border-gray-200 rounded-xl p-4">
                        <div className="flex justify-between items-start gap-3">
                          <div className="flex-1">
                            <p className="font-black text-gray-900">{o.subjectCode}</p>
                            <p className="text-sm font-semibold text-gray-700 mt-0.5">{o.subjectTitle}</p>
                            {o.schedule && <p className="text-xs text-gray-400 mt-2">🕐 {o.schedule}</p>}
                            {o.room && <p className="text-xs text-gray-400">📍 {o.room}</p>}
                            {!o.hasAssignment && <p className="text-xs text-amber-500 mt-1">⚠️ No class assigned yet</p>}
                          </div>
                          <span className="bg-amber-400 text-white text-xs font-semibold px-3 py-1.5 rounded-full whitespace-nowrap">{o.units} Units</span>
                        </div>
                        {o.hasAssignment && (
                          <div className="mt-3 pt-3 border-t border-gray-100 flex justify-between text-xs text-gray-400">
                            <span>Section: <strong className="text-gray-700">{o.section}</strong></span>
                            <span>{o.slotsTotal - o.slotsTaken}/{o.slotsTotal} slots</span>
                          </div>
                        )}
                      </div>
                    ))}
                  </div>

                  <button
                    onClick={() => handleSubmit(offerings.filter(o => o.hasAssignment).map(o => o.id))}
                    disabled={submitting || offerings.filter(o => o.hasAssignment).length === 0}
                    className="w-full bg-amber-500 hover:bg-amber-600 text-white font-semibold py-3 rounded-xl transition disabled:opacity-60">
                    {submitting ? 'Submitting...' : 'Confirm Block Schedule'}
                  </button>
                </>
              )}
            </div>
          ) : (
            /* ── PICK SUBJECTS ── */
            <div className="space-y-4">
              <input value={query} onChange={e => setQuery(e.target.value)} placeholder="Search subjects..."
                className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-amber-400" />

              {filtered.length === 0 ? (
                <div className="text-center py-8 text-gray-400">
                  <p className="text-3xl mb-2">📚</p>
                  <p className="text-sm">No subjects available. Contact your adviser.</p>
                </div>
              ) : (
                <div className="space-y-3">
                  {filtered.map(o => {
                    const added = inCart(o.id);
                    const low = o.hasAssignment && (o.slotsTotal - o.slotsTaken) <= 5;
                    return (
                      <div key={o.id} className="bg-white rounded-xl border border-gray-200 p-4 flex gap-3 items-start">
                        <div className="flex-1">
                          <p className="font-black text-gray-900">{o.subjectTitle}</p>
                          <p className="text-xs text-gray-500 mt-0.5">{o.subjectCode}</p>
                          <p className="text-xs text-gray-400 mt-1">{o.schedule ?? 'TBA'}</p>
                          {o.hasAssignment ? (
                            <p className={`text-xs mt-1 font-semibold ${low ? 'text-red-500' : 'text-gray-400'}`}>
                              👥 {o.slotsTotal - o.slotsTaken}/{o.slotsTotal} slots
                            </p>
                          ) : (
                            <p className="text-xs mt-1 text-amber-500">⚠️ No class assigned yet</p>
                          )}
                        </div>
                        <button
                          onClick={() => added ? setCart(p => p.filter(i => i.offeringId !== o.id)) : addToCart(o)}
                          disabled={(o.isFull || !o.hasAssignment) && !added}
                          className={`w-9 h-9 rounded-xl flex items-center justify-center text-white font-black text-lg flex-shrink-0 transition
                            ${added ? 'bg-green-500' : (o.isFull || !o.hasAssignment) ? 'bg-gray-300' : 'bg-amber-500 hover:bg-amber-600'}`}>
                          {added ? '✓' : (o.isFull || !o.hasAssignment) ? '✕' : '+'}
                        </button>
                      </div>
                    );
                  })}
                </div>
              )}

              {/* Cart */}
              <div className="bg-[#0A1222] rounded-2xl p-5">
                <p className="text-white font-semibold mb-3">Subject Cart</p>
                {cart.length === 0 ? (
                  <p className="text-gray-400 text-sm">No subjects added yet.</p>
                ) : (
                  <div className="space-y-2 mb-3">
                    {cart.map(ci => (
                      <div key={ci.offeringId} className="bg-gray-800 rounded-xl px-4 py-3 flex justify-between items-center">
                        <div>
                          <p className="text-white font-semibold text-sm">{ci.subjectCode}</p>
                          <p className="text-gray-400 text-xs">{ci.units} units</p>
                        </div>
                        <button onClick={() => setCart(p => p.filter(i => i.offeringId !== ci.offeringId))}
                          className="text-red-400 text-sm font-semibold hover:text-red-300">Remove</button>
                      </div>
                    ))}
                  </div>
                )}
                <div className="flex justify-between text-sm mb-4">
                  <span className="text-gray-300">Total Units</span>
                  <span className="text-amber-400 font-semibold">{totalUnits} / 24</span>
                </div>
                <button onClick={() => setShowConfirm(true)} disabled={cart.length === 0}
                  className="w-full bg-amber-500 hover:bg-amber-600 text-white font-semibold py-3 rounded-xl transition disabled:opacity-40 text-sm">
                  Submit Enrollment
                </button>
              </div>
            </div>
          )
        )}
      </div>

      {/* Confirm modal */}
      {showConfirm && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50 p-6">
          <div className="bg-white rounded-2xl p-6 w-full max-w-sm">
            <p className="font-black text-gray-900 text-lg text-center mb-2">Confirm Enrollment</p>
            <p className="text-sm text-gray-500 text-center mb-5">Enroll in {cart.length} subject{cart.length !== 1 ? 's' : ''} ({totalUnits} units)?</p>
            <button onClick={() => handleSubmit(cart.map(i => i.offeringId))} disabled={submitting}
              className="w-full bg-amber-500 hover:bg-amber-600 text-white font-semibold py-3 rounded-xl transition disabled:opacity-60 mb-2">
              {submitting ? 'Enrolling...' : 'Confirm'}
            </button>
            <button onClick={() => setShowConfirm(false)} disabled={submitting}
              className="w-full bg-gray-100 text-gray-900 font-semibold py-3 rounded-xl hover:bg-gray-200 transition">Cancel</button>
          </div>
        </div>
      )}

      {/* Success modal */}
      {success && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50 p-6">
          <div className="bg-white rounded-2xl p-6 w-full max-w-sm text-center">
            <p className="text-5xl mb-3">✅</p>
            <p className="font-black text-gray-900 text-lg mb-2">Enrollment Successful!</p>
            <p className="text-sm text-gray-500 mb-5">You have been enrolled in {success.count} subject{success.count !== 1 ? 's' : ''}.</p>
            <button onClick={() => { setSuccess(null); router.push('/dashboard'); }}
              className="w-full bg-amber-500 hover:bg-amber-600 text-white font-semibold py-3 rounded-xl transition">Done</button>
          </div>
        </div>
      )}
    </DashboardLayout>
  );
}
