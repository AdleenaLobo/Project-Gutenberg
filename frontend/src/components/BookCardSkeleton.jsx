import React from "react";

export function BookCardSkeleton() {
  return (
    <div className="border-2 border-zinc-300 dark:border-zinc-700 p-6 bg-white dark:bg-zinc-900 rounded-none flex flex-col justify-between">
      <div>
        {/* Type tag placeholder */}
        <div className="bg-zinc-200 dark:bg-zinc-800 animate-pulse h-3 w-16 mb-3 rounded-none" />
        {/* Title placeholder */}
        <div className="bg-zinc-200 dark:bg-zinc-800 animate-pulse h-5 w-4/5 mb-2 rounded-none" />
        {/* Author placeholder */}
        <div className="bg-zinc-200 dark:bg-zinc-800 animate-pulse h-4 w-2/3 mb-6 rounded-none" />
      </div>

      {/* Footer placeholder – action button */}
      <div className="mt-6 pt-4 border-t-2 border-zinc-300 dark:border-zinc-700">
        <div className="bg-zinc-200 dark:bg-zinc-800 animate-pulse h-8 w-16 rounded-lg" />
      </div>
    </div>
  );
}
