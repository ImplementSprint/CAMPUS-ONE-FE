import { supabase } from '@/lib/supabase';

export interface SupabaseResponse<T> {
  data: T | null;
  error: { message: string } | null;
}

export async function createAlumniProfile(dto: {
  email: string;
}): Promise<SupabaseResponse<{ id: string }>> {
  const alumniId = crypto.randomUUID();

  const { error } = await supabase.from("alumni_profiles").insert({
    id: alumniId,
    email: dto.email,
    first_name: "",
    last_name: "",
    graduation_year: null,
    department: "",
    status: "Active",
  });

  if (error) return { data: null, error: { message: error.message } };
  return { data: { id: alumniId }, error: null };
}

export async function updateAlumniProfile(
  alumniId: string,
  dto: {
    first_name: string;
    last_name: string;
    graduation_year: number;
    department: string;
  }
): Promise<SupabaseResponse<{ reference_number: string }>> {
  const referenceNumber = `ALM-${new Date().getFullYear()}-${alumniId.slice(0, 8).toUpperCase()}`;

  const { error } = await supabase
    .from("alumni_profiles")
    .update({
      first_name: dto.first_name,
      last_name: dto.last_name,
      graduation_year: dto.graduation_year,
      department: dto.department,
      reference_number: referenceNumber,
    })
    .eq("id", alumniId);

  if (error) return { data: null, error: { message: error.message } };
  return { data: { reference_number: referenceNumber }, error: null };
}
