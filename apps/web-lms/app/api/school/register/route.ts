import { createCampusOneClient, formatCampusOneApiError } from "@campus-one/api-client";
import type { SchoolRegistrationRequest } from "@campus-one/shared-contracts";

const BACKEND_API_URL = process.env.BACKEND_API_URL ?? process.env.INSTITUTION_SERVICE_URL ?? "http://localhost:4000";

export async function POST(request: Request) {
  const payload = (await request.json()) as SchoolRegistrationRequest;

  try {
    const client = createCampusOneClient({ baseUrl: BACKEND_API_URL });
    const response = await client.registerSchool(payload);

    return Response.json(response);
  } catch (error) {
    const display = formatCampusOneApiError(error);

    return Response.json({ message: display.message }, { status: display.status ?? 503 });
  }
}
