import React from "react";

export function BookCardSkeleton() {
  return (
    <div className="bg-white rounded-2xl shadow-sm overflow-hidden border border-zinc-100 flex flex-col h-full animate-pulse">
      <div className="aspect-[3/4] w-full bg-[#FAF2F2] dark:bg-zinc-800" />
      <div className="p-4 flex flex-col flex-1">
        <div className="mt-2 h-3 bg-[#EAD8D8] dark:bg-zinc-800 w-1/3 rounded" />
        <div className="mt-3 h-5 bg-[#EAD8D8] dark:bg-zinc-800 w-3/4 rounded" />
        <div className="mt-2 h-3 bg-[#EAD8D8] dark:bg-zinc-800 w-1/2 rounded" />
      </div>
    </div>
  );
}
