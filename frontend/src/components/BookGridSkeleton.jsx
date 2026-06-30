// Skeleton UI for the BookGrid component – shows loading placeholders for a set of book cards.
// The grid mirrors the layout and styling of the actual BookGrid, using the same CSS classes.

import React from "react";
import { BookCardSkeleton } from "./BookCardSkeleton";

export function BookGridSkeleton({ count = 6 }) {
  // Create an array of the desired length and render a skeleton card for each entry.
  const placeholders = Array.from({ length: count });
  return (
    <div className="books-grid" style={{ display: "grid", gap: "20px" }}>
      {placeholders.map((_, i) => (
        <BookCardSkeleton key={i} />
      ))}
    </div>
  );
}
