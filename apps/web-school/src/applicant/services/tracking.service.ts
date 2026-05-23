import { buildTenantHeaders, getSchoolSlugFromHost } from "@campus-one/api-client";
import type { SupabaseResponse } from "../types/admissions.types";

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:4000";

export interface ApplicationStatus {
  id: string;
  reference_number: string;
  applicant_number: string | null;
  full_name: string;
  email: string;
  school_level: string;
  applicant_type: string;
  status: "Under Review" | "Passed" | "Not Accepted";
  application_submitted_at: string;
  reviewed_at: string | null;
  rejection_reason: string | null;
  created_at: string;
}

export interface ApplicationDocument {
  id: string;
  document_name: string;
  file_name: string;
  file_url: string;
  status: string;
  submitted_at: string;
}

export interface ApplicationProgress {
  step: number;
  label: string;
  status: "completed" | "current" | "pending";
  date?: string;
}

export interface FullApplicationStatus {
  application: ApplicationStatus;
  documents: ApplicationDocument[];
  progress: ApplicationProgress[];
  remarks: string | null;
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

function toError<T>(message: string): SupabaseResponse<T> {
  return { data: null, error: { message } };
}

async function fetchBackendResponse<T>(path: string): Promise<SupabaseResponse<T>> {
  try {
    const response = await fetch(`${API_BASE_URL}${path}`, {
      method: "GET",
      headers: {
        Accept: "application/json",
        ...buildTenantHeaders(getSelectedSchoolSlug()),
      },
    });
    const payload = await response.json().catch(() => null) as SupabaseResponse<T> | null;

    if (!response.ok) {
      return toError<T>(payload?.error?.message ?? "Request failed");
    }

    return payload ?? toError<T>("Invalid backend response");
  } catch (error: any) {
    return toError<T>(error?.message ?? "Unable to reach backend");
  }
}

export async function fetchApplicationStatus(
  email: string,
  referenceNumber: string,
): Promise<SupabaseResponse<FullApplicationStatus>> {
  const params = new URLSearchParams({
    email: email.trim(),
    referenceNumber: referenceNumber.trim(),
  });

  return fetchBackendResponse<FullApplicationStatus>(`/api/application/status?${params.toString()}`);
}

export async function validateApplicationAccess(
  email: string,
  referenceNumber: string,
): Promise<{ valid: boolean; applicantId: string; error?: string }> {
  const params = new URLSearchParams({
    email: email.trim(),
    referenceNumber: referenceNumber.trim(),
  });
  const result = await fetchBackendResponse<{ valid: boolean; applicantId: string; error?: string }>(
    `/api/application/validate-access?${params.toString()}`,
  );

  if (result.error) {
    return { valid: false, applicantId: "", error: result.error.message };
  }

  return result.data;
}
