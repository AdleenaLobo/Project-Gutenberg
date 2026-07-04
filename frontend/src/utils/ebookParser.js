export const HEADING_REGEX =
  /^\s*(?:CHAPTER|Chapter|LETTER|Letter|ACT|Act)\s+([IVXLCDM]+|\d+)\b.*$|^\s*[IVXLCDM]+\.?\s*$/i;

/* -------------------------------------------------- */
/* Normalize headings to canonical identifiers        */
/* -------------------------------------------------- */
function romanToArabic(roman) {
  const map = {
    i: 1, v: 5, x: 10, l: 50, c: 100, d: 500, m: 1000
  };
  let arabic = 0;
  const str = roman.toLowerCase();
  for (let i = 0; i < str.length; i++) {
    const current = map[str[i]];
    const next = map[str[i + 1]];
    if (next && current < next) {
      arabic += next - current;
      i++;
    } else {
      arabic += current;
    }
  }
  return arabic;
}

function getHeadingIdentifier(line) {
  const trimmed = line.trim();
  const match = trimmed.match(/^(?:(CHAPTER|Chapter|LETTER|Letter|ACT|Act))\s+([IVXLCDM]+|\d+)\b/i);
  if (match) {
    const type = match[1].toLowerCase();
    let val = match[2].toLowerCase();
    if (/^[ivxlcdm]+$/.test(val)) {
      val = String(romanToArabic(val));
    }
    return `${type}_${val}`;
  }
  const romanMatch = trimmed.match(/^([IVXLCDM]+)\.?\s*$/i);
  if (romanMatch) {
    const val = String(romanToArabic(romanMatch[1].toLowerCase()));
    return `chapter_${val}`;
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
function createBlocks(text) {
  const lines = text.split("\n");

  const blocks = [];
  let paragraph = [];

  const flushParagraph = () => {
    if (!paragraph.length) return;

    blocks.push({
      type: "paragraph",
      text: paragraph.join(" ").trim(),
    });

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

  // 1. Strip Gutenberg header and footer
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

  // 2. Strip nested brackets first, then [Illustration: ... ] blocks, [Illustration] tags, and underscores globally
  ebookText = ebookText.replace(/\[\s*_[^\]]*?\]/g, "");
  ebookText = ebookText.replace(/\[Illustration:([\s\S]*?)\]/gi, (match, contents) => {
    const headingRegex = /(?:CHAPTER|Chapter|LETTER|Letter|ACT|Act)\s+(?:[IVXLCDM]+|\d+)\b\.?/i;
    const headingMatch = contents.match(headingRegex);
    return headingMatch ? headingMatch[0] : "";
  });
  ebookText = ebookText.replace(/\[\s*Illustration\s*\]/gi, "");
  ebookText = ebookText.replace(/_/g, "");
  ebookText = ebookText.replace(/--/g, " ");
  ebookText = ebookText.replace(/^\s*\]\s*$/gm, "");

  // 3. Remove duplicated Table of Contents if duplicate headings are found
  let cleanedText = removeTableOfContents(ebookText);

  // 4. If no TOC duplicate was removed, slice from the first actual Preface/Chapter heading
  if (cleanedText === ebookText) {
    const cleanedLines = cleanedText.split("\n");
    let contentStartLineIndex = -1;

    for (let i = 0; i < cleanedLines.length; i++) {
      const line = cleanedLines[i].trim();

      // Match Chapter, Letter, Act, Preface, Foreword, Introduction, or Roman numeral on its own line
      const headingMatch = line.match(/^(?:CHAPTER|Chapter|LETTER|Letter|ACT|Act)\s+(?:[IVXLCDM]+|\d+)\b/i);
      const romanMatch = line.match(/^([IVXLCDM]+)\.?\s*$/i);

      if (headingMatch || romanMatch) {
        contentStartLineIndex = i;
        break;
      }
    }

    if (contentStartLineIndex !== -1) {
      cleanedText = cleanedLines.slice(contentStartLineIndex).join("\n");
    }
  }

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

export function formatBlockText(text, quoteOpenAtStart = false) {
  if (!text) return "";
  let formatted = text;

  // Replace space after titles/prefixes with non-breaking space to keep them on the same line
  formatted = formatted.replace(/\b(Mr|Mrs|Ms|Dr|Prof|Sr|Jr|Gen|Col|Capt|Lieut|St|Rev|Hon)\.\s+([A-Z])/g, "$1.&nbsp;$2");

  let result = "";
  let i = 0;
  let inQuote = quoteOpenAtStart;
  let currentSegment = "";

  while (i < formatted.length) {
    const char = formatted[i];

    if (char === "“" || char === '"') {
      if (!inQuote) {
        result += currentSegment;
        currentSegment = "“";
        inQuote = true;
      } else {
        currentSegment += char;
      }
    } else if (char === "”" || char === '"') {
      if (inQuote) {
        currentSegment += "”";
        result += `<i>${currentSegment}</i>`;
        currentSegment = "";
        inQuote = false;
      } else {
        currentSegment += char;
      }
    } else {
      currentSegment += char;
    }
    i++;
  }

  if (inQuote) {
    result += `<i>${currentSegment}</i>`;
  } else {
    result += currentSegment;
  }

  return result;
}
