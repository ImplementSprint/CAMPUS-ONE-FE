import { supabase } from '@/lib/supabase';
import { buildTenantHeaders, getSchoolSlugFromHost } from '@campus-one/api-client';
import { getCurrentUser } from '@/services/auth.service';
import { readCachedBackendAccessToken } from '@/services/backend-session.service';

const alumniDb = supabase.schema('alumni');
const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000';

export interface SupabaseResponse<T> {
  data: T | null;
  error: { message: string } | null;
}

export type AlumniRecordRequest = {
  log_id: string;
  created_at: string;
  actor_uuid: string;
  tenant_id: string;
  document_type: 'TOR' | 'DIPLOMA' | 'GOOD_MORAL' | 'CERTIFICATE';
  status_code: number;
  fee_amount?: number | null;
  payment_status?: string | null;
  notes?: string | null;
  delivery_method?: 'pickup' | 'delivery' | 'courier' | null;
  number_of_copies?: number | null;
};

export type AlumniCardApplication = {
  log_id: string;
  created_at: string;
  actor_uuid: string;
  tenant_id: string;
  application_type: 'new' | 'replacement';
  delivery_method: 'pickup' | 'delivery';
  status_code: number;
  payment_status?: string | null;
  id_photo_url?: string | null;
  card_serial?: string | null;
};

export type AlumniProfile = {
  log_id: string;
  created_at: string;
  actor_uuid: string;
  tenant_id: string;
  full_name?: string | null;
  email?: string | null;
  graduation_year?: number | null;
  program?: string | null;
  academic_unit?: string | null;
  student_id?: string | null;
  status_code?: number | null;
};

function getSelectedSchoolSlug(): string | null {
  if (typeof window === 'undefined') {
    return process.env.NEXT_PUBLIC_SCHOOL_SLUG ?? null;
  }

  const fromQuery = new URLSearchParams(window.location.search).get('school');
  if (fromQuery) return fromQuery;

  const fromHost = getSchoolSlugFromHost(
    window.location.hostname,
    process.env.NEXT_PUBLIC_SCHOOL_PORTAL_DOMAIN,
  );
  if (fromHost) return fromHost;

  const stored = window.localStorage.getItem('campus-one:selected-school');
  if (!stored) return null;

  try {
    return JSON.parse(stored).schoolSlug ?? null;
  } catch {
    return null;
  }
}

async function backendRequest<T>(path: string, init: RequestInit = {}) {
  const currentUser = getCurrentUser();
  const accessToken = typeof window === 'undefined' ? null : readCachedBackendAccessToken(window.sessionStorage);
  const response = await fetch(`${API_BASE_URL}${path}`, {
    ...init,
    headers: {
      'Content-Type': 'application/json',
      ...buildTenantHeaders(getSelectedSchoolSlug()),
      ...(accessToken ? { Authorization: `Bearer ${accessToken}` } : {}),
      ...(currentUser?.id ? { 'X-User-Id': currentUser.id } : {}),
      ...(currentUser?.role ? { 'X-User-Role': currentUser.role } : {}),
      ...init.headers,
    },
  });
  const payload = await response.json().catch(() => null) as T | null;

  if (!response.ok) {
    return {
      data: null,
      error: {
        message: (payload as any)?.message ?? (payload as any)?.error ?? 'Backend request failed',
      },
    };
  }

  return { data: payload, error: null };
}

export async function requestAlumniRecord(dto: {
  actor_uuid: string;
  tenant_id?: string;
  document_type: AlumniRecordRequest['document_type'];
  notes?: string;
  delivery_method?: 'pickup' | 'delivery' | 'courier';
  number_of_copies?: number;
}) {
  return backendRequest<AlumniRecordRequest>('/api/alumni/records/request', {
    method: 'POST',
    body: JSON.stringify({
      ...dto,
      tenant_id: dto.tenant_id ?? getSelectedSchoolSlug() ?? 'campus_one',
    }),
  });
}

export async function getAlumniRecordRequests(actorUuid: string) {
  return backendRequest<AlumniRecordRequest[]>(
    `/api/alumni/records/${encodeURIComponent(actorUuid)}`,
  );
}

export async function getAlumniProfile(actorUuid: string) {
  return backendRequest<AlumniProfile>(
    `/api/alumni/profile/${encodeURIComponent(actorUuid)}`,
  );
}

export async function getAlumniAdminRecordRequests() {
  return backendRequest<AlumniRecordRequest[]>('/api/alumni/admin/requests');
}

export async function getAlumniAdminCardApplications() {
  return backendRequest<AlumniCardApplication[]>('/api/alumni/admin/card-requests');
}

export async function updateAlumniRecordRequestStatus(
  logId: string,
  statusCode: number,
  paymentStatus?: 'pending' | 'paid',
) {
  return backendRequest<AlumniRecordRequest>(
    `/api/alumni/admin/requests/${encodeURIComponent(logId)}`,
    {
      method: 'PATCH',
      body: JSON.stringify({
        status_code: statusCode,
        ...(paymentStatus ? { payment_status: paymentStatus } : {}),
      }),
    },
  );
}

export async function updateAlumniCardApplicationStatus(
  logId: string,
  statusCode: number,
  paymentStatus?: 'pending' | 'paid',
) {
  return backendRequest<AlumniCardApplication>(
    `/api/alumni/admin/card-requests/${encodeURIComponent(logId)}`,
    {
      method: 'PATCH',
      body: JSON.stringify({
        status_code: statusCode,
        ...(paymentStatus ? { payment_status: paymentStatus } : {}),
      }),
    },
  );
}

export async function createAlumniProfile(dto: {
  email: string;
}): Promise<SupabaseResponse<{ id: string }>> {
  const alumniId = crypto.randomUUID();

  const { error } = await alumniDb.from("alumni").insert({
    id: alumniId,
    email: dto.email,
    first_name: "",
    last_name: "",
    graduation_year: null,
    department: "",
    status: "Active",
  });

  if (error) return { data: null, error: { message: error.message } };
  return { data: { id: alumniId }, error: null };
}

export async function updateAlumniProfile(
  alumniId: string,
  dto: {
    first_name: string;
    last_name: string;
    graduation_year: number;
    department: string;
  }
): Promise<SupabaseResponse<{ reference_number: string }>> {
  const referenceNumber = `ALM-${new Date().getFullYear()}-${alumniId.slice(0, 8).toUpperCase()}`;

  const { error } = await alumniDb
    .from("alumni")
    .update({
      first_name: dto.first_name,
      last_name: dto.last_name,
      graduation_year: dto.graduation_year,
      department: dto.department,
      reference_number: referenceNumber,
    })
    .eq("id", alumniId);

  if (error) return { data: null, error: { message: error.message } };
  return { data: { reference_number: referenceNumber }, error: null };
}
