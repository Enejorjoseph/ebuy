export type UserRole = "buyer" | "seller" | "admin";

export type ListingStatus = "active" | "sold" | "archived";

export type Category = {
  id: string;
  name: string;
  emoji: string | null;
};

export type Seller = {
  id: string;
  fullName: string | null;
  email: string | null;
};

export type Listing = {
  id: string;
  sellerId: string;
  title: string;
  description: string | null;
  price: number;
  category: string | null;
  condition: string | null;
  imageUrl: string | null;
  status: ListingStatus;
  createdAt: string;
  seller: Seller | null;
};

export type Profile = {
  id: string;
  email: string | null;
  fullName: string | null;
  role: UserRole;
};
