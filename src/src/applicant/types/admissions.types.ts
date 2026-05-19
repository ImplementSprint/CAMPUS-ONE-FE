// ─── School Level & Applicant Type ──────────────────────────────────────────
export type SchoolLevel =
  | "Kinder"
  | "Elementary"
  | "Junior High School"
  | "Senior High School"
  | "College";

export type ApplicantType =
  | "Freshman"
  | "Transferee"
  | "Shiftee"
  | "Returnee";

export type AdmissionStatus = "Under Review" | "Passed" | "Not Accepted";

export type AdmissionEventType =
  | "school_level_selected"
  | "applicant_type_selected"
  | "selection_confirmed"
  | "account_created"
  | "profile_completed"
  | "parent_info_submitted"
  | "document_uploaded"
  | "document_replaced"
  | "noa_viewed"
  | "noa_downloaded"
  | "test_permit_viewed"
  | "test_permit_downloaded"
  | "result_checked"
  | "exam_result_submitted";

export type DocumentStatus = "not_uploaded" | "submitted" | "approved" | "rejected";

export type ExamResult = "PASSED" | "FAILED";

export interface ExamLogDTO {
  applicant_id: string;
  school_level: SchoolLevel;
  applicant_type: ApplicantType;
  result: ExamResult;
  score?: number;
  metadata?: Record<string, unknown>;
}

// ─── DTOs ────────────────────────────────────────────────────────────────────
export interface AdmissionActivityLogDTO {
  event_type: AdmissionEventType;
  applicant_type: ApplicantType;
  school_level: SchoolLevel;
  metadata: Record<string, unknown>;
}

export interface ApplicantSelectionDTO {
  school_level: SchoolLevel;
  applicant_type: ApplicantType;
}

export interface CreateAccountDTO {
  email: string;
  password: string;
  school_level: SchoolLevel;
  applicant_type: ApplicantType;
}

export interface ApplicantProfileDTO {
  applicant_id: string;
  first_name: string;
  last_name: string;
  middle_name: string;
  birthdate: string;
  mobile_number: string;
  address: string;
  school_level: SchoolLevel;
  applicant_type: ApplicantType;
}

// ─── Models ───────────────────────────────────────────────────────────────────
export interface ApplicantProfile {
  id: string;
  first_name: string;
  last_name: string;
  middle_name: string;
  email: string;
  birthdate: string;
  mobile_number: string;
  address: string;
  school_level: SchoolLevel;
  applicant_type: ApplicantType;
  program: string;
  status: AdmissionStatus;
  created_at: string;
}

export interface RequirementItem {
  id: string;
  name: string;
  description: string;
  required: boolean;
}

export interface ApplicantDocument {
  id: string;
  applicant_id: string;
  document_name: string;
  file_name: string;
  file_url: string;
  status: DocumentStatus;
  submitted_at: string;
  school_level: SchoolLevel;
  applicant_type: ApplicantType;
}

export interface DocumentUploadDTO {
  applicant_id: string;
  document_name: string;
  file: File;
  school_level: SchoolLevel;
  applicant_type: ApplicantType;
}

export interface ActivityLog {
  id: string;
  event_type: AdmissionEventType;
  applicant_type: ApplicantType;
  school_level: SchoolLevel;
  timestamp: string;
  metadata: Record<string, unknown>;
}

// ─── Admission Result ─────────────────────────────────────────────────────────
export interface NoticeOfAdmission {
  applicant_name: string;
  program: string;
  school_level: SchoolLevel;
  applicant_type: ApplicantType;
  date_issued: string;
  noa_url: string | null;
}

export interface ExamTestPermit {
  exam_date: string;
  exam_time: string;
  exam_venue: string;
  permit_number: string;
  permit_url: string | null;
}

export interface AdmissionResult {
  id: string;
  applicant_id: string;
  status: AdmissionStatus;
  noa: NoticeOfAdmission | null;
  test_permit: ExamTestPermit | null;
}

// ─── Supabase Wrappers ────────────────────────────────────────────────────────
export interface SupabaseSuccess<T> { data: T; error: null; }
export interface SupabaseError { data: null; error: { message: string; code?: string }; }
export type SupabaseResponse<T> = SupabaseSuccess<T> | SupabaseError;

// ─── Program/Track Selection ──────────────────────────────────────────────────
export type CollegeDepartment =
  | "College of Architecture"
  | "College of Engineering"
  | "College of Information Technology"
  | "College of Business Administration"
  | "College of Education"
  | "College of Arts and Sciences"
  | "College of Nursing";

export type CollegeProgram =
  | "BS Information Technology"
  | "BS Computer Science"
  | "BS Information Systems"
  | "BS Civil Engineering"
  | "BS Mechanical Engineering"
  | "BS Electrical Engineering"
  | "BS Architecture"
  | "BS Business Administration"
  | "BS Education"
  | "BS Liberal Arts"
  | "BS Nursing";

export type SeniorHighTrack =
  | "STEM"
  | "ABM"
  | "HUMSS"
  | "GAS"
  | "TVL";

export type TVLStrand =
  | "ICT"
  | "Home Economics"
  | "Industrial Arts";

// ─── App Flow State ───────────────────────────────────────────────────────────
export type AppStep =
  | "home"
  | "select"
  | "program-selection"
  | "create-account"
  | "personal-profile"
  | "parent-info"
  | "academic-background"
  | "alumni-info"
  | "documents"
  | "activity-log"
  | "confirmation"
  | "result";

export interface AppSession {
  step: AppStep;
  schoolLevel: SchoolLevel | null;
  applicantType: ApplicantType | null;
  applicantId: string | null;
  firstName: string;
  lastName: string;
  email: string;
  collegeDepartment: CollegeDepartment | null;
  collegeProgram: CollegeProgram | null;
  seniorHighTrack: SeniorHighTrack | null;
  tvlStrand: TVLStrand | null;
  applicationStatus: AdmissionStatus | null;
  referenceNumber: string | null;
}
