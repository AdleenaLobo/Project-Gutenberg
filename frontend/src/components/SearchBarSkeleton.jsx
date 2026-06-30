// Skeleton UI for the search bar shown while loading e‑book data.
import React from "react";

export function SearchBarSkeleton() {
  return (
    <div
      style={{
        display: "flex",
        alignItems: "center",
        border: "1px solid #000",
        padding: "8px 14px",
        marginBottom: "24px",
        background: "#fff",
      }}
    >
      {/* Icon placeholder */}
      <div className="skeleton" style={{ width: "16px", height: "16px", marginRight: "10px" }} />
      {/* Input placeholder */}
      <div className="skeleton" style={{ flex: 1, height: "14px" }} />
    </div>
  );
}
