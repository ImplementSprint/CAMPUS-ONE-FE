import { supabase } from "@/lib/supabase";

const studentDb = supabase.schema("student");

// ─── Types ────────────────────────────────────────────────────────────────────

export interface StudentRecord {
  id: string;
  email: string;
  student_number: string;
  applicant_id: string;
  enrollment_status: string;
  enrolled_at: string;
  full_name: string;
  school_level: string;
  applicant_type: string;
  mobile_number?: string;
  address?: string;
}

export interface StudentStats {
  total: number;
  active: number;
  inactive: number;
  pending: number;
}

// ─── Fetch Student Stats ──────────────────────────────────────────────────────

export async function fetchStudentStats() {
  try {
    // Total students
    const { count: total } = await studentDb
      .from("student_accounts")
      .select("*", { count: "exact", head: true });

    // Active students
    const { count: active } = await studentDb
      .from("student_accounts")
      .select("*", { count: "exact", head: true })
      .eq("enrollment_status", "active");

    // Inactive students
    const { count: inactive } = await studentDb
      .from("student_accounts")
      .select("*", { count: "exact", head: true })
      .eq("enrollment_status", "inactive");

    // Pending activation
    const { count: pending } = await studentDb
      .from("student_accounts")
      .select("*", { count: "exact", head: true })
      .is("password_hash", null);

    return {
      data: {
        total: total || 0,
        active: active || 0,
        inactive: inactive || 0,
        pending: pending || 0,
      },
      error: null,
    };
  } catch (error: any) {
    return { data: null, error };
  }
}

// ─── Fetch All Students ───────────────────────────────────────────────────────

export async function fetchAllStudents() {
  try {
    const { data, error } = await studentDb
      .from("student_accounts")
      .select(`
        id,
        email,
        student_number,
        applicant_id,
        enrollment_status,
        enrolled_at,
            applicant.applicant_profiles (
          full_name,
          school_level,
          applicant_type,
          mobile_number,
          address
        )
      `)
      .order("enrolled_at", { ascending: false });

    if (error) throw error;

    const students: StudentRecord[] = (data || []).map((student: any) => ({
      id: student.id,
      email: student.email,
      student_number: student.student_number,
      applicant_id: student.applicant_id,
      enrollment_status: student.enrollment_status,
      enrolled_at: student.enrolled_at,
      full_name: student.applicant_profiles?.full_name || "N/A",
      school_level: student.applicant_profiles?.school_level || "N/A",
      applicant_type: student.applicant_profiles?.applicant_type || "N/A",
      mobile_number: student.applicant_profiles?.mobile_number,
      address: student.applicant_profiles?.address,
    }));

    return { data: students, error: null };
  } catch (error: any) {
    return { data: null, error };
  }
}

// ─── Fetch Student Details ────────────────────────────────────────────────────

export async function fetchStudentDetails(studentId: string) {
  try {
    const { data, error } = await studentDb
      .from("student_accounts")
      .select(`
        *,
        applicant.applicant_profiles (*)
      `)
      .eq("id", studentId)
      .single();

    if (error) throw error;

    return { data, error: null };
  } catch (error: any) {
    return { data: null, error };
  }
}

// ─── Activate Student Account ─────────────────────────────────────────────────

export async function activateStudentAccount(studentId: string) {
  try {
    const { data, error} = await studentDb
      .from("student_accounts")
      .update({
        enrollment_status: "active",
      })
      .eq("id", studentId)
      .select()
      .single();

    if (error) throw error;

    return { data, error: null };
  } catch (error: any) {
    return { data: null, error };
  }
}

// ─── Deactivate Student Account ───────────────────────────────────────────────

export async function deactivateStudentAccount(studentId: string) {
  try {
    const { data, error } = await studentDb
      .from("student_accounts")
      .update({
        enrollment_status: "inactive",
      })
      .eq("id", studentId)
      .select()
      .single();

    if (error) throw error;

    return { data, error: null };
  } catch (error: any) {
    return { data: null, error };
  }
}

// ─── Update Student Information ───────────────────────────────────────────────

export async function updateStudentInfo(studentId: string, updates: any) {
  try {
    const { data, error } = await studentDb
      .from("student_accounts")
      .update(updates)
      .eq("id", studentId)
      .select()
      .single();

    if (error) throw error;

    return { data, error: null };
  } catch (error: any) {
    return { data: null, error };
  }
}
