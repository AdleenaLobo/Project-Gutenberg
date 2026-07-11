import React, { useState } from "react";
import { BookOpen } from "lucide-react";
import { useNavigate } from "react-router-dom";

export function BookDetails({ book, isEbook, onBack, onAction }) {
  const navigate = useNavigate();
  const [isExpanded, setIsExpanded] = useState(false);

  const summaryText = book.summary || book.ebook?.summary ||
    "No summary provided for this title yet. This volume remains an essential addition to the local archive collection.";

  return (
    <div className="min-h-full w-full flex items-center justify-center p-6 bg-zinc-50 dark:bg-zinc-955">
      <div className="max-w-4xl w-full py-8">
        {/* Two-Column Side-by-Side Wrapper */}
        <div className="flex flex-col md:flex-row gap-8 items-stretch md:h-[450px]">
        {/* Left Side: Cover Image */}
        <div className="flex-shrink-0 w-full md:w-72 h-[400px] md:h-full flex flex-col">
          {book.ebook?.cover_image_url ? (
            <img
              src={book.ebook.cover_image_url}
              alt={`${book.title} cover`}
              className="w-full h-full object-cover border-2 border-zinc-300 dark:border-zinc-700 bg-zinc-100 dark:bg-zinc-900 rounded-none"
            />
          ) : (
            <div className="w-full h-full border-2 border-dashed border-zinc-300 dark:border-zinc-700 flex flex-col items-center justify-center bg-zinc-100 dark:bg-zinc-900 text-zinc-400 dark:text-zinc-505 p-4 text-center rounded-none">
              <BookOpen
                size={32}
                className="mb-2 text-zinc-955 dark:text-white"
              />
              <span className="text-[10px] font-semibold text-zinc-955 dark:text-white tracking-wider">
                NO COVER
              </span>
            </div>
          )}
        </div>

        {/* Right Side: The Main Details Box */}
        <div className="flex-grow w-full border-2 border-zinc-300 dark:border-zinc-700 p-8 bg-white dark:bg-zinc-900 shadow-[8px_8px_0px_#000] dark:shadow-[8px_8px_0px_#fff] rounded-none flex flex-col justify-between h-full">
          <div>
            <div className="flex justify-between items-start gap-4 mb-3">
              <h1 className="text-3xl font-bold font-serif text-zinc-955 dark:text-white mt-0 leading-tight">
                {book.title}
              </h1>

              {(book.category || book.ebook?.category) && (
                <span className="flex-shrink-0 inline-block text-sm font-normal text-zinc-500 dark:text-zinc-400 bg-transparent border border-zinc-200 dark:border-zinc-800 px-2 py-0.5 rounded tracking-wider mt-1.5">
                  {book.category || book.ebook?.category}
                </span>
              )}
            </div>

            <p className="text-lg text-zinc-500 dark:text-zinc-455 mt-0 mb-6">
              by {book.author}
            </p>

            <hr className="border-t border-zinc-200 dark:border-zinc-800 my-6" />

            <h3 className="text-base font-bold tracking-wider text-zinc-500 dark:text-zinc-400 mb-3 block">
              Summary
            </h3>
            <div 
              className={`text-base leading-relaxed text-zinc-700 dark:text-zinc-300 text-justify pr-2 ${
                summaryText.length > 120 ? "h-32 md:h-36" : ""
              } ${isExpanded ? "overflow-y-auto" : "overflow-hidden"}`}
            >
              <p className={!isExpanded && summaryText.length > 120 ? "line-clamp-5" : ""}>
                {summaryText}
              </p>
            </div>
            {summaryText.length > 120 && (
              <button 
                onClick={() => setIsExpanded(!isExpanded)}
                className="text-xs font-bold text-zinc-500 hover:text-zinc-700 dark:text-zinc-400 dark:hover:text-zinc-300 mt-2 inline-block cursor-pointer border-none bg-transparent p-0"
              >
                {isExpanded ? "Show Less" : "Read More..."}
              </button>
            )}
          </div>

          <div className="mt-auto pt-6">
            <button
              onClick={() => navigate(`/books/${book.id}/read`)}
              className="h-[38px] px-4 flex items-center justify-center border border-zinc-200 dark:border-zinc-800 bg-zinc-100 dark:bg-zinc-800 text-zinc-955 dark:text-zinc-50 font-normal text-base tracking-wider hover:bg-zinc-200 dark:hover:bg-zinc-700 transition-all duration-200 rounded-lg cursor-pointer"
            >
              Open Reader
            </button>
          </div>
        </div>
      </div>
     </div>
    </div>
  );
}
