'use client';
import { useEffect, useMemo, useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { getSubjects, getUserInfo, submitEnrollment } from '@/lib/api';
import DashboardLayout from '@/components/DashboardLayout';

const BANNER_COLORS = ['#E9D5FF', '#BFDBFE', '#BBF7D0', '#FED7AA', '#FBCFE8', '#DDD6FE'];

type Offering = {
  id: string; subjectCode: string; subjectTitle: string; units: number;
  section: string; schedule: string | null; room: string | null;
  instructor: string | null; slotsTotal: number; slotsTaken: number; isFull: boolean;
};

type CartItem = { offeringId: string; subjectCode: string; subjectTitle: string; units: number };

export default function SubjectsPage() {
  const { user, loading: authLoading } = useAuth();
  const [offerings, setOfferings] = useState<Offering[]>([]);
  const [loading, setLoading] = useState(true);
  const [q, setQ] = useState('');
  const [cart, setCart] = useState<CartItem[]>([]);
  const [view, setView] = useState<'search' | 'cart'>('search');
  const [submitting, setSubmitting] = useState(false);
  const [userName, setUserName] = useState('');

  useEffect(() => {
    if (authLoading || !user) return;
    Promise.all([
      getSubjects('2025-2026', 'First Term'),
      getUserInfo(user.id),
    ])
      .then(([subjectsData, userInfoData]) => {
        setOfferings(subjectsData);
        setUserName(userInfoData.userName);
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, [user, authLoading]);

  const filtered = useMemo(() => {
    const s = q.trim().toLowerCase();
    if (!s) return offerings;
    return offerings.filter(o => (o.subjectTitle + o.subjectCode + (o.instructor ?? '')).toLowerCase().includes(s));
  }, [q, offerings]);

  const totalUnits = cart.reduce((s, i) => s + i.units, 0);
  const inCart = (id: string) => cart.some(i => i.offeringId === id);

  const addToCart = (o: Offering) => {
    if (inCart(o.id) || o.isFull || totalUnits + o.units > 24) return;
    setCart(prev => [...prev, { offeringId: o.id, subjectCode: o.subjectCode, subjectTitle: o.subjectTitle, units: o.units }]);
  };

  const handleSubmit = async () => {
    if (!user || cart.length === 0) return;
    setSubmitting(true);
    try {
      await submitEnrollment({
        studentId: user.id,
        classAssignmentIds: cart.map(i => i.offeringId),
      });
      setCart([]);
      setView('search');
      alert('Enrollment submitted successfully!');
    } catch (error: any) {
      alert(error.message || 'Enrollment failed. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <DashboardLayout>

      <div className="p-6 w-full">
        {view === 'search' ? (
          <>
            <div>
              <h1 className="text-xl font-black text-gray-900">Welcome, {userName || 'Student'}</h1>
              <p className="text-sm text-gray-500">Find and enroll in your subjects</p>
            </div>

            {/* Enrollment summary */}
            <div className="bg-white rounded-2xl border border-gray-200 p-4 flex justify-between items-center">
              <div>
                <p className="text-xs text-gray-500 font-semibold">Current Enrollment</p>
                <p className="text-3xl font-black text-gray-900">{totalUnits}</p>
                <p className="text-xs text-gray-400">units selected • Maximum: 24 units</p>
              </div>
              <span className="bg-blue-100 text-blue-700 text-xs font-semibold px-3 py-1 rounded-full">In Progress</span>
            </div>

            {/* Search */}
            <div className="relative">
              <input value={q} onChange={e => setQ(e.target.value)} placeholder="Search subjects..."
                className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-amber-400 pl-10" />
              <span className="absolute left-3 top-3.5 text-gray-400">🔍</span>
            </div>

            {/* Filter */}
            <div className="flex items-center justify-between bg-white border border-gray-200 rounded-xl px-4 py-3">
              <span className="text-sm font-semibold text-gray-900">All Departments</span>
              <span className="text-gray-400">▾</span>
            </div>

            <div className="flex justify-between items-center">
              <p className="font-black text-gray-900">Available Subjects</p>
              <p className="text-sm text-gray-500">{loading ? '…' : `${filtered.length} results`}</p>
            </div>

            {loading ? <div className="text-center py-10 text-gray-400">Loading...</div> : (
              <div className="space-y-3">
                {filtered.map((o, i) => {
                  const slotsLeft = o.slotsTotal - o.slotsTaken;
                  const low = slotsLeft <= 5;
                  const added = inCart(o.id);
                  return (
                    <div key={o.id} className="bg-white rounded-2xl border border-gray-200 overflow-hidden shadow-sm">
                      <div className="h-16" style={{ backgroundColor: BANNER_COLORS[i % BANNER_COLORS.length] }} />
                      <div className="p-4">
                        <div className="flex justify-between items-start gap-3">
                          <div className="flex-1">
                            <p className="font-black text-gray-900">{o.subjectTitle}</p>
                            <p className="text-xs text-gray-500 mt-0.5">{o.subjectCode}</p>
                            {o.schedule && <p className="text-xs text-gray-500 mt-1">🕐 {o.schedule}</p>}
                            {o.instructor && <p className="text-xs text-gray-500">👤 {o.instructor}</p>}
                            <p className={`text-xs mt-1 font-semibold ${low ? 'text-red-500' : 'text-gray-500'}`}>
                              👥 {slotsLeft} / {o.slotsTotal} slots available
                            </p>
                          </div>
                          <button onClick={() => addToCart(o)} disabled={o.isFull || added}
                            className={`w-9 h-9 rounded-xl flex items-center justify-center text-white font-black text-lg transition
                              ${added ? 'bg-green-500' : o.isFull ? 'bg-gray-300' : 'bg-amber-500 hover:bg-amber-600'}`}>
                            {added ? '✓' : o.isFull ? '✕' : '+'}
                          </button>
                        </div>
                        <div className="flex justify-between mt-3 pt-3 border-t border-gray-100">
                          <span className="text-xs text-gray-400">Units</span>
                          <span className="text-sm font-black text-gray-900">{o.units}</span>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </>
        ) : (
          <>
            <button onClick={() => setView('search')} className="flex items-center gap-2 text-sm text-gray-500 hover:text-gray-700">← Back to Search</button>
            <h1 className="text-2xl font-black text-gray-900">Subject Cart</h1>
            <p className="text-sm text-gray-500">Review your selected subjects before enrolling</p>

            {cart.length === 0 ? (
              <div className="bg-white rounded-2xl border border-gray-200 p-10 text-center">
                <p className="text-4xl mb-3">🛒</p>
                <p className="font-black text-gray-900">Your cart is empty</p>
                <p className="text-sm text-gray-500 mt-1">Add subjects from the search page</p>
                <button onClick={() => setView('search')} className="mt-4 bg-amber-500 text-white px-5 py-2 rounded-xl font-semibold text-sm hover:bg-amber-600">Browse Subjects</button>
              </div>
            ) : (
              <>
                <div className="space-y-3">
                  {cart.map(ci => (
                    <div key={ci.offeringId} className="bg-white rounded-2xl border border-gray-200 p-4 flex justify-between items-center">
                      <div>
                        <p className="font-black text-gray-900">{ci.subjectTitle}</p>
                        <p className="text-xs text-gray-500">{ci.subjectCode} • {ci.units} units</p>
                      </div>
                      <button onClick={() => setCart(prev => prev.filter(i => i.offeringId !== ci.offeringId))}
                        className="text-gray-400 hover:text-red-500 text-lg">✕</button>
                    </div>
                  ))}
                </div>

                <div className="bg-[#0B1220] rounded-2xl p-5">
                  <p className="text-white font-black mb-3">Enrollment Summary</p>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between"><span className="text-gray-400">Total Subjects</span><span className="text-white font-semibold">{cart.length}</span></div>
                    <div className="flex justify-between"><span className="text-gray-400">Total Units</span><span className="text-amber-400 font-semibold">{totalUnits}</span></div>
                    <div className="flex justify-between"><span className="text-gray-400">Units Limit</span><span className="text-gray-400">24 units</span></div>
                  </div>
                  <div className="mt-3 h-2 bg-gray-700 rounded-full overflow-hidden">
                    <div className="h-full bg-amber-500 rounded-full transition-all" style={{ width: `${Math.min((totalUnits / 24) * 100, 100)}%` }} />
                  </div>
                  <div className="mt-3 space-y-1 text-xs text-gray-500">
                    <p>• Review your selected subjects carefully</p>
                    <p>• Enrollment is subject to slot availability</p>
                    <p>• Changes can be made during add/drop period</p>
                  </div>
                </div>

                <button onClick={handleSubmit} disabled={submitting}
                  className="w-full bg-amber-500 hover:bg-amber-600 text-white font-black py-4 rounded-2xl transition disabled:opacity-60">
                  {submitting ? 'Submitting...' : 'Confirm Enrollment'}
                </button>
              </>
            )}
          </>
        )}
      </div>

      {/* Cart FAB */}
      {view === 'search' && cart.length > 0 && (
        <button onClick={() => setView('cart')}
          className="fixed bottom-6 right-6 w-14 h-14 bg-amber-500 hover:bg-amber-600 text-white rounded-full shadow-lg flex items-center justify-center text-xl transition">
          🛒
          <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs font-black w-5 h-5 rounded-full flex items-center justify-center">{cart.length}</span>
        </button>
      )}
    </DashboardLayout>
  );
}
