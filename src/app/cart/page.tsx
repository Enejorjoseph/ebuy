"use client";

import Link from "next/link";
import { useCart } from "@/components/cart-context";
import { displaySellerName, formatPrice } from "@/lib/format";

export default function CartPage() {
  const { items, remove, clear, subtotal, count } = useCart();

  return (
    <div className="flex flex-1 flex-col">
      <section className="relative overflow-hidden border-b border-zinc-200 dark:border-zinc-800">
        <div className="pointer-events-none absolute inset-0 -z-10 bg-gradient-to-b from-indigo-100 to-transparent dark:from-indigo-950/40" />
        <div className="mx-auto w-full max-w-6xl px-4 py-8 sm:px-6 sm:py-10">
          <h1 className="text-2xl font-bold tracking-tight sm:text-3xl">
            Your cart
          </h1>
          <p className="mt-1 text-sm text-zinc-500 sm:text-base dark:text-zinc-400">
            {count} {count === 1 ? "item" : "items"}
          </p>
        </div>
      </section>

      <main className="mx-auto w-full max-w-4xl flex-1 px-4 py-8 sm:px-6">
        {items.length === 0 ? (
          <div className="rounded-2xl border border-dashed border-zinc-300 bg-white p-8 text-center dark:border-zinc-700 dark:bg-zinc-900">
            <p className="text-sm text-zinc-500 dark:text-zinc-400">
              Your cart is empty.{" "}
              <Link href="/" className="text-indigo-600">
                Browse listings
              </Link>
              .
            </p>
          </div>
        ) : (
          <div className="flex flex-col gap-6">
            <ul className="flex flex-col gap-4">
              {items.map((item) => (
                <li
                  key={item.id}
                  className="flex items-center gap-4 rounded-2xl border border-zinc-200 bg-white p-3 sm:p-4 dark:border-zinc-800 dark:bg-zinc-900"
                >
                  <Link
                    href={`/listings/${item.id}`}
                    className="flex h-16 w-16 shrink-0 items-center justify-center overflow-hidden rounded-xl bg-gradient-to-br from-zinc-100 to-zinc-200 dark:from-zinc-800 dark:to-zinc-700"
                  >
                    {item.imageUrl ? (
                      <img
                        src={item.imageUrl}
                        alt={item.title}
                        className="h-full w-full object-cover"
                      />
                    ) : (
                      <span className="text-2xl">📦</span>
                    )}
                  </Link>

                  <div className="min-w-0 flex-1">
                    <Link
                      href={`/listings/${item.id}`}
                      className="font-semibold hover:underline"
                    >
                      {item.title}
                    </Link>
                    <p className="truncate text-sm text-zinc-500 dark:text-zinc-400">
                      {displaySellerName({
                        fullName: item.sellerName,
                        email: null,
                      })}
                    </p>
                  </div>

                  <span className="font-bold">{formatPrice(item.price)}</span>

                  <button
                    type="button"
                    onClick={() => remove(item.id)}
                    className="rounded-full border border-red-200 px-3 py-1.5 text-sm font-medium text-red-600 hover:bg-red-50 dark:border-red-900 dark:text-red-400 dark:hover:bg-red-950/40"
                  >
                    Remove
                  </button>
                </li>
              ))}
            </ul>

            <div className="flex flex-col gap-4 rounded-2xl border border-zinc-200 bg-white p-4 sm:p-6 dark:border-zinc-800 dark:bg-zinc-900">
              <div className="flex items-center justify-between text-base">
                <span className="text-zinc-500 dark:text-zinc-400">Subtotal</span>
                <span className="text-xl font-bold">{formatPrice(subtotal)}</span>
              </div>
              <button
                type="button"
                className="rounded-full bg-indigo-600 py-3 text-sm font-semibold text-white transition hover:bg-indigo-500 active:scale-95"
              >
                Checkout
              </button>
              <button
                type="button"
                onClick={clear}
                className="rounded-full border border-zinc-300 py-3 text-sm font-semibold transition hover:bg-zinc-100 dark:border-zinc-700 dark:hover:bg-zinc-800"
              >
                Clear cart
              </button>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
