import { createResource, isResourceName, listResource } from "@/lib/backend/store";

export async function GET(request: Request, context: RouteContext<"/api/[resource]">) {
  const { resource } = await context.params;

  if (!isResourceName(resource)) {
    return Response.json({ message: "Unknown resource" }, { status: 404 });
  }

  const url = new URL(request.url);
  const search = url.searchParams.get("search") ?? undefined;

  try {
    return Response.json(await listResource(resource, search));
  } catch (err: any) {
    return Response.json({ message: err.message ?? "Request failed" }, { status: 500 });
  }
}

export async function POST(request: Request, context: RouteContext<"/api/[resource]">) {
  const { resource } = await context.params;

  if (!isResourceName(resource)) {
    return Response.json({ message: "Unknown resource" }, { status: 404 });
  }

  const payload = await request.json();

  try {
    return Response.json(await createResource(resource, payload), { status: 201 });
  } catch (err: any) {
    return Response.json({ message: err.message ?? "Request failed" }, { status: 500 });
  }
}
