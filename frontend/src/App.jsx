import React, { useState } from "react";
import { BrowserRouter as Router, Routes, Route, Link, useLocation } from "react-router-dom";
import { Library, LogOut } from "lucide-react";
import { useClient } from "./hooks/useClient";
import { Login } from "./pages/Login";
import { BookDetail } from "./pages/BookDetail";
import { User } from "./pages/User";
import BookReader from "./pages/BookReader";
import { CherryBlossoms } from "./components/CherryBlossoms";
import "./styles/index.css";

function AppContent({ client, initials, firstName, logout, user, greeting }) {
  const location = useLocation();
  const isReading = location.pathname.includes("/read");

  return (
    <div className={`flex flex-col h-screen overflow-hidden bg-white dark:bg-zinc-955 text-zinc-900 dark:text-zinc-100 relative ${!isReading ? "petal-theme-active" : ""}`}>
      {!isReading && <CherryBlossoms />}
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
            <p className="text-sm text-zinc-500">Welcome back to the library</p>
          </div>
        </div>
      )}

      {/* Hide header if on /books/:id/read route */}
      {!isReading && (
        <header className="flex items-center justify-between px-6 py-4 border-b border-zinc-200 dark:border-zinc-800 bg-white/70 dark:bg-zinc-955/70 backdrop-blur-md sticky top-0 z-30 flex-shrink-0">
          <Link to="/" className="flex items-center gap-3 no-underline text-current group">
            <div className="w-8 h-8 rounded bg-zinc-900 dark:bg-zinc-100 flex items-center justify-center group-hover:scale-105 transition-transform duration-200">
              <Library size={16} className="text-white dark:text-zinc-900" />
            </div>
            <div>
              <div className="font-bold text-sm leading-tight text-zinc-900 dark:text-zinc-100">Library</div>
              <div className="text-[10px] text-zinc-500 uppercase tracking-wider">{user.role}</div>
            </div>
          </Link>
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-zinc-100 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 text-sm font-medium">
              <div className="w-6 h-6 rounded-lg bg-zinc-900 dark:bg-zinc-100 text-white dark:text-zinc-900 flex items-center justify-center text-[10px] font-bold">
                {initials}
              </div>
              {user.name}
            </div>
            <button 
              className="p-2 rounded hover:bg-zinc-100 dark:hover:bg-zinc-900 border border-transparent hover:border-zinc-200 dark:hover:border-zinc-800 transition-all text-zinc-500 hover:text-zinc-900 dark:text-zinc-400 dark:hover:text-zinc-100" 
              onClick={logout} 
              title="Log out"
            >
              <LogOut size={15} />
            </button>
          </div>
        </header>
      )}

      <div className="flex-1 overflow-auto">
        <Routes>
          <Route path="/" element={<User client={client} />} />
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
