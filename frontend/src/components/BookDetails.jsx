import React from "react";
import { ArrowLeft, BookOpen } from "lucide-react";
import { useNavigate } from "react-router-dom";

export function BookDetails({ book, isEbook, onBack, onAction }) {
  const navigate = useNavigate();

  return (
    <div className="px-6 py-8 max-w-4xl mx-auto">
      {/* Back Button */}
      <button
        onClick={onBack}
        className="flex items-center gap-2 text-zinc-500 hover:text-zinc-950 dark:text-zinc-400 dark:hover:text-white text-sm font-semibold mb-8 border-none bg-transparent cursor-pointer p-0 focus:outline-none transition-colors"
      >
        <ArrowLeft size={16} /> BACK TO COLLECTION
      </button>

      {/* Two-Column Side-by-Side Wrapper */}
      <div className="flex flex-col md:flex-row gap-8 items-stretch">
        {/* Left Side: Cover Image */}
        <div className="flex-shrink-0 w-full md:w-56 flex flex-col">
          {book.ebook?.cover_image_url ? (
            <img
              src={book.ebook.cover_image_url}
              alt={`${book.title} cover`}
              className="w-full h-full min-h-[320px] object-cover border-2 border-zinc-300 dark:border-zinc-700 bg-zinc-100 dark:bg-zinc-900 rounded-none"
            />
          ) : (
            <div className="w-full h-full min-h-[320px] border-2 border-dashed border-zinc-300 dark:border-zinc-700 flex flex-col items-center justify-center bg-zinc-100 dark:bg-zinc-900 text-zinc-400 dark:text-zinc-500 p-4 text-center rounded-none">
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
        <div className="flex-grow w-full border-2 border-zinc-300 dark:border-zinc-700 p-8 bg-white dark:bg-zinc-900 shadow-[8px_8px_0px_#000] dark:shadow-[8px_8px_0px_#fff] rounded-none">
          <span className="text-[10px] text-zinc-555 dark:text-zinc-450 uppercase tracking-widest font-bold">
            {isEbook ? "Digital Edition" : "Physical Hardcover"}{" "}
            {book.category && `· ${book.category}`}
          </span>

          <h1 className="text-3xl font-bold text-zinc-950 dark:text-white mt-2 mb-1 uppercase">
            {book.title}
          </h1>

          <p className="text-lg text-zinc-500 dark:text-zinc-450 mt-0 mb-6">
            by {book.author}
          </p>

          <hr className="border-t-2 border-zinc-300 dark:border-zinc-700 my-6" />

          <h3 className="text-xs font-bold uppercase tracking-wider text-zinc-555 dark:text-zinc-400 mb-3 block">
            Summary
          </h3>
          <p className="text-sm leading-relaxed text-zinc-700 dark:text-zinc-300 mb-8 text-justify">
            {book.summary ||
              "No summary provided for this title yet. This volume remains an essential addition to the local archive collection."}
          </p>

          {/* Footer Action Panel */}
          <div className="flex flex-col sm:flex-row gap-4 justify-between sm:items-center bg-zinc-50 dark:bg-zinc-950/20 p-3.5 px-4 border-2 border-zinc-300 dark:border-zinc-700 rounded-none max-w-xl">
            <div>
              {!isEbook ? (
                <span className="text-xs font-semibold text-zinc-955 dark:text-zinc-100">
                  Status: {book.available_copies} / {book.total_copies} copies on shelves.
                </span>
              ) : (
                <span className="text-xs font-semibold text-zinc-955 dark:text-zinc-100">
                  Format: Instant access ({book.ebook_source || "Library"}).
                </span>
              )}
            </div>

            <button
              onClick={() => {
                if (isEbook) {
                  navigate(`/books/${book.id}/read`);
                } else {
                  onAction(book.id);
                }
              }}
              disabled={!isEbook && book.available_copies < 1}
              className="px-4 py-2 bg-zinc-950 border-2 border-zinc-950 dark:bg-zinc-50 dark:border-zinc-50 text-white dark:text-zinc-955 font-semibold text-xs uppercase tracking-wider hover:bg-white hover:text-zinc-950 dark:hover:bg-zinc-955 dark:hover:text-white transition-all hover:shadow-[2px_2px_0px_#000] dark:hover:shadow-[2px_2px_0px_#fff] rounded-none cursor-pointer disabled:opacity-40 disabled:cursor-not-allowed"
            >
              {isEbook ? "Open Reader" : "Lease Hardcover"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
