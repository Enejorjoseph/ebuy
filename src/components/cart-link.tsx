"use client";

import Link from "next/link";
import { useCart } from "@/components/cart-context";

export default function CartLink() {
  const { count } = useCart();

  return (
    <Link
      href="/cart"
      aria-label="Cart"
      className="relative rounded-full border border-zinc-300 p-2 text-sm leading-none transition hover:bg-zinc-100 dark:border-zinc-700 dark:hover:bg-zinc-800"
    >
      <span aria-hidden>🛒</span>
      {count > 0 && (
        <span className="absolute -right-1 -top-1 flex h-4 w-4 items-center justify-center rounded-full bg-indigo-600 text-[10px] font-bold text-white">
          {count}
        </span>
      )}
    </Link>
  );
}
