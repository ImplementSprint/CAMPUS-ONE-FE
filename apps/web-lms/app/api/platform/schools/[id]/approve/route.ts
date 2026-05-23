import { getPlatformSchoolClient, platformApiErrorResponse } from '@/lib/server/platform-schools-api';

type RouteContext = {
  params: Promise<{ id: string }>;
};

export async function POST(_request: Request, context: RouteContext) {
  const { id } = await context.params;
  const { client, unauthorized } = await getPlatformSchoolClient();
  if (!client) return unauthorized;

  try {
    const result = await client.approvePlatformSchool(id);
    return Response.json(result);
  } catch (error) {
    return platformApiErrorResponse(error, 'Could not approve school.');
  }
}
