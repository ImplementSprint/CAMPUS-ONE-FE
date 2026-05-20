import { supabase } from "@/shared/lib/supabase";

const facultyDb = supabase.schema("faculty");

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

// ─── Professor Classes ────────────────────────────────────────────────────────

export async function getProfessorClasses(professorId: string) {
  const { data, error } = await facultyDb
    .from("class_assignments")
    .select(`
      id,
      section,
      schedule,
      room,
      max_students,
      subjects (
        id,
        code,
        name,
        description,
        units,
        semester,
        school_year
      )
    `)
    .eq("professor_id", professorId)
    .eq("is_active", true)
    .order("created_at", { ascending: false });

  if (error) {
    console.error("Error fetching classes:", error);
    return { data: null, error };
  }

  // Count enrollments for each class
  const classesWithCount = await Promise.all(
    (data || []).map(async (classItem: any) => {
      const { count } = await facultyDb
        .from("class_enrollments")
        .select("*", { count: "exact", head: true })
        .eq("class_assignment_id", classItem.id)
        .eq("enrollment_status", "enrolled");

      return {
        id: classItem.id,
        subject: classItem.subjects,
        section: classItem.section,
        schedule: classItem.schedule,
        room: classItem.room,
        max_students: classItem.max_students,
        enrolled_count: count || 0,
      };
    })
  );

  return { data: classesWithCount, error: null };
}

// ─── Class Students ───────────────────────────────────────────────────────────

export async function getClassStudents(classId: string) {
  const { data, error } = await facultyDb
    .from("class_enrollments")
    .select(`
      id,
      enrollment_status,
      enrolled_at,
      student_accounts (
        id,
        email,
        student_number,
        applicant_id,
        applicant.applicant_profiles (
          full_name
        )
      )
    `)
    .eq("class_assignment_id", classId)
    .eq("enrollment_status", "enrolled")
    .order("enrolled_at", { ascending: true });

  if (error) {
    console.error("Error fetching students:", error);
    return { data: null, error };
  }

  const students = (data || []).map((enrollment: any) => ({
    id: enrollment.id,
    student: {
      id: enrollment.student_accounts.id,
      email: enrollment.student_accounts.email,
      student_number: enrollment.student_accounts.student_number,
      name: enrollment.student_accounts.applicant_profiles?.full_name || "N/A",
      applicant_id: enrollment.student_accounts.applicant_id,
    },
    enrollment_status: enrollment.enrollment_status,
    enrolled_at: enrollment.enrolled_at,
  }));

  return { data: students, error: null };
}

// ─── Grades ───────────────────────────────────────────────────────────────────

export async function getClassGrades(classId: string) {
  const { data: enrollments, error } = await facultyDb
    .from("class_enrollments")
    .select(`
      id,
      student_accounts (
        id,
        student_number,
        applicant.applicant_profiles (
          full_name
        )
      ),
      grades (
        id,
        prelim_grade,
        midterm_grade,
        finals_grade,
        final_grade,
        letter_grade,
        remarks,
        is_locked
      )
    `)
    .eq("class_assignment_id", classId)
    .eq("enrollment_status", "enrolled");

  if (error) {
    console.error("Error fetching grades:", error);
    return { data: null, error };
  }

  const grades = (enrollments || []).map((enrollment: any) => ({
    id: enrollment.grades?.[0]?.id || null,
    enrollment_id: enrollment.id,
    student_name: enrollment.student_accounts.applicant_profiles?.full_name || "N/A",
    student_number: enrollment.student_accounts.student_number,
    prelim_grade: enrollment.grades?.[0]?.prelim_grade || null,
    midterm_grade: enrollment.grades?.[0]?.midterm_grade || null,
    finals_grade: enrollment.grades?.[0]?.finals_grade || null,
    final_grade: enrollment.grades?.[0]?.final_grade || null,
    letter_grade: enrollment.grades?.[0]?.letter_grade || null,
    remarks: enrollment.grades?.[0]?.remarks || null,
    is_locked: enrollment.grades?.[0]?.is_locked || false,
  }));

  return { data: grades, error: null };
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
  // Check if grade exists
  const { data: existing } = await facultyDb
    .from("grades")
    .select("id")
    .eq("enrollment_id", enrollmentId)
    .single();

  if (existing) {
    // Update existing grade
    const { data, error } = await facultyDb
      .from("grades")
      .update({
        ...gradeData,
        encoded_by: professorId,
        encoded_at: new Date().toISOString(),
      })
      .eq("id", existing.id)
      .select()
      .single();

    return { data, error };
  } else {
    // Insert new grade
    const { data, error } = await facultyDb
      .from("grades")
      .insert({
        enrollment_id: enrollmentId,
        professor_id: professorId,
        ...gradeData,
        encoded_by: professorId,
        encoded_at: new Date().toISOString(),
      })
      .select()
      .single();

    return { data, error };
  }
}

// ─── Announcements ────────────────────────────────────────────────────────────

export async function getClassAnnouncements(classId: string) {
  const { data, error } = await supabase
    .from("announcements")
    .select("*")
    .eq("class_assignment_id", classId)
    .eq("is_published", true)
    .order("is_pinned", { ascending: false })
    .order("created_at", { ascending: false });

  return { data, error };
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
  const { data, error } = await supabase
    .from("announcements")
    .insert({
      class_assignment_id: classId,
      professor_id: professorId,
      ...announcementData,
    })
    .select()
    .single();

  if (error || !data) {
    return { data, error };
  }

  const { data: classStudents, error: studentsError } = await getClassStudents(classId);

  if (studentsError) {
    console.error("Error fetching students for announcement notifications:", studentsError);
    return { data, error: null };
  }

  const notificationRows = (classStudents || [])
    .map((entry: any) => entry?.student?.applicant_id)
    .filter(Boolean)
    .map((profileId: string) => ({
      profile_id: profileId,
      title: `New announcement: ${announcementData.title}`,
      body: announcementData.content,
      is_read: false,
    }));

  if (notificationRows.length) {
    const { error: notificationError } = await supabase.from("notifications").insert(notificationRows);

    if (notificationError) {
      console.error("Error creating announcement notifications:", notificationError);
    }
  }

  return { data, error: null };
}

export async function updateAnnouncement(
  announcementId: string,
  updates: {
    title?: string;
    content?: string;
    announcement_type?: string;
    is_pinned?: boolean;
  }
) {
  const { data, error } = await supabase
    .from("announcements")
    .update({
      ...updates,
      updated_at: new Date().toISOString(),
    })
    .eq("id", announcementId)
    .select()
    .single();

  return { data, error };
}

export async function deleteAnnouncement(announcementId: string) {
  const { error } = await supabase
    .from("announcements")
    .delete()
    .eq("id", announcementId);

  return { error };
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
