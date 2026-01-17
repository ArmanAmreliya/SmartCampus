import sqlite3

conn = sqlite3.connect("faculty.db")
cursor = conn.cursor()

cursor.execute("""
CREATE TABLE IF NOT EXISTS faculty_status (
    name TEXT PRIMARY KEY,
    status TEXT
)
""")

# Clear old data (safety)
cursor.execute("DELETE FROM faculty_status")

# Insert your faculty data
faculty_data = {
    "Maitrik Shah": "Available",
    "Chirag thakar": "Busy",
    "Hetal Pandya": "On Leave"
}

for name, status in faculty_data.items():
    cursor.execute(
        "INSERT INTO faculty_status (name, status) VALUES (?, ?)",
        (name, status)
    )

conn.commit()
conn.close()

print("Faculty database created successfully!")

