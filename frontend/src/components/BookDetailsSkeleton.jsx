// Skeleton UI for the BookDetails component – shows placeholder UI while a single book loads.
import React from "react";

export function BookDetailsSkeleton() {
  return (
    <div style={{ padding: "20px", maxWidth: "950px", margin: "0 auto" }}>
      {/* Back button – keep visible for navigation */}
      <button
        disabled
        style={{
          display: "flex",
          alignItems: "center",
          gap: "8px",
          background: "none",
          border: "none",
          cursor: "default",
          fontSize: "14px",
          fontWeight: "600",
          marginBottom: "32px",
          padding: 0,
          color: "#aaa",
        }}
      >
        ← Back to Collection
      </button>

      <div style={{ display: "flex", gap: "32px", alignItems: "flex-start" }}>
        {/* Left side – cover image placeholder */}
        <div style={{ flexShrink: 0, width: "220px" }}>
          <div className="skeleton" style={{ width: "100%", height: "410px" }} />
        </div>

        {/* Right side – content placeholders */}
        <div
          style={{
            flexGrow: 1,
            border: "1px solid #000",
            padding: "40px",
            background: "#fff",
          }}
        >
          {/* Type tag */}
          <div className="skeleton" style={{ width: "120px", height: "12px", marginBottom: "8px" }} />
          {/* Title */}
          <div className="skeleton" style={{ width: "70%", height: "32px", marginBottom: "4px" }} />
          {/* Author */}
          <div className="skeleton" style={{ width: "40%", height: "18px", marginBottom: "24px" }} />
          {/* Divider */}
          <hr style={{ border: "none", borderTop: "1px solid #000", margin: "24px 0" }} />
          {/* Summary heading */}
          <div className="skeleton" style={{ width: "80px", height: "14px", marginBottom: "12px" }} />
          {/* Summary text – several lines */}
          <div className="skeleton" style={{ width: "100%", height: "12px", marginBottom: "6px" }} />
          <div className="skeleton" style={{ width: "95%", height: "12px", marginBottom: "6px" }} />
          <div className="skeleton" style={{ width: "90%", height: "12px", marginBottom: "6px" }} />
          <div className="skeleton" style={{ width: "85%", height: "12px", marginBottom: "24px" }} />
          {/* Footer action panel */}
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
            {/* Status placeholder */}
            <div className="skeleton" style={{ width: "200px", height: "14px" }} />
            {/* Button placeholder */}
            <div className="skeleton" style={{ width: "120px", height: "36px" }} />
          </div>
        </div>
      </div>
    </div>
  );
}
