import React, { useState } from "react";
import { Library, LogOut } from "lucide-react";
import { useClient } from "./hooks/useClient";
import { Login } from "./pages/Login";
import { User } from "./pages/User";
import { Admin } from "./pages/Admin";
import "./style.css";

export default function App() {
  const [token, setToken] = useState(
    localStorage.getItem("libraryToken") || "",
  );
  const [user, setUser] = useState(
    JSON.parse(localStorage.getItem("libraryUser") || "null"),
  );
  const client = useClient(token);

  function onLogin(t, u) {
    localStorage.setItem("libraryToken", t);
    localStorage.setItem("libraryUser", JSON.stringify(u));
    setToken(t);
    setUser(u);
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

  return (
    <div className="app-shell">
      <header className="app-header">
        <div className="header-brand">
          <div className="header-brand-icon">
            <Library size={16} color="#fff" />
          </div>
          <div>
            <div className="header-brand-name">Library</div>
            <div className="header-brand-sub">{user.role}</div>
          </div>
        </div>
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

      {user.role === "admin" ? (
        <Admin client={client} />
      ) : (
        <User client={client} />
      )}
    </div>
  );
}
