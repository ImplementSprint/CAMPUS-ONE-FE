import assert from 'node:assert/strict';
import { describe, it } from 'node:test';

import {
  normalizeBackendBootstrap,
  readCachedBackendAuthUser,
  readCachedBackendAccessToken,
  resolveSelectedSchoolSlug,
  writeCachedBackendAccessToken,
  writeCachedBackendAuthUser,
} from './backend-session.service.ts';

function makeStorage() {
  const values = new Map<string, string>();

  return {
    getItem(key: string) {
      return values.get(key) ?? null;
    },
    setItem(key: string, value: string) {
      values.set(key, value);
    },
    removeItem(key: string) {
      values.delete(key);
    },
  } as Storage;
}

describe('web-school backend auth bootstrap adapter', () => {
  it('normalizes backend auth and tenant responses into the legacy AuthUser cache shape', () => {
    const bootstrap = normalizeBackendBootstrap({
      auth: {
        user: {
          id: 'user-1',
          email: 'student@school.test',
          role: 'student',
          activeInstitutionId: 'institution-1',
        },
      },
      tenant: {
        schoolSlug: 'sample-school',
        source: 'mobile-header',
      },
    });

    assert.deepEqual(bootstrap, {
      user: {
        id: 'user-1',
        email: 'student@school.test',
        role: 'student',
      },
      tenant: {
        institutionId: 'institution-1',
        schoolSlug: 'sample-school',
        source: 'mobile-header',
      },
    });
  });

  it('rejects unsupported backend roles before protected routes trust them', () => {
    const bootstrap = normalizeBackendBootstrap({
      auth: {
        user: {
          id: 'user-1',
          email: 'student@school.test',
          role: 'owner',
        },
      },
      tenant: {
        source: 'session',
      },
    });

    assert.equal(bootstrap, null);
  });

  it('round-trips the cached backend user through session storage', () => {
    const storage = makeStorage();
    const user = { id: 'user-1', email: 'student@school.test', role: 'student' } as const;

    writeCachedBackendAuthUser(storage, user);

    assert.deepEqual(readCachedBackendAuthUser(storage), user);
  });

  it('round-trips the backend bearer token through session storage', () => {
    const storage = makeStorage();

    writeCachedBackendAccessToken(storage, 'token-123');

    assert.equal(readCachedBackendAccessToken(storage), 'token-123');
  });

  it('uses the school query parameter before host or local storage tenant simulation', () => {
    const storage = makeStorage();
    storage.setItem('campus-one:selected-school', JSON.stringify({ schoolSlug: 'stored-school' }));

    assert.equal(
      resolveSelectedSchoolSlug({
        search: '?school=demo',
        hostname: 'subdomain.campus-one.test',
        platformDomain: 'campus-one.test',
        storage,
      }),
      'demo',
    );
  });

  it('resolves the school slug from a subdomain on the platform domain', () => {
    assert.equal(
      resolveSelectedSchoolSlug({
        search: '',
        hostname: 'demo.campus-one.test',
        platformDomain: 'campus-one.test',
        storage: makeStorage(),
      }),
      'demo',
    );
  });

  it('falls back to the locally selected school when query and host are absent', () => {
    const storage = makeStorage();
    storage.setItem('campus-one:selected-school', JSON.stringify({ schoolSlug: 'stored-school' }));

    assert.equal(
      resolveSelectedSchoolSlug({
        search: '',
        hostname: 'localhost',
        platformDomain: 'campus-one.test',
        storage,
      }),
      'stored-school',
    );
  });
});
