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
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 animate-fade-in">
      {books.map((b) => {
        const isHovered = hoveredId === b.id;

        return (
          <div
            key={b.id}
            className="group relative border-2 border-zinc-300 dark:border-zinc-700 p-6 bg-white dark:bg-zinc-900 cursor-pointer transition-all duration-300 ease-out rounded-none hover:-translate-y-1 hover:-translate-x-1 shadow-none hover:shadow-[4px_4px_0px_#000] dark:hover:shadow-[4px_4px_0px_#fff]"
            onMouseEnter={() => setHoveredId(b.id)}
            onMouseLeave={() => setHoveredId(null)}
            onClick={() => onSelectBook(b)}
          >
            <div>
              <span className="text-[10px] font-semibold text-zinc-500 dark:text-zinc-450 uppercase tracking-widest block mb-2">
                {isEbook ? "Ebook" : "Hardcover"} {b.ebook?.category || b.category ? `· ${b.ebook?.category || b.category}` : ""}
              </span>

              <span className="text-lg font-bold text-zinc-955 dark:text-white mb-1 leading-snug block transition-colors">
                {b.title}
              </span>

              <span className="text-sm text-zinc-500 dark:text-zinc-450 mb-6 block">
                by {b.author}
              </span>
            </div>

            <div className="flex items-center justify-between mt-6 pt-4 border-t-2 border-zinc-300 dark:border-zinc-700">
              <button
                disabled={!isEbook && b.available_copies < 1}
                onClick={(e) => {
                  e.stopPropagation();
                  if (isEbook) {
                    navigate(`/books/${b.id}/read`);
                  } else {
                    onAction(b.id);
                  }
                }}
                className="px-4 py-2 bg-zinc-950 border-2 border-zinc-950 dark:bg-zinc-50 dark:border-zinc-50 text-white dark:text-zinc-950 font-semibold text-xs uppercase tracking-wider hover:bg-white hover:text-zinc-950 dark:hover:bg-zinc-950 dark:hover:text-white transition-all hover:shadow-[2px_2px_0px_#000] dark:hover:shadow-[2px_2px_0px_#fff] rounded-none cursor-pointer disabled:opacity-40 disabled:cursor-not-allowed"
              >
                {isEbook ? "Read" : "Lease"}
              </button>
            </div>
          </div>
        );
      })}
    </div>
  );
}
