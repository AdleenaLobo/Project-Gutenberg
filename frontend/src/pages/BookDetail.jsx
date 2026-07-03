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
  // `onAction` executes backend lease API call for hardcover books.
  const handleAction = async (bookId) => {
    setLoading(true);
    setMsg("");
    try {
      await client.request("/leases", {
        method: "POST",
        body: JSON.stringify({ book_id: bookId }),
      });
      navigate("/");
    } catch (e) {
      setMsg(e.message);
      setLoading(false);
    }
  };

  return (
    <BookDetails
      book={book}
      isEbook={book.type === "ebook"}
      onBack={() => navigate(-1)}
      onAction={handleAction}
    />
  );
}
