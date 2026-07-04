export const HEADING_REGEX =
  /^\s*(?:CHAPTER|Chapter|LETTER|Letter|ACT|Act)\s+([IVXLCDM]+|\d+)\b.*$|^\s*[IVXLCDM]+\.?\s*$/i;

/* -------------------------------------------------- */
/* Normalize headings to canonical identifiers        */
/* -------------------------------------------------- */
function getHeadingIdentifier(line) {
  const trimmed = line.trim();
  const match = trimmed.match(/^(?:CHAPTER|Chapter|LETTER|Letter|ACT|Act)\s+([IVXLCDM]+|\d+)\b/i);
  if (match) {
    return `chapter_${match[1].toLowerCase()}`;
  }
  const romanMatch = trimmed.match(/^([IVXLCDM]+)\.?\s*$/i);
  if (romanMatch) {
    return `chapter_${romanMatch[1].toLowerCase()}`;
  }
  return null;
}

/* -------------------------------------------------- */
/* Remove duplicated table of contents                 */
/* -------------------------------------------------- */
function removeTableOfContents(text) {
  const lines = text.split("\n");

  let firstHeadingId = null;
  let firstHeadingLineIndex = -1;

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];
    const headingId = getHeadingIdentifier(line);
    if (headingId) {
      firstHeadingId = headingId;
      firstHeadingLineIndex = i;
      break;
    }
  }

  if (!firstHeadingId) return text;

  let secondOccurrenceIndex = -1;
  for (let i = firstHeadingLineIndex + 1; i < lines.length; i++) {
    const headingId = getHeadingIdentifier(lines[i]);
    if (headingId === firstHeadingId) {
      secondOccurrenceIndex = i;
      break;
    }
  }

  if (secondOccurrenceIndex === -1) return text;

  return lines.slice(secondOccurrenceIndex).join("\n");
}

/* -------------------------------------------------- */
/* Convert raw text into blocks                        */
/* -------------------------------------------------- */
const WORDS_PER_BLOCK = 100;

function createBlocks(text) {
  const lines = text.split("\n");

  const blocks = [];
  let paragraph = [];

  const flushParagraph = () => {
    if (!paragraph.length) return;

    const words = paragraph.join(" ").trim().split(/\s+/);

    for (let i = 0; i < words.length; i += WORDS_PER_BLOCK) {
      blocks.push({
        type: "paragraph",
        text: words.slice(i, i + WORDS_PER_BLOCK).join(" "),
      });
    }

    paragraph = [];
  };

  for (const rawLine of lines) {
    const line = rawLine.trim();

    if (!line) {
      flushParagraph();
      continue;
    }

    if (HEADING_REGEX.test(line)) {
      flushParagraph();

      blocks.push({
        type: "heading",
        text: line,
      });

      continue;
    }

    paragraph.push(line);
  }

  flushParagraph();
  return blocks;
}

/* Main parser                                         */
export function parseBook(book) {
  let ebookText = book?.ebook_text ?? book?.ebook?.text ?? "";

  if (!ebookText) {
    return {
      blocks: [],
      chapters: [],
    };
  }

  // Strip Gutenberg header and footer
  const startRegex = /^\s*\*\*\*\s*START OF (?:THE|THIS) PROJECT GUTENBERG EBOOK[^*]*\*\*\*/i;
  const endRegex = /^\s*\*\*\*\s*END OF (?:THE|THIS) PROJECT GUTENBERG EBOOK[^*]*\*\*\*/i;

  const lines = ebookText.split("\n");
  let startIndex = 0;
  let endIndex = lines.length;

  for (let i = 0; i < lines.length; i++) {
    if (startRegex.test(lines[i])) {
      startIndex = i + 1;
    }
    if (endRegex.test(lines[i])) {
      endIndex = i;
      break;
    }
  }

  ebookText = lines.slice(startIndex, endIndex).join("\n");

  const cleanedText = removeTableOfContents(ebookText);

  const blocks = createBlocks(cleanedText);

  // Build chapter list from the blocks
  const chapters = [];

  blocks.forEach((block, index) => {
    if (block.type === "heading") {
      chapters.push({
        title: block.text,
        blockIndex: index,
      });
    }
  });

  return {
    blocks,
    chapters,
  };
}
