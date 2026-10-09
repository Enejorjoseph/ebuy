import { getCurrentProfile } from "@/lib/auth";
import { logout } from "@/lib/actions/auth";
import PageHeader from "@/components/page-header";

export default async function AccountPage() {
  const profile = await getCurrentProfile();

  if (!profile) {
    return (
      <div className="flex flex-1 flex-col items-center justify-center px-4 py-16">
        <div className="text-center">
          <h1 className="text-xl font-bold">Account</h1>
          <p className="mt-2 text-sm text-zinc-500">
            Please <a href="/login" className="text-indigo-600">log in</a>.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-1 flex-col">
      <PageHeader title="Account" subtitle={profile.email ?? "No email on profile"} />

      <main className="mx-auto w-full max-w-6xl flex-1 px-4 py-8 sm:px-6">
        <div className="flex flex-col gap-6">
          <section className="rounded-2xl border border-zinc-200 bg-white p-4 sm:p-6 dark:border-zinc-800 dark:bg-zinc-900">
            <h2 className="text-base font-semibold">Profile</h2>
            <p className="mt-1 text-sm text-zinc-500 dark:text-zinc-400">
              Signed in as{" "}
              <span className="font-medium">
                {profile.fullName || profile.email || "you"}
              </span>
              .
            </p>
            {profile.role === "admin" && (
              <a
                href="/admin"
                className="mt-4 inline-flex rounded-full bg-indigo-600 px-4 py-2 text-sm font-semibold text-white hover:bg-indigo-500"
              >
                Go to admin →
              </a>
            )}
          </section>

          <form action={logout}>
            <button
              type="submit"
              className="rounded-full border border-zinc-300 px-4 py-2 text-sm font-semibold hover:bg-zinc-100 dark:border-zinc-700 dark:hover:bg-zinc-800"
            >
              Log out
            </button>
          </form>
        </div>
      </main>
    </div>
  );
}
