import sqlite3
import os

# Define database file path path
DB_PATH = "library.db"

# Data layout: (title, author, type, total_copies, ebook_source, filepath, summary, cover_image_url, category)
books_to_seed = [
    (
        "Pride and Prejudice", "Jane Austen", "ebook", 5, "Project Gutenberg", "books/pride_and_prejudice.txt",
        "A classic romantic novel of manners exploring the emotional growth of Elizabeth Bennet as she navigates societal pressures, class divisions, and hasty judgments. In her quest for love and independence in Regency-era England, she clashes with the wealthy, proud Mr. Darcy, leading to a timeless struggle between social expectations and personal integrity.",
        "https://covers.openlibrary.org/b/id/14571901-L.jpg", "Fiction"
    ),
    (
        "Frankenstein", "Mary Shelley", "ebook", 5, "Project Gutenberg", "books/frankenstein.txt",
        "The chilling tale of Victor Frankenstein, a brilliant scientist who succeeds in bringing an artificial creature to life, with tragic consequences. As the monster seeks connection but receives only rejection, it embarks on a destructive path of revenge, raising profound philosophical questions about creation, responsibility, and what it truly means to be human.",
        "https://covers.openlibrary.org/b/id/14539129-L.jpg", "Sci-Fi"
    ),
    (
        "Moby Dick", "Herman Melville", "ebook", 5, "Project Gutenberg", "books/moby_dick.txt",
        "Captain Ahab's obsessive and self-destructive pursuit of the legendary white whale that crippled him on a previous voyage. Narrated by the sailor Ishmael, this epic maritime adventure dives deep into themes of obsession, fate, and nature, exploring the crew's dangerous journey aboard the Pequod into the heart of darkness.",
        "https://covers.openlibrary.org/b/id/12534832-L.jpg", "Fiction"
    ),
    (
        "The Great Gatsby", "F. Scott Fitzgerald", "ebook", 5, "Project Gutenberg", "books/great_gatsby.txt",
        "Set in the roaring twenties, the story follows the lavish, mysterious lifestyle of Jay Gatsby and his unyielding obsession with Daisy Buchanan. Narrated by Nick Carraway, the novel exposes the tragic disillusionment of the American Dream amidst jazz, bootlegging, and the moral decadence of high society.",
        "https://covers.openlibrary.org/b/id/12815174-L.jpg", "Fiction"
    ),
    (
        "Alice in Wonderland", "Lewis Carroll", "ebook", 5, "Project Gutenberg", "books/alice_in_wonderland.txt",
        "A young girl named Alice tumbles down a rabbit hole into a surreal, whimsical underground world filled with bizarre logic and talking creatures. In this fantastical dreamscape, she encounters iconic characters like the anxious White Rabbit, the eccentric Mad Hatter, the enigmatic Cheshire Cat, and the tyrannical Queen of Hearts. As Alice navigates through a series of absurd adventures, the novel brilliantly satirizes Victorian culture and parodies contemporary children's literature, creating a masterpiece of literary nonsense.",
        "https://covers.openlibrary.org/b/id/14595240-L.jpg", "Fiction"
    ),
    (
        "Dracula", "Bram Stoker", "ebook", 5, "Project Gutenberg", "books/dracula.txt",
        "The legendary gothic horror novel documenting Count Dracula's attempt to move from Transylvania to England to find fresh blood and spread his curse. Told through letters and diaries, it follows a band of brave companions led by Professor Van Helsing as they fight to destroy the ancient vampire and save humanity from his shadow.",
        "https://covers.openlibrary.org/b/id/14502859-L.jpg", "Mystery"
    ),
    (
        "Sherlock Holmes", "Arthur Conan Doyle", "ebook", 5, "Project Gutenberg", "books/sherlock_holmes.txt",
        "The masterfully structured mysteries and deductions of London's finest consulting detective alongside his trusted companion, Dr. Watson. From the foggy streets of London to grand English estates, the duo untangle complex crimes using Holmes's unparalleled powers of observation, logical deduction, and forensic science.",
        "https://covers.openlibrary.org/b/id/14418641-L.jpg", "Mystery"
    ),
    (
        "War of the Worlds", "H.G. Wells", "ebook", 5, "Project Gutenberg", "books/war_of_the_worlds.txt",
        "A pioneering science fiction thriller depicting a sudden, highly advanced Martian invasion of Earth and humanity's frantic fight for survival. Featuring towering tripod war machines and deadly heat-rays, the story follows an unnamed narrator navigating a devastated landscape, exploring the vulnerability of human empire and technology.",
        "https://covers.openlibrary.org/b/id/13296222-L.jpg", "Sci-Fi"
    ),
    (
        "Romeo and Juliet", "William Shakespeare", "ebook", 5, "Project Gutenberg", "books/romeo_and_juliet.txt",
        "The timeless tragedy of two young, star-crossed lovers whose ill-fated romance ultimately heals the deep rift between their feuding families of Verona. Defying their parents' ancient grudge, their passionate but brief union ends in heartbreak, serving as the ultimate monument to the power of young love and the cost of hate.",
        "https://covers.openlibrary.org/b/id/14498328-L.jpg", "Fiction"
    ),
    (
        "The Metamorphosis", "Franz Kafka", "ebook", 5, "Project Gutenberg", "books/metamorphosis.txt",
        "Gregor Samsa wakes up one morning to find himself inexplicably transformed into a monstrous, giant insect, upending his isolated family dynamics. Struggling to adapt to his new physical reality, Gregor experiences profound alienation and rejection, reflecting existential themes of guilt, absurdity, and the burden of societal expectations.",
        "https://covers.openlibrary.org/b/id/12838977-L.jpg", "Fiction"
    ),
    # ── Hardcovers (Skipping local text parsing loops) ──
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
]

def run_seed():
    database_url = os.environ.get("DATABASE_URL")
    
    has_postgres = False
    if database_url:
        try:
            import psycopg2
            has_postgres = True
        except ImportError:
            print("Warning: DATABASE_URL is set but psycopg2 is not installed. Falling back to SQLite.")

    if has_postgres:
        conn = psycopg2.connect(database_url)
        cur = conn.cursor()
        
        cur.execute("""
            CREATE TABLE IF NOT EXISTS books (
                id SERIAL PRIMARY KEY,
                title TEXT NOT NULL,
                author TEXT NOT NULL,
                type TEXT NOT NULL CHECK (type IN ('hardcover','ebook')),
                total_copies INTEGER NOT NULL DEFAULT 0,
                ebook_source TEXT,
                ebook_text TEXT,
                summary TEXT,
                cover_image_url TEXT,
                category TEXT
            )
        """)
        placeholder = "%s"
    else:
        conn = sqlite3.connect(DB_PATH)
        cur = conn.cursor()
        
        cur.execute("""
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
            )
        """)
        placeholder = "?"

    # Check if books already exist to avoid foreign key violations and allow idempotent redeploys
    cur.execute("SELECT COUNT(*) FROM books")
    book_count = cur.fetchone()[0]
    
    if book_count > 0:
        print("Database already seeded with books. Skipping seeding to prevent foreign key violations.")
        conn.close()
        return


    for item in books_to_seed:
        title, author, type_, total_copies, ebook_source, filepath, summary, cover_url, category = item
        
        ebook_text = ""
        # Only attempt to read files if it's an ebook and a path is defined
        if type_ == "ebook" and filepath:
            if os.path.exists(filepath):
                with open(filepath, "r", encoding="utf-8", errors="ignore") as f:
                    ebook_text = f.read()
            else:
                print(f" -> Notice: Text file missing at {filepath}. Seeding without text body contents.")

        cur.execute(f"""
            INSERT INTO books (title, author, type, total_copies, ebook_source, ebook_text, summary, cover_image_url, category)
            VALUES ({", ".join([placeholder] * 9)})
        """, (title, author, type_, total_copies, ebook_source, ebook_text, summary, cover_url, category))
        print(f"Inserted: {title} ({type_}) ── Type Tag: [{category}]")

    conn.commit()
    conn.close()
    print("\nDatabase seeded successfully with images, categories, and summaries!")

if __name__ == "__main__":
    run_seed()