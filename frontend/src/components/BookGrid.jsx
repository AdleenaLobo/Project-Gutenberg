import React, { useState } from "react";
import { BookGridSkeleton } from "./BookGridSkeleton";
import {useNavigate} from 'react-router-dom';
 
export function BookGrid({
  books,
  isEbook,
  onAction,
  onSelectBook,
  emptyMessage,
  loading = false,
}) {
  // Show skeleton UI while loading data
  // Store the currently hovered book ID to handle isolated hover states
  const [hoveredId, setHoveredId] = useState(null);
  const navigate = useNavigate();

  // Show skeleton UI while loading data
  if (loading) {
    return <BookGridSkeleton />;
  }

  if (books.length === 0) {
    return (
      <div
        className="empty-state"
        style={{
          padding: "40px",
          textAlign: "center",
          border: "1px solid #000",
        }}
      >
        <p className="empty-state-title" style={{ color: "#000" }}>
          {emptyMessage}
        </p>
      </div>
    );
  }

  return (
    <div className="books-grid" style={{ display: "grid", gap: "20px" }}>
      {books.map((b) => {
        const isHovered = hoveredId === b.id;

        return (
          <div
            key={b.id}
            className="book-card"
            onMouseEnter={() => setHoveredId(b.id)}
            onMouseLeave={() => setHoveredId(null)}
            onClick={() => onSelectBook(b)} // Directs user to details view
            style={{
              border: "1px solid #000",
              borderRadius: "0px",
              padding: "20px",
              background: "#fff",
              cursor: "pointer",
              // Expanding scaling effect on hover
              transform: isHovered ? "scale(1.02)" : "scale(1)",
              boxShadow: isHovered ? "4px 4px 0px #000" : "0px 0px 0px #000",
              transition: "transform 0.2s ease, box-shadow 0.2s ease",
            }}
          >
            <span
              className="book-type-tag"
              style={{
                color: "#666",
                fontSize: "11px",
                textTransform: "uppercase",
                display: "block",
                marginBottom: "8px",
              }}
            >
              {isEbook ? `Ebook ` : "Hardcover "} {b.category && `· ${b.category}`}
            </span>

            <span
              className="book-title"
              style={{
                color: "#000",
                fontSize: "18px",
                fontWeight: "bold",
                display: "block",
              }}
            >
              {b.title}
            </span>

            <span
              className="book-author"
              style={{ color: "#333", display: "block", marginBottom: "16px" }}
            >
              by {b.author}
            </span>

            <div
              className="book-footer"
              style={{
                display: "flex",
                justifyContent: "between",
                alignItems: "center",
              }}
            >
              {!isEbook ? (
                <span
                  className={`book-copies ${b.available_copies < 2 ? "low" : ""}`}
                  style={{
                    color: b.available_copies < 2 ? "#cc0000" : "#333",
                    fontSize: "13px",
                  }}
                >
                  {b.available_copies} of {b.total_copies} available
                </span>
              ) : (
                <span className="book-copies" />
              )}

              <button
                className={isEbook ? "btn-read" : "btn-lease"}
                disabled={!isEbook && b.available_copies < 1}
                onClick={(e) => {
                  e.stopPropagation(); // Stops the card's outer click from triggering simultaneously
                  onAction(isEbook ? b : b.id);
                  navigate(`/books/${b.id}/read`)
                  
                }}
                style={{
                  background: "#000",
                  color: "#fff",
                  border: "1px solid #000",
                  borderRadius: "0px",
                  padding: "6px 16px",
                  cursor: "pointer",
                  marginLeft: "auto",
                }}
              >
                {isEbook ? "Read" : "Lease"}
              </button>
            </div>
          </div>
        );
      })}
    </div>
  );
}
