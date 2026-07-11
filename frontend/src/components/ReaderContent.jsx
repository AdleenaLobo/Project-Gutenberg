import React, { useRef, forwardRef } from "react";
import { useReaderTheme } from "../context/ReaderThemeContext";
import { formatBlockText } from "../utils/ebookParser";

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

function updateQuoteState(text, initialState) {
  let state = initialState;
  for (let i = 0; i < text.length; i++) {
    const char = text[i];
    if (char === "“" || char === "”" || char === '"') {
      state = !state;
    }
  }
  return state;
}

function splitTextIntoSegments(text, highlights) {
  if (!highlights || highlights.length === 0) {
    return [{ text, highlight: null }];
  }

  // Filter highlights to only those that fall within the text range
  const validHighlights = highlights
    .filter(hl => hl.start_offset < text.length && hl.end_offset > 0)
    .map(hl => ({
      ...hl,
      start: Math.max(0, hl.start_offset),
      end: Math.min(text.length, hl.end_offset)
    }));

  if (validHighlights.length === 0) {
    return [{ text, highlight: null }];
  }

  // Sort by start position
  validHighlights.sort((a, b) => a.start - b.start || b.end - a.end);

  const segments = [];
  let currentIdx = 0;

  for (const hl of validHighlights) {
    const start = Math.max(hl.start, currentIdx);
    if (hl.end <= start) continue; // Skip if covered

    if (start > currentIdx) {
      segments.push({
        text: text.substring(currentIdx, start),
        highlight: null
      });
    }

    segments.push({
      text: text.substring(start, hl.end),
      highlight: hl
    });
    currentIdx = hl.end;
  }

  // Add any remaining text
  if (currentIdx < text.length) {
    segments.push({
      text: text.substring(currentIdx),
      highlight: null
    });
  }

  return segments;
}

function getBlockChunkHtml(block, highlights) {
  if (block.type === "heading") {
    return block.text;
  }

  const chunkStart = block.startCharOffset ?? 0;
  const chunkEnd = chunkStart + block.text.length;

  const blockHighlights = highlights.filter(hl => {
    return hl.block_index === block.blockIndex &&
           hl.start_offset < chunkEnd &&
           hl.end_offset > chunkStart;
  });

  const localHighlights = blockHighlights.map(hl => {
    const localStart = Math.max(0, hl.start_offset - chunkStart);
    const localEnd = Math.min(block.text.length, hl.end_offset - chunkStart);
    return {
      ...hl,
      start_offset: localStart,
      end_offset: localEnd
    };
  });

  let currentQuoteOpen = block.quoteOpenAtStart;
  let htmlResult = "";
  const segments = splitTextIntoSegments(block.text, localHighlights);

  for (const segment of segments) {
    const formatted = formatBlockText(segment.text, currentQuoteOpen);
    currentQuoteOpen = updateQuoteState(segment.text, currentQuoteOpen);

    if (segment.highlight) {
      htmlResult += `<span class="highlight-${segment.highlight.color}" data-highlight-id="${segment.highlight.id}">${formatted}</span>`;
    } else {
      htmlResult += formatted;
    }
  }

  return htmlResult;
}

const ReaderContent = forwardRef(function ReaderContent({
  currentPage,
  pages = [],
  pageIndex,
  totalPages,
  onPrevious,
  onNext,
  highlights = [],
}, ref) {
  const { fontFamily, fontSize, lineHeight, layoutMode, activeHighlightColor } = useReaderTheme();
  const fontStack = getFontStack(fontFamily);
  const selectionClass = "cursor-text select-text selectable-content";

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
                data-block-index={block.blockIndex}
                data-start-char-offset={block.startCharOffset ?? 0}
                className="text-center font-bold my-8 tracking-wide text-zinc-955 dark:text-white"
                style={{
                  fontSize: `${Math.round(fontSize * 1.45)}px`,
                  fontFamily: fontStack,
                }}
                dangerouslySetInnerHTML={{ __html: getBlockChunkHtml(block, highlights) }}
              />
            );
          }

          return (
            <p
              key={index}
              id={`block-${index}`}
              data-block-index={block.blockIndex}
              data-start-char-offset={block.startCharOffset ?? 0}
              className="text-justify text-zinc-800 dark:text-zinc-200"
              style={{
                textIndent: block.isContinuation ? "0" : "2em",
                marginBottom: block.isContinuation ? "0" : "1rem",
                marginTop: block.isContinuation ? "-1rem" : "0",
                fontSize: `${fontSize}px`,
                lineHeight: lineHeight,
                fontFamily: fontStack,
              }}
              dangerouslySetInnerHTML={{ __html: getBlockChunkHtml(block, highlights) }}
            />
          );
        })}
      </div>
    );
  }

  return (
    <div
      ref={ref}
      className={`w-full max-w-[850px] h-[calc(100vh-80px)] mx-auto px-12 py-10 overflow-hidden bg-transparent border-none shadow-none ${selectionClass}`}
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
              data-block-index={block.blockIndex}
              data-start-char-offset={block.startCharOffset ?? 0}
              className="text-center font-bold my-8 tracking-wide text-zinc-950 dark:text-white"
              style={{
                fontSize: `${Math.round(fontSize * 1.45)}px`,
                fontFamily: fontStack,
              }}
              dangerouslySetInnerHTML={{ __html: getBlockChunkHtml(block, highlights) }}
            />
          );
        }

        return (
          <p
            key={index}
            data-block-index={block.blockIndex}
            data-start-char-offset={block.startCharOffset ?? 0}
            className="text-justify text-zinc-800 dark:text-zinc-200"
            style={{
              textIndent: block.isContinuation ? "0" : "2em",
              marginBottom: block.isContinuation ? "0" : "1rem",
              marginTop: block.isContinuation ? "-1rem" : "0",
              fontSize: `${fontSize}px`,
              lineHeight: lineHeight,
              fontFamily: fontStack,
            }}
            dangerouslySetInnerHTML={{ __html: getBlockChunkHtml(block, highlights) }}
          />
        );
      })}
    </div>
  );
});

export default ReaderContent;