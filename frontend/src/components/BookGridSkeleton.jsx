import React from "react";
import { BookCardSkeleton } from "./BookCardSkeleton";

export function BookGridSkeleton({ count = 6 }) {
  const placeholders = Array.from({ length: count });
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
      {placeholders.map((_, i) => (
        <BookCardSkeleton key={i} />
      ))}
    </div>
  );
}
