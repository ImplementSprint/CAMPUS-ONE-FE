import type { SchoolOwnerActivationRequest } from '@campus-one/shared-contracts';

export type SchoolOwnerActivationErrors = {
  token?: string;
  password?: string;
};

const PASSWORD_PATTERN = /^(?=.*[A-Za-z])(?=.*\d).{8,}$/;

export function normalizeSchoolOwnerActivationInput(input: Partial<SchoolOwnerActivationRequest>): SchoolOwnerActivationRequest {
  const token = input.token?.trim();
  const tokenHash = input.tokenHash?.trim();

  return {
    ...(token ? { token } : {}),
    ...(tokenHash ? { tokenHash } : {}),
    password: input.password?.trim() ?? '',
  };
}

export function validateSchoolOwnerActivation(input: Partial<SchoolOwnerActivationRequest>): {
  payload: SchoolOwnerActivationRequest;
  errors: SchoolOwnerActivationErrors;
} {
  const payload = normalizeSchoolOwnerActivationInput(input);
  const errors: SchoolOwnerActivationErrors = {};
  const tokenCount = Number(Boolean(payload.token)) + Number(Boolean(payload.tokenHash));

  if (tokenCount === 0) {
    errors.token = 'Activation link is missing or expired.';
  } else if (tokenCount > 1) {
    errors.token = 'Use one activation token source.';
  }

  if (!PASSWORD_PATTERN.test(payload.password)) {
    errors.password = 'Password must be at least 8 characters and include a letter and number.';
  }

  return { payload, errors };
}

export function hasSchoolOwnerActivationErrors(errors: SchoolOwnerActivationErrors): boolean {
  return Object.keys(errors).length > 0;
}
