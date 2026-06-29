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
CORS(app)

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
    CREATE TABLE IF NOT EXISTS users (id INTEGER PRIMARY KEY AUTOINCREMENT, name TEXT NOT NULL, email TEXT NOT NULL UNIQUE, password TEXT NOT NULL, role TEXT NOT NULL CHECK (role IN ('user','admin')));
    CREATE TABLE IF NOT EXISTS books (id INTEGER PRIMARY KEY AUTOINCREMENT, title TEXT NOT NULL, author TEXT NOT NULL, type TEXT NOT NULL CHECK (type IN ('hardcover','ebook')), total_copies INTEGER NOT NULL DEFAULT 0, ebook_source TEXT, ebook_text TEXT);
    CREATE TABLE IF NOT EXISTS leases (id INTEGER PRIMARY KEY AUTOINCREMENT, user_id INTEGER NOT NULL, book_id INTEGER NOT NULL, leased_at TEXT NOT NULL, returned_at TEXT, FOREIGN KEY(user_id) REFERENCES users(id), FOREIGN KEY(book_id) REFERENCES books(id));
    CREATE TABLE IF NOT EXISTS reading_rooms (id INTEGER PRIMARY KEY AUTOINCREMENT, book_id INTEGER NOT NULL, name TEXT NOT NULL, created_by INTEGER NOT NULL, created_at TEXT NOT NULL, FOREIGN KEY(book_id) REFERENCES books(id), FOREIGN KEY(created_by) REFERENCES users(id));
    CREATE TABLE IF NOT EXISTS room_members (room_id INTEGER NOT NULL, user_id INTEGER NOT NULL, joined_at TEXT NOT NULL, PRIMARY KEY(room_id,user_id), FOREIGN KEY(room_id) REFERENCES reading_rooms(id), FOREIGN KEY(user_id) REFERENCES users(id));
    CREATE TABLE IF NOT EXISTS notes (id INTEGER PRIMARY KEY AUTOINCREMENT, room_id INTEGER NOT NULL, user_id INTEGER NOT NULL, book_id INTEGER NOT NULL, location TEXT NOT NULL, body TEXT NOT NULL, created_at TEXT NOT NULL);
    CREATE TABLE IF NOT EXISTS bookmarks (id INTEGER PRIMARY KEY AUTOINCREMENT, room_id INTEGER NOT NULL, user_id INTEGER NOT NULL, book_id INTEGER NOT NULL, location TEXT NOT NULL, label TEXT NOT NULL, created_at TEXT NOT NULL);
    """)
    cur.execute("SELECT COUNT(*) FROM users")
    if cur.fetchone()[0] == 0:
        cur.executemany("INSERT INTO users (name,email,password,role) VALUES (?,?,?,?)", [("Admin","admin@library.test","admin123","admin"),("Reader One","reader@library.test","reader123","user"),("Maya Friend","maya@library.test","reader123","user")])
    cur.execute("SELECT COUNT(*) FROM books")
    if cur.fetchone()[0] == 0:
        cur.executemany("INSERT INTO books (title,author,type,total_copies,ebook_source,ebook_text) VALUES (?,?,?,?,?,?)", [
            ("Pride and Prejudice","Jane Austen","ebook",0,"Project Gutenberg","It is a truth universally acknowledged, that a single man in possession of a good fortune, must be in want of a wife.\n\nHowever little known the feelings or views of such a man may be on his first entering a neighbourhood, this truth is so well fixed in the minds of the surrounding families."),
            ("Frankenstein","Mary Shelley","ebook",0,"Project Gutenberg","You will rejoice to hear that no disaster has accompanied the commencement of an enterprise which you have regarded with such evil forebodings.\n\nI arrived here yesterday, and my first task is to assure my dear sister of my welfare."),
            ("Clean Code","Robert C. Martin","hardcover",4,None,None),
            ("Designing Data-Intensive Applications","Martin Kleppmann","hardcover",3,None,None),
            ("The Pragmatic Programmer","Andrew Hunt and David Thomas","hardcover",5,None,None)])
    conn.commit(); conn.close()

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
    return jsonify(many(get_db().execute("""
    SELECT b.*, CASE WHEN b.type='hardcover' THEN b.total_copies - COUNT(CASE WHEN l.returned_at IS NULL THEN 1 END) ELSE NULL END AS available_copies
    FROM books b LEFT JOIN leases l ON l.book_id=b.id GROUP BY b.id ORDER BY b.type,b.title
    """)))

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
