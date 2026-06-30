import os
import sqlite3
import secrets
from datetime import datetime, timezone
from functools import wraps
from flask import Flask, g, jsonify, request
from flask_cors import CORS

BASE_DIR = os.path.dirname(os.path.abspath(__file__))
DB_PATH = os.path.join(BASE_DIR, "library.db")
TOKENS = {}
app = Flask(__name__)
CORS(app, resources={r"/api/*": {"origins": "http://localhost:5173"}}, supports_credentials=True, allow_headers=["Content-Type", "Authorization"])

def now_iso():
    return datetime.now(timezone.utc).isoformat()

def get_db():
    if "db" not in g:
        g.db = sqlite3.connect(DB_PATH)
        g.db.row_factory = sqlite3.Row
    return g.db

@app.teardown_appcontext
def close_db(_error):
    conn = g.pop("db", None)
    if conn:
        conn.close()

def one(cursor):
    row = cursor.fetchone()
    return dict(row) if row else None

def many(cursor):
    return [dict(row) for row in cursor.fetchall()]

def run(sql, params=()):
    cur = get_db().execute(sql, params)
    get_db().commit()
    return cur
def init_db():
    conn = sqlite3.connect(DB_PATH)
    cur = conn.cursor()
    cur.executescript("""
    CREATE TABLE IF NOT EXISTS users (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        name TEXT NOT NULL,
        email TEXT NOT NULL UNIQUE,
        password TEXT NOT NULL,
        role TEXT NOT NULL CHECK (role IN ('user','admin'))
    );

    /* ── Updated books table layout containing category, summary, and cover fields ── */
    CREATE TABLE IF NOT EXISTS books (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        title TEXT NOT NULL,
        author TEXT NOT NULL,
        type TEXT NOT NULL CHECK (type IN ('hardcover','ebook')),
        total_copies INTEGER NOT NULL DEFAULT 0,
        ebook_source TEXT,
        ebook_text TEXT,
        summary TEXT,
        cover_image_url TEXT,
        category TEXT
    );

    CREATE TABLE IF NOT EXISTS leases (id INTEGER PRIMARY KEY AUTOINCREMENT, user_id INTEGER NOT NULL, book_id INTEGER NOT NULL, leased_at TEXT NOT NULL, returned_at TEXT, FOREIGN KEY(user_id) REFERENCES users(id), FOREIGN KEY(book_id) REFERENCES books(id));
    CREATE TABLE IF NOT EXISTS reading_rooms (id INTEGER PRIMARY KEY AUTOINCREMENT, book_id INTEGER NOT NULL, name TEXT NOT NULL, created_by INTEGER NOT NULL, created_at TEXT NOT NULL, FOREIGN KEY(book_id) REFERENCES books(id), FOREIGN KEY(created_by) REFERENCES users(id));
    CREATE TABLE IF NOT EXISTS room_members (room_id INTEGER NOT NULL, user_id INTEGER NOT NULL, joined_at TEXT NOT NULL, PRIMARY KEY(room_id,user_id), FOREIGN KEY(room_id) REFERENCES reading_rooms(id), FOREIGN KEY(user_id) REFERENCES users(id));
    CREATE TABLE IF NOT EXISTS notes (id INTEGER PRIMARY KEY AUTOINCREMENT, room_id INTEGER NOT NULL, user_id INTEGER NOT NULL, book_id INTEGER NOT NULL, location TEXT NOT NULL, body TEXT NOT NULL, created_at TEXT NOT NULL);
    CREATE TABLE IF NOT EXISTS bookmarks (id INTEGER PRIMARY KEY AUTOINCREMENT, room_id INTEGER NOT NULL, user_id INTEGER NOT NULL, book_id INTEGER NOT NULL, location TEXT NOT NULL, label TEXT NOT NULL, created_at TEXT NOT NULL);

    -- Table for invitation tokens to reading rooms
    CREATE TABLE IF NOT EXISTS room_invites (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        room_id INTEGER NOT NULL,
        invitee_email TEXT NOT NULL,
        token TEXT NOT NULL UNIQUE,
        created_at TEXT NOT NULL,
        expires_at TEXT,
        FOREIGN KEY(room_id) REFERENCES reading_rooms(id)
    );

    -- Table to track online presence and cursor position per user per room
    CREATE TABLE IF NOT EXISTS room_presence (
        room_id INTEGER NOT NULL,
        user_id INTEGER NOT NULL,
        last_seen TEXT NOT NULL,
        page_index INTEGER NOT NULL,
        PRIMARY KEY(room_id, user_id),
        FOREIGN KEY(room_id) REFERENCES reading_rooms(id),
        FOREIGN KEY(user_id) REFERENCES users(id)
    );
    """)

    cur.execute("SELECT COUNT(*) FROM users")
    if cur.fetchone()[0] == 0:
        cur.executemany("INSERT INTO users (name,email,password,role) VALUES (?,?,?,?)", [
            ("Admin","admin@library.test","admin123","admin"),
            ("Reader One","reader@library.test","reader123","user"),
            ("Maya Friend","maya@library.test","reader123","user")
        ])

    cur.execute("SELECT COUNT(*) FROM books")
    if cur.fetchone()[0] == 0:
        cur.executemany("""
            INSERT INTO books (title,author,type,total_copies,ebook_source,ebook_text,summary,cover_image_url,category)
            VALUES (?,?,?,?,?,?,?,?,?)
        """, [
            (
                "Pride and Prejudice", "Jane Austen", "ebook", 0, "Project Gutenberg",
                "It is a truth universally acknowledged...", # Truncated here for script readability
                "A classic romantic novel of manners exploring the emotional growth of Elizabeth Bennet as she navigates societal pressures.",
                "https://covers.openlibrary.org/b/id/14571901-L.jpg", "Fiction"
            ),
            (
                "Frankenstein", "Mary Shelley", "ebook", 0, "Project Gutenberg",
                "You will rejoice to hear that no disaster...",
                "The chilling tale of Victor Frankenstein, a brilliant scientist who succeeds in bringing an artificial creature to life, with tragic consequences.",
                "https://covers.openlibrary.org/b/id/14539129-L.jpg", "Sci-Fi"
            ),
            (
                "Clean Code", "Robert C. Martin", "hardcover", 4, None, None,
                "Even bad code can function. But if code isn't clean, it can bring a development organization to its knees. This book teaches software craftsmen how to write better code.",
                None, "Tech"
            ),
            (
                "Designing Data-Intensive Applications", "Martin Kleppmann", "hardcover", 3, None, None,
                "An excellent guide to the principles and architectures underlying modern data systems like databases, streams, and processing pipelines.",
                None, "Tech"
            ),
            (
                "The Pragmatic Programmer", "Andrew Hunt and David Thomas", "hardcover", 5, None, None,
                "Direct advice ranging from career development to architectural techniques for writing clean, flexible, and maintainable code.",
                None, "Tech"
            )
        ])
    conn.commit()
    conn.close()
    
def current_user():
    token = request.headers.get("Authorization", "").replace("Bearer ", "", 1).strip()
    uid = TOKENS.get(token)
    if not uid:
        return None
    return one(get_db().execute("SELECT id,name,email,role FROM users WHERE id=?", (uid,)))

def auth(role=None):
    def deco(fn):
        @wraps(fn)
        def wrapper(*args, **kwargs):
            user = current_user()
            if not user:
                return jsonify({"error":"Authentication required"}), 401
            if role and user["role"] != role:
                return jsonify({"error":"Permission denied"}), 403
            request.user = user
            return fn(*args, **kwargs)
        return wrapper
    return deco

@app.post("/api/auth/login")
def login():
    data = request.get_json(force=True)
    user = one(get_db().execute("SELECT id,name,email,role FROM users WHERE email=? AND password=?", (data.get("email"), data.get("password"))))
    if not user:
        return jsonify({"error":"Invalid email or password"}), 401
    token = secrets.token_hex(24); TOKENS[token] = user["id"]
    return jsonify({"token":token,"user":user})

@app.get("/api/books")
@auth()
def books():
    rows = many(get_db().execute("""
    SELECT b.*, CASE WHEN b.type='hardcover' THEN b.total_copies - COUNT(CASE WHEN l.returned_at IS NULL THEN 1 END) ELSE NULL END AS available_copies
    FROM books b LEFT JOIN leases l ON l.book_id=b.id GROUP BY b.id ORDER BY b.type,b.title
    """))
    # Restructure each book record to nest ebook-specific metadata
    def format_book(b):
        ebook_fields = {
            "source": b.get("ebook_source"),
            "text": b.get("ebook_text"),
            "summary": b.get("summary"),
            "cover_image_url": b.get("cover_image_url"),
            "category": b.get("category"),
        } if b.get("type") == "ebook" else None
        return {
            "id": b.get("id"),
            "title": b.get("title"),
            "author": b.get("author"),
            "type": b.get("type"),
            "total_copies": b.get("total_copies"),
            "available_copies": b.get("available_copies"),
            "ebook": ebook_fields,
        }
    structured = [format_book(r) for r in rows]
    return jsonify(structured)


@app.get("/api/books/<int:book_id>")
@auth()
def get_book(book_id):
    # Return a single book with nested ebook fields for ebook type
    row = one(get_db().execute("""
    SELECT b.*, CASE WHEN b.type='hardcover' THEN b.total_copies - COUNT(CASE WHEN l.returned_at IS NULL THEN 1 END) ELSE NULL END AS available_copies
    FROM books b LEFT JOIN leases l ON l.book_id=b.id WHERE b.id = ? GROUP BY b.id
    """, (book_id,)))
    if not row:
        return jsonify({"error": "Book not found"}), 404
    # Structure response similarly to /api/books list
    ebook_fields = {
        "source": row.get("ebook_source"),
        "text": row.get("ebook_text"),
        "summary": row.get("summary"),
        "cover_image_url": row.get("cover_image_url"),
        "category": row.get("category"),
    } if row.get("type") == "ebook" else None
    structured = {
        "id": row.get("id"),
        "title": row.get("title"),
        "author": row.get("author"),
        "type": row.get("type"),
        "total_copies": row.get("total_copies"),
        "available_copies": row.get("available_copies"),
        "ebook": ebook_fields,
    }
    return jsonify(structured)

@app.post("/api/leases")
@auth("user")
def lease_book():
    data = request.get_json(force=True)
    book = one(get_db().execute("SELECT * FROM books WHERE id=?", (data.get("book_id"),)))
    if not book or book["type"] != "hardcover":
        return jsonify({"error":"Only hardcover books can be leased"}), 400
    active = get_db().execute("SELECT COUNT(*) FROM leases WHERE book_id=? AND returned_at IS NULL", (book["id"],)).fetchone()[0]
    if active >= book["total_copies"]:
        return jsonify({"error":"No copies available"}), 409
    run("INSERT INTO leases (user_id,book_id,leased_at) VALUES (?,?,?)", (request.user["id"], book["id"], now_iso()))
    return jsonify({"message":"Book leased"}), 201

@app.post("/api/leases/<int:lease_id>/return")
@auth()
def return_book(lease_id):
    lease = one(get_db().execute("SELECT * FROM leases WHERE id=?", (lease_id,)))
    if not lease:
        return jsonify({"error":"Lease not found"}), 404
    if request.user["role"] == "user" and lease["user_id"] != request.user["id"]:
        return jsonify({"error":"Permission denied"}), 403
    run("UPDATE leases SET returned_at=? WHERE id=?", (now_iso(), lease_id))
    return jsonify({"message":"Book returned"})

@app.get("/api/my-leases")
@auth("user")
def my_leases():
    return jsonify(many(get_db().execute("SELECT l.*,b.title,b.author FROM leases l JOIN books b ON b.id=l.book_id WHERE l.user_id=? ORDER BY l.leased_at DESC", (request.user["id"],))))

@app.get("/api/admin/inventory")
@auth("admin")
def inventory():
    return jsonify(many(get_db().execute("""
    SELECT b.id,b.title,b.author,b.type,b.total_copies, COUNT(CASE WHEN l.returned_at IS NULL THEN 1 END) AS leased_copies, b.total_copies - COUNT(CASE WHEN l.returned_at IS NULL THEN 1 END) AS available_copies
    FROM books b LEFT JOIN leases l ON l.book_id=b.id WHERE b.type='hardcover' GROUP BY b.id ORDER BY b.title
    """)))

@app.get("/api/admin/leases")
@auth("admin")
def admin_leases():
    return jsonify(many(get_db().execute("SELECT l.*,b.title,b.author,u.name AS user_name,u.email AS user_email FROM leases l JOIN books b ON b.id=l.book_id JOIN users u ON u.id=l.user_id ORDER BY l.leased_at DESC")))

@app.post("/api/admin/books")
@auth("admin")
def add_book():
    data = request.get_json(force=True)
    run("INSERT INTO books (title,author,type,total_copies,ebook_source,ebook_text) VALUES (?,?,?,?,?,?)", (data.get("title",""), data.get("author",""), data.get("type","hardcover"), int(data.get("total_copies") or 0), data.get("ebook_source"), data.get("ebook_text")))
    return jsonify({"message":"Book created"}), 201

@app.get("/api/rooms")
@auth("user")
def rooms():
    return jsonify(many(get_db().execute("SELECT r.*,b.title,b.author,COUNT(DISTINCT rm.user_id) AS member_count FROM reading_rooms r JOIN books b ON b.id=r.book_id LEFT JOIN room_members rm ON rm.room_id=r.id GROUP BY r.id ORDER BY r.created_at DESC")))

@app.post("/api/rooms")
@auth("user")
def create_room():
    data = request.get_json(force=True)
    book = one(get_db().execute("SELECT * FROM books WHERE id=?", (data.get("book_id"),)))
    if not book or book["type"] != "ebook":
        return jsonify({"error":"Reading rooms are for ebooks only"}), 400
    cur = run("INSERT INTO reading_rooms (book_id,name,created_by,created_at) VALUES (?,?,?,?)", (book["id"], data.get("name","Reading room"), request.user["id"], now_iso()))
    room_id = cur.lastrowid
    run("INSERT INTO room_members (room_id,user_id,joined_at) VALUES (?,?,?)", (room_id, request.user["id"], now_iso()))
    return jsonify({"id":room_id,"message":"Room created"}), 201

@app.post("/api/rooms/<int:room_id>/join")
@auth("user")
def join_room(room_id):
    run("INSERT OR IGNORE INTO room_members (room_id,user_id,joined_at) VALUES (?,?,?)", (room_id, request.user["id"], now_iso()))
    return jsonify({"message":"Joined room"})

@app.get("/api/rooms/<int:room_id>")
@auth("user")
def room_detail(room_id):
    room = one(get_db().execute("SELECT r.*,b.title,b.author,b.ebook_text,b.ebook_source FROM reading_rooms r JOIN books b ON b.id=r.book_id WHERE r.id=?", (room_id,)))
    if not room:
        return jsonify({"error":"Room not found"}), 404
    members = many(get_db().execute("SELECT u.id,u.name,u.email FROM room_members rm JOIN users u ON u.id=rm.user_id WHERE rm.room_id=? ORDER BY rm.joined_at", (room_id,)))
    notes = many(get_db().execute("SELECT n.*,u.name AS user_name FROM notes n JOIN users u ON u.id=n.user_id WHERE n.room_id=? ORDER BY n.created_at DESC", (room_id,)))
    bookmarks = many(get_db().execute("SELECT bm.*,u.name AS user_name FROM bookmarks bm JOIN users u ON u.id=bm.user_id WHERE bm.room_id=? ORDER BY bm.created_at DESC", (room_id,)))
    return jsonify({"room":room,"members":members,"notes":notes,"bookmarks":bookmarks})

# ------------------------------------------------------------
# Collaborative reading: presence tracking & invites

# Get current participants and cursor positions for a room
@app.get("/api/rooms/<int:room_id>/presence")
@auth("user")
def get_presence(room_id):
    participants = many(
        get_db().execute(
            """
            SELECT rm.user_id AS id, u.name, u.email, rm.page_index, rm.last_seen
            FROM room_presence rm
            JOIN users u ON u.id = rm.user_id
            WHERE rm.room_id = ?
            ORDER BY rm.last_seen DESC
            """,
            (room_id,)
        )
    )
    return jsonify({"participants": participants})

# Update the current user's cursor position (page index) and ping presence
@app.post("/api/rooms/<int:room_id>/presence")
@auth("user")
def update_presence(room_id):
    data = request.get_json(force=True)
    page_index = data.get("page_index")
    if page_index is None:
        return jsonify({"error": "page_index required"}), 400
    now = now_iso()
    run(
        """
        INSERT INTO room_presence (room_id, user_id, last_seen, page_index)
        VALUES (?,?,?,?)
        ON CONFLICT(room_id, user_id) DO UPDATE SET last_seen=excluded.last_seen, page_index=excluded.page_index
        """,
        (room_id, request.user["id"], now, page_index),
    )
    return jsonify({"message": "Presence updated"})

# Create an invitation token for another user to join this room
@app.post("/api/rooms/<int:room_id>/invite")
@auth("user")
def create_invite(room_id):
    data = request.get_json(force=True)
    email = data.get("email")
    if not email:
        return jsonify({"error": "Email is required"}), 400
    token = secrets.token_urlsafe(16)
    now = now_iso()
    run(
        "INSERT INTO room_invites (room_id, invitee_email, token, created_at) VALUES (?,?,?,?)",
        (room_id, email, token, now),
    )
    return jsonify({"invite_token": token})

# Accept an invitation token and join the corresponding room
@app.post("/api/rooms/invite/accept")
@auth("user")
def accept_invite():
    data = request.get_json(force=True)
    token = data.get("token")
    if not token:
        return jsonify({"error": "Token is required"}), 400
    invite = one(get_db().execute("SELECT * FROM room_invites WHERE token = ?", (token,)))
    if not invite:
        return jsonify({"error": "Invalid invitation token"}), 404
    # Add the user to the room if not already a member
    run(
        "INSERT OR IGNORE INTO room_members (room_id, user_id, joined_at) VALUES (?,?,?)",
        (invite["room_id"], request.user["id"], now_iso()),
    )
    # Invalidate the token (optional – delete after use)
    run("DELETE FROM room_invites WHERE id = ?", (invite["id"],))
    return jsonify({"message": "Joined room", "room_id": invite["room_id"]})


@app.post("/api/rooms/<int:room_id>/notes")
@auth("user")
def add_note(room_id):
    data = request.get_json(force=True)
    room = one(get_db().execute("SELECT * FROM reading_rooms WHERE id=?", (room_id,)))
    run("INSERT INTO notes (room_id,user_id,book_id,location,body,created_at) VALUES (?,?,?,?,?,?)", (room_id, request.user["id"], room["book_id"], data.get("location","Page 1"), data.get("body",""), now_iso()))
    return jsonify({"message":"Note added"}), 201

@app.post("/api/rooms/<int:room_id>/bookmarks")
@auth("user")
def add_bookmark(room_id):
    data = request.get_json(force=True)
    room = one(get_db().execute("SELECT * FROM reading_rooms WHERE id=?", (room_id,)))
    run("INSERT INTO bookmarks (room_id,user_id,book_id,location,label,created_at) VALUES (?,?,?,?,?,?)", (room_id, request.user["id"], room["book_id"], data.get("location","Page 1"), data.get("label","Bookmark"), now_iso()))
    return jsonify({"message":"Bookmark added"}), 201

if __name__ == "__main__":
    init_db()
    app.run(debug=True, port=5000)
