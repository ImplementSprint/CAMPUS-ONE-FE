import { supabase, STORAGE_BUCKET } from "@/shared/lib/supabase";
const applicationDb = supabase.schema('application');
import { getRequirements } from "./requirements.config";
import type {
  SchoolLevel, ApplicantType, AdmissionActivityLogDTO, AdmissionEventType,
  ApplicantDocument, DocumentUploadDTO, AdmissionResult, RequirementItem,
  SupabaseResponse, CreateAccountDTO, ApplicantProfileDTO, ExamLogDTO,
} from "../types/admissions.types";

// ─── Activity Logging ─────────────────────────────────────────────────────────
export async function logAdmissionEvent(dto: AdmissionActivityLogDTO): Promise<SupabaseResponse<{ id: string }>> {
  const { data, error } = await applicationDb
    .from("admissions_activity_logs")
    .insert({ event_type: dto.event_type, applicant_type: dto.applicant_type, school_level: dto.school_level, metadata: dto.metadata })
    .select("id").single();
  if (error) return { data: null, error: { message: error.message, code: error.code } };
  return { data: data as { id: string }, error: null };
}

export async function logEvent(
  eventType: AdmissionEventType, schoolLevel: SchoolLevel, applicantType: ApplicantType,
  metadata: Record<string, unknown> = {}
): Promise<void> {
  try { await logAdmissionEvent({ event_type: eventType, school_level: schoolLevel, applicant_type: applicantType, metadata }); }
  catch (err) { console.error("[admissions] log failed:", err); }
}

// ─── Account Creation (No Password) ───────────────────────────────────────────
export async function createApplicantProfile(dto: { 
  email: string; 
  school_level: SchoolLevel; 
  applicant_type: ApplicantType;
}): Promise<SupabaseResponse<{ id: string }>> {
  const applicantId = crypto.randomUUID();
  
  const { error } = await applicationDb.from("applicant_profiles").insert({
    id: applicantId,
    email: dto.email,
    school_level: dto.school_level,
    applicant_type: dto.applicant_type,
    full_name: "",
    first_name: "",
    last_name: "",
    status: "Under Review",
  });
  
  if (error) return { data: null, error: { message: error.message } };
  return { data: { id: applicantId }, error: null };
}

// ─── Submit Application (Generates Reference Number) ──────────────────────────
export async function submitApplication(applicantId: string): Promise<SupabaseResponse<{ reference_number: string }>> {
  console.log("📝 Submitting application for:", applicantId);
  
  const { data, error } = await applicationDb
    .from("applicant_profiles")
    .update({ 
      application_submitted_at: new Date().toISOString(),
      status: "Under Review"
    })
    .eq("id", applicantId)
    .select("reference_number, email, full_name, school_level, applicant_type")
    .single();
  
  if (error) {
    console.error("❌ Application submission error:", error);
    return { data: null, error: { message: error.message } };
  }
  
  console.log("✅ Application submitted successfully:", data);
  console.log("📧 Preparing to send email to:", data.email);
  
  // Send confirmation email with reference number
  try {
    const { sendApplicationConfirmationEmail } = await import("@/shared/email.service");
    
    console.log("📤 Sending confirmation email...");
    const emailResult = await sendApplicationConfirmationEmail({
      to: data.email,
      applicantName: data.full_name || "Applicant",
      referenceNumber: data.reference_number,
      schoolLevel: data.school_level,
      applicantType: data.applicant_type,
    });
    
    if (emailResult.success) {
      console.log("✅ Confirmation email sent successfully to:", data.email);
    } else {
      console.error("❌ Email sending failed:", emailResult.error);
    }
  } catch (emailError) {
    console.error("❌ Failed to send confirmation email:", emailError);
    // Don't fail the submission if email fails
  }
  
  return { data: { reference_number: data.reference_number }, error: null };
}

// ─── Track Application (Email + Reference Number) ─────────────────────────────
export async function trackApplication(email: string, referenceNumber: string): Promise<SupabaseResponse<{ id: string }>> {
  const { data, error } = await applicationDb
    .from("applicant_profiles")
    .select("id")
    .eq("email", email)
    .eq("reference_number", referenceNumber)
    .single();
  
  if (error) return { data: null, error: { message: "Invalid email or reference number" } };
  return { data: { id: data.id }, error: null };
}

// ─── Profile Save ─────────────────────────────────────────────────────────────
export async function saveApplicantProfile(dto: ApplicantProfileDTO): Promise<SupabaseResponse<{ id: string }>> {
  console.log("Saving profile for applicant:", dto.applicant_id);
  console.log("Profile data:", dto);
  
  const fullName = `${dto.first_name} ${dto.last_name}`.trim();
  const { data, error } = await applicationDb.from("applicant_profiles").update({
    first_name: dto.first_name, 
    last_name: dto.last_name, 
    middle_name: dto.middle_name,
    full_name: fullName, 
    birthdate: dto.birthdate, 
    mobile_number: dto.mobile_number,
    address: dto.address, 
    school_level: dto.school_level, 
    applicant_type: dto.applicant_type,
  }).eq("id", dto.applicant_id).select();
  
  console.log("Update result:", { data, error });
  
  if (error) {
    console.error("Profile save error:", error);
    return { data: null, error: { message: error.message } };
  }
  
  return { data: { id: dto.applicant_id }, error: null };
}

// ─── Requirements ─────────────────────────────────────────────────────────────
export function getRequirementsByLevelAndType(schoolLevel: SchoolLevel, applicantType: ApplicantType): RequirementItem[] {
  return getRequirements(schoolLevel, applicantType);
}

// ─── Document Upload ──────────────────────────────────────────────────────────
export async function uploadApplicantDocument(dto: DocumentUploadDTO): Promise<SupabaseResponse<ApplicantDocument>> {
  const timestamp = Date.now();
  const sanitized = dto.file.name.replace(/[^a-zA-Z0-9._-]/g, "_");
  const filePath = `${dto.applicant_id}/${timestamp}_${sanitized}`;
  const { error: storageError } = await supabase.storage.from(STORAGE_BUCKET).upload(filePath, dto.file, { upsert: true });
  if (storageError) return { data: null, error: { message: storageError.message } };
  const { data: urlData } = supabase.storage.from(STORAGE_BUCKET).getPublicUrl(filePath);
  const { data, error: dbError } = await applicationDb.from("applicant_documents").insert({
    applicant_id: dto.applicant_id, document_name: dto.document_name,
    file_name: dto.file.name, file_url: urlData.publicUrl,
    status: "submitted", school_level: dto.school_level, applicant_type: dto.applicant_type,
  }).select().single();
  if (dbError) return { data: null, error: { message: dbError.message } };
  return { data: data as ApplicantDocument, error: null };
}

// ─── Exam Logging ─────────────────────────────────────────────────────────────
export async function logExamResult(dto: ExamLogDTO): Promise<SupabaseResponse<{ id: string }>> {
  const { data, error } = await applicationDb
    .from("Exam_Logs")
    .insert({
      applicant_id: dto.applicant_id,
      school_level: dto.school_level,
      applicant_type: dto.applicant_type,
      result: dto.result,
      score: dto.score ?? null,
      metadata: dto.metadata ?? {},
    })
    .select("id")
    .single();
  if (error) return { data: null, error: { message: error.message, code: error.code } };
  await logEvent("exam_result_submitted", dto.school_level, dto.applicant_type, {
    applicant_id: dto.applicant_id,
    result: dto.result,
    score: dto.score,
  });
  return { data: data as { id: string }, error: null };
}

// ─── Admission Result ─────────────────────────────────────────────────────────
export async function getApplicantAdmissionResult(applicantId: string): Promise<SupabaseResponse<AdmissionResult>> {
  const { data, error } = await applicationDb.from("admissions_results")
    .select(`id, applicant_id, status, noa_url, exam_permit_url, exam_date, exam_time, exam_venue, permit_number, date_issued, application.applicant_profiles ( full_name, program, school_level, applicant_type )`)
    .eq("applicant_id", applicantId).single();
  if (error) return { data: null, error: { message: error.message } };
  const raw = data as Record<string, unknown>;
  const profile = raw["applicant_profiles"] as Record<string, unknown> | null;
  const result: AdmissionResult = {
    id: raw["id"] as string, applicant_id: raw["applicant_id"] as string,
    status: raw["status"] as AdmissionResult["status"],
    noa: profile ? { applicant_name: profile["full_name"] as string, program: profile["program"] as string,
      school_level: profile["school_level"] as SchoolLevel, applicant_type: profile["applicant_type"] as ApplicantType,
      date_issued: raw["date_issued"] as string, noa_url: raw["noa_url"] as string | null } : null,
    test_permit: raw["exam_date"] ? { exam_date: raw["exam_date"] as string, exam_time: raw["exam_time"] as string,
      exam_venue: raw["exam_venue"] as string, permit_number: raw["permit_number"] as string,
      permit_url: raw["exam_permit_url"] as string | null } : null,
  };
  return { data: result, error: null };
}

// ─── Parent Information ───────────────────────────────────────────────────────
export async function saveParentInformation(data: {
  applicant_id: string;
  father_name: string;
  father_address: string;
  father_contact: string;
  guardian_name: string;
  guardian_address: string;
  guardian_phone_home: string;
  guardian_phone_work: string;
  mother_name: string;
  mother_address: string;
  mother_contact: string;
}): Promise<SupabaseResponse<{ id: string }>> {
  const { error } = await applicationDb.from("parent_information").upsert({
    applicant_id: data.applicant_id,
    father_name: data.father_name,
    father_address: data.father_address,
    father_contact: data.father_contact,
    guardian_name: data.guardian_name,
    guardian_address: data.guardian_address,
    guardian_phone_home: data.guardian_phone_home,
    guardian_phone_work: data.guardian_phone_work,
    mother_name: data.mother_name,
    mother_address: data.mother_address,
    mother_contact: data.mother_contact,
  }, { onConflict: "applicant_id" });
  if (error) return { data: null, error: { message: error.message } };
  return { data: { id: data.applicant_id }, error: null };
}

// ─── Academic Background ──────────────────────────────────────────────────────
export async function saveAcademicBackground(data: {
  applicant_id: string;
  entries: Array<{
    grade_level: string;
    school_name: string;
    completion_year: string;
  }>;
}): Promise<SupabaseResponse<{ count: number }>> {
  // Delete existing entries for this applicant
  await applicationDb.from("academic_background").delete().eq("applicant_id", data.applicant_id);
  
  // Insert new entries
  const records = data.entries.map(entry => ({
    applicant_id: data.applicant_id,
    grade_level: entry.grade_level,
    school_name: entry.school_name,
    completion_year: entry.completion_year,
  }));
  
  const { error } = await applicationDb.from("academic_background").insert(records);
  if (error) return { data: null, error: { message: error.message } };
  return { data: { count: records.length }, error: null };
}

// ─── Alumni Relatives ─────────────────────────────────────────────────────────
export async function saveAlumniRelatives(data: {
  applicant_id: string;
  relatives: Array<{
    name: string;
    relationship: string;
    college: string;
    batch_year: string;
    contact_number: string;
  }>;
}): Promise<SupabaseResponse<{ count: number }>> {
  // Delete existing entries for this applicant
  await applicationDb.from("alumni_relatives").delete().eq("applicant_id", data.applicant_id);
  
  // Insert new entries (only if there are relatives)
  if (data.relatives.length === 0) {
    return { data: { count: 0 }, error: null };
  }
  
  const records = data.relatives.map(relative => ({
    applicant_id: data.applicant_id,
    name: relative.name,
    relationship: relative.relationship,
    college: relative.college,
    batch_year: relative.batch_year,
    contact_number: relative.contact_number,
  }));
  
  const { error } = await applicationDb.from("alumni_relatives").insert(records);
  if (error) return { data: null, error: { message: error.message } };
  return { data: { count: records.length }, error: null };
}

// ─── Program Selection ────────────────────────────────────────────────────────
export async function saveProgramSelection(data: {
  applicant_id: string;
  school_level: SchoolLevel;
  applicant_type: ApplicantType;
  college_department?: string;
  college_program?: string;
  senior_high_track?: string;
  tvl_strand?: string;
}): Promise<SupabaseResponse<{ id: string }>> {
  const { error } = await applicationDb.from("program_selections").upsert({
    applicant_id: data.applicant_id,
    school_level: data.school_level,
    applicant_type: data.applicant_type,
    college_department: data.college_department ?? null,
    college_program: data.college_program ?? null,
    senior_high_track: data.senior_high_track ?? null,
    tvl_strand: data.tvl_strand ?? null,
  }, { onConflict: "applicant_id" });
  if (error) return { data: null, error: { message: error.message } };
  
  // Also update the program field in applicant_profiles for easy access
  const programName = data.college_program || data.senior_high_track || data.school_level;
  await applicationDb.from("applicant_profiles").update({ program: programName }).eq("id", data.applicant_id);
  
  return { data: { id: data.applicant_id }, error: null };
}
