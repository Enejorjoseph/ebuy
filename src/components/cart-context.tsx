"use client";

import { useSyncExternalStore } from "react";

export type CartItem = {
  id: string;
  title: string;
  price: number;
  imageUrl: string | null;
  sellerName: string | null;
};

const STORAGE_KEY = "ebuy-cart";
const EMPTY: CartItem[] = [];

let items: CartItem[] = EMPTY;
let hydrated = false;
const listeners = new Set<() => void>();

function emit() {
  for (const listener of listeners) listener();
}

function load(): CartItem[] {
  if (!hydrated && typeof window !== "undefined") {
    try {
      const raw = window.localStorage.getItem(STORAGE_KEY);
      items = raw ? (JSON.parse(raw) as CartItem[]) : EMPTY;
    } catch {
      items = EMPTY;
    }
    hydrated = true;
  }
  return items;
}

function getSnapshot(): CartItem[] {
  return load();
}

function getServerSnapshot(): CartItem[] {
  return EMPTY;
}

function persist(next: CartItem[]) {
  items = next;
  if (typeof window !== "undefined") {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
  }
  emit();
}

function subscribe(listener: () => void) {
  listeners.add(listener);

  const onStorage = (event: StorageEvent) => {
    if (event.key === STORAGE_KEY) {
      hydrated = false;
      emit();
    }
  };
  window.addEventListener("storage", onStorage);

  return () => {
    listeners.delete(listener);
    window.removeEventListener("storage", onStorage);
  };
}

function add(item: CartItem) {
  if (items.some((existing) => existing.id === item.id)) return;
  persist([...items, item]);
}

function remove(id: string) {
  persist(items.filter((item) => item.id !== id));
}

function clear() {
  persist([]);
}

export function useCart() {
  const current = useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);

  return {
    items: current,
    add,
    remove,
    clear,
    has: (id: string) => current.some((item) => item.id === id),
    count: current.length,
    subtotal: current.reduce((sum, item) => sum + item.price, 0),
  };
}
