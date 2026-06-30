import React, { useState, useEffect } from "react";
import { ArrowRight, RefreshCw, Search } from "lucide-react";
import { useNavigate } from "react-router-dom";
// import { EbookReader } from "./EbookReader"; // EbookReader moved to separate route
import { CategoryFilters } from "../components/CategoryFilters";
import { CategoryFiltersSkeleton } from "../components/CategoryFiltersSkeleton";
import { SearchBarSkeleton } from "../components/SearchBarSkeleton";
import { BookGrid } from "../components/BookGrid";

export function User({ client }) {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [books, setBooks] = useState([]);
  const [rooms, setRooms] = useState([]);
  const [msg, setMsg] = useState("");
  const [activeTab, setActiveTab] = useState("ebooks");
  const [selectedCategory, setSelectedCategory] = useState("All");

  // ── New State for Search Filter ──
  const [searchQuery, setSearchQuery] = useState("");

  // Handler to navigate to book detail route
  const handleSelectBook = (book) => {
    navigate(`/books/${book.id}`);
  };

  async function load() {
    setLoading(true);
    try {
      const [b, r] = await Promise.all([
        client.request("/books"),
        client.request("/rooms"),
      ]);
      setBooks(b);
      setRooms(r);
    } catch (e) {
      setMsg(e.message);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    load();
  }, []);


  
  // ── Derived Data Layouts ──
  const ebooks = books.filter((b) => b.type === "ebook");

  // Helper to check match on title or author
  const matchesSearch = (b) => {
    const query = searchQuery.toLowerCase().trim();
    if (!query) return true;
    return (
      b.title.toLowerCase().includes(query) ||
      b.author.toLowerCase().includes(query)
    );
  };

  // Filtered Arrays combining both Category Selection & Search Query
const filteredEbooks = ebooks
  .filter(
    (b) =>
      selectedCategory === "All" ||
      (b.ebook?.category || "Uncategorized").toLowerCase().trim() ===
        selectedCategory.toLowerCase().trim(),
  )
  .filter(matchesSearch);

  const tabs = [
    { id: "ebooks", label: "Ebooks", count: ebooks.length },
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
            // ── PLACE THE UPDATE HERE ──
            onClick={() => {
              setActiveTab(t.id);
              setMsg("");
              setSearchQuery(""); // Clears search input on tab change
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

        {/* ── Monochrome Search Bar Integration (Shows for Ebooks & Hardcovers) ── */}
        {(activeTab === "ebooks" || activeTab === "hardcovers") && (
          loading ? (
            <SearchBarSkeleton />
          ) : (
            <div
              style={{
                display: "flex",
                alignItems: "center",
                border: "1px solid #000",
                padding: "8px 14px",
                marginBottom: "24px",
                background: "#fff",
              }}
            >
              <Search size={16} style={{ color: "#000", marginRight: "10px" }} />
              <input
                type="text"
                placeholder="Search titles or authors..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                style={{
                  width: "100%",
                  border: "none",
                  outline: "none",
                  fontSize: "14px",
                  color: "#000",
                  background: "transparent",
                }}
              />
            </div>
          )
        )}

        {/* ── Ebooks tab ── */}
        {activeTab === "ebooks" && (
          <>
              {/* Show CategoryFilters only when there are any ebooks */}
            {loading ? (
              <CategoryFiltersSkeleton />
            ) : (
              ebooks.length > 0 && (
                <CategoryFilters selectedCategory={selectedCategory} onSelectCategory={setSelectedCategory} ebooks={ebooks} />
              )
            )}
            <BookGrid
              books={filteredEbooks}
              isEbook={true}
              onAction={() => {}}
              onSelectBook={handleSelectBook}
              emptyMessage={loading ? "" : (ebooks.length === 0 ? "No ebooks yet. Ask an admin to add some." : "No ebooks match search parameters.")}
              loading={loading}
            />
          </>
        )}
        {/* ── Rooms tab ── */}
        {activeTab === "rooms" && (
          <>
            <p className="section-label">{rooms.length} active rooms</p>
            {rooms.length === 0 ? (
              <div className="empty-state"><p className="empty-state-title">No reading rooms yet</p></div>
            ) : (
              <div className="rooms-list">
                {rooms.map((r) => {
                  const book = ebooks.find((b) => b.id === r.book_id || b.title === r.title);
                  return (
                    <div key={r.id} className="room-card" onClick={() => book ? setOpenBook({ ...book, _joinRoomId: r.id }) : setMsg("Could not find the ebook for this room.")}>
                      <div className="room-card-left">
                        <div className="room-card-name">{r.name}</div>
                        <div className="room-card-meta">{r.member_count} readers · {r.title}</div>
                      </div>
                      <ArrowRight size={15} className="room-card-arrow" />
                    </div>
                  );
                })}
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}
