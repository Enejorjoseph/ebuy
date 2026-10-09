import { getServerClient } from "@/lib/supabase/server";
import type { Profile, UserRole } from "@/lib/types";

type ProfileRow = {
  id: string;
  email: string | null;
  full_name: string | null;
  role: UserRole;
};

export async function getProfiles(): Promise<Profile[]> {
  const supabase = await getServerClient();
  const { data, error } = await supabase
    .from("profiles")
    .select("id, email, full_name, role")
    .order("created_at", { ascending: true });

  if (error) throw error;
  return (data as ProfileRow[]).map((row) => ({
    id: row.id,
    email: row.email,
    fullName: row.full_name,
    role: row.role,
  }));
}
