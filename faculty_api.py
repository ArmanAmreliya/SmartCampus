from fastapi import FastAPI
import sqlite3

app = FastAPI()
DB_FILE = "faculty.db"

def get_db_connection():
    conn = sqlite3.connect(DB_FILE)
    conn.row_factory = sqlite3.Row
    return conn

@app.get("/faculty/{name}")
def get_faculty_status(name: str):
    conn = get_db_connection()
    cursor = conn.cursor()

    cursor.execute("SELECT status FROM faculty_status WHERE name = ?", (name,))
    row = cursor.fetchone()
    conn.close()

    if row:
        return {"name": name, "status": row["status"]}
    else:
        return {"error": "Faculty not found"}
