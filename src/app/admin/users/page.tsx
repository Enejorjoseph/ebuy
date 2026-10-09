import Link from "next/link";
import { requireAdmin } from "@/lib/auth";
import { getProfiles } from "@/lib/data/profiles";
import { updateUserRole } from "@/lib/actions/admin";
import PageHeader from "@/components/page-header";

export default async function AdminUsersPage({
  searchParams,
}: {
  searchParams: Promise<{ error?: string }>;
}) {
  const admin = await requireAdmin();
  const { error } = await searchParams;

  let profiles: Awaited<ReturnType<typeof getProfiles>> = [];
  try {
    profiles = await getProfiles();
  } catch {
    profiles = [];
  }

  return (
    <div className="flex flex-1 flex-col">
      <PageHeader title="Users" subtitle={`${profiles.length} total`} />

      <main className="mx-auto w-full max-w-6xl flex-1 px-4 py-8 sm:px-6">
        {error && (
          <p className="mb-4 rounded-lg bg-red-50 px-4 py-2 text-sm text-red-600 dark:bg-red-950/40 dark:text-red-400">
            {error}
          </p>
        )}

        <div className="flex flex-col gap-3">
          {profiles.map((profile) => (
            <div
              key={profile.id}
              className="flex flex-wrap items-center gap-4 rounded-2xl border border-zinc-200 bg-white p-3 sm:p-4 dark:border-zinc-800 dark:bg-zinc-900"
            >
              <div className="min-w-0 flex-1">
                <p className="font-semibold">
                  {profile.fullName || profile.email || "User"}
                  {profile.id === admin.id && (
                    <span className="ml-2 text-xs font-normal text-zinc-500">
                      (you)
                    </span>
                  )}
                </p>
                <p className="truncate text-sm text-zinc-500 dark:text-zinc-400">
                  {profile.email}
                </p>
              </div>

              <span className="rounded-full bg-zinc-100 px-3 py-1 text-xs font-semibold uppercase text-zinc-600 dark:bg-zinc-800 dark:text-zinc-300">
                {profile.role}
              </span>

              <form action={updateUserRole} className="flex items-center gap-2">
                <input type="hidden" name="userId" value={profile.id} />
                <input
                  type="hidden"
                  name="role"
                  value={profile.role === "admin" ? "buyer" : "admin"}
                />
                <button
                  type="submit"
                  className="rounded-full border border-zinc-300 px-4 py-2 text-sm font-medium transition hover:bg-zinc-100 dark:border-zinc-700 dark:hover:bg-zinc-800"
                >
                  {profile.role === "admin" ? "Remove admin" : "Make admin"}
                </button>
              </form>
            </div>
          ))}
        </div>

        <p className="mt-6 text-sm text-zinc-500 dark:text-zinc-400">
          <Link href="/admin" className="text-indigo-600">
            Back to admin
          </Link>
        </p>
      </main>
    </div>
  );
}
