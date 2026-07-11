import sqlite3
import os

DB_PATH = os.environ.get("DB_PATH", "library.db")
print("DB_PATH:", DB_PATH)
try:
    conn = sqlite3.connect(DB_PATH)
    cursor = conn.cursor()
    cursor.execute("SELECT name FROM sqlite_master WHERE type='table';")
    tables = cursor.fetchall()
    print("Tables:", [t[0] for t in tables])
    
    cursor.execute("SELECT * FROM reading_rooms;")
    rooms = cursor.fetchall()
    print("Rooms count:", len(rooms))
    print("Rooms:", rooms[:5])
    
    cursor.execute("SELECT * FROM room_members;")
    members = cursor.fetchall()
    print("Members count:", len(members))
    print("Members:", members[:5])
    
except Exception as e:
    print("Error:", e)
