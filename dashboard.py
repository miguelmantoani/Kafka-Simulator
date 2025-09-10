from flask import Flask, render_template, jsonify
import requests
import json

app = Flask(__name__)

# Carregar brokers e portas
with open("brokers.json") as f:
    BROKER_DBS = json.load(f)

@app.route("/")
def home():
    return render_template("dashboard.html", brokers=BROKER_DBS)

@app.route("/dashboard/data")
def dashboard_data():
    result = {}
    for broker, info in BROKER_DBS.items():
        port = info["port"]
        try:
            r = requests.get(f"http://localhost:{port}/data", timeout=1)
            result[broker] = {
                "status": "online",
                "port": port,   # <-- adiciona aqui
                "partitions": r.json().get("partitions", []),
                "last_messages": r.json().get("last_messages", [])
            }
        except:
            result[broker] = {"status": "offline", "port": port, "partitions": [], "last_messages": []}
    return jsonify(result)

if __name__ == "__main__":
    app.run(port=5000, debug=True)
