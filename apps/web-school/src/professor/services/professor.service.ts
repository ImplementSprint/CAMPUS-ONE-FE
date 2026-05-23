import { buildTenantHeaders, getSchoolSlugFromHost } from "@campus-one/api-client";
import { supabase } from "@/shared/lib/supabase";

const facultyDb = supabase.schema("faculty");
const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:4000";

// ─── Types ────────────────────────────────────────────────────────────────────

export interface Subject {
  id: string;
  code: string;
  name: string;
  description: string;
  units: number;
  semester: string;
  school_year: string;
}

export interface ClassAssignment {
  id: string;
  subject: Subject;
  section: string;
  schedule: string;
  room: string;
  max_students: number;
  enrolled_count: number;
}

export interface Student {
  id: string;
  email: string;
  student_number: string;
  name: string;
  applicant_id: string;
}

export interface Enrollment {
  id: string;
  student: Student;
  enrollment_status: string;
  enrolled_at: string;
}

export interface Grade {
  id: string;
  enrollment_id: string;
  student_name: string;
  student_number: string;
  prelim_grade: number | null;
  midterm_grade: number | null;
  finals_grade: number | null;
  final_grade: number | null;
  letter_grade: string | null;
  remarks: string | null;
  is_locked: boolean;
}

export interface Announcement {
  id: string;
  title: string;
  content: string;
  announcement_type: string;
  is_pinned: boolean;
  created_at: string;
  updated_at: string;
}

export interface Submission {
  id: string;
  student_name: string;
  student_number: string;
  title: string;
  description: string;
  file_url: string;
  file_name: string;
  submission_type: string;
  status: string;
  score: number | null;
  max_score: number | null;
  feedback: string | null;
  submitted_at: string;
  is_late: boolean;
}

function getSelectedSchoolSlug(): string | null {
  if (typeof window === "undefined") {
    return process.env.NEXT_PUBLIC_SCHOOL_SLUG ?? null;
  }

  const fromQuery = new URLSearchParams(window.location.search).get("school");
  if (fromQuery) return fromQuery;

  const fromHost = getSchoolSlugFromHost(
    window.location.hostname,
    process.env.NEXT_PUBLIC_SCHOOL_PORTAL_DOMAIN,
  );
  if (fromHost) return fromHost;

  const stored = window.localStorage.getItem("campus-one:selected-school");
  if (!stored) return null;

  try {
    return JSON.parse(stored).schoolSlug ?? null;
  } catch {
    return null;
  }
}

async function backendRequest<T>(path: string, init: RequestInit = {}) {
  const response = await fetch(`${API_BASE_URL}${path}`, {
    ...init,
    headers: {
      "Content-Type": "application/json",
      ...buildTenantHeaders(getSelectedSchoolSlug()),
      ...init.headers,
    },
  });
  const payload = await response.json().catch(() => null) as T | null;

  if (!response.ok) {
    return {
      data: null,
      error: {
        message: (payload as any)?.message ?? (payload as any)?.error ?? "Backend request failed",
      },
    };
  }

  return { data: payload, error: null };
}

// ─── Professor Classes ────────────────────────────────────────────────────────

export async function getProfessorClasses(professorId: string) {
  const result = await backendRequest<{
    classes: Array<{
      id: string;
      section: string | null;
      schedule: string | null;
      room: string | null;
      max_students: number | null;
      enrolled_count: number | null;
      subject: Partial<Subject> | null;
    }>;
  }>(`/api/professor/${encodeURIComponent(professorId)}/classes`);

  if (result.error || !result.data) {
    return { data: null, error: result.error };
  }

  return {
    data: result.data.classes.map((classItem) => ({
      id: classItem.id,
      subject: {
        id: classItem.subject?.id ?? "",
        code: classItem.subject?.code ?? "",
        name: classItem.subject?.name ?? "",
        description: classItem.subject?.description ?? "",
        units: classItem.subject?.units ?? 0,
        semester: classItem.subject?.semester ?? "",
        school_year: classItem.subject?.school_year ?? "",
      },
      section: classItem.section ?? "",
      schedule: classItem.schedule ?? "",
      room: classItem.room ?? "",
      max_students: classItem.max_students ?? 0,
      enrolled_count: classItem.enrolled_count ?? 0,
    })),
    error: null,
  };
}

export async function getProfessorSchedule(professorId: string) {
  const result = await backendRequest<{
    schedule: Array<{
      classId: string;
      section: string | null;
      schedule: string | null;
      room: string | null;
      max_students: number | null;
      enrolled_count: number | null;
      subject: Partial<Subject> | null;
    }>;
  }>(`/api/professor/${encodeURIComponent(professorId)}/schedule`);

  if (result.error || !result.data) {
    return { data: null, error: result.error };
  }

  return {
    data: result.data.schedule.map((classItem) => ({
      id: classItem.classId,
      subject: {
        id: classItem.subject?.id ?? "",
        code: classItem.subject?.code ?? "",
        name: classItem.subject?.name ?? "",
        description: classItem.subject?.description ?? "",
        units: classItem.subject?.units ?? 0,
        semester: classItem.subject?.semester ?? "",
        school_year: classItem.subject?.school_year ?? "",
      },
      section: classItem.section ?? "",
      schedule: classItem.schedule ?? "",
      room: classItem.room ?? "",
      max_students: classItem.max_students ?? 0,
      enrolled_count: classItem.enrolled_count ?? 0,
    })),
    error: null,
  };
}

// ─── Class Students ───────────────────────────────────────────────────────────

export async function getClassStudents(classId: string, professorId: string) {
  const result = await backendRequest<{
    students: Array<{
      enrollmentId: string;
      status: string | null;
      enrolledAt: string | null;
      student: {
        id: string | null;
        email: string | null;
        studentNumber: string | null;
        name: string | null;
        applicantId: string | null;
      } | null;
    }>;
  }>(`/api/professor/${encodeURIComponent(professorId)}/classes/${encodeURIComponent(classId)}/roster`);

  if (result.error || !result.data) {
    return { data: null, error: result.error };
  }

  return {
    data: result.data.students.map((enrollment) => ({
      id: enrollment.enrollmentId,
      student: {
        id: enrollment.student?.id ?? "",
        email: enrollment.student?.email ?? "",
        student_number: enrollment.student?.studentNumber ?? "",
        name: enrollment.student?.name ?? "Student",
        applicant_id: enrollment.student?.applicantId ?? "",
      },
      enrollment_status: enrollment.status ?? "enrolled",
      enrolled_at: enrollment.enrolledAt ?? new Date(0).toISOString(),
    })),
    error: null,
  };
}

// ─── Grades ───────────────────────────────────────────────────────────────────

export async function getClassGrades(classId: string, professorId: string) {
  const result = await backendRequest<{
    students: Array<{
      enrollmentId: string;
      studentId: string;
      studentNumber: string | null;
      applicantId: string | null;
      grade: any;
    }>;
  }>(`/api/grades/professor/${encodeURIComponent(professorId)}/class/${encodeURIComponent(classId)}`);

  if (result.error || !result.data) return { data: null, error: result.error };

  return {
    data: result.data.students.map((student) => ({
      id: student.grade?.id || null,
      enrollment_id: student.enrollmentId,
      student_name: student.studentNumber || student.applicantId || "Student",
      student_number: student.studentNumber || "N/A",
      prelim_grade: student.grade?.prelim_grade ?? null,
      midterm_grade: student.grade?.midterm_grade ?? null,
      finals_grade: student.grade?.finals_grade ?? null,
      final_grade: student.grade?.final_grade ?? null,
      letter_grade: student.grade?.letter_grade ?? null,
      remarks: student.grade?.remarks ?? null,
      is_locked: student.grade?.is_locked ?? false,
    })),
    error: null,
  };
}

export async function saveGrade(
  enrollmentId: string,
  professorId: string,
  gradeData: {
    prelim_grade?: number;
    midterm_grade?: number;
    finals_grade?: number;
    remarks?: string;
  }
) {
  return backendRequest("/api/grades/professor/save", {
    method: "POST",
    body: JSON.stringify({
      enrollmentId,
      professorId,
      prelimGrade: gradeData.prelim_grade,
      midtermGrade: gradeData.midterm_grade,
      finalsGrade: gradeData.finals_grade,
      remarks: gradeData.remarks,
    }),
  });
}

// ─── Announcements ────────────────────────────────────────────────────────────

export async function submitGrade(
  enrollmentId: string,
  professorId: string,
  gradeData: {
    prelim_grade?: number | null;
    midterm_grade?: number | null;
    finals_grade?: number | null;
    final_grade?: number | null;
    letter_grade?: string | null;
    remarks?: string | null;
  }
) {
  const finalGrade = gradeData.final_grade ?? computeFinalGrade([
    gradeData.prelim_grade,
    gradeData.midterm_grade,
    gradeData.finals_grade,
  ]);

  if (finalGrade == null) {
    return {
      data: null,
      error: { message: "At least one numeric grade is required before submission." },
    };
  }

  return backendRequest("/api/grades/professor/submit", {
    method: "POST",
    body: JSON.stringify({
      enrollmentId,
      professorId,
      prelimGrade: gradeData.prelim_grade,
      midtermGrade: gradeData.midterm_grade,
      finalsGrade: gradeData.finals_grade,
      finalGrade,
      letterGrade: gradeData.letter_grade ?? toLetterGrade(finalGrade),
      remarks: gradeData.remarks ?? (finalGrade >= 75 ? "Passed" : "Failed"),
    }),
  });
}

function computeFinalGrade(values: Array<number | null | undefined>) {
  const numericValues = values.filter((value): value is number => typeof value === "number" && Number.isFinite(value));
  if (!numericValues.length) return null;
  return Number((numericValues.reduce((sum, value) => sum + value, 0) / numericValues.length).toFixed(2));
}

function toLetterGrade(finalGrade: number) {
  if (finalGrade >= 90) return "A";
  if (finalGrade >= 85) return "B+";
  if (finalGrade >= 80) return "B";
  if (finalGrade >= 75) return "C";
  return "F";
}

export async function getClassAnnouncements(classId: string, professorId: string) {
  const result = await backendRequest<{ announcements: Announcement[] }>(
    `/api/professor/${encodeURIComponent(professorId)}/classes/${encodeURIComponent(classId)}/announcements`,
  );

  if (result.error || !result.data) return { data: null, error: result.error };

  return { data: result.data.announcements, error: null };
}

export async function createAnnouncement(
  classId: string,
  professorId: string,
  announcementData: {
    title: string;
    content: string;
    announcement_type?: string;
    is_pinned?: boolean;
  }
) {
  const result = await backendRequest<{ announcement: Announcement }>(
    `/api/professor/${encodeURIComponent(professorId)}/classes/${encodeURIComponent(classId)}/announcements`,
    {
      method: "POST",
      body: JSON.stringify(announcementData),
    },
  );

  if (result.error || !result.data) return { data: null, error: result.error };

  return { data: result.data.announcement, error: null };
}

export async function updateAnnouncement(
  announcementId: string,
  professorId: string,
  updates: {
    title?: string;
    content?: string;
    announcement_type?: string;
    is_pinned?: boolean;
  }
) {
  const result = await backendRequest<{ announcement: Announcement }>(
    `/api/professor/${encodeURIComponent(professorId)}/announcements/${encodeURIComponent(announcementId)}`,
    {
      method: "PATCH",
      body: JSON.stringify(updates),
    },
  );

  if (result.error || !result.data) return { data: null, error: result.error };

  return { data: result.data.announcement, error: null };
}

export async function deleteAnnouncement(announcementId: string, professorId: string) {
  const result = await backendRequest<{ deleted: boolean }>(
    `/api/professor/${encodeURIComponent(professorId)}/announcements/${encodeURIComponent(announcementId)}`,
    { method: "DELETE" },
  );

  return { error: result.error };
}

// ─── Submissions ──────────────────────────────────────────────────────────────

export async function getClassSubmissions(classId: string) {
  const { data, error } = await supabase
    .from("submissions")
    .select(`
      *,
      student_accounts (
        student_number,
        applicant_profiles (
          full_name
        )
      )
    `)
    .eq("class_assignment_id", classId)
    .order("submitted_at", { ascending: false });

  if (error) {
    console.error("Error fetching submissions:", error);
    return { data: null, error };
  }

  const submissions = (data || []).map((sub: any) => ({
    id: sub.id,
    student_name: sub.student_accounts.applicant_profiles?.full_name || "N/A",
    student_number: sub.student_accounts.student_number,
    title: sub.title,
    description: sub.description,
    file_url: sub.file_url,
    file_name: sub.file_name,
    submission_type: sub.submission_type,
    status: sub.status,
    score: sub.score,
    max_score: sub.max_score,
    feedback: sub.feedback,
    submitted_at: sub.submitted_at,
    is_late: sub.is_late,
  }));

  return { data: submissions, error: null };
}

export async function gradeSubmission(
  submissionId: string,
  professorId: string,
  gradeData: {
    score: number;
    max_score: number;
    feedback?: string;
    status?: string;
  }
) {
  const { data, error } = await supabase
    .from("submissions")
    .update({
      ...gradeData,
      status: gradeData.status || "graded",
      graded_by: professorId,
      graded_at: new Date().toISOString(),
    })
    .eq("id", submissionId)
    .select()
    .single();

  return { data, error };
}

// ─── Dashboard Stats ──────────────────────────────────────────────────────────

export async function getProfessorStats(professorId: string) {
  // Total classes
  const { count: totalClasses } = await supabase
    .from("class_assignments")
    .select("*", { count: "exact", head: true })
    .eq("professor_id", professorId)
    .eq("is_active", true);

  // Total students across all classes
  const { data: classes } = await supabase
    .from("class_assignments")
    .select("id")
    .eq("professor_id", professorId)
    .eq("is_active", true);

  let totalStudents = 0;
  if (classes) {
    for (const cls of classes) {
      const { count } = await supabase
        .from("class_enrollments")
        .select("*", { count: "exact", head: true })
        .eq("class_assignment_id", cls.id)
        .eq("enrollment_status", "enrolled");
      totalStudents += count || 0;
    }
  }

  // Pending submissions
  const classIds = classes?.map((c) => c.id) || [];
  const { count: pendingSubmissions } = await supabase
    .from("submissions")
    .select("*", { count: "exact", head: true })
    .in("class_assignment_id", classIds)
    .eq("status", "submitted");

  return {
    data: {
      totalClasses: totalClasses || 0,
      totalStudents,
      pendingSubmissions: pendingSubmissions || 0,
    },
    error: null,
  };
}
