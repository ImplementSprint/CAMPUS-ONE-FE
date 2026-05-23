import { createCampusOneClient, formatCampusOneApiError } from '@campus-one/api-client';

const BACKEND_API_URL = process.env.BACKEND_API_URL ?? process.env.INSTITUTION_SERVICE_URL ?? 'http://localhost:4000';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const search = searchParams.get('search') ?? undefined;

  try {
    const client = createCampusOneClient({ baseUrl: BACKEND_API_URL });
    const schools = await client.searchSchools(search);
    return Response.json(schools);
  } catch (error) {
    const display = formatCampusOneApiError(error);
    return Response.json({ message: display.message }, { status: display.status ?? 503 });
  }
}
