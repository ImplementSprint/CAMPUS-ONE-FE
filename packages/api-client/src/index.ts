import type {
  PlatformSchoolListResponse,
  PlatformSchoolReviewActionResponse,
  PlatformSchoolReviewRecord,
  PublicSchool,
  SchoolRegistrationRequest,
  SchoolRegistrationResponse,
  SelectedSchool,
  TenantHeaders,
} from '@campus-one/shared-contracts';

export type CampusOneClientOptions = {
  baseUrl?: string;
  fetcher?: typeof fetch;
  schoolSlug?: string | null;
  accessToken?: string | null;
};

export class CampusOneApiError extends Error {
  constructor(
    public readonly status: number,
    message: string,
  ) {
    super(message);
    this.name = 'CampusOneApiError';
  }
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

  async function request<T>(path: string, init: RequestInit = {}): Promise<T> {
    const response = await fetcher(`${baseUrl}${path}`, {
      ...init,
      headers: {
        'Content-Type': 'application/json',
        ...(options.accessToken ? { Authorization: `Bearer ${options.accessToken}` } : {}),
        ...buildTenantHeaders(options.schoolSlug),
        ...init.headers,
      },
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
    listPlatformSchools(status?: string): Promise<PlatformSchoolListResponse> {
      const params = status?.trim() ? `?status=${encodeURIComponent(status.trim())}` : '';
      return request<PlatformSchoolListResponse>(`/api/platform/schools${params}`);
    },
    getPlatformSchool(id: string): Promise<PlatformSchoolReviewRecord> {
      return request<PlatformSchoolReviewRecord>(`/api/platform/schools/${encodeURIComponent(id)}`);
    },
    approvePlatformSchool(id: string): Promise<PlatformSchoolReviewActionResponse> {
      return request<PlatformSchoolReviewActionResponse>(`/api/platform/schools/${encodeURIComponent(id)}/approve`, {
        method: 'POST',
      });
    },
    rejectPlatformSchool(id: string, reason: string): Promise<PlatformSchoolReviewActionResponse> {
      return request<PlatformSchoolReviewActionResponse>(`/api/platform/schools/${encodeURIComponent(id)}/reject`, {
        method: 'POST',
        body: JSON.stringify({ reason }),
      });
    },
    suspendPlatformSchool(id: string, reason?: string): Promise<PlatformSchoolReviewActionResponse> {
      return request<PlatformSchoolReviewActionResponse>(`/api/platform/schools/${encodeURIComponent(id)}/suspend`, {
        method: 'POST',
        body: JSON.stringify({ reason }),
      });
    },
    reactivatePlatformSchool(id: string, reason?: string): Promise<PlatformSchoolReviewActionResponse> {
      return request<PlatformSchoolReviewActionResponse>(`/api/platform/schools/${encodeURIComponent(id)}/reactivate`, {
        method: 'POST',
        body: JSON.stringify({ reason }),
      });
    },
    request,
  };
}
