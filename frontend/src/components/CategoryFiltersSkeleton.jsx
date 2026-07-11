import React from "react";

export function CategoryFiltersSkeleton() {
  const placeholders = Array.from({ length: 6 });
  return (
    <div className="mb-10">
      <div className="flex gap-2.5 flex-wrap">
        {placeholders.map((_, i) => (
          <div 
            key={i} 
            className={`bg-zinc-200 dark:bg-zinc-800 animate-pulse h-10 rounded-lg border border-transparent ${
              i % 3 === 0 ? "w-16" : i % 3 === 1 ? "w-24" : "w-20"
            }`} 
          />
        ))}
      </div>
    </div>
  );
}
