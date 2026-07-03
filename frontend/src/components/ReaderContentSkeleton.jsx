import React from "react";

export default function ReaderContentSkeleton() {
  return (
    <div className="w-full max-w-[850px] h-[calc(100vh-90px)] mx-auto px-12 py-10 overflow-hidden select-none bg-transparent border-none shadow-none flex flex-col">
      {/* Heading */}
      <div className="bg-zinc-200 dark:bg-zinc-800 animate-pulse w-[45%] h-8 mx-auto my-8 rounded-lg" />

      {/* Paragraphs */}
      {Array.from({ length: 4 }).map((_, i) => (
        <div key={i} className="mb-6 flex flex-col gap-2.5">
          <div className="bg-zinc-200 dark:bg-zinc-800 animate-pulse w-full h-4 rounded" />
          <div className="bg-zinc-200 dark:bg-zinc-800 animate-pulse w-[98%] h-4 rounded" />
          <div className="bg-zinc-200 dark:bg-zinc-800 animate-pulse w-[96%] h-4 rounded" />
          <div className="bg-zinc-200 dark:bg-zinc-800 animate-pulse w-[70%] h-4 rounded" />
        </div>
      ))}
    </div>
  );
}
