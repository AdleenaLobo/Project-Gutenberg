import React from "react";
import { ArrowLeft } from "lucide-react";

export function BookDetailsSkeleton() {
  return (
    <div className="px-6 py-8 max-w-4xl mx-auto">
      {/* Back button */}
      <button
        disabled
        className="flex items-center gap-2 text-zinc-300 dark:text-zinc-700 text-sm font-bold mb-8 border-none bg-transparent cursor-default p-0 uppercase"
      >
        <ArrowLeft size={16} /> BACK TO COLLECTION
      </button>

      <div className="flex flex-col md:flex-row gap-8 items-stretch">
        {/* Left side – cover image placeholder */}
        <div className="flex-shrink-0 w-full md:w-56 flex flex-col">
          <div className="bg-zinc-200 dark:bg-zinc-800 animate-pulse w-full h-full min-h-[320px] rounded-none border-2 border-zinc-300 dark:border-zinc-700" />
        </div>

        {/* Right side – content placeholders */}
        <div className="flex-grow w-full border-2 border-zinc-300 dark:border-zinc-700 p-8 bg-white dark:bg-zinc-900 shadow-[8px_8px_0px_#000] dark:shadow-[8px_8px_0px_#fff] rounded-none">
          {/* Type tag */}
          <div className="bg-zinc-200 dark:bg-zinc-800 animate-pulse w-28 h-3 mb-3 rounded-none" />
          {/* Title */}
          <div className="bg-zinc-200 dark:bg-zinc-800 animate-pulse w-2/3 h-8 mb-2 rounded-none" />
          {/* Author */}
          <div className="bg-zinc-200 dark:bg-zinc-800 animate-pulse w-1/3 h-4 mb-6 rounded-none" />
          
          <hr className="border-t-2 border-zinc-300 dark:border-zinc-700 my-6" />
          
          {/* Summary heading */}
          <div className="bg-zinc-200 dark:bg-zinc-800 animate-pulse w-20 h-4 mb-3 rounded-none" />
          {/* Summary text – several lines */}
          <div className="bg-zinc-200 dark:bg-zinc-800 animate-pulse w-full h-3 mb-2 rounded-none" />
          <div className="bg-zinc-200 dark:bg-zinc-800 animate-pulse w-[95%] h-3 mb-2 rounded-none" />
          <div className="bg-zinc-200 dark:bg-zinc-800 animate-pulse w-[90%] h-3 mb-2 rounded-none" />
          <div className="bg-zinc-200 dark:bg-zinc-800 animate-pulse w-[85%] h-3 mb-8 rounded-none" />
          
          {/* Button placeholder */}
          <div className="bg-zinc-200 dark:bg-zinc-800 animate-pulse w-28 h-8 rounded-lg" />
        </div>
      </div>
    </div>
  );
}
