import Link from "next/link";
import { notFound } from "next/navigation";
import { requireAdmin } from "@/lib/auth";
import { getListingById } from "@/lib/data/listings";
import { updateListing } from "@/lib/actions/listings";
import ListingImageField from "@/components/listing-image-field";
import PageHeader from "@/components/page-header";

const inputClass =
  "rounded-lg border border-zinc-200 px-3 py-2 text-sm dark:border-zinc-700 dark:bg-zinc-950";

export default async function EditListingPage({
  params,
  searchParams,
}: {
  params: Promise<{ id: string }>;
  searchParams: Promise<{ error?: string }>;
}) {
  await requireAdmin();
  const { id } = await params;
  const { error } = await searchParams;

  const listing = await getListingById(id);
  if (!listing) notFound();

  return (
    <div className="flex flex-1 flex-col">
      <PageHeader title="Edit listing" subtitle={listing.title} />

      <main className="mx-auto w-full max-w-3xl flex-1 px-4 py-8 sm:px-6">
        <form action={updateListing} className="flex flex-col gap-4">
          <input type="hidden" name="id" value={listing.id} />

          <label className="flex flex-col gap-1 text-sm font-medium">
            Title
            <input
              name="title"
              required
              defaultValue={listing.title}
              className={inputClass}
            />
          </label>

          <label className="flex flex-col gap-1 text-sm font-medium">
            Price
            <input
              name="price"
              type="number"
              min="0"
              step="0.01"
              required
              defaultValue={listing.price}
              className={inputClass}
            />
          </label>

          <label className="flex flex-col gap-1 text-sm font-medium">
            Description
            <textarea
              name="description"
              rows={4}
              defaultValue={listing.description ?? ""}
              className={inputClass}
            />
          </label>

          <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
            <label className="flex flex-col gap-1 text-sm font-medium">
              Category
              <input
                name="category"
                defaultValue={listing.category ?? ""}
                className={inputClass}
              />
            </label>
            <label className="flex flex-col gap-1 text-sm font-medium">
              Condition
              <select
                name="condition"
                className={inputClass}
                defaultValue={listing.condition ?? "good"}
              >
                <option value="new">New</option>
                <option value="like_new">Like new</option>
                <option value="good">Good</option>
                <option value="fair">Fair</option>
              </select>
            </label>
            <label className="flex flex-col gap-1 text-sm font-medium">
              Status
              <select
                name="status"
                className={inputClass}
                defaultValue={listing.status}
              >
                <option value="active">Active</option>
                <option value="sold">Sold</option>
                <option value="archived">Archived</option>
              </select>
            </label>
          </div>

          <ListingImageField defaultValue={listing.imageUrl} />

          {error && (
            <p className="rounded-lg bg-red-50 px-4 py-2 text-sm text-red-600 dark:bg-red-950/40 dark:text-red-400">
              {error}
            </p>
          )}

          <div className="flex items-center gap-3">
            <button
              type="submit"
              className="rounded-full bg-indigo-600 px-6 py-2.5 text-sm font-semibold text-white transition hover:bg-indigo-500 active:scale-95"
            >
              Save changes
            </button>
            <Link
              href="/admin"
              className="text-sm font-medium text-zinc-500 hover:text-zinc-900 dark:text-zinc-400 dark:hover:text-white"
            >
              Cancel
            </Link>
          </div>
        </form>
      </main>
    </div>
  );
}
