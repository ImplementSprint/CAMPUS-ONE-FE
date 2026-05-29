import { createCampusOneClient, formatCampusOneApiError } from '@campus-one/api-client';
import { hasSchoolOwnerActivationErrors, validateSchoolOwnerActivation } from '@/lib/owner-activation-validation';

const BACKEND_API_URL = process.env.BACKEND_API_URL ?? process.env.INSTITUTION_SERVICE_URL ?? 'http://localhost:4000';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const validation = validateSchoolOwnerActivation(body);
    if (hasSchoolOwnerActivationErrors(validation.errors)) {
      return Response.json({ message: 'Owner activation validation failed.', errors: validation.errors }, { status: 400 });
    }

    const response = await createCampusOneClient({ baseUrl: BACKEND_API_URL }).activateSchoolOwner(validation.payload);
    return Response.json(response);
  } catch (error) {
    const display = formatCampusOneApiError(error, 'Could not activate school owner invitation.');
    return Response.json({ message: display.message }, { status: display.status ?? 503 });
  }
}
