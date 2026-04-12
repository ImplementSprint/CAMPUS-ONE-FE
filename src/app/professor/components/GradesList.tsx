'use client'
import { useState, useEffect } from "react";
import { ClipboardList, Edit2, Lock, Unlock, Save, X } from "lucide-react";
import { getClassGrades, saveGrade, type Grade } from "../services/professor.service";

interface GradesListProps {
  classId: string;
  professorId: string;
}

export function GradesList({ classId, professorId }: GradesListProps) {
  const [grades, setGrades] = useState<Grade[]>([]);
  const [loading, setLoading] = useState(true);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editForm, setEditForm] = useState({
    prelim_grade: "",
    midterm_grade: "",
    finals_grade: "",
    remarks: "",
  });
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    loadGrades();
  }, [classId]);

  const loadGrades = async () => {
    setLoading(true);
    const result = await getClassGrades(classId);
    if (result.data) {
      setGrades(result.data);
    }
    setLoading(false);
  };

  const handleEdit = (grade: Grade) => {
    setEditingId(grade.enrollment_id);
    setEditForm({
      prelim_grade: grade.prelim_grade?.toString() || "",
      midterm_grade: grade.midterm_grade?.toString() || "",
      finals_grade: grade.finals_grade?.toString() || "",
      remarks: grade.remarks || "",
    });
  };

  const handleCancel = () => {
    setEditingId(null);
    setEditForm({
      prelim_grade: "",
      midterm_grade: "",
      finals_grade: "",
      remarks: "",
    });
  };

  const handleSave = async (enrollmentId: string) => {
    setSaving(true);
    const gradeData: any = {};
    
    if (editForm.prelim_grade) gradeData.prelim_grade = parseFloat(editForm.prelim_grade);
    if (editForm.midterm_grade) gradeData.midterm_grade = parseFloat(editForm.midterm_grade);
    if (editForm.finals_grade) gradeData.finals_grade = parseFloat(editForm.finals_grade);
    if (editForm.remarks) gradeData.remarks = editForm.remarks;

    const result = await saveGrade(enrollmentId, professorId, gradeData);
    
    if (!result.error) {
      await loadGrades();
      handleCancel();
    }
    setSaving(false);
  };

  if (loading) {
    return (
      <div className="px-4 py-6">
        <div className="text-center py-12">
          <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-[#F59E0B] mx-auto"></div>
          <p className="text-sm text-gray-600 mt-3">Loading grades...</p>
        </div>
      </div>
    );
  }

  if (grades.length === 0) {
    return (
      <div className="px-4 py-6">
        <div className="bg-white rounded-xl p-8 text-center border border-gray-100">
          <ClipboardList className="w-12 h-12 text-gray-400 mx-auto mb-3" />
          <p className="text-sm font-medium text-gray-900 mb-1">No Students to Grade</p>
          <p className="text-xs text-gray-600">This class doesn't have any enrolled students yet.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="px-4 py-4 space-y-3">
      <div className="flex items-center justify-between">
        <h2 className="text-sm font-bold text-gray-900">
          Student Grades ({grades.length})
        </h2>
      </div>

      <div className="space-y-2">
        {grades.map((grade) => (
          <div
            key={grade.enrollment_id}
            className="bg-white rounded-xl p-4 border border-gray-100"
          >
            {editingId === grade.enrollment_id ? (
              <EditGradeForm
                grade={grade}
                form={editForm}
                onChange={setEditForm}
                onSave={() => handleSave(grade.enrollment_id)}
                onCancel={handleCancel}
                saving={saving}
              />
            ) : (
              <ViewGrade
                grade={grade}
                onEdit={() => handleEdit(grade)}
              />
            )}
          </div>
        ))}
      </div>
    </div>
  );
}

function ViewGrade({ grade, onEdit }: { grade: Grade; onEdit: () => void }) {
  return (
    <div>
      <div className="flex items-start justify-between mb-3">
        <div>
          <h3 className="text-sm font-bold text-gray-900">{grade.student_name}</h3>
          <p className="text-xs text-gray-600">{grade.student_number}</p>
        </div>
        <button
          onClick={onEdit}
          disabled={grade.is_locked}
          className={`p-2 rounded-lg transition-colors ${
            grade.is_locked
              ? "text-gray-400 cursor-not-allowed"
              : "text-[#F59E0B] hover:bg-[#F59E0B]/10"
          }`}
        >
          {grade.is_locked ? <Lock className="w-4 h-4" /> : <Edit2 className="w-4 h-4" />}
        </button>
      </div>

      <div className="grid grid-cols-3 gap-2 mb-3">
        <div className="bg-gray-50 rounded-lg p-2 text-center">
          <p className="text-xs text-gray-600 mb-1">Prelim</p>
          <p className="text-sm font-bold text-gray-900">
            {grade.prelim_grade?.toFixed(2) || "-"}
          </p>
        </div>
        <div className="bg-gray-50 rounded-lg p-2 text-center">
          <p className="text-xs text-gray-600 mb-1">Midterm</p>
          <p className="text-sm font-bold text-gray-900">
            {grade.midterm_grade?.toFixed(2) || "-"}
          </p>
        </div>
        <div className="bg-gray-50 rounded-lg p-2 text-center">
          <p className="text-xs text-gray-600 mb-1">Finals</p>
          <p className="text-sm font-bold text-gray-900">
            {grade.finals_grade?.toFixed(2) || "-"}
          </p>
        </div>
      </div>

      <div className="bg-[#F59E0B]/10 rounded-lg p-3">
        <div className="flex items-center justify-between">
          <span className="text-xs text-gray-600">Final Grade</span>
          <div className="flex items-center gap-2">
            <span className="text-lg font-bold text-[#F59E0B]">
              {grade.final_grade?.toFixed(2) || "-"}
            </span>
            {grade.letter_grade && (
              <span className="px-2 py-0.5 bg-[#F59E0B] text-white rounded text-xs font-bold">
                {grade.letter_grade}
              </span>
            )}
          </div>
        </div>
      </div>

      {grade.remarks && (
        <div className="mt-3 pt-3 border-t border-gray-100">
          <p className="text-xs text-gray-600">Remarks: {grade.remarks}</p>
        </div>
      )}
    </div>
  );
}

function EditGradeForm({
  grade,
  form,
  onChange,
  onSave,
  onCancel,
  saving,
}: {
  grade: Grade;
  form: any;
  onChange: (form: any) => void;
  onSave: () => void;
  onCancel: () => void;
  saving: boolean;
}) {
  return (
    <div>
      <div className="mb-3">
        <h3 className="text-sm font-bold text-gray-900">{grade.student_name}</h3>
        <p className="text-xs text-gray-600">{grade.student_number}</p>
      </div>

      <div className="space-y-3">
        <div>
          <label className="block text-xs font-medium text-gray-700 mb-1">
            Prelim Grade (0-100)
          </label>
          <input
            type="number"
            min="0"
            max="100"
            step="0.01"
            value={form.prelim_grade}
            onChange={(e) => onChange({ ...form, prelim_grade: e.target.value })}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#F59E0B]"
            placeholder="Enter prelim grade"
          />
        </div>

        <div>
          <label className="block text-xs font-medium text-gray-700 mb-1">
            Midterm Grade (0-100)
          </label>
          <input
            type="number"
            min="0"
            max="100"
            step="0.01"
            value={form.midterm_grade}
            onChange={(e) => onChange({ ...form, midterm_grade: e.target.value })}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#F59E0B]"
            placeholder="Enter midterm grade"
          />
        </div>

        <div>
          <label className="block text-xs font-medium text-gray-700 mb-1">
            Finals Grade (0-100)
          </label>
          <input
            type="number"
            min="0"
            max="100"
            step="0.01"
            value={form.finals_grade}
            onChange={(e) => onChange({ ...form, finals_grade: e.target.value })}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#F59E0B]"
            placeholder="Enter finals grade"
          />
        </div>

        <div>
          <label className="block text-xs font-medium text-gray-700 mb-1">
            Remarks (Optional)
          </label>
          <textarea
            value={form.remarks}
            onChange={(e) => onChange({ ...form, remarks: e.target.value })}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#F59E0B]"
            placeholder="Add remarks..."
            rows={2}
          />
        </div>
      </div>

      <div className="flex gap-2 mt-4">
        <button
          onClick={onSave}
          disabled={saving}
          className="flex-1 bg-[#F59E0B] text-white py-2 rounded-lg text-sm font-medium hover:bg-[#F59E0B]/90 disabled:opacity-50 flex items-center justify-center gap-2"
        >
          <Save className="w-4 h-4" />
          {saving ? "Saving..." : "Save Grade"}
        </button>
        <button
          onClick={onCancel}
          disabled={saving}
          className="px-4 py-2 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50 disabled:opacity-50"
        >
          <X className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
}
