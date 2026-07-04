// Page component for reading an ebook via a dedicated route.
import React, { useEffect, useState } from "react";
import { useParams, useNavigate, useLocation } from "react-router-dom";
import { EbookReader } from "./EbookReader";
import ReaderContentSkeleton from "../components/ReaderContentSkeleton";

export  default function BookReader({ client }) {
  const { id } = useParams();
  const navigate = useNavigate();
  const location = useLocation();

  const [book, setBook] = useState(null);
  const [loading, setLoading] = useState(true);
  const [msg, setMsg] = useState("");

  useEffect(() => {
    let active = true;
    async function loadBookAndRecentBookmark() {
      try {
        setLoading(true);
        // Step 1: Retrieve book data (from nav state or fetch it)
        let bookData = location.state?.book;
        if (!bookData) {
          bookData = await client.request(`/books/${id}`);
        }

        // Step 2: Retrieve recent bookmark if not explicitly navigated to a specific page
        let initialPage = location.state?.initialPageIndex;
        if (initialPage === undefined) {
          const bookmarks = await client.request(`/books/${id}/bookmarks`);
          if (bookmarks && bookmarks.length > 0) {
            // Bookmarks are sorted by created_at DESC in the API response
            const latestBookmark = bookmarks[0];
            const match = latestBookmark.location.match(/Page\s+(\d+)/i);
            if (match) {
              initialPage = parseInt(match[1], 10) - 1;
            }
          }
        }

        if (active) {
          setBook({
            ...bookData,
            _initialPageIndex: initialPage !== undefined ? initialPage : 0,
            _joinRoomId: location.state?.joinRoomId || bookData?._joinRoomId || null,
          });
        }
      } catch (e) {
        if (active) setMsg(e.message);
      } finally {
        if (active) setLoading(false);
      }
    }

    loadBookAndRecentBookmark();
    return () => {
      active = false;
    };
  }, [id, client, location.state]);

  if (loading) {
    return (
      <div className="flex h-screen w-full items-center justify-center bg-transparent">
        <ReaderContentSkeleton />
      </div>
    );
  }

  if (msg) {
    return <p className="notice">{msg}</p>;
  }

  return (
    <EbookReader book={book} client={client} onBack={() => navigate("/")} />
  );
}
