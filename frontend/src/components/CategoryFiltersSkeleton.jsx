import React from "react";

export function CategoryFiltersSkeleton() {
  const placeholders = Array.from({ length: 6 });
  return (
    <div className="mb-10">
      <div className="flex gap-6 flex-wrap">
        {placeholders.map((_, i) => (
          <div 
            key={i} 
            className={`bg-[#EAD8D8] dark:bg-zinc-800 animate-pulse h-4 mt-2 rounded ${
              i % 3 === 0 ? "w-12" : i % 3 === 1 ? "w-20" : "w-16"
            }`} 
          />
        ))}
      </div>
    </div>
  );
}
