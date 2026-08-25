import React, { useState } from "react";
import { ArrowRight, Heart, BookOpen, Users } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { CategoryFilters } from "../components/CategoryFilters";
import { CategoryFiltersSkeleton } from "../components/CategoryFiltersSkeleton";
import { BookGrid } from "../components/BookGrid";
import DashboardBookmarks from "../components/bookmarks/DashboardBookmarks";
import { getLocalCover } from "../utils/ebookParser";

export function User({ 
  client, 
  books = [], 
  rooms = [], 
  bookmarksCount = 0, 
  setBookmarksCount,
  activeTab = "ebooks", 
  setActiveTab = () => {},
  searchQuery = "", 
  loading = false,
  msg = "",
  setMsg = () => {},
  favorites = [],
  toggleFavorite = () => {}
}) {
  const navigate = useNavigate();
  const [selectedCategory, setSelectedCategory] = useState("All");

  // Retrieve the currently reading book ID from localStorage
  const currentlyReadingId = localStorage.getItem("currentlyReadingBookId") || null;

  // Handler to navigate to book detail route
  const handleSelectBook = (book) => {
    navigate(`/books/${book.id}`);
  };

  // Derived Data Layouts
  const ebooks = books.filter((b) => b.type === "ebook");

  const currentlyReadingBook = ebooks.find((b) => String(b.id) === String(currentlyReadingId)) || ebooks[0];

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
    <div className="min-h-full bg-[#FCFBFA]">
      <div className="max-w-6xl mx-auto px-6 py-8">
        {msg && (
          <p className="bg-red-50 text-red-655 border border-red-200 p-4 mb-6 text-base rounded-xl">
            {msg}
          </p>
        )}

        {/* ── Widgets side-by-side (Dashboard view) ── */}
        {activeTab === "ebooks" && loading && (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-10">
            {/* Currently Reading Widget Skeleton */}
            <div className="border border-[#EAD8D8] bg-[#FAF2F2] p-6 rounded-2xl shadow-sm relative flex flex-col sm:flex-row justify-between gap-6">
              <div className="flex-1 flex flex-col justify-between min-w-0 pr-6">
                <div>
                  <div className="h-3 w-32 bg-[#EAD8D8] rounded animate-pulse mb-4"></div>
                  <div className="h-7 w-3/4 bg-[#EAD8D8] rounded animate-pulse mb-3"></div>
                  <div className="h-4 w-1/2 bg-[#EAD8D8] rounded animate-pulse mb-6"></div>
                  <div className="h-2 w-full bg-[#EAD8D8] rounded animate-pulse"></div>
                </div>
                <div className="mt-6 h-10 w-24 bg-[#EAD8D8] rounded-lg animate-pulse"></div>
              </div>
              <div className="relative w-full sm:w-[130px] aspect-[3/4] sm:h-[170px] bg-[#EAD8D8] rounded-xl overflow-hidden shadow-md flex-shrink-0 animate-pulse"></div>
            </div>

            {/* Recently Visited Rooms Widget Skeleton */}
            <div className="border border-[#EAD8D8] bg-[#FAF2F2] p-6 rounded-2xl shadow-sm flex flex-col justify-between">
              <div className="h-full flex flex-col justify-between">
                <div className="flex items-center gap-2 mb-6">
                  <div className="h-4 w-4 bg-[#EAD8D8] rounded-full animate-pulse"></div>
                  <div className="h-3 w-40 bg-[#EAD8D8] rounded animate-pulse"></div>
                </div>
                <div className="flex flex-col gap-4 mt-4">
                  {[1, 2, 3].map(i => (
                    <div key={i} className="flex justify-between items-center pb-3 border-b border-[#EAD8D8] last:border-0">
                      <div className="h-4 w-1/2 bg-[#EAD8D8] rounded animate-pulse"></div>
                      <div className="h-3 w-16 bg-[#EAD8D8] rounded animate-pulse"></div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}

        {activeTab === "ebooks" && !loading && ebooks.length > 0 && (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-10">
            {/* Currently Reading Widget */}
            {currentlyReadingBook && (
              <div className="border border-[#EAD8D8] bg-[#FAF2F2] p-6 rounded-2xl shadow-sm relative flex flex-col sm:flex-row justify-between gap-6 hover:shadow-md transition-shadow duration-300">
                <div className="flex-1 flex flex-col justify-between min-w-0">
                  <div>
                    <div className="flex items-center gap-1.5 text-[#851C1C] font-semibold text-xs uppercase tracking-wider">
                      <span>Currently Reading</span>
                    </div>
                    <h3 className="font-serif font-bold text-2xl text-zinc-900 mt-3 line-clamp-2">
                      {currentlyReadingBook.title}
                    </h3>
                    <p className="text-zinc-500 text-sm mt-1">
                      by {currentlyReadingBook.author}
                    </p>
                    {(() => {
                      const progressStr = localStorage.getItem(`bookProgress_${currentlyReadingBook.id}`);
                      if (progressStr) {
                        try {
                          const { pageIndex, totalPages } = JSON.parse(progressStr);
                          if (totalPages > 0) {
                            const pagesRead = pageIndex;
                            const pagesLeft = Math.max(0, totalPages - pagesRead - 1);
                            const percent = Math.round((pagesRead / totalPages) * 100);
                            return (
                              <div className="mt-4 flex flex-col gap-1.5 max-w-[250px]">
                                <div className="flex items-center justify-between text-xs font-medium text-zinc-500">
                                  <span>{pagesRead} pages read</span>
                                  <span>{pagesLeft} pages left</span>
                                </div>
                                <div className="w-full bg-zinc-200/80 rounded-full h-1.5 overflow-hidden">
                                  <div className="bg-[#851C1C] h-full rounded-full transition-all duration-300" style={{ width: `${percent}%` }}></div>
                                </div>
                              </div>
                            );
                          }
                        } catch(e) {}
                      }
                      return null;
                    })()}
                  </div>

                  <div className="mt-6">
                    <button
                      onClick={() => navigate(`/books/${currentlyReadingBook.id}/read`)}
                      className="h-10 px-5 flex items-center justify-center gap-2 bg-[#851C1C] hover:bg-[#6b1616] text-white font-medium text-sm rounded-lg transition-all duration-200 cursor-pointer shadow-sm focus:outline-none border-none animate-scale-up"
                    >
                      <BookOpen size={16} />
                      <span>Read</span>
                    </button>
                  </div>
                </div>

                <div className="relative w-full sm:w-[130px] aspect-[3/4] sm:h-[170px] bg-zinc-50 rounded-xl overflow-hidden shadow-md flex-shrink-0 border border-zinc-100 mx-auto sm:mx-0">
                  {getLocalCover(currentlyReadingBook.title, currentlyReadingBook.ebook?.cover_image_url || currentlyReadingBook.cover_image_url) ? (
                    <img
                      src={getLocalCover(currentlyReadingBook.title, currentlyReadingBook.ebook?.cover_image_url || currentlyReadingBook.cover_image_url)}
                      alt={currentlyReadingBook.title}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="w-full h-full bg-gradient-to-br from-zinc-100 to-zinc-200 flex flex-col justify-center p-3 text-center">
                      <span className="font-serif font-bold text-xs text-zinc-800 line-clamp-3">{currentlyReadingBook.title}</span>
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* Recently Visited Rooms Widget */}
            <div className="border border-[#EAD8D8] bg-[#FAF2F2] p-6 rounded-2xl shadow-sm flex flex-col justify-between hover:shadow-md transition-shadow duration-300">
              <div className="h-full flex flex-col justify-between">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-1.5 text-[#851C1C] font-semibold text-xs uppercase tracking-wider">
                    <Users size={14} />
                    <span>Recently Visited Rooms</span>
                  </div>
                  <button
                    onClick={() => setActiveTab("rooms")}
                    className="text-xs font-semibold text-[#851C1C] hover:text-[#6b1616] flex items-center gap-1 transition-colors bg-transparent border-none p-0 cursor-pointer focus:outline-none"
                  >
                    <span>View all rooms</span>
                    <ArrowRight size={12} />
                  </button>
                </div>

                <div className="mt-4 flex flex-col gap-3.5 flex-1 justify-center">
                  {rooms.length === 0 ? (
                    <p className="text-sm text-zinc-400 italic py-4">No rooms joined yet.</p>
                  ) : (
                    rooms.slice(0, 3).map((r) => (
                      <div 
                        key={r.id} 
                        onClick={() => {
                          const book = books.find((b) => b.id === r.book_id || b.title === r.title);
                          if (book) {
                            navigate(`/books/${book.id}/read`, { state: { joinRoomId: r.id } });
                          } else {
                            setMsg("Could not find the ebook for this room.");
                          }
                        }}
                        className="flex items-center justify-between pb-3 border-b border-zinc-100 last:border-0 cursor-pointer group"
                      >
                        <div className="min-w-0 pr-4">
                          <span className="font-serif font-semibold text-sm text-zinc-800 truncate block group-hover:text-[#851C1C] transition-colors">
                            {r.name}
                          </span>
                        </div>
                        <span className="text-xs text-zinc-500 flex-shrink-0">
                          {r.member_count} {r.member_count === 1 ? "member" : "members"}
                        </span>
                      </div>
                    ))
                  )}
                </div>
              </div>
            </div>
          </div>
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
              favorites={favorites}
              toggleFavorite={toggleFavorite}
            />
          </>
        )}

        {/* ── Favourites tab ── */}
        {activeTab === "favorites" && (
          <>
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-serif font-bold text-zinc-900">Your Favourites</h2>
              <span className="text-zinc-500 text-sm font-medium">{books.filter((b) => favorites.includes(b.id)).length} books</span>
            </div>
            <BookGrid
              books={books.filter((b) => favorites.includes(b.id))}
              isEbook={true}
              onAction={() => {}}
              onSelectBook={handleSelectBook}
              emptyMessage="No favorites added yet. Click the heart icon on any book cover to add it here."
              loading={loading}
              favorites={favorites}
              toggleFavorite={toggleFavorite}
            />
          </>
        )}

        {/* ── Rooms tab ── */}
        {activeTab === "rooms" && (
          <>
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-serif font-bold text-zinc-900">Reading Rooms</h2>
            </div>
            {filteredRooms.length === 0 ? (
              <div className="flex flex-col items-center justify-center p-12 border border-dashed border-zinc-200 bg-white rounded-2xl text-center">
                <p className="text-base font-semibold text-zinc-500">
                  {rooms.length === 0 ? "No reading rooms yet" : "No reading rooms match search query"}
                </p>
              </div>
            ) : (
              <div className="grid grid-cols-1 gap-4 animate-fade-in w-full">
                {filteredRooms.map((r) => {
                  const book = ebooks.find((b) => b.id === r.book_id || b.title === r.title);
                  return (
                    <div
                      key={r.id}
                      className="group flex items-center justify-between p-5 border border-[#EAD8D8] bg-[#FAF2F2] cursor-pointer transition-all duration-300 rounded-2xl hover:-translate-y-0.5 hover:shadow-sm w-full"
                      onClick={() =>
                        book
                          ? navigate(`/books/${book.id}/read`, { state: { joinRoomId: r.id } })
                          : setMsg("Could not find the ebook for this room.")
                      }
                    >
                      <div>
                        <div className="font-serif font-bold text-base text-zinc-900 group-hover:text-[#851C1C] transition-colors">
                          {r.name}
                        </div>
                        <div className="text-sm text-zinc-500 mt-1">
                          {r.member_count} {r.member_count === 1 ? "reader" : "readers"}
                        </div>
                      </div>
                      <ArrowRight size={15} className="text-zinc-400 group-hover:text-[#851C1C] group-hover:translate-x-0.5 transition-all" />
                    </div>
                  );
                })}
              </div>
            )}
          </>
        )}

        {/* ── Bookmarks tab ── */}
        {activeTab === "bookmarks" && (
          <>
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-serif font-bold text-zinc-900">Your Bookmarks</h2>
            </div>
            <DashboardBookmarks
              client={client}
              onBookmarkDeleted={() => setBookmarksCount((c) => Math.max(0, c - 1))}
            />
          </>
        )}
      </div>
    </div>
  );
}
