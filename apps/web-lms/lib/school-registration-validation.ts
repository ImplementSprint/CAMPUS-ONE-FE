import type { SchoolRegistrationRequest } from '@campus-one/shared-contracts';

export type SchoolRegistrationErrors = Partial<Record<keyof SchoolRegistrationRequest, string>>;

export const SUPPORTED_SCHOOL_TYPES = [
  'Basic Education',
  'College',
  'University',
  'Training Center',
  'Review Center',
] as const;

const SUPPORTED_SCHOOL_TYPE_SET = new Set<string>(SUPPORTED_SCHOOL_TYPES);

const RESERVED_SUBDOMAINS = new Set([
  'admin',
  'api',
  'app',
  'auth',
  'billing',
  'campus',
  'dashboard',
  'mail',
  'platform',
  'portal',
  'root',
  'school',
  'schools',
  'status',
  'support',
  'www',
]);

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const PHONE_PATTERN = /^[+()\d\s.-]{7,24}$/;
const SUBDOMAIN_PATTERN = /^[a-z0-9](?:[a-z0-9-]{1,61}[a-z0-9])$/;

export function normalizeSchoolRegistrationInput(input: Partial<SchoolRegistrationRequest>): SchoolRegistrationRequest {
  return {
    name: input.name?.trim() ?? '',
    representative: input.representative?.trim() ?? '',
    email: input.email?.trim().toLowerCase() ?? '',
    contactNumber: input.contactNumber?.trim() ?? '',
    schoolType: input.schoolType?.trim() ?? '',
    targetSubdomain: input.targetSubdomain?.trim().toLowerCase() ?? '',
  };
}

export function validateSchoolRegistration(input: Partial<SchoolRegistrationRequest>): {
  payload: SchoolRegistrationRequest;
  errors: SchoolRegistrationErrors;
} {
  const payload = normalizeSchoolRegistrationInput(input);
  const errors: SchoolRegistrationErrors = {};

  if (payload.name.length < 3) errors.name = 'School name must be at least 3 characters.';
  if (payload.representative.length < 2) errors.representative = 'Representative name is required.';
  if (!EMAIL_PATTERN.test(payload.email)) errors.email = 'Use a valid school representative email.';
  if (!PHONE_PATTERN.test(payload.contactNumber)) errors.contactNumber = 'Use a valid contact number.';
  if (!payload.schoolType) {
    errors.schoolType = 'Select a school type.';
  } else if (!SUPPORTED_SCHOOL_TYPE_SET.has(payload.schoolType)) {
    errors.schoolType = 'Select a supported school type.';
  }

  if (!SUBDOMAIN_PATTERN.test(payload.targetSubdomain)) {
    errors.targetSubdomain = 'Use 3-63 lowercase letters, numbers, or hyphens.';
  } else if (RESERVED_SUBDOMAINS.has(payload.targetSubdomain)) {
    errors.targetSubdomain = 'This subdomain is reserved.';
  }

  return { payload, errors };
}

export function hasSchoolRegistrationErrors(errors: SchoolRegistrationErrors): boolean {
  return Object.keys(errors).length > 0;
}

export function resolveSchoolRegistrationNext(next: string | undefined, targetSubdomain: string): string {
  if (next?.startsWith('/')) return next;

  const school = encodeURIComponent(targetSubdomain.trim().toLowerCase());
  return `/schools/register/submitted?school=${school}`;
}
