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
    <div className="min-h-full bg-zinc-50 dark:bg-zinc-950">
            <nav className="flex items-center gap-1 border-b-2 border-zinc-300 dark:border-zinc-700 px-6 bg-white dark:bg-zinc-900 sticky top-0 z-20">
        {tabs.map((t) => (
          <button
            key={t.id}
            className={`px-4 py-3.5 text-sm font-semibold border-b-2 -mb-[2px] transition-all flex items-center gap-1.5 focus:outline-none cursor-pointer ${
              activeTab === t.id
                ? "border-zinc-300 text-zinc-950 dark:border-zinc-700 dark:text-white font-bold"
                : "border-transparent text-zinc-500 hover:text-zinc-950 dark:hover:text-zinc-200"
            }`}
            onClick={() => {
              setActiveTab(t.id);
              setMsg("");
              setSearchQuery("");
            }}
          >
            {t.label}
            {t.count > 0 && (
              <span className="text-[10px] px-2 py-0.5 rounded-lg bg-zinc-950 dark:bg-zinc-50 border border-zinc-300 dark:border-zinc-700 text-white dark:text-zinc-950">
                {t.count}
              </span>
            )}
          </button>
        ))}

        <button
          className="p-2 ml-auto text-zinc-500 hover:text-zinc-950 dark:hover:text-zinc-150 rounded-lg border border-transparent hover:border-zinc-300 dark:hover:border-zinc-700 transition-colors focus:outline-none cursor-pointer"
          onClick={load}
          title="Refresh"
        >
          <RefreshCw size={13} />
        </button>
      </nav>

      <div className="max-w-6xl mx-auto px-6 py-8">
        {msg && (
          <p className="bg-red-50 dark:bg-red-950/10 text-red-655 dark:text-red-400 border-2 border-zinc-300 dark:border-zinc-700 p-4 mb-6 text-sm rounded-none shadow-[4px_4px_0px_#000] dark:shadow-[4px_4px_0px_#fff]">
            {msg}
          </p>
        )}

        {/* ── Monochrome Search Bar Integration ── */}
        {activeTab === "ebooks" && (
          loading ? (
            <SearchBarSkeleton />
          ) : (
            <div className="flex items-center border-2 border-zinc-300 dark:border-zinc-700 bg-white dark:bg-zinc-900 px-4 py-3.5 mb-8 rounded-none">
              <Search size={16} className="text-zinc-500 dark:text-zinc-450 mr-3" />
              <input
                type="text"
                placeholder="Search titles or authors..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full border-none outline-none text-sm text-zinc-950 dark:text-zinc-50 bg-transparent placeholder-zinc-400 dark:placeholder-zinc-650"
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
                <CategoryFilters
                  selectedCategory={selectedCategory}
                  onSelectCategory={setSelectedCategory}
                  ebooks={ebooks}
                />
              )
            )}
            <BookGrid
              books={filteredEbooks}
              isEbook={true}
              onAction={() => {}}
              onSelectBook={handleSelectBook}
              emptyMessage={
                loading
                  ? ""
                  : ebooks.length === 0
                  ? "No ebooks yet. Ask an admin to add some."
                  : "No ebooks match search parameters."
              }
              loading={loading}
            />
          </>
        )}

        {/* ── Rooms tab ── */}
        {activeTab === "rooms" && (
          <>
            <p className="text-xs font-bold text-zinc-500 dark:text-zinc-400 uppercase tracking-wider mb-4 block">
              {rooms.length} active rooms
            </p>
            {rooms.length === 0 ? (
              <div className="flex flex-col items-center justify-center p-12 border-2 border-dashed border-zinc-300 dark:border-zinc-700 bg-white dark:bg-zinc-900 rounded-none text-center">
                <p className="text-sm font-semibold text-zinc-500 dark:text-zinc-450">No reading rooms yet</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {rooms.map((r) => {
                  const book = ebooks.find((b) => b.id === r.book_id || b.title === r.title);
                  return (
                    <div
                      key={r.id}
                      className="group flex items-center justify-between p-6 border-2 border-zinc-300 dark:border-zinc-700 bg-white dark:bg-zinc-900 hover:bg-zinc-50 dark:hover:bg-zinc-800 cursor-pointer shadow-[4px_4px_0px_#000] dark:shadow-[4px_4px_0px_#fff] hover:scale-[1.01] hover:shadow-[6px_6px_0px_#000] dark:hover:shadow-[6px_6px_0px_#fff] transition-all duration-200 rounded-none"
                      onClick={() =>
                        book
                          ? navigate(`/books/${book.id}/read`, { state: { joinRoomId: r.id } })
                          : setMsg("Could not find the ebook for this room.")
                      }
                    >
                      <div>
                        <div className="font-bold text-base text-zinc-950 dark:text-white">
                          {r.name}
                        </div>
                        <div className="text-xs text-zinc-550 dark:text-zinc-450 mt-1">
                          {r.member_count} readers · {r.title}
                        </div>
                      </div>
                      <ArrowRight size={15} className="text-zinc-400 group-hover:text-zinc-950 dark:group-hover:text-white group-hover:translate-x-1 transition-all" />
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
