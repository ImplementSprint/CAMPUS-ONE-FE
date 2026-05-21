import { listResource, createResource } from "@/lib/backend/store";

export async function GET() {
  try {
    const notifications = await listResource("notifications");
    return Response.json(Array.isArray(notifications) ? notifications : []);
  } catch {
    return Response.json([], { status: 200 });
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const notification = await createResource("notifications", {
      ...body,
      read: "false",
      created_at: new Date().toISOString(),
    });
    return Response.json(notification, { status: 201 });
  } catch (err: any) {
    return Response.json({ message: err.message ?? "Failed to create notification" }, { status: 500 });
  }
}
