import React from "react";
import { BookOpen } from "lucide-react";
import { useNavigate } from "react-router-dom";

export function BookDetails({ book, isEbook, onBack, onAction }) {
  const navigate = useNavigate();

  return (
    <div className="min-h-full w-full flex items-center justify-center p-6 bg-zinc-50 dark:bg-zinc-955">
      <div className="max-w-4xl w-full py-8">
        {/* Two-Column Side-by-Side Wrapper */}
        <div className="flex flex-col md:flex-row gap-8 items-stretch">
        {/* Left Side: Cover Image */}
        <div className="flex-shrink-0 w-full md:w-72 flex flex-col">
          {book.ebook?.cover_image_url ? (
            <img
              src={book.ebook.cover_image_url}
              alt={`${book.title} cover`}
              className="w-full h-full min-h-[400px] object-cover border-2 border-zinc-300 dark:border-zinc-700 bg-zinc-100 dark:bg-zinc-900 rounded-none"
            />
          ) : (
            <div className="w-full h-full min-h-[400px] border-2 border-dashed border-zinc-300 dark:border-zinc-700 flex flex-col items-center justify-center bg-zinc-100 dark:bg-zinc-900 text-zinc-400 dark:text-zinc-505 p-4 text-center rounded-none">
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
          <div className="flex justify-between items-start gap-4 mb-3">
            <h1 className="text-3xl font-bold font-serif text-zinc-955 dark:text-white mt-0 leading-tight">
              {book.title}
            </h1>

            {book.category && (
              <span className="flex-shrink-0 inline-block text-sm font-normal text-zinc-500 dark:text-zinc-400 bg-transparent border border-zinc-200 dark:border-zinc-800 px-2 py-0.5 rounded tracking-wider mt-1.5">
                {book.category}
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
          <p className="text-base leading-relaxed text-zinc-700 dark:text-zinc-300 mb-8 text-justify">
            {book.summary ||
              "No summary provided for this title yet. This volume remains an essential addition to the local archive collection."}
          </p>


          <button
            onClick={() => navigate(`/books/${book.id}/read`)}
            className="px-3 py-1 border border-zinc-200 dark:border-zinc-800 bg-zinc-100 dark:bg-zinc-800 text-zinc-955 dark:text-zinc-50 font-normal text-base tracking-wider hover:bg-zinc-200 dark:hover:bg-zinc-700 transition-all duration-200 rounded-lg cursor-pointer"
          >
            Open Reader
          </button>
        </div>
      </div>
     </div>
    </div>
  );
}
