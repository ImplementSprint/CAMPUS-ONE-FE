'use client'
import { useState, useEffect } from "react";
import { ArrowLeft, BookOpen, Users, Clock, MapPin } from "lucide-react";
import { getProfessorClasses, type ClassAssignment } from "../services/professor.service";

interface ClassListProps {
  professorId: string;
  onViewClass: (classId: string) => void;
  onBack: () => void;
}

export function ClassList({ professorId, onViewClass, onBack }: ClassListProps) {
  const [classes, setClasses] = useState<ClassAssignment[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadClasses();
  }, [professorId]);

  const loadClasses = async () => {
    setLoading(true);
    const result = await getProfessorClasses(professorId);
    if (result.data) {
      setClasses(result.data);
    }
    setLoading(false);
  };

  return (
    <div className="px-4 py-6 space-y-4">
      {/* Header */}
      <div className="flex items-center gap-3">
        <button
          onClick={onBack}
          className="w-8 h-8 flex items-center justify-center rounded-lg hover:bg-gray-200 transition-colors"
        >
          <ArrowLeft className="w-5 h-5 text-gray-600" />
        </button>
        <div>
          <h1 className="text-lg font-bold text-gray-900">My Classes</h1>
          <p className="text-xs text-gray-600">{classes.length} class{classes.length !== 1 ? "es" : ""}</p>
        </div>
      </div>

      {/* Loading */}
      {loading ? (
        <div className="text-center py-12">
          <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-[#F59E0B] mx-auto"></div>
          <p className="text-sm text-gray-600 mt-3">Loading classes...</p>
        </div>
      ) : classes.length === 0 ? (
        <div className="bg-white rounded-xl p-8 text-center border border-gray-100">
          <BookOpen className="w-12 h-12 text-gray-400 mx-auto mb-3" />
          <p className="text-sm font-medium text-gray-900 mb-1">No Classes Assigned</p>
          <p className="text-xs text-gray-600">You don't have any classes assigned yet.</p>
        </div>
      ) : (
        <div className="space-y-3">
          {classes.map((classItem) => (
            <button
              key={classItem.id}
              onClick={() => onViewClass(classItem.id)}
              className="w-full bg-white rounded-xl p-4 border border-gray-100 hover:bg-gray-50 active:bg-gray-100 transition-colors text-left"
            >
              {/* Subject Info */}
              <div className="flex items-start justify-between mb-3">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="px-2 py-0.5 bg-[#F59E0B]/10 text-[#F59E0B] rounded text-xs font-bold">
                      {classItem.subject.code}
                    </span>
                    <span className="text-xs text-gray-500">Section {classItem.section}</span>
                  </div>
                  <h3 className="text-sm font-bold text-gray-900">{classItem.subject.name}</h3>
                  <p className="text-xs text-gray-600 mt-1">{classItem.subject.description}</p>
                </div>
              </div>

              {/* Class Details */}
              <div className="grid grid-cols-2 gap-2 text-xs">
                <div className="flex items-center gap-1.5 text-gray-600">
                  <Users className="w-3.5 h-3.5" />
                  <span>{classItem.enrolled_count}/{classItem.max_students} students</span>
                </div>
                <div className="flex items-center gap-1.5 text-gray-600">
                  <Clock className="w-3.5 h-3.5" />
                  <span>{classItem.schedule}</span>
                </div>
                <div className="flex items-center gap-1.5 text-gray-600">
                  <MapPin className="w-3.5 h-3.5" />
                  <span>{classItem.room}</span>
                </div>
                <div className="flex items-center gap-1.5 text-gray-600">
                  <BookOpen className="w-3.5 h-3.5" />
                  <span>{classItem.subject.units} units</span>
                </div>
              </div>

              {/* Semester Info */}
              <div className="mt-3 pt-3 border-t border-gray-100">
                <p className="text-xs text-gray-500">
                  {classItem.subject.semester} • {classItem.subject.school_year}
                </p>
              </div>
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
