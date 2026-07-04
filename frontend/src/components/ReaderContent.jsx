import React, { useRef, forwardRef } from "react";
import { useReaderTheme } from "../context/ReaderThemeContext";

const getFontStack = (font) => {
  switch (font) {
    case "Bookerly":
      return "'Bookerly', 'Literata', Georgia, serif";
    case "Open Sans":
      return "'Open Sans', sans-serif";
    case "Inter":
      return "'Inter', sans-serif";
    case "Merriweather":
      return "'Merriweather', serif";
    default:
      return font;
  }
};

const ReaderContent = forwardRef(function ReaderContent({
  currentPage,
  pages = [],
  pageIndex,
  totalPages,
  onPrevious,
  onNext,
}, ref) {
  const { fontFamily, fontSize, lineHeight, layoutMode } = useReaderTheme();
  const fontStack = getFontStack(fontFamily);
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

  if (layoutMode === "scroll") {
    const allBlocks = pages.reduce((acc, p) => [...acc, ...(p.lines || [])], []);

    return (
      <div
        ref={ref}
        className="w-full max-w-[850px] min-h-screen h-auto mx-auto px-12 py-10 bg-transparent border-none shadow-none select-text"
        style={{
          fontFamily: fontStack,
          fontSize: `${fontSize}px`,
          lineHeight: lineHeight,
        }}
      >
        {allBlocks.map((block, index) => {
          if (block.type === "heading") {
            return (
              <h2
                key={index}
                id={`block-${index}`}
                className="text-center font-bold my-8 tracking-wide text-zinc-955 dark:text-white"
                style={{
                  fontSize: `${Math.round(fontSize * 1.45)}px`,
                  fontFamily: fontStack,
                }}
              >
                {block.text}
              </h2>
            );
          }

          return (
            <p
              key={index}
              id={`block-${index}`}
              className="text-justify text-zinc-800 dark:text-zinc-200"
              style={{
                textIndent: block.isContinuation ? "0" : "2em",
                marginBottom: block.isContinuation ? "0" : "1rem",
                marginTop: block.isContinuation ? "-1rem" : "0",
                fontSize: `${fontSize}px`,
                lineHeight: lineHeight,
                fontFamily: fontStack,
              }}
              dangerouslySetInnerHTML={{ __html: block.text }}
            />
          );
        })}
      </div>
    );
  }

  return (
    <div
      ref={ref}
      onMouseDown={handleMouseDown}
      onMouseUp={handleMouseUp}
      className="w-full max-w-[850px] h-[calc(100vh-80px)] mx-auto px-12 py-10 overflow-hidden cursor-grab select-none bg-transparent border-none shadow-none"
      style={{
        fontFamily: fontStack,
        fontSize: `${fontSize}px`,
        lineHeight: lineHeight,
      }}
    >
      {(currentPage?.lines || []).map((block, index) => {
        if (block.type === "heading") {
          return (
            <h2
              key={index}
              className="text-center font-bold my-8 tracking-wide text-zinc-950 dark:text-white"
              style={{
                fontSize: `${Math.round(fontSize * 1.45)}px`,
                fontFamily: fontStack,
              }}
            >
              {block.text}
            </h2>
          );
        }

        return (
          <p
            key={index}
            className="text-justify text-zinc-800 dark:text-zinc-200"
            style={{
              textIndent: block.isContinuation ? "0" : "2em",
              marginBottom: block.isContinuation ? "0" : "1rem",
              marginTop: block.isContinuation ? "-1rem" : "0",
              fontSize: `${fontSize}px`,
              lineHeight: lineHeight,
              fontFamily: fontStack,
            }}
            dangerouslySetInnerHTML={{ __html: block.text }}
          />
        );
      })}
    </div>
  );
});

export default ReaderContent;