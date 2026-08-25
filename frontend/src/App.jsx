import React, { useState, useEffect, useRef } from "react";
import { BrowserRouter as Router, Routes, Route, Link, useLocation, useNavigate } from "react-router-dom";
import { Library, LogOut, Search, BookOpen, Heart, Bookmark, Compass, ChevronDown, X, Info, Settings as SettingsIcon } from "lucide-react";
import { useClient } from "./hooks/useClient";
import { Login } from "./pages/Login";
import { BookDetail } from "./pages/BookDetail";
import { User } from "./pages/User";
import { Settings } from "./pages/Settings";
import BookReader from "./pages/BookReader";
import "./styles/index.css";

function AppContent({ client, initials, firstName, logout, user, greeting }) {
  const location = useLocation();
  const navigate = useNavigate();
  const isReading = location.pathname.includes("/read");
  const [searchQuery, setSearchQuery] = useState("");
  const [showDropdown, setShowDropdown] = useState(false);
  const [activeTab, setActiveTab] = useState("ebooks");
  const [isSearchFocused, setIsSearchFocused] = useState(false);
  const searchInputRef = useRef(null);

  const [books, setBooks] = useState([]);
  const [rooms, setRooms] = useState([]);
  const [bookmarksCount, setBookmarksCount] = useState(0);
  const [loading, setLoading] = useState(true);
  const [msg, setMsg] = useState("");

  const [favorites, setFavorites] = useState(() => {
    try {
      return JSON.parse(localStorage.getItem("libraryFavorites") || "[]");
    } catch {
      return [];
    }
  });

  const toggleFavorite = (bookId) => {
    setFavorites((prev) => {
      const next = prev.includes(bookId) ? prev.filter((id) => id !== bookId) : [...prev, bookId];
      localStorage.setItem("libraryFavorites", JSON.stringify(next));
      return next;
    });
  };

  const ebooksCount = books.filter((b) => b.type === "ebook").length;

  const handleTabClick = (tabId) => {
    setActiveTab(tabId);
    setSearchQuery("");
    if (location.pathname !== "/") {
      navigate("/");
    }
  };

  async function load() {
    setLoading(true);
    try {
      const [b, r, bm] = await Promise.all([
        client.request("/books"),
        client.request("/rooms"),
        client.request("/bookmarks"),
      ]);
      setBooks(b);
      setRooms(r);
      setBookmarksCount(bm ? bm.length : 0);
    } catch (e) {
      setMsg(e.message);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    load();
  }, []);

  return (
    <div className="flex flex-col h-screen overflow-hidden bg-white dark:bg-zinc-955 text-zinc-900 dark:text-zinc-100">
      {/* Greeting overlay */}
      {greeting && (
        <div
          className={`fixed inset-0 z-[999] flex items-center justify-center bg-white/70 dark:bg-zinc-955/70 backdrop-blur-sm transition-opacity duration-700 ${
            greeting === "fading" ? "opacity-0 pointer-events-none" : "opacity-100"
          }`}
        >
          <div className="flex flex-col items-center gap-2 text-center animate-fade-in">
            <div className="w-14 h-14 rounded-lg bg-zinc-900 dark:bg-zinc-100 text-white dark:text-zinc-900 flex items-center justify-center text-xl font-bold tracking-wider mb-1">
              {initials}
            </div>
            <p className="text-2xl font-bold text-zinc-900 dark:text-zinc-100">Hello, {firstName}</p>
            <p className="text-base text-zinc-500">Welcome back to the library</p>
          </div>
        </div>
      )}

      {/* Hide header if on /books/:id/read route */}
      {!isReading && (
        <header className="flex items-center sm:gap-20 gap-4 px-6 py-2 bg-[#FAF2F2] border-b border-[#EAD8D8] sticky top-0 z-30 flex-shrink-0">
          <Link 
            to="/" 
            onClick={() => {
              setActiveTab("ebooks");
              setSearchQuery("");
            }}
            className=" no-underline text-[#851C1C] font-serif group flex-shrink-0"
          >
            <span className="font-bold text-lg tracking-tight">Bibliotheke</span>
          </Link>

          {/* Tabs in Header: Library, Favourites, Bookmarks, Rooms */}
          <nav className={`sm:flex items-center whitespace-nowrap flex-shrink-0 transition-all duration-300 ease-in-out overflow-hidden ml-[0rem] ${
            isSearchFocused ? "max-w-0 opacity-0 gap-0 pointer-events-none -mr-4 sm:-mr-20 border-none" : "max-w-[500px] opacity-100 gap-9 mr-0"
          }`}>
              <button
                onClick={() => handleTabClick("ebooks")}
                className={`h-9 px-1.5 text-sm transition-all flex items-center focus:outline-none cursor-pointer border-t-2 bg-transparent rounded-none ${
                  activeTab === "ebooks"
                    ? "border-[#851C1C] text-[#851C1C] font-normal"
                    : "border-transparent text-[#851C1C] font-normal"
                }`}
              >
                Library
              </button>

              <button
                onClick={() => handleTabClick("favorites")}
                className={`h-9 px-1.5 text-sm transition-all flex items-center focus:outline-none cursor-pointer border-t-2 bg-transparent rounded-none ${
                  activeTab === "favorites"
                    ? "border-[#851C1C] text-[#851C1C] font-normal"
                    : "border-transparent text-[#851C1C] font-normal"
                }`}
              >
                Favourites
              </button>

              <button
                onClick={() => handleTabClick("bookmarks")}
                className={`h-9 px-1.5 text-sm transition-all flex items-center focus:outline-none cursor-pointer border-t-2 bg-transparent rounded-none ${
                  activeTab === "bookmarks"
                    ? "border-[#851C1C] text-[#851C1C] font-normal"
                    : "border-transparent text-[#851C1C] font-normal"
                }`}
              >
                Bookmarks
              </button>

              <button
                onClick={() => handleTabClick("rooms")}
                className={`h-9 px-1.5 text-sm transition-all flex items-center focus:outline-none cursor-pointer border-t-2 bg-transparent rounded-none ${
                  activeTab === "rooms"
                    ? "border-[#851C1C] text-[#851C1C] font-normal"
                    : "border-transparent text-[#851C1C] font-normal"
                }`}
              >
                Rooms
              </button>
            </nav>

          <div className={`h-8 w-full shrink flex items-center bg-zinc-50 border border-zinc-200 px-3 rounded-full focus-within:bg-white focus-within:ring-1 focus-within:ring-zinc-200 transition-all duration-300 ease-in-out ml-auto mr-[4rem] ${
            isSearchFocused ? "max-w-[1200px]" : "max-w-[400px]"
          }`}>
            <div className="flex items-center mr-2 flex-shrink-0">
              <Search size={15} className="text-[#851C1C]" />
            </div>
            <input
              ref={searchInputRef}
              type="text"
              placeholder="Search books, authors, genres..."
              value={searchQuery}
              onFocus={() => setIsSearchFocused(true)}
              onBlur={() => {
                setTimeout(() => setIsSearchFocused(false), 200);
              }}
              onChange={(e) => {
                setSearchQuery(e.target.value);
                if (location.pathname !== "/") {
                  navigate("/");
                }
              }}
              className="w-full border-none outline-none text-sm text-zinc-800 bg-transparent placeholder-zinc-400"
            />
            <div className={`flex items-center transition-all duration-300 ease-in-out overflow-hidden ${
              isSearchFocused ? "max-w-[150px] opacity-100 ml-1" : "max-w-0 opacity-0 ml-0 pointer-events-none"
            }`}>
              <button
                onMouseDown={(e) => {
                  e.preventDefault();
                }}
                onClick={() => {
                  setSearchQuery("");
                  setIsSearchFocused(false);
                  if (searchInputRef.current) {
                    searchInputRef.current.blur();
                  }
                }}
                className="w-7 h-7 rounded-full hover:bg-zinc-200/60 flex items-center justify-center text-[#851C1C] cursor-pointer focus:outline-none border-none flex-shrink-0 transition-colors"
              >
                <X size={16} />
              </button>
            </div>
          </div>

          <div className="relative flex-shrink-0">
            <button
              onClick={() => setShowDropdown(!showDropdown)}
              className="h-9 flex items-center gap-1 p-1 rounded-full bg-transparent hover:bg-[#F4EFE6] dark:hover:bg-zinc-800 transition-colors focus:outline-none cursor-pointer border-none"
            >
              <div className="w-7 h-7 rounded-full bg-[#851C1C] text-white flex items-center justify-center text-xs font-bold shadow-inner">
                {initials}
              </div>
              <ChevronDown size={11} className="text-[#851C1C] flex-shrink-0" />
            </button>

            {showDropdown && (
              <>
                <div 
                  className="fixed inset-0 z-40" 
                  onClick={() => setShowDropdown(false)} 
                />
                
                <div className="absolute right-0 mt-2 w-32 bg-white dark:bg-zinc-900 text-zinc-900 dark:text-zinc-100 border border-zinc-200 dark:border-zinc-800 rounded-lg shadow-lg p-1 z-50 animate-in fade-in slide-in-from-top-1 duration-100">
                  {/* Pointy Caret Arrow pointing UP */}
                  <div className="absolute bottom-full right-4 w-2 h-2 bg-white dark:bg-zinc-900 border-l border-t border-zinc-200 dark:border-zinc-800 rotate-45 translate-y-[5px]" />
                  
                  <button
                    onClick={() => {
                      setShowDropdown(false);
                      navigate("/settings");
                    }}
                    className="w-full flex items-center px-2.5 py-2 text-left text-sm text-zinc-700 dark:text-zinc-300 hover:bg-[#FAF6F0] dark:hover:bg-zinc-800/80 hover:text-[#851C1C] transition-colors border-none bg-transparent cursor-pointer font-semibold rounded-md"
                  >
                    <span>Settings</span>
                  </button>

                  <button
                    onClick={() => {
                      setShowDropdown(false);
                      logout();
                    }}
                    className="w-full flex items-center px-2.5 py-2 text-left text-sm text-[#851C1C]/80 hover:bg-[#FAF6F0] hover:text-[#851C1C] transition-colors border-none bg-transparent cursor-pointer font-semibold rounded-md"
                  >
                    <span>Log out</span>
                  </button>
                </div>
              </>
            )}
          </div>
        </header>
      )}

      <div className={isReading ? "flex-1 overflow-hidden" : "flex-1 overflow-y-auto"}>
        <Routes>
          <Route 
            path="/" 
            element={
              <User 
                client={client} 
                books={books}
                rooms={rooms}
                bookmarksCount={bookmarksCount}
                setBookmarksCount={setBookmarksCount}
                activeTab={activeTab}
                setActiveTab={setActiveTab}
                searchQuery={searchQuery}
                setSearchQuery={setSearchQuery}
                loading={loading}
                msg={msg}
                setMsg={setMsg}
                load={load}
                favorites={favorites}
                toggleFavorite={toggleFavorite}
              />
            } 
          />
          <Route path="/books/:id" element={<BookDetail client={client} />} />
          <Route path="/books/:id/read" element={<BookReader client={client}/>}/>
          <Route path="/settings" element={<Settings />} />
        </Routes>
      </div>
    </div>
  );
}

export default function App() {
  const [token, setToken] = useState(
    localStorage.getItem("libraryToken") || "",
  );
  const [user, setUser] = useState(
    JSON.parse(localStorage.getItem("libraryUser") || "null"),
  );
  const [greeting, setGreeting] = useState(null); // null | "visible" | "fading"
  const client = useClient(token);

  function onLogin(t, u) {
    localStorage.setItem("libraryToken", t);
    localStorage.setItem("libraryUser", JSON.stringify(u));
    setToken(t);
    setUser(u);
    setGreeting("visible");
    setTimeout(() => setGreeting("fading"), 1800);
    setTimeout(() => setGreeting(null), 2500);
  }

  function logout() {
    localStorage.clear();
    setToken("");
    setUser(null);
  }

  if (!user) return <Login onLogin={onLogin} />;

  const initials = user.name
    ? user.name
        .split(" ")
        .map((n) => n[0])
        .join("")
        .toUpperCase()
        .slice(0, 2)
    : "U";

  const firstName = user.name ? user.name.split(" ")[0] : "there";

  return (
    <Router>
      <AppContent 
        client={client} 
        initials={initials} 
        firstName={firstName} 
        logout={logout} 
        user={user} 
        greeting={greeting} 
      />
    </Router>
  );
}
