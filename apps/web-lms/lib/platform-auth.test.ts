import assert from 'node:assert/strict';
import { describe, it } from 'node:test';

import { resolvePlatformAccessToken } from './platform-auth.ts';

describe('resolvePlatformAccessToken', () => {
  it('uses an incoming bearer authorization header before cookies or env tokens', () => {
    const token = resolvePlatformAccessToken({
      authorizationHeader: 'Bearer header-token',
      cookieValues: { platformAccessToken: 'cookie-token' },
      envToken: 'env-token',
    });

    assert.equal(token, 'header-token');
  });

  it('falls back through platform cookies and env token', () => {
    assert.equal(
      resolvePlatformAccessToken({
        cookieValues: { campusOneAccessToken: 'campus-cookie' },
        envToken: 'env-token',
      }),
      'campus-cookie',
    );

    assert.equal(resolvePlatformAccessToken({ envToken: ' env-token ' }), 'env-token');
  });

  it('returns null when no usable token is present', () => {
    const token = resolvePlatformAccessToken({
      authorizationHeader: 'Bearer   ',
      cookieValues: { platformAccessToken: '   ' },
      envToken: '',
    });

    assert.equal(token, null);
  });
});
