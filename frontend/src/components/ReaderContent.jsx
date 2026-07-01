import React, { useRef, forwardRef } from "react";

const ReaderContent = forwardRef(function ReaderContent({
  currentPage,
  pageIndex,
  totalPages,
  onPrevious,
  onNext,
}, ref) {
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
      ref={ref}
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
        fontFamily: "Georgia, serif",
      }}
    >
      {(currentPage?.lines || []).map((block, index) => {
        if (block.type === "heading") {
          return (
            <h2
              key={index}
              style={{
                textAlign: "center",
                fontSize: 30,
                fontWeight: 700,
                margin: "32px 0 24px",
                letterSpacing: ".03em",
                color: "#111",
              }}
            >
              {block.text}
            </h2>
          );
        }

        return (
          <p
            key={index}
            style={{
              fontSize: 18,
              lineHeight: 2,
              color: "#222",
              margin: "0 0 18px",
              textAlign: "justify",
              textIndent: "2em",
            }}
          >
            {block.text}
          </p>
        );
      })}
    </div>
  );
})


export default ReaderContent;