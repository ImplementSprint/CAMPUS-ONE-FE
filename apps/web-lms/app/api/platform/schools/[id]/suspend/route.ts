import { getPlatformSchoolClient, platformApiErrorResponse } from '@/lib/server/platform-schools-api';

type RouteContext = {
  params: Promise<{ id: string }>;
};

export async function POST(request: Request, context: RouteContext) {
  const { id } = await context.params;
  const body = await request.json().catch(() => ({ reason: '' })) as { reason?: string };
  const { client, unauthorized } = await getPlatformSchoolClient();
  if (!client) return unauthorized;

  try {
    const result = await client.suspendPlatformSchool(id, body.reason);
    return Response.json(result);
  } catch (error) {
    return platformApiErrorResponse(error, 'Could not suspend school.');
  }
}
