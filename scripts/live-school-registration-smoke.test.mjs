import test from 'node:test';
import assert from 'node:assert/strict';

import {
  buildRegistrationPayload,
  summarizeSubmittedRegistration,
} from './live-school-registration-smoke.mjs';

test('builds a valid unique registration payload for the live sandbox form', () => {
  const payload = buildRegistrationPayload({ suffix: '20260525123456' });

  assert.deepEqual(payload, {
    name: 'Campus One Smoke School 20260525123456',
    representative: 'Campus One QA',
    email: 'owner.20260525123456@campus-one-smoke.test',
    contactNumber: '+63 917 000 0000',
    schoolType: 'College',
    targetSubdomain: 'smoke-20260525123456',
  });
});

test('summarizes submitted registration without leaking form-only details', () => {
  const payload = buildRegistrationPayload({ suffix: '20260525123456' });
  const result = summarizeSubmittedRegistration({
    payload,
    finalUrl: 'https://itsandbox.site/schools/register/submitted?school=smoke-20260525123456',
    screenshot: 'C:/Temp/submitted.png',
    consoleEvents: [{ type: 'warning', text: 'ignored' }],
  });

  assert.deepEqual(result, {
    name: 'platform-school-registration',
    status: 'passed',
    finalUrl: 'https://itsandbox.site/schools/register/submitted?school=smoke-20260525123456',
    requestedSubdomain: 'smoke-20260525123456',
    evidence: [
      'School registration is under review',
      'Requested subdomain: smoke-20260525123456',
    ],
    screenshot: 'C:/Temp/submitted.png',
    consoleEvents: [{ type: 'warning', text: 'ignored' }],
  });
  assert.equal(JSON.stringify(result).includes('owner.20260525123456'), false);
});
