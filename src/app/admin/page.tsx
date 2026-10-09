import Link from "next/link";
import { requireAdmin } from "@/lib/auth";
import { getAllListings } from "@/lib/data/listings";
import { formatPrice } from "@/lib/format";
import { deleteListing } from "@/lib/actions/listings";
import PageHeader from "@/components/page-header";

export default async function AdminPage({
  searchParams,
}: {
  searchParams: Promise<{ error?: string }>;
}) {
  await requireAdmin();
  const { error } = await searchParams;

  let listings: Awaited<ReturnType<typeof getAllListings>> = [];
  try {
    listings = await getAllListings();
  } catch {
    listings = [];
  }

  return (
    <div className="flex flex-1 flex-col">
      <PageHeader title="Admin" subtitle="Manage listings and users">
        <div className="mt-4 flex flex-wrap gap-3">
          <Link
            href="/admin/listings/new"
            className="rounded-full bg-indigo-600 px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-indigo-500 active:scale-95"
          >
            New listing
          </Link>
          <Link
            href="/admin/users"
            className="rounded-full border border-zinc-300 px-5 py-2.5 text-sm font-semibold transition hover:bg-zinc-100 dark:border-zinc-700 dark:hover:bg-zinc-800"
          >
            Manage users
          </Link>
        </div>
      </PageHeader>

      <main className="mx-auto w-full max-w-6xl flex-1 px-4 py-8 sm:px-6">
        {error && (
          <p className="mb-4 rounded-lg bg-red-50 px-4 py-2 text-sm text-red-600 dark:bg-red-950/40 dark:text-red-400">
            {error}
          </p>
        )}

        <h2 className="text-lg font-bold">All listings ({listings.length})</h2>

        {listings.length === 0 ? (
          <div className="mt-4 rounded-2xl border border-dashed border-zinc-300 bg-white p-8 text-center dark:border-zinc-700 dark:bg-zinc-900">
            <p className="text-sm text-zinc-500 dark:text-zinc-400">
              No listings yet.{" "}
              <Link href="/admin/listings/new" className="text-indigo-600">
                Create one
              </Link>
              .
            </p>
          </div>
        ) : (
          <div className="mt-4 flex flex-col gap-3">
            {listings.map((listing) => (
              <div
                key={listing.id}
                className="flex flex-wrap items-center gap-4 rounded-2xl border border-zinc-200 bg-white p-3 sm:p-4 dark:border-zinc-800 dark:bg-zinc-900"
              >
                <Link
                  href={`/listings/${listing.id}`}
                  className="flex h-16 w-16 shrink-0 items-center justify-center overflow-hidden rounded-xl bg-gradient-to-br from-zinc-100 to-zinc-200 dark:from-zinc-800 dark:to-zinc-700"
                >
                  {listing.imageUrl ? (
                    <img
                      src={listing.imageUrl}
                      alt={listing.title}
                      className="h-full w-full object-cover"
                    />
                  ) : (
                    <span className="text-2xl">📦</span>
                  )}
                </Link>

                <div className="min-w-0 flex-1">
                  <p className="font-semibold">{listing.title}</p>
                  <p className="text-sm text-zinc-500 dark:text-zinc-400">
                    {formatPrice(listing.price)}
                    {listing.category ? ` · ${listing.category}` : ""}
                  </p>
                </div>

                <span className="rounded-full bg-zinc-100 px-3 py-1 text-xs font-semibold uppercase text-zinc-600 dark:bg-zinc-800 dark:text-zinc-300">
                  {listing.status}
                </span>

                <div className="flex items-center gap-2">
                  <Link
                    href={`/admin/listings/edit/${listing.id}`}
                    className="rounded-full border border-zinc-300 px-4 py-2 text-sm font-medium transition hover:bg-zinc-100 dark:border-zinc-700 dark:hover:bg-zinc-800"
                  >
                    Edit
                  </Link>
                  <form action={deleteListing}>
                    <input type="hidden" name="id" value={listing.id} />
                    <button
                      type="submit"
                      className="rounded-full border border-red-200 px-4 py-2 text-sm font-medium text-red-600 transition hover:bg-red-50 dark:border-red-900 dark:text-red-400 dark:hover:bg-red-950/40"
                    >
                      Delete
                    </button>
                  </form>
                </div>
              </div>
            ))}
          </div>
        )}
      </main>
    </div>
  );
}
