'use client';
import { useEffect, useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { getEnrollmentStatus } from '@/lib/api';
import { supabase } from '@/lib/supabase';
import DashboardLayout from '@/components/DashboardLayout';

export default function AdvisedCoursesPage() {
  const { user, loading: authLoading } = useAuth();
  const [courses, setCourses] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [showAddDrop, setShowAddDrop] = useState(false);
  const [form, setForm] = useState({ lastName: '', firstName: '', middleName: '', suffix: '', program: '', sectionYear: '', contactNumber: '', subjectCode: '' });
  const [file, setFile] = useState<File | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  useEffect(() => {
    if (authLoading || !user) return;

    // Pre-fill form with profile data
    supabase.schema('student')
      .from('student_accounts')
      .select('applicant_id')
      .eq('id', user.id)
      .maybeSingle()
      .then(async ({ data: studentAccount }) => {
        if (!studentAccount?.applicant_id) return;

        const { data: profile } = await supabase
          .schema('application')
          .from('applicant_profiles')
          .select('first_name, last_name, middle_name, program')
          .eq('id', studentAccount.applicant_id)
          .maybeSingle();

        if (profile) setForm(f => ({ ...f, firstName: profile.first_name ?? '', lastName: profile.last_name ?? '', middleName: profile.middle_name ?? '', program: profile.program ?? '' }));
      });

    // Load enrolled courses via backend
    getEnrollmentStatus(user.id)
      .then(data => {
        setCourses((data.enrollments || []).map((e: any, i: number) => ({
          index: i + 1,
          id: e.id,
          code: e.subject?.code,
          title: e.subject?.name,
          units: e.subject?.units,
          section: e.section,
          schedule: e.schedule,
          room: e.room,
        })));
      })
      .catch(() => setCourses([]))
      .finally(() => setLoading(false));
  }, [user, authLoading]);

  const totalUnits = courses.reduce((s, c) => s + (c.units ?? 0), 0);
  const canSubmit = form.lastName && form.firstName && form.program && form.subjectCode && file;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!canSubmit || !user) return;
    setSubmitting(true);
    await supabase.from('notifications').insert({
      profile_id: user.id,
      title: 'Add/Drop Request Submitted',
      body: `Your request to add/drop courses (${form.subjectCode}) is currently under review.`,
      is_read: false,
    });
    setSubmitting(false);
    setSubmitted(true);
  };

  const fields = [
    { key: 'lastName', label: 'Last Name' }, { key: 'firstName', label: 'First Name' },
    { key: 'middleName', label: 'Middle Name' }, { key: 'suffix', label: 'Suffix' },
    { key: 'program', label: 'Degree Program' }, { key: 'sectionYear', label: 'Section / Year' },
    { key: 'contactNumber', label: 'Contact Number' }, { key: 'subjectCode', label: 'Subject Code' },
  ];

  return (
    <DashboardLayout>
      <div className="p-6 w-full space-y-5">
        <div>
          <h1 className="text-xl font-black text-gray-900">Advised Courses</h1>
          <p className="text-sm text-gray-500 mt-0.5">Your enrolled subjects for the current term</p>
        </div>

        {loading ? <div className="text-center py-10 text-gray-400">Loading...</div>
          : courses.length === 0 ? (
            <div className="bg-white rounded-2xl border border-gray-200 p-8 text-center text-gray-400">
              <p className="text-3xl mb-3">📑</p>
              <p className="font-black text-gray-900">No advised courses found</p>
              <p className="text-sm mt-1">You have no enrolled courses for this term.</p>
            </div>
          ) : (
            <>
              <div className="bg-gray-50 border border-gray-200 rounded-xl p-4 flex justify-between text-sm">
                <span className="text-gray-500">Total Courses: <strong className="text-gray-900">{courses.length}</strong></span>
                <span className="text-gray-500">Total Units: <strong className="text-gray-900">{totalUnits}</strong></span>
                <span className="text-gray-500">Section: <strong className="text-gray-900">{courses[0]?.section ?? '—'}</strong></span>
              </div>

              <div className="space-y-3">
                {courses.map(c => (
                  <div key={c.id} className="bg-white rounded-2xl border border-gray-200 p-5 flex gap-4">
                    <div className="w-8 h-8 rounded-full bg-amber-500 flex items-center justify-center text-white text-sm font-black flex-shrink-0">{c.index}</div>
                    <div className="flex-1">
                      <p className="font-black text-gray-900">{c.code}</p>
                      <p className="text-sm text-gray-700 mt-0.5">{c.title}</p>
                      <p className="text-xs text-gray-400 mt-1.5">Section: {c.section} • {c.units} Units</p>
                      {c.schedule && <p className="text-xs text-gray-400">🕐 {c.schedule}</p>}
                      {c.room && <p className="text-xs text-gray-400">📍 {c.room}</p>}
                    </div>
                  </div>
                ))}
              </div>
            </>
          )}

        {!loading && (
          <button onClick={() => { setShowAddDrop(v => !v); setSubmitted(false); }}
            className={`w-full font-semibold py-3 rounded-xl transition text-sm border ${
              showAddDrop
                ? 'bg-amber-500 text-white border-amber-500'
                : 'bg-white text-gray-900 border-gray-200 hover:bg-amber-500 hover:text-white hover:border-amber-500'
            }`}>
            {showAddDrop ? 'Cancel Add/Drop Request' : 'Add / Drop Courses'}
          </button>
        )}

        {showAddDrop && (
          <div className="bg-white rounded-2xl border border-gray-200 p-6">
            <h2 className="text-lg font-black text-gray-900 mb-1">Adding / Dropping of Courses</h2>
            <div className="bg-purple-50 border border-purple-200 rounded-xl p-4 flex gap-3 mb-5">
              <span className="text-purple-500 mt-0.5">ℹ️</span>
              <div>
                <p className="font-semibold text-gray-900 text-sm">Instructions</p>
                <p className="text-sm text-gray-600 mt-1">Fill out the form and attach the required documentation. Submit for advisor approval.</p>
              </div>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {fields.map(f => (
                  <div key={f.key}>
                    <label className="block text-sm font-semibold text-gray-700 mb-1.5">{f.label}</label>
                    <input value={(form as any)[f.key]} onChange={e => setForm(prev => ({ ...prev, [f.key]: e.target.value }))}
                      placeholder={`Enter ${f.label.toLowerCase()}`}
                      className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-amber-400" />
                  </div>
                ))}
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1.5">Attached Document <span className="text-red-500">*</span></label>
                {file ? (
                  <div className="border border-gray-200 rounded-xl p-4 flex items-center gap-3 bg-gray-50">
                    <div className="w-10 h-10 bg-red-500 rounded-lg flex items-center justify-center text-white text-xs font-bold">PDF</div>
                    <div className="flex-1">
                      <p className="font-semibold text-gray-900 text-sm">{file.name}</p>
                      <p className="text-xs text-gray-500">{(file.size / 1024).toFixed(1)} KB</p>
                    </div>
                    <button type="button" onClick={() => setFile(null)} className="text-red-500 text-sm font-semibold hover:text-red-700">Remove</button>
                  </div>
                ) : (
                  <label className="border-2 border-dashed border-gray-200 rounded-xl p-6 flex flex-col items-center cursor-pointer hover:border-amber-400 transition">
                    <span className="text-2xl mb-2">☁️</span>
                    <p className="font-semibold text-gray-700 text-sm">Click to upload document</p>
                    <p className="text-xs text-gray-400 mt-1">PDF, DOC, DOCX up to 10MB</p>
                    <input type="file" accept=".pdf,.doc,.docx" className="hidden" onChange={e => setFile(e.target.files?.[0] ?? null)} />
                  </label>
                )}
              </div>

              <button type="submit" disabled={!canSubmit || submitting}
                className="w-full bg-amber-500 hover:bg-amber-600 text-white font-semibold py-3 rounded-xl transition disabled:opacity-40 text-sm">
                {submitting ? 'Submitting...' : 'Submit Request'}
              </button>
            </form>

            {submitted && (
              <div className="mt-4 bg-blue-50 border border-blue-200 rounded-xl p-4 flex items-start gap-3">
                <span className="text-blue-500 mt-0.5">⏳</span>
                <div className="flex-1">
                  <p className="font-semibold text-blue-800 text-sm">Request In Progress</p>
                  <p className="text-sm text-gray-600 mt-0.5">Your add/drop request has been submitted and is under review.</p>
                </div>
                <button onClick={() => setSubmitted(false)} className="text-gray-400 hover:text-gray-600">✕</button>
              </div>
            )}
          </div>
        )}
      </div>
    </DashboardLayout>
  );
}
