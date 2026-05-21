import { createCampusOneClient } from '@campus-one/api-client';

const BACKEND_API_URL = process.env.BACKEND_API_URL ?? process.env.INSTITUTION_SERVICE_URL ?? 'http://localhost:4000';

type RouteContext = {
  params: Promise<{ slug: string }>;
};

export async function GET(_request: Request, context: RouteContext) {
  const { slug } = await context.params;

  try {
    const client = createCampusOneClient({ baseUrl: BACKEND_API_URL });
    const school = await client.getSchoolBySlug(slug);
    return Response.json(school);
  } catch (error) {
    const message = error instanceof Error ? error.message : 'School not found.';
    return Response.json({ message }, { status: 404 });
  }
}
