import { logAction, readDb } from "@/lib/backend/store";

export async function GET() {
  const db = await readDb();

  return Response.json(db.actionLogs);
}

export async function POST(request: Request) {
  const payload = (await request.json()) as { module?: string; label?: string };

  if (!payload.module || !payload.label) {
    return Response.json({ message: "module and label are required" }, { status: 400 });
  }

  return Response.json(await logAction(payload.module, payload.label), { status: 201 });
}
