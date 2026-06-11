import { buildTenantHeaders, getSchoolSlugFromHost } from "@campus-one/api-client";
import { getRequirements } from "./requirements.config.ts";
import type {
  SchoolLevel,
  ApplicantType,
  AdmissionActivityLogDTO,
  AdmissionEventType,
  ApplicantDocument,
  DocumentUploadDTO,
  AdmissionResult,
  RequirementItem,
  SupabaseResponse,
  CreateAccountDTO,
  ApplicantProfileDTO,
  ExamLogDTO,
} from "../types/admissions.types";

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:4000";

type BackendMethod = "GET" | "POST" | "PUT";

type SelectedSchoolContext = {
  schoolId?: string;
  schoolSlug?: string;
};

function getStoredSelectedSchool(): SelectedSchoolContext {
  if (typeof window === "undefined") {
    return {};
  }

  const stored = window.localStorage.getItem("campus-one:selected-school");
  if (!stored) {
    return {};
  }

  try {
    const selected = JSON.parse(stored) as {
      schoolId?: unknown;
      activeInstitutionId?: unknown;
      schoolSlug?: unknown;
    };
    return {
      schoolId:
        typeof selected.schoolId === "string"
          ? selected.schoolId
          : typeof selected.activeInstitutionId === "string"
            ? selected.activeInstitutionId
            : undefined,
      schoolSlug: typeof selected.schoolSlug === "string" ? selected.schoolSlug : undefined,
    };
  } catch {
    return {};
  }
}

function getSelectedSchoolContext(): SelectedSchoolContext {
  if (typeof window === "undefined") {
    return {
      schoolId: process.env.NEXT_PUBLIC_INSTITUTION_ID,
      schoolSlug: process.env.NEXT_PUBLIC_SCHOOL_SLUG,
    };
  }

  const fromQuery = new URLSearchParams(window.location.search).get("school") ?? undefined;
  const fromHost =
    getSchoolSlugFromHost(window.location.hostname, process.env.NEXT_PUBLIC_SCHOOL_PORTAL_DOMAIN) ?? undefined;
  const stored = getStoredSelectedSchool();

  return {
    schoolId: stored.schoolId,
    schoolSlug: fromQuery ?? fromHost ?? stored.schoolSlug,
  };
}

function buildAdmissionTenantHeaders(): Record<string, string> {
  const selected = getSelectedSchoolContext();

  return {
    ...buildTenantHeaders(selected.schoolSlug),
    ...(selected.schoolId ? { "X-Institution-Id": selected.schoolId } : {}),
  };
}

function toError<T>(message: string, code?: string): SupabaseResponse<T> {
  return { data: null, error: { message, ...(code ? { code } : {}) } };
}

async function requestAdmissionsBackend<T>(
  method: BackendMethod,
  path: string,
  body?: unknown,
): Promise<SupabaseResponse<T>> {
  try {
    const response = await fetch(`${API_BASE_URL}${path}`, {
      method,
      headers: {
        Accept: "application/json",
        ...(body === undefined ? {} : { "Content-Type": "application/json" }),
        ...buildAdmissionTenantHeaders(),
      },
      body: body === undefined ? undefined : JSON.stringify(body),
    });

    const payload = await response.json().catch(() => null) as
      | SupabaseResponse<T>
      | { message?: string; error?: { message?: string } | string }
      | T
      | null;

    if (!response.ok) {
      if (payload && typeof payload === "object" && "error" in payload) {
        const error = payload.error;
        return toError<T>(typeof error === "string" ? error : error?.message ?? "Admissions request failed.");
      }

      if (payload && typeof payload === "object" && "message" in payload && payload.message) {
        return toError<T>(payload.message);
      }

      return toError<T>(`Admissions request failed with ${response.status}.`);
    }

    if (payload && typeof payload === "object" && "data" in payload && "error" in payload) {
      return payload as SupabaseResponse<T>;
    }

    return { data: payload as T, error: null };
  } catch (error) {
    return toError<T>(error instanceof Error ? error.message : "Admissions request failed.");
  }
}

async function readFileAsBase64(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => {
      if (typeof reader.result !== "string") {
        reject(new Error("Unable to read selected document."));
        return;
      }

      resolve(reader.result.includes(",") ? reader.result.split(",")[1] : reader.result);
    };
    reader.onerror = () => reject(reader.error ?? new Error("Unable to read selected document."));
    reader.readAsDataURL(file);
  });
}

export async function logAdmissionEvent(dto: AdmissionActivityLogDTO): Promise<SupabaseResponse<{ id: string }>> {
  return requestAdmissionsBackend<{ id: string }>("POST", "/api/application/log-event", dto);
}

export async function logEvent(
  eventType: AdmissionEventType,
  schoolLevel: SchoolLevel,
  applicantType: ApplicantType,
  metadata: Record<string, unknown> = {},
): Promise<void> {
  const result = await logAdmissionEvent({
    event_type: eventType,
    school_level: schoolLevel,
    applicant_type: applicantType,
    metadata,
  });

  if (result.error) {
    console.error("[admissions] log failed:", result.error.message);
  }
}

export async function createApplicantProfile(
  dto: Pick<CreateAccountDTO, "email" | "school_level" | "applicant_type">,
): Promise<SupabaseResponse<{ id: string }>> {
  return requestAdmissionsBackend<{ id: string }>("POST", "/api/application/create-profile", {
    email: dto.email.trim().toLowerCase(),
    school_level: dto.school_level,
    applicant_type: dto.applicant_type,
  });
}

export async function submitApplication(
  applicantId: string,
): Promise<SupabaseResponse<{ reference_number: string }>> {
  return requestAdmissionsBackend<{ reference_number: string }>(
    "POST",
    `/api/application/submit/${encodeURIComponent(applicantId)}`,
    {},
  );
}

export async function trackApplication(
  email: string,
  referenceNumber: string,
): Promise<SupabaseResponse<{ id: string }>> {
  return requestAdmissionsBackend<{ id: string }>("POST", "/api/application/track", {
    email: email.trim(),
    referenceNumber: referenceNumber.trim(),
  });
}

export async function saveApplicantProfile(dto: ApplicantProfileDTO): Promise<SupabaseResponse<{ id: string }>> {
  return requestAdmissionsBackend<{ id: string }>("PUT", "/api/application/profile", dto);
}

export function getRequirementsByLevelAndType(
  schoolLevel: SchoolLevel,
  applicantType: ApplicantType,
): RequirementItem[] {
  return getRequirements(schoolLevel, applicantType);
}

export async function uploadApplicantDocument(dto: DocumentUploadDTO): Promise<SupabaseResponse<ApplicantDocument>> {
  try {
    const fileBase64 = await readFileAsBase64(dto.file);

    return requestAdmissionsBackend<ApplicantDocument>("POST", "/api/application/upload-document", {
      applicant_id: dto.applicant_id,
      document_name: dto.document_name,
      file_name: dto.file.name,
      file_type: dto.file.type || "application/octet-stream",
      file_base64: fileBase64,
      school_level: dto.school_level,
      applicant_type: dto.applicant_type,
    });
  } catch (error) {
    return toError<ApplicantDocument>(error instanceof Error ? error.message : "Upload failed.");
  }
}

export async function getApplicantDocuments(
  applicantId: string,
): Promise<SupabaseResponse<ApplicantDocument[]>> {
  return requestAdmissionsBackend<ApplicantDocument[]>(
    "GET",
    `/api/application/documents/${encodeURIComponent(applicantId)}`,
  );
}

export async function logExamResult(dto: ExamLogDTO): Promise<SupabaseResponse<{ id: string }>> {
  return logAdmissionEvent({
    event_type: "exam_result_submitted",
    school_level: dto.school_level,
    applicant_type: dto.applicant_type,
    metadata: {
      applicant_id: dto.applicant_id,
      result: dto.result,
      score: dto.score,
      ...(dto.metadata ?? {}),
    },
  });
}

export async function getApplicantAdmissionResult(
  applicantId: string,
): Promise<SupabaseResponse<AdmissionResult>> {
  return requestAdmissionsBackend<AdmissionResult>(
    "GET",
    `/api/application/result/${encodeURIComponent(applicantId)}`,
  );
}

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
  return requestAdmissionsBackend<{ id: string }>("PUT", "/api/application/parent-information", data);
}

export async function saveAcademicBackground(data: {
  applicant_id: string;
  entries: Array<{
    grade_level: string;
    school_name: string;
    completion_year: string;
  }>;
}): Promise<SupabaseResponse<{ count: number }>> {
  return requestAdmissionsBackend<{ count: number }>("PUT", "/api/application/academic-background", data);
}

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
  return requestAdmissionsBackend<{ count: number }>("PUT", "/api/application/alumni-relatives", data);
}

export async function saveProgramSelection(data: {
  applicant_id: string;
  school_level: SchoolLevel;
  applicant_type: ApplicantType;
  college_department?: string;
  college_program?: string;
  senior_high_track?: string;
  tvl_strand?: string;
}): Promise<SupabaseResponse<{ id: string }>> {
  return requestAdmissionsBackend<{ id: string }>("PUT", "/api/application/program-selection", data);
}
