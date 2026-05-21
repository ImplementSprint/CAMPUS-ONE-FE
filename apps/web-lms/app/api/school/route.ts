import { cookies } from "next/headers";

const INSTITUTION_SERVICE_URL = process.env.INSTITUTION_SERVICE_URL ?? "http://localhost:3002";

export async function GET() {
  const cookieStore = await cookies();
  const userId = cookieStore.get("user_id")?.value;
  if (!userId) return Response.json({}, { status: 401 });

  try {
    const beRes = await fetch(`${INSTITUTION_SERVICE_URL}/api/institution/profile`, {
      headers: { "x-user-id": userId },
    });
    const data = await beRes.json();
    return Response.json(data, { status: beRes.status });
  } catch {
    return Response.json({ message: "Could not reach the backend server." }, { status: 503 });
  }
}

export async function PATCH(request: Request) {
  const cookieStore = await cookies();
  const userId = cookieStore.get("user_id")?.value;
  if (!userId) return Response.json({}, { status: 401 });

  try {
    const body = await request.json();
    const beRes = await fetch(`${INSTITUTION_SERVICE_URL}/api/institution/profile`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
        "x-user-id": userId,
      },
      body: JSON.stringify({
        name: body.name,
        representative: body.representative,
        email: body.email,
        contact_number: body.contactNumber,
        school_type: body.schoolType,
        target_subdomain: body.targetSubdomain,
        status: body.status,
        setup_progress: body.setupProgress,
      }),
    });
    const data = await beRes.json();
    return Response.json(data, { status: beRes.status });
  } catch {
    return Response.json({ message: "Could not reach the backend server." }, { status: 503 });
  }
}