import Link from "next/link";
import { login } from "@/lib/actions/auth";

export default async function LoginPage({
  searchParams,
}: {
  searchParams: Promise<{ error?: string; next?: string }>;
}) {
  const { error, next: nextParam } = await searchParams;
  const next = nextParam || "/";

  return (
    <main className="relative flex flex-1 flex-col items-center justify-center overflow-hidden px-4 py-12">
      <div className="pointer-events-none absolute inset-0 -z-10 bg-gradient-to-b from-indigo-100 to-transparent dark:from-indigo-950/40" />
      <div className="w-full max-w-md rounded-2xl border border-zinc-200 bg-white p-6 shadow-sm dark:border-zinc-800 dark:bg-zinc-900">
        <h1 className="text-xl font-bold tracking-tight sm:text-2xl">Log in</h1>
        <p className="mt-1 text-sm text-zinc-500 dark:text-zinc-400">
          Welcome back to eBuy.
        </p>

        <form action={login} className="mt-6 flex flex-col gap-3">
          <input type="hidden" name="next" value={next} />
          <input
            name="email"
            type="email"
            required
            placeholder="you@example.com"
            className="rounded-lg border border-zinc-200 px-3 py-2 text-sm dark:border-zinc-700"
          />
          <input
            name="password"
            type="password"
            required
            placeholder="Password"
            className="rounded-lg border border-zinc-200 px-3 py-2 text-sm dark:border-zinc-700"
          />
          <button
            type="submit"
            className="mt-2 rounded-full bg-indigo-600 py-2.5 text-sm font-semibold text-white hover:bg-indigo-500"
          >
            Log in
          </button>
        </form>

        {error && (
          <p className="mt-4 text-sm text-red-600 dark:text-red-400">{error}</p>
        )}

        <p className="mt-6 text-center text-sm text-zinc-500 dark:text-zinc-400">
          No account?{" "}
          <Link className="font-semibold text-indigo-600" href="/register">
            Sign up
          </Link>
        </p>
      </div>
    </main>
  );
}
