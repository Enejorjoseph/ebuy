import { getActiveListings } from "@/lib/data/listings";
import ListingCard from "@/components/listing-card";
import { getCurrentProfile } from "@/lib/auth";

export default async function Home() {
  let listings: Awaited<ReturnType<typeof getActiveListings>> = [];
  try {
    listings = await getActiveListings();
  } catch {
    listings = [];
  }

  const profile = await getCurrentProfile();

  const isSignedIn = Boolean(profile);
  const visibleListings = isSignedIn ? listings : listings.slice(0, 4);
  const hasMore = !isSignedIn && listings.length > visibleListings.length;

  return (
    <div className="flex flex-1 flex-col">
      <main className="flex-1">
        <section className="relative overflow-hidden">
          <div className="pointer-events-none absolute inset-0 -z-10 bg-gradient-to-b from-indigo-100 to-transparent dark:from-indigo-950/40" />

          <div className="mx-auto w-full max-w-6xl px-4 py-10 sm:px-6 sm:py-14 lg:py-18">
            <div className="text-center">
              <span className="inline-block rounded-full bg-indigo-100 px-3 py-1 text-xs font-semibold text-indigo-700 dark:bg-indigo-950 dark:text-indigo-300">
                Buy and sell with eBuy
              </span>
              <h1 className="mt-4 text-3xl font-extrabold leading-tight tracking-tight sm:text-4xl lg:text-5xl">
                Find what you need.
                <span className="text-indigo-600"> Shop great deals.</span>
              </h1>
              <p className="mx-auto mt-4 max-w-2xl text-base text-zinc-600 sm:text-lg dark:text-zinc-400">
                A simple marketplace to browse great listings at great prices.
              </p>
              <div className="mt-6 flex flex-col justify-center gap-3 sm:flex-row">
                <a
                  href="#listings"
                  className="rounded-full bg-indigo-600 px-6 py-3 text-sm font-semibold text-white transition hover:bg-indigo-500 active:scale-95"
                >
                  Browse listings
                </a>
                {!profile && (
                  <a
                    href="/register"
                    className="rounded-full border border-zinc-300 px-6 py-3 text-sm font-semibold transition hover:bg-zinc-100 active:scale-95 dark:border-zinc-700 dark:hover:bg-zinc-800"
                  >
                    Create account
                  </a>
                )}
              </div>
            </div>
          </div>
        </section>

        <section
          id="listings"
          className="mx-auto w-full max-w-6xl px-4 py-10 sm:px-6 sm:py-14"
        >
          <div className="flex items-end justify-between">
            <div>
              <h2 className="text-xl font-bold tracking-tight sm:text-2xl">
                Latest listings
              </h2>
              <p className="mt-1 text-sm text-zinc-500 sm:text-base dark:text-zinc-400">
                Fresh finds from across the marketplace.
              </p>
            </div>
          </div>

          {listings.length === 0 ? (
            <div className="mt-8 rounded-2xl border border-dashed border-zinc-300 bg-white p-8 text-center dark:border-zinc-700 dark:bg-zinc-900">
              <p className="text-sm text-zinc-500 dark:text-zinc-400">
                No active listings yet. Check back soon.
              </p>
            </div>
          ) : (
            <>
              <div className="mt-6 grid grid-cols-2 gap-3 sm:gap-6 lg:grid-cols-4">
                {visibleListings.map((listing) => (
                  <ListingCard key={listing.id} listing={listing} />
                ))}
              </div>

              {hasMore && (
                <div className="mt-8 flex flex-col items-center gap-2">
                  <a
                    href="/login?next=/"
                    className="rounded-full bg-indigo-600 px-6 py-3 text-sm font-semibold text-white transition hover:bg-indigo-500 active:scale-95"
                  >
                    More listings
                  </a>
                  <p className="text-sm text-zinc-500 dark:text-zinc-400">
                    Sign up or log in to see all listings.
                  </p>
                </div>
              )}
            </>
          )}
        </section>
      </main>
    </div>
  );
}
