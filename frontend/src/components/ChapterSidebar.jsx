import React, { useMemo, useState } from "react";
import { X, Search, BookOpen, ChevronRight } from "lucide-react";

export default function ChapterSidebar({
  open,
  chapters,
  pageIndex,
  onClose,
  onSelectChapter,
}) {
  const [search, setSearch] = useState("");

  const filteredChapters = useMemo(() => {
    if (!search.trim()) return chapters;

    return chapters.filter((chapter) =>
      chapter.title.toLowerCase().includes(search.toLowerCase()),
    );
  }, [chapters, search]);

  return (
    <>
      {/* Overlay */}
      <div
        onClick={onClose}
        style={{
          position: "fixed",
          inset: 0,
          background: "rgba(0,0,0,.25)",
          opacity: open ? 1 : 0,
          pointerEvents: open ? "auto" : "none",
          transition: ".25s",
          zIndex: 99,
        }}
      />

      {/* Sidebar */}
      <aside
        style={{
          position: "fixed",
          top: 0,
          left: open ? 0 : "-360px",
          width: "340px",
          height: "100vh",
          background: "#fff",
          borderRight: "1px solid #e5e5e5",
          transition: ".25s ease",
          display: "flex",
          flexDirection: "column",
          zIndex: 100,
          boxShadow: "4px 0 18px rgba(0,0,0,.08)",
        }}
      >
        {/* Header */}
        <div
          style={{
            padding: "20px",
            borderBottom: "1px solid #eee",
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
          }}
        >
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: 10,
              color: "#000",
              fontWeight: 700,
              fontSize: 18,
            }}
          >
            <BookOpen size={20} />
            Contents
          </div>

          <button
            onClick={onClose}
            style={{
              border: "none",
              background: "transparent",
              cursor: "pointer",
              color: "#000",
            }}
          >
            <X size={20} />
          </button>
        </div>

        {/* Search */}
        <div
          style={{
            padding: "16px",
            borderBottom: "1px solid #eee",
          }}
        >
          <div
            style={{
              display: "flex",
              alignItems: "center",
              border: "1px solid #ddd",
              padding: "10px 12px",
              borderRadius: 8,
            }}
          >
            <Search size={16} color="black" />

            <input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search chapters..."
              style={{
                border: "none",
                outline: "none",
                marginLeft: 10,
                flex: 1,
                fontSize: 14,
                color: "#000",
                background: "transparent",
              }}
            />
          </div>
        </div>

        {/* Chapter List */}
        <div
          style={{
            flex: 1,
            overflowY: "auto",
          }}
        >
          {filteredChapters.length === 0 && (
            <div
              style={{
                padding: 30,
                color: "#666",
                textAlign: "center",
              }}
            >
              No chapters found
            </div>
          )}

          {filteredChapters.map((chapter, index) => {
            const active = chapter.pageIndex === pageIndex;

            return (
              <button
                key={index}
                onClick={() => {
                  onSelectChapter(chapter.pageIndex);
                  onClose();
                }}
                style={{
                  width: "100%",
                  border: "none",
                  background: active ? "#f5f5f5" : "#fff",
                  cursor: "pointer",
                  padding: "18px 20px",
                  borderBottom: "1px solid #f1f1f1",
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  transition: ".2s",
                  color: "#000",
                }}
                onMouseEnter={(e) => {
                  if (!active) e.currentTarget.style.background = "#fafafa";
                }}
                onMouseLeave={(e) => {
                  if (!active) e.currentTarget.style.background = "#fff";
                }}
              >
                <div
                  style={{
                    textAlign: "left",
                  }}
                >
                  <div
                    style={{
                      fontWeight: active ? 700 : 500,
                      fontSize: 15,
                    }}
                  >
                    {chapter.title}
                  </div>

                  <div
                    style={{
                      fontSize: 12,
                      color: "#777",
                      marginTop: 4,
                    }}
                  >
                    Page {chapter.pageIndex + 1}
                  </div>
                </div>

                <ChevronRight size={18} color="#999" />
              </button>
            );
          })}
        </div>

        {/* Footer */}
        <div
          style={{
            borderTop: "1px solid #eee",
            padding: "14px 20px",
            fontSize: 13,
            color: "#666",
          }}
        >
          {chapters.length} chapters
        </div>
      </aside>
    </>
  );
}
