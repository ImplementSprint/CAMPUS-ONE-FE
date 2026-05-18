// API client for backend communication
const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000';

class APIError extends Error {
  constructor(public status: number, message: string) {
    super(message);
    this.name = 'APIError';
  }
}

async function fetchAPI(endpoint: string, options: RequestInit = {}) {
  const url = `${API_BASE_URL}${endpoint}`;
  // add an AbortController timeout to avoid fetch hanging indefinitely
  const controller = new AbortController();
  const timeoutMs = 8000;
  const timeout = setTimeout(() => controller.abort(), timeoutMs);
  try {
    const response = await fetch(url, {
      ...options,
      headers: {
        'Content-Type': 'application/json',
        ...options.headers,
      },
      signal: controller.signal,
    });

    if (!response.ok) {
      const error = await response.json().catch(() => ({ error: 'Unknown error' }));
      throw new APIError(response.status, error.error || error.message || 'Request failed');
    }

    return response.json();
  } catch (err: any) {
    if (err.name === 'AbortError') {
      throw new APIError(0, 'Request timed out');
    }
    throw err;
  } finally {
    clearTimeout(timeout);
  }
}

// ─── Profile API ──────────────────────────────────────────────────────────────

export async function getProfile(userId: string) {
  return fetchAPI(`/api/profile/${userId}`);
}

export async function updateProfile(userId: string, data: any) {
  return fetchAPI(`/api/profile/${userId}`, {
    method: 'PUT',
    body: JSON.stringify(data),
  });
}

// ─── Dashboard API ────────────────────────────────────────────────────────────

export async function getDashboardData(userId: string) {
  return fetchAPI(`/api/dashboard/${userId}`);
}

// ─── Courses API ──────────────────────────────────────────────────────────────

export async function getCourses(userId: string) {
  return fetchAPI(`/api/courses/${userId}`);
}

// ─── Grades API ───────────────────────────────────────────────────────────────

export async function getGrades(userId: string) {
  return fetchAPI(`/api/grades/${userId}`);
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

export async function getDeficiencies(userId: string) {
  return fetchAPI(`/api/grades/${userId}/deficiencies`);
}

export async function getGraduationData(userId: string) {
  return fetchAPI(`/api/grades/${userId}/graduation`);
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
