"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { getServerClient } from "@/lib/supabase/server";

export async function register(formData: FormData) {
  const email = formData.get("email") as string;
  const password = formData.get("password") as string;
  const fullName = formData.get("fullName") as string;

  const supabase = await getServerClient();
  const { error } = await supabase.auth.signUp({
    email,
    password,
    options: {
      data: {
        full_name: fullName,
      },
    },
  });

  if (error) redirect(`/register?error=${encodeURIComponent(error.message)}`);

  revalidatePath("/");
  redirect("/");
}

export async function login(formData: FormData) {
  const email = formData.get("email") as string;
  const password = formData.get("password") as string;
  const next = (formData.get("next") as string) || "/";

  const supabase = await getServerClient();
  const { data, error } = await supabase.auth.signInWithPassword({
    email,
    password,
  });

  if (error) redirect(`/login?error=${encodeURIComponent(error.message)}`);

  const { data: profile } = await supabase
    .from("profiles")
    .select("role")
    .eq("id", data.user?.id ?? "")
    .single();

  revalidatePath("/");
  redirect(profile?.role === "admin" ? "/admin" : next);
}

export async function logout() {
  const supabase = await getServerClient();
  await supabase.auth.signOut();
  revalidatePath("/");
  redirect("/");
}
