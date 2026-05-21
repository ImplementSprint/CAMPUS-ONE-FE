import { cookies } from 'next/headers';
import type { ResourceName, SchoolProfile } from './types';

const DATA_SERVICE = process.env.DATA_SERVICE_URL ?? 'http://localhost:4001';

async function getUserId(): Promise<string> {
  const cookieStore = await cookies();
  return cookieStore.get('user_id')?.value ?? '';
}

async function apiFetch(path: string, options: RequestInit = {}) {
  const userId = await getUserId();
  const res = await fetch(`${DATA_SERVICE}/api${path}`, {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      'x-user-id': userId,
      ...(options.headers ?? {}),
    },
  });
  if (!res.ok) {
    const err = await res.json().catch(() => ({ message: 'Request failed' }));
    throw new Error(err.message ?? 'Request failed');
  }
  return res.json();
}

// ─── Resource helpers ─────────────────────────────────────────────────────────

export const resourceNames: ResourceName[] = [
  'classes', 'subjects', 'students', 'employees',
  'accounts', 'fees', 'salary', 'attendance', 'notifications',
];

export function isResourceName(value: string): value is ResourceName {
  return resourceNames.includes(value as ResourceName);
}

export async function listResource(resource: ResourceName, search?: string) {
  const qs = search ? `?search=${encodeURIComponent(search)}` : '';
  return apiFetch(`/resources/${resource}${qs}`);
}

export async function createResource(resource: ResourceName, payload: Record<string, string>) {
  return apiFetch(`/resources/${resource}`, {
    method: 'POST',
    body: JSON.stringify(payload),
  });
}

export async function updateResource(resource: ResourceName, id: string, payload: Record<string, string>) {
  return apiFetch(`/resources/${resource}/${id}`, {
    method: 'PATCH',
    body: JSON.stringify(payload),
  });
}

export async function deleteResource(resource: ResourceName, id: string) {
  return apiFetch(`/resources/${resource}/${id}`, { method: 'DELETE' });
}

// ─── Dashboard ────────────────────────────────────────────────────────────────

export async function dashboardSummary() {
  return apiFetch('/dashboard');
}

export async function readDb() {
  const summary = await apiFetch('/dashboard').catch(() => ({
    totalStudents: 0, totalEmployees: 0, revenue: 0, profit: 0,
  }));
  return {
    students:   Array(summary.totalStudents).fill({}),
    employees:  Array(summary.totalEmployees).fill({}),
    fees:       [{ amount: String(summary.revenue) }],
    salary:     [{ baseSalary: String(summary.revenue - summary.profit) }],
    activities: [], actionLogs: [], schools: {}, users: [],
    classes: [], subjects: [], accounts: [], attendance: [],
  };
}

// ─── School profile ───────────────────────────────────────────────────────────

export async function getSchoolForUser(_userId: string): Promise<SchoolProfile> {
  const data = await apiFetch('/school/profile').catch(() => null);
  return data ?? {
    id: '', name: '', representative: '', email: '',
    contactNumber: '', schoolType: '', targetSubdomain: '',
    status: 'draft' as const, setupProgress: 0,
  };
}

export async function updateSchoolForUser(_userId: string, payload: Partial<SchoolProfile>) {
  return apiFetch('/school/profile', {
    method: 'PATCH',
    body: JSON.stringify(payload),
  });
}

// ─── Notifications ────────────────────────────────────────────────────────────

export async function markAllNotificationsRead() {
  return apiFetch('/notifications/read-all', { method: 'PATCH' });
}

// ─── Activity log (no-op — server handles this internally) ────────────────────

export async function logAction(_module: string, _label: string) {
  return { id: `action-${Date.now()}`, label: _label, module: _module, createdAt: new Date().toISOString() };
}
