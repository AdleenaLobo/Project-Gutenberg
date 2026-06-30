// Page component for displaying a single book's details via routing.
import React, { useEffect, useState } from "react";
import { BookDetailsSkeleton } from "../components/BookDetailsSkeleton";
import { useParams, useNavigate, useLocation } from "react-router-dom";
import { BookDetails } from "../components/BookDetails";

export function BookDetail({ client }) {
  const { id } = useParams();
  const navigate = useNavigate();
  const location = useLocation();

  // Prefer book passed via navigation state, otherwise fetch by ID.
  const [book, setBook] = useState(location.state?.book || null);
  const [loading, setLoading] = useState(!book);
  const [msg, setMsg] = useState("");

  useEffect(() => {
    // If we don't already have the book data, fetch it.
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
    }
  }, [id, book, client]);

  if (loading) {
    return <BookDetailsSkeleton />;
  }

  if (msg) {
    return <p className="notice">{msg}</p>;
  }

  // `onBack` navigates back to the previous page (the grid view).
  // `onAction` is retained for lease/read actions; we simply navigate back when the action completes.
  const handleAction = (payload) => {
    // For simplicity, after performing the action (lease or open ebook) we navigate back.
    // Real implementation could integrate a service call here.
    navigate(-1);
  };

  return (
    <BookDetails
      book={book}
      isEbook={book.type === "ebook"}
      onBack={() => navigate(-1)}
      onAction={book.type === "ebook" ? (b) => navigate(-1) : (id) => navigate(-1)}
    />
  );
}
