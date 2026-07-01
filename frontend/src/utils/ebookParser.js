const CHARS_PER_PAGE = 1100;

export const HEADING_REGEX =
  /^\s*(?:CHAPTER|Chapter|LETTER|Letter)\s+([IVXLCDM]+|\d+)\.?\s*$|^\s*[IVXLCDM]+\.\s*$/i;

/* -------------------------------------------------- */
/* Remove duplicated table of contents                 */
/* -------------------------------------------------- */
function removeTableOfContents(text) {
  const lines = text.split("\n");

  let firstHeading = null;
  let secondOccurrence = -1;

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i].trim();

    if (!HEADING_REGEX.test(line)) continue;

    if (!firstHeading) {
      firstHeading = line.toLowerCase();
      continue;
    }

    if (line.toLowerCase() === firstHeading) {
      secondOccurrence = i;
      break;
    }
  }

  if (secondOccurrence === -1) return text;

  return lines.slice(secondOccurrence).join("\n");
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
  console.log(blocks);
  return blocks;
}
/* -------------------------------------------------- */
/* Paginate blocks                                     */
/* -------------------------------------------------- */
function paginateBlocks(blocks) {
  const pages = [];

  const chapters = [];

  let currentPage = [];

  let currentLength = 0;

  blocks.forEach((block) => {
    const length = block.text.length;

    if (currentLength + length > CHARS_PER_PAGE && currentPage.length > 0) {
      pages.push({
        lines: currentPage,
      });

      currentPage = [];
      currentLength = 0;
    }

    if (block.type === "heading") {
      chapters.push({
        title: block.text,
        pageIndex: pages.length,
      });
    }

    currentPage.push(block);

    currentLength += length;
  });

  if (currentPage.length) {
    pages.push({
      lines: currentPage,
    });
  }

  return {
    pages,
    chapters,
  };
}

/* Main parser                                         */
export function parseBook(book) {
  const ebookText = book?.ebook_text ?? book?.ebook?.text ?? "";

  if (!ebookText) {
    return {
      pages: [],
      chapters: [],
    };
  }

  const cleanedText = removeTableOfContents(ebookText);

  const blocks = createBlocks(cleanedText);

  const { pages, chapters } = paginateBlocks(blocks);

  return {
    pages,
    chapters,
  };
}
