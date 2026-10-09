import type { Listing } from "@/lib/types";
import { displaySellerName, formatPrice } from "@/lib/format";

export default function ListingCard({ listing }: { listing: Listing }) {
  return (
    <article className="group flex flex-col overflow-hidden rounded-2xl border border-zinc-200 bg-white transition hover:-translate-y-1 hover:shadow-xl dark:border-zinc-800 dark:bg-zinc-900">
      <a href={`/listings/${listing.id}`} className="relative flex aspect-square items-center justify-center bg-gradient-to-br from-zinc-100 to-zinc-200 dark:from-zinc-800 dark:to-zinc-700">
        {listing.imageUrl ? (
          <img
            src={listing.imageUrl}
            alt={listing.title}
            className="h-full w-full object-cover"
          />
        ) : (
          <span className="text-5xl">📦</span>
        )}
        {listing.status !== "active" && (
          <span className="absolute left-3 top-3 rounded-full bg-black/80 px-2.5 py-1 text-xs font-semibold text-white uppercase">
            {listing.status}
          </span>
        )}
      </a>

      <div className="flex flex-1 flex-col gap-1.5 p-4">
        <div className="flex items-start justify-between gap-2">
          <div className="flex-1">
            <h3 className="font-semibold leading-tight">
              <a href={`/listings/${listing.id}`}>{listing.title}</a>
            </h3>
            {listing.category && (
              <span className="mt-1 inline-block text-[11px] font-medium uppercase tracking-wide text-zinc-500 dark:text-zinc-400">
                {listing.category}
              </span>
            )}
          </div>
          <span className="text-lg font-bold">{formatPrice(listing.price)}</span>
        </div>

        <div className="mt-auto flex items-center justify-between pt-3 text-sm text-zinc-500 dark:text-zinc-400">
          <span className="truncate">
            {displaySellerName(listing.seller)}
          </span>
          <a
            href={`/listings/${listing.id}`}
            className="rounded-full bg-zinc-900 px-4 py-2 text-sm font-medium text-white transition hover:bg-zinc-700 active:scale-95 dark:bg-white dark:text-zinc-900 dark:hover:bg-zinc-200"
          >
            View
          </a>
        </div>
      </div>
    </article>
  );
}
