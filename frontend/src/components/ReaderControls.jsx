import React, { useEffect, useState } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";

export default function ReaderControls({
  pageIndex,
  totalPages,
  onPrevious,
  onNext,
}) {
  const [visible, setVisible] = useState(true);
  const [hoveringArrow, setHoveringArrow] = useState(false);

  useEffect(() => {
    let timeout;

    const showControls = () => {
      setVisible(true);

      clearTimeout(timeout);

      timeout = setTimeout(() => {
        if (!hoveringArrow) {
          setVisible(false);
        }
      }, 2000);
    };

    window.addEventListener("mousemove", showControls);

    showControls();

    return () => {
      clearTimeout(timeout);
      window.removeEventListener("mousemove", showControls);
    };
  }, [hoveringArrow]);

  const showUI = visible || hoveringArrow;

  return (
    <>
      {/* Previous Button */}
      <button
        disabled={pageIndex === 0}
        onMouseEnter={() => setHoveringArrow(true)}
        onMouseLeave={() => setHoveringArrow(false)}
        onClick={onPrevious}
        aria-label="Previous page"
        style={{
          position: "fixed",
          left: 28,
          top: "50%",
          transform: "translateY(-50%)",
          width: 54,
          height: 54,
          borderRadius: "50%",
          border: showUI
            ? "1px solid rgba(0,0,0,.08)"
            : "1px solid transparent",
          background: showUI ? "#fff" : "transparent",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          cursor: pageIndex === 0 ? "not-allowed" : "pointer",
          transition: "all .25s ease",
          opacity: pageIndex === 0 ? 0.3 : 1,
          zIndex: 100,
        }}
      >
        <ChevronLeft
          size={28}
          style={{
            color: "#222",
            opacity: showUI ? 1 : 0.35,
            transition: "opacity .25s ease",
          }}
        />
      </button>

      {/* Next Button */}
      <button
        disabled={pageIndex >= totalPages - 1}
        onMouseEnter={() => setHoveringArrow(true)}
        onMouseLeave={() => setHoveringArrow(false)}
        onClick={onNext}
        aria-label="Next page"
        style={{
          position: "fixed",
          right: 28,
          top: "50%",
          transform: "translateY(-50%)",
          width: 54,
          height: 54,
          borderRadius: "50%",
          border: showUI
            ? "1px solid rgba(0,0,0,.08)"
            : "1px solid transparent",
          background: showUI ? "#fff" : "transparent",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          cursor: pageIndex >= totalPages - 1 ? "not-allowed" : "pointer",
          transition: "all .25s ease",
          opacity: pageIndex >= totalPages - 1 ? 0.3 : 1,
          zIndex: 100,
        }}
      >
        <ChevronRight
          size={28}
          style={{
            color: "#222",
            opacity: showUI ? 1 : 0.35,
            transition: "opacity .25s ease",
          }}
        />
      </button>

      {/* Page Indicator */}
      <div
        style={{
          position: "fixed",
          bottom: 24,
          left: "50%",
          transform: "translateX(-50%)",
          padding: "8px 18px",
          borderRadius: "999px",
          background: showUI ? "rgba(255,255,255,.95)" : "transparent",
          border: showUI
            ? "1px solid rgba(0,0,0,.08)"
            : "1px solid transparent",
          color: showUI ? "#555" : "transparent",
          fontSize: 14,
          fontWeight: 500,
          pointerEvents: "none",
          userSelect: "none",
          transition: "all .25s ease",
          zIndex: 100,
        }}
      >
        {pageIndex + 1} / {totalPages}
      </div>
    </>
  );
}
