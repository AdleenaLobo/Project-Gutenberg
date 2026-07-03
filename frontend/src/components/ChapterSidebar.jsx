import React, { useMemo, useState } from "react";
import { X, BookOpen, ChevronRight, Plus } from "lucide-react";

export default function ChapterSidebar({
  open,
  chapters,
  bookmarks = [],
  pageIndex,
  onClose,
  onSelectChapter
}) {
  const [activeTab, setActiveTab] = useState("contents");

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
        className={`fixed top-0 left-0 w-80 h-full bg-white dark:bg-zinc-900 border-r-2 border-zinc-300 dark:border-zinc-700 flex flex-col z-50 shadow-[6px_0px_0px_#000] dark:shadow-[6px_0px_0px_#fff] transition-transform duration-300 ease-out will-change-transform ${
          open ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        {/* Header */}
        <div className="flex border-b-2 border-zinc-300 dark:border-zinc-700 items-center justify-between">
          <button
            onClick={() => setActiveTab("contents")}
            className={`flex-1 py-4 text-center text-xs font-bold uppercase tracking-wider transition-colors duration-150 border-none cursor-pointer focus:outline-none ${
              activeTab === "contents"
                ? "bg-zinc-50 dark:bg-zinc-850 text-zinc-950 dark:text-white border-b-2 border-zinc-300 dark:border-zinc-700 font-bold"
                : "bg-transparent text-zinc-500 dark:text-zinc-450 hover:text-zinc-950 dark:hover:text-white"
            }`}
          >
            Contents
          </button>

          <button
            onClick={() => setActiveTab("bookmarks")}
            className={`flex-1 py-4 text-center text-xs font-bold uppercase tracking-wider transition-colors duration-150 border-none cursor-pointer focus:outline-none ${
              activeTab === "bookmarks"
                ? "bg-zinc-50 dark:bg-zinc-850 text-zinc-950 dark:text-white border-b-2 border-zinc-300 dark:border-zinc-700 font-bold"
                : "bg-transparent text-zinc-500 dark:text-zinc-450 hover:text-zinc-950 dark:hover:text-white"
            }`}
          >
            Bookmarks
          </button>

          <button
            onClick={onClose}
            className="p-4 border-l-2 border-zinc-300 dark:border-zinc-700 bg-transparent cursor-pointer text-zinc-500 hover:text-zinc-950 dark:hover:text-white focus:outline-none flex items-center justify-center h-full"
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
                      className={`w-full text-left px-5 py-4 border-b-2 border-zinc-300 dark:border-zinc-700 flex justify-between items-center bg-transparent cursor-pointer transition-colors duration-150 rounded-none ${
                        active
                          ? "bg-zinc-950 text-white dark:bg-zinc-50 dark:text-zinc-950 font-bold"
                          : "hover:bg-zinc-100 dark:hover:bg-zinc-800 text-zinc-950 dark:text-zinc-300"
                      }`}
                    >
                      <div className="text-left">
                        <div className={`text-sm font-bold uppercase ${active ? "text-white dark:text-zinc-955" : ""}`}>
                          {chapter.title}
                        </div>
                        <div className={`text-xs mt-1 ${active ? "text-zinc-300 dark:text-zinc-600" : "text-zinc-450 dark:text-zinc-500"}`}>
                          Page {chapter.pageIndex + 1}
                        </div>
                      </div>
                      <ChevronRight size={16} className={active ? "text-white dark:text-zinc-955" : "text-zinc-400 dark:text-zinc-600"} />
                    </button>
                  );
                })
              )}
            </>
          ) : (
            <>
              {bookmarks.length === 0 ? (
                <div className="p-10 text-center text-zinc-500 dark:text-zinc-450 flex flex-col gap-2">
                  <div className="text-sm font-bold text-zinc-900 dark:text-zinc-250 mt-3">
                    No bookmarks yet
                  </div>
                  <div className="text-xs text-zinc-500 mt-1">
                    Bookmark pages while reading to find them quickly.
                  </div>
                </div>
              ) : (
                bookmarks.map((bookmark) => (
                  <button
                    key={bookmark.id}
                    onClick={() => {
                      onSelectChapter(bookmark.pageIndex);
                      onClose();
                    }}
                    className="w-full text-left px-5 py-4 border-b-2 border-zinc-300 dark:border-zinc-700 flex justify-between items-center bg-transparent hover:bg-zinc-100 dark:hover:bg-zinc-800 cursor-pointer transition-colors text-zinc-955 dark:text-zinc-350 rounded-none"
                  >
                    <div className="text-left">
                      <div className="text-sm font-bold">
                        {bookmark.label || "Bookmark"}
                      </div>
                      <div className="text-xs text-zinc-450 dark:text-zinc-500 mt-1">
                        Page {bookmark.pageIndex + 1}
                      </div>
                    </div>
                    <ChevronRight size={16} className="text-zinc-400 dark:text-zinc-650" />
                  </button>
                ))
              )}
            </>
          )}
        </div>

        {/* Footer */}
        <div className="border-t-2 border-zinc-300 dark:border-zinc-700 p-4 text-xs font-bold uppercase tracking-wider text-zinc-950 dark:text-zinc-100 bg-zinc-50 dark:bg-zinc-850/40">
          {activeTab === "contents"
            ? `${chapters.length} Chapters`
            : `${bookmarks.length} Bookmarks`}
        </div>
      </aside>
    </>
  );
}
