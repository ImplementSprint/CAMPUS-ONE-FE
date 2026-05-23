import { getPlatformSchoolClient, platformApiErrorResponse } from '@/lib/server/platform-schools-api';

type RouteContext = {
  params: Promise<{ id: string }>;
};

export async function GET(_request: Request, context: RouteContext) {
  const { id } = await context.params;
  const { client, unauthorized } = await getPlatformSchoolClient();
  if (!client) return unauthorized;

  try {
    const school = await client.getPlatformSchool(id);
    return Response.json(school);
  } catch (error) {
    return platformApiErrorResponse(error, 'Could not load platform school.');
  }
}
