import Link from "next/link";
import { getCurrentProfile } from "@/lib/auth";
import { logout } from "@/lib/actions/auth";
import CartLink from "@/components/cart-link";

export default async function SiteHeader() {
  const profile = await getCurrentProfile();

  return (
    <header className="sticky top-0 z-30 border-b border-zinc-200 bg-white/90 backdrop-blur dark:border-zinc-800 dark:bg-zinc-950/90">
      <div className="mx-auto flex h-14 w-full max-w-6xl items-center justify-between px-4 sm:h-16 sm:px-6">
        <Link href="/" className="text-xl font-extrabold tracking-tight">
          e<span className="text-indigo-600">Buy</span>
        </Link>

        <nav className="hidden gap-8 text-sm font-medium text-zinc-600 md:flex dark:text-zinc-400">
          <Link href="/" className="transition hover:text-zinc-900 dark:hover:text-white">
            Browse
          </Link>
          {profile?.role === "admin" && (
            <Link href="/admin" className="transition hover:text-zinc-900 dark:hover:text-white">
              Admin
            </Link>
          )}
        </nav>

        <div className="flex items-center gap-2 sm:gap-3">
          <CartLink />
          {profile ? (
            <>
              <a
                href="/account"
                className="hidden rounded-full border border-zinc-300 px-4 py-2 text-sm font-medium transition hover:bg-zinc-100 sm:inline-flex dark:border-zinc-700 dark:hover:bg-zinc-800"
              >
                {profile.fullName || profile.email || "Account"}
              </a>
              <form action={logout}>
                <button
                  type="submit"
                  className="hidden rounded-full bg-indigo-600 px-4 py-2 text-sm font-medium text-white transition hover:bg-indigo-500 sm:inline-flex"
                >
                  Log out
                </button>
              </form>
              <a
                href="/account"
                className="rounded-full border border-zinc-300 p-2 text-sm leading-none sm:hidden dark:border-zinc-700"
                aria-label="Account"
              >
                👤
              </a>
            </>
          ) : (
            <>
              <a
                href="/login"
                className="hidden rounded-full border border-zinc-300 px-4 py-2 text-sm font-medium transition hover:bg-zinc-100 sm:inline-flex dark:border-zinc-700 dark:hover:bg-zinc-800"
              >
                Log in
              </a>
              <a
                href="/register"
                className="rounded-full bg-indigo-600 px-4 py-2 text-sm font-medium text-white transition hover:bg-indigo-500"
              >
                Sign up
              </a>
            </>
          )}
        </div>
      </div>
    </header>
  );
}
