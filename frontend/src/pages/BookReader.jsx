// Page component for reading an ebook via a dedicated route.
import React, { useEffect, useState } from "react";
import { useParams, useNavigate, useLocation } from "react-router-dom";
import { EbookReader } from "./EbookReader";
import ReaderContentSkeleton from "../components/ReaderContentSkeleton";

export  default function BookReader({ client }) {
  const { id } = useParams();
  const navigate = useNavigate();
  const location = useLocation();

  // Load book data – use navigation state if provided to avoid extra fetch.
  const [book, setBook] = useState(location.state?.book || null);
  const [loading, setLoading] = useState(!book);
  const [msg, setMsg] = useState("");

  useEffect(() => {
    if (!book) {
      async function fetchBook() {
        try {
          const fetched = await client.request(`/books/${id}`);
          if (location.state?.initialPageIndex !== undefined) {
            fetched._initialPageIndex = location.state.initialPageIndex;
          }
          if (location.state?.joinRoomId) {
            fetched._joinRoomId = location.state.joinRoomId;
          }
          setBook(fetched);
        } catch (e) {
          setMsg(e.message);
        } finally {
          setLoading(false);
        }
      }
      fetchBook();
    } else {
      // If navigation passed a joinRoomId or initialPageIndex, attach it to the book object.
      setBook((prev) => {
        let updated = prev;
        if (location.state?.joinRoomId && prev?._joinRoomId !== location.state.joinRoomId) {
          updated = { ...updated, _joinRoomId: location.state.joinRoomId };
        }
        if (location.state?.initialPageIndex !== undefined && prev?._initialPageIndex !== location.state.initialPageIndex) {
          updated = { ...updated, _initialPageIndex: location.state.initialPageIndex };
        }
        return updated;
      });
    }
  }, [id, book, client, location.state]);

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
