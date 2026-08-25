import React from "react";
import { ArrowLeft } from "lucide-react";

export function BookDetailsSkeleton() {
  return (
    <div className="min-h-full w-full flex items-center justify-center p-6 bg-transparent">
      <div className="max-w-4xl w-full py-8">

      <div className="flex flex-col md:flex-row gap-8 items-stretch md:h-[450px]">
        {/* Left side – cover image placeholder */}
        <div className="flex-shrink-0 w-full md:w-72 h-[400px] md:h-full flex flex-col rounded-2xl overflow-hidden shadow-sm border border-[#EAD8D8]">
          <div className="bg-[#FAF2F2] dark:bg-zinc-800 animate-pulse w-full h-full" />
        </div>

        {/* Right side – content placeholders */}
        <div className="flex-grow w-full border border-[#EAD8D8] p-8 bg-[#FAF2F2] shadow-sm rounded-2xl flex flex-col justify-between h-full">
          <div>
            <div className="flex justify-between items-start gap-4 mb-3">
              {/* Title */}
              <div className="bg-[#EAD8D8] dark:bg-zinc-800 animate-pulse w-2/3 h-8 rounded" />
              {/* Category tag */}
              <div className="bg-[#EAD8D8] dark:bg-zinc-800 animate-pulse w-16 h-4 mt-2 rounded" />
            </div>
            {/* Author */}
            <div className="bg-[#EAD8D8] dark:bg-zinc-800 animate-pulse w-1/3 h-4 mb-6 rounded" />
            
            <hr className="border-t border-[#EAD8D8] my-6" />
            
            {/* Summary heading */}
            <div className="bg-[#EAD8D8] dark:bg-zinc-800 animate-pulse w-20 h-3 mb-4 rounded" />
            {/* Summary text container matching fixed height h-32 md:h-36 */}
            <div className="h-32 md:h-36 flex flex-col gap-3">
              <div className="bg-[#EAD8D8] dark:bg-zinc-800 animate-pulse w-full h-3 rounded" />
              <div className="bg-[#EAD8D8] dark:bg-zinc-800 animate-pulse w-[95%] h-3 rounded" />
              <div className="bg-[#EAD8D8] dark:bg-zinc-800 animate-pulse w-[90%] h-3 rounded" />
              <div className="bg-[#EAD8D8] dark:bg-zinc-800 animate-pulse w-[85%] h-3 rounded" />
            </div>
          </div>
          
          {/* Button placeholder at bottom */}
          <div className="mt-auto pt-6">
            <div className="bg-[#EAD8D8] dark:bg-zinc-800 animate-pulse w-32 h-10 rounded-lg" />
          </div>
        </div>
      </div>
      </div>
    </div>
  );
}
