import Link from "next/link";
import { notFound } from "next/navigation";
import { getListingById } from "@/lib/data/listings";
import { displaySellerName, formatPrice } from "@/lib/format";
import AddToCartButton from "@/components/add-to-cart-button";

export default async function ListingDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const listing = await getListingById(id);
  if (!listing) notFound();

  return (
    <div className="flex flex-1 flex-col">
      <main className="mx-auto w-full max-w-5xl flex-1 px-4 py-8 sm:px-6">
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        <div className="flex aspect-square items-center justify-center overflow-hidden rounded-2xl border border-zinc-200 bg-gradient-to-br from-zinc-100 to-zinc-200 dark:border-zinc-800 dark:from-zinc-800 dark:to-zinc-700">
          {listing.imageUrl ? (
            <img
              src={listing.imageUrl}
              alt={listing.title}
              className="h-full w-full object-cover"
            />
          ) : (
            <span className="text-6xl">📦</span>
          )}
        </div>

        <div className="flex flex-col gap-4">
          <div>
            <h1 className="text-xl font-bold tracking-tight sm:text-2xl lg:text-3xl">
              {listing.title}
            </h1>
            {listing.category && (
              <p className="mt-1 text-sm text-zinc-500 dark:text-zinc-400">
                {listing.category}
              </p>
            )}
          </div>

          <span className="text-3xl font-bold">
            {formatPrice(listing.price)}
          </span>

          {listing.condition && (
            <p className="text-sm text-zinc-600 dark:text-zinc-400">
              Condition: <span className="font-medium">{listing.condition}</span>
            </p>
          )}

          {listing.description && (
            <div className="rounded-2xl border border-zinc-200 bg-white p-4 dark:border-zinc-800 dark:bg-zinc-900">
              <h2 className="text-base font-semibold">Description</h2>
              <p className="mt-2 whitespace-pre-wrap text-sm leading-relaxed text-zinc-600 dark:text-zinc-400">
                {listing.description}
              </p>
            </div>
          )}

          <div className="rounded-2xl border border-zinc-200 bg-white p-4 dark:border-zinc-800 dark:bg-zinc-900">
            <h2 className="text-base font-semibold">Seller</h2>
            <p className="mt-1 text-sm text-zinc-500 dark:text-zinc-400">
              {displaySellerName(listing.seller)}
            </p>
            <div className="mt-4">
              <AddToCartButton
                item={{
                  id: listing.id,
                  title: listing.title,
                  price: listing.price,
                  imageUrl: listing.imageUrl,
                  sellerName: displaySellerName(listing.seller),
                }}
              />
            </div>
          </div>

          <Link
            href="/"
            className="mt-auto inline-flex items-center gap-2 text-sm font-semibold text-indigo-600"
          >
            ← Back to listings
          </Link>
        </div>
      </div>
      </main>
    </div>
  );
}
