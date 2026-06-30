import React, { useRef } from "react";

export default function ReaderContent({
  currentPage,
  pageIndex,
  totalPages,
  onPrevious,
  onNext,
}) {
  const startX = useRef(null);

  const handleMouseDown = (e) => {
    startX.current = e.clientX;
  };

  const handleMouseUp = (e) => {
    if (startX.current === null) return;

    const distance = e.clientX - startX.current;
    const threshold = 120;

    if (distance > threshold && pageIndex > 0) {
      onPrevious();
    } else if (distance < -threshold && pageIndex < totalPages - 1) {
      onNext();
    }

    startX.current = null;
  };

  return (
    <div
      onMouseDown={handleMouseDown}
      onMouseUp={handleMouseUp}
      style={{
        width: "100%",
        maxWidth: "900px",
        height: "calc(100vh - 90px)",
        margin: "0 auto",
        padding: "40px 55px",
        background: "#fff",
        boxSizing: "border-box",
        overflow: "hidden",
        cursor: "grab",
        userSelect: "none",
      }}
    >
      <p
        style={{
          whiteSpace: "pre-wrap",
          lineHeight: 2,
          fontSize: "18px",
          color: "#222",
          textAlign: "justify",
          fontFamily: "Georgia, serif",
          margin: 0,
        }}
      >
        {currentPage}
      </p>
    </div>
  );
}
