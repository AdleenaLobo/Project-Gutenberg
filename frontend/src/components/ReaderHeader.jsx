import React from "react";
import {
  ChevronLeft,
  BookOpen,
  Users,
  Bookmark,
  NotebookPen,
} from "lucide-react";

export default function ReaderHeader({
  book,
  pageIndex,
  totalPages,
  activeRoom,
  roomData,
  setShowPanel,
  setShowChapters,
  onBack,
}) {
  return (
    <>
      {/* ---------- Top Header ---------- */}
      <header
        style={{
          height: "72px",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          padding: "0 28px",
          borderBottom: "1px solid #e5e5e5",
          background: "#fff",
          position: "sticky",
          top: 0,
          zIndex: 20,
        }}
      >
        {/* Left */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: "18px",
          }}
        >
          <button
            onClick={onBack}
            style={{
              display: "flex",
              alignItems: "center",
              gap: "8px",
              border: "1px solid #ddd",
              background: "#fff",
              borderRadius: "8px",
              padding: "8px 14px",
              cursor: "pointer",
            }}
          >
            <ChevronLeft size={18} />
            Back
          </button>

          <button
            onClick={() => setShowChapters(true)}
            style={{
              display: "flex",
              alignItems: "center",
              gap: "8px",
              border: "1px solid #ddd",
              background: "#fff",
              borderRadius: "8px",
              padding: "8px 14px",
              cursor: "pointer",
            }}
          >
            <BookOpen size={18} />
            Chapters
          </button>
        </div>

        {/* Center */}
        <div
          style={{
            textAlign: "center",
            flex: 1,
            padding: "0 40px",
          }}
        >
          <div
            style={{
              fontSize: "20px",
              fontWeight: 700,
              color: "#111",
            }}
          >
            {book.title}
          </div>

          <div
            style={{
              marginTop: "4px",
              color: "#666",
              fontSize: "14px",
            }}
          >
            {book.author}
          </div>
        </div>

        {/* Right */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: "10px",
          }}
        >
          <button
            onClick={() => setShowPanel("notes")}
            style={buttonStyle}
            title="Notes"
          >
            <NotebookPen size={18} />
          </button>

          <button
            onClick={() => setShowPanel("bookmarks")}
            style={buttonStyle}
            title="Bookmarks"
          >
            <Bookmark size={18} />
          </button>

          <button
            onClick={() => setShowPanel("room")}
            style={buttonStyle}
            title="Reading Room"
          >
            <Users size={18} />
          </button>
        </div>
      </header>

      {/* ---------- Info Bar ---------- */}

      <div
        style={{
          height: "42px",
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          padding: "0 32px",
          background: "#fafafa",
          borderBottom: "1px solid #eee",
          fontSize: "14px",
          color: "#555",
        }}
      >
        <span>
          Page <strong>{pageIndex + 1}</strong> of <strong>{totalPages}</strong>
        </span>

        {activeRoom ? (
          <span>
            📖 Reading Room • {roomData?.members?.length ?? 0} participant
            {(roomData?.members?.length ?? 0) !== 1 ? "s" : ""}
          </span>
        ) : (
          <span>Reading Solo</span>
        )}
      </div>
    </>
  );
}

const buttonStyle = {
  width: "42px",
  height: "42px",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  borderRadius: "10px",
  border: "1px solid #ddd",
  background: "#fff",
  cursor: "pointer",
};
