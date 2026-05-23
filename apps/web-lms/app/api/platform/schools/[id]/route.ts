import {
  getPlatformToken,
  missingPlatformTokenResponse,
  platformClient,
  platformProxyErrorResponse,
} from '../proxy';

type RouteContext = {
  params: Promise<{ id: string }>;
};

export async function GET(request: Request, context: RouteContext) {
  const accessToken = await getPlatformToken(request);
  if (!accessToken) return missingPlatformTokenResponse();

  const { id } = await context.params;

  try {
    const response = await platformClient(accessToken).getPlatformSchool(id);
    return Response.json(response);
  } catch (error) {
    return platformProxyErrorResponse(error);
  }
}
