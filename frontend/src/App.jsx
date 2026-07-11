import React, { useState, useEffect } from "react";
import { BrowserRouter as Router, Routes, Route, Link, useLocation, useNavigate } from "react-router-dom";
import { Library, LogOut, Search } from "lucide-react";
import { useClient } from "./hooks/useClient";
import { Login } from "./pages/Login";
import { BookDetail } from "./pages/BookDetail";
import { User } from "./pages/User";
import BookReader from "./pages/BookReader";
import "./styles/index.css";

function AppContent({ client, initials, firstName, logout, user, greeting }) {
  const location = useLocation();
  const navigate = useNavigate();
  const isReading = location.pathname.includes("/read");
  const [searchQuery, setSearchQuery] = useState("");
  const [showDropdown, setShowDropdown] = useState(false);
  const [activeTab, setActiveTab] = useState("ebooks");

  const [books, setBooks] = useState([]);
  const [rooms, setRooms] = useState([]);
  const [bookmarksCount, setBookmarksCount] = useState(0);
  const [loading, setLoading] = useState(true);
  const [msg, setMsg] = useState("");

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
    <div className={`flex flex-col bg-white dark:bg-zinc-955 text-zinc-900 dark:text-zinc-100 ${isReading ? "h-screen overflow-hidden" : "min-h-screen"}`}>
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
        <header className="flex items-center justify-between px-6 py-4 border-b border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-955 sticky top-0 z-30 flex-shrink-0">
          <div className="flex items-center gap-6">
            <Link 
              to="/" 
              onClick={() => {
                setActiveTab("ebooks");
                setSearchQuery("");
              }}
              className={`flex items-center gap-3 no-underline text-current group pt-1.5 border-t-2 transition-all ${
                activeTab === "ebooks"
                  ? "border-zinc-900 dark:border-white text-zinc-900 dark:text-white"
                  : "border-transparent text-zinc-500 hover:text-zinc-900 dark:hover:text-white"
              }`}
            >
              <div className="w-8 h-8 rounded bg-zinc-900 dark:bg-zinc-100 flex items-center justify-center group-hover:scale-105 transition-transform duration-200">
                <Library size={16} className="text-white dark:text-zinc-900" />
              </div>
              <span className="font-bold text-base leading-tight text-zinc-900 dark:text-zinc-100">Library</span>
            </Link>

            {/* Rooms and Bookmarks Tabs in Header */}
            <nav className="hidden sm:flex items-center gap-1">
              <button
                onClick={() => handleTabClick("rooms")}
                className={`h-9 px-3.5 pt-1.5 text-base font-normal transition-all flex items-center gap-1.5 focus:outline-none cursor-pointer border-t-2 bg-transparent rounded-none ${
                  activeTab === "rooms"
                    ? "border-zinc-900 text-zinc-900 dark:border-white dark:text-white"
                    : "border-transparent text-zinc-500 hover:text-zinc-900 dark:hover:text-white"
                }`}
              >
                <span>Rooms</span>
                <span className="text-sm px-1.5 py-0.5 rounded border border-zinc-300 dark:border-zinc-700 bg-zinc-50 dark:bg-zinc-900 text-zinc-900 dark:text-zinc-100 font-normal">
                  {rooms.length}
                </span>
              </button>

              <button
                onClick={() => handleTabClick("bookmarks")}
                className={`h-9 px-3.5 pt-1.5 text-base font-normal transition-all flex items-center gap-1.5 focus:outline-none cursor-pointer border-t-2 bg-transparent rounded-none ${
                  activeTab === "bookmarks"
                    ? "border-zinc-900 text-zinc-900 dark:border-white dark:text-white"
                    : "border-transparent text-zinc-500 hover:text-zinc-900 dark:hover:text-white"
                }`}
              >
                <span>Bookmarks</span>
                <span className="text-sm px-1.5 py-0.5 rounded border border-zinc-300 dark:border-zinc-700 bg-zinc-50 dark:bg-zinc-900 text-zinc-900 dark:text-zinc-100 font-normal">
                  {bookmarksCount}
                </span>
              </button>
            </nav>
          </div>

          <div className="h-9 flex-grow max-w-md mx-6 flex items-center border border-zinc-300 dark:border-zinc-700 bg-zinc-50 dark:bg-zinc-900/50 px-3 rounded-lg">
            <Search size={14} className="text-zinc-400 dark:text-zinc-500 mr-2 flex-shrink-0" />
            <input
              type="text"
              placeholder="Search..."
              value={searchQuery}
              onChange={(e) => {
                setSearchQuery(e.target.value);
                if (location.pathname !== "/") {
                  navigate("/");
                }
              }}
              className="w-full border-none outline-none text-base text-zinc-900 dark:text-zinc-100 bg-transparent placeholder-zinc-400 dark:placeholder-zinc-600"
            />
          </div>

          <div className="relative">
            <button
              onClick={() => setShowDropdown(!showDropdown)}
              className="h-9 flex items-center gap-2 px-3 rounded-lg bg-zinc-100 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 text-base font-medium hover:bg-zinc-200 dark:hover:bg-zinc-800 transition-colors focus:outline-none cursor-pointer"
            >
              <div className="w-6 h-6 rounded bg-zinc-900 dark:bg-zinc-100 text-white dark:text-zinc-900 flex items-center justify-center text-[10px] font-bold">
                {initials}
              </div>
              <span>{user.name}</span>
            </button>

            {showDropdown && (
              <>
                <div 
                  className="fixed inset-0 z-40" 
                  onClick={() => setShowDropdown(false)} 
                />
                
                <div className="absolute right-0 mt-2 w-48 bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-lg shadow-lg py-1 z-50 animate-in fade-in slide-in-from-top-1 duration-100">
                  <button
                    onClick={() => {
                      setShowDropdown(false);
                      logout();
                    }}
                    className="w-full flex items-center gap-2 px-4 py-2.5 text-left text-base text-red-655 hover:bg-red-50 dark:hover:bg-red-955/20 hover:text-red-700 transition-colors border-none bg-transparent cursor-pointer font-semibold"
                  >
                    <LogOut size={14} />
                    <span>Log out</span>
                  </button>
                </div>
              </>
            )}
          </div>
        </header>
      )}

      <div className={isReading ? "flex-1 overflow-hidden" : "flex-1"}>
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
              />
            } 
          />
          <Route path="/books/:id" element={<BookDetail client={client} />} />
          <Route path="/books/:id/read" element={<BookReader client={client}/>}/>
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
