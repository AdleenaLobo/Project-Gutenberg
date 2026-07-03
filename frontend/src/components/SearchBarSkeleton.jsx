import React from "react";

export function SearchBarSkeleton() {
  return (
    <div className="flex items-center border-2 border-zinc-300 dark:border-zinc-700 bg-white dark:bg-zinc-900 px-4 py-3.5 mb-8 rounded-none animate-pulse">
      {/* Icon placeholder */}
      <div className="bg-zinc-200 dark:bg-zinc-800 h-4 w-4 mr-3 rounded" />
      {/* Input placeholder */}
      <div className="bg-zinc-200 dark:bg-zinc-800 h-4 flex-1 rounded" />
    </div>
  );
}
