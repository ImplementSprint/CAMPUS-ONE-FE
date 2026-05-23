import { createCampusOneClient } from '@campus-one/api-client';
import type { SchoolRegistrationRequest } from '@campus-one/shared-contracts';
import { hasSchoolRegistrationErrors, validateSchoolRegistration } from '@/lib/school-registration-validation';

const BACKEND_API_URL = process.env.BACKEND_API_URL ?? process.env.INSTITUTION_SERVICE_URL ?? 'http://localhost:4000';

export async function POST(request: Request) {
  const input = await request.json() as Partial<SchoolRegistrationRequest>;
  const { payload, errors } = validateSchoolRegistration(input);

  if (hasSchoolRegistrationErrors(errors)) {
    return Response.json({ message: 'Check the highlighted fields.', errors }, { status: 400 });
  }

  try {
    const client = createCampusOneClient({ baseUrl: BACKEND_API_URL });
    const registration = await client.registerSchool(payload);
    return Response.json(registration);
  } catch (error) {
    const status = typeof error === 'object' && error && 'status' in error && typeof error.status === 'number'
      ? error.status
      : 503;
    const message = error instanceof Error ? error.message : 'Could not submit school registration.';
    return Response.json({ message }, { status });
  }
}
