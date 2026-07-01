import React from "react";

export default function ReaderContentSkeleton() {
  return (
    <div
      style={{
        width: "100%",
        maxWidth: "900px",
        height: "calc(100vh - 90px)",
        margin: "0 auto",
        padding: "40px 55px",
        background: "#fff",
        boxSizing: "border-box",
        overflow: "hidden",
        userSelect: "none",
        fontFamily: "Georgia, serif",
      }}
    >
      {/* Heading */}
      <div
        style={{
          width: "45%",
          height: 34,
          margin: "20px auto 40px",
          borderRadius: 8,
          background:
            "linear-gradient(90deg,#ececec 25%,#f6f6f6 50%,#ececec 75%)",
          backgroundSize: "200% 100%",
          animation: "readerShimmer 1.3s infinite",
        }}
      />

      {/* Paragraphs */}
      {Array.from({ length: 14 }).map((_, i) => (
        <div key={i} style={{ marginBottom: 22 }}>
          {Array.from({ length: 4 }).map((_, j) => (
            <div
              key={j}
              style={{
                width:
                  j === 3
                    ? `${65 + Math.random() * 20}%`
                    : `${92 + Math.random() * 6}%`,
                height: 16,
                marginBottom: 12,
                borderRadius: 6,
                background:
                  "linear-gradient(90deg,#ececec 25%,#f6f6f6 50%,#ececec 75%)",
                backgroundSize: "200% 100%",
                animation: "readerShimmer 1.3s infinite",
              }}
            />
          ))}
        </div>
      ))}

      <style>
        {`
          @keyframes readerShimmer {
            0% {
              background-position: 200% 0;
            }
            100% {
              background-position: -200% 0;
            }
          }
        `}
      </style>
    </div>
  );
}
