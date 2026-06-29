# seed_books.py
import sqlite3

books = [
    ("Pride and Prejudice", "Jane Austen", "ebook", 5, "Project Gutenberg", "books/pride_and_prejudice.txt"),
    ("Frankenstein", "Mary Shelley", "ebook", 5, "Project Gutenberg", "books/frankenstein.txt"),
    ("Moby Dick", "Herman Melville", "ebook", 5, "Project Gutenberg", "books/moby_dick.txt"),
    ("The Great Gatsby", "F. Scott Fitzgerald", "ebook", 5, "Project Gutenberg", "books/great_gatsby.txt"),
    ("Alice in Wonderland", "Lewis Carroll", "ebook", 5, "Project Gutenberg", "books/alice_in_wonderland.txt"),
    ("Dracula", "Bram Stoker", "ebook", 5, "Project Gutenberg", "books/dracula.txt"),
    ("Sherlock Holmes", "Arthur Conan Doyle", "ebook", 5, "Project Gutenberg", "books/sherlock_holmes.txt"),
    ("War of the Worlds", "H.G. Wells", "ebook", 5, "Project Gutenberg", "books/war_of_the_worlds.txt"),
    ("Romeo and Juliet", "William Shakespeare", "ebook", 5, "Project Gutenberg", "books/romeo_and_juliet.txt"),
    ("The Metamorphosis", "Franz Kafka", "ebook", 5, "Project Gutenberg", "books/metamorphosis.txt"),
]

conn = sqlite3.connect("library.db")
cur = conn.cursor()

for title, author, type_, total_copies, ebook_source, filepath in books:
    with open(filepath, "r", encoding="utf-8", errors="ignore") as f:
        ebook_text = f.read()
    cur.execute("""
        INSERT INTO books (title, author, type, total_copies, ebook_source, ebook_text)
        VALUES (?, ?, ?, ?, ?, ?)
    """, (title, author, type_, total_copies, ebook_source, ebook_text))
    print(f"Inserted: {title}")

conn.commit()
conn.close()
print("Done!")