import {
  createCampusOneClient,
  getSchoolSlugFromHost,
} from '@campus-one/api-client';
import type { AuthMeResponse, TenantContextContract } from '@campus-one/shared-contracts';

import type { AuthUser, UserRole } from './auth.service';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000';
const AUTH_USER_STORAGE_KEY = 'auth_user';
const BACKEND_TENANT_STORAGE_KEY = 'backend_tenant';
const BACKEND_ACCESS_TOKEN_STORAGE_KEY = 'backend_access_token';

const supportedRoles = [
  'applicant',
  'student',
  'professor',
  'alumni',
  'super_admin',
  'applicant_admin',
  'student_admin',
  'alumni_admin',
] as const satisfies readonly UserRole[];

export type BackendTenantSession = {
  institutionId?: string;
  schoolSlug?: string;
  source: TenantContextContract['source'];
};

export type BackendAuthBootstrap = {
  user: AuthUser;
  tenant: BackendTenantSession;
};

export type SelectedSchoolSlugInputs = {
  search?: string;
  hostname?: string;
  platformDomain?: string;
  storage?: Pick<Storage, 'getItem'> | null;
  fallbackSlug?: string | null;
};

type BackendBootstrapPayload = {
  auth: AuthMeResponse;
  tenant: TenantContextContract;
};

function isUserRole(role: string | null | undefined): role is UserRole {
  return !!role && supportedRoles.includes(role as UserRole);
}

export function normalizeBackendBootstrap(payload: BackendBootstrapPayload): BackendAuthBootstrap | null {
  const currentUser = payload.auth.user;
  if (!currentUser?.id || !currentUser.email || !isUserRole(currentUser.role)) {
    return null;
  }

  return {
    user: {
      id: currentUser.id,
      email: currentUser.email,
      role: currentUser.role,
    },
    tenant: {
      institutionId: payload.tenant.institutionId ?? currentUser.activeInstitutionId ?? undefined,
      schoolSlug: payload.tenant.schoolSlug,
      source: payload.tenant.source,
    },
  };
}

export function readCachedBackendAuthUser(storage: Storage | null | undefined): AuthUser | null {
  if (!storage) return null;

  const cached = storage.getItem(AUTH_USER_STORAGE_KEY);
  if (!cached) return null;

  try {
    const parsed = JSON.parse(cached) as Partial<AuthUser>;
    if (parsed.id && parsed.email && isUserRole(parsed.role)) {
      return {
        id: parsed.id,
        email: parsed.email,
        role: parsed.role,
      };
    }
  } catch {
    return null;
  }

  return null;
}

export function writeCachedBackendAuthUser(storage: Storage | null | undefined, user: AuthUser): void {
  if (!storage) return;
  storage.setItem(AUTH_USER_STORAGE_KEY, JSON.stringify(user));
}

export function writeCachedBackendTenant(storage: Storage | null | undefined, tenant: BackendTenantSession): void {
  if (!storage) return;
  storage.setItem(BACKEND_TENANT_STORAGE_KEY, JSON.stringify(tenant));
}

export function writeCachedBackendAccessToken(storage: Storage | null | undefined, accessToken: string | null | undefined): void {
  if (!storage) return;
  const normalized = accessToken?.trim();
  if (!normalized) {
    storage.removeItem(BACKEND_ACCESS_TOKEN_STORAGE_KEY);
    return;
  }
  storage.setItem(BACKEND_ACCESS_TOKEN_STORAGE_KEY, normalized);
}

export function readCachedBackendAccessToken(storage: Storage | null | undefined): string | null {
  if (!storage) return null;
  const token = storage.getItem(BACKEND_ACCESS_TOKEN_STORAGE_KEY)?.trim();
  return token || null;
}

export function clearCachedBackendSession(storage: Storage | null | undefined): void {
  if (!storage) return;
  storage.removeItem(AUTH_USER_STORAGE_KEY);
  storage.removeItem(BACKEND_TENANT_STORAGE_KEY);
  storage.removeItem(BACKEND_ACCESS_TOKEN_STORAGE_KEY);
}

export function resolveSelectedSchoolSlug({
  search = '',
  hostname = '',
  platformDomain,
  storage,
  fallbackSlug = null,
}: SelectedSchoolSlugInputs): string | null {
  const fromQuery = new URLSearchParams(search).get('school');
  if (fromQuery) return fromQuery;

  const fromHost = getSchoolSlugFromHost(hostname, platformDomain);
  if (fromHost) return fromHost;

  const stored = storage?.getItem('campus-one:selected-school');
  if (!stored) return null;

  try {
    return JSON.parse(stored).schoolSlug ?? null;
  } catch {
    return fallbackSlug;
  }
}

export function getSelectedSchoolSlug(): string | null {
  if (typeof window === 'undefined') {
    return process.env.NEXT_PUBLIC_SCHOOL_SLUG ?? null;
  }

  return resolveSelectedSchoolSlug({
    search: window.location.search,
    hostname: window.location.hostname,
    platformDomain: process.env.NEXT_PUBLIC_SCHOOL_PORTAL_DOMAIN,
    storage: window.localStorage,
    fallbackSlug: process.env.NEXT_PUBLIC_SCHOOL_SLUG ?? null,
  });
}

export async function loadBackendAuthBootstrap(accessToken?: string | null): Promise<BackendAuthBootstrap | null> {
  const client = createCampusOneClient({
    baseUrl: API_BASE_URL,
    schoolSlug: getSelectedSchoolSlug(),
    accessToken,
    fetcher: (url, init) => fetch(url, { ...init, credentials: 'include' }),
  });

  try {
    const [auth, tenant] = await Promise.all([
      client.getCurrentAuthUser(),
      client.getCurrentTenant(),
    ]);

    const bootstrap = normalizeBackendBootstrap({ auth, tenant });
    if (typeof window !== 'undefined' && bootstrap) {
      writeCachedBackendAuthUser(window.sessionStorage, bootstrap.user);
      writeCachedBackendTenant(window.sessionStorage, bootstrap.tenant);
      writeCachedBackendAccessToken(window.sessionStorage, accessToken);
    }
    return bootstrap;
  } catch {
    return null;
  }
}
