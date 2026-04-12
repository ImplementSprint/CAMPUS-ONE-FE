'use client';
import { useEffect, useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/lib/supabase';
import DashboardLayout from '@/components/DashboardLayout';

export default function AddDropPage() {
  const { user, loading: authLoading } = useAuth();
  const [form, setForm] = useState({ lastName: '', firstName: '', middleName: '', suffix: '', program: '', sectionYear: '', contactNumber: '', subjectCode: '' });
  const [file, setFile] = useState<File | null>(null);
  const [submitted, setSubmitted] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    if (authLoading || !user) return;
    supabase.from('applicant_profiles')
      .select('first_name, last_name, middle_name, program')
      .eq('id', user.id)
      .maybeSingle()
      .then(({ data: ap }) => {
        if (ap) setForm(f => ({ ...f, firstName: ap.first_name ?? '', lastName: ap.last_name ?? '', middleName: ap.middle_name ?? '', program: ap.program ?? '' }));
      });
  }, [user, authLoading]);

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
      <div className="p-6 w-full">
        <div className="bg-white rounded-2xl border border-gray-200 p-6 max-w-2xl">
          <h1 className="text-xl font-black text-gray-900 mb-1">Adding / Dropping of Courses</h1>

          <div className="bg-purple-50 border border-purple-200 rounded-xl p-4 flex gap-3 mb-6">
            <span className="text-purple-500 mt-0.5">ℹ️</span>
            <div>
              <p className="font-semibold text-gray-900 text-sm">Instructions</p>
              <p className="text-sm text-gray-600 mt-1">Fill out the form below to request adding or dropping courses. Attach the required documentation and submit for advisor approval.</p>
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
                  <div className="w-10 h-10 bg-red-500 rounded-lg flex items-center justify-center text-white text-sm">PDF</div>
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

            <div className="flex gap-3 pt-2">
              <button type="button" onClick={() => window.history.back()}
                className="flex-1 py-3 rounded-xl border border-gray-200 text-gray-700 font-semibold text-sm hover:bg-gray-50 transition">Back</button>
              <button type="submit" disabled={!canSubmit || submitting}
                className="flex-1 py-3 rounded-xl bg-amber-500 hover:bg-amber-600 text-white font-semibold text-sm transition disabled:opacity-40">
                {submitting ? 'Submitting...' : 'Submit Request'}
              </button>
            </div>
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
      </div>
    </DashboardLayout>
  );
}
