"use client";

import { useState } from "react";

export default function ListingImageField({
  defaultValue = null,
}: {
  defaultValue?: string | null;
}) {
  const [preview, setPreview] = useState<string | null>(defaultValue);

  return (
    <div className="flex flex-col gap-3">
      <div className="flex h-40 w-40 items-center justify-center overflow-hidden rounded-xl border border-zinc-200 bg-gradient-to-br from-zinc-100 to-zinc-200 dark:border-zinc-700 dark:from-zinc-800 dark:to-zinc-700">
        {preview ? (
          <img
            src={preview}
            alt="Listing preview"
            className="h-full w-full object-cover"
          />
        ) : (
          <span className="text-4xl">📦</span>
        )}
      </div>
      <input
        type="file"
        name="image"
        accept="image/*"
        onChange={(event) => {
          const file = event.target.files?.[0];
          if (file) setPreview(URL.createObjectURL(file));
        }}
        className="text-sm text-zinc-600 file:mr-3 file:rounded-full file:border-0 file:bg-indigo-600 file:px-4 file:py-2 file:text-sm file:font-semibold file:text-white hover:file:bg-indigo-500 dark:text-zinc-400"
      />
      <p className="text-xs text-zinc-500 dark:text-zinc-400">
        JPG, PNG, WebP or GIF. Max 5MB.
      </p>
    </div>
  );
}
