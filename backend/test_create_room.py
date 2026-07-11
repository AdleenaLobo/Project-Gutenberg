from app import app, get_db, TOKENS, run
import json

client = app.test_client()

# Seed a user session
user_email = "reader@library.test"
with app.app_context():
    db = get_db()
    user = db.execute("SELECT id, role FROM users WHERE email=?", (user_email,)).fetchone()
    if not user:
        # Create user
        run("INSERT INTO users (name, email, password, role) VALUES ('Test User', ?, 'reader123', 'user')", (user_email,))
        user = db.execute("SELECT id, role FROM users WHERE email=?", (user_email,)).fetchone()
    
    user_id = user[0]
    token = "test_token_123"
    TOKENS[token] = user_id
    
    # Get a book
    book = db.execute("SELECT id FROM books LIMIT 1").fetchone()
    if not book:
        # Create ebook
        run("INSERT INTO books (title, author, type, total_copies) VALUES ('Test Book', 'Author', 'ebook', 0)")
        book = db.execute("SELECT id FROM books LIMIT 1").fetchone()
    
    book_id = book[0]

print("Simulating POST /api/rooms request...")
headers = {"Authorization": f"Bearer test_token_123"}
resp = client.post("/api/rooms", headers=headers, data=json.dumps({
    "book_id": book_id,
    "name": "Test Reading Room"
}), content_type="application/json")

print("POST Status:", resp.status_code)
print("POST Response:", resp.get_data(as_text=True))

if resp.status_code == 201:
    room_data = json.loads(resp.get_data(as_text=True))
    room_id = room_data["id"]
    
    print("\nSimulating GET /api/rooms/<id> request...")
    resp_get = client.get(f"/api/rooms/{room_id}", headers=headers)
    print("GET Status:", resp_get.status_code)
    print("GET Response:", resp_get.get_data(as_text=True))
