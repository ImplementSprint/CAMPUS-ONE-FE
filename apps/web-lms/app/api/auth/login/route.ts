import { cookies } from "next/headers";

const AUTH_SERVICE_URL = process.env.AUTH_SERVICE_URL ?? "http://localhost:3001";

export async function POST(request: Request) {
  try {
    const body = await request.json();

    const beRes = await fetch(`${AUTH_SERVICE_URL}/api/auth/login`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    });

    const data = await beRes.json();
    if (!beRes.ok) return Response.json(data, { status: beRes.status });

    const cookieStore = await cookies();
    const opts = { httpOnly: true, path: "/", sameSite: "lax" } as const;
    cookieStore.set("user_id", data.user.id, opts);
    if (data.user?.email) cookieStore.set("user_email", data.user.email, opts);
    if (data.user?.role) cookieStore.set("user_role", data.user.role, opts);

    return Response.json(data);
  } catch {
    return Response.json({ message: "Could not reach the backend server." }, { status: 503 });
  }
}
