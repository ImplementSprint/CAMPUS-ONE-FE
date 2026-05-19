'use client'
import { useState, useEffect } from "react";
import { Users, Mail, Hash } from "lucide-react";
import { getClassStudents, type Enrollment } from "../services/professor.service";

interface StudentListProps {
  classId: string;
}

export function StudentList({ classId }: StudentListProps) {
  const [students, setStudents] = useState<Enrollment[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadStudents();
  }, [classId]);

  const loadStudents = async () => {
    setLoading(true);
    const result = await getClassStudents(classId);
    if (result.data) {
      setStudents(result.data);
    }
    setLoading(false);
  };

  if (loading) {
    return (
      <div className="px-4 py-6">
        <div className="text-center py-12">
          <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-[#F59E0B] mx-auto"></div>
          <p className="text-sm text-gray-600 mt-3">Loading students...</p>
        </div>
      </div>
    );
  }

  if (students.length === 0) {
    return (
      <div className="px-4 py-6">
        <div className="bg-white rounded-xl p-8 text-center border border-gray-100">
          <Users className="w-12 h-12 text-gray-400 mx-auto mb-3" />
          <p className="text-sm font-medium text-gray-900 mb-1">No Students Enrolled</p>
          <p className="text-xs text-gray-600">This class doesn't have any enrolled students yet.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="px-4 py-4 space-y-3">
      <div className="flex items-center justify-between">
        <h2 className="text-sm font-bold text-gray-900">
          Enrolled Students ({students.length})
        </h2>
      </div>

      <div className="space-y-2">
        {students.map((enrollment, index) => (
          <div
            key={enrollment.id}
            className="bg-white rounded-xl p-4 border border-gray-100"
          >
            <div className="flex items-start gap-3">
              <div className="w-10 h-10 bg-[#F59E0B]/10 rounded-full flex items-center justify-center flex-shrink-0">
                <span className="text-sm font-bold text-[#F59E0B]">
                  {index + 1}
                </span>
              </div>
              <div className="flex-1 min-w-0">
                <h3 className="text-sm font-bold text-gray-900 mb-2">
                  {enrollment.student.name}
                </h3>
                <div className="space-y-1">
                  <div className="flex items-center gap-2 text-xs text-gray-600">
                    <Hash className="w-3.5 h-3.5 flex-shrink-0" />
                    <span className="truncate">{enrollment.student.student_number}</span>
                  </div>
                  <div className="flex items-center gap-2 text-xs text-gray-600">
                    <Mail className="w-3.5 h-3.5 flex-shrink-0" />
                    <span className="truncate">{enrollment.student.email}</span>
                  </div>
                </div>
                <div className="mt-2 pt-2 border-t border-gray-100">
                  <p className="text-xs text-gray-500">
                    Enrolled: {new Date(enrollment.enrolled_at).toLocaleDateString()}
                  </p>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
