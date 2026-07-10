import React, { useState } from "react";
import { ArrowRight } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { CategoryFilters } from "../components/CategoryFilters";
import { CategoryFiltersSkeleton } from "../components/CategoryFiltersSkeleton";
import { BookGrid } from "../components/BookGrid";
import DashboardBookmarks from "../components/bookmarks/DashboardBookmarks";

export function User({ 
  client, 
  books = [], 
  rooms = [], 
  bookmarksCount = 0, 
  setBookmarksCount,
  activeTab = "ebooks", 
  searchQuery = "", 
  loading = false,
  msg = "",
  setMsg = () => {}
}) {
  const navigate = useNavigate();
  const [selectedCategory, setSelectedCategory] = useState("All");

  // Handler to navigate to book detail route
  const handleSelectBook = (book) => {
    navigate(`/books/${book.id}`);
  };

  // Derived Data Layouts
  const ebooks = books.filter((b) => b.type === "ebook");

  const matchesSearch = (b) => {
    const query = searchQuery.toLowerCase().trim();
    if (!query) return true;
    return (
      b.title.toLowerCase().includes(query) ||
      b.author.toLowerCase().includes(query)
    );
  };

  const filteredEbooks = ebooks
    .filter(
      (b) =>
        selectedCategory === "All" ||
        (b.ebook?.category || "Uncategorized").toLowerCase().trim() ===
          selectedCategory.toLowerCase().trim(),
    )
    .filter(matchesSearch);

  const filteredRooms = rooms.filter((r) => {
    const query = searchQuery.toLowerCase().trim();
    if (!query) return true;
    const book = ebooks.find((b) => b.id === r.book_id || b.title === r.title);
    return (
      r.name.toLowerCase().includes(query) ||
      (r.title && r.title.toLowerCase().includes(query)) ||
      (book && (
        book.title.toLowerCase().includes(query) ||
        book.author.toLowerCase().includes(query)
      ))
    );
  });

  return (
    <div className="min-h-full bg-zinc-50 dark:bg-zinc-955">
      <div className="max-w-6xl mx-auto px-6 py-8">
        {msg && (
          <p className="bg-red-50 dark:bg-red-955/10 text-red-655 dark:text-red-400 border-2 border-zinc-300 dark:border-zinc-700 p-4 mb-6 text-base rounded-none shadow-[4px_4px_0px_#000] dark:shadow-[4px_4px_0px_#fff]">
            {msg}
          </p>
        )}

        {/* ── Ebooks tab ── */}
        {activeTab === "ebooks" && (
          <>
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
            {filteredRooms.length === 0 ? (
              <div className="flex flex-col items-center justify-center p-12 border-2 border-dashed border-zinc-300 dark:border-zinc-700 bg-white dark:bg-zinc-900 rounded-none text-center">
                <p className="text-base font-semibold text-zinc-500 dark:text-zinc-455">
                  {rooms.length === 0 ? "No reading rooms yet" : "No reading rooms match search query"}
                </p>
              </div>
            ) : (
              <div className="grid grid-cols-1 gap-6 animate-fade-in w-full">
                {filteredRooms.map((r) => {
                  const book = ebooks.find((b) => b.id === r.book_id || b.title === r.title);
                  return (
                    <div
                      key={r.id}
                      className="group flex items-center justify-between p-6 border-2 border-zinc-300 dark:border-zinc-700 bg-white dark:bg-zinc-900 cursor-pointer transition-all duration-300 ease-out rounded-none hover:-translate-y-1 hover:-translate-x-1 shadow-none hover:shadow-[4px_4px_0px_#000] dark:hover:shadow-[4px_4px_0px_#fff] w-full"
                      onClick={() =>
                        book
                          ? navigate(`/books/${book.id}/read`, { state: { joinRoomId: r.id } })
                          : setMsg("Could not find the ebook for this room.")
                      }
                    >
                      <div>
                        <div className="font-bold text-base text-zinc-955 dark:text-white">
                          {r.name}
                        </div>
                        <div className="text-base text-zinc-550 dark:text-zinc-455 mt-1">
                          {r.member_count} {r.member_count === 1 ? "reader" : "readers"} · {r.title}
                        </div>
                      </div>
                      <ArrowRight size={15} className="text-zinc-400 group-hover:text-zinc-955 dark:group-hover:text-white group-hover:translate-x-1 transition-all" />
                    </div>
                  );
                })}
              </div>
            )}
          </>
        )}

        {/* ── Bookmarks tab ── */}
        {activeTab === "bookmarks" && (
          <DashboardBookmarks
            client={client}
            onBookmarkDeleted={() => setBookmarksCount((c) => Math.max(0, c - 1))}
          />
        )}
      </div>
    </div>
  );
}
