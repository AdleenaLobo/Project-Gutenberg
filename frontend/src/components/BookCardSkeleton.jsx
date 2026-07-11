import React from "react";

export function BookCardSkeleton() {
  return (
    <div className="border-2 border-zinc-300 dark:border-zinc-700 px-8 py-4 bg-white dark:bg-zinc-900 rounded-none flex flex-col justify-between">
      <div>
        <div className="flex justify-between items-start gap-4 mb-1.5">
          {/* Title placeholder */}
          <div className="bg-zinc-200 dark:bg-zinc-800 animate-pulse h-5 w-2/3 rounded-none" />
          {/* Category tag placeholder */}
          <div className="bg-zinc-200 dark:bg-zinc-800 animate-pulse h-6 w-16 rounded" />
        </div>
        {/* Author placeholder */}
        <div className="bg-zinc-200 dark:bg-zinc-800 animate-pulse h-4 w-1/3 mb-3 rounded-none" />
      </div>

      {/* Button placeholder */}
      <div className="mt-3">
        <div className="bg-zinc-200 dark:bg-zinc-800 animate-pulse h-[38px] w-16 rounded-lg" />
      </div>
    </div>
  );
}
