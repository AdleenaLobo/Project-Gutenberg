import React, { useState } from "react";
import { BookOpen } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { getLocalCover, getChapterOnePreview } from "../utils/ebookParser";

export function BookDetails({ book, isEbook, onBack, onAction }) {
  const navigate = useNavigate();
  const [isExpanded, setIsExpanded] = useState(false);

  const chapterOnePreview = getChapterOnePreview(book);
  const summaryText = chapterOnePreview || book.summary || book.ebook?.summary ||
    "No summary provided for this title yet. This volume remains an essential addition to the local archive collection.";

  const coverUrl = getLocalCover(book.title, book.ebook?.cover_image_url || book.cover_image_url);

  return (
    <div className="min-h-full w-full flex items-center justify-center p-6 bg-transparent">
      <div className="max-w-4xl w-full py-8">
        {/* Two-Column Side-by-Side Wrapper */}
        <div className="flex flex-col md:flex-row gap-8 items-stretch md:h-[450px]">
        {/* Left Side: Cover Image */}
        <div className="flex-shrink-0 w-full md:w-72 h-[400px] md:h-full flex flex-col rounded-2xl overflow-hidden shadow-sm border border-[#EAD8D8] bg-zinc-50">
          {coverUrl ? (
            <img
              src={coverUrl}
              alt={`${book.title} cover`}
              className="w-full h-full object-cover"
            />
          ) : (
            <div className="w-full h-full flex flex-col items-center justify-center bg-zinc-50 text-zinc-400 p-4 text-center">
              <BookOpen
                size={32}
                className="mb-2 text-zinc-300"
              />
              <span className="text-[10px] font-semibold text-zinc-400 tracking-wider">
                NO COVER
              </span>
            </div>
          )}
        </div>

        {/* Right Side: The Main Details Box */}
        <div className="flex-grow w-full border border-[#EAD8D8] bg-[#FAF2F2] p-8 shadow-sm rounded-2xl flex flex-col justify-between h-full hover:shadow-md transition-shadow duration-300">
          <div>
            <div className="flex justify-between items-start gap-4 mb-3">
              <h1 className="text-3xl font-bold font-serif text-zinc-900 mt-0 leading-tight">
                {book.title}
              </h1>

              {(book.category || book.ebook?.category) && (
                <span className="flex-shrink-0 inline-block text-xs font-semibold text-[#851C1C] mt-2 tracking-wider uppercase">
                  {book.category || book.ebook?.category}
                </span>
              )}
            </div>

            <p className="text-lg text-zinc-500 mt-0 mb-6">
              by {book.author}
            </p>

            <hr className="border-t border-[#EAD8D8] my-6" />

            <h3 className="text-xs font-bold uppercase tracking-wider text-zinc-500 mb-3 block">
              Summary
            </h3>
            <div 
              className={`text-sm leading-relaxed text-zinc-600 text-justify pr-2 ${
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
              className="h-10 px-6 flex items-center justify-center gap-2 bg-[#851C1C] hover:bg-[#6b1616] text-white font-medium text-sm rounded-lg transition-all duration-200 cursor-pointer shadow-sm focus:outline-none border-none animate-scale-up"
            >
              <BookOpen size={16} />
              <span>Open Reader</span>
            </button>
          </div>
        </div>
      </div>
     </div>
    </div>
  );
}
