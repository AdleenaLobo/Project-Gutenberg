import React from "react";
import { X, BookOpen } from "lucide-react";

export default function ChapterSidebar({
  open,
  chapters,
  pageIndex,
  onClose,
  onSelectChapter,
}) {
  return (
    <>
      {/* Backdrop */}
      {open && (
        <div
          onClick={onClose}
          style={{
            position: "fixed",
            inset: 0,
            background: "rgba(0,0,0,0.35)",
            zIndex: 999,
          }}
        />
      )}

      {/* Sidebar */}
      <aside
        style={{
          position: "fixed",
          top: 0,
          left: open ? 0 : "-320px",
          width: "300px",
          height: "100vh",
          background: "#fff",
          borderRight: "1px solid #ddd",
          transition: "left .3s ease",
          zIndex: 1000,
          display: "flex",
          flexDirection: "column",
          boxShadow: "2px 0 15px rgba(0,0,0,.15)",
        }}
      >
        {/* Header */}
        <div
          style={{
            padding: "20px",
            borderBottom: "1px solid #eee",
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
          }}
        >
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: "10px",
            }}
          >
            <BookOpen size={20} />
            <h2
              style={{
                margin: 0,
                fontSize: "18px",
                fontWeight: 700,
                color:"black"
              }}
            >
              Chapters
            </h2>
          </div>

          <button
            onClick={onClose}
            style={{
              border: "none",
              background: "transparent",
              cursor: "pointer",
            }}
          >
            <X size={20} />
          </button>
        </div>

        {/* Chapters */}
        <div
          style={{
            flex: 1,
            overflowY: "auto",
          }}
        >
          {chapters.length === 0 ? (
            <p
              style={{
                padding: "20px",
                color: "#666",
              }}
            >
              No chapters found.
            </p>
          ) : (
            chapters.map((chapter, index) => (
              <button
                key={index}
                onClick={() => {
                  onSelectChapter(chapter.pageIndex);
                  onClose();
                }}
                style={{
                  width: "100%",
                  textAlign: "left",
                  padding: "16px 20px",
                  border: "none",
                  borderBottom: "1px solid #f3f3f3",
                  background:
                    pageIndex === chapter.pageIndex ? "#f5f5f5" : "#fff",
                  cursor: "pointer",
                  transition: ".2s",
                }}
              >
                <div
                  style={{
                    fontWeight: pageIndex === chapter.pageIndex ? 700 : 500,
                  }}
                >
                  {chapter.title}
                </div>

                <div
                  style={{
                    marginTop: "4px",
                    fontSize: "12px",
                    color: "#777",
                  }}
                >
                  Page {chapter.pageIndex + 1}
                </div>
              </button>
            ))
          )}
        </div>
      </aside>
    </>
  );
}
