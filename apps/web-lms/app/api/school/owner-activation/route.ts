import { createCampusOneClient, formatCampusOneApiError } from '@campus-one/api-client';

const BACKEND_API_URL = process.env.BACKEND_API_URL ?? process.env.INSTITUTION_SERVICE_URL ?? 'http://localhost:4000';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const response = await createCampusOneClient({ baseUrl: BACKEND_API_URL }).activateSchoolOwner(body);
    return Response.json(response);
  } catch (error) {
    const display = formatCampusOneApiError(error, 'Could not activate school owner invitation.');
    return Response.json({ message: display.message }, { status: display.status ?? 503 });
  }
}
