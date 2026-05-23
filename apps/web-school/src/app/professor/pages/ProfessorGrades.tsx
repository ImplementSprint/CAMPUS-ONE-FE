'use client'
import { useState, useEffect } from 'react';
import { ChevronDown, Pencil, Save, X, CloudUpload, CheckCircle, Clock, ClipboardList } from 'lucide-react';
import { getCurrentUser } from '@/services/auth.service';
import {
  getProfessorClasses,
  getClassGrades,
  saveGrade,
  submitGrade,
  type ClassAssignment,
  type Grade,
} from '../services/professor.service';

export function ProfessorGrades() {
  const user = getCurrentUser();
  const [classes, setClasses] = useState<ClassAssignment[]>([]);
  const [selectedClass, setSelectedClass] = useState<ClassAssignment | null>(null);
  const [grades, setGrades] = useState<Grade[]>([]);
  const [loadingClasses, setLoadingClasses] = useState(true);
  const [loadingGrades, setLoadingGrades] = useState(false);
  const [showDropdown, setShowDropdown] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [tempGrades, setTempGrades] = useState<Grade[]>([]);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (!user?.id) return;
    getProfessorClasses(user.id).then(r => {
      if (r.data) { setClasses(r.data); setSelectedClass(r.data[0] ?? null); }
      setLoadingClasses(false);
    });
  }, [user?.id]);

  useEffect(() => {
    if (!selectedClass) return;
    setLoadingGrades(true);
    if (!user?.id) return;
    getClassGrades(selectedClass.id, user.id).then(r => {
      setGrades(r.data ?? []);
      setLoadingGrades(false);
    });
  }, [selectedClass, user?.id]);

  const handleEdit = () => { setTempGrades(grades.map(g => ({ ...g }))); setIsEditing(true); };
  const handleCancel = () => setIsEditing(false);

  const updateTemp = (enrollmentId: string, field: 'prelim_grade' | 'midterm_grade' | 'finals_grade', value: string) => {
    setTempGrades(prev => prev.map(g =>
      g.enrollment_id === enrollmentId ? { ...g, [field]: value === '' ? null : parseFloat(value) } : g
    ));
  };

  const handleSave = async () => {
    if (!user?.id) return;
    setSaving(true);
    for (const g of tempGrades) {
      await saveGrade(g.enrollment_id, user.id, {
        prelim_grade: g.prelim_grade ?? undefined,
        midterm_grade: g.midterm_grade ?? undefined,
        finals_grade: g.finals_grade ?? undefined,
        remarks: g.remarks ?? undefined,
      });
    }
    const r = await getClassGrades(selectedClass!.id, user.id);
    setGrades(r.data ?? []);
    setIsEditing(false);
    setSaving(false);
  };

  const handleSubmitAll = async () => {
    if (!user?.id || !confirm('Submit all grades for this class?')) return;
    setSaving(true);
    for (const g of grades) {
      if (g.prelim_grade !== null || g.midterm_grade !== null || g.finals_grade !== null) {
        await submitGrade(g.enrollment_id, user.id, {
          prelim_grade: g.prelim_grade ?? undefined,
          midterm_grade: g.midterm_grade ?? undefined,
          finals_grade: g.finals_grade ?? undefined,
          final_grade: g.final_grade ?? undefined,
          letter_grade: g.letter_grade ?? undefined,
          remarks: g.remarks ?? undefined,
        });
      }
    }
    const r = await getClassGrades(selectedClass!.id, user.id);
    setGrades(r.data ?? []);
    setSaving(false);
  };

  if (loadingClasses) return <div className="flex items-center justify-center py-24"><div className="animate-spin rounded-full h-10 w-10 border-b-2 border-[#F59E0B]" /></div>;

  const displayGrades = isEditing ? tempGrades : grades;

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Encode Grades</h1>
        <p className="text-sm text-gray-500 mt-1">Input and manage student grades</p>
      </div>

      {/* Class Selector */}
      <div className="relative w-96">
        <button onClick={() => setShowDropdown(!showDropdown)}
          className="w-full bg-white border border-gray-200 rounded-xl px-4 py-3 flex items-center justify-between hover:bg-gray-50 transition-colors">
          <div className="text-left">
            <p className="text-xs text-gray-500">Class</p>
            <p className="text-sm font-semibold text-gray-900">
              {selectedClass ? `${selectedClass.subject.code} — ${selectedClass.subject.name} (Sec ${selectedClass.section})` : 'Select a class'}
            </p>
          </div>
          <ChevronDown className="w-4 h-4 text-gray-500" />
        </button>
        {showDropdown && (
          <div className="absolute z-10 w-full mt-1 bg-white border border-gray-200 rounded-xl shadow-lg overflow-hidden">
            {classes.map(c => (
              <button key={c.id} onClick={() => { setSelectedClass(c); setShowDropdown(false); setIsEditing(false); }}
                className={`w-full px-4 py-3 text-left text-sm hover:bg-gray-50 transition-colors ${selectedClass?.id === c.id ? 'text-[#F59E0B] font-semibold' : 'text-gray-700'}`}>
                {c.subject.code} — {c.subject.name} (Section {c.section})
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Grades Table */}
      {loadingGrades ? (
        <div className="flex items-center justify-center py-16"><div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#F59E0B]" /></div>
      ) : grades.length === 0 ? (
        <div className="bg-white rounded-2xl border border-dashed border-gray-300 p-16 text-center">
          <ClipboardList className="w-14 h-14 text-gray-300 mx-auto mb-4" />
          <p className="text-lg font-bold text-gray-900 mb-2">No Students Enrolled</p>
          <p className="text-sm text-gray-500">This class has no enrolled students yet.</p>
        </div>
      ) : (
        <>
          <div className="bg-white rounded-2xl border border-gray-200 overflow-hidden">
            {/* Table Header */}
            <div className="grid grid-cols-[2fr_1fr_1fr_1fr_1fr_1fr] bg-gray-50 px-6 py-3.5 border-b border-gray-200">
              <span className="text-xs font-semibold text-gray-600 uppercase tracking-wide">Student</span>
              <span className="text-xs font-semibold text-gray-600 uppercase tracking-wide text-center">Prelim</span>
              <span className="text-xs font-semibold text-gray-600 uppercase tracking-wide text-center">Midterm</span>
              <span className="text-xs font-semibold text-gray-600 uppercase tracking-wide text-center">Finals</span>
              <span className="text-xs font-semibold text-gray-600 uppercase tracking-wide text-center">Final</span>
              <span className="text-xs font-semibold text-gray-600 uppercase tracking-wide text-center">Status</span>
            </div>

            {displayGrades.map((g, i) => (
              <div key={g.enrollment_id}
                className={`grid grid-cols-[2fr_1fr_1fr_1fr_1fr_1fr] px-6 py-4 items-center ${i < displayGrades.length - 1 ? 'border-b border-gray-100' : ''}`}>
                <div>
                  <p className="text-sm font-semibold text-gray-900">{g.student_name}</p>
                  <p className="text-xs text-gray-500 mt-0.5">{g.student_number}</p>
                </div>
                {isEditing ? (
                  <>
                    {(['prelim_grade', 'midterm_grade', 'finals_grade'] as const).map(field => (
                      <input key={field}
                        type="number" min="0" max="100" step="0.01"
                        value={g[field] ?? ''}
                        onChange={e => updateTemp(g.enrollment_id, field, e.target.value)}
                        className="mx-2 text-center text-sm border border-gray-300 rounded-lg py-1.5 px-2 bg-gray-50 focus:outline-none focus:border-[#F59E0B] focus:ring-1 focus:ring-[#F59E0B]" />
                    ))}
                  </>
                ) : (
                  <>
                    <span className="text-sm text-gray-700 text-center font-medium">{g.prelim_grade?.toFixed(2) ?? '—'}</span>
                    <span className="text-sm text-gray-700 text-center font-medium">{g.midterm_grade?.toFixed(2) ?? '—'}</span>
                    <span className="text-sm text-gray-700 text-center font-medium">{g.finals_grade?.toFixed(2) ?? '—'}</span>
                  </>
                )}
                <span className={`text-sm text-center font-bold ${g.final_grade ? 'text-[#F59E0B]' : 'text-gray-400'}`}>
                  {g.final_grade?.toFixed(2) ?? '—'}
                </span>
                <div className="flex justify-center">
                  {g.remarks === 'Submitted'
                    ? <div className="w-7 h-7 rounded-full bg-green-100 flex items-center justify-center"><CheckCircle className="w-4 h-4 text-green-700" /></div>
                    : <div className="w-7 h-7 rounded-full bg-amber-100 flex items-center justify-center"><Clock className="w-4 h-4 text-amber-700" /></div>
                  }
                </div>
              </div>
            ))}
          </div>

          {/* Actions */}
          <div className="flex gap-4">
            {isEditing ? (
              <>
                <button onClick={handleCancel} className="flex items-center gap-2 bg-white border border-gray-300 text-gray-600 text-sm font-semibold px-6 py-3 rounded-xl hover:bg-gray-50 transition-colors">
                  <X className="w-4 h-4" /> Cancel
                </button>
                <button onClick={handleSave} disabled={saving} className="flex items-center gap-2 bg-[#F59E0B] text-white text-sm font-semibold px-6 py-3 rounded-xl hover:bg-[#d97706] disabled:opacity-50 transition-colors">
                  <Save className="w-4 h-4" /> {saving ? 'Saving...' : 'Save Changes'}
                </button>
              </>
            ) : (
              <>
                <button onClick={handleEdit} className="flex items-center gap-2 bg-white border border-gray-300 text-gray-600 text-sm font-semibold px-6 py-3 rounded-xl hover:bg-gray-50 transition-colors">
                  <Pencil className="w-4 h-4" /> Edit Grades
                </button>
                <button onClick={handleSubmitAll} disabled={saving} className="flex items-center gap-2 bg-[#F59E0B] text-white text-sm font-semibold px-6 py-3 rounded-xl hover:bg-[#d97706] disabled:opacity-50 transition-colors">
                  <CloudUpload className="w-4 h-4" /> {saving ? 'Submitting...' : 'Submit Grades'}
                </button>
              </>
            )}
          </div>
        </>
      )}
    </div>
  );
}
