"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { getServerClient } from "@/lib/supabase/server";
import { requireAdmin } from "@/lib/auth";

export async function updateUserRole(formData: FormData) {
  const admin = await requireAdmin();
  const userId = formData.get("userId") as string;
  const next = formData.get("role") === "admin" ? "admin" : "buyer";

  if (userId === admin.id && next !== "admin") {
    redirect(
      "/admin/users?error=" +
        encodeURIComponent("You cannot remove your own admin access"),
    );
  }

  const supabase = await getServerClient();
  const { error } = await supabase
    .from("profiles")
    .update({ role: next })
    .eq("id", userId);

  if (error) {
    redirect(`/admin/users?error=${encodeURIComponent(error.message)}`);
  }

  revalidatePath("/admin/users");
  redirect("/admin/users");
}
