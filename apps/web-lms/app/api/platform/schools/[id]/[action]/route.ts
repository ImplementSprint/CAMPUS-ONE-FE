import { cookies } from 'next/headers';

import type { PlatformSchoolAction } from '../../proxy';
import {
  getPlatformToken,
  missingPlatformTokenResponse,
  platformClient,
  platformProxyErrorResponse,
} from '../../proxy';

type RouteContext = {
  params: Promise<{ id: string; action: string }>;
};

const REVIEW_ACTIONS = new Set<PlatformSchoolAction>(['approve', 'reject', 'suspend', 'reactivate']);

async function readActionPayload(request: Request): Promise<Record<string, string>> {
  return request.json().catch(() => ({}));
}

export async function PATCH(request: Request, context: RouteContext) {
  const accessToken = await getPlatformToken(request);
  if (!accessToken) return missingPlatformTokenResponse();

  const { id, action } = await context.params;
  if (!REVIEW_ACTIONS.has(action as PlatformSchoolAction)) {
    return Response.json({ message: 'Unsupported platform school action.' }, { status: 404 });
  }

  const cookieStore = await cookies();
  const userId = cookieStore.get('user_id')?.value ?? 'platform-super-admin';
  const userEmail = cookieStore.get('user_email')?.value;
  const payload = await readActionPayload(request);
  const client = platformClient(accessToken);

  try {
    if (action === 'approve') {
      const response = await client.approvePlatformSchool(id, {
        approverId: payload.approverId ?? userId,
        approverEmail: payload.approverEmail ?? userEmail,
      });
      return Response.json(response);
    }

    const actionPayload = {
      actorEmail: payload.actorEmail ?? userEmail,
      reason: payload.reason,
    };

    if (action === 'reject') {
      const response = await client.rejectPlatformSchool(id, actionPayload);
      return Response.json(response);
    }

    if (action === 'suspend') {
      const response = await client.suspendPlatformSchool(id, actionPayload);
      return Response.json(response);
    }

    const response = await client.reactivatePlatformSchool(id, actionPayload);
    return Response.json(response);
  } catch (error) {
    return platformProxyErrorResponse(error);
  }
}
