import React, { useState, useEffect } from "react";
import { BookOpen, Bookmark, Plus, Shield, RefreshCw } from "lucide-react";

export function Admin({ client }) {
  const [inventory, setInventory] = useState([]);
  const [leases, setLeases] = useState([]);
  const [books, setBooks] = useState([]);
  const [activeTab, setActiveTab] = useState("inventory");
  const [form, setForm] = useState({
    title: "",
    author: "",
    type: "hardcover",
    total_copies: 1,
    ebook_source: "",
    ebook_text: "",
  });
  const [saving, setSaving] = useState(false);
  const [msg, setMsg] = useState("");

  async function load() {
    const [i, l, b] = await Promise.all([
      client.request("/admin/inventory"),
      client.request("/admin/leases"),
      client.request("/books"),
    ]);
    setInventory(i);
    setLeases(l);
    setBooks(b);
  }

  useEffect(() => {
    load();
  }, []);

  async function submit(e) {
    e.preventDefault();
    setSaving(true);
    setMsg("");
    try {
      await client.request("/admin/books", {
        method: "POST",
        body: JSON.stringify(form),
      });
      setForm({
        title: "",
        author: "",
        type: "hardcover",
        total_copies: 1,
        ebook_source: "",
        ebook_text: "",
      });
      setMsg("Book added.");
      await load();
    } catch (e) {
      setMsg(e.message);
    } finally {
      setSaving(false);
    }
  }

  const tabs = [
    { id: "inventory", label: "Inventory" },
    { id: "leases", label: "Leases" },
    { id: "books", label: "All books" },
  ];

  return (
    <div className="admin-layout">
      {/* Left: data panels */}
      <section>
        <nav
          className="tab-nav"
          style={{ margin: "0 -24px 24px", padding: "0 0" }}
        >
          {tabs.map((t) => (
            <button
              key={t.id}
              className={`tab-btn ${activeTab === t.id ? "active" : ""}`}
              onClick={() => setActiveTab(t.id)}
            >
              {t.label}
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

        {activeTab === "inventory" && (
          <>
            <p className="section-label">{inventory.length} titles</p>
            <table className="data-table">
              <thead>
                <tr>
                  <th>Title</th>
                  <th>Author</th>
                  <th>Total</th>
                  <th>Leased</th>
                  <th>Available</th>
                </tr>
              </thead>
              <tbody>
                {inventory.map((b) => (
                  <tr key={b.id}>
                    <td>{b.title}</td>
                    <td style={{ color: "var(--gray-500)" }}>{b.author}</td>
                    <td>{b.total_copies}</td>
                    <td>{b.leased_copies}</td>
                    <td style={{ fontWeight: 500 }}>{b.available_copies}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </>
        )}

        {activeTab === "leases" && (
          <>
            <p className="section-label">{leases.length} records</p>
            <table className="data-table">
              <thead>
                <tr>
                  <th>Title</th>
                  <th>Reader</th>
                  <th>Status</th>
                </tr>
              </thead>
              <tbody>
                {leases.map((l) => (
                  <tr key={l.id}>
                    <td>{l.title}</td>
                    <td style={{ color: "var(--gray-500)" }}>{l.user_name}</td>
                    <td>
                      {l.returned_at ? (
                        <span className="lease-status-returned">Returned</span>
                      ) : (
                        <span className="lease-status-active">Active</span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </>
        )}

        {activeTab === "books" && (
          <>
            <p className="section-label">{books.length} total books</p>
            <div className="books-grid">
              {books.map((b) => (
                <div className="book-card" key={b.id}>
                  <span className="book-type-tag">{b.type}</span>
                  <span className="book-title">{b.title}</span>
                  <span className="book-author">{b.author}</span>
                </div>
              ))}
            </div>
          </>
        )}
      </section>

      {/* Right: add book */}
      <aside>
        <div className="add-book-panel">
          <h2 className="panel-title">
            <Plus size={15} /> Add book
          </h2>
          {msg && <p className="notice">{msg}</p>}
          <form onSubmit={submit}>
            <label>Title</label>
            <input
              placeholder="Book title"
              value={form.title}
              onChange={(e) => setForm({ ...form, title: e.target.value })}
              required
            />
            <label>Author</label>
            <input
              placeholder="Author name"
              value={form.author}
              onChange={(e) => setForm({ ...form, author: e.target.value })}
              required
            />
            <label>Type</label>
            <select
              value={form.type}
              onChange={(e) => setForm({ ...form, type: e.target.value })}
            >
              <option value="hardcover">Hardcover</option>
              <option value="ebook">Ebook</option>
            </select>
            {form.type === "hardcover" && (
              <>
                <label>Total copies</label>
                <input
                  type="number"
                  min="0"
                  value={form.total_copies}
                  onChange={(e) =>
                    setForm({ ...form, total_copies: e.target.value })
                  }
                />
              </>
            )}
            {form.type === "ebook" && (
              <>
                <label>Source</label>
                <input
                  placeholder="e.g. Project Gutenberg"
                  value={form.ebook_source}
                  onChange={(e) =>
                    setForm({ ...form, ebook_source: e.target.value })
                  }
                />
                <label>Ebook text</label>
                <textarea
                  rows="8"
                  placeholder="Paste full text here…"
                  value={form.ebook_text}
                  onChange={(e) =>
                    setForm({ ...form, ebook_text: e.target.value })
                  }
                />
              </>
            )}
            <button className="primary w-full" disabled={saving}>
              {saving ? "Saving…" : "Create book"}
            </button>
          </form>
        </div>
      </aside>
    </div>
  );
}
