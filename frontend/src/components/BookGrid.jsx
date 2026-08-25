import React, { useState } from "react";
import { BookGridSkeleton } from "./BookGridSkeleton";
import { useNavigate } from 'react-router-dom';
import { Heart } from "lucide-react";
import { getLocalCover } from "../utils/ebookParser";

export function BookGrid({
  books,
  isEbook,
  onAction,
  onSelectBook,
  emptyMessage,
  loading = false,
  favorites = [],
  toggleFavorite = () => {},
}) {
  const [hoveredId, setHoveredId] = useState(null);
  const navigate = useNavigate();

  // Show skeleton UI while loading data
  if (loading) {
    return <BookGridSkeleton />;
  }

  if (books.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center p-12 border border-dashed border-zinc-200 bg-white rounded-2xl text-center w-full col-span-full">
        <p className="text-sm font-semibold text-zinc-500">
          {emptyMessage}
        </p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6 animate-fade-in">
      {books.map((b) => {
        const isHovered = hoveredId === b.id;
        const coverUrl = getLocalCover(b.title, b.ebook?.cover_image_url || b.cover_image_url);
        const categoryName = b.ebook?.category || b.category || "General";
        const isFavorited = favorites.includes(b.id);

        return (
          <div
            key={b.id}
            className="group relative border border-[#EAD8D8] p-4 bg-[#FAF2F2] cursor-pointer transition-all duration-300 rounded-2xl shadow-sm hover:-translate-y-1 hover:shadow-md flex flex-col justify-between"
            onMouseEnter={() => setHoveredId(b.id)}
            onMouseLeave={() => setHoveredId(null)}
            onClick={() => onSelectBook(b)}
          >
            <div>
              {/* Cover Image Container */}
              <div className="relative aspect-[3/4] w-full bg-zinc-50 rounded-xl overflow-hidden shadow-inner flex items-center justify-center border border-zinc-100/80">
                {coverUrl ? (
                  <img
                    src={coverUrl}
                    alt={b.title}
                    className="w-full h-full object-cover group-hover:scale-102 transition-transform duration-300"
                  />
                ) : (
                  <div className="w-full h-full bg-gradient-to-br from-zinc-100 to-zinc-200 flex flex-col justify-between p-4 text-center">
                    <span className="text-[10px] uppercase tracking-wider text-zinc-400 font-semibold">{categoryName}</span>
                    <span className="font-serif font-bold text-sm text-zinc-800 line-clamp-3 my-auto">{b.title}</span>
                    <span className="text-xs text-zinc-500 line-clamp-1">{b.author}</span>
                  </div>
                )}

                {/* Heart Button Overlay */}
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    toggleFavorite(b.id);
                  }}
                  className="absolute top-2.5 right-2.5 z-10 w-8 h-8 rounded-full bg-white/90 hover:bg-white backdrop-blur-sm flex items-center justify-center shadow-sm text-zinc-400 hover:text-red-500 transition-colors focus:outline-none"
                >
                  <Heart
                    size={16}
                    className={isFavorited ? "text-[#851C1C] fill-[#851C1C]" : "text-zinc-400"}
                  />
                </button>
              </div>

              {/* Tag / Category Badge */}
              <span className="inline-block mt-3 text-[#851C1C] text-xs font-semibold">
                {categoryName}
              </span>

              {/* Book Details */}
              <h3 className="font-serif font-bold text-base text-zinc-900 mt-2 truncate group-hover:text-[#851C1C] transition-colors" title={b.title}>
                {b.title}
              </h3>
              <p className="text-zinc-500 text-sm mt-0.5 truncate">
                by {b.author}
              </p>
            </div>
          </div>
        );
      })}
    </div>
  );
}
