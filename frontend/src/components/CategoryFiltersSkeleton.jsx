// Skeleton UI for CategoryFilters – shows placeholder title and chip bars while data loads.
import React from "react";

export function CategoryFiltersSkeleton() {
  // Number of placeholder chips – adjust as desired.
  const placeholders = Array.from({ length: 6 });
  return (
    <div
      className="categories-container"
      style={{
        marginBottom: "24px",
        borderBottom: "1px solid #000",
        paddingBottom: "16px",
      }}
    >
      {/* Title placeholder */}
      <div className="skeleton" style={{ width: "120px", height: "14px", marginBottom: "12px" }} />
      {/* Chip placeholders */}
      <div style={{ display: "flex", gap: "6px", flexWrap: "wrap" }}>
        {placeholders.map((_, i) => (
          <div key={i} className="skeleton" style={{ width: "60px", height: "20px" }} />
        ))}
      </div>
    </div>
  );
}
