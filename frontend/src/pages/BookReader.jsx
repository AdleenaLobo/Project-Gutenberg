// Page component for reading an ebook via a dedicated route.
import React, { useEffect, useState } from "react";
import { useParams, useNavigate, useLocation } from "react-router-dom";
import { EbookReader } from "./EbookReader";

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
          setBook(fetched);
        } catch (e) {
          setMsg(e.message);
        } finally {
          setLoading(false);
        }
      }
      fetchBook();
    } else {
      // If navigation passed a joinRoomId, attach it to the book object.
      if (location.state?.joinRoomId) {
        setBook((prev) => ({ ...prev, _joinRoomId: location.state.joinRoomId }));
      }
    }
  }, [id, book, client, location.state]);

  if (loading) {
    return <p className="notice">Loading ebook…</p>;
  }

  if (msg) {
    return <p className="notice">{msg}</p>;
  }

  return (
    <EbookReader
      book={book}
      client={client}
      onBack={() => navigate(-1)}
    />
  );
}
