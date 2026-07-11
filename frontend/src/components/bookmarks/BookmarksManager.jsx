import React, { useState, useEffect } from "react";
import { Bookmark, Trash2, Edit3, Check, X, ChevronRight, AlertCircle, Loader2 } from "lucide-react";

export default function BookmarksManager({
  bookId,
  activeRoom,
  pageIndex,
  totalPages,
  client,
  onGoToPage,
  bookmarks: propsBookmarks,
  onBookmarksChanged,
}) {
  const [internalBookmarks, setInternalBookmarks] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [editingId, setEditingId] = useState(null);
  const [editLabel, setEditLabel] = useState("");

  const bookmarks = propsBookmarks || internalBookmarks;
  const currentPageLabel = `Page ${pageIndex + 1}`;

  // Fetch bookmarks for this book
  const fetchBookmarks = async () => {
    if (propsBookmarks && onBookmarksChanged) {
      onBookmarksChanged();
      return;
    }
    setLoading(true);
    setError("");
    try {
      const data = await client.request(`/books/${bookId}/bookmarks`);
      setInternalBookmarks(data || []);
    } catch (err) {
      setError(err.message || "Failed to load bookmarks");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (!propsBookmarks) {
      fetchBookmarks();
    }
  }, [bookId, propsBookmarks]);

  // (handleAddBookmark and currentPageBookmark checks deleted – bookmark creation is handled on-page)

  // Delete bookmark
  const handleDeleteBookmark = async (id) => {
    setError("");
    try {
      await client.request(`/bookmarks/${id}`, {
        method: "DELETE",
      });
      fetchBookmarks();
    } catch (err) {
      setError(err.message || "Failed to delete bookmark");
    }
  };

  // Start editing bookmark label
  const startEdit = (bookmark) => {
    setEditingId(bookmark.id);
    setEditLabel(bookmark.label);
  };

  // Save edited label
  const handleSaveEdit = async (id) => {
    if (!editLabel.trim()) return;
    setError("");
    try {
      await client.request(`/bookmarks/${id}`, {
        method: "PUT",
        body: JSON.stringify({ label: editLabel.trim() }),
      });
      setEditingId(null);
      fetchBookmarks();
    } catch (err) {
      setError(err.message || "Failed to update bookmark");
    }
  };

  // Parse page number from location string (e.g. "Page 3" -> 2)
  const parsePageNumber = (locationStr) => {
    const match = locationStr.match(/Page\s+(\d+)/i);
    return match ? parseInt(match[1], 10) - 1 : 0;
  };

  return (
    <div className="flex flex-col h-full bg-transparent text-zinc-900 dark:text-zinc-100 text-sm">
      {error && (
        <div className="p-3 bg-red-55/10 text-red-600 dark:text-red-400 text-xs border-b border-red-200 dark:border-red-900 flex items-center gap-1.5">
          <AlertCircle size={14} className="flex-shrink-0" />
          <span>{error}</span>
        </div>
      )}

      {/* Bookmarks List */}
      <div className="flex-1 overflow-y-auto">
        {loading && bookmarks.length === 0 ? (
          <div className="flex items-center justify-center p-12 text-zinc-500">
            <Loader2 className="animate-spin mr-2" size={16} />
            <span>Loading bookmarks...</span>
          </div>
        ) : bookmarks.length === 0 ? (
          <div className="p-10 text-center text-zinc-500 dark:text-zinc-500 flex flex-col gap-2">
            <Bookmark className="mx-auto text-zinc-300 dark:text-zinc-700" size={32} />
            <div className="text-xs font-bold text-zinc-800 dark:text-zinc-350 mt-2">
              No bookmarks for this book
            </div>
            <div className="text-[11px] text-zinc-500 dark:text-zinc-500">
              Bookmark pages while reading to find them quickly.
            </div>
          </div>
        ) : (
          <div className="flex flex-col gap-3">
            {bookmarks.map((bookmark) => {
              const isCurrent = bookmark.location === currentPageLabel;
              const isEditing = editingId === bookmark.id;

              return (
                <div
                  key={bookmark.id}
                  className={`p-3 border rounded-xl bg-white dark:bg-zinc-850 flex flex-col gap-2 hover:bg-zinc-50 dark:hover:bg-zinc-800/40 transition-colors duration-150 ${
                    isCurrent 
                      ? "border-zinc-900 dark:border-white ring-1 ring-zinc-900/10 dark:ring-white/10" 
                      : "border-zinc-200 dark:border-zinc-800"
                  }`}
                >
                  <div className="flex items-center justify-between gap-2.5">
                    <div className="flex items-center gap-1.5">
                      <span className="text-[11px] font-normal font-sans lining-nums uppercase tracking-wider text-zinc-450 dark:text-zinc-500">
                        {bookmark.location} {bookmark.room_name && `· Room: ${bookmark.room_name}`}
                      </span>
                    </div>

                    {!isEditing && (
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => startEdit(bookmark)}
                          className="text-[10px] text-zinc-500 hover:text-zinc-900 dark:text-zinc-400 dark:hover:text-white font-bold border-none bg-transparent cursor-pointer hover:underline focus:outline-none"
                        >
                          Edit
                        </button>
                        <span className="text-zinc-300 dark:text-zinc-700 text-[10px]">•</span>
                        <button
                          onClick={() => handleDeleteBookmark(bookmark.id)}
                          className="text-[10px] text-red-500 hover:text-red-400 font-bold border-none bg-transparent cursor-pointer hover:underline focus:outline-none"
                        >
                          Delete
                        </button>
                      </div>
                    )}
                  </div>

                  {isEditing ? (
                    <div className="flex gap-1.5 items-center mt-1">
                      <input
                        type="text"
                        value={editLabel}
                        onChange={(e) => setEditLabel(e.target.value)}
                        className="flex-1 px-2.5 py-1 text-xs rounded-lg border border-zinc-300 dark:border-zinc-700 bg-white dark:bg-zinc-800 text-zinc-955 dark:text-white outline-none focus:border-zinc-500 dark:focus:border-zinc-500"
                        autoFocus
                        onKeyDown={(e) => {
                          if (e.key === "Enter") handleSaveEdit(bookmark.id);
                          else if (e.key === "Escape") setEditingId(null);
                        }}
                      />
                      <button
                        onClick={() => handleSaveEdit(bookmark.id)}
                        className="p-1 hover:bg-zinc-150 dark:hover:bg-zinc-700 rounded text-green-600 cursor-pointer"
                      >
                        <Check size={14} />
                      </button>
                      <button
                        onClick={() => setEditingId(null)}
                        className="p-1 hover:bg-zinc-150 dark:hover:bg-zinc-700 rounded text-zinc-500 cursor-pointer"
                      >
                        <X size={14} />
                      </button>
                    </div>
                  ) : (
                    <button
                      onClick={() => onGoToPage(parsePageNumber(bookmark.location))}
                      className="text-left font-serif text-xs italic text-zinc-800 dark:text-zinc-200 border-none bg-transparent cursor-pointer p-0 hover:text-zinc-955 dark:hover:text-white focus:outline-none leading-relaxed"
                      title="Go to bookmark location"
                    >
                      {bookmark.label}
                    </button>
                  )}
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
