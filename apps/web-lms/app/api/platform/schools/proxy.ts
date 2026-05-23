import { createCampusOneClient, formatCampusOneApiError } from '@campus-one/api-client';
import { cookies } from 'next/headers';

import { resolvePlatformAccessToken } from '@/lib/platform-auth';

const BACKEND_API_URL = process.env.BACKEND_API_URL ?? process.env.INSTITUTION_SERVICE_URL ?? 'http://localhost:4000';

export type PlatformSchoolAction = 'approve' | 'reject' | 'suspend' | 'reactivate';

export async function getPlatformToken(request: Request): Promise<string | null> {
  const cookieStore = await cookies();

  return resolvePlatformAccessToken({
    authorizationHeader: request.headers.get('authorization'),
    cookieValues: {
      platformAccessToken: cookieStore.get('platform_access_token')?.value,
      campusOneAccessToken: cookieStore.get('campus_one_access_token')?.value,
      accessToken: cookieStore.get('access_token')?.value,
      authToken: cookieStore.get('auth_token')?.value,
    },
    envToken: process.env.PLATFORM_SUPER_ADMIN_ACCESS_TOKEN,
  });
}

export function missingPlatformTokenResponse() {
  return Response.json(
    {
      message:
        'Platform review access token is required. Sign in as a super admin with an access token cookie/header, or set PLATFORM_SUPER_ADMIN_ACCESS_TOKEN for local review.',
    },
    { status: 401 },
  );
}

export function platformClient(accessToken: string) {
  return createCampusOneClient({ baseUrl: BACKEND_API_URL, accessToken });
}

export function platformProxyErrorResponse(error: unknown) {
  const display = formatCampusOneApiError(error);

  return Response.json({ message: display.message }, { status: display.status ?? 503 });
}
