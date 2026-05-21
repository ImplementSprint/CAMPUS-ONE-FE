import { deleteResource, isResourceName, updateResource } from "@/lib/backend/store";

export async function PATCH(request: Request, context: RouteContext<"/api/[resource]/[id]">) {
  const { resource, id } = await context.params;

  if (!isResourceName(resource)) {
    return Response.json({ message: "Unknown resource" }, { status: 404 });
  }

  const payload = await request.json();
  const updated = await updateResource(resource, id, payload);

  if (!updated) {
    return Response.json({ message: "Record not found" }, { status: 404 });
  }

  return Response.json(updated);
}

export async function DELETE(_request: Request, context: RouteContext<"/api/[resource]/[id]">) {
  const { resource, id } = await context.params;

  if (!isResourceName(resource)) {
    return Response.json({ message: "Unknown resource" }, { status: 404 });
  }

  const deleted = await deleteResource(resource, id);

  if (!deleted) {
    return Response.json({ message: "Record not found" }, { status: 404 });
  }

  return Response.json({ id, deleted: true });
}
