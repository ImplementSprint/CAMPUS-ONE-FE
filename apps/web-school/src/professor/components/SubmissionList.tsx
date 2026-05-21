'use client'
import { useState, useEffect } from "react";
import { FileText, Download, Edit2, Save, X } from "lucide-react";
import {
  getClassSubmissions,
  gradeSubmission,
  type Submission,
} from "@/professor/services/professor.service";

interface SubmissionListProps {
  classId: string;
  professorId: string;
}

export function SubmissionList({ classId, professorId }: SubmissionListProps) {
  const [submissions, setSubmissions] = useState<Submission[]>([]);
  const [loading, setLoading] = useState(true);
  const [gradingId, setGradingId] = useState<string | null>(null);
  const [gradeForm, setGradeForm] = useState({
    score: "",
    max_score: "",
    feedback: "",
  });
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    loadSubmissions();
  }, [classId]);

  const loadSubmissions = async () => {
    setLoading(true);
    const result = await getClassSubmissions(classId);
    if (result.data) {
      setSubmissions(result.data);
    }
    setLoading(false);
  };

  const handleGrade = (submission: Submission) => {
    setGradingId(submission.id);
    setGradeForm({
      score: submission.score?.toString() || "",
      max_score: submission.max_score?.toString() || "100",
      feedback: submission.feedback || "",
    });
  };

  const handleCancel = () => {
    setGradingId(null);
    setGradeForm({
      score: "",
      max_score: "",
      feedback: "",
    });
  };

  const handleSave = async (submissionId: string) => {
    if (!gradeForm.score || !gradeForm.max_score) return;

    setSaving(true);
    await gradeSubmission(submissionId, professorId, {
      score: parseFloat(gradeForm.score),
      max_score: parseFloat(gradeForm.max_score),
      feedback: gradeForm.feedback,
      status: "graded",
    });
    await loadSubmissions();
    handleCancel();
    setSaving(false);
  };

  if (loading) {
    return (
      <div className="px-4 py-6">
        <div className="text-center py-12">
          <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-[#F59E0B] mx-auto"></div>
          <p className="text-sm text-gray-600 mt-3">Loading submissions...</p>
        </div>
      </div>
    );
  }

  if (submissions.length === 0) {
    return (
      <div className="px-4 py-6">
        <div className="bg-white rounded-xl p-8 text-center border border-gray-100">
          <FileText className="w-12 h-12 text-gray-400 mx-auto mb-3" />
          <p className="text-sm font-medium text-gray-900 mb-1">No Submissions</p>
          <p className="text-xs text-gray-600">No student submissions yet.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="px-4 py-4 space-y-3">
      <div className="flex items-center justify-between">
        <h2 className="text-sm font-bold text-gray-900">
          Submissions ({submissions.length})
        </h2>
      </div>

      <div className="space-y-2">
        {submissions.map((submission) => (
          <div
            key={submission.id}
            className="bg-white rounded-xl p-4 border border-gray-100"
          >
            {gradingId === submission.id ? (
              <GradeForm
                submission={submission}
                form={gradeForm}
                onChange={setGradeForm}
                onSave={() => handleSave(submission.id)}
                onCancel={handleCancel}
                saving={saving}
              />
            ) : (
              <ViewSubmission
                submission={submission}
                onGrade={() => handleGrade(submission)}
              />
            )}
          </div>
        ))}
      </div>
    </div>
  );
}

function ViewSubmission({
  submission,
  onGrade,
}: {
  submission: Submission;
  onGrade: () => void;
}) {
  const statusColors = {
    submitted: "bg-blue-100 text-blue-700",
    graded: "bg-green-100 text-green-700",
    late: "bg-red-100 text-red-700",
  };

  return (
    <div>
      <div className="flex items-start justify-between mb-3">
        <div className="flex-1">
          <h3 className="text-sm font-bold text-gray-900">{submission.student_name}</h3>
          <p className="text-xs text-gray-600">{submission.student_number}</p>
        </div>
        <button
          onClick={onGrade}
          className="p-2 text-[#F59E0B] hover:bg-[#F59E0B]/10 rounded-lg"
        >
          <Edit2 className="w-4 h-4" />
        </button>
      </div>

      <div className="space-y-2">
        <div>
          <p className="text-xs font-medium text-gray-700 mb-1">Title</p>
          <p className="text-sm text-gray-900">{submission.title}</p>
        </div>

        {submission.description && (
          <div>
            <p className="text-xs font-medium text-gray-700 mb-1">Description</p>
            <p className="text-xs text-gray-600">{submission.description}</p>
          </div>
        )}

        {submission.file_url && (
          <div>
            <a
              href={submission.file_url}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 text-xs text-[#F59E0B] hover:underline"
            >
              <Download className="w-3.5 h-3.5" />
              {submission.file_name}
            </a>
          </div>
        )}

        <div className="flex items-center gap-2">
          <span
            className={`px-2 py-0.5 rounded text-xs font-medium ${
              statusColors[submission.status as keyof typeof statusColors] ||
              "bg-gray-100 text-gray-700"
            }`}
          >
            {submission.status}
          </span>
          {submission.is_late && (
            <span className="px-2 py-0.5 bg-red-100 text-red-700 rounded text-xs font-medium">
              Late
            </span>
          )}
        </div>

        {submission.score !== null && (
          <div className="bg-[#F59E0B]/10 rounded-lg p-3">
            <div className="flex items-center justify-between">
              <span className="text-xs text-gray-600">Score</span>
              <span className="text-lg font-bold text-[#F59E0B]">
                {submission.score}/{submission.max_score}
              </span>
            </div>
          </div>
        )}

        {submission.feedback && (
          <div className="bg-gray-50 rounded-lg p-3">
            <p className="text-xs font-medium text-gray-700 mb-1">Feedback</p>
            <p className="text-xs text-gray-600">{submission.feedback}</p>
          </div>
        )}

        <p className="text-xs text-gray-500">
          Submitted: {new Date(submission.submitted_at).toLocaleString()}
        </p>
      </div>
    </div>
  );
}

function GradeForm({
  submission,
  form,
  onChange,
  onSave,
  onCancel,
  saving,
}: {
  submission: Submission;
  form: any;
  onChange: (form: any) => void;
  onSave: () => void;
  onCancel: () => void;
  saving: boolean;
}) {
  return (
    <div>
      <div className="mb-3">
        <h3 className="text-sm font-bold text-gray-900">{submission.student_name}</h3>
        <p className="text-xs text-gray-600">{submission.title}</p>
      </div>

      <div className="space-y-3">
        <div className="grid grid-cols-2 gap-2">
          <div>
            <label className="block text-xs font-medium text-gray-700 mb-1">
              Score
            </label>
            <input
              type="number"
              min="0"
              step="0.01"
              value={form.score}
              onChange={(e) => onChange({ ...form, score: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#F59E0B]"
              placeholder="Score"
            />
          </div>
          <div>
            <label className="block text-xs font-medium text-gray-700 mb-1">
              Max Score
            </label>
            <input
              type="number"
              min="0"
              step="0.01"
              value={form.max_score}
              onChange={(e) => onChange({ ...form, max_score: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#F59E0B]"
              placeholder="Max"
            />
          </div>
        </div>

        <div>
          <label className="block text-xs font-medium text-gray-700 mb-1">
            Feedback
          </label>
          <textarea
            value={form.feedback}
            onChange={(e) => onChange({ ...form, feedback: e.target.value })}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#F59E0B]"
            placeholder="Provide feedback..."
            rows={3}
          />
        </div>
      </div>

      <div className="flex gap-2 mt-4">
        <button
          onClick={onSave}
          disabled={saving || !form.score || !form.max_score}
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
