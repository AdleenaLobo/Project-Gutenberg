import React, { useState, useEffect } from "react";
import { Bookmark, Trash2, Edit3, Check, X, ChevronRight, AlertCircle, Loader2 } from "lucide-react";

export default function BookmarksManager({
  bookId,
  activeRoom,
  pageIndex,
  totalPages,
  client,
  onGoToPage,
}) {
  const [bookmarks, setBookmarks] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [editingId, setEditingId] = useState(null);
  const [editLabel, setEditLabel] = useState("");

  const currentPageLabel = `Page ${pageIndex + 1}`;

  // Fetch bookmarks for this book
  const fetchBookmarks = async () => {
    setLoading(true);
    setError("");
    try {
      const data = await client.request(`/books/${bookId}/bookmarks`);
      setBookmarks(data || []);
    } catch (err) {
      setError(err.message || "Failed to load bookmarks");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBookmarks();
  }, [bookId]);

  // Check if current page is already bookmarked
  const currentPageBookmark = bookmarks.find(
    (b) => b.location === currentPageLabel && (!activeRoom || b.room_id === activeRoom)
  );

  // Add bookmark
  const handleAddBookmark = async () => {
    setError("");
    try {
      await client.request("/bookmarks", {
        method: "POST",
        body: JSON.stringify({
          book_id: bookId,
          room_id: activeRoom || null,
          location: currentPageLabel,
          label: currentPageLabel,
        }),
      });
      fetchBookmarks();
    } catch (err) {
      setError(err.message || "Failed to add bookmark");
    }
  };

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
    <div className="flex flex-col h-full bg-white dark:bg-zinc-900 text-zinc-900 dark:text-zinc-100 text-sm">
      {/* Add Bookmark form */}
      <div className="p-4 border-b border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-900/40">
        <h3 className="text-xs font-bold uppercase tracking-wider text-zinc-400 dark:text-zinc-505 mb-3">
          Bookmark Current Page
        </h3>

        {currentPageBookmark ? (
          <div className="p-3 bg-zinc-100 dark:bg-zinc-800 rounded-lg border border-zinc-200 dark:border-zinc-700 flex items-center justify-between">
            <div className="min-w-0 pr-2">
              <p className="text-[10px] text-zinc-500 uppercase tracking-wider">Bookmarked</p>
              <p className="font-bold text-zinc-800 dark:text-zinc-200 mt-0.5 truncate">{currentPageBookmark.label}</p>
            </div>
            <button
              onClick={() => handleDeleteBookmark(currentPageBookmark.id)}
              className="p-1.5 hover:bg-zinc-250 dark:hover:bg-zinc-700 rounded text-red-500 transition-colors cursor-pointer flex-shrink-0"
              title="Remove Bookmark"
            >
              <Trash2 size={16} />
            </button>
          </div>
        ) : (
          <button
            onClick={handleAddBookmark}
            className="w-full py-2 bg-zinc-900 hover:bg-zinc-800 dark:bg-zinc-100 dark:hover:bg-zinc-200 text-white dark:text-zinc-900 font-semibold rounded-lg text-xs transition-colors flex items-center justify-center gap-1.5 cursor-pointer"
          >
            <Bookmark size={13} /> Add to {currentPageLabel}
          </button>
        )}

        {error && (
          <div className="mt-2.5 flex items-start gap-1.5 text-xs text-red-600 dark:text-red-400">
            <AlertCircle size={14} className="mt-0.5 flex-shrink-0" />
            <span>{error}</span>
          </div>
        )}
      </div>

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
          <div className="divide-y divide-zinc-200 dark:divide-zinc-800">
            {bookmarks.map((bookmark) => {
              const isCurrent = bookmark.location === currentPageLabel;
              const isEditing = editingId === bookmark.id;

              return (
                <div
                  key={bookmark.id}
                  className={`group relative p-4 flex flex-col gap-2 transition-all ${
                    isCurrent 
                      ? "bg-zinc-100/50 dark:bg-zinc-800/25 border-l-2 border-zinc-900 dark:border-zinc-100" 
                      : "hover:bg-zinc-50 dark:hover:bg-zinc-900/30"
                  }`}
                >
                  <div className="flex items-start justify-between gap-2">
                    <div className="flex-1 min-w-0">
                      {isEditing ? (
                        <div className="flex gap-1 items-center mt-1">
                          <input
                            type="text"
                            value={editLabel}
                            onChange={(e) => setEditLabel(e.target.value)}
                            className="flex-1 px-2 py-1 text-xs rounded border border-zinc-300 dark:border-zinc-700 bg-white dark:bg-zinc-800 outline-none"
                            autoFocus
                            onKeyDown={(e) => {
                              if (e.key === "Enter") handleSaveEdit(bookmark.id);
                              else if (e.key === "Escape") setEditingId(null);
                            }}
                          />
                          <button
                            onClick={() => handleSaveEdit(bookmark.id)}
                            className="p-1 hover:bg-zinc-200 dark:hover:bg-zinc-700 rounded text-green-600 cursor-pointer"
                          >
                            <Check size={14} />
                          </button>
                          <button
                            onClick={() => setEditingId(null)}
                            className="p-1 hover:bg-zinc-200 dark:hover:bg-zinc-700 rounded text-zinc-500 cursor-pointer"
                          >
                            <X size={14} />
                          </button>
                        </div>
                      ) : (
                        <div className="flex flex-col">
                          <span className="font-bold text-zinc-900 dark:text-zinc-100 break-words pr-8">
                            {bookmark.label}
                          </span>
                          <span className="text-[11px] text-zinc-500 dark:text-zinc-500 mt-0.5">
                            {bookmark.location} {bookmark.room_name && `· Room: ${bookmark.room_name}`}
                          </span>
                        </div>
                      )}
                    </div>

                    {/* Go to bookmark button */}
                    {!isEditing && (
                      <button
                        onClick={() => onGoToPage(parsePageNumber(bookmark.location))}
                        className="flex-shrink-0 p-1 bg-zinc-100 dark:bg-zinc-800 hover:bg-zinc-205 dark:hover:bg-zinc-700 rounded text-zinc-700 dark:text-zinc-300 transition-colors flex items-center gap-0.5 text-xs font-semibold cursor-pointer"
                        title="Jump to page"
                      >
                        <ChevronRight size={14} />
                      </button>
                    )}
                  </div>

                  {/* Actions overlay shown on hover */}
                  {!isEditing && (
                    <div className="flex gap-2.5 self-start mt-1 opacity-0 group-hover:opacity-100 focus-within:opacity-100 transition-opacity">
                      <button
                        onClick={() => startEdit(bookmark)}
                        className="text-[11px] font-bold text-zinc-500 hover:text-zinc-900 dark:hover:text-zinc-300 flex items-center gap-1 cursor-pointer"
                      >
                        <Edit3 size={11} /> Edit
                      </button>
                      <button
                        onClick={() => handleDeleteBookmark(bookmark.id)}
                        className="text-[11px] font-bold text-red-500 hover:text-red-755 flex items-center gap-1 cursor-pointer"
                      >
                        <Trash2 size={11} /> Delete
                      </button>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Footer */}
      <div className="border-t border-zinc-200 dark:border-zinc-800 p-3 text-[11px] font-bold uppercase tracking-wider text-zinc-400 dark:text-zinc-500 bg-zinc-50 dark:bg-zinc-900/40 text-center">
        {bookmarks.length} {bookmarks.length === 1 ? "Bookmark" : "Bookmarks"} saved
      </div>
    </div>
  );
}
