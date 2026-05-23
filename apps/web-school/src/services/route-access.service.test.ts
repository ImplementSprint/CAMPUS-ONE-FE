import assert from 'node:assert/strict';
import { describe, it } from 'node:test';

import { decideProtectedRouteAccess } from './route-access.service.ts';

describe('web-school protected route access decisions', () => {
  it('blocks rendering without redirect while auth is loading', () => {
    assert.deepEqual(
      decideProtectedRouteAccess({
        loading: true,
        hasUser: false,
        role: null,
      }),
      { canRender: false, redirectTo: null },
    );
  });

  it('redirects anonymous users to login', () => {
    assert.deepEqual(
      decideProtectedRouteAccess({
        loading: false,
        hasUser: false,
        role: null,
      }),
      { canRender: false, redirectTo: '/login' },
    );
  });

  it('redirects users with required roles but no role to login', () => {
    assert.deepEqual(
      decideProtectedRouteAccess({
        loading: false,
        hasUser: true,
        role: null,
        allowedRoles: ['student'],
      }),
      { canRender: false, redirectTo: '/login' },
    );
  });

  it("redirects users with the wrong known role to that role's home path", () => {
    assert.deepEqual(
      decideProtectedRouteAccess({
        loading: false,
        hasUser: true,
        role: 'student',
        allowedRoles: ['applicant'],
      }),
      { canRender: false, redirectTo: '/dashboard' },
    );
  });

  it('allows users with an allowed role to render', () => {
    assert.deepEqual(
      decideProtectedRouteAccess({
        loading: false,
        hasUser: true,
        role: 'student',
        allowedRoles: ['student'],
      }),
      { canRender: true, redirectTo: null },
    );
  });

  it('uses a safe fallback for unknown roles', () => {
    assert.deepEqual(
      decideProtectedRouteAccess({
        loading: false,
        hasUser: true,
        role: 'owner',
        allowedRoles: ['student'],
      }),
      { canRender: false, redirectTo: '/' },
    );
  });
});
