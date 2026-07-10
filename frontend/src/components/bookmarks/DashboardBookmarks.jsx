import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Bookmark, Trash2, ArrowRight, AlertCircle } from "lucide-react";
import BookmarksSkeleton from "./BookmarksSkeleton";

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
    return <BookmarksSkeleton />;
  }

  if (error) {
    return (
      <div className="p-4 border border-red-200 bg-red-50 dark:bg-red-955/10 dark:border-red-900 text-red-600 dark:text-red-400 flex items-center gap-2 rounded text-base mb-6">
        <AlertCircle size={18} className="flex-shrink-0" />
        <span>{error}</span>
      </div>
    );
  }

  if (bookmarks.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center p-16 border-2 border-dashed border-zinc-300 dark:border-zinc-800 bg-white dark:bg-zinc-900 rounded-none text-center">
        <Bookmark className="text-zinc-300 dark:text-zinc-700 mb-3" size={36} />
        <p className="text-base font-semibold text-zinc-500 dark:text-zinc-400">No bookmarks saved yet</p>
        <p className="text-base text-zinc-400 dark:text-zinc-500 mt-1 max-w-sm">
          Bookmark pages while reading in any ebook, and they'll show up here so you can jump right back in.
        </p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 gap-6 animate-fade-in w-full">
      {bookmarks.map((b) => (
        <div
          key={b.id}
          onClick={() => handleRead(b)}
          className="group flex items-center justify-between p-4 border-2 border-zinc-300 dark:border-zinc-700 bg-white dark:bg-zinc-900 cursor-pointer transition-all duration-300 ease-out rounded-none hover:-translate-y-1 hover:-translate-x-1 shadow-none hover:shadow-[4px_4px_0px_#000] dark:hover:shadow-[4px_4px_0px_#fff] w-full"
        >
          <div className="flex-1 min-w-0 pr-6">
            <div className="font-bold text-base text-zinc-955 dark:text-white truncate">
              {b.label}
            </div>
            <div className="text-base text-zinc-500 dark:text-zinc-400 mt-1.5 flex items-center gap-1.5 flex-wrap">
              <span className="font-semibold text-zinc-900 dark:text-zinc-200">{b.book_title}</span>
              <span>· by {b.book_author}</span>
              {b.room_name && (
                <>
                  <span>·</span>
                  <span className="text-sm font-bold text-zinc-500 dark:text-zinc-400">Room: {b.room_name}</span>
                </>
              )}
              <span>· Saved {formatDate(b.created_at)}</span>
            </div>
          </div>
          
          <div className="flex items-center gap-4 flex-shrink-0">
            <button
              onClick={(e) => handleDelete(b.id, e)}
              className="p-2 hover:bg-zinc-100 dark:hover:bg-zinc-800 text-zinc-400 hover:text-red-500 dark:hover:text-red-400 rounded-lg transition-colors cursor-pointer flex items-center justify-center border border-transparent"
              title="Delete Bookmark"
            >
              <Trash2 size={16} />
            </button>
            <ArrowRight size={16} className="text-zinc-400 group-hover:text-zinc-955 dark:group-hover:text-white group-hover:translate-x-1 transition-all" />
          </div>
        </div>
      ))}
    </div>
  );
}
