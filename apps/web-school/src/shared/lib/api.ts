import { buildAuthHeaders, buildTenantHeaders, getSchoolSlugFromHost } from '@campus-one/api-client';
import { getCurrentUser } from '@/shared/auth.service';
import { readCachedBackendAccessToken } from '@/services/backend-session.service';

// API client for backend communication
const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000';

function getSelectedSchoolSlug(): string | null {
  if (typeof window === 'undefined') {
    return process.env.NEXT_PUBLIC_SCHOOL_SLUG ?? null;
  }

  const fromQuery = new URLSearchParams(window.location.search).get('school');
  if (fromQuery) return fromQuery;

  const fromHost = getSchoolSlugFromHost(window.location.hostname, process.env.NEXT_PUBLIC_SCHOOL_PORTAL_DOMAIN);
  if (fromHost) return fromHost;

  const stored = window.localStorage.getItem('campus-one:selected-school');
  if (!stored) return null;

  try {
    return JSON.parse(stored).schoolSlug ?? null;
  } catch {
    return null;
  }
}

class APIError extends Error {
  constructor(public status: number, message: string) {
    super(message);
    this.name = 'APIError';
  }
}

async function fetchAPI(endpoint: string, options: RequestInit = {}) {
  const url = `${API_BASE_URL}${endpoint}`;
  const currentUser = getCurrentUser();
  const accessToken = typeof window === 'undefined' ? null : readCachedBackendAccessToken(window.sessionStorage);
  
  const response = await fetch(url, {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      ...buildTenantHeaders(getSelectedSchoolSlug()),
      ...buildAuthHeaders(accessToken),
      ...(currentUser?.id ? { 'X-User-Id': currentUser.id } : {}),
      ...(currentUser?.role ? { 'X-User-Role': currentUser.role } : {}),
      ...options.headers,
    },
  });

  if (!response.ok) {
    const error = await response.json().catch(() => ({ error: 'Unknown error' }));
    throw new APIError(response.status, error.error || error.message || 'Request failed');
  }

  return response.json();
}

// ─── Profile API ──────────────────────────────────────────────────────────────

export async function getProfile(userId: string) {
  return fetchAPI('/api/profile/me', {
    headers: { 'X-User-Id': userId },
  });
}

export async function updateProfile(userId: string, data: any) {
  return fetchAPI('/api/profile/me', {
    method: 'PUT',
    headers: { 'X-User-Id': userId },
    body: JSON.stringify(data),
  });
}

// ─── Dashboard API ────────────────────────────────────────────────────────────

export async function getDashboardData(userId: string) {
  return fetchAPI('/api/dashboard/me', {
    headers: { 'X-User-Id': userId },
  });
}

// ─── Courses API ──────────────────────────────────────────────────────────────

export async function getCourses(userId: string) {
  return fetchAPI(`/api/courses/${userId}`);
}

// ─── Grades API ───────────────────────────────────────────────────────────────

export async function getGrades(userId: string) {
  return fetchAPI(`/api/grades/${userId}`);
}

export async function getGradeSummary(userId: string) {
  return fetchAPI(`/api/grades/${userId}/summary`);
}

export async function getTermGradeSummary(userId: string, term: string) {
  return fetchAPI(`/api/grades/${userId}/terms/${encodeURIComponent(term)}/summary`);
}

// ─── Subjects API ─────────────────────────────────────────────────────────────

export async function getSubjects(schoolYear: string = '2025-2026', term: string = 'First Term') {
  const params = new URLSearchParams({ schoolYear, term });
  return fetchAPI(`/api/subjects?${params}`);
}

export async function getUserInfo(userId: string) {
  return fetchAPI(`/api/subjects/user/${userId}`);
}

// ─── Enrollment API ───────────────────────────────────────────────────────────

export async function getEnrollmentOfferings(params: {
  studentId?: string;
  program?: string;
  yearLevel?: string;
}) {
  const searchParams = new URLSearchParams();
  if (params.studentId) searchParams.append('studentId', params.studentId);
  if (params.program) searchParams.append('program', params.program);
  if (params.yearLevel) searchParams.append('yearLevel', params.yearLevel);
  
  return fetchAPI(`/api/enrollment/offerings?${searchParams}`);
}

export async function submitEnrollment(data: {
  studentId: string;
  classAssignmentIds: string[];
}) {
  return fetchAPI('/api/enrollment/submit', {
    method: 'POST',
    body: JSON.stringify(data),
  });
}

export async function getEnrollmentStatus(
  studentId: string,
  schoolYear?: string,
  term?: string
) {
  const params = new URLSearchParams();
  if (schoolYear) params.append('schoolYear', schoolYear);
  if (term) params.append('term', term);
  
  return fetchAPI(`/api/enrollment/status/${studentId}?${params}`);
}

export async function getEnrollmentHistory(studentId: string) {
  return fetchAPI(`/api/enrollment/history/${studentId}`);
}

export async function getBillingBalance(studentId: string) {
  return fetchAPI(`/api/billing/student/${encodeURIComponent(studentId)}/balance`);
}

export async function getDeficiencies(userId: string) {
  return fetchAPI(`/api/grades/${userId}/deficiencies`);
}

export async function getGraduationData(userId: string) {
  return fetchAPI(`/api/grades/${userId}/graduation`);
}

export type UserNotification = {
  id: string;
  profile_id: string;
  title: string;
  body: string | null;
  is_read: boolean;
  created_at: string;
};

export async function getNotifications(profileId: string) {
  return fetchAPI(`/api/notifications/${encodeURIComponent(profileId)}`);
}

export async function markNotificationRead(profileId: string, notificationId: string) {
  return fetchAPI(
    `/api/notifications/${encodeURIComponent(profileId)}/${encodeURIComponent(notificationId)}/read`,
    { method: 'PATCH' },
  );
}

export async function markAllNotificationsRead(profileId: string) {
  return fetchAPI(`/api/notifications/${encodeURIComponent(profileId)}/read-all`, {
    method: 'PATCH',
  });
}

export async function getAdmissionsApplications() {
  return fetchAPI('/api/application/admin/applications');
}

export async function getAdmissionsApplicationDetail(applicationId: string) {
  return fetchAPI(`/api/application/admin/applications/${encodeURIComponent(applicationId)}`);
}

export async function updateAdmissionsApplicationStatus(
  applicationId: string,
  status: string,
  rejectionReason?: string,
) {
  return fetchAPI(`/api/application/admin/applications/${encodeURIComponent(applicationId)}/status`, {
    method: 'PUT',
    body: JSON.stringify({ status, rejectionReason }),
  });
}

export async function getAdmissionsDashboardStats() {
  return fetchAPI('/api/application/admin/stats');
}

export async function updateAdmissionsProgramSelection(applicationId: string, department: string, program: string) {
  return fetchAPI(`/api/application/admin/applications/${encodeURIComponent(applicationId)}/program-selection`, {
    method: 'PUT',
    body: JSON.stringify({ department, program }),
  });
}

// ─── Auth API ─────────────────────────────────────────────────────────────────

export async function signIn(email: string, password: string) {
  return fetchAPI('/api/auth/signin', {
    method: 'POST',
    body: JSON.stringify({ email, password }),
  });
}

export async function signOut() {
  return fetchAPI('/api/auth/signout', {
    method: 'POST',
  });
}

export { APIError };
