import React, { useMemo, useState } from "react";
import { X, BookOpen, ChevronRight, Plus } from "lucide-react";

export default function ChapterSidebar({
  open,
  chapters,
  bookmarks = [],
  pageIndex,
  onClose,
  onSelectChapter
}) {
  const [activeTab, setActiveTab] = useState("contents");

  return (
    <>
      {/* Overlay */}
      <div
        onClick={onClose}
        style={{
          position: "fixed",
          top: "80px",
          left: 0,
          right: 0,
          bottom: 0,
          background: "transparent", // No dark overlay
          opacity: open ? 1 : 0,
          pointerEvents: open ? "auto" : "none",
          transition: ".25s",
          zIndex: 20,
        }}
      />

      {/* Sidebar */}
      <aside
        style={{
          position: "fixed",
          top: "53px",
          left: 0, // Always 0
          width: "340px",
          height: "calc(100vh - 80px)",
          transform: open ? "translateX(0)" : "translateX(-100%)",
          transition: "transform 300ms cubic-bezier(.22,1,.36,1)",
          background: "#fff",
          borderRight: "1px solid #e5e5e5",
          display: "flex",
          flexDirection: "column",
          zIndex: 100,
          boxShadow: "none",
          willChange: "transform",
        }}
      >
        {/* Header */}
        <div
          style={{
            display: "flex",
            borderBottom: "1px solid #eee",
          }}
        >
          <button
            onClick={() => setActiveTab("contents")}
            style={{
              flex: 1,
              padding: "16px",
              border: "none",
              background: activeTab === "contents" ? "#f8f8f8" : "#fff",
              fontWeight: activeTab === "contents" ? 700 : 500,
              cursor: "pointer",
              color: "#000",
            }}
          >
            Contents
          </button>

          <button
            onClick={() => setActiveTab("bookmarks")}
            style={{
              flex: 1,
              padding: "16px",
              border: "none",
              background: activeTab === "bookmarks" ? "#f8f8f8" : "#fff",
              fontWeight: activeTab === "bookmarks" ? 700 : 500,
              cursor: "pointer",
              color: "#000",
            }}
          >
            Bookmarks
          </button>

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
        {/* Chapter List */}
        <div
          style={{
            flex: 1,
            overflowY: "auto",
          }}
        >
          {activeTab === "contents" ? (
            <>
              {chapters.length === 0 ? (
                <div
                  style={{
                    padding: 30,
                    color: "#666",
                    textAlign: "center",
                  }}
                >
                  No chapters found
                </div>
              ) : (
                chapters.map((chapter, index) => {
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
                        color: "#000",
                      }}
                    >
                      <div style={{ textAlign: "left" }}>
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
                })
              )}
            </>
          ) : (
            <>
              {bookmarks.length === 0 ? (
                <div
                  style={{
                    padding: 40,
                    textAlign: "center",
                    color: "#888",
                  }}
                >
                  <div style={{ marginTop: 12, fontWeight: 600 }}>
                    No bookmarks yet
                  </div>
                  <div style={{ marginTop: 8, fontSize: 13 }}>
                    Bookmark pages while reading to find them quickly.
                  </div>
                </div>
              ) : (
                bookmarks.map((bookmark) => (
                  <button
                    key={bookmark.id}
                    onClick={() => {
                      onSelectChapter(bookmark.pageIndex);
                      onClose();
                    }}
                    style={{
                      width: "100%",
                      border: "none",
                      background: "#fff",
                      cursor: "pointer",
                      padding: "18px 20px",
                      borderBottom: "1px solid #f1f1f1",
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "center",
                      color: "#000",
                    }}
                  >
                    <div style={{ textAlign: "left" }}>
                      <div
                        style={{
                          fontWeight: 600,
                        }}
                      >
                        {bookmark.label || "Bookmark"}
                      </div>

                      <div
                        style={{
                          marginTop: 4,
                          color: "#777",
                          fontSize: 12,
                        }}
                      >
                        Page {bookmark.pageIndex + 1}
                      </div>
                    </div>

                    <ChevronRight size={18} color="#999" />
                  </button>
                ))
              )}
            </>
          )}
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
          {activeTab === "contents"
            ? `${chapters.length} Chapters`
            : `${bookmarks.length} Bookmarks`}
        </div>
      </aside>
    </>
  );
}
