export function formatPrice(amount: number): string {
  return `₦${amount.toLocaleString("en-NG", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  })}`;
}

const ADMIN_EMAIL = "admin@ebuy.local";
const STORE_NAME = "eBuy";

export function displaySellerName(
  seller: { fullName: string | null; email: string | null } | null | undefined,
): string {
  if (!seller) return STORE_NAME;

  const isAdmin =
    seller.email === ADMIN_EMAIL ||
    seller.fullName?.trim().toLowerCase() === "ebuy admin";

  if (isAdmin) return STORE_NAME;

  return seller.fullName || seller.email || STORE_NAME;
}

