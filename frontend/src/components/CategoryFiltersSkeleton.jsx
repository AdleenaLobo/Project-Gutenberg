import React from "react";

export function CategoryFiltersSkeleton() {
  const placeholders = Array.from({ length: 6 });
  return (
    <div className="border-b-2 border-zinc-300 dark:border-zinc-700 pb-6 mb-6">
      {/* Title placeholder */}
      <div className="bg-zinc-200 dark:bg-zinc-800 animate-pulse w-28 h-3.5 mb-3 rounded-none" />
      {/* Chip placeholders */}
      <div className="flex gap-2.5 flex-wrap">
        {placeholders.map((_, i) => (
          <div key={i} className="bg-zinc-200 dark:bg-zinc-800 animate-pulse w-16 h-7 rounded-none border-2 border-transparent" />
        ))}
      </div>
    </div>
  );
}
