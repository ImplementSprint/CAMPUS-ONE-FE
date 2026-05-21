import { dashboardSummary } from "@/lib/backend/store";

export async function GET() {
  return Response.json(await dashboardSummary());
}
