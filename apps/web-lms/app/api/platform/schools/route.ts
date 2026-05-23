import { getPlatformSchoolClient, platformApiErrorResponse } from '@/lib/server/platform-schools-api';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const status = searchParams.get('status') ?? undefined;
  const { client, unauthorized } = await getPlatformSchoolClient();
  if (!client) return unauthorized;

  try {
    const schools = await client.listPlatformSchools(status);
    return Response.json(schools);
  } catch (error) {
    return platformApiErrorResponse(error, 'Could not load platform schools.');
  }
}
