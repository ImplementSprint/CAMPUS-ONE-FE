import assert from 'node:assert/strict';
import { describe, it } from 'node:test';

import {
  buildAuthHeaders,
  CampusOneApiError,
  createCampusOneClient,
  formatCampusOneApiError,
} from './index.ts';

function jsonResponse(body: unknown, init: ResponseInit = {}) {
  return new Response(JSON.stringify(body), {
    status: 200,
    headers: { 'Content-Type': 'application/json' },
    ...init,
  });
}

describe('Campus One API client auth bootstrap helpers', () => {
  it('sends tenant and bearer headers when loading the current auth user', async () => {
    const requests: Array<{ url: string; init?: RequestInit }> = [];
    const client = createCampusOneClient({
      baseUrl: 'https://api.campusone.test/',
      schoolSlug: ' San-Beda ',
      accessToken: 'session-token',
      fetcher: async (url, init) => {
        requests.push({ url: String(url), init });
        return jsonResponse({ user: { id: 'user-1', email: 'user@school.test', role: 'student' } });
      },
    });

    const result = await client.getCurrentAuthUser();

    assert.deepEqual(result, {
      user: { id: 'user-1', email: 'user@school.test', role: 'student' },
    });
    assert.equal(requests[0]?.url, 'https://api.campusone.test/api/auth/me');

    const headers = new Headers(requests[0]?.init?.headers);
    assert.equal(headers.get('Content-Type'), 'application/json');
    assert.equal(headers.get('X-School-Slug'), 'san-beda');
    assert.equal(headers.get('Authorization'), 'Bearer session-token');
  });

  it('loads the current tenant context with the selected school header', async () => {
    const requests: Array<{ url: string; init?: RequestInit }> = [];
    const client = createCampusOneClient({
      baseUrl: 'https://api.campusone.test',
      schoolSlug: 'ust',
      fetcher: async (url, init) => {
        requests.push({ url: String(url), init });
        return jsonResponse({ schoolSlug: 'ust', source: 'mobile-header' });
      },
    });

    const result = await client.getCurrentTenant();

    assert.deepEqual(result, { schoolSlug: 'ust', source: 'mobile-header' });
    assert.equal(requests[0]?.url, 'https://api.campusone.test/api/tenant/current');

    const headers = new Headers(requests[0]?.init?.headers);
    assert.equal(headers.get('X-School-Slug'), 'ust');
  });

  it('normalizes auth tokens for Authorization headers', () => {
    assert.deepEqual(buildAuthHeaders('session-token'), {
      Authorization: 'Bearer session-token',
    });
    assert.deepEqual(buildAuthHeaders('Bearer existing-token'), {
      Authorization: 'Bearer existing-token',
    });
    assert.deepEqual(buildAuthHeaders('  '), {});
    assert.deepEqual(buildAuthHeaders(null), {});
  });

  it('submits public school registrations to the backend platform route', async () => {
    const requests: Array<{ url: string; init?: RequestInit }> = [];
    const client = createCampusOneClient({
      baseUrl: 'https://api.campusone.test',
      fetcher: async (url, init) => {
        requests.push({ url: String(url), init });
        return jsonResponse({
          message: 'School registration submitted for review.',
          school: {
            schoolId: 'school-1',
            schoolSlug: 'san-beda',
            displayName: 'San Beda',
            schoolType: 'Higher Education',
            status: 'submitted',
          },
          next: '/dashboard?school=san-beda',
        });
      },
    });

    const payload = {
      name: 'San Beda',
      representative: 'Ana Santos',
      email: 'admin@sanbeda.test',
      contactNumber: '+63 900 000 0000',
      schoolType: 'Higher Education',
      targetSubdomain: 'san-beda',
    };

    const result = await client.registerSchool(payload);

    assert.equal(requests[0]?.url, 'https://api.campusone.test/api/platform/schools/register');
    assert.equal(requests[0]?.init?.method, 'POST');

    const headers = new Headers(requests[0]?.init?.headers);
    assert.equal(headers.get('Content-Type'), 'application/json');
    assert.deepEqual(JSON.parse(String(requests[0]?.init?.body)), payload);
    assert.deepEqual(result, {
      message: 'School registration submitted for review.',
      school: {
        schoolId: 'school-1',
        schoolSlug: 'san-beda',
        displayName: 'San Beda',
        schoolType: 'Higher Education',
        status: 'submitted',
      },
      next: '/dashboard?school=san-beda',
    });
  });

  it('checks public school slug availability through the backend platform route', async () => {
    const requests: Array<{ url: string; init?: RequestInit }> = [];
    const client = createCampusOneClient({
      baseUrl: 'https://api.campusone.test',
      fetcher: async (url, init) => {
        requests.push({ url: String(url), init });
        return jsonResponse({
          slug: 'san-beda',
          available: true,
        });
      },
    });

    const result = await client.checkSchoolSlugAvailability('San Beda');

    assert.equal(
      requests[0]?.url,
      'https://api.campusone.test/api/platform/schools/slug-availability?slug=San%20Beda',
    );
    assert.deepEqual(result, {
      slug: 'san-beda',
      available: true,
    });
  });

  it('submits owner activation tokens to the backend platform route', async () => {
    const requests: Array<{ url: string; init?: RequestInit }> = [];
    const client = createCampusOneClient({
      baseUrl: 'https://api.campusone.test',
      fetcher: async (url, init) => {
        requests.push({ url: String(url), init });
        return jsonResponse({
          message: 'Owner account created. Continue to the tenant portal.',
          school: {
            schoolId: 'school-1',
            schoolSlug: 'san-beda',
            displayName: 'San Beda',
            status: 'approved',
          },
          next: 'tenant_portal_login',
          portalUrl: 'https://san-beda.itsandbox.site',
          ownerInvitationStatus: 'accepted',
          onboardingStatus: 'approved',
        });
      },
    });

    const result = await client.activateSchoolOwner({ token: 'owner-token', password: 'secure-password' });

    assert.equal(requests[0]?.url, 'https://api.campusone.test/api/platform/schools/owner-activation');
    assert.equal(requests[0]?.init?.method, 'POST');
    assert.deepEqual(JSON.parse(String(requests[0]?.init?.body)), {
      token: 'owner-token',
      password: 'secure-password',
    });
    assert.equal(result.ownerInvitationStatus, 'accepted');
    assert.equal(result.portalUrl, 'https://san-beda.itsandbox.site');
  });

  it('loads platform schools for super-admin review', async () => {
    const requests: Array<{ url: string; init?: RequestInit }> = [];
    const client = createCampusOneClient({
      baseUrl: 'https://api.campusone.test',
      accessToken: 'platform-token',
      fetcher: async (url, init) => {
        requests.push({ url: String(url), init });
        return jsonResponse({
          schools: [
            {
              schoolId: 'school-1',
              schoolSlug: 'san-beda',
              displayName: 'San Beda',
              schoolType: 'Higher Education',
              status: 'pending_review',
            },
          ],
        });
      },
    });

    const result = await client.listPlatformSchools();

    assert.equal(requests[0]?.url, 'https://api.campusone.test/api/platform/schools');
    assert.equal(requests[0]?.init?.method, undefined);

    const headers = new Headers(requests[0]?.init?.headers);
    assert.equal(headers.get('Authorization'), 'Bearer platform-token');
    assert.deepEqual(result, {
      schools: [
        {
          schoolId: 'school-1',
          schoolSlug: 'san-beda',
          displayName: 'San Beda',
          schoolType: 'Higher Education',
          status: 'pending_review',
        },
      ],
    });
  });

  it('loads one platform school review record by id', async () => {
    const requests: Array<{ url: string; init?: RequestInit }> = [];
    const client = createCampusOneClient({
      baseUrl: 'https://api.campusone.test',
      fetcher: async (url, init) => {
        requests.push({ url: String(url), init });
        return jsonResponse({
          school: {
            schoolId: 'school/with spaces',
            schoolSlug: 'sample-school',
            displayName: 'Sample School',
            status: 'approved',
          },
        });
      },
    });

    const result = await client.getPlatformSchool('school/with spaces');

    assert.equal(requests[0]?.url, 'https://api.campusone.test/api/platform/schools/school%2Fwith%20spaces');
    assert.deepEqual(result.school.schoolId, 'school/with spaces');
  });

  it('submits platform school review actions to action-specific routes', async () => {
    const requests: Array<{ url: string; init?: RequestInit }> = [];
    const client = createCampusOneClient({
      baseUrl: 'https://api.campusone.test',
      fetcher: async (url, init) => {
        requests.push({ url: String(url), init });
        return jsonResponse({
          school: {
            schoolId: 'school-1',
            schoolSlug: 'san-beda',
            displayName: 'San Beda',
            status: 'approved',
          },
        });
      },
    });

    const actions = [
      ['approvePlatformSchool', 'approve', { approverId: 'admin-1', approverEmail: 'admin@campus.test' }],
      ['rejectPlatformSchool', 'reject', { reason: 'Incomplete documents.', actorEmail: 'admin@campus.test' }],
      ['suspendPlatformSchool', 'suspend', { reason: 'Billing review.' }],
      ['reactivatePlatformSchool', 'reactivate', { reason: 'Issue resolved.' }],
    ] as const;

    for (const [methodName, action, payload] of actions) {
      const result = await client[methodName]('school-1', payload);
      const request = requests.at(-1);

      assert.equal(request?.url, `https://api.campusone.test/api/platform/schools/school-1/${action}`);
      assert.equal(request?.init?.method, 'PATCH');
      assert.deepEqual(JSON.parse(String(request?.init?.body)), payload);
      assert.equal(result.school.status, 'approved');
    }
  });

  it('calls Phase 8 student, enrollment, and billing routes through typed helpers', async () => {
    const requests: Array<{ url: string; init?: RequestInit }> = [];
    const client = createCampusOneClient({
      baseUrl: 'https://api.campusone.test',
      schoolSlug: 'san-beda',
      accessToken: 'student-token',
      fetcher: async (url, init) => {
        requests.push({ url: String(url), init });
        return jsonResponse({ success: true, status: 'confirmed', payments: [] });
      },
    });

    await client.getStudentEnrolledCourses('student/1');
    await client.getStudentClassSchedule('student/1');
    await client.getStudentCurriculumProgress('student/1');
    await client.getStudentHoldsAndDeficiencies('student/1');
    await client.getStudentAnnouncements('student/1');
    await client.requestEnrollmentAddDrop({ studentId: 'student/1', dropEnrollmentIds: ['enrollment-1'] });
    await client.requestIrregularEnrollmentApproval({
      studentId: 'student/1',
      classAssignmentIds: ['class-1'],
      reason: 'Graduating',
    });
    await client.approveEnrollmentByRegistrar({ requestId: 'request/1', registrarId: 'registrar/1' });
    await client.confirmEnrollment({ studentId: 'student/1', enrollmentIds: ['enrollment-1'] });
    await client.getStudentBillingBalance('student/1');
    await client.recordManualStudentPayment('student/1', { amount: 1000, referenceNumber: 'REF-1' });
    await client.getStudentPaymentReceipt('student/1', 'payment/1');
    await client.getBillingReconciliationQueue();

    assert.deepEqual(requests.map((request) => request.url), [
      'https://api.campusone.test/api/v1/student/student%2F1/enrolled-courses',
      'https://api.campusone.test/api/v1/student/student%2F1/class-schedule',
      'https://api.campusone.test/api/v1/student/student%2F1/curriculum-progress',
      'https://api.campusone.test/api/v1/student/student%2F1/holds-deficiencies',
      'https://api.campusone.test/api/v1/student/student%2F1/announcements',
      'https://api.campusone.test/api/enrollment/add-drop',
      'https://api.campusone.test/api/enrollment/irregular-approval',
      'https://api.campusone.test/api/enrollment/registrar-approval',
      'https://api.campusone.test/api/enrollment/confirm',
      'https://api.campusone.test/api/billing/student/student%2F1/balance',
      'https://api.campusone.test/api/billing/student/student%2F1/manual-payments',
      'https://api.campusone.test/api/billing/student/student%2F1/receipts/payment%2F1',
      'https://api.campusone.test/api/billing/admin/reconciliation',
    ]);
    assert.equal(requests[5]?.init?.method, 'POST');
    assert.deepEqual(JSON.parse(String(requests[10]?.init?.body)), {
      amount: 1000,
      referenceNumber: 'REF-1',
    });
  });

  it('formats backend API errors into consistent display metadata', () => {
    assert.deepEqual(formatCampusOneApiError(new CampusOneApiError(401, 'Session expired.')), {
      status: 401,
      title: 'Sign in required',
      message: 'Session expired.',
      tone: 'warning',
    });

    assert.deepEqual(formatCampusOneApiError(new CampusOneApiError(403, 'Only registrar users can continue.')), {
      status: 403,
      title: 'Access denied',
      message: 'Only registrar users can continue.',
      tone: 'warning',
    });

    assert.deepEqual(formatCampusOneApiError(new CampusOneApiError(422, 'Target subdomain is already taken.')), {
      status: 422,
      title: 'Check the submitted details',
      message: 'Target subdomain is already taken.',
      tone: 'danger',
    });
  });

  it('formats network and unknown errors with stable fallback display metadata', () => {
    assert.deepEqual(formatCampusOneApiError(new Error('fetch failed')), {
      status: null,
      title: 'Request failed',
      message: 'fetch failed',
      tone: 'danger',
    });

    assert.deepEqual(formatCampusOneApiError(null), {
      status: null,
      title: 'Request failed',
      message: 'Could not reach the backend server.',
      tone: 'danger',
    });
  });
});
