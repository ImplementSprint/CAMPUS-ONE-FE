import { cookies } from 'next/headers';
import { createCampusOneClient } from '@campus-one/api-client';

const BACKEND_API_URL = process.env.BACKEND_API_URL
  ?? process.env.INSTITUTION_SERVICE_URL
  ?? process.env.AUTH_SERVICE_URL
  ?? 'http://localhost:4000';

export async function getPlatformSchoolClient() {
  const cookieStore = await cookies();
  const accessToken = cookieStore.get('campus_one_access_token')?.value;

  if (!accessToken) {
    return {
      client: null,
      unauthorized: Response.json({ message: 'A super-admin session is required.' }, { status: 401 }),
    };
  }

  return {
    client: createCampusOneClient({ baseUrl: BACKEND_API_URL, accessToken }),
    unauthorized: null,
  };
}

export function platformApiErrorResponse(error: unknown, fallbackMessage: string) {
  const status = typeof error === 'object' && error && 'status' in error && typeof error.status === 'number'
    ? error.status
    : 503;
  const message = error instanceof Error ? error.message : fallbackMessage;
  return Response.json({ message }, { status });
}
