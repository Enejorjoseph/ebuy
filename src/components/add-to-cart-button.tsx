"use client";

import Link from "next/link";
import { useState } from "react";
import { useCart, type CartItem } from "@/components/cart-context";

export default function AddToCartButton({ item }: { item: CartItem }) {
  const { add, has } = useCart();
  const [justAdded, setJustAdded] = useState(false);
  const inCart = has(item.id);

  return (
    <div className="flex flex-col gap-3">
      <button
        type="button"
        onClick={() => {
          add(item);
          setJustAdded(true);
        }}
        disabled={inCart || justAdded}
        className="w-full rounded-full bg-indigo-600 py-3 text-sm font-semibold text-white transition hover:bg-indigo-500 active:scale-95 disabled:cursor-default disabled:bg-emerald-600 sm:w-auto sm:px-8"
      >
        {inCart || justAdded ? "In your cart ✓" : "Add to cart"}
      </button>
      {(inCart || justAdded) && (
        <Link
          href="/cart"
          className="text-center text-sm font-semibold text-indigo-600 sm:text-left"
        >
          View cart →
        </Link>
      )}
    </div>
  );
}
