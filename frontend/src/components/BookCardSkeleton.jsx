// Skeleton placeholder for a book card – shows loading UI while data is being fetched.
// The component mirrors the layout of BookGrid's book-card but replaces content with gray blocks.

import React from "react";

// Reuse the same inline card container styles as BookGrid for visual consistency.
const cardContainerStyle = {
  border: "1px solid #000",
  borderRadius: "0px",
  padding: "20px",
  background: "#fff",
  cursor: "default",
  // Use a static transform; no hover scaling for skeleton.
  transform: "scale(1)",
  boxShadow: "0px 0px 0px #000",
  transition: "background 0.2s ease",
  display: "flex",
  flexDirection: "column",
  gap: "4px",
};

export function BookCardSkeleton() {
  return (
    <div className="book-card" style={cardContainerStyle}>
      {/* Type tag placeholder */}
      <div className="skeleton" style={{ width: "60px", height: "12px", marginBottom: "8px", backgroundColor: "#e0e0e0", borderRadius: "2px" }} />
      {/* Title placeholder */}
      <div className="skeleton" style={{ width: "80%", height: "18px", marginBottom: "6px" }} />
      {/* Author placeholder */}
      <div className="skeleton" style={{ width: "70%", height: "14px", marginBottom: "12px" }} />
      {/* Footer placeholder – copies info and action button */}
      <div style={{ display: "flex", alignItems: "center", marginTop: "auto" }}>
        <div className="skeleton" style={{ width: "40px", height: "12px" }} />
        <div className="skeleton" style={{ width: "60px", height: "24px", marginLeft: "auto" }} />
      </div>
    </div>
  );
}
