import React, { useMemo, useState } from "react";
import { X, BookOpen, ChevronRight, Plus } from "lucide-react";
import { useReaderTheme } from "../context/ReaderThemeContext";
import BookmarksManager from "./bookmarks/BookmarksManager";

export default function ChapterSidebar({
  open,
  chapters,
  pageIndex,
  onClose,
  onSelectChapter,
  bookId,
  activeRoom,
  totalPages,
  client,
}) {
  const [activeTab, setActiveTab] = useState("contents");
  const { warmth } = useReaderTheme();

  return (
    <>
      {/* Overlay */}
      <div
        onClick={onClose}
        className={`fixed inset-0 bg-zinc-950/20 dark:bg-zinc-950/50 transition-opacity duration-300 z-40 ${
          open ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none"
        }`}
      />

      {/* Sidebar */}
      <aside
        className={`fixed top-0 right-0 w-80 h-full bg-white dark:bg-zinc-900 border-l border-zinc-200 dark:border-zinc-800 flex flex-col z-50 shadow-2xl transition-transform duration-300 ease-out will-change-transform overflow-hidden ${
          open ? "translate-x-0" : "translate-x-full"
        }`}
      >
        {/* Warmth overlay shade */}
        <div
          className="warmth-overlay absolute inset-0 pointer-events-none z-50 transition-opacity duration-200"
          style={{ opacity: warmth / 100 }}
        />
        {/* Header */}
        <div className="flex border-b border-zinc-200 dark:border-zinc-800 items-center justify-between">
          <button
            onClick={() => setActiveTab("contents")}
            className={`flex-1 py-4 text-center text-xs font-bold uppercase tracking-wider transition-colors duration-150 border-none cursor-pointer focus:outline-none ${
              activeTab === "contents"
                ? "bg-zinc-50 dark:bg-zinc-900/50 text-zinc-955 dark:text-white border-b border-zinc-200 dark:border-zinc-800 font-bold"
                : "bg-transparent text-zinc-500 dark:text-zinc-450 hover:text-zinc-950 dark:hover:text-white"
            }`}
          >
            Contents
          </button>

          <button
            onClick={() => setActiveTab("bookmarks")}
            className={`flex-1 py-4 text-center text-xs font-bold uppercase tracking-wider transition-colors duration-150 border-none cursor-pointer focus:outline-none ${
              activeTab === "bookmarks"
                ? "bg-zinc-50 dark:bg-zinc-900/50 text-zinc-955 dark:text-white border-b border-zinc-200 dark:border-zinc-800 font-bold"
                : "bg-transparent text-zinc-500 dark:text-zinc-450 hover:text-zinc-950 dark:hover:text-white"
            }`}
          >
            Bookmarks
          </button>

          <button
            onClick={onClose}
            className="p-4 border-l border-zinc-200 dark:border-zinc-800 bg-transparent cursor-pointer text-zinc-500 hover:text-zinc-950 dark:hover:text-white focus:outline-none flex items-center justify-center h-full"
            aria-label="Close panel"
          >
            <X size={18} />
          </button>
        </div>

        {/* Chapter List */}
        <div className="flex-1 overflow-y-auto">
          {activeTab === "contents" ? (
            <>
              {chapters.length === 0 ? (
                <div className="p-8 text-center text-sm text-zinc-500 dark:text-zinc-400">
                  No chapters found
                </div>
              ) : (
                chapters.map((chapter, index) => {
                  const active = chapter.pageIndex === pageIndex;

                  return (
                    <button
                      key={index}
                      onClick={() => {
                        onSelectChapter(chapter.pageIndex);
                        onClose();
                      }}
                      className={`w-full text-left px-5 py-4 border-b border-zinc-200 dark:border-zinc-800 flex justify-between items-center bg-transparent cursor-pointer transition-colors duration-150 rounded-none font-serif ${
                        active
                          ? "bg-zinc-100 text-zinc-950 dark:bg-zinc-900 dark:text-white font-bold"
                          : "hover:bg-zinc-50 dark:hover:bg-zinc-900/40 text-zinc-950 dark:text-zinc-300"
                      }`}
                    >
                      <div className="text-left">
                        <div className={`text-sm font-bold uppercase tracking-wider ${active ? "text-zinc-955 dark:text-white" : ""}`}>
                          {chapter.title}
                        </div>
                        <div className={`text-xs mt-1 font-sans ${active ? "text-zinc-600 dark:text-zinc-400" : "text-zinc-450 dark:text-zinc-500"}`}>
                          Page {chapter.pageIndex + 1}
                        </div>
                      </div>
                      <ChevronRight size={16} className={active ? "text-zinc-955 dark:text-white" : "text-zinc-400 dark:text-zinc-600"} />
                    </button>
                  );
                })
              )}
            </>
          ) : (
            <BookmarksManager
              bookId={bookId}
              activeRoom={activeRoom}
              pageIndex={pageIndex}
              totalPages={totalPages}
              client={client}
              onGoToPage={(page) => {
                onSelectChapter(page);
                onClose();
              }}
            />
          )}
        </div>

        {/* Footer */}
        {activeTab === "contents" && (
          <div className="border-t border-zinc-200 dark:border-zinc-800 p-4 text-xs font-bold uppercase tracking-wider text-zinc-950 dark:text-zinc-100 bg-zinc-50 dark:bg-zinc-900/40">
            {chapters.length} Chapters
          </div>
        )}
      </aside>
    </>
  );
}
