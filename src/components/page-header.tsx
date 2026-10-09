import type { ReactNode } from "react";

export default function PageHeader({
  title,
  subtitle,
  children,
}: {
  title: string;
  subtitle?: string;
  children?: ReactNode;
}) {
  return (
    <section className="relative overflow-hidden border-b border-zinc-200 dark:border-zinc-800">
      <div className="pointer-events-none absolute inset-0 -z-10 bg-gradient-to-b from-indigo-100 to-transparent dark:from-indigo-950/40" />
      <div className="mx-auto w-full max-w-6xl px-4 py-8 sm:px-6 sm:py-10">
        <h1 className="text-2xl font-bold tracking-tight sm:text-3xl">
          {title}
        </h1>
        {subtitle && (
          <p className="mt-1 text-sm text-zinc-500 sm:text-base dark:text-zinc-400">
            {subtitle}
          </p>
        )}
        {children}
      </div>
    </section>
  );
}
