import { supabase } from '@/lib/supabase';

// ─── Types ────────────────────────────────────────────────────────────────────

export interface StudentRecord {
  id: string;
  email: string;
  student_number: string;
  applicant_id: string;
  enrollment_status: string;
  enrolled_at: string;
  password_hash?: string | null;
  full_name: string;
  school_level: string;
  applicant_type: string;
  mobile_number?: string;
  address?: string;
  birthdate?: string;
  program?: string;
}

export interface StudentStats {
  total: number;
  active: number;
  inactive: number;
  pending: number;
}

export interface EnrollmentRecord {
  id: string;
  student_number: string;
  full_name: string;
  email: string;
  school_level: string;
  enrollment_status: string;
  enrolled_at: string;
  subjects_count: number;
}

export interface GradeRecord {
  student_number: string;
  full_name: string;
  subject_code: string;
  subject_name: string;
  units: number;
  grade: string | null;
  remarks: string | null;
  semester: string;
  school_year: string;
}

export interface HonorsRecord {
  student_number: string;
  full_name: string;
  email: string;
  gwa: number;
  honors_title: string;
  school_level: string;
}

export interface DeficiencyRecord {
  student_number: string;
  full_name: string;
  email: string;
  subject_code: string;
  subject_name: string;
  grade: string | null;
  remarks: string | null;
}

export interface SubjectRecord {
  id: string;
  subject_code: string;
  subject_name: string;
  units: number;
  description?: string;
  prerequisites?: string;
  department?: string;
}

export interface ServiceRequest {
  id: string;
  student_number: string;
  full_name: string;
  email: string;
  request_type: string;
  status: string;
  created_at: string;
  details?: string;
}

// ─── Fetch Student Stats ──────────────────────────────────────────────────────

export async function fetchStudentStats() {
  try {
    const [total, active, inactive, pending] = await Promise.all([
      supabase.from('student_accounts').select('*', { count: 'exact', head: true }),
      supabase.from('student_accounts').select('*', { count: 'exact', head: true }).eq('enrollment_status', 'active'),
      supabase.from('student_accounts').select('*', { count: 'exact', head: true }).eq('enrollment_status', 'inactive'),
      supabase.from('student_accounts').select('*', { count: 'exact', head: true }).is('password_hash', null),
    ]);

    return {
      data: {
        total: total.count ?? 0,
        active: active.count ?? 0,
        inactive: inactive.count ?? 0,
        pending: pending.count ?? 0,
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
    const { data, error } = await supabase
      .from('student_accounts')
      .select(`
        id,
        email,
        student_number,
        applicant_id,
        enrollment_status,
        enrolled_at,
        password_hash,
        applicant_profiles (
          full_name,
          school_level,
          applicant_type,
          mobile_number,
          address,
          birthdate,
          program
        )
      `)
      .order('enrolled_at', { ascending: false });

    if (error) throw error;

    const students: StudentRecord[] = (data ?? []).map((s: any) => {
      // applicant_profiles can be array or object depending on Supabase version
      const profile = Array.isArray(s.applicant_profiles)
        ? s.applicant_profiles[0]
        : s.applicant_profiles;
      return {
        id: s.id,
        email: s.email,
        student_number: s.student_number,
        applicant_id: s.applicant_id,
        enrollment_status: s.enrollment_status ?? 'pending',
        enrolled_at: s.enrolled_at,
        password_hash: s.password_hash,
        full_name: profile?.full_name ?? 'N/A',
        school_level: profile?.school_level ?? 'N/A',
        applicant_type: profile?.applicant_type ?? 'N/A',
        mobile_number: profile?.mobile_number,
        address: profile?.address,
        birthdate: profile?.birthdate,
        program: profile?.program,
      };
    });

    return { data: students, error: null };
  } catch (error: any) {
    return { data: null, error };
  }
}

// ─── Fetch Student Details ────────────────────────────────────────────────────

export async function fetchStudentDetails(studentId: string) {
  try {
    const { data, error } = await supabase
      .from('student_accounts')
      .select(`*, applicant_profiles (*)`)
      .eq('id', studentId)
      .single();

    if (error) throw error;
    return { data, error: null };
  } catch (error: any) {
    return { data: null, error };
  }
}

// ─── Activate / Deactivate ────────────────────────────────────────────────────

export async function activateStudentAccount(studentId: string) {
  try {
    const { data, error } = await supabase
      .from('student_accounts')
      .update({ enrollment_status: 'active' })
      .eq('id', studentId)
      .select()
      .single();
    if (error) throw error;
    return { data, error: null };
  } catch (error: any) {
    return { data: null, error };
  }
}

export async function deactivateStudentAccount(studentId: string) {
  try {
    const { data, error } = await supabase
      .from('student_accounts')
      .update({ enrollment_status: 'inactive' })
      .eq('id', studentId)
      .select()
      .single();
    if (error) throw error;
    return { data, error: null };
  } catch (error: any) {
    return { data: null, error };
  }
}

// ─── Enrollment Center ────────────────────────────────────────────────────────

export async function fetchEnrollments() {
  try {
    const { data, error } = await supabase
      .from('student_accounts')
      .select(`
        id,
        student_number,
        email,
        enrollment_status,
        enrolled_at,
        applicant_profiles ( full_name, school_level )
      `)
      .order('enrolled_at', { ascending: false });

    if (error) throw error;

    const enrollments = (data ?? []).map((s: any) => {
      const profile = Array.isArray(s.applicant_profiles) ? s.applicant_profiles[0] : s.applicant_profiles;
      return {
        id: s.id,
        student_number: s.student_number,
        full_name: profile?.full_name ?? 'N/A',
        email: s.email,
        school_level: profile?.school_level ?? 'N/A',
        enrollment_status: s.enrollment_status ?? 'pending',
        enrolled_at: s.enrolled_at,
        subjects_count: 0,
      };
    });

    return { data: enrollments, error: null };
  } catch (error: any) {
    return { data: null, error };
  }
}

// ─── Academic Hub (Grades) ────────────────────────────────────────────────────

export async function fetchGrades() {
  try {
    const { data, error } = await supabase
      .from('exam_scores')
      .select(`
        id,
        student_id,
        subject_code,
        score,
        remarks,
        student_accounts ( student_number, email, applicant_profiles ( full_name ) )
      `)
      .order('subject_code', { ascending: true });

    if (error) throw error;
    return { data: data ?? [], error: null };
  } catch (error: any) {
    return { data: null, error };
  }
}

// ─── Honors Tracker ───────────────────────────────────────────────────────────

export async function fetchHonors() {
  try {
    const { data, error } = await supabase
      .from('student_accounts')
      .select(`
        student_number,
        email,
        applicant_profiles ( full_name, school_level )
      `);

    if (error) throw error;
    return { data: data ?? [], error: null };
  } catch (error: any) {
    return { data: null, error };
  }
}

// ─── Clearance & Deficiencies ─────────────────────────────────────────────────

export async function fetchDeficiencies() {
  try {
    const { data, error } = await supabase
      .from('exam_scores')
      .select(`
        id,
        student_id,
        subject_code,
        score,
        remarks,
        student_accounts ( student_number, email, applicant_profiles ( full_name ) )
      `)
      .eq('remarks', 'Failed');

    if (error) throw error;
    return { data: data ?? [], error: null };
  } catch (error: any) {
    return { data: null, error };
  }
}

// ─── Subject Catalog ──────────────────────────────────────────────────────────

export async function fetchSubjects() {
  try {
    const { data, error } = await supabase
      .from('subjects')
      .select('*')
      .order('subject_code', { ascending: true });

    if (error) throw error;
    return { data: data ?? [], error: null };
  } catch (error: any) {
    return { data: null, error };
  }
}

// ─── Service Requests ─────────────────────────────────────────────────────────

export async function fetchServiceRequests() {
  try {
    const { data, error } = await supabase
      .from('documents')
      .select(`
        id,
        student_id,
        document_type,
        status,
        created_at,
        student_accounts ( student_number, email, applicant_profiles ( full_name ) )
      `)
      .order('created_at', { ascending: false });

    if (error) throw error;
    return { data: data ?? [], error: null };
  } catch (error: any) {
    return { data: null, error };
  }
}

// ─── Reports ──────────────────────────────────────────────────────────────────

export async function fetchReportStats() {
  try {
    const [total, college, shs, irregular] = await Promise.all([
      supabase.from('student_accounts').select('*', { count: 'exact', head: true }),
      supabase.from('applicant_profiles').select('*', { count: 'exact', head: true }).eq('school_level', 'College'),
      supabase.from('applicant_profiles').select('*', { count: 'exact', head: true }).eq('school_level', 'Senior High School'),
      supabase.from('applicant_profiles').select('*', { count: 'exact', head: true }).eq('applicant_type', 'Irregular'),
    ]);

    return {
      data: {
        total: total.count ?? 0,
        college: college.count ?? 0,
        shs: shs.count ?? 0,
        irregular: irregular.count ?? 0,
      },
      error: null,
    };
  } catch (error: any) {
    return { data: null, error };
  }
}

// ─── Update Student Info ──────────────────────────────────────────────────────

export async function updateStudentInfo(studentId: string, updates: { email?: string; student_number?: string }) {
  try {
    const { data, error } = await supabase
      .from('student_accounts')
      .update(updates)
      .eq('id', studentId)
      .select()
      .single();
    if (error) throw error;
    return { data, error: null };
  } catch (error: any) {
    return { data: null, error };
  }
}
