import React, { useState, useEffect } from "react";
import { BookOpen, Bookmark, Users, ArrowRight, RefreshCw } from "lucide-react";
import { EbookReader } from "./EbookReader";

export function User({ client }) {
  const [books, setBooks] = useState([]);
  const [leases, setLeases] = useState([]);
  const [rooms, setRooms] = useState([]);
  const [msg, setMsg] = useState("");
  const [openBook, setOpenBook] = useState(null);
  const [activeTab, setActiveTab] = useState("ebooks");

  async function load() {
    try {
      const [b, l, r] = await Promise.all([
        client.request("/books"),
        client.request("/my-leases"),
        client.request("/rooms"),
      ]);
      setBooks(b);
      setLeases(l);
      setRooms(r);
    } catch (e) {
      setMsg(e.message);
    }
  }

  useEffect(() => {
    load();
  }, []);

  async function lease(id) {
    try {
      await client.request("/leases", {
        method: "POST",
        body: JSON.stringify({ book_id: id }),
      });
      setMsg("Book leased.");
      await load();
    } catch (e) {
      setMsg(e.message);
    }
  }

  async function ret(id) {
    try {
      await client.request("/leases/" + id + "/return", { method: "POST" });
      await load();
    } catch (e) {
      setMsg(e.message);
    }
  }

  if (openBook) {
    return (
      <EbookReader
        book={openBook}
        client={client}
        onBack={() => setOpenBook(null)}
      />
    );
  }

  const ebooks = books.filter((b) => b.type === "ebook");
  const hardcovers = books.filter((b) => b.type === "hardcover");
  const activeLeases = leases.filter((l) => !l.returned_at);

  const tabs = [
    { id: "ebooks", label: "Ebooks", count: ebooks.length },
    { id: "hardcovers", label: "Hardcovers", count: hardcovers.length },
    { id: "leases", label: "My leases", count: activeLeases.length },
    { id: "rooms", label: "Rooms", count: rooms.length },
  ];

  return (
    <div>
      {/* Tab bar */}
      <nav className="tab-nav">
        {tabs.map((t) => (
          <button
            key={t.id}
            className={`tab-btn ${activeTab === t.id ? "active" : ""}`}
            onClick={() => {
              setActiveTab(t.id);
              setMsg("");
            }}
          >
            {t.label}
            {t.count > 0 && <span className="tab-count">{t.count}</span>}
          </button>
        ))}
        <button
          className="tab-btn"
          style={{ marginLeft: "auto" }}
          onClick={load}
          title="Refresh"
        >
          <RefreshCw size={13} />
        </button>
      </nav>

      <div className="page-content">
        {msg && <p className="notice">{msg}</p>}

        {/* ── Ebooks tab ── */}
        {activeTab === "ebooks" && (
          <>
            <p className="section-label">{ebooks.length} titles available</p>
            {ebooks.length === 0 ? (
              <div className="empty-state">
                <p className="empty-state-title">No ebooks yet</p>
                <p className="empty-state-sub">Ask an admin to add some.</p>
              </div>
            ) : (
              <div className="books-grid">
                {ebooks.map((b) => (
                  <div className="book-card" key={b.id}>
                    <span className="book-type-tag">
                      Ebook · {b.ebook_source || "Library"}
                    </span>
                    <span className="book-title">{b.title}</span>
                    <span className="book-author">{b.author}</span>
                    <div className="book-footer">
                      <span className="book-copies"></span>
                      <button
                        className="btn-read"
                        onClick={() => setOpenBook(b)}
                      >
                        Read
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </>
        )}

        {/* ── Hardcovers tab ── */}
        {activeTab === "hardcovers" && (
          <>
            <p className="section-label">
              {hardcovers.length} titles in collection
            </p>
            {hardcovers.length === 0 ? (
              <div className="empty-state">
                <p className="empty-state-title">No hardcovers yet</p>
                <p className="empty-state-sub">Ask an admin to add some.</p>
              </div>
            ) : (
              <div className="books-grid">
                {hardcovers.map((b) => (
                  <div className="book-card" key={b.id}>
                    <span className="book-type-tag">Hardcover</span>
                    <span className="book-title">{b.title}</span>
                    <span className="book-author">{b.author}</span>
                    <div className="book-footer">
                      <span
                        className={`book-copies ${b.available_copies < 2 ? "low" : ""}`}
                      >
                        {b.available_copies} of {b.total_copies} available
                      </span>
                      <button
                        className="btn-lease"
                        disabled={b.available_copies < 1}
                        onClick={() => lease(b.id)}
                      >
                        Lease
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </>
        )}

        {/* ── Leases tab ── */}
        {activeTab === "leases" && (
          <>
            <p className="section-label">
              {leases.length} total · {activeLeases.length} active
            </p>
            {leases.length === 0 ? (
              <div className="empty-state">
                <p className="empty-state-title">No leases yet</p>
                <p className="empty-state-sub">
                  Lease a hardcover to see it here.
                </p>
              </div>
            ) : (
              <div className="leases-list">
                {leases.map((l) => (
                  <div className="lease-row" key={l.id}>
                    <span className="lease-title">{l.title}</span>
                    <div
                      style={{ display: "flex", alignItems: "center", gap: 12 }}
                    >
                      {l.returned_at ? (
                        <span className="lease-status-returned">Returned</span>
                      ) : (
                        <span className="lease-status-active">Active</span>
                      )}
                      {!l.returned_at && (
                        <button
                          className="btn-return"
                          onClick={() => ret(l.id)}
                        >
                          Return
                        </button>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </>
        )}

        {/* ── Rooms tab ── */}
        {activeTab === "rooms" && (
          <>
            <p className="section-label">{rooms.length} active rooms</p>
            {rooms.length === 0 ? (
              <div className="empty-state">
                <p className="empty-state-title">No reading rooms yet</p>
                <p className="empty-state-sub">Open an ebook and start one.</p>
              </div>
            ) : (
              <div className="rooms-list">
                {rooms.map((r) => (
                  <div className="room-card" key={r.id}>
                    <div className="room-card-left">
                      <div className="room-card-name">{r.name}</div>
                      <div className="room-card-meta">
                        {r.member_count} readers · {r.title}
                      </div>
                    </div>
                    <ArrowRight size={15} className="room-card-arrow" />
                  </div>
                ))}
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}
