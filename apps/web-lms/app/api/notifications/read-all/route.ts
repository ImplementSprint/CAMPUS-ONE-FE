import { markAllNotificationsRead } from "@/lib/backend/store";

export async function PATCH() {
  try {
    const result = await markAllNotificationsRead();
    return Response.json(result);
  } catch (err: any) {
    return Response.json({ message: err.message ?? "Failed to mark as read" }, { status: 500 });
  }
}
