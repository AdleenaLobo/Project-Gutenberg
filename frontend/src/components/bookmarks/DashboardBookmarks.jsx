import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Bookmark, Trash2, BookOpen, AlertCircle, Loader2 } from "lucide-react";

export default function DashboardBookmarks({ client, onBookmarkDeleted }) {
  const navigate = useNavigate();
  const [bookmarks, setBookmarks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const fetchBookmarks = async () => {
    setLoading(true);
    setError("");
    try {
      const data = await client.request("/bookmarks");
      setBookmarks(data || []);
    } catch (err) {
      setError(err.message || "Failed to load bookmarks");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBookmarks();
  }, [client]);

  const handleDelete = async (id, e) => {
    e.stopPropagation();
    setError("");
    try {
      await client.request(`/bookmarks/${id}`, {
        method: "DELETE",
      });
      setBookmarks((prev) => prev.filter((b) => b.id !== id));
      if (onBookmarkDeleted) {
        onBookmarkDeleted();
      }
    } catch (err) {
      setError(err.message || "Failed to delete bookmark");
    }
  };

  const handleRead = (bookmark) => {
    // Parse page index from "Page X" -> X-1
    const match = bookmark.location.match(/Page\s+(\d+)/i);
    const initialPageIndex = match ? parseInt(match[1], 10) - 1 : 0;
    
    navigate(`/books/${bookmark.book_id}/read`, {
      state: { 
        initialPageIndex,
        joinRoomId: bookmark.room_id || null 
      }
    });
  };

  // Helper to format date
  const formatDate = (isoString) => {
    if (!isoString) return "";
    try {
      const d = new Date(isoString);
      return d.toLocaleDateString(undefined, {
        month: "short",
        day: "numeric",
        year: "numeric",
      });
    } catch (_) {
      return "";
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center p-16 text-zinc-500">
        <Loader2 className="animate-spin mr-3 text-zinc-600 dark:text-zinc-400" size={24} />
        <span className="text-sm font-semibold">Loading your bookmarks...</span>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-4 border border-red-200 bg-red-50 dark:bg-red-950/10 dark:border-red-900 text-red-600 dark:text-red-400 flex items-center gap-2 rounded text-sm mb-6">
        <AlertCircle size={18} className="flex-shrink-0" />
        <span>{error}</span>
      </div>
    );
  }

  if (bookmarks.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center p-16 border-2 border-dashed border-zinc-300 dark:border-zinc-800 bg-white dark:bg-zinc-900 rounded-none text-center">
        <Bookmark className="text-zinc-300 dark:text-zinc-700 mb-3" size={36} />
        <p className="text-sm font-semibold text-zinc-500 dark:text-zinc-400">No bookmarks saved yet</p>
        <p className="text-xs text-zinc-400 dark:text-zinc-500 mt-1 max-w-sm">
          Bookmark pages while reading in any ebook, and they'll show up here so you can jump right back in.
        </p>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-4">
      <p className="text-xs font-bold text-zinc-500 dark:text-zinc-400 uppercase tracking-wider block">
        {bookmarks.length} saved {bookmarks.length === 1 ? "bookmark" : "bookmarks"}
      </p>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 animate-fade-in">
        {bookmarks.map((b) => (
          <div
            key={b.id}
            onClick={() => handleRead(b)}
            className="group relative border-2 border-zinc-300 dark:border-zinc-700 p-6 bg-white dark:bg-zinc-900 cursor-pointer transition-all duration-350 ease-out rounded-none hover:-translate-y-1 hover:-translate-x-1 shadow-none hover:shadow-[4px_4px_0px_#000] dark:hover:shadow-[4px_4px_0px_#fff]"
          >
            <div className="flex justify-between items-start mb-3">
              <span className="text-[10px] font-semibold text-zinc-500 dark:text-zinc-450 uppercase tracking-widest block pr-6 truncate">
                {b.location} {b.room_name && `· Room: ${b.room_name}`}
              </span>
              
              <button
                onClick={(e) => handleDelete(b.id, e)}
                className="p-1 hover:bg-zinc-100 dark:hover:bg-zinc-800 text-zinc-400 hover:text-red-500 rounded transition-colors cursor-pointer"
                title="Delete Bookmark"
              >
                <Trash2 size={15} />
              </button>
            </div>

            <div className="flex flex-col">
              <span className="text-sm font-bold text-zinc-400 dark:text-zinc-500 mb-0.5">
                {b.book_title}
              </span>
              <span className="text-xs text-zinc-500 dark:text-zinc-450 mb-4">
                by {b.book_author}
              </span>
              
              <div className="p-3 bg-zinc-50 dark:bg-zinc-800/40 border border-zinc-150 dark:border-zinc-800 rounded-lg mb-5 flex items-start gap-2.5">
                <Bookmark size={15} className="text-zinc-400 mt-0.5 flex-shrink-0" />
                <span className="text-sm font-semibold text-zinc-800 dark:text-zinc-200 line-clamp-2">
                  {b.label}
                </span>
              </div>
            </div>

            <div className="flex items-center justify-between mt-auto pt-4 border-t-2 border-zinc-200 dark:border-zinc-800">
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  handleRead(b);
                }}
                className="px-4 py-2 bg-zinc-950 border border-zinc-950 dark:bg-zinc-50 dark:border-zinc-50 text-white dark:text-zinc-950 font-semibold text-xs uppercase tracking-wider hover:bg-zinc-800 dark:hover:bg-zinc-200 transition-all duration-200 rounded-lg cursor-pointer flex items-center gap-1.5"
              >
                <BookOpen size={13} /> Continue
              </button>
              
              <span className="text-[10px] text-zinc-450 dark:text-zinc-500">
                Saved {formatDate(b.created_at)}
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
