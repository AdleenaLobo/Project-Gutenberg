const CHARS_PER_PAGE = 8000;

const HEADING_REGEX =
  /^\s*(?:Chapter|Letter)\s+(\d+|[IVXLCDM]+)\.?\s*$|^\s*[IVXLCDM]+\.?\s*$/i;

export function paginateText(text, charsPerPage = CHARS_PER_PAGE) {
  if (!text) return [""];

  const pages = [];
  let start = 0;

  while (start < text.length) {
    let end = start + charsPerPage;

    if (end < text.length) {
      // Prefer paragraph breaks
      let paragraphBreak = text.lastIndexOf("\n\n", end);

      if (paragraphBreak > start + charsPerPage * 0.6) {
        end = paragraphBreak;
      } else {
        // Otherwise break at a space
        while (end > start && text[end] !== " ") {
          end--;
        }
      }
    }

    pages.push(text.slice(start, end).trim());

    start = end;
  }

  return pages;
}

function removeTableOfContents(text) {
  const lines = text.split("\n");

  let firstHeading = null;
  let secondOccurrenceIndex = -1;

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i].trim();

    if (!HEADING_REGEX.test(line)) continue;

    if (!firstHeading) {
      firstHeading = line.toLowerCase();
      continue;
    }

    if (line.toLowerCase() === firstHeading) {
      secondOccurrenceIndex = i;
      break;
    }
  }

  if (secondOccurrenceIndex === -1) {
    return text;
  }

  return lines.slice(secondOccurrenceIndex).join("\n");
}

function extractChapters(bookText) {
  const lines = bookText.split("\n");

  const chapterPositions = [];

  let charCount = 0;

  lines.forEach((line) => {
    const trimmed = line.trim();

    if (HEADING_REGEX.test(trimmed)) {
      chapterPositions.push({
        title: trimmed,
        position: charCount,
      });
    }

    charCount += line.length + 1;
  });

  return chapterPositions.map((chapter) => ({
    title: chapter.title,
    pageIndex: Math.floor(chapter.position / CHARS_PER_PAGE),
  }));
}

export function parseBook(book) {
  const ebookText = book?.ebook_text ?? book?.ebook?.text ?? "";

  if (!ebookText) {
    return {
      pages: [],
      chapters: [],
    };
  }

  const cleanedText = removeTableOfContents(ebookText);

  const pages = paginateText(cleanedText);

  const chapters = extractChapters(cleanedText);

  return {
    pages,
    chapters,
  };
}
