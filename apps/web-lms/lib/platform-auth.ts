type PlatformCookieValues = {
  platformAccessToken?: string | null;
  campusOneAccessToken?: string | null;
  accessToken?: string | null;
  authToken?: string | null;
};

export type PlatformAccessTokenInput = {
  authorizationHeader?: string | null;
  cookieValues?: PlatformCookieValues;
  envToken?: string | null;
};

function cleanToken(value?: string | null): string | null {
  const normalized = value?.trim();
  return normalized ? normalized : null;
}

function tokenFromAuthorizationHeader(value?: string | null): string | null {
  const normalized = cleanToken(value);
  if (!normalized) return null;

  if (normalized.toLowerCase().startsWith('bearer ')) {
    return cleanToken(normalized.slice(7));
  }

  if (normalized.toLowerCase() === 'bearer') {
    return null;
  }

  return normalized;
}

export function resolvePlatformAccessToken(input: PlatformAccessTokenInput): string | null {
  return (
    tokenFromAuthorizationHeader(input.authorizationHeader) ??
    cleanToken(input.cookieValues?.platformAccessToken) ??
    cleanToken(input.cookieValues?.campusOneAccessToken) ??
    cleanToken(input.cookieValues?.accessToken) ??
    cleanToken(input.cookieValues?.authToken) ??
    cleanToken(input.envToken)
  );
}
