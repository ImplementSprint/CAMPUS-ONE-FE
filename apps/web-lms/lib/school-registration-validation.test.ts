import assert from 'node:assert/strict';
import { describe, it } from 'node:test';

import {
  hasSchoolRegistrationErrors,
  normalizeSchoolRegistrationInput,
  resolveSchoolRegistrationNext,
  validateSchoolRegistration,
} from './school-registration-validation.ts';

describe('school registration validation', () => {
  it('normalizes trimmed school registration payloads', () => {
    const payload = normalizeSchoolRegistrationInput({
      name: '  Campus One Academy  ',
      representative: '  Ada Registrar  ',
      email: ' OWNER@SCHOOL.EDU ',
      contactNumber: ' +63 900 000 0000 ',
      schoolType: ' College ',
      targetSubdomain: ' Demo-School ',
    });

    assert.deepEqual(payload, {
      name: 'Campus One Academy',
      representative: 'Ada Registrar',
      email: 'owner@school.edu',
      contactNumber: '+63 900 000 0000',
      schoolType: 'College',
      targetSubdomain: 'demo-school',
    });
  });

  it('rejects incomplete or unsafe school registration fields', () => {
    const validation = validateSchoolRegistration({
      name: 'IT',
      representative: '',
      email: 'not-an-email',
      contactNumber: '123',
      schoolType: 'Unknown Type',
      targetSubdomain: 'api',
    });

    assert.equal(hasSchoolRegistrationErrors(validation.errors), true);
    assert.equal(validation.errors.name, 'School name must be at least 3 characters.');
    assert.equal(validation.errors.representative, 'Representative name is required.');
    assert.equal(validation.errors.email, 'Use a valid school representative email.');
    assert.equal(validation.errors.contactNumber, 'Use a valid contact number.');
    assert.equal(validation.errors.schoolType, 'Select a supported school type.');
    assert.equal(validation.errors.targetSubdomain, 'This subdomain is reserved.');
  });

  it('accepts a complete supported school registration payload', () => {
    const validation = validateSchoolRegistration({
      name: 'Campus One Academy',
      representative: 'Ada Registrar',
      email: 'owner@school.edu',
      contactNumber: '+63 900 000 0000',
      schoolType: 'University',
      targetSubdomain: 'campus-one-academy',
    });

    assert.equal(hasSchoolRegistrationErrors(validation.errors), false);
    assert.deepEqual(validation.errors, {});
    assert.equal(validation.payload.targetSubdomain, 'campus-one-academy');
  });

  it('maps backend workflow next steps to the submitted registration page', () => {
    assert.equal(
      resolveSchoolRegistrationNext('platform_review', 'campus-one-academy'),
      '/schools/register/submitted?school=campus-one-academy',
    );
  });
});
