import { createCampusOneClient, formatCampusOneApiError } from '@campus-one/api-client';

const BACKEND_API_URL = process.env.BACKEND_API_URL ?? process.env.INSTITUTION_SERVICE_URL ?? 'http://localhost:4000';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const slug = searchParams.get('slug') ?? '';

  try {
    const response = await createCampusOneClient({ baseUrl: BACKEND_API_URL }).checkSchoolSlugAvailability(slug);
    return Response.json(response);
  } catch (error) {
    const display = formatCampusOneApiError(error, 'Could not check school slug availability.');
    return Response.json({ message: display.message }, { status: display.status ?? 503 });
  }
}
