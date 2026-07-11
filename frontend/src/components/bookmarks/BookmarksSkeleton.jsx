import React from "react";

export default function BookmarksSkeleton({ count = 3 }) {
  const placeholders = Array.from({ length: count });

  return (
    <div className="grid grid-cols-1 gap-6 w-full">
      {placeholders.map((_, i) => (
        <div
          key={i}
          className="flex items-center justify-between p-4 border-2 border-zinc-300 dark:border-zinc-700 bg-white dark:bg-zinc-900 rounded-none w-full animate-pulse"
        >
          <div className="flex-1">
            {/* Title / Label placeholder */}
            <div className="bg-zinc-200 dark:bg-zinc-800 h-4 w-48 mb-2 rounded-none" />
            
            {/* Meta details line placeholder */}
            <div className="flex items-center gap-2 mt-1.5 flex-wrap">
              <div className="bg-zinc-200 dark:bg-zinc-800 h-3 w-24 rounded-none" />
              <span className="text-zinc-300 dark:text-zinc-800">•</span>
              <div className="bg-zinc-200 dark:bg-zinc-800 h-3 w-16 rounded-none" />
              <span className="text-zinc-300 dark:text-zinc-800">•</span>
              <div className="bg-zinc-200 dark:bg-zinc-800 h-4 w-12 rounded-none" />
              <span className="text-zinc-300 dark:text-zinc-800">•</span>
              <div className="bg-zinc-200 dark:bg-zinc-800 h-3 w-28 rounded-none" />
            </div>
          </div>
          
          <div className="flex items-center gap-4 flex-shrink-0">
            {/* Delete button placeholder */}
            <div className="bg-zinc-200 dark:bg-zinc-800 h-8 w-8 rounded-lg" />
            {/* Arrow icon placeholder */}
            <div className="bg-zinc-200 dark:bg-zinc-800 h-4 w-4 rounded-none" />
          </div>
        </div>
      ))}
    </div>
  );
}
