import sqlite3

def main():
    conn = sqlite3.connect('library.db')
    cur = conn.cursor()
    summary_text = (
        "A young girl named Alice tumbles down a rabbit hole into a surreal, whimsical "
        "underground world filled with bizarre logic and talking creatures. In this "
        "fantastical dreamscape, she encounters iconic characters like the anxious White "
        "Rabbit, the eccentric Mad Hatter, the enigmatic Cheshire Cat, and the tyrannical "
        "Queen of Hearts. As Alice navigates through a series of absurd adventures, the "
        "novel brilliantly satirizes Victorian culture and parodies contemporary children's "
        "literature, creating a masterpiece of literary nonsense."
    )
    cur.execute("UPDATE books SET summary = ? WHERE title = ?", (summary_text, "Alice in Wonderland"))
    conn.commit()
    conn.close()
    print("Database updated successfully.")

if __name__ == '__main__':
    main()
