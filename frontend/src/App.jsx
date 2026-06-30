import React, { useState } from "react";
import { BrowserRouter as Router, Routes, Route, Link } from "react-router-dom";
import { Library, LogOut } from "lucide-react";
import { useClient } from "./hooks/useClient";
import { Login } from "./pages/Login";
import { BookDetail } from "./pages/BookDetail";
import { User } from "./pages/User";
import BookReader from "./pages/BookReader";
// import { Admin } from "./pages/Admin"; // Admin removed
import "./style.css";

export default function App() {
  // Wrap the entire app in a router to enable navigation to book detail pages

  // Wrap the entire app in a router to enable navigation to book detail pages
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
      <div className="app-shell">
        {/* Greeting overlay */}
        {greeting && (
          <div
            className={`greeting-overlay ${greeting === "fading" ? "greeting-fade" : ""}`}
          >
            <div className="greeting-box">
              <div className="greeting-avatar">{initials}</div>
              <p className="greeting-hello">Hello, {firstName}</p>
              <p className="greeting-sub">Welcome back to the library</p>
            </div>
          </div>
        )}

        <header className="app-header">
          <Link to="/" className="header-brand">
            <div className="header-brand-icon">
              <Library size={16} color="#fff" />
            </div>
            <div>
              <div className="header-brand-name">Library</div>
              <div className="header-brand-sub">{user.role}</div>
            </div>
          </Link>
          <div className="header-right">
            <div className="user-chip">
              <div className="user-avatar">{initials}</div>
              {user.name}
            </div>
            <button className="icon" onClick={logout} title="Log out">
              <LogOut size={15} />
            </button>
          </div>
        </header>

        <Routes>
          <Route path="/" element={<User client={client} />} />
          <Route path="/books/:id" element={<BookDetail client={client} />} />
          <Route path="/books/:id/read" element={<BookReader client={client}/>}/>
        </Routes>
      </div>
    </Router>
  );
}
