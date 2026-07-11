import React, { useState } from "react";
import { BookGridSkeleton } from "./BookGridSkeleton";
import { useNavigate } from 'react-router-dom';

export function BookGrid({
  books,
  isEbook,
  onAction,
  onSelectBook,
  emptyMessage,
  loading = false,
}) {
  // Show skeleton UI while loading data
  // Store the currently hovered book ID to handle isolated hover states
  const [hoveredId, setHoveredId] = useState(null);
  const navigate = useNavigate();

  // Show skeleton UI while loading data
  if (loading) {
    return <BookGridSkeleton />;
  }

  if (books.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center p-12 border border-dashed border-zinc-300 dark:border-zinc-800 bg-white dark:bg-zinc-900 rounded text-center">
        <p className="text-sm font-semibold text-zinc-500 dark:text-zinc-450">
          {emptyMessage}
        </p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 animate-fade-in">
      {books.map((b) => {
        const isHovered = hoveredId === b.id;

        return (
          <div
            key={b.id}
            className="group relative border-2 border-zinc-300 dark:border-zinc-700 px-8 py-4 bg-white dark:bg-zinc-900 cursor-pointer transition-all duration-300 ease-out rounded-none hover:-translate-y-1 hover:-translate-x-1 shadow-none hover:shadow-[4px_4px_0px_#000] dark:hover:shadow-[4px_4px_0px_#fff]"
            onMouseEnter={() => setHoveredId(b.id)}
            onMouseLeave={() => setHoveredId(null)}
            onClick={() => onSelectBook(b)}
          >
            <div>
              <div className="flex justify-between items-start gap-4 mb-1.5">
                <span className="text-lg font-bold font-serif text-zinc-955 dark:text-white leading-snug block transition-colors">
                  {b.title}
                </span>

                {(b.ebook?.category || b.category) && (
                  <span className="flex-shrink-0 inline-block text-sm font-normal text-zinc-500 dark:text-zinc-400 bg-transparent border border-zinc-200 dark:border-zinc-800 px-2 py-0.5 rounded tracking-wider">
                    {b.ebook?.category || b.category}
                  </span>
                )}
              </div>

              <span className="text-base text-zinc-500 dark:text-zinc-455 mb-3 block">
                by {b.author}
              </span>
            </div>

            <div className="mt-3">
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  navigate(`/books/${b.id}/read`);
                }}
                className="h-[38px] px-4 flex items-center justify-center border border-zinc-200 dark:border-zinc-800 bg-zinc-100 dark:bg-zinc-800 text-zinc-955 dark:text-zinc-50 font-normal text-base tracking-wider hover:bg-zinc-200 dark:hover:bg-zinc-700 transition-all duration-200 rounded-lg cursor-pointer"
              >
                Read
              </button>
            </div>
          </div>
        );
      })}
    </div>
  );
}
