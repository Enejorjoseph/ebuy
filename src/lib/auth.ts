import { redirect } from "next/navigation";
import { getServerClient } from "@/lib/supabase/server";
import { isSupabaseConfigured } from "@/lib/supabase/config";
import type { Profile } from "@/lib/types";

export async function getUser() {
  if (!isSupabaseConfigured) return null;
  const supabase = await getServerClient();
  const { data } = await supabase.auth.getUser();
  return data.user;
}

export async function getCurrentProfile(): Promise<Profile | null> {
  const user = await getUser();
  if (!user) return null;

  const supabase = await getServerClient();
  const { data } = await supabase
    .from("profiles")
    .select("id, email, full_name, role")
    .eq("id", user.id)
    .single();

  if (!data) {
    return {
      id: user.id,
      email: user.email ?? null,
      fullName: null,
      role: "buyer",
    };
  }

  return {
    id: data.id,
    email: data.email,
    fullName: data.full_name,
    role: data.role,
  };
}

export async function requireAdmin(): Promise<Profile> {
  const profile = await getCurrentProfile();
  if (!profile) redirect("/login?next=/admin");
  if (profile.role !== "admin") redirect("/?notice=admin-only");
  return profile;
}
