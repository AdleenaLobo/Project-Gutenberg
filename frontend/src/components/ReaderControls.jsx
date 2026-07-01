import React, { useEffect, useState } from "react";
import { ChevronLeft, ChevronRight, List } from "lucide-react";

export default function ReaderControls({
  pageIndex,
  totalPages,
  onPrevious,
  onNext,
  onOpenChapters,
}) {
  const [visible, setVisible] = useState(true);
  const [hoveringControl, setHoveringControl] = useState(false);

  useEffect(() => {
    let timeout;

    const showControls = () => {
      setVisible(true);

      clearTimeout(timeout);

      timeout = setTimeout(() => {
        if (!hoveringControl) {
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
  }, [hoveringControl]);

  const showUI = visible || hoveringControl;

  const controlStyle = {
    width: 54,
    height: 54,
    borderRadius: "50%",
    border: showUI ? "1px solid rgba(0,0,0,.08)" : "1px solid transparent",
    background: showUI ? "#fff" : "transparent",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    transition: "all .25s ease",
  };

  const iconStyle = {
    color: "#222",
    opacity: showUI ? 1 : 0.35,
    transition: "opacity .25s ease",
  };

  return (
    <>
      {/* Chapter Button */}
      <button
        onClick={onOpenChapters}
        onMouseEnter={() => setHoveringControl(true)}
        onMouseLeave={() => setHoveringControl(false)}
        aria-label="Table of contents"
        style={{
          ...controlStyle,
          position: "fixed",
          left: 28,
          top: "15%",
          transform: "translateY(-50%)",
          cursor: "pointer",
          zIndex: 10,
          padding:0,
        }}
      >
        <List size={22} style={iconStyle} />
      </button>

      {/* Previous Button */}
      <button
        disabled={pageIndex === 0}
        onMouseEnter={() => setHoveringControl(true)}
        onMouseLeave={() => setHoveringControl(false)}
        onClick={onPrevious}
        aria-label="Previous page"
        style={{
          ...controlStyle,
          position: "fixed",
          left: 28,
          top: "50%",
          transform: "translateY(-50%)",
          cursor: pageIndex === 0 ? "not-allowed" : "pointer",
          opacity: pageIndex === 0 ? 0.3 : 1,
          zIndex: 10,
        }}
      >
        <ChevronLeft size={28} style={iconStyle} />
      </button>

      {/* Next Button */}
      <button
        disabled={pageIndex >= totalPages - 1}
        onMouseEnter={() => setHoveringControl(true)}
        onMouseLeave={() => setHoveringControl(false)}
        onClick={onNext}
        aria-label="Next page"
        style={{
          ...controlStyle,
          position: "fixed",
          right: 28,
          top: "50%",
          transform: "translateY(-50%)",
          cursor: pageIndex >= totalPages - 1 ? "not-allowed" : "pointer",
          opacity: pageIndex >= totalPages - 1 ? 0.3 : 1,
          zIndex: 10,
        }}
      >
        <ChevronRight size={28} style={iconStyle} />
      </button>

      {/* Page Indicator */}
      <div
        style={{
          position: "fixed",
          bottom: 24,
          left: "50%",
          transform: "translateX(-50%)",
          padding: "8px 18px",
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
          zIndex: 10,
        }}
      >
        {pageIndex + 1} / {totalPages}
      </div>
    </>
  );
}
