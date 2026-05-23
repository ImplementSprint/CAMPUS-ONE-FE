import type {
  AuthMeResponse,
  BillingReconciliationQueueResponse,
  EnrollmentAddDropRequest,
  EnrollmentConfirmationRequest,
  EnrollmentIrregularApprovalRequest,
  EnrollmentRegistrarApprovalRequest,
  EnrollmentWorkflowResponse,
  ManualStudentPaymentRequest,
  ManualStudentPaymentResponse,
  PublicSchool,
  SchoolApproveRequest,
  SchoolOwnerActivationRequest,
  SchoolOwnerActivationResponse,
  SchoolRegistrationRequest,
  SchoolRegistrationResponse,
  SchoolReviewActionRequest,
  SchoolReviewListResponse,
  SchoolReviewRecord,
  SchoolSlugAvailabilityResponse,
  SelectedSchool,
  StudentAnnouncement,
  StudentBillingBalanceResponse,
  StudentClassScheduleItem,
  StudentCurriculumProgressResponse,
  StudentEnrolledCourse,
  StudentHoldsDeficienciesResponse,
  StudentPaymentReceiptResponse,
  TenantContextContract,
  TenantHeaders,
} from '@campus-one/shared-contracts';

export type CampusOneClientOptions = {
  baseUrl?: string;
  fetcher?: typeof fetch;
  schoolSlug?: string | null;
  accessToken?: string | null;
};

export type AuthHeaders = {
  Authorization?: string;
};

export class CampusOneApiError extends Error {
  readonly status: number;

  constructor(
    status: number,
    message: string,
  ) {
    super(message);
    this.name = 'CampusOneApiError';
    this.status = status;
  }
}

export type CampusOneApiErrorTone = 'danger' | 'warning';

export type CampusOneApiErrorDisplay = {
  status: number | null;
  title: string;
  message: string;
  tone: CampusOneApiErrorTone;
};

const API_ERROR_DISPLAY_BY_STATUS: Record<number, Pick<CampusOneApiErrorDisplay, 'title' | 'tone'>> = {
  400: { title: 'Check the submitted details', tone: 'danger' },
  401: { title: 'Sign in required', tone: 'warning' },
  403: { title: 'Access denied', tone: 'warning' },
  404: { title: 'Not found', tone: 'warning' },
  409: { title: 'Conflict found', tone: 'danger' },
  422: { title: 'Check the submitted details', tone: 'danger' },
};

export function formatCampusOneApiError(
  error: unknown,
  fallbackMessage = 'Could not reach the backend server.',
): CampusOneApiErrorDisplay {
  if (error instanceof CampusOneApiError) {
    const display = API_ERROR_DISPLAY_BY_STATUS[error.status] ?? {
      title: error.status >= 500 ? 'Service unavailable' : 'Request failed',
      tone: 'danger' as const,
    };

    return {
      status: error.status,
      title: display.title,
      message: error.message || fallbackMessage,
      tone: display.tone,
    };
  }

  return {
    status: null,
    title: 'Request failed',
    message: error instanceof Error && error.message ? error.message : fallbackMessage,
    tone: 'danger',
  };
}

const DEFAULT_API_BASE_URL = 'http://localhost:4000';

function normalizeBaseUrl(baseUrl?: string): string {
  return (baseUrl ?? DEFAULT_API_BASE_URL).replace(/\/$/, '');
}

export function normalizeSchool(school: PublicSchool, apiBaseUrl = DEFAULT_API_BASE_URL): SelectedSchool {
  return {
    schoolId: school.schoolId,
    schoolSlug: school.schoolSlug.trim().toLowerCase(),
    displayName: school.displayName,
    apiBaseUrl,
  };
}

export function buildTenantHeaders(schoolSlug?: string | null): TenantHeaders {
  const normalized = schoolSlug?.trim().toLowerCase();
  return normalized ? { 'X-School-Slug': normalized } : {};
}

export function buildAuthHeaders(accessToken?: string | null): AuthHeaders {
  const normalized = accessToken?.trim();
  if (!normalized) return {};

  return {
    Authorization: normalized.toLowerCase().startsWith('bearer ') ? normalized : `Bearer ${normalized}`,
  };
}

export function getSchoolSlugFromHost(hostname: string, platformDomain?: string): string | null {
  const host = hostname.split(':')[0]?.toLowerCase();
  if (!host || host === 'localhost' || host === '127.0.0.1') return null;

  const domain = platformDomain?.replace(/^https?:\/\//, '').split(':')[0]?.toLowerCase();
  if (domain && host.endsWith(`.${domain}`)) {
    return host.slice(0, -(domain.length + 1));
  }

  const firstLabel = host.split('.')[0];
  return ['app', 'www', 'portal', 'campus'].includes(firstLabel) ? null : firstLabel;
}

export function buildSchoolPortalUrl(
  schoolSlug: string,
  options: {
    baseUrl?: string;
    platformDomain?: string;
    protocol?: 'http' | 'https';
  } = {},
): string {
  const slug = schoolSlug.trim().toLowerCase();
  if (options.baseUrl) {
    const url = new URL(options.baseUrl);
    url.searchParams.set('school', slug);
    return url.toString();
  }

  const domain = options.platformDomain ?? 'localhost:3001';
  const protocol = options.protocol ?? (domain.startsWith('localhost') ? 'http' : 'https');
  if (domain.startsWith('localhost') || domain.startsWith('127.0.0.1')) {
    const url = new URL(`${protocol}://${domain}`);
    url.searchParams.set('school', slug);
    return url.toString();
  }

  return `${protocol}://${slug}.${domain}`;
}

export function createCampusOneClient(options: CampusOneClientOptions = {}) {
  const baseUrl = normalizeBaseUrl(options.baseUrl);
  const fetcher = options.fetcher ?? fetch;

  function buildRequestHeaders(initHeaders?: HeadersInit): Headers {
    const headers = new Headers({
      'Content-Type': 'application/json',
      ...buildTenantHeaders(options.schoolSlug),
      ...buildAuthHeaders(options.accessToken),
    });

    new Headers(initHeaders).forEach((value, key) => {
      headers.set(key, value);
    });

    return headers;
  }

  async function request<T>(path: string, init: RequestInit = {}): Promise<T> {
    const response = await fetcher(`${baseUrl}${path}`, {
      ...init,
      headers: buildRequestHeaders(init.headers),
    });

    if (!response.ok) {
      const errorBody = await response.json().catch(() => ({ message: 'Request failed' }));
      throw new CampusOneApiError(response.status, errorBody.message ?? errorBody.error ?? 'Request failed');
    }

    return response.json() as Promise<T>;
  }

  return {
    searchSchools(search?: string): Promise<PublicSchool[]> {
      const params = search?.trim() ? `?search=${encodeURIComponent(search.trim())}` : '';
      return request<PublicSchool[]>(`/api/schools${params}`);
    },
    getSchoolBySlug(slug: string): Promise<PublicSchool> {
      return request<PublicSchool>(`/api/schools/${encodeURIComponent(slug)}`);
    },
    registerSchool(payload: SchoolRegistrationRequest): Promise<SchoolRegistrationResponse> {
      return request<SchoolRegistrationResponse>('/api/platform/schools/register', {
        method: 'POST',
        body: JSON.stringify(payload),
      });
    },
    checkSchoolSlugAvailability(slug: string): Promise<SchoolSlugAvailabilityResponse> {
      return request<SchoolSlugAvailabilityResponse>(
        `/api/platform/schools/slug-availability?slug=${encodeURIComponent(slug)}`,
      );
    },
    activateSchoolOwner(payload: SchoolOwnerActivationRequest): Promise<SchoolOwnerActivationResponse> {
      return request<SchoolOwnerActivationResponse>('/api/platform/schools/owner-activation', {
        method: 'POST',
        body: JSON.stringify(payload),
      });
    },
    listPlatformSchools(): Promise<SchoolReviewListResponse> {
      return request<SchoolReviewListResponse>('/api/platform/schools');
    },
    getPlatformSchool(id: string): Promise<SchoolReviewRecord> {
      return request<SchoolReviewRecord>(`/api/platform/schools/${encodeURIComponent(id)}`);
    },
    approvePlatformSchool(id: string, payload: SchoolApproveRequest): Promise<SchoolReviewRecord> {
      return request<SchoolReviewRecord>(`/api/platform/schools/${encodeURIComponent(id)}/approve`, {
        method: 'PATCH',
        body: JSON.stringify(payload),
      });
    },
    rejectPlatformSchool(id: string, payload: SchoolReviewActionRequest): Promise<SchoolReviewRecord> {
      return request<SchoolReviewRecord>(`/api/platform/schools/${encodeURIComponent(id)}/reject`, {
        method: 'PATCH',
        body: JSON.stringify(payload),
      });
    },
    suspendPlatformSchool(id: string, payload: SchoolReviewActionRequest = {}): Promise<SchoolReviewRecord> {
      return request<SchoolReviewRecord>(`/api/platform/schools/${encodeURIComponent(id)}/suspend`, {
        method: 'PATCH',
        body: JSON.stringify(payload),
      });
    },
    reactivatePlatformSchool(id: string, payload: SchoolReviewActionRequest = {}): Promise<SchoolReviewRecord> {
      return request<SchoolReviewRecord>(`/api/platform/schools/${encodeURIComponent(id)}/reactivate`, {
        method: 'PATCH',
        body: JSON.stringify(payload),
      });
    },
    getCurrentAuthUser(): Promise<AuthMeResponse> {
      return request<AuthMeResponse>('/api/auth/me');
    },
    getCurrentTenant(): Promise<TenantContextContract> {
      return request<TenantContextContract>('/api/tenant/current');
    },
    getStudentEnrolledCourses(studentId: string): Promise<StudentEnrolledCourse[]> {
      return request<StudentEnrolledCourse[]>(`/api/v1/student/${encodeURIComponent(studentId)}/enrolled-courses`);
    },
    getStudentClassSchedule(studentId: string): Promise<StudentClassScheduleItem[]> {
      return request<StudentClassScheduleItem[]>(`/api/v1/student/${encodeURIComponent(studentId)}/class-schedule`);
    },
    getStudentCurriculumProgress(studentId: string): Promise<StudentCurriculumProgressResponse> {
      return request<StudentCurriculumProgressResponse>(`/api/v1/student/${encodeURIComponent(studentId)}/curriculum-progress`);
    },
    getStudentHoldsAndDeficiencies(studentId: string): Promise<StudentHoldsDeficienciesResponse> {
      return request<StudentHoldsDeficienciesResponse>(`/api/v1/student/${encodeURIComponent(studentId)}/holds-deficiencies`);
    },
    getStudentAnnouncements(studentId: string): Promise<StudentAnnouncement[]> {
      return request<StudentAnnouncement[]>(`/api/v1/student/${encodeURIComponent(studentId)}/announcements`);
    },
    requestEnrollmentAddDrop(payload: EnrollmentAddDropRequest): Promise<EnrollmentWorkflowResponse> {
      return request<EnrollmentWorkflowResponse>('/api/enrollment/add-drop', {
        method: 'POST',
        body: JSON.stringify(payload),
      });
    },
    requestIrregularEnrollmentApproval(payload: EnrollmentIrregularApprovalRequest): Promise<EnrollmentWorkflowResponse> {
      return request<EnrollmentWorkflowResponse>('/api/enrollment/irregular-approval', {
        method: 'POST',
        body: JSON.stringify(payload),
      });
    },
    approveEnrollmentByRegistrar(payload: EnrollmentRegistrarApprovalRequest): Promise<EnrollmentWorkflowResponse> {
      return request<EnrollmentWorkflowResponse>('/api/enrollment/registrar-approval', {
        method: 'POST',
        body: JSON.stringify(payload),
      });
    },
    confirmEnrollment(payload: EnrollmentConfirmationRequest): Promise<EnrollmentWorkflowResponse> {
      return request<EnrollmentWorkflowResponse>('/api/enrollment/confirm', {
        method: 'POST',
        body: JSON.stringify(payload),
      });
    },
    getStudentBillingBalance(studentId: string): Promise<StudentBillingBalanceResponse> {
      return request<StudentBillingBalanceResponse>(`/api/billing/student/${encodeURIComponent(studentId)}/balance`);
    },
    recordManualStudentPayment(
      studentId: string,
      payload: ManualStudentPaymentRequest,
    ): Promise<ManualStudentPaymentResponse> {
      return request<ManualStudentPaymentResponse>(`/api/billing/student/${encodeURIComponent(studentId)}/manual-payments`, {
        method: 'POST',
        body: JSON.stringify(payload),
      });
    },
    getStudentPaymentReceipt(studentId: string, paymentId: string): Promise<StudentPaymentReceiptResponse> {
      return request<StudentPaymentReceiptResponse>(
        `/api/billing/student/${encodeURIComponent(studentId)}/receipts/${encodeURIComponent(paymentId)}`,
      );
    },
    getBillingReconciliationQueue(): Promise<BillingReconciliationQueueResponse> {
      return request<BillingReconciliationQueueResponse>('/api/billing/admin/reconciliation');
    },
    request,
  };
}
