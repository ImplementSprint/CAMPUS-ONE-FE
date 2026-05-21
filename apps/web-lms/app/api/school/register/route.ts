import { updateSchoolForUser } from "@/lib/backend/store";

export async function POST(request: Request) {
  const payload = await request.json();
  const school = await updateSchoolForUser("", {
    ...payload,
    status: "submitted",
    setupProgress: 80,
  });

  return Response.json({
    message: "School registration submitted for review.",
    school,
    next: `/dashboard?school=${school.targetSubdomain}`,
  });
}
