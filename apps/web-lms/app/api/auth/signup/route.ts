const AUTH_SERVICE_URL = process.env.AUTH_SERVICE_URL ?? "http://localhost:3001";

export async function POST(request: Request) {
  try {
    const body = await request.json();

    const beRes = await fetch(`${AUTH_SERVICE_URL}/api/auth/signup`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    });

    const data = await beRes.json();
    return Response.json(data, { status: beRes.status });
  } catch {
    return Response.json({ message: "Could not reach the backend server." }, { status: 503 });
  }
}
