import {
  getPlatformToken,
  missingPlatformTokenResponse,
  platformClient,
  platformProxyErrorResponse,
} from './proxy';

export async function GET(request: Request) {
  const accessToken = await getPlatformToken(request);
  if (!accessToken) return missingPlatformTokenResponse();

  try {
    const response = await platformClient(accessToken).listPlatformSchools();
    return Response.json(response);
  } catch (error) {
    return platformProxyErrorResponse(error);
  }
}
