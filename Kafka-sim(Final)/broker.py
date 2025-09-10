from flask import Flask, request, render_template, redirect, url_for, jsonify
import sqlite3, os, sys, json

app = Flask(__name__)

DB_FILE = None

# -------------------- Banco de Dados --------------------
def insert_message(db_file, topic, partition, message):
    conn = sqlite3.connect(db_file)
    cursor = conn.cursor()
    cursor.execute(
        "INSERT INTO messages (topic, partition, message) VALUES (?, ?, ?)",
        (topic, partition, message)
    )
    conn.commit()
    conn.close()

def get_messages(db_file, topic=None, partition=None):
    conn = sqlite3.connect(db_file)
    cursor = conn.cursor()
    query = "SELECT id, topic, partition, message, timestamp FROM messages"
    filters, values = [], []
    if topic:
        filters.append("topic=?")
        values.append(topic)
    if partition:
        filters.append("partition=?")
        values.append(partition)
    if filters:
        query += " WHERE " + " AND ".join(filters)
    query += " ORDER BY id DESC"
    cursor.execute(query, values)
    rows = cursor.fetchall()
    conn.close()
    return rows

def get_stats(db_file):
    conn = sqlite3.connect(db_file)
    cursor = conn.cursor()
    cursor.execute("SELECT topic, partition, COUNT(*) FROM messages GROUP BY topic, partition")
    partitions = cursor.fetchall()
    cursor.execute("SELECT topic, partition, message, timestamp FROM messages ORDER BY id DESC LIMIT 5")
    last_msgs = cursor.fetchall()
    conn.close()
    return {"partitions": partitions, "last_messages": last_msgs}

# -------------------- Rotas --------------------
@app.route("/")
def index():
    return render_template("index.html")

@app.route("/publish", methods=["POST"])
def publish():
    topic = request.form.get("topic")
    partition = request.form.get("partition")
    message = request.form.get("message")
    if topic and partition and message:
        insert_message(DB_FILE, topic, int(partition), message)
    return redirect(url_for("index"))

@app.route("/messages")
def messages():
    topic = request.args.get("topic")
    partition = request.args.get("partition")
    msgs = get_messages(DB_FILE, topic, partition)
    return render_template("messages.html", messages=msgs)

@app.route("/data")
def data():
    stats = get_stats(DB_FILE)
    return jsonify({
        "status": "online",
        "partitions": stats["partitions"],
        "last_messages": stats["last_messages"]
    })

# -------------------- Main --------------------
if __name__ == "__main__":
    if len(sys.argv) < 3:
        print("Uso: python app.py <porta> <arquivo_db>")
        sys.exit(1)

    port = int(sys.argv[1])
    DB_FILE = sys.argv[2]

    if not os.path.exists(DB_FILE):
        from init_db import init_db
        init_db(DB_FILE)

    print(f"[INFO] Broker rodando na porta {port} usando DB {DB_FILE}")
    app.run(host="0.0.0.0", port=port, debug=True)
