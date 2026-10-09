"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { getServerClient } from "@/lib/supabase/server";
import { requireAdmin } from "@/lib/auth";
import { uploadListingImage } from "@/lib/storage";
import type { ListingStatus } from "@/lib/types";

function readFields(formData: FormData) {
  const title = ((formData.get("title") as string) || "").trim();
  const description = ((formData.get("description") as string) || "").trim();
  const category = ((formData.get("category") as string) || "").trim();
  const condition = (formData.get("condition") as string) || null;
  const status = (formData.get("status") as ListingStatus) || "active";
  const price = Number(formData.get("price"));

  return { title, description, category, condition, status, price };
}

function validationError(title: string, price: number) {
  if (!title) return "Title is required";
  if (!Number.isFinite(price) || price < 0) return "A valid price is required";
  return null;
}

export async function createListing(formData: FormData) {
  const admin = await requireAdmin();
  const fields = readFields(formData);

  const invalid = validationError(fields.title, fields.price);
  if (invalid) {
    redirect(`/admin/listings/new?error=${encodeURIComponent(invalid)}`);
  }

  const supabase = await getServerClient();
  let imageUrl: string | null = null;

  const file = formData.get("image");
  if (file instanceof File && file.size > 0) {
    try {
      imageUrl = await uploadListingImage(file, admin.id);
    } catch (error) {
      redirect(
        `/admin/listings/new?error=${encodeURIComponent((error as Error).message)}`,
      );
    }
  }

  const { error } = await supabase.from("listings").insert({
    seller_id: admin.id,
    title: fields.title,
    description: fields.description || null,
    price: fields.price,
    category: fields.category || null,
    condition: fields.condition,
    status: fields.status,
    image_url: imageUrl,
  });

  if (error) {
    redirect(`/admin/listings/new?error=${encodeURIComponent(error.message)}`);
  }

  revalidatePath("/admin");
  revalidatePath("/");
  redirect("/admin");
}

export async function updateListing(formData: FormData) {
  const admin = await requireAdmin();
  const id = formData.get("id") as string;
  const fields = readFields(formData);

  const invalid = validationError(fields.title, fields.price);
  if (invalid) {
    redirect(`/admin/listings/edit/${id}?error=${encodeURIComponent(invalid)}`);
  }

  const supabase = await getServerClient();
  const patch: Record<string, unknown> = {
    title: fields.title,
    description: fields.description || null,
    price: fields.price,
    category: fields.category || null,
    condition: fields.condition,
    status: fields.status,
  };

  const file = formData.get("image");
  if (file instanceof File && file.size > 0) {
    try {
      patch.image_url = await uploadListingImage(file, admin.id);
    } catch (error) {
      redirect(
        `/admin/listings/edit/${id}?error=${encodeURIComponent((error as Error).message)}`,
      );
    }
  }

  const { error } = await supabase.from("listings").update(patch).eq("id", id);

  if (error) {
    redirect(`/admin/listings/edit/${id}?error=${encodeURIComponent(error.message)}`);
  }

  revalidatePath("/admin");
  revalidatePath("/");
  redirect("/admin");
}

export async function deleteListing(formData: FormData) {
  await requireAdmin();
  const id = formData.get("id") as string;

  const supabase = await getServerClient();
  const { error } = await supabase.from("listings").delete().eq("id", id);

  if (error) {
    redirect(`/admin?error=${encodeURIComponent(error.message)}`);
  }

  revalidatePath("/admin");
  revalidatePath("/");
  redirect("/admin");
}
