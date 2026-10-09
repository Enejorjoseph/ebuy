import { getServerClient } from "@/lib/supabase/server";
import type { Listing, ListingStatus } from "@/lib/types";

type ListingRow = {
  id: string;
  seller_id: string;
  title: string;
  description: string | null;
  price: number;
  category: string | null;
  condition: string | null;
  image_url: string | null;
  status: ListingStatus;
  created_at: string;
  seller: {
    id: string;
    full_name: string | null;
    email: string | null;
  } | null;
};

export async function getActiveListings(): Promise<Listing[]> {
  const supabase = await getServerClient();
  const { data, error } = await supabase
    .from("listings")
    .select("*, seller:profiles(id, full_name, email)")
    .eq("status", "active")
    .order("created_at", { ascending: false })
    .limit(100);

  if (error) throw error;
  return (data as ListingRow[]).map(mapRow);
}

export async function getListingById(id: string): Promise<Listing | null> {
  const supabase = await getServerClient();
  const { data, error } = await supabase
    .from("listings")
    .select("*, seller:profiles(id, full_name, email)")
    .eq("id", id)
    .single();

  if (error) return null;
  return mapRow(data as ListingRow);
}

export async function getAllListings(): Promise<Listing[]> {
  const supabase = await getServerClient();
  const { data, error } = await supabase
    .from("listings")
    .select("*, seller:profiles(id, full_name, email)")
    .order("created_at", { ascending: false });

  if (error) throw error;
  return (data as ListingRow[]).map(mapRow);
}

function mapRow(row: ListingRow): Listing {
  return {
    id: row.id,
    sellerId: row.seller_id,
    title: row.title,
    description: row.description,
    price: Number(row.price),
    category: row.category,
    condition: row.condition,
    imageUrl: row.image_url,
    status: row.status,
    createdAt: row.created_at,
    seller: row.seller
      ? {
          id: row.seller.id,
          fullName: row.seller.full_name,
          email: row.seller.email,
        }
      : null,
  };
}
