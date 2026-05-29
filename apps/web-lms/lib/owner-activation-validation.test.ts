import assert from 'node:assert/strict';
import { describe, it } from 'node:test';

import {
  hasSchoolOwnerActivationErrors,
  normalizeSchoolOwnerActivationInput,
  validateSchoolOwnerActivation,
} from './owner-activation-validation.ts';

describe('school owner activation validation', () => {
  it('normalizes token and password activation payloads', () => {
    const payload = normalizeSchoolOwnerActivationInput({
      token: ' owner-token ',
      tokenHash: ' ',
      password: '  SecurePass123  ',
    });

    assert.deepEqual(payload, {
      token: 'owner-token',
      password: 'SecurePass123',
    });
  });

  it('requires one activation token and a strong enough password', () => {
    const validation = validateSchoolOwnerActivation({
      token: '',
      tokenHash: '',
      password: 'short',
    });

    assert.equal(hasSchoolOwnerActivationErrors(validation.errors), true);
    assert.equal(validation.errors.token, 'Activation link is missing or expired.');
    assert.equal(validation.errors.password, 'Password must be at least 8 characters and include a letter and number.');
  });

  it('rejects ambiguous activation payloads with both token forms', () => {
    const validation = validateSchoolOwnerActivation({
      token: 'owner-token',
      tokenHash: 'owner-token-hash',
      password: 'SecurePass123',
    });

    assert.equal(validation.errors.token, 'Use one activation token source.');
  });

  it('accepts token-hash activation payloads with valid passwords', () => {
    const validation = validateSchoolOwnerActivation({
      tokenHash: 'owner-token-hash',
      password: 'SecurePass123',
    });

    assert.equal(hasSchoolOwnerActivationErrors(validation.errors), false);
    assert.deepEqual(validation.errors, {});
    assert.deepEqual(validation.payload, {
      tokenHash: 'owner-token-hash',
      password: 'SecurePass123',
    });
  });
});
