import sqlite3
import sys
import os

def init_db(db_file):
    """Cria o banco de dados e tabela se não existir"""
    conn = sqlite3.connect(db_file)
    cursor = conn.cursor()
    cursor.execute("""
        CREATE TABLE IF NOT EXISTS messages (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            topic TEXT NOT NULL,
            partition INTEGER NOT NULL,
            message TEXT NOT NULL,
            timestamp DATETIME DEFAULT CURRENT_TIMESTAMP
        )
    """)
    conn.commit()
    conn.close()
    print(f"[INFO] Banco inicializado: {db_file}")

# Permite rodar direto pelo terminal: python init-db.py meu_banco.db
if __name__ == "__main__":
    if len(sys.argv) < 2:
        print("Uso: python init-db.py <arquivo_db>")
        sys.exit(1)

    db_file = sys.argv[1]
    if os.path.exists(db_file):
        print(f"[INFO] Banco {db_file} já existe")
    else:
        init_db(db_file)
