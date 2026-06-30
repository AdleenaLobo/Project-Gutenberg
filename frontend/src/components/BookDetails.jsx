import React from "react";
import { ArrowLeft, BookOpen } from "lucide-react";
import {useNavigate} from 'react-router-dom';

export function BookDetails({ book, isEbook, onBack, onAction }) {
const navigate = useNavigate();

  return (
    <div style={{ padding: "20px", maxWidth: "950px", margin: "0 auto" }}>
      {/* Back Button */}
      <button
        onClick={onBack}
        style={{
          display: "flex",
          alignItems: "center",
          gap: "8px",
          background: "none",
          border: "none",
          cursor: "pointer",
          fontSize: "14px",
          fontWeight: "600",
          marginBottom: "32px",
          padding: 0,
        }}
      >
        <ArrowLeft size={16} /> Back to Collection
      </button>

      {/* Two-Column Side-by-Side Wrapper */}
      <div
        style={{
          display: "flex",
          gap: "32px",
          alignItems: "flex-start",
          flexDirection: "row",
        }}
      >
        {/* Left Side: Cover Image (Outside the main text box) */}
        <div style={{ flexShrink: 0, width: "220px" }}>
          {book.ebook?.cover_image_url ? (
            <img
              src={book.ebook.cover_image_url}
              alt={`${book.title} cover`}
              style={{
                width: "100%",
                height: "410px",
                objectFit: "cover",
                border: "1px solid #000",
                backgroundColor: "#f5f5f5",
              }}
            />
          ) : (
            /* Monochrome Placeholder Box for books without covers */
            <div
              style={{
                width: "100%",
                height: "320px",
                border: "1px dashed #000",
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                justifyContent: "center",
                backgroundColor: "#fff",
                color: "#666",
                padding: "16px",
                textAlign: "center",
              }}
            >
              <BookOpen
                size={32}
                style={{ marginBottom: "8px", color: "#000" }}
              />
              <span
                style={{ fontSize: "12px", fontWeight: "600", color: "#000" }}
              >
                NO COVER
              </span>
            </div>
          )}
        </div>

        {/* Right Side: The Main Details Box */}
        <div
          style={{
            flexGrow: 1,
            border: "1px solid #000",
            padding: "40px",
            background: "#fff",
          }}
        >
          <span
            style={{
              fontSize: "12px",
              color: "#666",
              textTransform: "uppercase",
              letterSpacing: "1px",
            }}
          >
            {isEbook ? "Digital Edition" : "Physical Hardcover"}{" "}
            {book.category && `· ${book.category}`}
          </span>

          <h1
            style={{
              fontSize: "32px",
              fontWeight: "800",
              marginTop: "8px",
              marginBottom: "4px",
              color: "#000",
            }}
          >
            {book.title}
          </h1>

          <p
            style={{
              fontSize: "18px",
              color: "#333",
              marginTop: 0,
              marginBottom: "24px",
            }}
          >
            by {book.author}
          </p>

          <hr
            style={{
              border: "none",
              borderTop: "1px solid #000",
              margin: "24px 0",
            }}
          />

          <h3
            style={{
              fontSize: "14px",
              textTransform: "uppercase",
              letterSpacing: "1px",
              marginBottom: "12px",
            }}
          >
            Summary
          </h3>
          <p
            style={{
              fontSize: "15px",
              lineHeight: "1.6",
              color: "#222",
              marginBottom: "32px",
            }}
          >
            {book.summary ||
              "No summary provided for this title yet. This volume remains an essential addition to the local archive collection."}
          </p>

          {/* Footer Action Panel */}
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              background: "#f9f9f9",
              padding: "20px",
              border: "1px solid #000",
            }}
          >
            <div>
              {!isEbook ? (
                <span style={{ fontSize: "14px", fontWeight: "600" }}>
                  Status: {book.available_copies} of {book.total_copies} copies{" "}
                  currently on shelves.
                </span>
              ) : (
                <span style={{ fontSize: "14px", fontWeight: "600" }}>
                  Format: Instant access via{" "}
                  {book.ebook_source || "Library System"}.
                </span>
              )}
            </div>

            <button
              onClick={() => {
                // onAction(isEbook ? book : book.id)
                navigate(`/books/${book.id}/read`);
              }}
              disabled={!isEbook && book.available_copies < 1}
              style={{
                background: "#000",
                color: "#fff",
                border: "1px solid #000",
                padding: "10px 24px",
                fontWeight: "600",
                cursor: "pointer",
              }}
            >
              {isEbook ? "Open Ebook Reader" : "Lease Physical Copy"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
