import React from "react";
import { BookCardSkeleton } from "./BookCardSkeleton";

export function BookGridSkeleton({ count = 6 }) {
  const placeholders = Array.from({ length: count });
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
      {placeholders.map((_, i) => (
        <BookCardSkeleton key={i} />
      ))}
    </div>
  );
}
