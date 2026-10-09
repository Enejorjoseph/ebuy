import Link from "next/link";

export default function SiteFooter() {
  return (
    <footer className="border-t border-zinc-200 bg-white dark:border-zinc-800 dark:bg-zinc-950">
      <div className="mx-auto flex w-full max-w-6xl flex-col items-center gap-4 px-4 py-8 text-sm text-zinc-500 sm:flex-row sm:justify-between sm:px-6 dark:text-zinc-400">
        <Link href="/" className="font-extrabold text-zinc-900 dark:text-white">
          e<span className="text-indigo-600">Buy</span>
        </Link>
        <p className="order-last sm:order-none">
          © 2026 eBuy. All rights reserved.
        </p>
        <div className="flex gap-6">
          <a href="#" className="transition hover:text-zinc-900 dark:hover:text-white">
            Privacy
          </a>
          <a href="#" className="transition hover:text-zinc-900 dark:hover:text-white">
            Terms
          </a>
          <a href="#" className="transition hover:text-zinc-900 dark:hover:text-white">
            Contact
          </a>
        </div>
      </div>
    </footer>
  );
}
