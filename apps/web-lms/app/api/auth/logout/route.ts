import { cookies } from "next/headers";

const AUTH_SERVICE_URL = process.env.AUTH_SERVICE_URL ?? "http://localhost:3001";

export async function POST() {
  try {
    await fetch(`${AUTH_SERVICE_URL}/api/auth/signout`, { method: "POST" });
  } catch {
    // best-effort — clear cookies regardless
  }

  const cookieStore = await cookies();
  cookieStore.delete("user_id");
  cookieStore.delete("user_email");
  cookieStore.delete("user_role");
  return Response.json({ message: "Logged out." });
}
