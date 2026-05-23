'use client'
import { useState, useEffect } from "react";
import { ArrowLeft, Users, ClipboardList, Bell, FileText } from "lucide-react";
import { getProfessorClasses, type ClassAssignment } from "@/professor/services/professor.service";
import { StudentList } from "./StudentList";
import { GradesList } from "./GradesList";
import { AnnouncementList } from "./AnnouncementList";
import { SubmissionList } from "./SubmissionList";

interface ClassDetailProps {
  classId: string;
  professorId: string;
  onBack: () => void;
}

type Tab = "students" | "grades" | "announcements" | "submissions";

export function ClassDetail({ classId, professorId, onBack }: ClassDetailProps) {
  const [activeTab, setActiveTab] = useState<Tab>("students");
  const [classInfo, setClassInfo] = useState<ClassAssignment | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadClassInfo();
  }, [classId]);

  const loadClassInfo = async () => {
    setLoading(true);
    const result = await getProfessorClasses(professorId);
    if (result.data) {
      const found = result.data.find((c) => c.id === classId);
      if (found) {
        setClassInfo(found);
      }
    }
    setLoading(false);
  };

  if (loading) {
    return (
      <div className="px-4 py-6">
        <div className="text-center py-12">
          <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-[#F59E0B] mx-auto"></div>
          <p className="text-sm text-gray-600 mt-3">Loading class...</p>
        </div>
      </div>
    );
  }

  if (!classInfo) {
    return (
      <div className="px-4 py-6">
        <div className="bg-white rounded-xl p-8 text-center border border-gray-100">
          <p className="text-sm text-gray-600">Class not found</p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-full">
      {/* Header */}
      <div className="px-4 py-4 bg-white border-b border-gray-100 flex-shrink-0">
        <div className="flex items-center gap-3 mb-3">
          <button
            onClick={onBack}
            className="w-8 h-8 flex items-center justify-center rounded-lg hover:bg-gray-100 transition-colors"
          >
            <ArrowLeft className="w-5 h-5 text-gray-600" />
          </button>
          <div className="flex-1">
            <div className="flex items-center gap-2 mb-1">
              <span className="px-2 py-0.5 bg-[#F59E0B]/10 text-[#F59E0B] rounded text-xs font-bold">
                {classInfo.subject.code}
              </span>
              <span className="text-xs text-gray-500">Section {classInfo.section}</span>
            </div>
            <h1 className="text-base font-bold text-gray-900">{classInfo.subject.name}</h1>
          </div>
        </div>

        {/* Tabs */}
        <div className="flex gap-1 overflow-x-auto">
          <TabButton
            active={activeTab === "students"}
            onClick={() => setActiveTab("students")}
            icon={<Users className="w-4 h-4" />}
            label="Students"
          />
          <TabButton
            active={activeTab === "grades"}
            onClick={() => setActiveTab("grades")}
            icon={<ClipboardList className="w-4 h-4" />}
            label="Grades"
          />
          <TabButton
            active={activeTab === "announcements"}
            onClick={() => setActiveTab("announcements")}
            icon={<Bell className="w-4 h-4" />}
            label="Announcements"
          />
          <TabButton
            active={activeTab === "submissions"}
            onClick={() => setActiveTab("submissions")}
            icon={<FileText className="w-4 h-4" />}
            label="Submissions"
          />
        </div>
      </div>

      {/* Tab Content */}
      <div className="flex-1 overflow-y-auto">
        {activeTab === "students" && (
          <StudentList classId={classId} professorId={professorId} />
        )}
        {activeTab === "grades" && (
          <GradesList classId={classId} professorId={professorId} />
        )}
        {activeTab === "announcements" && (
          <AnnouncementList classId={classId} professorId={professorId} />
        )}
        {activeTab === "submissions" && (
          <SubmissionList classId={classId} professorId={professorId} />
        )}
      </div>
    </div>
  );
}

function TabButton({
  active,
  onClick,
  icon,
  label,
}: {
  active: boolean;
  onClick: () => void;
  icon: React.ReactNode;
  label: string;
}) {
  return (
    <button
      onClick={onClick}
      className={`flex items-center gap-1.5 px-3 py-2 rounded-lg text-xs font-medium transition-colors whitespace-nowrap ${
        active
          ? "bg-[#F59E0B] text-white"
          : "bg-gray-100 text-gray-600 hover:bg-gray-200"
      }`}
    >
      {icon}
      <span>{label}</span>
    </button>
  );
}
