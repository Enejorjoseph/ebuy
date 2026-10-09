import { getServerClient } from "@/lib/supabase/server";

export async function uploadListingImage(
  file: File,
  userId: string,
): Promise<string> {
  const supabase = await getServerClient();
  const ext = file.name.split(".").pop()?.toLowerCase() || "jpg";
  const path = `${userId}/${crypto.randomUUID()}.${ext}`;

  const { error } = await supabase.storage
    .from("listing-images")
    .upload(path, file, {
      cacheControl: "3600",
      upsert: false,
      contentType: file.type,
    });

  if (error) throw error;

  const { data } = supabase.storage.from("listing-images").getPublicUrl(path);
  return data.publicUrl;
}
