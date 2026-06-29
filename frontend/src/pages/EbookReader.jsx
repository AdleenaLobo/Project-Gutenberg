import React from "react";
import { useState, useEffect, useRef } from "react";
import {
  ArrowLeft,
  Bookmark,
  NotebookPen,
  Users,
  ChevronLeft,
  ChevronRight,
  BookOpen,
  X,
} from "lucide-react";

const CHARS_PER_PAGE = 2800;

function paginateText(text) {
  if (!text) return [""];
  const pages = [];
  for (let i = 0; i < text.length; i += CHARS_PER_PAGE) {
    pages.push(text.slice(i, i + CHARS_PER_PAGE));
  }
  return pages;
}

export function EbookReader({ book, client, onBack }) {
  const [pages, setPages] = useState([]);
  const [pageIndex, setPageIndex] = useState(0);
  const [showPanel, setShowPanel] = useState(null); // null | "notes" | "bookmarks" | "room"
  const [rooms, setRooms] = useState([]);
  const [activeRoom, setActiveRoom] = useState(null);
  const [roomData, setRoomData] = useState(null);
  const [noteBody, setNoteBody] = useState("");
  const [bookmarkLabel, setBookmarkLabel] = useState("");
  const [msg, setMsg] = useState("");
  const textRef = useRef(null);

  useEffect(() => {
    setPages(paginateText(book.ebook_text));
  }, [book]);

  useEffect(() => {
    client
      .request("/rooms")
      .then(setRooms)
      .catch(() => {});
  }, []);

  useEffect(() => {
    if (activeRoom) loadRoom();
  }, [activeRoom]);

  async function loadRoom() {
    try {
      const data = await client.request("/rooms/" + activeRoom);
      setRoomData(data);
    } catch (e) {
      setMsg(e.message);
    }
  }

  async function createRoom() {
    try {
      const room = await client.request("/rooms", {
        method: "POST",
        body: JSON.stringify({
          book_id: book.id,
          name: book.title + " reading room",
        }),
      });
      setActiveRoom(room.id);
      const updated = await client.request("/rooms");
      setRooms(updated);
    } catch (e) {
      setMsg(e.message);
    }
  }

  async function joinRoom(id) {
    try {
      await client.request("/rooms/" + id + "/join", { method: "POST" });
      setActiveRoom(id);
    } catch (e) {
      setMsg(e.message);
    }
  }

  async function addNote(e) {
    e.preventDefault();
    try {
      await client.request("/rooms/" + activeRoom + "/notes", {
        method: "POST",
        body: JSON.stringify({
          location: `Page ${pageIndex + 1}`,
          body: noteBody,
        }),
      });
      setNoteBody("");
      await loadRoom();
    } catch (e) {
      setMsg(e.message);
    }
  }

  async function addBookmark(e) {
    e.preventDefault();
    try {
      await client.request("/rooms/" + activeRoom + "/bookmarks", {
        method: "POST",
        body: JSON.stringify({
          location: `Page ${pageIndex + 1}`,
          label: bookmarkLabel,
        }),
      });
      setBookmarkLabel("");
      await loadRoom();
    } catch (e) {
      setMsg(e.message);
    }
  }

  const bookRooms = rooms.filter(
    (r) => r.book_id === book.id || r.title === book.title,
  );
  const currentPage = pages[pageIndex] || "";
  const totalPages = pages.length;

  return (
    <div className="reader-shell">
      {/* Top bar */}
      <header className="reader-topbar">
        <button className="reader-back" onClick={onBack}>
          <ArrowLeft size={16} />
          Back to library
        </button>
        <div className="reader-title-area">
          <BookOpen size={16} className="reader-title-icon" />
          <span className="reader-book-title">{book.title}</span>
          <span className="reader-book-author">— {book.author}</span>
        </div>
        <div className="reader-actions">
          <button
            className={`reader-action-btn ${showPanel === "room" ? "active" : ""}`}
            onClick={() => setShowPanel(showPanel === "room" ? null : "room")}
            title="Collaborative room"
          >
            <Users size={16} />
          </button>
          {activeRoom && (
            <>
              <button
                className={`reader-action-btn ${showPanel === "notes" ? "active" : ""}`}
                onClick={() =>
                  setShowPanel(showPanel === "notes" ? null : "notes")
                }
                title="Notes"
              >
                <NotebookPen size={16} />
              </button>
              <button
                className={`reader-action-btn ${showPanel === "bookmarks" ? "active" : ""}`}
                onClick={() =>
                  setShowPanel(showPanel === "bookmarks" ? null : "bookmarks")
                }
                title="Bookmarks"
              >
                <Bookmark size={16} />
              </button>
            </>
          )}
        </div>
      </header>

      <div className="reader-body">
        {/* Book page */}
        <div className="reader-main">
          <div className="book-page-wrap">
            {/* Page shadow / spine effect */}
            <div className="book-spine" />
            <div className="book-page" ref={textRef}>
              <div className="page-header">
                <span className="page-book-name">{book.title}</span>
                <span className="page-num">
                  Page {pageIndex + 1} of {totalPages}
                </span>
              </div>
              <div className="page-rule" />
              <p className="page-text">{currentPage}</p>
              <div className="page-rule bottom" />
              <div className="page-footer">
                <span>{book.author}</span>
                <span>{book.ebook_source}</span>
              </div>
            </div>
          </div>

          {/* Pagination */}
          <div className="page-controls">
            <button
              className="page-btn"
              disabled={pageIndex === 0}
              onClick={() => setPageIndex((p) => p - 1)}
            >
              <ChevronLeft size={18} /> Previous
            </button>
            <div className="page-dots">
              {Array.from({ length: Math.min(totalPages, 7) }, (_, i) => {
                const idx =
                  totalPages <= 7 ? i : Math.round((i / 6) * (totalPages - 1));
                return (
                  <button
                    key={i}
                    className={`dot ${pageIndex === idx ? "active" : ""}`}
                    onClick={() => setPageIndex(idx)}
                  />
                );
              })}
            </div>
            <button
              className="page-btn"
              disabled={pageIndex >= totalPages - 1}
              onClick={() => setPageIndex((p) => p + 1)}
            >
              Next <ChevronRight size={18} />
            </button>
          </div>
        </div>

        {/* Side panel */}
        {showPanel && (
          <aside className="reader-panel">
            <div className="panel-header">
              <h3>
                {showPanel === "room" && "Reading rooms"}
                {showPanel === "notes" && "Notes"}
                {showPanel === "bookmarks" && "Bookmarks"}
              </h3>
              <button className="icon" onClick={() => setShowPanel(null)}>
                <X size={16} />
              </button>
            </div>

            {msg && <p className="notice">{msg}</p>}

            {showPanel === "room" && (
              <div className="panel-content">
                {!activeRoom ? (
                  <>
                    <p className="panel-hint">
                      Join or start a room to take notes and add bookmarks with
                      others.
                    </p>
                    <button
                      className="primary w-full mb-4"
                      onClick={createRoom}
                    >
                      + Start a room for this book
                    </button>
                    {bookRooms.length > 0 && (
                      <>
                        <p className="panel-section-label">Existing rooms</p>
                        {bookRooms.map((r) => (
                          <button
                            key={r.id}
                            className="room-item"
                            onClick={() => joinRoom(r.id)}
                          >
                            <span className="room-item-name">{r.name}</span>
                            <span className="room-item-meta">
                              {r.member_count} readers
                            </span>
                          </button>
                        ))}
                      </>
                    )}
                  </>
                ) : (
                  <div>
                    <div className="room-joined-badge">
                      <Users size={14} />
                      {roomData
                        ? roomData.members.map((m) => m.name).join(", ")
                        : "Loading..."}
                    </div>
                    <p className="panel-hint mt-2">
                      You're in a room. Use the notes and bookmarks panels to
                      collaborate.
                    </p>
                    <button
                      className="secondary w-full mt-2"
                      onClick={() => {
                        setActiveRoom(null);
                        setRoomData(null);
                      }}
                    >
                      Leave room
                    </button>
                  </div>
                )}
              </div>
            )}

            {showPanel === "notes" && activeRoom && (
              <div className="panel-content">
                <form onSubmit={addNote} className="mb-4">
                  <p className="panel-section-label">
                    New note — Page {pageIndex + 1}
                  </p>
                  <textarea
                    rows="3"
                    placeholder="Write a note about this page..."
                    value={noteBody}
                    onChange={(e) => setNoteBody(e.target.value)}
                  />
                  <button className="primary w-full flex items-center justify-center gap-2">
                    <NotebookPen size={14} /> Save note
                  </button>
                </form>
                <p className="panel-section-label">All notes</p>
                {roomData?.notes?.length === 0 && (
                  <p className="panel-empty">No notes yet.</p>
                )}
                {roomData?.notes?.map((n) => (
                  <div key={n.id} className="panel-item">
                    <span className="panel-item-loc">{n.location}</span>
                    <p className="panel-item-body">{n.body}</p>
                    <span className="panel-item-user">— {n.user_name}</span>
                  </div>
                ))}
              </div>
            )}

            {showPanel === "bookmarks" && activeRoom && (
              <div className="panel-content">
                <form onSubmit={addBookmark} className="mb-4">
                  <p className="panel-section-label">
                    Bookmark page {pageIndex + 1}
                  </p>
                  <input
                    placeholder="Label for this bookmark"
                    value={bookmarkLabel}
                    onChange={(e) => setBookmarkLabel(e.target.value)}
                  />
                  <button className="secondary w-full flex items-center justify-center gap-2">
                    <Bookmark size={14} /> Add bookmark
                  </button>
                </form>
                <p className="panel-section-label">All bookmarks</p>
                {roomData?.bookmarks?.length === 0 && (
                  <p className="panel-empty">No bookmarks yet.</p>
                )}
                {roomData?.bookmarks?.map((b) => (
                  <div key={b.id} className="panel-item">
                    <span className="panel-item-loc">{b.location}</span>
                    <p className="panel-item-body">{b.label}</p>
                    <span className="panel-item-user">— {b.user_name}</span>
                  </div>
                ))}
              </div>
            )}
          </aside>
        )}
      </div>
    </div>
  );
}
